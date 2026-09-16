import { Patient, PatientSchema, EXCEL_COLUMN_MAP } from "@/types/patient";

export interface ValidationError {
  row: number;
  messages: string[];
}

export interface ValidationResult {
  valid: Patient[];
  errors: ValidationError[];
}

/**
 * Validates an array of raw row objects parsed from an Excel/CSV file.
 * Returns validated Patient objects and per-row errors.
 */
export function validatePatients(
  rows: Record<string, unknown>[]
): ValidationResult {
  const valid: Patient[] = [];
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const rowNum = i + 2; // +2 because row 1 is header, data starts at row 2

    // Map Excel column names to Patient field names
    const mapped: Record<string, unknown> = {};
    for (const [excelCol, patientField] of Object.entries(EXCEL_COLUMN_MAP)) {
      const value = raw[excelCol];
      if (value !== undefined && value !== null && value !== "") {
        mapped[patientField] = value;
      }
    }

    // Coerce required string fields
    for (const field of [
      "patientId",
      "name",
      "gender",
      "date",
    ] as const) {
      if (mapped[field] !== undefined) {
        mapped[field] = String(mapped[field]);
      }
    }

    // Coerce optional string fields
    for (const field of [
      "accessionNo",
      "billIpdNo",
      "opdIpd",
      "department",
      "doctorName",
      "location",
      "hbsag",
    ] as const) {
      if (mapped[field] !== undefined) {
        mapped[field] = String(mapped[field]);
      }
    }

    // For numeric/string union fields (lab results), keep them as-is
    // Zod union will accept both number and string

    const result = PatientSchema.safeParse(mapped);

    if (!result.success) {
      const messages = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      errors.push({ row: rowNum, messages });
      continue;
    }

    // Check for duplicate patient IDs
    const pid = result.data.patientId;
    if (seenIds.has(pid)) {
      errors.push({
        row: rowNum,
        messages: [`Duplicate patient ID: "${pid}"`],
      });
      continue;
    }
    seenIds.add(pid);

    valid.push(result.data);
  }

  return { valid, errors };
}
