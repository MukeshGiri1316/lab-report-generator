import React from "react";
import { Patient } from "@/types/patient";

interface PatientInfoProps {
  patient: Patient;
}

export default function PatientInfo({ patient }: PatientInfoProps) {
  return (
    <div
      className="
        w-full
        border
        border-black
        font-[Arial,Helvetica,sans-serif]
        text-[9pt]
        leading-[1.15]
        text-black
        box-border
        my-2
      "
    >
      <div className="grid grid-cols-3">

        {/* ================= LEFT COLUMN ================= */}
        <div className="border-r border-black px-[2.5mm] py-[1.5mm]">

          {/* NAME */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[6.5mm] items-center">
            <span className="font-bold">NAME</span>
            <span className="text-center">:</span>
            <span className="min-w-0 break-words">
              {patient.name || "\u00A0"}
            </span>
          </div>

          {/* AGE / SEX */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[6.5mm] items-center">
            <span className="font-bold">AGE/SEX</span>
            <span className="text-center">:</span>
            <span className="min-w-0">
              {patient.age || "\u00A0"}
              {patient.gender ? `/${patient.gender}` : ""}
            </span>
          </div>

          {/* DATE */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[6.5mm] items-center">
            <span className="font-bold">DATE</span>
            <span className="text-center">:</span>
            <span className="min-w-0 break-words">
              {patient.date || "\u00A0"}
            </span>
          </div>

        </div>


        {/* ================= MIDDLE COLUMN ================= */}
        <div className="border-r border-black px-[2.5mm] py-[1.5mm]">

          {/* REG.NO */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[6.5mm] items-center">
            <span className="font-bold">REG.NO</span>
            <span className="text-center">:</span>
            <span className="min-w-0 break-words">
              {patient.patientId || "\u00A0"}
            </span>
          </div>

          {/* ACCESSION NO */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[6.5mm] items-center">
            <span className="font-bold">Accession No</span>
            <span className="text-center">:</span>
            <span className="min-w-0 break-words">
              {patient.accessionNo || "\u00A0"}
            </span>
          </div>

          {/* BILL/IPD NO */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[6.5mm] items-center">
            <span className="font-bold">BILL/IPD NO.</span>
            <span className="text-center">:</span>
            <span className="min-w-0 break-words">
              {patient.billIpdNo || "\u00A0"}
            </span>
          </div>

        </div>


        {/* ================= RIGHT COLUMN ================= */}
        <div className="px-[2.5mm] py-[1.5mm]">

          {/* OPD/IPD */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[5.5mm] items-center">
            <span className="font-bold">OPD/IPD</span>
            <span className="text-center">:</span>
            <span className="min-w-0">
              {patient.opdIpd || "OPD"}
            </span>
          </div>

          {/* DEPARTMENT */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[7mm] items-start">
            <span className="font-bold">DEPARTMENT</span>
            <span className="text-center">:</span>
            <span className="min-w-0 leading-[4.5mm]">
              {patient.department || "GENERAL MEDICINE"}
            </span>
          </div>

          {/* CON.DR */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[5.5mm] items-center">
            <span className="font-bold">CON.DR</span>
            <span className="text-center">:</span>
            <span className="min-w-0 break-words">
              {patient.doctorName || "\u00A0"}
            </span>
          </div>

          {/* LOCATION */}
          <div className="grid grid-cols-[30mm_5mm_1fr] min-h-[5.5mm] items-center">
            <span className="font-bold">LOCATION</span>
            <span className="text-center">:</span>
            <span className="min-w-0">
              {patient.location || "/"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}