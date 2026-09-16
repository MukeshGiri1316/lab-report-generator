import { chromium, Browser, Page } from "playwright";
import { Patient } from "@/types/patient";
import { renderReportHtml } from "./report-html";

/** Number of concurrent Playwright pages for PDF generation. */
export const PDF_CONCURRENCY = 5;

/**
 * Generate a single PDF for a patient using an existing Playwright page.
 * The page is reused across calls to avoid creating new contexts.
 */
export async function generatePdfForPatient(
  page: Page,
  patient: Patient
): Promise<Buffer> {
  const html = renderReportHtml(patient);
  await page.setContent(html, { waitUntil: "load" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });
  return Buffer.from(pdfBuffer);
}

/**
 * Generate PDFs for a list of patients with controlled concurrency.
 * Calls `onProgress` after each patient completes (success or failure).
 */
export async function generateAllPdfs(
  patients: Patient[],
  onProgress: (result: {
    index: number;
    patientId: string;
    patientName: string;
    success: boolean;
    error?: string;
    pdfBuffer?: Buffer;
  }) => void
): Promise<void> {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    // Create a pool of pages
    const pages: Page[] = [];
    for (let i = 0; i < PDF_CONCURRENCY; i++) {
      pages.push(await context.newPage());
    }

    // Process patients in batches using the page pool
    let nextIndex = 0;

    async function processWithPage(page: Page): Promise<void> {
      while (nextIndex < patients.length) {
        const idx = nextIndex++;
        const patient = patients[idx];
        try {
          const pdfBuffer = await generatePdfForPatient(page, patient);
          onProgress({
            index: idx,
            patientId: patient.patientId,
            patientName: patient.name,
            success: true,
            pdfBuffer,
          });
        } catch (err) {
          onProgress({
            index: idx,
            patientId: patient.patientId,
            patientName: patient.name,
            success: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    // Run all page workers concurrently
    await Promise.all(pages.map((page) => processWithPage(page)));

    // Cleanup pages
    for (const page of pages) {
      await page.close();
    }
    await context.close();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
