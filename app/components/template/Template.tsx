"use client";

import React from "react";
import { formatCertificateDates } from "@/lib/date-utils";
import type { Student, CertificateAssets } from "@/lib/assets";

export interface TemplateProps {
  name?: string;
  student?: Student;
  course?: string;
  startDate?: string;
  completionDate?: string;
  certificateTitle?: string;
  programTitle?: string;
  signatoryName?: string;
  signatoryRole?: string;
  locationText?: string;
  assets?: CertificateAssets;
  className?: string;
  id?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function Template({
  name,
  student,
  course,
  startDate,
  completionDate,
  certificateTitle = "CERTIFICATE OF COMPLETION",
  programTitle = "GIC Crash Course 2026",
  signatoryName = "Mrs. Seak Leng",
  signatoryRole = "Deputy Head of the Department of GIC",
  locationText = "Phnom Penh, Cambodia",
  assets,
  className = "",
  id,
  onClick,
  isSelected = false,
}: TemplateProps) {
  const recipientName = student?.name || name || "Khorn Victor";
  const courseName = course || student?.course || "Web Design";
  const sDate = startDate || student?.start_date;
  const cDate = completionDate || student?.completion_date;
  const dateInfo =
    sDate && cDate
      ? formatCertificateDates(sDate, cDate)
      : {
          startDay: 15,
          startSuffix: "th",
          startMonth: "January",
          startYear: 2024,
          endDay: 29,
          endSuffix: "th",
          endMonth: "January",
          endYear: 2024,
          formattedDateRange: "From 15th to 29th January 2024",
          location: locationText,
          fullLine: `From 15th to 29th January 2024, ${locationText}.`,
        };

  const itcLogoSrc = assets?.itcLogo || "";
  const gicLogoSrc = assets?.gicLogo || "";
  const signatureSrc = assets?.signature || "";
  const bgImageSrc = assets?.templateBorderImage || "";
  const ornamentalRule = assets?.ornamentalRule || "";

  return (
    <div
      id={id}
      onClick={onClick}
      className={`group @container relative w-full aspect-297/210 bg-white text-[#333333] rounded-sm cursor-pointer
        shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]
        hover:shadow-[0_25px_60px_-12px_rgba(0,74,153,0.22),0_15px_30px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,74,153,0.15)]
        hover:-translate-y-1.5 hover:scale-[1.012] active:scale-[0.995] active:translate-y-0
        transition-all duration-300 ease-out overflow-hidden select-none mx-auto
        ${isSelected ? "ring-1 ring-black/50 ring-opacity-50" : ""}
        print:shadow-none print:ring-0! print:w-full print:h-full print:border-none print:m-0 print:transform-none print:transition-none break-after-page ${className}`}
      style={{
        containerType: "inline-size",
        fontFamily: "'Times New Roman', Times, 'Lora', serif",
        backgroundImage: bgImageSrc ? `url(${bgImageSrc})` : undefined,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden no-print print:hidden">
        <div className="absolute -inset-full top-0 h-[200%] w-[60%] -skew-x-20 bg-linear-to-r from-transparent via-white/35 to-transparent translate-x-[-150%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-in-out" />
      </div>
      <div className="relative w-full h-full flex flex-col justify-between px-[10cqw] py-[10cqw] text-center print:py-[10cqw] print:px-[10cqw]">
        <header className="relative z-10 flex justify-between items-center w-full mb-[0.6cqw] shrink-0">
          <div className="flex flex-col justify-start items-center flex-1 gap-[0.3cqw]">
            {itcLogoSrc && (
              <img
                src={itcLogoSrc}
                alt="ITC Logo"
                className="w-[8.5cqw] max-h-[8.5cqw] object-contain transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <span className="font-bold text-[1.3cqw] text-[#333333] leading-tight text-center">
              Institute of Technology of Cambodia
            </span>
          </div>
          <div className="flex flex-col items-center justify-center flex-[1.6] text-center px-[0.5cqw]">
            <h2 className="font-semibold text-[2.2cqw] uppercase tracking-[0.08em] text-[#222222] leading-tight">
              KINGDOM OF CAMBODIA
            </h2>
            <p className="text-[1.8cqw] text-[#444444] mt-[0.3cqw] tracking-wide leading-tight">
              Nation, Religion, King
            </p>

            <div className="w-[18cqw] mt-[0.4cqw] opacity-85 flex items-center justify-center">
              {ornamentalRule ? (
                <img
                  src={ornamentalRule}
                  alt="Ornamental Rule"
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="w-full h-[0.15cqw] bg-slate-800 my-[0.2cqw]" />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-end items-center flex-1 gap-[0.3cqw]">
            {gicLogoSrc && (
              <img
                src={gicLogoSrc}
                alt="GIC Logo"
                className="w-[8.8cqw] max-h-[8.5cqw] object-contain transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <span className="font-bold text-[1.25cqw] text-[#333333] leading-tight text-center">
              Department of Information and
              <br />
              Communication Engineering
            </span>
          </div>
        </header>
        <main className="relative z-10 flex-1 flex flex-col justify-center py-[0.2cqw] text-center">
          <h3 className="text-[#004a99] text-[3.8cqw] font-bold uppercase tracking-[0.04em] mb-[0.3cqw] leading-tight">
            {certificateTitle}
          </h3>

          <p className="text-[1.6cqw] italic text-[#555555] mb-[0.4cqw] leading-tight">
            This certificate is proudly awarded to
          </p>

          <h1 className="text-[#004a99] group-hover:text-[#003d80] transition-colors duration-300 text-[3.0cqw] font-bold uppercase tracking-[0.08em] my-[0.3cqw] leading-tight">
            {recipientName}
          </h1>

          <p className="font-medium text-[1.5cqw] text-[#333333] max-w-[90%] mx-auto leading-[1.7] mt-[0.6cqw]">
            You have successfully fulfilled all the requirements and completed
            the intensive training for the{" "}
            <span className="font-black text-black">{courseName}</span> course
            as part of the{" "}
            <span className="font-black text-black">“{programTitle}”</span>.
            This certificate is awarded by the Department of Information and
            Communication Engineering in recognition of your commitment to
            academic excellence.
          </p>

          <div className="text-[1.4cqw] italic text-[#555555] mt-[0.8cqw] mb-[0.4cqw] leading-tight">
            <p>
              {dateInfo.startMonth === dateInfo.endMonth &&
              dateInfo.startYear === dateInfo.endYear ? (
                <>
                  From {dateInfo.startDay}
                  <sup className="text-[72%]">
                    {dateInfo.startSuffix}
                  </sup> to {dateInfo.endDay}
                  <sup className="text-[72%]">{dateInfo.endSuffix}</sup>{" "}
                  {dateInfo.endMonth} {dateInfo.endYear}, {locationText}.
                </>
              ) : (
                <>
                  From {dateInfo.startDay}
                  <sup className="text-[72%]">{dateInfo.startSuffix}</sup>{" "}
                  {dateInfo.startMonth} to {dateInfo.endDay}
                  <sup className="text-[72%]">{dateInfo.endSuffix}</sup>{" "}
                  {dateInfo.endMonth} {dateInfo.endYear}, {locationText}.
                </>
              )}
            </p>
          </div>
        </main>

        <footer className="relative z-10 shrink-0 mt-[0.2cqw]">
          <div className="flex justify-end w-[85%] mx-auto">
            <div className="relative w-[34%] max-w-[36cqw] text-center flex flex-col items-center">
              <div className="relative h-[6.5cqw] w-full flex items-center justify-center mb-[-0.4cqw] z-10">
                {signatureSrc && (
                  <img
                    src={signatureSrc}
                    alt="Signature"
                    className="max-h-full max-w-full object-contain filter contrast-125 select-none"
                  />
                )}
              </div>

              {/* Signature Line */}
              <div className="w-full border-0 border-t border-[#333333] mb-[0.4cqw]" />

              {/* Signatory Name & Role */}
              <strong className="text-[1.5cqw] font-bold text-black block leading-tight">
                {signatoryName}
              </strong>
              <p className="text-[1.3cqw] text-[#333333] leading-[1.35] block mt-[0.2cqw]">
                {signatoryRole}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
