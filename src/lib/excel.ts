import * as XLSX from "xlsx";
import { REQUIRED_EXCEL_COLUMNS, OPTIONAL_EXCEL_COLUMNS, EXCEL_COLUMN_MAP } from "@/types/patient";

/**
 * Parse an Excel (.xlsx) or CSV (.csv) file buffer into an array of raw row objects.
 * Throws a descriptive error if the file is empty or missing required columns.
 */
export function parseExcelFile(
  buffer: ArrayBuffer,
  fileName: string
): Record<string, unknown>[] {
  const ext = fileName.toLowerCase().split(".").pop();
  if (ext !== "xlsx" && ext !== "csv") {
    throw new Error(
      `Unsupported file type: .${ext}. Please upload .xlsx or .csv files.`
    );
  }

  const workbook = XLSX.read(buffer, { type: "array" });

  if (workbook.SheetNames.length === 0) {
    throw new Error("The uploaded file contains no sheets.");
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  if (rows.length === 0) {
    throw new Error(
      "The uploaded file is empty. Please add patient data rows."
    );
  }

  // Check for required columns
  const headers = Object.keys(rows[0]);
  const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());
  const missingColumns = REQUIRED_EXCEL_COLUMNS.filter(
    (col) => !normalizedHeaders.includes(col.toLowerCase())
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Missing required columns: ${missingColumns.join(", ")}. ` +
        `Expected columns: ${REQUIRED_EXCEL_COLUMNS.join(", ")}`
    );
  }

  // Normalize header keys to lowercase
  return rows.map((row) => {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      normalized[key.trim().toLowerCase()] = value;
    }
    return normalized;
  });
}

/**
 * Generate a sample Excel template (.xlsx) as a Buffer.
 * Contains ALL columns (required + optional) with 2 example rows.
 */
export function generateSampleTemplate(): Buffer {
  // All columns in the order they appear in the report
  const allColumns = [...REQUIRED_EXCEL_COLUMNS, ...OPTIONAL_EXCEL_COLUMNS];

  const sampleRows = [
    {
      // Required
      patient_name: "Ram Kumar",
      patient_id: "P001",
      age: 42,
      gender: "Male",
      date: "2025-01-15",
      // Optional - Patient Info
      accession_no: "ACC-001",
      bill_ipd_no: "BILL-001",
      opd_ipd: "OPD",
      department: "GENERAL MEDICINE",
      doctor_name: "Dr. Sharma",
      location: "/",
      // Haematology
      wbc: 7.2,
      neutrophils: 55,
      lymphocytes: 32,
      monocytes: 5,
      eosinophils: 3,
      basophils: 0,
      rbc_count: 4.8,
      hb: 14.5,
      hct: 42,
      mcv: 87,
      mch: 28,
      mchc: 34,
      rdw_cv: 12.5,
      platelet_count: 250,
      mpv: 9.5,
      // Serology
      hbsag: "NEGATIVE",
    },
    {
      // Required
      patient_name: "Sita Devi",
      patient_id: "P002",
      age: 35,
      gender: "Female",
      date: "2025-01-15",
      // Optional - Patient Info
      accession_no: "ACC-002",
      bill_ipd_no: "BILL-002",
      opd_ipd: "IPD",
      department: "GENERAL MEDICINE",
      doctor_name: "Dr. Patel",
      location: "/",
      // Haematology
      wbc: 6.1,
      neutrophils: 50,
      lymphocytes: 35,
      monocytes: 4,
      eosinophils: 2,
      basophils: 1,
      rbc_count: 4.2,
      hb: 12.8,
      hct: 38,
      mcv: 85,
      mch: 27,
      mchc: 33,
      rdw_cv: 11.8,
      platelet_count: 310,
      mpv: 8.7,
      // Serology
      hbsag: "NEGATIVE",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows, { header: allColumns });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

  const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return Buffer.from(buf);
}
