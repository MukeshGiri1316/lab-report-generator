"use client";

import React, { useCallback, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  REQUIRED_EXCEL_COLUMNS,
  EXCEL_COLUMN_MAP,
  Patient,
} from "@/types/patient";
import { validatePatients, ValidationError } from "@/lib/validation";

interface UploadBoxProps {
  onValidated: (patients: Patient[]) => void;
}

export default function UploadBox({ onValidated }: UploadBoxProps) {
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [summary, setSummary] = useState<{
    total: number;
    valid: number;
    invalid: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setValidationErrors([]);
      setSummary(null);

      // Check file type
      const ext = file.name.toLowerCase().split(".").pop();
      if (ext !== "xlsx" && ext !== "csv") {
        setError("Unsupported file type. Please upload .xlsx or .csv files.");
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });

        if (workbook.SheetNames.length === 0) {
          setError("The uploaded file contains no sheets.");
          return;
        }

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: "",
        });

        if (rows.length === 0) {
          setError(
            "The uploaded file is empty. Please add patient data rows."
          );
          return;
        }

        // Check for required columns
        const headers = Object.keys(rows[0]);
        const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());
        const missingColumns = REQUIRED_EXCEL_COLUMNS.filter(
          (col) => !normalizedHeaders.includes(col.toLowerCase())
        );

        if (missingColumns.length > 0) {
          setError(
            `Missing required columns: ${missingColumns.join(", ")}. ` +
              `Expected: ${REQUIRED_EXCEL_COLUMNS.join(", ")}`
          );
          return;
        }

        // Normalize header keys
        const normalizedRows = rows.map((row) => {
          const normalized: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(row)) {
            normalized[key.trim().toLowerCase()] = value;
          }
          return normalized;
        });

        // Validate
        const result = validatePatients(normalizedRows);

        setSummary({
          total: normalizedRows.length,
          valid: result.valid.length,
          invalid: result.errors.length,
        });

        if (result.errors.length > 0) {
          setValidationErrors(result.errors);
        }

        if (result.valid.length > 0 && result.errors.length === 0) {
          onValidated(result.valid);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process file."
        );
      }
    },
    [onValidated]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Download template button */}
      <div className="mb-4">
        <a
          href="/api/sample-template"
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 text-sm hover:bg-gray-200 transition-colors"
        >
          📥 Download Sample Template
        </a>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-4xl mb-3">📄</div>
        <p className="text-gray-600 font-medium">
          Drop your .xlsx or .csv file here
        </p>
        <p className="text-gray-400 text-sm mt-1">or click to browse</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
          <p>
            <strong>{summary.total}</strong> patients uploaded
          </p>
          <p className="text-green-700">
            ✅ <strong>{summary.valid}</strong> valid
          </p>
          {summary.invalid > 0 && (
            <p className="text-red-700">
              ❌ <strong>{summary.invalid}</strong> invalid
            </p>
          )}
        </div>
      )}

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
          <p className="font-medium text-red-800 mb-2">
            Please fix these errors and upload again:
          </p>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {validationErrors.map((ve) => (
              <div key={ve.row} className="text-red-700">
                <strong>Row {ve.row}:</strong> {ve.messages.join("; ")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
