import { NextResponse } from "next/server";
import { generateSampleTemplate } from "@/lib/excel";

export async function GET() {
  try {
    const buffer = generateSampleTemplate();
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="sample_patient_template.xlsx"',
      },
    });
  } catch (error) {
    console.error("Failed to generate sample template:", error);
    return NextResponse.json(
      { error: "Failed to generate sample template" },
      { status: 500 }
    );
  }
}
