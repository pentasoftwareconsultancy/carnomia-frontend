// src/pages/admin/InspectionReportPdf.jsx
import { jsPDF } from "jspdf";
import ApiService from './../../core/services/api.service';

/** =========================================================================
 * THEME + GEOMETRY
 * ========================================================================= */
const mm = (n) => n; // jsPDF unit is set to "mm"
const THEME = {
  brandDark: "#0b3c49",
  brandMid: "#1a6a7a",
  brandLight: "#e6f5f8",
  good: "#10b981",
  softLine: "#e5e7eb",
  faintLine: "#f1f5f9",
  text: "#111827",
  subtext: "#6b7280",
  chipText: "#133a46",
  boxStroke: "#cbd5e1",
  accentBlue: "#2563eb",
};

const A4 = { w: 210, h: 297 };
const PAGE_PAD_X = 18;
const GRID = {
  cardRadius: 5,
  cardPad: 4,
  hero: { x: 26, y: 32, w: 110, h: 62 },
  scoreCard: { w: 42, h: 35 },
};

/** =========================================================================
 * IMAGE HELPERS (robust URL → DataURL with fallback)
 * ========================================================================= */


async function urlToDataURL(url, preferPngFallback = false, timeoutMs = 10000) {
  if (!url || typeof url !== "string" || url.trim() === "") {
    console.warn(`Invalid or missing URL: ${url}`);
    return null;
  }

  try {
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      const fr = new FileReader();
      return await new Promise((resolve, reject) => {
        fr.onload = () => resolve(fr.result);
        fr.onerror = () => {
          console.warn(`FileReader failed for ${url}`);
          reject(null);
        };
        fr.readAsDataURL(blob);
      });
    } else {
      console.warn(`Fetch failed for ${url}: HTTP ${res.status} ${res.statusText}`);
      return null;
    }
  } catch (err) {
    console.warn(`Fetch/network error for ${url}: ${err.message}`);
    if (err.message.includes("NetworkError") || err.message.includes("CORS")) {
      console.warn(`CORS issue detected for ${url}. Check server CORS headers.`);
      return null;
    }
  }

  // Fallback using <img> + canvas with timeout
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const timer = setTimeout(() => {
        img.src = ""; // Cancel loading
        reject(new Error(`Image load timeout after ${timeoutMs}ms: ${url}`));
      }, timeoutMs);

      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const format = preferPngFallback ? "image/png" : "image/jpeg";
          resolve(canvas.toDataURL(format, 0.92));
        } catch (ex) {
          reject(ex);
        }
      };

      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error(`Image load failed (canvas fallback): ${url}`));
      };
      img.src = url;
    });
  } catch (err) {
    console.warn(`Canvas fallback failed for ${url}: ${err.message}`);
    return null;
  }
}



/** =========================================================================
 * DRAWING HELPERS
 * ========================================================================= */
function setText(doc, color = THEME.text, size = 10) {
  doc.setTextColor(color);
  doc.setFontSize(size);
  doc.setFont("helvetica", "normal"); // Ensure consistent font
}

function roundedRect(doc, x, y, w, h, r = 4, fill, stroke) {
  if (fill) doc.setFillColor(fill);
  if (stroke) doc.setDrawColor(stroke);
  const mode = fill ? (stroke ? "FD" : "F") : "S";
  doc.roundedRect(x, y, w, h, r, r, mode);
}

function divider(doc, x1, y, x2, color = THEME.softLine) {
  doc.setDrawColor(color);
  doc.line(x1, y, x2, y);
}

function labelValue(doc, label, value, x, y) {
  setText(doc, THEME.subtext, 8);
  doc.text(label, x, y);
  setText(doc, THEME.text, 10);
  doc.text(String(value ?? "—"), x, y + 4.3);
}

function chip(doc, text, x, y, bg = THEME.brandLight) {
  const padX = 2.8;
  const w = doc.getTextWidth(text) + padX * 2;
  roundedRect(doc, x, y - 5.8, w, 6.8, 2, bg, "#dbeafe");
  setText(doc, THEME.chipText, 8);
  doc.text(text, x + padX, y - 1.8);
  setText(doc);
}

function sectionHeader(doc, title, y, subtitle) {
  setText(doc, THEME.brandDark, 11);
  doc.text(title, PAGE_PAD_X, y);
  divider(doc, PAGE_PAD_X, y + 2, A4.w - PAGE_PAD_X);
  if (subtitle) {
    setText(doc, THEME.subtext, 8.7);
    doc.text(subtitle, PAGE_PAD_X, y + 7.8);
  }
  setText(doc);
}

function metricPill(doc, x, y, label, value) {
  roundedRect(doc, x, y, 24, 14, 3, "#0f172a", "#0f172a");
  setText(doc, "#ffffff", 7.3);
  doc.text(label, x + 3, y + 5);
  setText(doc, "#ffffff", 9.5);
  doc.text(String(value), x + 3, y + 11); // Ensure ASCII compatibility
  setText(doc);
}

function labeledPhotoBox(doc, label, x, y, w = 50, h = 50) {
  setText(doc, THEME.subtext, 8);
  doc.text(label, x, y - 1.8);
  setText(doc);
  roundedRect(doc, x, y, w, h, 4, undefined, THEME.boxStroke);
}

async function drawThumbRow(doc, urls = [], x, y, w = 14, h = 14, cols = 3, gap = 4) {
  let i = 0;
  // Filter out invalid URLs
  const validUrls = (urls || []).filter((url) => typeof url === "string" && url.trim() !== "");
  for (let url of validUrls) {
    try {
      const finalUrl = url.startsWith("http") ? url : `http://localhost:3000${url}`;
      const dataURL = await urlToDataURL(finalUrl);
      if (dataURL) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const posX = x + col * (w + gap);
        const posY = y - row * (h + gap);
        const format = dataURL.match(/^data:image\/(\w+);base64,/)?.[1]?.toUpperCase() || "JPEG";
        doc.addImage(dataURL, format, posX, posY, w, h, undefined, "FAST");
        i++;
      } else {
        console.warn(`Image not loaded: ${url}`);
      }
    } catch (err) {
      console.error(`Error loading image: ${url}`, err);
    }
  }
}

function checkmark(doc, x, y, checked) {
  roundedRect(doc, x, y - 3.5, 3.5, 3.5, 0.8, "#fff", THEME.boxStroke);
  if (checked) {
    // Draw checkmark using lines to avoid font glyph issues
    doc.setDrawColor(THEME.good);
    doc.setLineWidth(0.5);
    doc.line(x + 0.8, y - 1.8, x + 1.5, y - 0.5); // \
    doc.line(x + 1.5, y - 0.5, x + 2.8, y - 2.8); // /
    doc.setLineWidth(0.2); // Reset line width
  }
}

/** =========================================================================
 * PAGE FRAMING (header band + footer)
 * ========================================================================= */

