import { NextRequest } from "next/server";
import { Patient, PatientSchema } from "@/types/patient";
import { generateAllPdfs } from "@/lib/pdf";
import { createZip, makePdfFilename } from "@/lib/zip";
import { z } from "zod";

export const runtime = "nodejs";

// Validate the request body as an array of patients
const RequestSchema = z
  .array(PatientSchema)
  .min(1, "At least one patient is required");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate all patients
    const parseResult = RequestSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        {
          error: "Invalid patient data",
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 },
      );
    }

    const patients: Patient[] = parseResult.data;

    // Use a TransformStream to stream NDJSON progress, then the ZIP
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start the generation in the background
    (async () => {
      const pdfEntries: { filename: string; buffer: Buffer }[] = [];
      const failures: {
        patientId: string;
        patientName: string;
        error: string;
      }[] = [];
      let generated = 0;
      let failed = 0;

      try {
        await generateAllPdfs(patients, (result) => {
          if (result.success && result.pdfBuffer) {
            generated++;
            pdfEntries.push({
              filename: makePdfFilename(result.patientId, result.patientName),
              buffer: result.pdfBuffer,
            });
          } else {
            failed++;
            failures.push({
              patientId: result.patientId,
              patientName: result.patientName,
              error: result.error || "Unknown error",
            });
          }

          // Stream progress line
          const progress = {
            type: "progress",
            generated,
            failed,
            total: patients.length,
            current: generated + failed,
            patientId: result.patientId,
            success: result.success,
          };
          writer.write(encoder.encode(JSON.stringify(progress) + "\n"));
        });

        // Generate ZIP from all successful PDFs
        if (pdfEntries.length > 0) {
          const zipBuffer = await createZip(pdfEntries);
          const base64Zip = zipBuffer.toString("base64");

          const complete = {
            type: "complete",
            generated,
            failed,
            total: patients.length,
            failures,
            zipBase64: base64Zip,
          };
          writer.write(encoder.encode(JSON.stringify(complete) + "\n"));
        } else {
          const complete = {
            type: "complete",
            generated: 0,
            failed,
            total: patients.length,
            failures,
            error: "No PDFs were generated successfully.",
          };
          writer.write(encoder.encode(JSON.stringify(complete) + "\n"));
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        const errorLine = {
          type: "error",
          error: `Generation failed: ${errorMsg}`,
        };
        writer.write(encoder.encode(JSON.stringify(errorLine) + "\n"));
      } finally {
        writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: `Server error: ${errorMsg}` },
      { status: 500 },
    );
  }
}
