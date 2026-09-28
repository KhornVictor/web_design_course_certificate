"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Template from "../template/Template";
import { downloadCertificatePNG } from "@/lib/export-canvas";
import type { CertificateAssets, Student } from "@/lib/assets";
import StudioSettingsDrawer from "./StudioSettingsDrawer";
import CertificateDetailDrawer from "./CertificateDetailDrawer";
import { FiSearch, FiX } from "react-icons/fi";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { IoClose, IoDownloadOutline, IoInformationCircleOutline, IoMenuSharp, IoPrintOutline, IoSettingsOutline } from "react-icons/io5";

interface CertificateStudioProps {
  initialData: CertificateAssets;
}

interface DisplayStudent {
  student: Student;
  isExiting: boolean;
}

export default function CertificateStudio({
  initialData,
}: CertificateStudioProps) {
  const { students, ...assets } = initialData;

  const config = initialData.config;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"single" | "batch">("batch");
  const [isTransitioningView, setIsTransitioningView] = useState(false);

  const changeViewMode = (newMode: "single" | "batch") => {
    if (newMode === viewMode || isTransitioningView) return;
    setIsTransitioningView(true);
    setTimeout(() => {
      setViewMode(newMode);
      setTimeout(() => {
        setIsTransitioningView(false);
      }, 50);
    }, 150);
  };

  const certificateTitle = config?.name || "CERTIFICATE OF COMPLETION";
  const programTitle = config?.for || "GIC Crash Course 2026";
  const signatoryName = config?.signature || "Mrs. Seak Leng";
  const signatoryRole = config?.role || "Deputy Head of the Department of GIC";
  const locationText = config?.location || "Phnom Penh, Cambodia";
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [printTarget, setPrintTarget] = useState<Student | "all" | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleCertificateClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
    setIsSettingsOpen(false);
  };

  const handlePrintSingle = (student: Student) => {
    setPrintTarget(student);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setPrintTarget(null);
      }, 500);
    }, 150);
  };

  const handlePrintAll = () => {
    setPrintTarget("all");
    setViewMode("batch");
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setPrintTarget(null);
      }, 500);
    }, 150);
  };

  const handleDownloadPNG = async (student: Student) => {
    setIsExporting(true);
    try {
      await downloadCertificatePNG(student, initialData, {
        certificateTitle,
        programTitle,
        signatoryName,
        signatoryRole,
        locationText,
      });
    } catch (err) {
      console.error("Failed to export certificate PNG:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const [displayStudents, setDisplayStudents] = useState<DisplayStudent[]>(() =>
    students.map((st) => ({ student: st, isExiting: false })),
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
        setIsDetailOpen(false);
      }
    };
    if (isSettingsOpen || isDetailOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSettingsOpen, isDetailOpen]);

  const isInitialMount = useRef(true);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase().trim();
    return students.filter(
      (st) =>
        st.name.toLowerCase().includes(query) ||
        (st.course && st.course.toLowerCase().includes(query)),
    );
  }, [students, searchQuery]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const matchingNames = new Set(filteredStudents.map((s) => s.name));

    setDisplayStudents((prev) => {
      const prevActiveCount = prev.filter((item) => !item.isExiting).length;
      const prevMatchingCount = prev.filter(
        (item) => !item.isExiting && matchingNames.has(item.student.name),
      ).length;
      const allPrevMatch =
        prevActiveCount === prevMatchingCount &&
        prevActiveCount === matchingNames.size;
      const hasExiting = prev.some((item) => item.isExiting);

      if (allPrevMatch && !hasExiting) {
        return prev;
      }

      const existingMap = new Map(
        prev.map((item) => [item.student.name, item]),
      );
      const updated: DisplayStudent[] = [];
      prev.forEach((item) => {
        if (matchingNames.has(item.student.name)) {
          updated.push({ student: item.student, isExiting: false });
        } else {
          updated.push({ student: item.student, isExiting: true });
        }
      });
      filteredStudents.forEach((st) => {
        if (!existingMap.has(st.name)) {
          updated.push({ student: st, isExiting: false });
        }
      });

      return updated;
    });
    const timer = setTimeout(() => {
      setDisplayStudents((prev) => {
        if (!prev.some((item) => item.isExiting)) return prev;
        return prev.filter((item) => !item.isExiting);
      });
    }, 220);

    return () => clearTimeout(timer);
  }, [filteredStudents]);

  const activeStudentList =
    filteredStudents.length > 0 ? filteredStudents : students;

  const selectedStudentIndex = selectedStudent
    ? activeStudentList.findIndex((st) => st.name === selectedStudent.name)
    : -1;

  const handleNextStudent = () => {
    if (activeStudentList.length === 0) return;
    const nextIdx = (selectedStudentIndex + 1) % activeStudentList.length;
    setSelectedStudent(activeStudentList[nextIdx]);
  };

  const handlePrevStudent = () => {
    if (activeStudentList.length === 0) return;
    const prevIdx =
      (selectedStudentIndex - 1 + activeStudentList.length) %
      activeStudentList.length;
    setSelectedStudent(activeStudentList[prevIdx]);
  };



  return (
    <div className="min-h-screen bg-gray-100 text-slate-950 flex flex-col">
      <header className="no-print sticky top-0 z-50 bg-white backdrop-blur-md px-4 lg:px-8 py-3.5 shadow-md">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                {assets.itcLogo && (
                  <img
                    src={assets.itcLogo}
                    alt="ITC Logo"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="w-11 h-11 rounded-sm overflow-hidden flex items-center justify-center">
                {assets.gicLogo && (
                  <img
                    src={assets.gicLogo}
                    alt="GIC Logo"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
            <div>
              <h1 className="font-merriweather text-base sm:text-lg font-bold tracking-tight text-slate-950 items-center gap-2 hidden sm:inline-flex">
                Gic Vacation Certificate
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex items-center font-merriweather">
              <FiSearch className="absolute left-3 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student..."
                className="w-40 sm:w-56 md:w-64 pl-9 pr-14 py-1.5 border border-gray-300 hover:scale-101 text-xs sm:text-sm rounded-full text-slate-900 outline-0 transition-all duration-200 focus:ring-1 focus:ring-slate-950/30 shadow-2xs"
              />
              {searchQuery && (
                <div className="absolute right-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 select-none hidden sm:inline">
                    {filteredStudents.length}/{students.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div
              className="items-center justify-center p-1 rounded-lg cursor-pointer hover:text-[#004a99] hover:bg-slate-100 transition-all duration-200 active:scale-90 hidden xl:flex"
              onClick={() =>
                changeViewMode(viewMode === "single" ? "batch" : "single")
              }
              title={viewMode === "single" ? "Switch to Batch Grid View" : "Switch to A4 Actual Size"}
              role="button"
              aria-label="Toggle Layout View"
            >
              <div
                className={`transition-all duration-300 transform ${
                  isTransitioningView
                    ? "rotate-180 scale-75 opacity-40"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              >
                {viewMode === "single" ? (
                  <CiGrid41 className="w-5 h-5" />
                ) : (
                  <CiGrid2H className="w-5 h-5" />
                )}
              </div>
            </div>
            <div
              onClick={() => {
                setIsSettingsOpen(true);
                setIsDetailOpen(false);
              }}
              className="flex items-center flex-wrap gap-2.5 cursor-pointer hover:text-slate-700 hover:scale-110 transition-transform duration-200 active:scale-95 text-slate-800"
              title="Open Actions & Settings Menu"
              role="button"
              aria-label="Open Actions & Settings Menu"
            >
              <IoMenuSharp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Studio Actions & Settings Drawer (Opened via menu icon) */}
      <StudioSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        viewMode={viewMode}
        onChangeViewMode={changeViewMode}
        config={config}
        totalStudents={students.length}
        onPrintAll={handlePrintAll}
      />

      {/* Certificate Details Drawer (Opened via clicking any certificate) */}
      <CertificateDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        studentIndex={selectedStudentIndex}
        totalStudents={activeStudentList.length}
        config={config}
        assets={initialData}
        certificateTitle={certificateTitle}
        isExporting={isExporting}
        onPrint={handlePrintSingle}
        onDownloadPNG={handleDownloadPNG}
        onNextStudent={handleNextStudent}
        onPrevStudent={handlePrevStudent}
      />

      {/* Print-only container for single certificate print */}
      {printTarget && printTarget !== "all" && (
        <div className="hidden print:block fixed inset-0 w-screen h-screen z-9999 bg-white">
          <Template
            student={printTarget}
            certificateTitle={certificateTitle}
            programTitle={programTitle}
            signatoryName={signatoryName}
            signatoryRole={signatoryRole}
            locationText={locationText}
            assets={initialData}
          />
        </div>
      )}

      <main
        className={`grid grid-cols-1 ${
          viewMode === "batch"
            ? "xl:grid-cols-2"
            : "xl:grid-cols-[297mm] xl:grid-rows-[210mm]"
        } justify-center p-4 sm:p-6 lg:p-8 gap-6 overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out ${
          isTransitioningView
            ? "opacity-0 scale-[0.985] blur-[1px] pointer-events-none"
            : "opacity-100 scale-100 blur-0"
        } ${printTarget && printTarget !== "all" ? "print:hidden!" : ""}`}
      >
        {displayStudents.length > 0 ? (
          displayStudents.map(({ student: st, isExiting }) => (
            <div
              key={`${st.name}-${viewMode}`}
              className={`w-full flex justify-center transition-all duration-200 ease-out will-change-transform ${
                isExiting
                  ? "animate-cert-fade-out opacity-0 scale-98 pointer-events-none"
                  : "animate-cert-fade-in opacity-100 scale-100"
              } print:opacity-100! print:transform-none! print:transition-none! print:w-full print:h-full`}
            >
              <Template
                student={st}
                certificateTitle={certificateTitle}
                programTitle={programTitle}
                signatoryName={signatoryName}
                signatoryRole={signatoryRole}
                locationText={locationText}
                assets={initialData}
                onClick={() => handleCertificateClick(st)}
                isSelected={selectedStudent?.name === st.name}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-slate-500 animate-cert-fade-in">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
              <FiSearch className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              No certificates found
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              No students match &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-1.5 text-xs font-medium bg-[#004a99] hover:bg-[#003d80] text-white rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
