"use client";

import React, { useState, useCallback } from "react";
import { Patient } from "@/types/patient";
import UploadBox from "@/components/UploadBox";
import PatientTable from "@/components/PatientTable";
import ReportPreview from "@/components/ReportPreview";
import GenerationProgress from "@/components/GenerationProgress";

type Step = "upload" | "preview" | "report" | "generate";

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [patients, setPatients] = useState<Patient[]>([]);

  const handleValidated = useCallback((validPatients: Patient[]) => {
    setPatients(validPatients);
    setStep("preview");
  }, []);

  const handleReset = useCallback(() => {
    setPatients([]);
    setStep("upload");
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            🏥 Lab Report Generator
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload patient data → Preview reports → Download PDFs
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 text-xs text-gray-500">
          {[
            { key: "upload", label: "Upload" },
            { key: "preview", label: "Data Preview" },
            { key: "report", label: "Report Preview" },
            { key: "generate", label: "Generate" },
          ].map((s, idx) => (
            <React.Fragment key={s.key}>
              {idx > 0 && <span className="text-gray-300">→</span>}
              <span
                className={
                  step === s.key
                    ? "font-semibold text-blue-600"
                    : "text-gray-400"
                }
              >
                {s.label}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Steps */}
        {step === "upload" && <UploadBox onValidated={handleValidated} />}

        {step === "preview" && (
          <div>
            <PatientTable patients={patients} />
            <div className="flex justify-between mt-4 max-w-4xl mx-auto">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
              >
                ← Upload New File
              </button>
              <button
                onClick={() => setStep("report")}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Preview Reports →
              </button>
            </div>
          </div>
        )}

        {step === "report" && (
          <ReportPreview
            patients={patients}
            onGenerate={() => setStep("generate")}
            onBack={() => setStep("preview")}
          />
        )}

        {step === "generate" && (
          <GenerationProgress
            patients={patients}
            onBack={() => setStep("report")}
          />
        )}
      </div>
    </main>
  );
}
