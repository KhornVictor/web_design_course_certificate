"use client";

import React, { useState } from "react";
import Template from "./template/Template";
import { downloadCertificatePNG } from "@/lib/export-canvas";
import type { CertificateAssets, Student } from "@/lib/assets";
import { FiMenu } from "react-icons/fi";

interface CertificateStudioProps {
  initialData: CertificateAssets;
}

export default function CertificateStudio({
  initialData,
}: CertificateStudioProps) {
  const { students, ...assets } = initialData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"single" | "batch">("batch");
  const [frameMode, setFrameMode] = useState<"original" | "vector">("original");

  // Configurable fields
  const [programTitle, setProgramTitle] = useState(
    "GIC Vacation Crash Course 2024",
  );
  const [signatoryName, setSignatoryName] = useState("Ms. SEAK Leng");
  const [signatoryRole, setSignatoryRole] = useState(
    "Deputy Head of the Department of GIC",
  );
  const [locationText, setLocationText] = useState("Phnom Penh, Cambodia");

  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const activeStudent: Student = students[currentIndex] || {
    name: "Khorn Victor",
    course: "Web Design",
    start_date: "2024-01-15",
    completion_date: "2024-06-01",
  };

  const handlePrint = (mode: "current" | "all") => {
    if (mode === "all") {
      setViewMode("batch");
    }

    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadPNG = async () => {
    setIsExporting(true);
    try {
      await downloadCertificatePNG(activeStudent, initialData, {
        programTitle,
        signatoryName,
        signatoryRole,
        locationText,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-slate-950 flex flex-col">
      <header className="no-print sticky top-0 z-50 bg-white backdrop-blur-md px-4 lg:px-8 py-3.5 shadow-md">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                {assets.itcLogo && <img src={assets.itcLogo} alt="ITC Logo" className="w-full h-full object-contain" />}
              </div>
              <div className="w-11 h-11 rounded-sm overflow-hidden flex items-center justify-center">
                {assets.gicLogo && <img src={assets.gicLogo} alt="GIC Logo" className="w-full h-full object-contain" />}
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-950 flex items-center gap-2">
                GIC Vacation Certificate
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <FiMenu />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start gap-6 overflow-y-auto">
        {students.map((st, i) => (
          <Template
            key={st.name + i}
            student={st}
            programTitle={programTitle}
            signatoryName={signatoryName}
            signatoryRole={signatoryRole}
            locationText={locationText}
            assets={initialData}
          />
        ))}
      </main>
    </div>
  );
}
