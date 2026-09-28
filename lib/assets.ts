import fs from "fs";
import path from "path";

export interface CertificateConfig {
  name: string;
  for: string;
  signature: string;
  role: string;
  subject: string;
  location: string;
  start_date: string;
  end_date: string;
}

export interface Student {
  name: string;
  course: string;
  start_date: string;
  completion_date: string;
}

export interface CertificateAssets {
  itcLogo: string;
  gicLogo: string;
  signature: string;
  ornamentalRule: string;
  templateBorderImage: string;
  imageWidth: number;
  imageHeight: number;
  students: Student[];
  config: CertificateConfig;
}

export function getCertificateData(): CertificateAssets {
  const rootDir = process.cwd();
  const assetsDir = path.join(rootDir, "app", "assets");

  // 1. Read certificate metadata from public/cetification.json (with fallbacks)
  const defaultCertificateConfig: CertificateConfig = {
    name: "CERTIFICATE OF COMPLETION",
    for: "GIC Crash Course 2026",
    signature: "Mrs. Seak Leng",
    role: "Deputy Head of the Department of GIC",
    subject: "Web Design",
    location: "Phnom Penh, Cambodia",
    start_date: "2024-01-15",
    end_date: "2024-01-29",
  };

  let config = { ...defaultCertificateConfig };
  const certJsonCandidates = [
    path.join(rootDir, "public", "cetification.json"),
    path.join(rootDir, "public", "certificate.json"),
    path.join(rootDir, "public", "catificate.json"),
    path.join(rootDir, "public", "certification.json"),
    path.join(rootDir, "app", "assets", "cetification.json"),
  ];

  for (const certPath of certJsonCandidates) {
    if (fs.existsSync(certPath)) {
      try {
        const raw = fs.readFileSync(certPath, "utf-8");
        const parsed = JSON.parse(raw);
        config = { ...config, ...parsed };
        break;
      } catch (err) {
        console.error("Failed to parse certificate config from:", certPath, err);
      }
    }
  }

  // 2. Read students from public/students.csv
  let studentNames: string[] = [];
  const studentsCsvCandidates = [
    path.join(rootDir, "public", "students.csv"),
    path.join(rootDir, "app", "assets", "students.csv"),
  ];

  for (const csvPath of studentsCsvCandidates) {
    if (fs.existsSync(csvPath)) {
      try {
        const raw = fs.readFileSync(csvPath, "utf-8");
        const lines = raw
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0 && line.toLowerCase() !== "name");

        studentNames = lines.map((line) => {
          if (line.includes(",")) {
            return line.split(",")[0].trim().replace(/^["']|["']$/g, "");
          }
          return line.replace(/^["']|["']$/g, "");
        });

        if (studentNames.length > 0) break;
      } catch (err) {
        console.error("Failed to read students.csv from:", csvPath, err);
      }
    }
  }

  // Fallback to students.json if students.csv was not found or empty
  if (studentNames.length === 0) {
    const studentsJsonPath = path.join(rootDir, "public", "students.json");
    if (fs.existsSync(studentsJsonPath)) {
      try {
        const raw = fs.readFileSync(studentsJsonPath, "utf-8");
        const list = JSON.parse(raw);
        studentNames = list.map((s: { name: string }) => s.name);
      } catch (err) {
        console.error("Failed to read fallback students.json:", err);
      }
    }
  }

  // Build student list combined with cetification.json details
  const students: Student[] = studentNames.map((sName) => ({
    name: sName,
    course: config.subject || "Web Design",
    start_date: config.start_date || "2024-01-15",
    completion_date: config.end_date || "2024-01-29",
  }));

  // 3. Read image assets as base64 data URLs strictly from app/assets
  const readImageAsBase64 = (fileName: string): string => {
    try {
      const filePath = path.join(assetsDir, fileName);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase();
        const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
        const data = fs.readFileSync(filePath);
        return `data:${mime};base64,${data.toString("base64")}`;
      }
    } catch (err) {
      console.error(`Failed to read image ${fileName} from app/assets:`, err);
    }
    return "";
  };

  let itcLogo = readImageAsBase64("itc.png");
  if (!itcLogo) {
    itcLogo = readImageAsBase64("itc-logo.png");
  }

  let gicLogo = readImageAsBase64("GIC.png");
  if (!gicLogo) {
    gicLogo = readImageAsBase64("gic.png");
  }

  const signature = readImageAsBase64("signature.png");
  const ornamentalRule = readImageAsBase64("ornamentalRule.png");
  const templateBorderImage = readImageAsBase64("certificate-background.jpg");

  return {
    itcLogo,
    gicLogo,
    signature,
    ornamentalRule,
    templateBorderImage,
    imageWidth: 1414,
    imageHeight: 1000,
    students,
    config,
  };
}
