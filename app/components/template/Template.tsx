"use client";

import React from "react";
import { formatCertificateDates } from "@/lib/date-utils";
import type { Student, CertificateAssets } from "@/lib/assets";

export interface TemplateProps {
  name?: string;
  student?: Student;
  programTitle?: string;
  signatoryName?: string;
  signatoryRole?: string;
  locationText?: string;
  assets?: CertificateAssets;
  className?: string;
  id?: string;
}

export default function Template({
  name,
  student,
  programTitle = "GIC Vacation Crash Course 2025",
  signatoryName = "Ms. SEAK Leng",
  signatoryRole = "Deputy Head of the Department of GIC",
  locationText = "Phnom Penh, Cambodia",
  assets,
  className = "",
  id,
}: TemplateProps) {
  // Resolve student name and course
  const recipientName = student?.name || name || "Khorn Victor";
  const courseName = student?.course || "Web Design";

  // Format dates
  const dateInfo = student?.start_date && student?.completion_date
    ? formatCertificateDates(student.start_date, student.completion_date)
    : {
        startDay: 1,
        startSuffix: "st",
        startMonth: "September",
        startYear: 2025,
        endDay: 2,
        endSuffix: "nd",
        endMonth: "October",
        endYear: 2025,
        formattedDateRange: "From 1st September to 2nd October 2025",
        location: locationText,
        fullLine: `From 1st September to 2nd October 2025, ${locationText}.`,
      };

  const itcLogoSrc = assets?.itcLogo || "/assets/itc-logo.png";
  const gicLogoSrc = assets?.gicLogo || "/assets/GIC.png";
  const signatureSrc = assets?.signature || "/assets/signature.png";
  const bgImageSrc = assets?.templateBorderImage || "/assets/certificate-background.jpg";

  return (
    <div
      id={id}
      className={`relative w-[297mm] h-[210mm] max-w-full aspect-297/210 bg-white text-[#333333] shadow-2xl overflow-hidden select-none mx-auto print:shadow-none print:w-full print:h-full print:border-none print:m-0 break-after-page ${className}`}
      style={{
        fontFamily: "'Times New Roman', Times, 'Lora', serif",
        backgroundImage: `url(${bgImageSrc})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* INNER CERTIFICATE CONTAINER (Equivalent to .certificate-inner: padding 28mm, flex column, space-between) */}
      <div className="relative w-full h-full flex flex-col justify-between p-[16mm] sm:p-[20mm] md:p-[24mm] lg:p-[28mm] text-center">

        <header className="relative z-10 flex justify-between items-center w-full mb-3 shrink-0">
          <div className="flex flex-col justify-start items-center flex-1 gap-2">
            <img
              src={itcLogoSrc}
              alt="ITC Logo"
              className="w-16 sm:w-20 md:w-24 max-w-30 h-auto object-contain"
            />
            <span className="font-bold text-[0.8rem] sm:text-[0.85rem] md:text-[0.9rem] text-[#333333] leading-tight text-center">
              Institute of Technology of Cambodia
            </span>
          </div>

          {/* Header Center (.header-center): Kingdom of Cambodia + Motto + Ornamental Rule */}
          <div className="flex flex-col items-center justify-center flex-[1.5] text-center px-1">
            <h2 className="font-bold text-sm sm:text-base md:text-[1.1rem] uppercase tracking-[1px] text-[#222222]">
              KINGDOM OF CAMBODIA
            </h2>
            <p className="text-xs sm:text-[0.8rem] text-[#444444] mt-1 tracking-wide">
              Nation, Religion, King
            </p>

            <div className="w-45 sm:w-50 my-1 opacity-80 flex items-center justify-center">
              <img src="" alt="" />
            </div>
          </div>

          {/* Header Right (.header-right): GIC Logo + Department Name */}
          <div className="flex flex-col justify-end items-center flex-1 gap-2">
            <img
              src={gicLogoSrc}
              alt="GIC Logo"
              className="w-16 sm:w-20 md:w-24 max-w-30 h-auto object-contain"
            />
            <span className="font-bold text-[0.78rem] sm:text-[0.85rem] md:text-[0.9rem] text-[#333333] leading-tight text-center">
              Department of Information and
              <br />
              Communication Engineering
            </span>
          </div>
        </header>

        <main className="relative z-10 flex-1 flex flex-col justify-center py-1 sm:py-2 text-center">
          <h3 className="text-[#004a99] text-xl sm:text-2xl md:text-3xl lg:text-[2.6rem] font-bold uppercase tracking-[1px] mb-1 sm:mb-2">
            Certificate of Completion
          </h3>

          <p className="text-xs sm:text-sm md:text-[1.1rem] italic text-[#555555] mb-1 sm:mb-2">
            This certificate is proudly awarded to
          </p>

          <h1 className="text-[#004a99] text-lg sm:text-2xl md:text-[2rem] font-bold uppercase tracking-[2px] my-0.5 sm:my-1">
            {recipientName}
          </h1>

          <p className="font-medium text-[0.85rem] sm:text-[0.95rem] md:text-[1.05rem] text-[#333333] max-w-[90%] mx-auto leading-[1.8] mt-2 sm:mt-[0.8em]">
            You have successfully fulfilled all the requirements and completed the intensive training for the{" "}
            <span className="font-black text-black">{courseName}</span> course as part of the{" "}
            <span className="font-black text-black">“{programTitle}”</span>. This certificate is awarded by the
            Department of Information and Communication Engineering in recognition of your commitment to academic
            excellence.
          </p>

          {/* Date & Location (.date-location): 0.95rem, italic, color #555 */}
          <div className="text-[0.8rem] sm:text-[0.88rem] md:text-[0.95rem] italic text-[#555555] mt-2 sm:mt-3 mb-2 sm:mb-4">
            <p>
              From {dateInfo.startDay}
              <sup className="text-[72%]"> {dateInfo.startSuffix}</sup> {dateInfo.startMonth} to {dateInfo.endDay}
              <sup className="text-[72%]"> {dateInfo.endSuffix}</sup> {dateInfo.endMonth} {dateInfo.endYear},{" "}
              {locationText}.
            </p>
          </div>
        </main>

        <footer className="relative z-10 shrink-0 mt-2 sm:mt-4">
          <div className="flex justify-end w-[85%] mx-auto">
            <div className="relative w-[45%] max-w-65 text-center text-[0.9rem] flex flex-col items-center">
              <div className="relative h-14 sm:h-16 md:h-20 w-44 sm:w-56 md:w-62.5 flex items-center justify-center -mb-2 z-10">
                <img
                  src={signatureSrc}
                  alt="Signature"
                  className="max-h-full max-w-full object-contain filter contrast-125 select-none"
                />
              </div>

              {/* Signature Line (.signature-line): border-top 1px solid #333 */}
              <div className="w-full border-0 border-t border-[#333333] mb-1.5" />

              {/* Signatory Name & Role: strong (1rem font-bold), p (0.9rem line-height 1.4) */}
              <strong className="text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-bold text-black block leading-tight">
                {signatoryName}
              </strong>
              <p className="text-[0.78rem] sm:text-[0.85rem] md:text-[0.9rem] text-[#333333] leading-[1.4] block mt-0.5">
                {signatoryRole}
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}