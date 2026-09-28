import { formatCertificateDates } from "./date-utils";
import type { Student, CertificateAssets } from "./assets";

export async function downloadCertificatePNG(
  student: Student,
  assets: CertificateAssets,
  options: {
    certificateTitle?: string;
    programTitle?: string;
    signatoryName?: string;
    signatoryRole?: string;
    locationText?: string;
  } = {}
) {
  const {
    certificateTitle = assets.config?.name || "CERTIFICATE OF COMPLETION",
    programTitle = assets.config?.for || "GIC Crash Course 2026",
    signatoryName = assets.config?.signature || "Mrs. Seak Leng",
    signatoryRole = assets.config?.role || "Deputy Head of the Department of GIC",
    locationText = assets.config?.location || "Phnom Penh, Cambodia",
  } = options;

  const dateInfo = formatCertificateDates(student.start_date, student.completion_date);

  // A4 Landscape high-res: 2480 x 1754
  const width = 2480;
  const height = 1754;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  try {
    // 1. Draw outer template image (border)
    if (assets.templateBorderImage) {
      const borderImg = await loadImage(assets.templateBorderImage);
      ctx.drawImage(borderImg, 0, 0, width, height);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "#1b4332";
      ctx.lineWidth = 40;
      ctx.strokeRect(20, 20, width - 40, height - 40);
    }

    // 2. Clear / Fill inner certificate canvas
    const innerX = width * 0.054;
    const innerY = height * 0.068;
    const innerW = width * 0.892;
    const innerH = height * 0.864;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(innerX, innerY, innerW, innerH);

    // Exact Thin Inner Hairline Border Rectangle from image.png
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(innerX + 16, innerY + 16, innerW - 32, innerH - 32);

    // 3. Repeating horizontal subtle watermark text
    ctx.save();
    ctx.beginPath();
    ctx.rect(innerX + 16, innerY + 16, innerW - 32, innerH - 32);
    ctx.clip();

    ctx.fillStyle = "rgba(140, 123, 102, 0.16)";
    ctx.font = "bold 14px 'Times New Roman', serif";
    const wmText = "Institut de Technologie du Cambodge, វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា, Institut de Technologie du Cambodge, ";
    const textMetrics = ctx.measureText(wmText);
    const stepX = textMetrics.width;
    const stepY = 46;

    for (let y = innerY; y < innerY + innerH + 100; y += stepY) {
      const offsetX = ((Math.floor(y / stepY)) % 2) * (stepX / 2.5);
      for (let x = innerX - 200 + offsetX; x < innerX + innerW + 200; x += stepX) {
        ctx.fillText(wmText, x, y);
      }
    }
    ctx.restore();

    // 4. Center ITC Seal Watermark (Rotated counter-clockwise by -22deg)
    if (assets.itcLogo) {
      const sealImg = await loadImage(assets.itcLogo);
      const sealSize = 750;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((-22 * Math.PI) / 180);
      ctx.globalAlpha = 0.14;
      ctx.drawImage(sealImg, -sealSize / 2, -sealSize / 2, sealSize, sealSize);
      ctx.restore();
    }

    // 5. Header Logos & Titles
    // Left: ITC Logo
    if (assets.itcLogo) {
      const itcImg = await loadImage(assets.itcLogo);
      const itcW = 170;
      const itcH = 170;
      const itcX = innerX + 120;
      const itcY = innerY + 50;
      ctx.drawImage(itcImg, itcX, itcY, itcW, itcH);

      ctx.fillStyle = "#000000";
      ctx.font = "bold 23px 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.fillText("Institute of Technology of Cambodia", itcX + itcW / 2, itcY + itcH + 32);
    }

    // Right: GIC Logo
    if (assets.gicLogo) {
      const gicImg = await loadImage(assets.gicLogo);
      const gicW = 195;
      const gicH = 135;
      const gicX = innerX + innerW - 120 - gicW;
      const gicY = innerY + 68;
      ctx.drawImage(gicImg, gicX, gicY, gicW, gicH);

      ctx.fillStyle = "#000000";
      ctx.font = "bold 21px 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.fillText("Department of Information and", gicX + gicW / 2, gicY + gicH + 34);
      ctx.fillText("Communication Engineering", gicX + gicW / 2, gicY + gicH + 60);
    }

    // Center: Kingdom of Cambodia & Motto
    const centerX = width / 2;
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 36px 'Times New Roman', serif";

    const setSpacing = (val: string) => {
      if ("letterSpacing" in ctx) {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = val;
      }
    };

    setSpacing("4px");
    ctx.fillText("KINGDOM OF CAMBODIA", centerX, innerY + 115);

    ctx.font = "400 27px 'Times New Roman', serif";
    setSpacing("1px");
    ctx.fillText("Nation, Religion, King", centerX, innerY + 160);

    // Decorative Flourish Divider
    if (assets.ornamentalRule) {
      const ornImg = await loadImage(assets.ornamentalRule);
      const ornW = 280;
      const ornH = (ornImg.naturalHeight / ornImg.naturalWidth) * ornW;
      ctx.drawImage(ornImg, centerX - ornW / 2, innerY + 175, ornW, ornH);
    } else {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 190, innerY + 195);
      ctx.quadraticCurveTo(centerX - 80, innerY + 190, centerX - 30, innerY + 195);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 30, innerY + 195);
      ctx.quadraticCurveTo(centerX + 80, innerY + 190, centerX + 190, innerY + 195);
      ctx.stroke();

      // Center circle & flanking beads
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(centerX, innerY + 195, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX, innerY + 195, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(centerX - 18, innerY + 195, 4.5, 0, Math.PI * 2);
      ctx.arc(centerX + 18, innerY + 195, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. CERTIFICATE OF COMPLETION: #005d9e in Times New Roman Bold
    setSpacing("5px");
    ctx.font = "bold 65px 'Times New Roman', serif";
    ctx.fillStyle = "#005d9e";
    ctx.fillText(certificateTitle.toUpperCase(), centerX, innerY + 415);

    // 7. Subheading: Italic Times New Roman
    setSpacing("1px");
    ctx.font = "italic 400 28px 'Times New Roman', serif";
    ctx.fillStyle = "#000000";
    ctx.fillText("This certificate is proudly awarded to", centerX, innerY + 500);

    // 8. Recipient Name: #005d9e in Times New Roman Bold
    setSpacing("3px");
    ctx.font = "bold 60px 'Times New Roman', serif";
    ctx.fillStyle = "#005d9e";
    ctx.fillText(student.name.toUpperCase(), centerX, innerY + 600);

    // 9. Course Description
    setSpacing("0px");
    ctx.font = "400 26px 'Times New Roman', serif";
    ctx.fillStyle = "#000000";

    const line1 = `You have successfully fulfilled all the requirements and completed the intensive training for the`;
    const line2 = `${student.course} course as part of the “${programTitle}”. This certificate is awarded by the`;
    const line3 = `Department of Information and Communication Engineering in recognition of your commitment to academic excellence.`;

    ctx.fillText(line1, centerX, innerY + 705);

    ctx.font = "bold 26px 'Times New Roman', serif";
    ctx.fillText(line2, centerX, innerY + 750);

    ctx.font = "400 26px 'Times New Roman', serif";
    ctx.fillText(line3, centerX, innerY + 795);

    // 10. Date & Location: Italic
    ctx.font = "italic 400 25px 'Times New Roman', serif";
    const dateText =
      dateInfo.startMonth === dateInfo.endMonth && dateInfo.startYear === dateInfo.endYear
        ? `From ${dateInfo.startDay}${dateInfo.startSuffix} to ${dateInfo.endDay}${dateInfo.endSuffix} ${dateInfo.endMonth} ${dateInfo.endYear}, ${locationText}.`
        : `From ${dateInfo.startDay}${dateInfo.startSuffix} ${dateInfo.startMonth} to ${dateInfo.endDay}${dateInfo.endSuffix} ${dateInfo.endMonth} ${dateInfo.endYear}, ${locationText}.`;
    ctx.fillText(dateText, centerX, innerY + 890);

    // 11. Signature Section (Bottom Right - NO divider line, exact signature position)
    const sigX = innerX + innerW - 500;
    const sigY = innerY + innerH - 330;

    if (assets.signature) {
      const sigImg = await loadImage(assets.signature);
      const sigW = 290;
      const sigH = 145;
      ctx.drawImage(sigImg, sigX + 55, sigY - 25, sigW, sigH);
    }

    // Signatory name & role directly below signature
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 25px 'Times New Roman', serif";
    ctx.fillText(signatoryName, sigX + 200, sigY + 145);

    ctx.font = "400 21px 'Times New Roman', serif";
    ctx.fillText(signatoryRole, sigX + 200, sigY + 180);

    // Trigger download
    const safeName = student.name.replace(/[^a-zA-Z0-9]/g, "_");
    const link = document.createElement("a");
    link.download = `Certificate-${safeName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Canvas export failed:", err);
  }
}
