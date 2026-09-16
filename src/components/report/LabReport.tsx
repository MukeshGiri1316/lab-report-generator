import React from "react";
import { Patient } from "@/types/patient";
import Header from "./Header";
import PatientInfo from "./PatientInfo";
import ResultsTable from "./ResultsTable";
import Footer from "./Footer";
import Barcode from "./Barcode";

interface LabReportProps {
  patient: Patient;
}

export default function LabReport({ patient }: LabReportProps) {
  return (
    <div style={styles.page}>
      <Header />
      <PatientInfo patient={patient} />
      <Barcode/>
      <ResultsTable results={{
        wbc: patient.wbc,
        neutrophils: patient.neutrophils,
        lymphocytes: patient.lymphocytes,
        monocytes: patient.monocytes,
        eosinophils: patient.eosinophils,
        basophils: patient.basophils,
        rbcCount: patient.rbcCount,
        hb: patient.hb,
        hct: patient.hct,
        mcv: patient.mcv,
        mch: patient.mch,
        mchc: patient.mchc,
        rdwCv: patient.rdwCv,
        plateletCount: patient.plateletCount,
        mpv: patient.mpv,
        hbsag: patient.hbsag,
      }} />
      <Footer />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    width: "210mm",
    minHeight: "297mm",
    padding: "8mm 12mm 5mm 12mm",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    backgroundColor: "#ffffff",
    color: "#1a202c",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
};
