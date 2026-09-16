import React from "react";

interface HaematologyResults {
  wbc?: string | number;
  neutrophils?: string | number;
  lymphocytes?: string | number;
  monocytes?: string | number;
  eosinophils?: string | number;
  basophils?: string | number;
  rbcCount?: string | number;
  hb?: string | number;
  hct?: string | number;
  mcv?: string | number;
  mch?: string | number;
  mchc?: string | number;
  rdwCv?: string | number;
  plateletCount?: string | number;
  mpv?: string | number;
  hbsag?: string;
}

interface HaematologyAnalysisProps {
  results?: HaematologyResults;
}

export default function HaematologyAnalysis({
  results = {},
}: HaematologyAnalysisProps) {
  return (
    <div className="w-full border-x border-black font-[Arial,Helvetica,sans-serif] text-[9pt] text-black">

      {/* =========================================================
          HAEMATOLOGY ANALYSIS REPORT
      ========================================================= */}
      <div
        className="
          flex
          h-[5.5mm]
          items-center
          justify-center
          border-t
          border-b
          border-black
          text-[11pt]
          font-bold
          italic
          text-black
        "
      >
        HAEMATOLOGY ANALYSIS REPORT
      </div>

      {/* =========================================================
          HAEMATOLOGY TABLE
      ========================================================= */}
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[33%]" />
          <col className="w-[16.5%]" />
          <col className="w-[16.5%]" />
          <col className="w-[34%]" />
        </colgroup>

        <thead>
          <tr className="h-[7mm]">
            <th className="border-b border-r border-black px-[1mm] text-left font-bold">
              Investigations
            </th>

            <th className="border-b border-r border-black px-[1mm] text-center font-bold">
              Result
            </th>

            <th className="border-b border-r border-black px-[1mm] text-center font-bold">
              Unit
            </th>

            <th className="border-b border-black px-[1mm] text-center font-bold">
              Biological Reference Interval
            </th>
          </tr>
        </thead>

        <tbody>

          {/* WBC */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm] text-left">
              WBC
            </td>
            <td className="px-[1mm] text-center">
              {results.wbc ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              x10^3cells/cumm
            </td>
            <td className="px-[1mm] text-center">
              4.0 - 11.0
            </td>
          </tr>

          {/* Neutrophils */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              Neutrophils
            </td>
            <td className="px-[1mm] text-center">
              {results.neutrophils ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              %
            </td>
            <td className="px-[1mm] text-center">
              40 - 70
            </td>
          </tr>

          {/* Lymphocytes */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              Lymphocytes
            </td>
            <td className="px-[1mm] text-center">
              {results.lymphocytes ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              %
            </td>
            <td className="px-[1mm] text-center">
              25 - 45
            </td>
          </tr>

          {/* Monocytes */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              Monocytes
            </td>
            <td className="px-[1mm] text-center">
              {results.monocytes ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              %
            </td>
            <td className="px-[1mm] text-center">
              2 - 8
            </td>
          </tr>

          {/* Eosinophils */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              Eosinophils
            </td>
            <td className="px-[1mm] text-center">
              {results.eosinophils ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              %
            </td>
            <td className="px-[1mm] text-center">
              1 - 6
            </td>
          </tr>

          {/* Basophils */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              Basophils
            </td>
            <td className="px-[1mm] text-center">
              {results.basophils ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              %
            </td>
            <td className="px-[1mm] text-center">
              0 - 1
            </td>
          </tr>

          {/* RBC COUNT */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              RBC COUNT
            </td>
            <td className="px-[1mm] text-center">
              {results.rbcCount ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              millions/cu.mm
            </td>
            <td className="px-[1mm] text-center">
              4 - 5.5
            </td>
          </tr>

          {/* HB */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              HB
            </td>
            <td className="px-[1mm] text-center">
              {results.hb ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              g/dl
            </td>
            <td className="px-[1mm] text-center">
              11.00-16.50
            </td>
          </tr>

          {/* HCT */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              HCT
            </td>
            <td className="px-[1mm] text-center">
              {results.hct ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              %
            </td>
            <td className="px-[1mm] text-center">
              35-45
            </td>
          </tr>

          {/* MCV */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              MCV
            </td>
            <td className="px-[1mm] text-center">
              {results.mcv ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              fL
            </td>
            <td className="px-[1mm] text-center">
              75 - 95
            </td>
          </tr>

          {/* MCH */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              MCH
            </td>
            <td className="px-[1mm] text-center">
              {results.mch ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              pg
            </td>
            <td className="px-[1mm] text-center">
              26 - 30
            </td>
          </tr>

          {/* MCHC */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              MCHC
            </td>
            <td className="px-[1mm] text-center">
              {results.mchc ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              gm/dl
            </td>
            <td className="px-[1mm] text-center">
              32 - 36
            </td>
          </tr>

          {/* RDW-CV */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              RDW-CV
            </td>
            <td className="px-[1mm] text-center">
              {results.rdwCv ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              %
            </td>
            <td className="px-[1mm] text-center">
              10-15
            </td>
          </tr>

          {/* Platelet Count */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              Platelet Count
            </td>
            <td className="px-[1mm] text-center">
              {results.plateletCount ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              x10^3cells/uL
            </td>
            <td className="px-[1mm] text-center">
              150-400
            </td>
          </tr>

          {/* MPV */}
          <tr className="h-[5.8mm]">
            <td className="px-[1mm]">
              MPV
            </td>
            <td className="px-[1mm] text-center">
              {results.mpv ?? "\u00A0"}
            </td>
            <td className="px-[1mm] text-center">
              fl
            </td>
            <td className="px-[1mm] text-center">
              7.5-12
            </td>
          </tr>

        </tbody>
      </table>


      {/* =========================================================
          SEROLOGY TITLE
      ========================================================= */}
      <div
        className="
          flex
          h-[7mm]
          items-center
          justify-center
          border-t
          border-b
          border-black
          text-[11pt]
          font-bold
          italic
        "
      >
        SEROLOGY
      </div>


      {/* =========================================================
          SEROLOGY TABLE
      ========================================================= */}
      <table className="w-full table-fixed border-b border-black">
        <colgroup>
          <col className="w-[33%]" />
          <col className="w-[16%]" />
          <col className="w-[16%]" />
          <col className="w-[35%]" />
        </colgroup>

        <thead>
          <tr className="h-[7mm]">
            <th className="border-b border-r border-black px-[1mm] text-left font-bold">
              Investigations
            </th>

            <th className="border-b border-r border-black px-[1mm] text-center font-bold">
              Result
            </th>

            <th className="border-b border-r border-black px-[1mm] text-center font-bold">
              Unit
            </th>

            <th className="border-b border-black px-[1mm] text-center font-bold">
              Biological Reference Interval
            </th>
          </tr>
        </thead>

        <tbody>
          <tr className="h-[7mm]">
            <td className="px-[1mm]">
              HBSAG
            </td>

            <td className="px-[1mm] text-center">
              {results.hbsag || "NEGATIVE"}
            </td>

            <td className="px-[1mm] text-center">
              &nbsp;
            </td>

            <td className="px-[1mm] text-center">
              &nbsp;
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}