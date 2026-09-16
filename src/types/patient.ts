import { z } from "zod";

// ─── Zod Schema (single source of truth) ───────────────────────────
// Patient information + all lab result fields that appear in the report.
// The report components read these fields directly from the Patient object.

export const PatientSchema = z.object({
  // ── Patient Info (left column) ──
  name: z
    .string({ error: "Patient name is required and must be a string" })
    .min(1, "Patient name cannot be empty"),
  age: z.union([
    z
      .number({ error: "Age must be a number or string" })
      .int("Age must be a whole number")
      .min(0, "Age cannot be negative")
      .max(150, "Age seems unrealistic"),
    z
      .string({ error: "Age must be a number or string" })
      .min(1, "Age cannot be empty"),
  ]),
  gender: z
    .string({ error: "Gender is required and must be a string" })
    .min(1, "Gender cannot be empty"),
  date: z
    .string({ error: "Date is required and must be a string" })
    .min(1, "Date cannot be empty"),

  // ── Patient Info (middle column) ──
  patientId: z
    .string({ error: "Patient ID (REG.NO) is required and must be a string" })
    .min(1, "Patient ID cannot be empty"),
  accessionNo: z.string().optional(),
  billIpdNo: z.string().optional(),

  // ── Patient Info (right column) ──
  opdIpd: z.string().optional(),
  department: z.string().optional(),
  doctorName: z.string().optional(),
  location: z.string().optional(),

  // ── Haematology Results ──
  wbc: z.union([z.string(), z.number()]).optional(),
  neutrophils: z.union([z.string(), z.number()]).optional(),
  lymphocytes: z.union([z.string(), z.number()]).optional(),
  monocytes: z.union([z.string(), z.number()]).optional(),
  eosinophils: z.union([z.string(), z.number()]).optional(),
  basophils: z.union([z.string(), z.number()]).optional(),
  rbcCount: z.union([z.string(), z.number()]).optional(),
  hb: z.union([z.string(), z.number()]).optional(),
  hct: z.union([z.string(), z.number()]).optional(),
  mcv: z.union([z.string(), z.number()]).optional(),
  mch: z.union([z.string(), z.number()]).optional(),
  mchc: z.union([z.string(), z.number()]).optional(),
  rdwCv: z.union([z.string(), z.number()]).optional(),
  plateletCount: z.union([z.string(), z.number()]).optional(),
  mpv: z.union([z.string(), z.number()]).optional(),

  // ── Serology ──
  hbsag: z.string().optional(),
});

export type Patient = z.infer<typeof PatientSchema>;

// ─── Excel Column Mapping ──────────────────────────────────────────
// Maps Excel header names (lowercase) → Patient field names.
// Edit this object if your Excel column names differ.

export const EXCEL_COLUMN_MAP: Record<string, keyof Patient> = {
  // Patient info
  patient_name: "name",
  patient_id: "patientId",
  age: "age",
  gender: "gender",
  date: "date",
  accession_no: "accessionNo",
  bill_ipd_no: "billIpdNo",
  opd_ipd: "opdIpd",
  department: "department",
  doctor_name: "doctorName",
  location: "location",

  // Haematology results
  wbc: "wbc",
  neutrophils: "neutrophils",
  lymphocytes: "lymphocytes",
  monocytes: "monocytes",
  eosinophils: "eosinophils",
  basophils: "basophils",
  rbc_count: "rbcCount",
  hb: "hb",
  hct: "hct",
  mcv: "mcv",
  mch: "mch",
  mchc: "mchc",
  rdw_cv: "rdwCv",
  platelet_count: "plateletCount",
  mpv: "mpv",

  // Serology
  hbsag: "hbsag",
};

// ─── Required Excel Columns ────────────────────────────────────────
// Only the fields that must be present in every row.

export const REQUIRED_EXCEL_COLUMNS = [
  "patient_name",
  "patient_id",
  "age",
  "gender",
  "date",
];

// ─── Optional Excel Columns ────────────────────────────────────────

export const OPTIONAL_EXCEL_COLUMNS = [
  "accession_no",
  "bill_ipd_no",
  "opd_ipd",
  "department",
  "doctor_name",
  "location",
  "wbc",
  "neutrophils",
  "lymphocytes",
  "monocytes",
  "eosinophils",
  "basophils",
  "rbc_count",
  "hb",
  "hct",
  "mcv",
  "mch",
  "mchc",
  "rdw_cv",
  "platelet_count",
  "mpv",
  "hbsag",
];

// ─── Default Report Values ─────────────────────────────────────────

export const DEFAULT_PATIENT_VALUES = {
  opdIpd: "OPD",
  department: "GENERAL MEDICINE",
  location: "/",
};

// ─── Lab Test Reference Ranges ─────────────────────────────────────

export interface TestReference {
  testName: string;
  unit: string;
  referenceRange: string;
}

export const TEST_REFERENCES: TestReference[] = [
  { testName: "WBC", unit: "x10^3cells/cumm", referenceRange: "4.0 - 11.0" },
  { testName: "Neutrophils", unit: "%", referenceRange: "40-70" },
  { testName: "Lymphocytes", unit: "%", referenceRange: "25-45" },
  { testName: "Monocytes", unit: "%", referenceRange: "2 - 8" },
  { testName: "Eosinophils", unit: "%", referenceRange: "1 - 6" },
  { testName: "Basophils", unit: "%", referenceRange: "0-1" },
  { testName: "RBC COUNT", unit: "millions/cu.mm", referenceRange: "4 - 5.5" },
  { testName: "HB", unit: "g/dl", referenceRange: "11.00-16.50" },
  { testName: "HCT", unit: "%", referenceRange: "35-45" },
  { testName: "MCV", unit: "fL", referenceRange: "75 - 95" },
  { testName: "MCH", unit: "pg", referenceRange: "26 - 30" },
  { testName: "MCHC", unit: "gm/dl", referenceRange: "32 -36" },
  { testName: "RDW-CV", unit: "%", referenceRange: "10-15" },
  { testName: "Platelet Count", unit: "x10^3cells/uL", referenceRange: "150-400" },
  { testName: "MPV", unit: "fl", referenceRange: "7.5-12" },
];
