import { formatCertificateDates } from "./date-utils";
import type { Student, CertificateAssets } from "./assets";

export interface CertificateExportOptions {
  certificateTitle?: string;
  programTitle?: string;
  signatoryName?: string;
  signatoryRole?: string;
  locationText?: string;
  courseName?: string;
  startDate?: string;
  completionDate?: string;
}

export async function downloadCertificatePNG(
  student: Student,
  assets: CertificateAssets,
  options: CertificateExportOptions = {}
) {
  const {
    certificateTitle = assets.config?.name || "CERTIFICATE OF COMPLETION",
    programTitle = assets.config?.for || "GIC Crash Course 2026",
    signatoryName = assets.config?.signature || "Mrs. Seak Leng",
    signatoryRole = assets.config?.role || "Deputy Head of the Department of GIC",
    locationText = assets.config?.location || "Phnom Penh, Cambodia",
    courseName = options.courseName || student.course || assets.config?.subject || "Web Design",
  } = options;

  const recipientName = student.name || "Student Name";
  const sDate = options.startDate || student.start_date || assets.config?.start_date || "2024-01-15";
  const cDate = options.completionDate || student.completion_date || assets.config?.end_date || "2024-01-29";
  const dateInfo = formatCertificateDates(sDate, cDate);

  // High-Resolution A4 Landscape (aspect 297 / 210 = 1.4142857) at 300 DPI
  const width = 2970;
  const height = 2100;
  // 1cqw matches CSS container query inline-size (1% of width)
  const cqw = width / 100; // 29.7px

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Safe image loader that handles base64 data URIs and external URLs without CORS errors
  const safeLoadImage = async (src?: string): Promise<HTMLImageElement | null> => {
    if (!src) return null;
    return new Promise((resolve) => {
      const img = new Image();
      if (!src.startsWith("data:")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  // Safe letter-spacing setter
  const setLetterSpacing = (spacing: string) => {
    if ("letterSpacing" in ctx) {
      try {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = spacing;
      } catch {
        // Fallback for browsers without canvas letterSpacing
      }
    }
  };

  try {
    // Ensure document fonts are loaded before canvas text measurements
    if (typeof document !== "undefined" && document.fonts) {
      try {
        await document.fonts.ready;
      } catch {
        // Continue if font readiness check is unsupported
      }
    }

    // 1. Draw Certificate Background (Authentic border & background image)
    let bgImg: HTMLImageElement | null = null;
    if (assets.templateBorderImage) {
      bgImg = await safeLoadImage(assets.templateBorderImage);
    }

    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, width, height);
    } else {
      // Fallback elegant border if image fails
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "#004a99";
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, width - 80, height - 80);
      ctx.strokeStyle = "#c59b27";
      ctx.lineWidth = 4;
      ctx.strokeRect(58, 58, width - 116, height - 116);
    }

    // Usable content area (matching px-[10cqw] py-[10cqw] in Template.tsx)
    const paddingX = 10 * cqw; // 297px
    const contentW = width - 2 * paddingX; // 2376px
    const centerX = width / 2; // 1485px

    // 2. HEADER SECTION
    // Left: ITC Logo + Institution Name
    const leftColCenterX = paddingX + contentW * 0.14; // ~630px
    const itcImg = await safeLoadImage(assets.itcLogo);
    if (itcImg) {
      const maxLogoW = 8.5 * cqw; // ~252px
      const maxLogoH = 8.5 * cqw; // ~252px
      let lw = itcImg.naturalWidth || maxLogoW;
      let lh = itcImg.naturalHeight || maxLogoH;
      const scale = Math.min(maxLogoW / lw, maxLogoH / lh, 1);
      lw *= scale;
      lh *= scale;
      ctx.drawImage(itcImg, leftColCenterX - lw / 2, 297, lw, lh);
    }
    ctx.font = `bold ${Math.round(1.3 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    ctx.fillText("Institute of Technology of Cambodia", leftColCenterX, 297 + 8.5 * cqw + 1.3 * cqw + 8);

    // Center: Kingdom of Cambodia + Nation Religion King + Ornamental Rule
    setLetterSpacing("5px");
    ctx.font = `600 ${Math.round(2.2 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#222222";
    ctx.textAlign = "center";
    ctx.fillText("KINGDOM OF CAMBODIA", centerX, 297 + 2.5 * cqw);

    setLetterSpacing("2px");
    ctx.font = `400 ${Math.round(1.8 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#444444";
    ctx.fillText("Nation, Religion, King", centerX, 297 + 2.5 * cqw + 1.8 * cqw + 12);
    setLetterSpacing("0px");

    // Decorative Ornamental Rule
    const ornImg = await safeLoadImage(assets.ornamentalRule);
    const ornW = 18 * cqw; // ~535px
    const ornY = 297 + 2.5 * cqw + 1.8 * cqw + 26;
    if (ornImg && ornImg.naturalWidth > 0) {
      const ornH = (ornImg.naturalHeight / ornImg.naturalWidth) * ornW;
      ctx.drawImage(ornImg, centerX - ornW / 2, ornY, ornW, ornH);
    } else {
      // Fallback flourish rule
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX - ornW / 2, ornY + 6);
      ctx.lineTo(centerX + ornW / 2, ornY + 6);
      ctx.stroke();
    }

    // Right: GIC Logo + Department Name
    const rightColCenterX = width - (paddingX + contentW * 0.14); // ~2340px
    const gicImg = await safeLoadImage(assets.gicLogo);
    if (gicImg) {
      const maxGicW = 8.8 * cqw; // ~261px
      const maxGicH = 8.5 * cqw; // ~252px
      let gw = gicImg.naturalWidth || maxGicW;
      let gh = gicImg.naturalHeight || maxGicH;
      const scale = Math.min(maxGicW / gw, maxGicH / gh, 1);
      gw *= scale;
      gh *= scale;
      ctx.drawImage(gicImg, rightColCenterX - gw / 2, 297, gw, gh);
    }
    ctx.font = `bold ${Math.round(1.25 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    const gicTextY = 297 + 8.5 * cqw + 1.25 * cqw + 4;
    ctx.fillText("Department of Information and", rightColCenterX, gicTextY);
    ctx.fillText("Communication Engineering", rightColCenterX, gicTextY + 1.25 * cqw + 6);

    // 3. MAIN CERTIFICATE CONTENT
    // Title: CERTIFICATE OF COMPLETION
    setLetterSpacing("3px");
    ctx.font = `bold ${Math.round(3.8 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#004a99";
    ctx.textAlign = "center";
    ctx.fillText(certificateTitle.toUpperCase(), centerX, 745);

    // Subtitle: This certificate is proudly awarded to
    setLetterSpacing("0px");
    ctx.font = `italic 400 ${Math.round(1.6 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#555555";
    ctx.fillText("This certificate is proudly awarded to", centerX, 825);

    // Recipient Name
    setLetterSpacing("4px");
    ctx.font = `bold ${Math.round(3.0 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#004a99";
    ctx.fillText(recipientName.toUpperCase(), centerX, 940);
    setLetterSpacing("0px");

    // Course Description with responsive word-wrapping and inline bold spans
    const descFontSize = Math.round(1.5 * cqw); // ~45px
    const descLineHeight = descFontSize * 1.7; // ~76px
    const maxParagraphW = contentW * 0.9; // ~2138px

    interface Token {
      text: string;
      bold: boolean;
    }

    const descTokens: Token[] = [
      { text: "You have successfully fulfilled all the requirements and completed the intensive training for the ", bold: false },
      { text: courseName, bold: true },
      { text: " course as part of the ", bold: false },
      { text: `“${programTitle}”`, bold: true },
      { text: ". This certificate is awarded by the Department of Information and Communication Engineering in recognition of your commitment to academic excellence.", bold: false },
    ];

    // Split tokens into individual words and whitespace
    const words: Token[] = [];
    for (const token of descTokens) {
      const parts = token.text.split(/(\s+)/);
      for (const part of parts) {
        if (part) words.push({ text: part, bold: token.bold });
      }
    }

    // Build wrapped lines
    const lines: Token[][] = [];
    let currentLine: Token[] = [];
    let currentLineWidth = 0;

    for (const item of words) {
      if (item.text.trim() === "" && currentLine.length === 0) continue;

      ctx.font = item.bold
        ? `bold ${descFontSize}px 'Times New Roman', Times, serif`
        : `500 ${descFontSize}px 'Times New Roman', Times, serif`;
      const itemWidth = ctx.measureText(item.text).width;

      if (currentLineWidth + itemWidth > maxParagraphW && currentLine.length > 0) {
        lines.push(currentLine);
        if (item.text.trim() === "") {
          currentLine = [];
          currentLineWidth = 0;
        } else {
          currentLine = [item];
          currentLineWidth = itemWidth;
        }
      } else {
        currentLine.push(item);
        currentLineWidth += itemWidth;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // Render wrapped lines centered
    let paragraphY = 1045;
    for (const line of lines) {
      let totalLineWidth = 0;
      for (const item of line) {
        ctx.font = item.bold
          ? `bold ${descFontSize}px 'Times New Roman', Times, serif`
          : `500 ${descFontSize}px 'Times New Roman', Times, serif`;
        totalLineWidth += ctx.measureText(item.text).width;
      }

      let drawX = (width - totalLineWidth) / 2;
      for (const item of line) {
        ctx.font = item.bold
          ? `bold ${descFontSize}px 'Times New Roman', Times, serif`
          : `500 ${descFontSize}px 'Times New Roman', Times, serif`;
        ctx.fillStyle = item.bold ? "#000000" : "#333333";
        ctx.textAlign = "left";
        ctx.fillText(item.text, drawX, paragraphY);
        drawX += ctx.measureText(item.text).width;
      }
      paragraphY += descLineHeight;
    }

    // Date & Location
    ctx.font = `italic 400 ${Math.round(1.4 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#555555";
    ctx.textAlign = "center";
    const dateText =
      dateInfo.startMonth === dateInfo.endMonth && dateInfo.startYear === dateInfo.endYear
        ? `From ${dateInfo.startDay}${dateInfo.startSuffix} to ${dateInfo.endDay}${dateInfo.endSuffix} ${dateInfo.endMonth} ${dateInfo.endYear}, ${locationText}.`
        : `From ${dateInfo.startDay}${dateInfo.startSuffix} ${dateInfo.startMonth} to ${dateInfo.endDay}${dateInfo.endSuffix} ${dateInfo.endMonth} ${dateInfo.endYear}, ${locationText}.`;
    ctx.fillText(dateText, centerX, 1335);

    // 4. FOOTER: SIGNATURE SECTION
    // Container: w-[85%] mx-auto flex justify-end with w-[34%] max-w-[36cqw] block
    const sigBlockWidth = contentW * 0.85 * 0.34; // ~686px
    const rightMargin = (contentW * 0.15) / 2;
    const sigRightX = paddingX + contentW - rightMargin; // ~2495px
    const sigLeftX = sigRightX - sigBlockWidth; // ~1809px
    const sigCenterX = (sigLeftX + sigRightX) / 2; // ~2152px
    const sigLineY = 1680;

    // Draw Signature Image
    const sigImg = await safeLoadImage(assets.signature);
    if (sigImg) {
      const maxSigW = sigBlockWidth * 0.85;
      const maxSigH = 6.5 * cqw; // ~193px
      let sw = sigImg.naturalWidth || maxSigW;
      let sh = sigImg.naturalHeight || maxSigH;
      const scale = Math.min(maxSigW / sw, maxSigH / sh, 1);
      sw *= scale;
      sh *= scale;
      ctx.drawImage(sigImg, sigCenterX - sw / 2, sigLineY - sh - 4, sw, sh);
    }

    // Signature Divider Line
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sigLeftX, sigLineY);
    ctx.lineTo(sigRightX, sigLineY);
    ctx.stroke();

    // Signatory Name
    ctx.font = `bold ${Math.round(1.5 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(signatoryName, sigCenterX, sigLineY + 1.5 * cqw + 6);

    // Signatory Role
    ctx.font = `400 ${Math.round(1.3 * cqw)}px 'Times New Roman', Times, serif`;
    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    ctx.fillText(signatoryRole, sigCenterX, sigLineY + 1.5 * cqw + 6 + 1.35 * (1.3 * cqw));

    // 5. Trigger High-Quality PNG Download via Blob URL
    const safeName = recipientName.replace(/[^a-zA-Z0-9]/g, "_");
    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          try {
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `Certificate-${safeName}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve();
          } catch (e) {
            reject(e);
          }
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `Certificate-${safeName}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        resolve();
      }, "image/png");
    });
  } catch (err) {
    console.error("Canvas export failed:", err);
  }
}
