import type { Browser, Page } from "playwright-core";

import { Patient } from "@/types/patient";
import { renderReportHtml } from "./report-html";

/**
 * Number of concurrent PDF pages.
 *
 * Vercel/serverless functions have more limited memory,
 * so use a smaller concurrency in production.
 */
export const PDF_CONCURRENCY = process.env.VERCEL === "1" ? 3 : 5;

/**
 * Launch Playwright browser.
 *
 * Local:
 *   Uses the normal Playwright Chromium installation.
 *
 * Vercel:
 *   Uses playwright-core + @sparticuz/chromium.
 */
async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL === "1") {
    const [{ chromium: playwrightChromium }, chromium] = await Promise.all([
      import("playwright-core"),
      import("@sparticuz/chromium"),
    ]);

    return playwrightChromium.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }

  const { chromium } = await import("playwright");

  return chromium.launch({
    headless: true,
  });
}

/**
 * Generate a single PDF for a patient using an existing Playwright page.
 */
export async function generatePdfForPatient(
  page: Page,
  patient: Patient,
): Promise<Buffer> {
  const html = renderReportHtml(patient);

  await page.setContent(html, {
    waitUntil: "load",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
    },
  });

  return Buffer.from(pdfBuffer);
}

/**
 * Generate PDFs for all patients with controlled concurrency.
 *
 * Calls onProgress after every patient completes,
 * whether successful or failed.
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
  }) => void,
): Promise<void> {
  let browser: Browser | null = null;

  try {
    browser = await launchBrowser();

    const context = await browser.newContext();

    /**
     * Create a pool of pages.
     */
    const pages: Page[] = [];

    for (let i = 0; i < PDF_CONCURRENCY; i++) {
      pages.push(await context.newPage());
    }

    /**
     * Shared index used by workers.
     *
     * JavaScript runs this synchronously until the first await,
     * so each worker gets a unique index.
     */
    let nextIndex = 0;

    async function processWithPage(page: Page): Promise<void> {
      while (true) {
        const idx = nextIndex++;

        if (idx >= patients.length) {
          return;
        }

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

    /**
     * Run all workers concurrently.
     */
    await Promise.all(pages.map((page) => processWithPage(page)));

    /**
     * Close pages.
     */
    await Promise.all(
      pages.map(async (page) => {
        try {
          await page.close();
        } catch {
          // Ignore page cleanup errors
        }
      }),
    );

    await context.close();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
