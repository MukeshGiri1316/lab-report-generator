"use client";

import React, { useState, useCallback } from "react";
import { Patient } from "@/types/patient";

interface GenerationProgressProps {
  patients: Patient[];
  onBack: () => void;
}

interface ProgressState {
  status: "idle" | "generating" | "complete" | "error";
  generated: number;
  failed: number;
  total: number;
  failures: { patientId: string; patientName: string; error: string }[];
  zipBase64: string | null;
  error: string | null;
}

export default function GenerationProgress({
  patients,
  onBack,
}: GenerationProgressProps) {
  const [progress, setProgress] = useState<ProgressState>({
    status: "idle",
    generated: 0,
    failed: 0,
    total: patients.length,
    failures: [],
    zipBase64: null,
    error: null,
  });

  const startGeneration = useCallback(async () => {
    setProgress({
      status: "generating",
      generated: 0,
      failed: 0,
      total: patients.length,
      failures: [],
      zipBase64: null,
      error: null,
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patients),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);

            if (data.type === "progress") {
              setProgress((prev) => ({
                ...prev,
                generated: data.generated,
                failed: data.failed,
              }));
            } else if (data.type === "complete") {
              setProgress((prev) => ({
                ...prev,
                status: "complete",
                generated: data.generated,
                failed: data.failed,
                failures: data.failures || [],
                zipBase64: data.zipBase64 || null,
                error: data.error || null,
              }));
            } else if (data.type === "error") {
              setProgress((prev) => ({
                ...prev,
                status: "error",
                error: data.error,
              }));
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      setProgress((prev) => ({
        ...prev,
        status: "error",
        error: err instanceof Error ? err.message : "Generation failed",
      }));
    }
  }, [patients]);

  const downloadZip = useCallback(() => {
    if (!progress.zipBase64) return;

    const byteString = atob(progress.zipBase64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lab_reports.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [progress.zipBase64]);

  const percent =
    progress.total > 0
      ? Math.round(
          ((progress.generated + progress.failed) / progress.total) * 100
        )
      : 0;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          disabled={progress.status === "generating"}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded disabled:opacity-40"
        >
          ← Back
        </button>
        <h2 className="text-lg font-semibold">Report Generation</h2>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Start button */}
      {progress.status === "idle" && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Ready to generate {patients.length} reports.
          </p>
          <button
            onClick={startGeneration}
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium"
          >
            Start Generation
          </button>
        </div>
      )}

      {/* Progress */}
      {progress.status === "generating" && (
        <div className="space-y-4">
          <p className="text-center text-gray-700 font-medium">
            Generating reports...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            {progress.generated + progress.failed} / {progress.total}
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-green-700">
              ✅ Generated: {progress.generated}
            </span>
            <span className="text-red-700">
              ❌ Failed: {progress.failed}
            </span>
          </div>
        </div>
      )}

      {/* Complete */}
      {progress.status === "complete" && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="font-medium text-gray-800">Generation Complete</p>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-green-700">
              Generated: {progress.generated}
            </span>
            <span className="text-red-700">Failed: {progress.failed}</span>
          </div>

          {/* Failures list */}
          {progress.failures.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
              <p className="font-medium text-red-800 mb-2">
                Failed reports:
              </p>
              {progress.failures.map((f) => (
                <div key={f.patientId} className="text-red-700">
                  {f.patientId} ({f.patientName}): {f.error}
                </div>
              ))}
            </div>
          )}

          {/* Download button */}
          {progress.zipBase64 && (
            <div className="text-center pt-2">
              <button
                onClick={downloadZip}
                className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium"
              >
                📦 Download All Reports (ZIP)
              </button>
            </div>
          )}

          {progress.error && !progress.zipBase64 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {progress.error}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {progress.status === "error" && (
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            ❌ {progress.error}
          </div>
          <div className="text-center">
            <button
              onClick={startGeneration}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