// helper to load image from public folder
async function loadImageAsBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function drawTopBand(doc) {
  // Header background band
  roundedRect(doc, mm(12), mm(12), mm(186), mm(10), 3, THEME.brandDark, THEME.brandDark);

  // Load logo from public folder (put your logo in /public/carnomia.png)
  const logoBase64 = await loadImageAsBase64("/carnomia.png");

  // Add logo inside the band
  const logoWidth = 20;  // adjust
  const logoHeight = 8;  // adjust
  const logoX = mm(14);
  const logoY = mm(13);

  doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);

  // Add report title on the right
  setText(doc, "#ffffff", 11);
  doc.text("PDI Report", mm(186), mm(18), { align: "right" });
  setText(doc);
}

function drawFooter(doc) {
  setText(doc, THEME.subtext, 8);
  doc.text(
    `Generated by Carnomia • ${new Date().toLocaleString()}`,
    mm(105),
    mm(287),
    { align: "center" }
  );
  setText(doc);
}


async function addCoverPage(doc, r) {
  drawTopBand(doc);

  /** ==============================
   * BOOKING HEADER
   * ============================== */
  setText(doc, THEME.subtext, 8.5);
  doc.text(`Booking ID: ${String(r.bookingId ?? "—")}`, PAGE_PAD_X, mm(18));
  setText(doc);

  /** ==============================
   * HERO IMAGE + SCORE CARD
   * ============================== */
  const TOP_OFFSET = 20;
  const HERO = { x: 18, y: TOP_OFFSET + 20, w: 110, h: 55 };
  const SCORE = { x: HERO.x + HERO.w + 10, y: HERO.y, w: 65, h: HERO.h };

  // Hero box
  roundedRect(doc, mm(HERO.x), mm(HERO.y), mm(HERO.w), mm(HERO.h), 6, "#fff", THEME.softLine);

  if (r.imageUrl) {
    try {
      doc.addImage(r.imageUrl, "JPEG", mm(HERO.x), mm(HERO.y), mm(HERO.w), mm(HERO.h), undefined, "FAST");
    } catch (err) {
      console.warn("Hero image failed:", err);
    }
  }

  // Score Card box
  roundedRect(doc, mm(SCORE.x), mm(SCORE.y), mm(SCORE.w), mm(SCORE.h), 6, "#fff", THEME.softLine);

  setText(doc, THEME.subtext, 8);
  doc.text("Overall Vehicle Score", mm(SCORE.x + 4), mm(SCORE.y + 8));

  // Circle
  doc.setDrawColor(THEME.good);
  doc.circle(mm(SCORE.x + SCORE.w / 2), mm(SCORE.y + 20), 10, "S");

  // Score value
  setText(doc, THEME.text, 16);
  doc.text(String(r.vehicleScore ?? "9.2"), mm(SCORE.x + SCORE.w / 2 - 4), mm(SCORE.y + 23));

  // Status "GOOD"
  setText(doc, THEME.good, 9);
  doc.text("GOOD", mm(SCORE.x + SCORE.w / 2 - 10), mm(SCORE.y + 35));

  // Description
  setText(doc, THEME.subtext, 6.5);
  const desc = r.scoreComment ??
    "This score signifies that the car is free of defects arising out of manufacturing, mishandling at dealer premise / during travel & shipment. Asset and Driver Safety is not compromised.";
  doc.text(desc, mm(SCORE.x + 4), mm(SCORE.y + 42), {
    maxWidth: mm(SCORE.w - 8),
    align: "left"
  });

  /** ==============================
   * METRICS ROW
   * ============================== */
  const metrics = [
    { label: "BHPs", value: String(r.BHPs ?? "150") },
    { label: "Airbags", value: String(r.Airbags ?? "6") },
    { label: "NCAP", value: String(r.NCAP ?? "5 Star") },
    { label: "Mileage", value: String(r.Mileage ?? "17 kmpl") },
  ];

  const METRIC_Y = HERO.y + HERO.h + 15;
  const BOX_W = 35, BOX_H = 14, SPACING = 6;

  metrics.forEach((m, i) => {
    const x = mm(HERO.x + i * (BOX_W + SPACING));
    roundedRect(doc, x, mm(METRIC_Y), mm(BOX_W), mm(BOX_H), 3, "#fff", THEME.softLine);

    setText(doc, THEME.subtext, 7.5);
    doc.text(m.label, x + mm(BOX_W / 2), mm(METRIC_Y + 5), { align: "center" });

    setText(doc, THEME.text, 10);
    doc.text(m.value, x + mm(BOX_W / 2), mm(METRIC_Y + 11), { align: "center" });
  });

  /** ==============================
   * INFO CARDS (Customer + Vehicle)
   * ============================== */
  const CARD_Y = METRIC_Y + BOX_H + 12;
  const CARD_W = 85, CARD_H = 68, GAP = 10;

  const leftX = HERO.x;
  const rightX = HERO.x + CARD_W + GAP;

  // CUSTOMER INFO
  roundedRect(doc, mm(leftX), mm(CARD_Y), mm(CARD_W), mm(CARD_H), 4, "#fff", THEME.softLine);
  setText(doc, THEME.text, 9.5);
  doc.text("Customer Info", mm(leftX + 5), mm(CARD_Y + 8));
  divider(doc, mm(leftX + 4), mm(CARD_Y + 10), mm(leftX + CARD_W - 4), THEME.faintLine);

  labelValue(doc, "Name", r.customerName, mm(leftX + 5), mm(CARD_Y + 16));
  labelValue(doc, "Location", r.address, mm(leftX + 45), mm(CARD_Y + 16));
  labelValue(doc, "Engineer Name", r.engineer_name, mm(leftX + 5), mm(CARD_Y + 24));
  labelValue(doc, "PDI Date & Time",
    `${r.date ? new Date(r.date).toLocaleDateString() : "—"} ${r.engineer_assignedSlot ?? ""}`,
    mm(leftX + 5), mm(CARD_Y + 32)
  );
  labelValue(doc, "Address", r.address, mm(leftX + 5), mm(CARD_Y + 40));

  // VEHICLE INFO
  roundedRect(doc, mm(rightX), mm(CARD_Y), mm(CARD_W), mm(CARD_H), 4, "#fff", THEME.softLine);
  setText(doc, THEME.text, 9.5);
  doc.text("Vehicle Info", mm(rightX + 5), mm(CARD_Y + 8));
  divider(doc, mm(rightX + 4), mm(CARD_Y + 10), mm(rightX + CARD_W - 4), THEME.faintLine);

  labelValue(doc, "Brand", r.brand, mm(rightX + 5), mm(CARD_Y + 16));
  labelValue(doc, "Model", r.model, mm(rightX + 45), mm(CARD_Y + 16));
  labelValue(doc, "Car Status", r.carStatus, mm(rightX + 5), mm(CARD_Y + 24));
  labelValue(doc, "VIN No.", r.vinNumber, mm(rightX + 45), mm(CARD_Y + 24));
  labelValue(doc, "Variant", r.variant, mm(rightX + 5), mm(CARD_Y + 32));
  labelValue(doc, "Transmission", r.transmissionType, mm(rightX + 45), mm(CARD_Y + 32));
  labelValue(doc, "Fuel", r.fuelType, mm(rightX + 5), mm(CARD_Y + 40));
  labelValue(doc, "Engine", r.engineNumber, mm(rightX + 45), mm(CARD_Y + 40));
  // labelValue(doc, "Engine Type", r.engineType, mm(rightX + 5), mm(CARD_Y + 48));
  // labelValue(doc, "Emission", r.emission, mm(rightX + 45), mm(CARD_Y + 48));
  labelValue(doc, "Keys", String(r.keys), mm(rightX + 45), mm(CARD_Y + 56));

  /** ==============================
   * RUNNING BAR
   * ============================== */
  const BAR_Y = CARD_Y + CARD_H + 18;
  const BAR_W = 160, BAR_H = 8;

  sectionHeader(doc, "How Much Has My Car Been Driven Before The PDI Date?", BAR_Y);

  // Background bar
  roundedRect(doc, mm(leftX), mm(BAR_Y + 10), mm(BAR_W), mm(BAR_H), 3, "#e5e5e5", "#e5e5e5");

  // Foreground bar
  const kms = isNaN(parseInt(r.kmsDriven)) ? 55 : parseInt(r.kmsDriven);
  const fgWidth = Math.min((kms / 130) * BAR_W, BAR_W);
  roundedRect(doc, mm(leftX), mm(BAR_Y + 10), mm(fgWidth), mm(BAR_H), 3, "#4CAF50", "#4CAF50");

  // Labels
  setText(doc, "#065f46", 9);
  doc.text("My Car's Running", mm(leftX), mm(BAR_Y + 8));

  doc.setFont(undefined, "bold");
  doc.text(String(r.kmsDriven ?? "55 Kms"), mm(leftX + BAR_W), mm(BAR_Y + 8), { align: "right" });
  doc.setFont(undefined, "normal");

  // Chip
  chip(doc, String(r.tamperingStatus ?? "No Tampering"), mm(leftX + BAR_W - 40), mm(BAR_Y + 22));

  // Avg Running
  setText(doc, THEME.text, 9.5);
  doc.text("Avg. Running Before Delivery", mm(leftX), mm(BAR_Y + 38));
  doc.setFont(undefined, "bold");
  doc.text(String(r.avgRunning ?? "39 Kms"), mm(leftX), mm(BAR_Y + 44));

  // Details
  setText(doc, THEME.subtext, 8);
  doc.text(
    `Details - At the time of PDI, your car's ODO reading was ${String(r.kmsDriven ?? "55 Kms")}, which is slightly above the city average of ${String(r.avgRunning ?? "39 Kms")}.`,
    mm(leftX),
    mm(BAR_Y + 54),
    { maxWidth: mm(BAR_W) }
  );

  /** ==============================
   * FOOTER
   * ============================== */
  drawFooter(doc);
}

