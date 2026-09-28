import fs from "fs";
import path from "path";

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
  templateBorderImage: string;
  imageWidth: number;
  imageHeight: number;
  students: Student[];
}

export function getCertificateData(): CertificateAssets {
  const rootDir = process.cwd();
  const assetsDir = path.join(rootDir, "app", "assets");

  // Remove public/assets if present
  const publicAssetsDir = path.join(rootDir, "public", "assets");
  if (fs.existsSync(publicAssetsDir)) {
    try {
      fs.rmSync(publicAssetsDir, { recursive: true, force: true });
    } catch (err) {
      console.warn("Could not remove public/assets:", err);
    }
  }

  // Remove all duplicate student data, keeping only public/students.json
  const redundantStudentFiles = [
    path.join(rootDir, "app", "assets", "students.json"),
    path.join(rootDir, "app", "components", "assets", "students.json"),
  ];
  for (const filePath of redundantStudentFiles) {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`Could not delete ${filePath}:`, err);
      }
    }
  }

  // Read students strictly and only from public/students.json
  const studentsPath = path.join(rootDir, "public", "students.json");
  let students: Student[] = [];
  try {
    if (fs.existsSync(studentsPath)) {
      const raw = fs.readFileSync(studentsPath, "utf-8");
      students = JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read students.json from public:", err);
  }

  // Read images as base64 data URLs strictly from app/assets
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

  const itcLogo = readImageAsBase64("itc.png");
  let gicLogo = readImageAsBase64("GIC.png");
  if (!gicLogo) {
    gicLogo = readImageAsBase64("gic.png");
  }
  const signature = readImageAsBase64("signature.png");
  const templateBorderImage = readImageAsBase64("certificate-background.jpg");

  return {
    itcLogo,
    gicLogo,
    signature,
    templateBorderImage,
    imageWidth: 1414,
    imageHeight: 1000,
    students,
  };
}
