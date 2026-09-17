import React from "react";

interface FooterProps {
  leftSignatureUrl?: string;
  rightSignatureUrl?: string;
}

export default function Footer({
  leftSignatureUrl,
  rightSignatureUrl,
}: FooterProps) {
  return (
    <footer className="mt-auto w-full font-[Arial,Helvetica,sans-serif] text-black">

      {/* =========================================================
          SIGNATURES
      ========================================================= */}
      <div className="flex justify-end pt-[8mm]">

        {/* Dr. Deepa Upadhyay */}
        <div className="w-[28mm] text-center">
          <img src="/report-images/image4.png" alt="sign1" />
        </div>


        {/* Dr. Anurag Gupta */}
        <div className="ml-[12mm] w-[28mm] text-center">
          <img src="/report-images/image5.png" alt="sign2" />
        </div>

      </div>


      {/* =========================================================
          MEDICO LEGAL DISCLAIMER
      ========================================================= */}
      <div className="flex justify-center pt-[5mm] pb-[2mm]">
        <div
          className="
            border-b
            border-black
            px-[1mm]
            pb-[1mm]
            text-center
            text-[9pt]
            font-bold
          "
        >
          NOT VALID FOR MEDICO LEGAL CASES
        </div>
      </div>

    </footer>
  );
}