/** =========================================================================
 * PAGE 2: PROFILE PHOTOS (360)
 * ========================================================================= */
async function addProfilePhotosPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);

  sectionHeader(
    doc,
    "Profile Photos",
    mm(28),
    "Your Car’s 360° View • Check each side for a complete visual record"
  );

  const pageWidth = A4.w;
  const photoBoxWidth = 50;
  const gap = 16;
  const gridWidth = photoBoxWidth * 2 + gap;
  const startX = (pageWidth - gridWidth) / 2;

  const cells = [
    { label: "1. Front Left View", x: startX, y: mm(50), url: r.front_left_imageUrl },
    { label: "2. Rear Left View", x: startX + photoBoxWidth + gap, y: mm(50), url: r.rear_left_imageUrl },
    { label: "3. Rear Right View", x: startX, y: mm(120), url: r.rear_right_imageUrl },
    { label: "4. Front Right View", x: startX + photoBoxWidth + gap, y: mm(120), url: r.front_right_imageUrl },
  ];

  for (const c of cells) {
    labeledPhotoBox(doc, c.label, c.x, c.y, photoBoxWidth, photoBoxWidth);
    if (typeof c.url === "string" && c.url.trim()) {
      const data = await urlToDataURL(c.url);
      if (data) {
        const format = data.match(/^data:image\/(\w+);base64,/)?.[1]?.toUpperCase() || "JPEG";
        doc.addImage(data, format, c.x + 1.2, c.y + 1.2, photoBoxWidth - 2.4, photoBoxWidth - 2.4, undefined, "FAST");
      } else {
        console.warn(`Image not loaded: ${c.label} (${c.url})`);
      }
    } else {
      console.warn(`Invalid or missing URL for ${c.label}`);
    }
  }

  drawFooter(doc);
}
/** =========================================================================
 * PAGE 3: BODY PANELS (table with thumbnails)
 * ========================================================================= */

