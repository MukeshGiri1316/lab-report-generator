import { Patient, DEFAULT_PATIENT_VALUES } from "@/types/patient";
import * as fs from "fs";
import * as path from "path";

/**
 * Render a full HTML document for a patient's lab report.
 * This mirrors the exact same layout as the React report components
 * (Header, PatientInfo, Barcode, ResultsTable/HaematologyAnalysis, Footer).
 *
 * Uses Tailwind-like inline styles to match the report format.
 */
export function renderReportHtml(patient: Patient): string {
  const opdIpd = patient.opdIpd || DEFAULT_PATIENT_VALUES.opdIpd;
  const department = patient.department || DEFAULT_PATIENT_VALUES.department;
  const location = patient.location || DEFAULT_PATIENT_VALUES.location;
  const hbsag = patient.hbsag || "NEGATIVE";

  // Read images and embed as base64 data URIs
  const headerImgBase64 = readImageAsBase64("public/report-images/image1.jpeg");
  const barcode1Base64 = readImageAsBase64("public/report-images/image2.png");
  const barcode2Base64 = readImageAsBase64("public/report-images/image3.png");
  const sign1Base64 = readImageAsBase64("public/report-images/image4.png");
  const sign2Base64 = readImageAsBase64("public/report-images/image5.png");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lab Report - ${esc(patient.name)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      line-height: 1.15;
      color: #000;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page { size: A4; margin: 0; }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 8mm 12mm 5mm 12mm;
      background: #fff;
      display: flex;
      flex-direction: column;
    }

    /* Header image */
    .report-header img { width: 100%; display: block; }

    /* Patient Info grid */
    .pi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; width: 100%; border: 1px solid #000; margin: 2mm 0; }
    .pi-col { padding: 2.5mm; }
    .pi-col-left, .pi-col-mid { border-right: 1px solid #000; }
    .pi-row { display: grid; grid-template-columns: 30mm 5mm 1fr; min-height: 6.5mm; align-items: center; }
    .pi-row-sm { display: grid; grid-template-columns: 30mm 5mm 1fr; min-height: 5.5mm; align-items: center; }
    .pi-row-tall { display: grid; grid-template-columns: 30mm 5mm 1fr; min-height: 7mm; align-items: start; }
    .pi-label { font-weight: bold; }
    .pi-colon { text-align: center; }

    /* Barcode */
    .barcode-row { display: flex; justify-content: space-between; align-items: center; margin: 3mm 0; }
    .barcode-row img { max-height: 14mm; }

    /* Tables */
    .section-title {
      display: flex; height: 5.5mm; align-items: center; justify-content: center;
      border-top: 1px solid #000; border-bottom: 1px solid #000;
      font-size: 11pt; font-weight: bold; font-style: italic;
    }
    .results-table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 9pt; }
    .results-table th { border-bottom: 1px solid #000; padding: 1mm; font-weight: bold; height: 7mm; }
    .results-table td { padding: 1mm; height: 5.8mm; }
    .results-table th.border-r, .results-table td.border-r { border-right: 1px solid #000; }
    .border-x { border-left: 1px solid #000; border-right: 1px solid #000; }

    /* Serology table */
    .serology-table { width: 100%; table-layout: fixed; border-bottom: 1px solid #000; }
    .serology-table th { border-bottom: 1px solid #000; padding: 1mm; font-weight: bold; height: 7mm; }
    .serology-table td { padding: 1mm; height: 7mm; }
    .serology-table th.border-r { border-right: 1px solid #000; }

    /* Footer */
    .signatures { display: flex; justify-content: flex-end; padding-top: 8mm; }
    .sig-block { width: 30mm; text-align: center; }
    .sig-block img { width: 100%; }
    .sig-spacer { width: 12mm; }
    .disclaimer {
      display: flex; justify-content: center; padding-top: 5mm; padding-bottom: 2mm;
    }
    .disclaimer-text {
      border-bottom: 1px solid #000; padding: 0 1mm 1mm; text-align: center;
      font-size: 11pt; font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- HEADER -->
    <div class="report-header">
      <img src="${headerImgBase64}" alt="Hospital Header" />
    </div>

    <!-- PATIENT INFO -->
    <div class="pi-grid">
      <!-- LEFT COLUMN -->
      <div class="pi-col pi-col-left">
        <div class="pi-row">
          <span class="pi-label">NAME</span>
          <span class="pi-colon">:</span>
          <span>${esc(patient.name)}</span>
        </div>
        <div class="pi-row">
          <span class="pi-label">AGE/SEX</span>
          <span class="pi-colon">:</span>
          <span>${esc(String(patient.age))}${patient.gender ? "/" + esc(patient.gender) : ""}</span>
        </div>
        <div class="pi-row">
          <span class="pi-label">DATE</span>
          <span class="pi-colon">:</span>
          <span>${esc(patient.date)}</span>
        </div>
      </div>

      <!-- MIDDLE COLUMN -->
      <div class="pi-col pi-col-mid">
        <div class="pi-row">
          <span class="pi-label">REG.NO</span>
          <span class="pi-colon">:</span>
          <span>${esc(patient.patientId)}</span>
        </div>
        <div class="pi-row">
          <span class="pi-label">Accession No</span>
          <span class="pi-colon">:</span>
          <span>${esc(patient.accessionNo || "")}&nbsp;</span>
        </div>
        <div class="pi-row">
          <span class="pi-label">BILL/IPD NO.</span>
          <span class="pi-colon">:</span>
          <span>${esc(patient.billIpdNo || "")}&nbsp;</span>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="pi-col">
        <div class="pi-row-sm">
          <span class="pi-label">OPD/IPD</span>
          <span class="pi-colon">:</span>
          <span>${esc(opdIpd)}</span>
        </div>
        <div class="pi-row-tall">
          <span class="pi-label">DEPARTMENT</span>
          <span class="pi-colon">:</span>
          <span>${esc(department)}</span>
        </div>
        <div class="pi-row-sm">
          <span class="pi-label">CON.DR</span>
          <span class="pi-colon">:</span>
          <span>${esc(patient.doctorName || "")}&nbsp;</span>
        </div>
        <div class="pi-row-sm">
          <span class="pi-label">LOCATION</span>
          <span class="pi-colon">:</span>
          <span>${esc(location)}</span>
        </div>
      </div>
    </div>

    <!-- BARCODE -->
    <div class="barcode-row">
      <img src="${barcode1Base64}" alt="barcode1" />
      <img src="${barcode2Base64}" alt="barcode2" />
    </div>

    <!-- HAEMATOLOGY ANALYSIS REPORT -->
    <div class="border-x">
      <div class="section-title">HAEMATOLOGY ANALYSIS REPORT</div>

      <table class="results-table">
        <colgroup>
          <col style="width:33%" />
          <col style="width:16.5%" />
          <col style="width:16.5%" />
          <col style="width:34%" />
        </colgroup>
        <thead>
          <tr>
            <th class="border-r" style="text-align:left;">Investigations</th>
            <th class="border-r" style="text-align:center;">Result</th>
            <th class="border-r" style="text-align:center;">Unit</th>
            <th style="text-align:center;">Biological Reference Interval</th>
          </tr>
        </thead>
        <tbody>
          ${haemRow("WBC", patient.wbc, "x10^3cells/cumm", "4.0 - 11.0")}
          ${haemRow("Neutrophils", patient.neutrophils, "%", "40 - 70")}
          ${haemRow("Lymphocytes", patient.lymphocytes, "%", "25 - 45")}
          ${haemRow("Monocytes", patient.monocytes, "%", "2 - 8")}
          ${haemRow("Eosinophils", patient.eosinophils, "%", "1 - 6")}
          ${haemRow("Basophils", patient.basophils, "%", "0 - 1")}
          ${haemRow("RBC COUNT", patient.rbcCount, "millions/cu.mm", "4 - 5.5")}
          ${haemRow("HB", patient.hb, "g/dl", "11.00-16.50")}
          ${haemRow("HCT", patient.hct, "%", "35-45")}
          ${haemRow("MCV", patient.mcv, "fL", "75 - 95")}
          ${haemRow("MCH", patient.mch, "pg", "26 - 30")}
          ${haemRow("MCHC", patient.mchc, "gm/dl", "32 - 36")}
          ${haemRow("RDW-CV", patient.rdwCv, "%", "10-15")}
          ${haemRow("Platelet Count", patient.plateletCount, "x10^3cells/uL", "150-400")}
          ${haemRow("MPV", patient.mpv, "fl", "7.5-12")}
        </tbody>
      </table>

      <!-- SEROLOGY -->
      <div class="section-title">SEROLOGY</div>

      <table class="serology-table">
        <colgroup>
          <col style="width:33%" />
          <col style="width:16%" />
          <col style="width:16%" />
          <col style="width:35%" />
        </colgroup>
        <thead>
          <tr>
            <th class="border-r" style="text-align:left;">Investigations</th>
            <th class="border-r" style="text-align:center;">Result</th>
            <th class="border-r" style="text-align:center;">Unit</th>
            <th style="text-align:center;">Biological Reference Interval</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:1mm;">&nbsp;HBSAG</td>
            <td style="padding:1mm;text-align:center;">${esc(hbsag)}</td>
            <td style="padding:1mm;text-align:center;">&nbsp;</td>
            <td style="padding:1mm;text-align:center;">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <footer style="margin-top:auto;width:100%;">
      <div class="signatures">
        <div class="sig-block">
          <img src="${sign1Base64}" alt="sign1" />
        </div>
        <div class="sig-spacer"></div>
        <div class="sig-block">
          <img src="${sign2Base64}" alt="sign2" />
        </div>
      </div>
      <div class="disclaimer">
        <div class="disclaimer-text">NOT VALID FOR MEDICO LEGAL CASES</div>
      </div>
    </footer>

  </div>
</body>
</html>`;
}

/** Generate a haematology table row. */
function haemRow(
  name: string,
  value: string | number | undefined,
  unit: string,
  refRange: string
): string {
  const displayVal = value !== undefined && value !== null && value !== "" ? esc(String(value)) : "&nbsp;";
  return `
          <tr>
            <td style="padding:1mm;">&nbsp;${esc(name)}</td>
            <td style="padding:1mm;text-align:center;">${displayVal}</td>
            <td style="padding:1mm;text-align:center;">${esc(unit)}</td>
            <td style="padding:1mm;text-align:center;">${esc(refRange)}</td>
          </tr>`;
}

/** Escape HTML special characters. */
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Read an image file and return a base64 data URI. */
function readImageAsBase64(relativePath: string): string {
  try {
    const absolutePath = path.join(process.cwd(), "public", relativePath.replace(/^public[\\/]/, ""));
    const buffer = fs.readFileSync(absolutePath);
    const ext = relativePath.split(".").pop()?.toLowerCase();
    const mime =
      ext === "jpeg" || ext === "jpg"
        ? "image/jpeg"
        : ext === "png"
        ? "image/png"
        : "image/png";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    // If image not found, return empty string — the report will still render without it
    return "";
  }
}
