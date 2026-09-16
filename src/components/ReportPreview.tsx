"use client";

import React, { useState } from "react";
import { Patient } from "@/types/patient";
import LabReport from "./report/LabReport";

interface ReportPreviewProps {
  patients: Patient[];
  onGenerate: () => void;
  onBack: () => void;
}

export default function ReportPreview({
  patients,
  onGenerate,
  onBack,
}: ReportPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const patient = patients[currentIndex];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
        >
          ← Back to Data
        </button>
        <span className="text-sm text-gray-600">
          Patient {currentIndex + 1} of {patients.length}
        </span>
        <button
          onClick={onGenerate}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Generate All Reports →
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 justify-center mb-4">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(patients.length - 1, i + 1))
          }
          disabled={currentIndex === patients.length - 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      {/* Report preview */}
      <div className="border border-gray-300 rounded shadow-sm overflow-auto bg-white mx-auto"
           style={{ maxHeight: "80vh" }}>
        <div className="mx-auto" style={{ width: "210mm" }}>
          <LabReport patient={patient} />
        </div>
      </div>
    </div>
  );
}
