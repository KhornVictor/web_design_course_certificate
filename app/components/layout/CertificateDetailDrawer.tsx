"use client";

import React from "react";
import type {
  Student,
  CertificateConfig,
  CertificateAssets,
} from "@/lib/assets";
import { formatCertificateDates } from "@/lib/date-utils";
import {
  IoClose,
  IoPrintOutline,
  IoDownloadOutline,
  IoInformationCircleOutline,
  IoChevronBack,
  IoChevronForward,
  IoRibbonOutline,
} from "react-icons/io5";
import Template from "../template/Template";

export interface CertificateDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  studentIndex: number;
  totalStudents: number;
  config?: CertificateConfig;
  assets?: CertificateAssets;
  certificateTitle?: string;
  isExporting: boolean;
  onPrint: (student: Student) => void;
  onDownloadPNG: (student: Student) => void;
  onNextStudent?: () => void;
  onPrevStudent?: () => void;
}

export default function CertificateDetailDrawer({
  isOpen,
  onClose,
  student,
  studentIndex,
  totalStudents,
  config,
  assets,
  certificateTitle,
  isExporting,
  onPrint,
  onDownloadPNG,
  onNextStudent,
  onPrevStudent,
}: CertificateDetailDrawerProps) {
  if (!student) return null;

  const programTitle = config?.for || "GIC Crash Course 2026";
  const signatoryName = config?.signature || "Mrs. Seak Leng";
  const signatoryRole = config?.role || "Deputy Head of the Department of GIC";
  const locationText = config?.location || "Phnom Penh, Cambodia";
  const certAssets = assets || config?.assets;
  const certTitle =
    certificateTitle || config?.name || "CERTIFICATE OF COMPLETION";

  const dateInfo =
    student.start_date && student.completion_date
      ? formatCertificateDates(student.start_date, student.completion_date)
      : null;

  const dateDisplay = dateInfo
    ? dateInfo.formattedDateRange
    : "From 15th to 29th January 2024";

  return (
    <>
      {isOpen && (
        <div
          className="no-print fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`no-print font-merriweather fixed z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform
          bottom-0 inset-x-0 w-full max-h-[85vh] rounded-t-2xl
          ${isOpen ? "translate-y-0" : "translate-y-full pointer-events-none"}
          sm:bottom-auto sm:top-0 sm:right-0 sm:left-auto sm:h-full sm:w-96 sm:max-h-none sm:rounded-none
          ${isOpen ? "sm:translate-x-0 sm:translate-y-0" : "sm:translate-x-full sm:translate-y-0 sm:pointer-events-none"}
        `}
      >
        <div className="sm:hidden w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 -mb-1" />

        <div className="flex items-center justify-between px-5 text-[#004a99] font-bold py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <IoRibbonOutline className="w-5 h-5" />
            <h2 className="text-base font-bold leading-tight">
              Certificate Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-black/50 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close certificate detail drawer"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#004a99]">
              Preview
            </span>
            <div className="overflow-hidden rounded-md shadow-sm border border-slate-200 bg-white">
              <Template
                name={student.name}
                student={student}
                course={student.course || config?.subject || "Web Design"}
                startDate={
                  student.start_date || config?.start_date || "2024-01-15"
                }
                completionDate={
                  student.completion_date || config?.end_date || "2024-01-29"
                }
                signatoryName={signatoryName}
                signatoryRole={signatoryRole}
                locationText={locationText}
                programTitle={programTitle}
                certificateTitle={certTitle}
                assets={certAssets || config?.assets}
                isSelected={true}
                onClick={() => {}}
                id={`certificate-preview-${studentIndex}`}
              />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-3 flex items-center gap-1.5">
              <IoInformationCircleOutline className="w-4 h-4 text-slate-500" />
              Certificate Details
            </h3>
            <div className="space-y-2.5 text-xs rounded-xl py-3.5">
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Student Name:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {student.name}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Program:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {programTitle}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Course Subject:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {student.course || config?.subject || "Web Design"}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Signatory:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {signatoryName}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Role:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {signatoryRole}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Location:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {locationText}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 p-5">
          <button
            type="button"
            onClick={() => onPrint(student)}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-[#004a99] hover:bg-[#003d80] text-white rounded-xl shadow-xs hover:shadow transition-all cursor-pointer font-semibold text-xs active:scale-98"
          >
            <IoPrintOutline className="w-4 h-4" />
            Print This Certificate
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => onDownloadPNG(student)}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xs hover:shadow transition-all cursor-pointer font-medium text-xs active:scale-98 disabled:opacity-50"
          >
            <IoDownloadOutline className="w-4 h-4" />
            {isExporting
              ? "Generating PNG (300 DPI)..."
              : "Save as Image (PNG)"}
          </button>
        </div>

        {totalStudents > 1 && (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs">
            <button
              type="button"
              onClick={onPrevStudent}
              className="flex items-center gap-1 font-semibold text-slate-700 hover:text-[#004a99] transition-colors cursor-pointer p-1 rounded-md duration-300 hover:scale-110 active:scale-99"
              title="Previous Certificate"
            >
              <IoChevronBack className="w-4 h-4" />
              <span>Prev</span>
            </button>
            <span className="text-[11px] text-slate-500 font-medium">
              <strong className="text-slate-800 font-semibold">
                {studentIndex + 1}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-800 font-semibold">
                {totalStudents}
              </strong>
            </span>
            <button
              type="button"
              onClick={onNextStudent}
              className="flex items-center gap-1 font-semibold text-slate-700 hover:text-[#004a99] transition-colors cursor-pointer p-1 rounded-md duration-300 hover:scale-110 active:scale-99"
              title="Next Certificate"
            >
              <span>Next</span>
              <IoChevronForward className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