async function addBodyPanelsPage(doc, r) {
  function renderHeaders(y, title = "Body Panels") {
    sectionHeader(doc, title, y); // Section title
    const headers = ["Parts", "Paint Thickness (mm)", "Issue", "Cladding", "Repaint"];
    const colX = [mm(20), mm(64), mm(97), mm(124), mm(142)];
    const headerY = y + mm(14); // space below title

    setText(doc, THEME.subtext, 9);
    headers.forEach((h, i) => doc.text(h, colX[i], headerY));
    setText(doc);

    divider(doc, mm(18), headerY + 2, mm(192));
    return { colX, startY: headerY + 6 }; // return col positions + next row start
  }

  const PAGE_TOP_SPACING = mm(36); // more space from top for first page and others
  doc.addPage("a4", "portrait");
  drawTopBand(doc);

  let { colX } = renderHeaders(PAGE_TOP_SPACING);
  let y = PAGE_TOP_SPACING + mm(22); // start below headers

  const rows = [
     { label: "Bonnet", key: "bonnet", repaintKey: "bonnet_repaint" },
    { label: "Bumper", key: "bumper" },
    { label: "Front Left Fender", key: "front_left_fender", claddingKey: "front_left_fender_cladding", repaintKey: "front_left_fender_repaint" },
    { label: "Front Left Door", key: "front_left_door", claddingKey: "front_left_door_cladding" },
    { label: "Rear Left Door", key: "rear_left_door", claddingKey: "rear_left_door_cladding" },
    { label: "Rear Left Quarter Panel", key: "rear_left_quarter_panel", claddingKey: "rear_left_quarter_panel_cladding" },
    { label: "Boot", key: "boot" },
    { label: "Rear Bumper", key: "rear_bumper" },
    { label: "Rear Right Quarter Panel", key: "rear_right_quarter_panel", claddingKey: "rear_right_quarter_panel_cladding" },
    { label: "Rear Right Door", key: "rear_right_door", claddingKey: "rear_right_door_cladding" },
    { label: "Front Right Door", key: "front_right_door", claddingKey: "front_right_door_cladding" },
    { label: "Front Right Fender", key: "front_right_fender", claddingKey: "front_right_fender_cladding" },
    { label: "Roof", key: "roof" },
    { label: "Front Windshield", key: "front_windshield" },
  ];

  for (const row of rows) {
    const urls = Array.isArray(r[`${row.key}_imageUrls`]) ? r[`${row.key}_imageUrls`] : [];
    const cladding = Array.isArray(r[`${row.claddingKey}_issues`]) && r[`${row.claddingKey}_issues`].length > 0 
      ? r[`${row.claddingKey}_issues`].join(", ")
      : "—";
    const repaint = row.repaintKey ? (r[row.repaintKey] ? "Yes" : "No") : "—";
    const issue = Array.isArray(r[`${row.key}_issues`]) && r[`${row.key}_issues`].length > 0
      ? r[`${row.key}_issues`].join(", ")
      : "—";

    const labelText = doc.splitTextToSize(row.label, colX[1] - colX[0] - 2);
    const paintText = doc.splitTextToSize(String(r[`${row.key}_paintThickness`] ?? "NA"), colX[2] - colX[1] - 2);
    const issueText = doc.splitTextToSize(issue, colX[3] - colX[2] - 2);
    const claddingText = doc.splitTextToSize(cladding, colX[4] - colX[3] - 2);
    const repaintText = doc.splitTextToSize(repaint, colX[5] - colX[4] - 2);

    const maxLines = Math.max(labelText.length, paintText.length, issueText.length, claddingText.length, repaintText.length);
    const lineHeight = 5;
    const rowHeight = maxLines * lineHeight;

    setText(doc, THEME.text, 9);
    doc.text(labelText, colX[0], y);
    doc.text(paintText, colX[1], y);
    doc.text(issueText, colX[2], y);
    doc.text(claddingText, colX[3], y);
    doc.text(repaintText, colX[4], y);

    y += rowHeight + 4;

    // New row for images below text
    if (urls.length > 0) {
      const maxImages = Math.min(5, urls.length);
      const imageSize = 20;
      const spacing = 10;
      let x = mm(20);
      for (let i = 0; i < maxImages; i++) {
        try {
          doc.addImage(urls[i], "JPEG", x, y, imageSize, imageSize);
          x += imageSize + spacing;
        } catch (err) {
          console.warn("Image load failed:", err);
        }
      }
      y += imageSize + 6;
    } else {
      setText(doc, THEME.subtext, 8);
      doc.text("No photos available", mm(20), y + 4);
      y += 12;
    }

    divider(doc, mm(18), y, mm(192), THEME.faintLine);
    y += 6;

    // Pagination: new page if y is too low
    if (y > mm(250)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      ({ colX } = renderHeaders(PAGE_TOP_SPACING, "Body Panels")); // header on new page
      y = PAGE_TOP_SPACING + mm(22); // reset Y below header
    }
  }

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 4: GLASSES
 * ========================================================================= */
async function addGlassesPage(doc, r) {
  // Utility to render section header + column headers
  function renderHeaders(y, title = "Glasses") {
    sectionHeader(doc, title, y);

    const headers = ["Glass Part", "Brand", "Manufacturing Date", "Issues"];
    const colX = [mm(20), mm(60), mm(100), mm(140)];
    const headerY = y + mm(14);

    setText(doc, THEME.subtext, 9);
    headers.forEach((h, i) => doc.text(h, colX[i], headerY));
    setText(doc);

    divider(doc, mm(18), headerY + 2, mm(192));
    return { colX, startY: headerY + 6 };
  }

  const PAGE_TOP_SPACING = mm(36); // space from top for header
  doc.addPage("a4", "portrait");
  drawTopBand(doc);

  let { colX } = renderHeaders(PAGE_TOP_SPACING);
  let y = PAGE_TOP_SPACING + mm(22); // start below headers

  // Define glass parts
  const rows = [
    { label: "Front Windshield", key: "front_windshield" },
    { label: "Front Left Door Glass", key: "front_left_door_glass" },
    { label: "Left ORVM", key: "left_side_orvm" },
    { label: "Rear Left Door Glass", key: "rear_left_door_glass" },
    { label: "Rear Left Quarter Glass", key: "rear_left_quarter_glass" },
    { label: "Rear Windshield", key: "rear_windshield" },
    { label: "Rear Right Quarter Glass", key: "rear_right_quarter_glass" },
    { label: "Rear Right Door Glass", key: "rear_right_door_glass" },
    { label: "Front Right Door Glass", key: "front_right_door_glass" },
    { label: "Right ORVM", key: "right_side_orvm" },
    { label: "Sunroof Glass", key: "sunroof_glass" },
  ];

  for (const row of rows) {
    const brand = r[`${row.key}_brand`] ?? "—";
    const mfgDate = r[`${row.key}_manufacturingDate`] ?? "—";
    const issues = Array.isArray(r[`${row.key}_issues`]) && r[`${row.key}_issues`].length > 0
      ? r[`${row.key}_issues`].join(", ")
      : "—";
    const urls = Array.isArray(r[`${row.key}_imageUrls`]) ? r[`${row.key}_imageUrls`] : [];

    // Wrap text for columns
    const labelText = doc.splitTextToSize(row.label, colX[1] - colX[0] - 2);
    const brandText = doc.splitTextToSize(brand, colX[2] - colX[1] - 2);
    const dateText = doc.splitTextToSize(mfgDate, colX[3] - colX[2] - 2);
    const issuesText = doc.splitTextToSize(issues, mm(192) - colX[3] - 2); // remaining width

    const maxLines = Math.max(labelText.length, brandText.length, dateText.length, issuesText.length);
    const lineHeight = 5;
    const rowHeight = maxLines * lineHeight;

    // Print text columns
    setText(doc, THEME.text, 9.5);
    doc.text(labelText, colX[0], y);
    doc.text(brandText, colX[1], y);
    doc.text(dateText, colX[2], y);
    doc.text(issuesText, colX[3], y);

    y += rowHeight + 4;

    // Draw images in separate row
    if (urls.length > 0) {
      const maxImages = Math.min(5, urls.length);
      const imageSize = 20;
      const spacing = 10;
      let x = mm(20);
      for (let i = 0; i < maxImages; i++) {
        try {
          doc.addImage(urls[i], "JPEG", x, y, imageSize, imageSize);
          x += imageSize + spacing;
        } catch (err) {
          console.warn("Image load failed:", err);
        }
      }
      y += imageSize + 6;
    } else {
      setText(doc, THEME.subtext, 8);
      doc.text("No photos available", mm(20), y + 3);
      y += 12;
    }

    // Divider under the record
    divider(doc, mm(18), y, mm(192), THEME.faintLine);
    y += 6;

    // Pagination
    if (y > mm(250)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      ({ colX } = renderHeaders(PAGE_TOP_SPACING, "Glasses (contd.)"));
      y = PAGE_TOP_SPACING + mm(22);
    }
  }

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 5: RUBBER
 * ========================================================================= */
async function addRubberPage(doc, r) {
  const PAGE_TOP_SPACING = mm(28); // space from top for header

  // Utility to render section header + column headers
  function renderHeader(y, title = "Rubber") {
    sectionHeader(doc, title, y);
    const headerY = y + mm(14); // spacing below title
    setText(doc, THEME.subtext, 9);
    doc.text("Part", PAGE_PAD_X, headerY);
    doc.text("Issues / Status", PAGE_PAD_X + 70, headerY);
    setText(doc);
    divider(doc, PAGE_PAD_X, headerY + 2, A4.w - PAGE_PAD_X);
    return headerY + 6; // start Y for records
  }

  // Start new page
  function startNewPage(title = "Rubber") {
    doc.addPage("a4", "portrait");
    drawTopBand(doc);
    return renderHeader(PAGE_TOP_SPACING, title);
  }

  let y = startNewPage();

  const rows = [
    { label: "Bonnet Rubber", key: "rubber_bonnet" },
    { label: "Front Left Door Rubber", key: "rubber_front_left_door" },
    { label: "Rear Left Door Rubber", key: "rubber_rear_left_door" },
    { label: "Boot Rubber", key: "rubber_boot" },
    { label: "Rear Right Door Rubber", key: "rubber_rear_right_door" },
    { label: "Front Right Door Rubber", key: "rubber_front_right_door" },
    { label: "Front Wiper Rubber", key: "rubber_front_wiper" },
    { label: "Rear Wiper Rubber", key: "rubber_rear_wiper", toggle: r.rubber_rear_wiper_toggle },
    { label: "Sunroof Rubber", key: "rubber_sunroof" },
  ];

  for (const row of rows) {
    const issues = Array.isArray(r[`${row.key}_issues`]) && r[`${row.key}_issues`].length > 0
      ? r[`${row.key}_issues`].join(", ")
      : "—";

    const urls = Array.isArray(r[`${row.key}_imageUrls`]) ? r[`${row.key}_imageUrls`] : [];

    // Wrap text for Issues/Status column
    const labelText = doc.splitTextToSize(row.label, 65);
    const issuesText = doc.splitTextToSize(issues, 100);

    const maxLines = Math.max(labelText.length, issuesText.length);
    const lineHeight = 5;
    const rowHeight = maxLines * lineHeight;

    // Print label and issues/status
    setText(doc, THEME.text, 9.5);
    doc.text(labelText, PAGE_PAD_X, y);
    doc.text(issuesText, PAGE_PAD_X + 70, y);

    // Toggle/status if exists
    if (row.toggle !== undefined) {
      setText(doc, THEME.subtext, 8.5);
      doc.text("Available", PAGE_PAD_X + 70, y + 0.3);
      checkmark(doc, PAGE_PAD_X + 88, y + 0.6, !!row.toggle);
      setText(doc);
    }

    y += rowHeight + 4;

    // Photos row (new row below each record)
    if (urls.length > 0) {
      const maxImages = Math.min(5, urls.length);
      const imageSize = 20;
      const spacing = 10;
      let x = PAGE_PAD_X;
      for (let i = 0; i < maxImages; i++) {
        try {
          doc.addImage(urls[i], "JPEG", x, y, imageSize, imageSize);
          x += imageSize + spacing;
        } catch (err) {
          console.warn("Image load failed:", err);
        }
      }
      y += imageSize + 6;
    } else {
      setText(doc, THEME.subtext, 8);
      doc.text("No photos available", PAGE_PAD_X, y + 3);
      y += 12;
    }

    // Divider under record
    divider(doc, PAGE_PAD_X, y, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 6;

    // Pagination check
    if (y > mm(250)) {
      drawFooter(doc);
      y = startNewPage("Rubber (contd.)"); // render header with top spacing
    }
  }

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 6: SEATS & Fabrics
 * ========================================================================= */
async function addSeatsBeltsPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Seats & Fabrics", mm(28));

  const col = {
    part: PAGE_PAD_X,
    status: PAGE_PAD_X + 80,
  };

  // Table headers for Seats
  setText(doc, THEME.header, 9.2);
  doc.text("Part", col.part, mm(36));
  doc.text("Issues", col.status, mm(36));
  setText(doc);

  let y = mm(42);
  const rowHeight = 24;
  const thumbSize = 24;
  const thumbGap = 6;

  // Seats rows with issues field and toggle if exists
  const rows = [
    { label: "Driver Seat", key: "seat_driver", arr: r.seat_driver_imageUrls },
    { label: "Driver Head Rest", key: "seat_driver_head_rest", arr: r.seat_driver_head_rest_imageUrls },
    { label: "Co-driver Seat", key: "seat_codriver", arr: r.seat_codriver_imageUrls },
    { label: "Co-driver Head Rest", key: "seat_codriver_head_rest", arr: r.seat_codriver_head_rest_imageUrls },
    { label: "Rear Seat", key: "seat_rear", arr: r.seat_rear_imageUrls },
    { label: "Rear Head Rest", key: "seat_rear_head_rest", arr: r.seat_rear_head_rest_imageUrls },
    { label: "Third Row", key: "seat_third_row", arr: r.seat_third_row_imageUrls, toggle: r.seat_third_row_toggle },
    { label: "Third Row Head Rest", key: "seat_third_row_head_rest", arr: r.seat_third_row_head_rest_imageUrls },
    { label: "Roof Lining", key: "seat_roof", arr: r.seat_roof_imageUrls },
    { label: "Sunroof Cover", key: "seat_sunroof", arr: r.seat_sunroof_imageUrls },
  ];

  for (const row of rows) {
    setText(doc, THEME.text, 9.3);
    doc.text(row.label, col.part, y);

    setText(doc, THEME.subtext, 8.5);
    const issuesText = r[`${row.key}_issues`] ?? "—";
    doc.text(issuesText, col.status, y);

    if (row.toggle !== undefined) {
      const textX = col.status + 40;
      const checkX = textX + doc.getTextWidth("Available ") + 2; // 4 units gap
      const checkY = y - 2; // vertical alignment for checkmark

      doc.text("Available", textX, y);
      checkmark(doc, checkX, checkY, !!row.toggle);
    }
    setText(doc);

    let imgX = PAGE_PAD_X;
    const imgY = y + 8;

    if (Array.isArray(row.arr) && row.arr.length > 0) {
      for (let i = 0; i < Math.min(row.arr.length, 5); i++) {
        // roundedRect(doc, imgX, imgY, thumbSize, thumbSize, 3, "#f9fbfc", "#b8dadb");
        if (row.arr[i]) {
          try {
            const imgData = await urlToDataURL(row.arr[i]);
            if (imgData) {
              doc.addImage(imgData, "JPEG", imgX + 2, imgY + 2, thumbSize - 4, thumbSize - 4, undefined, "FAST");
            }
          } catch { }
        }
        imgX += thumbSize + thumbGap;
      }
    } else {
      setText(doc, THEME.subtext, 8.4);
      doc.text("No photos available", imgX, imgY + 12);
      setText(doc);
    }

    // doc.setDrawColor("#e0e0e0");
    // doc.line(PAGE_PAD_X, y + rowHeight, A4.w - PAGE_PAD_X, y + rowHeight);

    y += rowHeight + thumbSize + 2;

    if (y > mm(270)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Seats & Seatbelts", mm(28));
      setText(doc, THEME.header, 9.2);
      doc.text("Part", col.part, mm(36));
      doc.text("Issues", col.status, mm(36));
      setText(doc);
      y = mm(42);
    }
  }

  // Seatbelt Section Separation
  // y += 10;
  // doc.setDrawColor("#c0c0c0");
  // doc.setLineWidth(0.7);
  // doc.line(PAGE_PAD_X, y, A4.w - PAGE_PAD_X, y);
  // y += 12;

  // Seatbelt section header
  // sectionHeader(doc, "Seatbelts", y);
  // y += 14;

  const belts = [
    { label: "Driver Seatbelt", key: "seatbelt_driver", arr: r.seatbelt_driver_imageUrls },
    { label: "Co-driver Seatbelt", key: "seatbelt_codriver", arr: r.seatbelt_codriver_imageUrls },
    { label: "Rear Left Passenger Seatbelt", key: "seatbelt_rear_left_passenger", arr: r.seatbelt_rear_left_passenger_imageUrls },
    { label: "Rear Right Passenger Seatbelt", key: "seatbelt_rear_right_passenger", arr: r.seatbelt_rear_right_passenger_imageUrls },
    { label: "Third Row Seatbelts", key: "seatbelt_third_row", arr: r.seatbelt_third_row_imageUrls, toggle: r.seatbelt_third_row_toggle },
  ];

  for (const row of belts) {
    setText(doc, THEME.text, 9.3);
    doc.text(row.label, col.part, y);

    setText(doc, THEME.subtext, 8.5);
    const issuesText = r[`${row.key}_issues`] ?? "—";
    doc.text(issuesText, col.status, y);

    if (row.toggle !== undefined) {
      const textX = col.status + 40;
      const checkX = textX + doc.getTextWidth("Available ") + 2; // 4 units gap
      const checkY = y - 2; // vertical alignment for checkmark

      doc.text("Available", textX, y);
      checkmark(doc, checkX, checkY, !!row.toggle);
    }

    setText(doc);

    let imgX = PAGE_PAD_X;
    const imgY = y + 8;

    if (Array.isArray(row.arr) && row.arr.length > 0) {
      for (let i = 0; i < Math.min(row.arr.length, 5); i++) {
        // roundedRect(doc, imgX, imgY, thumbSize, thumbSize, 3, "#f9fbfc", "#b8dadb");
        if (row.arr[i]) {
          try {
            const imgData = await urlToDataURL(row.arr[i]);
            if (imgData) {
              doc.addImage(imgData, "JPEG", imgX + 2, imgY + 2, thumbSize - 4, thumbSize - 4, undefined, "FAST");
            }
          } catch { }
        }
        imgX += thumbSize + thumbGap;
      }
    } else {
      setText(doc, THEME.subtext, 8.4);
      doc.text("No photos available", imgX, imgY + 12);
      setText(doc);
    }

    // doc.setDrawColor("#e0e0e0");
    // doc.line(PAGE_PAD_X, y + rowHeight, A4.w - PAGE_PAD_X, y + rowHeight);

    y += rowHeight + thumbSize + 2;

    if (y > mm(270)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Seatbelts (contd.)", mm(28));
      setText(doc, THEME.header, 9.2);
      doc.text("Part", col.part, mm(36));
      doc.text("Issues / Status", col.status, mm(36));
      setText(doc);
      y = mm(42);
    }
  }

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 7: PLASTICS
 * ========================================================================= */
async function addPlasticsPage(doc, r) {
  const PAGE_TOP_SPACING = mm(28);

  function startNewPage(title = "Plastic Panel") {
    doc.addPage("a4", "portrait");
    drawTopBand(doc);
    setText(doc, THEME.text, 11, "bold");
    doc.text(title, PAGE_PAD_X, PAGE_TOP_SPACING);
    return PAGE_TOP_SPACING + 8;
  }

  let y = startNewPage();

  y += 10;

  // Header row
  setText(doc, THEME.text, 9.5, "bold");
  doc.text("Parts", PAGE_PAD_X + 6, y);
  doc.text("Issue", A4.w / 2, y);
  y += 6;
  divider(doc, PAGE_PAD_X + 4, y, A4.w - PAGE_PAD_X - 4, THEME.faintLine);
  y += 6;

  // Define rows (example data: adjust mapping to your API fields)
  const rows = [
    { part: "Driver Door", issue: "Crack", key: "plastic_driver_door_imageUrls" },
    { part: "Co-driver Door", issue: "Chip", key: "plastic_codriver_door_imageUrls" },
    { part: "Rear Left Passenger Door", issue: "Scratch", key: "plastic_rear_left_passenger_door_imageUrls" },
  ];

  for (const row of rows) {
    // Row: part + issue
    setText(doc, THEME.text, 9.5);
    doc.text(row.part, PAGE_PAD_X + 6, y);

    setText(doc, THEME.text, 9.5, "bold");
    doc.text(row.issue, A4.w / 2, y);

    y += 6;
    divider(doc, PAGE_PAD_X + 4, y, A4.w - PAGE_PAD_X - 4, THEME.faintLine);
    y += 6;

    // Photos row
    const urls = Array.isArray(r[row.key]) ? r[row.key] : [];
    const maxImages = 5;
    const imageSize = 22;
    const spacing = 6;
    let x = PAGE_PAD_X + 6;

    for (let i = 0; i < maxImages; i++) {
      if (urls[i]) {
        try {
          doc.addImage(urls[i], "JPEG", x, y, imageSize, imageSize);
        } catch (err) {
          console.warn("Image load failed:", err);
          
          doc.roundedRect(x, y, imageSize, imageSize, 2, 2);
        }
      } else {
        
        doc.roundedRect(x, y, imageSize, imageSize, 2, 2);
      }
      x += imageSize + spacing;
    }

    y += imageSize + 10;

    // Divider between parts
    divider(doc, PAGE_PAD_X + 4, y, A4.w - PAGE_PAD_X - 4, THEME.faintLine);
    y += 10;

    // Pagination check
    if (y > mm(250)) {
      drawFooter(doc);
      y = startNewPage("Plastic Panel (contd.)");
    }
  }

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 8: FEATURES
 * ========================================================================= */
async function addFeaturesPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Parts", mm(28), );

  const items = [
    ["Parking Sensors (Front)", r.feature_parking_sensors_front_available, r.feature_parking_sensors_front_issueObserved],
    ["Parking Sensors (Rear)", r.feature_parking_sensors_rear_available, r.feature_parking_sensors_rear_issueObserved],
    ["Front View Camera", r.feature_front_view_camera_available, r.feature_front_view_camera_issueObserved],
    ["Rear View Camera", r.feature_rear_view_camera_available, r.feature_rear_view_camera_issueObserved],
    ["360° Camera", r.feature_camera_360_available, r.feature_camera_360_issueObserved],
    ["Touch Screen", r.feature_touch_screen_available, r.feature_touch_screen_issueObserved],
    ["Speakers", r.feature_speakers_available, r.feature_speakers_issueObserved],
    ["Electric ORVM", r.feature_electric_orvm_available, r.feature_electric_orvm_issueObserved],
    ["Auto Dimming IRVM", r.feature_auto_dimming_irvm_available, r.feature_auto_dimming_irvm_issueObserved],
    ["Ventilated Seat (Driver)", r.feature_ventilated_seat_driver_available, r.feature_ventilated_seat_driver_issueObserved],
    ["Ventilated Seat (Co-driver)", r.feature_ventilated_seat_codriver_available, r.feature_ventilated_seat_codriver_issueObserved],
    ["Ventilated Seat (Rear)", r.feature_ventilated_seat_rear_available, r.feature_ventilated_seat_rear_issueObserved],
  ];

  // Header row
  setText(doc, THEME.subtext, 9);
  doc.text("Feature", PAGE_PAD_X, mm(34));
  doc.text("Available", PAGE_PAD_X + 95, mm(34));
  doc.text("Issue Observed", PAGE_PAD_X + 125, mm(34));
  divider(doc, PAGE_PAD_X, mm(36), A4.w - PAGE_PAD_X);
  setText(doc);

  let y = mm(44);
  for (const [label, available, issue] of items) {
    setText(doc, THEME.text, 9.5);
    doc.text(label, PAGE_PAD_X, y);
    setText(doc, THEME.subtext, 9.5);
    doc.text(available ? "Yes" : "No", PAGE_PAD_X + 96, y);
    doc.text(issue ? "Yes" : "No", PAGE_PAD_X + 126, y);
    divider(doc, PAGE_PAD_X, y + 3.5, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 12;
    if (y > mm(275)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Features (contd.)", mm(24));
      setText(doc, THEME.subtext, 9);
      doc.text("Feature", PAGE_PAD_X, mm(34));
      doc.text("Available", PAGE_PAD_X + 95, mm(34));
      doc.text("Issue Observed", PAGE_PAD_X + 125, mm(34));
      divider(doc, PAGE_PAD_X, mm(36), A4.w - PAGE_PAD_X);
      setText(doc);
      y = mm(44);
    }
  }

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 9: LIVE/FLUIDS + DIAGNOSTICS
 * ========================================================================= */
async function addLiveFluidsDiagnosticsPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Live Readings & Fluids", mm(28));

  const leftX = PAGE_PAD_X;
  const boxWidth = A4.w - PAGE_PAD_X * 2; // full width for stacked cards
  let y = mm(34);

// ----------------------------
  // ---- Card 1: Live Parameters
  // ----------------------------
  const liveParamsHeight = mm(50);
  doc.setFillColor(245, 245, 245); // light gray background
  doc.rect(leftX, y, boxWidth, liveParamsHeight, "FD"); // filled + stroke
  setText(doc, THEME.text, 10.5);
  doc.text("Live Parameters", leftX + 4, y + 6); // title inside box
  setText(doc, THEME.subtext, 9);

  let tempY = y + 16; // start below title

  const live = [
    { name: "Engine Load", toggle: r.live_engine_load_toggle, value: r.live_engine_load },
    { name: "Idle RPM", toggle: r.live_idle_rpm_toggle, value: r.live_idle_rpm },
    { name: "Battery Voltage", value: r.live_battery_voltage },
    { name: "Distance Traveled Since Code Clear", value: r.live_distance_since_code_clear },
    { name: "Distance Traveled Since 10K Block", value: r.live_distance_in_current_lock_block },
  ];

  for (const { name, toggle = true, value } of live) {
    if (toggle !== undefined && !toggle) continue;
    doc.text(name, leftX + 6, tempY); // label
    doc.text(String(value ?? "—"), leftX + boxWidth - 6, tempY, { align: "right" }); // value right-aligned
    tempY += 8; // spacing
  }

  y += liveParamsHeight + 10; // move y below card 1

  // ----------------------------
  // ---- Card 2: Diagnostics / Issues
  // ----------------------------
  const diagHeight = mm(50);
  doc.setFillColor(245, 245, 245);
  doc.rect(leftX, y, boxWidth, diagHeight, "FD");
  setText(doc, THEME.text, 10.5);
  doc.text("Diagnostics / Issues", leftX + 4, y + 6);
  setText(doc, THEME.subtext, 9);

  let rightY = y + 16;

  const issues = [
    ["Engine", r.engine_issues],
    ["Transmission", r.transmission_issues],
    ["Brakes", r.brakes_issues],
    ["Diagnostics Codes", (r.diagnostic_codes || []).join(", ")],
  ];

  for (const [part, issue] of issues) {
    doc.text(part, leftX + 6, rightY);
    doc.text(String(issue ?? "—"), leftX + boxWidth - 6, rightY, { align: "right" });
    rightY += 8;
  }

  y += diagHeight + 10; // move y below card 2

  // ----------------------------
  // ---- Card 3: Fluid Levels
  // ----------------------------

  // 1. Before generating PDF content, load and add the Unicode font (DejaVuSans) once:

  // base64 font data can be generated using tools or pre-encoded font file
  const base64DejaVuSans = "<YOUR_BASE64_ENCODED_FONT_DATA_HERE>";

  doc.addFileToVFS("DejaVuSans.ttf", base64DejaVuSans);
  doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");

  // 2. Now generate fluid levels section with correct font set to display ticks:

  const fluidHeight = mm(50);
  doc.setFillColor(245, 245, 245);
  doc.rect(leftX, y, boxWidth, fluidHeight, "FD");

  // Set font that supports Unicode symbols before drawing text
  doc.setFont("DejaVuSans");

  setText(doc, THEME.text, 10.5);
  doc.text("Fluid Levels", leftX + 4, y + 6);

  setText(doc, THEME.subtext, 9);
  y += 16; // start below title

  const fluids = [
    { name: "Coolant", withinRange: r.fluid_coolant_withinRange, contamination: r.fluid_coolant_contamination },
    { name: "Engine Oil", withinRange: r.fluid_engineOil_withinRange, contamination: r.fluid_engineOil_contamination },
    { name: "Brake Oil", withinRange: r.fluid_brakeOil_withinRange, contamination: r.fluid_brakeOil_contamination },
    { name: "Washer Fluid", withinRange: r.fluid_washerFluid_withinRange, contamination: r.fluid_washerFluid_contamination },
  ];

  const col1 = leftX + 6;                    // Parts
  const col2 = leftX + boxWidth / 3;         // Within Range
  const col3 = leftX + (boxWidth / 3) * 2;   // Contamination

  doc.text("Parts", col1, y);
  doc.text("Within Range", col2, y, { align: "center" });
  doc.text("Contamination", col3, y, { align: "center" });
  divider(doc, leftX, y + 4, leftX + boxWidth);
  y += 8;

  for (const { name, withinRange, contamination } of fluids) {
    doc.text(name, col1, y);
    doc.text(withinRange ? "Y" : "N", col2, y, { align: "center" });
    doc.text(contamination ? "Y" : "N", col3, y, { align: "center" });
    divider(doc, leftX, y + 3.5, leftX + boxWidth, THEME.faintLine);
    y += 8;
  }


  // ----------------------------
  drawFooter(doc);
}
/** =========================================================================
 * PAGE 10: TYRES
 * ========================================================================= */
async function addTyresPaymentPage(doc, r) {
  const PAGE_TOP_SPACING = mm(36);

  // Header + column headers with divider
  function renderHeaders(y, title = "Tyres") {
    sectionHeader(doc, title, y);
    const headers = [
      "Part", "Brand", "Sub Brand", "Variant", "Size", "Manufacturing Date", "Tread Depth", "Issue"
    ];
    const colX = [
      PAGE_PAD_X, PAGE_PAD_X + 40, PAGE_PAD_X + 85, PAGE_PAD_X + 130,
      PAGE_PAD_X + 170, PAGE_PAD_X + 200, PAGE_PAD_X + 230, PAGE_PAD_X + 270,
    ];
    const headerY = y + mm(14);
    setText(doc, THEME.subtext, 8.5);
    headers.forEach((h, i) => doc.text(h, colX[i], headerY));
    setText(doc);
    divider(doc, PAGE_PAD_X, headerY + 2, A4.w - PAGE_PAD_X);
    return { colX, startY: headerY + 6 };
  }

  doc.addPage("a4", "portrait");
  drawTopBand(doc);

  let { colX, startY: y } = renderHeaders(PAGE_TOP_SPACING);

  const tyreRows = [
    { key: "tyre_front_left", label: "Front Left", arr: r.tyre_front_left_imageUrls },
    { key: "tyre_rear_left", label: "Rear Left", arr: r.tyre_rear_left_imageUrls },
    { key: "tyre_rear_right", label: "Rear Right", arr: r.tyre_rear_right_imageUrls },
    { key: "tyre_front_right", label: "Front Right", arr: r.tyre_front_right_imageUrls },
    { key: "tyre_spare", label: "Spare Tyre", arr: r.tyre_spare_imageUrls, toggle: r.tyre_spare_toggle },
  ];

  const lineHeight = 5;

  for (const row of tyreRows) {
    // Gather text data using your schema fields
    const texts = [
      row.label,
      r[`${row.key}_brand`] ?? "NA",
      r[`${row.key}_subBrand`] ?? "NA",
      r[`${row.key}_variant`] ?? "NA",
      r[`${row.key}_size`] ?? "NA",
      r[`${row.key}_manufacturingDate`] ?? "NA",
      r[`${row.key}_treadDepth`] != null ? String(r[`${row.key}_treadDepth`]) : "NA",
      r[`${row.key}_issue`] ?? "—",
    ];

    // Wrap text columns according to available widths
    const wrappedTexts = texts.map((txt, idx) => {
      const maxWidth = idx < colX.length - 1 ? colX[idx + 1] - colX[idx] - 2 : 50;
      return doc.splitTextToSize(txt, maxWidth);
    });

    // Calculate max lines in this row for row height
    const maxLines = wrappedTexts.reduce((max, arr) => Math.max(max, arr.length), 0);
    const rowHeight = maxLines * lineHeight;

    // Page break check (reserve space for images and row height)
    const thumbHeight = 26;
    if (y + rowHeight + thumbHeight + 20 > mm(280)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      ({ colX, startY: y } = renderHeaders(PAGE_TOP_SPACING, "Tyres (contd.)"));
    }

    // Draw text columns
    setText(doc, THEME.text, 9);
    wrappedTexts.forEach((lines, i) => {
      doc.text(lines, colX[i], y);
    });
    setText(doc);

    y += rowHeight + 4;

    // Available toggle (for spare tyre)
    if (row.toggle !== undefined) {
      setText(doc, THEME.subtext, 8.5);
      doc.text("Available", colX[7] + 60, y - rowHeight - 2);
      checkmark(doc, colX[1] + 80, y - rowHeight - 4, !!row.toggle);
      setText(doc);
    }

    // Draw thumbnails below text
    if (row.arr && row.arr.length) {
      let imgX = PAGE_PAD_X;
      const imgY = y;
      const thumbSize = 24;
      const thumbGap = 8;
      const maxImages = Math.min(row.arr.length, 5);
      for (let i = 0; i < maxImages; i++) {
        // roundedRect(doc, imgX, imgY, thumbSize, thumbSize, 3, "#f9fbfc", "#b8dadb");
        try {
          const imgData = await urlToDataURL(row.arr[i]);
          if (imgData) {
            doc.addImage(imgData, "JPEG", imgX + 2, imgY + 2, thumbSize - 4, thumbSize - 4, undefined, "FAST");
          }
        } catch { }
        imgX += thumbSize + thumbGap;
      }
      y += thumbSize + 6;
    } else {
      setText(doc, THEME.subtext, 8);
      doc.text("No photos available", PAGE_PAD_X, y + 6);
      setText(doc);
      y += 14;
    }

    // Divider
    divider(doc, PAGE_PAD_X, y, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 10;
  }

  // // Payment Summary Section
  // if (y + 40 > mm(280)) {
  //   drawFooter(doc);
  //   doc.addPage("a4", "portrait");
  //   drawTopBand(doc);
  //   sectionHeader(doc, "Payment Summary (contd.)", mm(24));
  //   y = mm(38);
  // }
  // sectionHeader(doc, "Payment Summary", y);
  // y += 16;
  // labelValue(doc, "Amount", String(r.amount ?? "—"), PAGE_PAD_X, y);
  // labelValue(doc, "Payment Status", String(r.paymentStatus ?? "—"), PAGE_PAD_X + 70, y);
  // labelValue(doc, "Payment Mode", String(r.paymentMode ?? "—"), PAGE_PAD_X + 140, y);

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 11: Other Observations
 * ========================================================================= */

async function addOtherObservationsPage(doc) {
  doc.addPage("a4", "portrait");
  
  // Header
  drawTopBand(doc);
  sectionHeader(doc, "Other Observations", mm(28));

  const leftX = PAGE_PAD_X;
  const boxWidth = A4.w - PAGE_PAD_X * 2;
  let y = mm(34);

  // Title Box
  const boxHeight = mm(80);
  doc.setFillColor(245, 245, 245);
  doc.rect(leftX, y, boxWidth, boxHeight, "FD");

  setText(doc, THEME.text, 10.5);
  doc.text("Summary of Other Observations", leftX + 6, y + 8);
  setText(doc, THEME.subtext, 9);

  y += 18;

  // Dummy observations data
  const observations = [
    { category: " other_observations", notes: "No abnormal noise observed during inspection." },
  ];

  const col1 = leftX + 6;            // Category
  const col2 = leftX + boxWidth / 3; // Notes (start from 1/3rd)
  
  doc.setFont("helvetica", "bold");
  doc.text("Category", col1, y);
  doc.text("Notes", col2, y);
  doc.setFont("helvetica", "normal");
  y += 8;

  // Draw a line under headers
  divider(doc, leftX, y - 4, leftX + boxWidth);

  // Render each observation
  for (const obs of observations) {
    doc.text(obs.category, col1, y);
    // Wrap notes text if long
    const splitNotes = doc.splitTextToSize(obs.notes, boxWidth * 2 / 3 - 12);
    doc.text(splitNotes, col2, y);
    y += splitNotes.length * 7 + 4; // 7 units per line + spacing
  }

  drawFooter(doc);
}

/** =========================================================================
 * MAIN EXPORT
 * ========================================================================= */
export default async function generateInspectionPDF(report) {
  if (!report || typeof report !== "object") {
    console.error("Invalid or missing report data");
    throw new Error("Report data is required");
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Cover
  await addCoverPage(doc, report);
  await addProfilePhotosPage(doc, report);
  await addBodyPanelsPage(doc, report);
  await addGlassesPage(doc, report);
  await addRubberPage(doc, report);
  await addSeatsBeltsPage(doc, report);
  await addPlasticsPage(doc, report);
  await addFeaturesPage(doc, report);
  await addLiveFluidsDiagnosticsPage(doc, report);
  await addTyresPaymentPage(doc, report);
  await addOtherObservationsPage(doc, report);

  // Save
  doc.save(`PDI_Report_${String(report.bookingId ?? "report")}.pdf`);
}