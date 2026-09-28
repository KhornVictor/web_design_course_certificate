"use client";

import type { CertificateConfig } from "@/lib/assets";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import {
  IoSettingsOutline,
  IoClose,
  IoPrintOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";

export interface StudioSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: "single" | "batch";
  onChangeViewMode: (mode: "single" | "batch") => void;
  config?: CertificateConfig;
  totalStudents: number;
  onPrintAll: () => void;
}

export default function StudioSettingsDrawer({
  isOpen,
  onClose,
  viewMode,
  onChangeViewMode,
  config,
  totalStudents,
  onPrintAll,
}: StudioSettingsDrawerProps) {
  const programTitle = config?.for || "GIC Crash Course 2026";
  const courseTitle = config?.subject || "Web Design";
  const signatoryName = config?.signature || "Mrs. Seak Leng";
  const signatoryRole = config?.role || "Deputy Head of the Department of GIC";
  const locationText = config?.location || "Phnom Penh, Cambodia";
  const dateRange =
    config?.start_date && config?.end_date
      ? `${config.start_date} to ${config.end_date}`
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
            <IoSettingsOutline className="w-5 h-5" />
            <h2 className="text-base font-bold leading-tight">
              Actions & Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-black/50 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close settings drawer"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="hidden xl:flex flex-col space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-3">
              Layout View
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeViewMode("batch")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-101 active:scale-95 ${
                  viewMode === "batch"
                    ? "bg-[#004a99] text-white font-bold shadow-2xs border-[#004a99]"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50"
                }`}
              >
                <CiGrid41
                  className={`w-5 h-5 mb-1.5 transition-transform duration-200 ${
                    viewMode === "batch" ? "scale-110" : ""
                  }`}
                />
                Batch Grid View
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode("single")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-101 active:scale-95 ${
                  viewMode === "single"
                    ? "bg-[#004a99] text-white font-bold shadow-2xs border-[#004a99]"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50"
                }`}
              >
                <CiGrid2H
                  className={`w-5 h-5 mb-1.5 transition-transform duration-200 ${
                    viewMode === "single" ? "scale-110" : ""
                  }`}
                />
                A4 Actual Size
              </button>
            </div>
          </div>

          {/* Certificate Information Overview */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-3 flex items-center gap-1.5">
              <IoInformationCircleOutline className="w-4 h-4 text-slate-500" />
              Certificate Configuration
            </h3>
            <div className="py-3.5 space-y-2.5 text-xs rounded-xl">
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Program:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {programTitle}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Course:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {courseTitle}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">
                  Total Certificates:
                </span>
                <span className="font-semibold text-[#004a99] text-right">
                  {totalStudents} recipients
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
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Dates:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {dateRange}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onPrintAll();
              }}
              className="w-full flex justify-center hover:scale-101 active:scale-99 items-center gap-3 px-4 py-3 bg-[#004a99] hover:bg-[#003d80] text-white rounded-xl shadow-xs hover:shadow transition-all cursor-pointer font-medium text-sm text-left group"
            >
              <IoPrintOutline className="w-5 h-5" />
              <div className="font-semibold">
                Print All Certificates ({totalStudents})
              </div>
            </button>
          </div>

          <div className="border-t border-black/20 py-2 flex items-center justify-between text-xs text-slate-500">
            <span>GIC Vacation Course</span>
            <span className="font-semibold text-slate-700">
              ITC &copy; 2026
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
