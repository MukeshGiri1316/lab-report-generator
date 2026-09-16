import JSZip from "jszip";

interface ZipEntry {
  filename: string;
  buffer: Buffer;
}

/**
 * Create a ZIP file from an array of named buffers.
 * Returns the ZIP as a Node.js Buffer.
 */
export async function createZip(entries: ZipEntry[]): Promise<Buffer> {
  const zip = new JSZip();

  for (const entry of entries) {
    zip.file(entry.filename, entry.buffer);
  }

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return zipBuffer;
}

/**
 * Create a safe filename from patient ID and name.
 * Removes special characters that could cause issues in filenames.
 */
export function makePdfFilename(patientId: string, name: string): string {
  const safeName = name.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
  const safeId = patientId.replace(/[^a-zA-Z0-9]/g, "");
  return `${safeId}_${safeName}.pdf`;
}
