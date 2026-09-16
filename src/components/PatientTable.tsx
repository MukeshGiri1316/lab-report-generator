"use client";

import React from "react";
import { Patient } from "@/types/patient";

interface PatientTableProps {
  patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">
        Patient Data ({patients.length} patients)
      </h2>
      <div className="border border-gray-200 rounded overflow-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left p-2 border-b font-medium">REG.NO</th>
              <th className="text-left p-2 border-b font-medium">Name</th>
              <th className="text-left p-2 border-b font-medium">Age</th>
              <th className="text-left p-2 border-b font-medium">Gender</th>
              <th className="text-left p-2 border-b font-medium">Date</th>
              <th className="text-left p-2 border-b font-medium">Doctor</th>
              <th className="text-right p-2 border-b font-medium">WBC</th>
              <th className="text-right p-2 border-b font-medium">HB</th>
              <th className="text-right p-2 border-b font-medium">Platelets</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, idx) => (
              <tr
                key={p.patientId}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 border-b border-gray-100">{p.patientId}</td>
                <td className="p-2 border-b border-gray-100">{p.name}</td>
                <td className="p-2 border-b border-gray-100">{p.age}</td>
                <td className="p-2 border-b border-gray-100">{p.gender}</td>
                <td className="p-2 border-b border-gray-100">{p.date}</td>
                <td className="p-2 border-b border-gray-100">{p.doctorName}</td>
                <td className="p-2 border-b border-gray-100 text-right">
                  {p.wbc ?? "—"}
                </td>
                <td className="p-2 border-b border-gray-100 text-right">
                  {p.hb ?? "—"}
                </td>
                <td className="p-2 border-b border-gray-100 text-right">
                  {p.plateletCount ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
