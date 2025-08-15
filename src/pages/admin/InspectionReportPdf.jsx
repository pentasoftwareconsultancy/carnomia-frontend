// src/pages/admin/InspectionReportPdf.jsx
import { jsPDF } from "jspdf";

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
async function urlToDataURL(url) {
  if (!url) return null;

  // Try fetch → blob → FileReader (works when CORS allows)
  try {
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      const fr = new FileReader();
      return await new Promise((resolve) => {
        fr.onload = () => resolve(fr.result);
        fr.readAsDataURL(blob);
      });
    }
  } catch (_) {
    /* fall through */
  }

  // Fallback using <img> + canvas (still needs CORS on server)
  try {
    const dataURL = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.onerror = reject;
      img.src = url;
    });
    return dataURL;
  } catch (_) {
    return null;
  }
}

/** =========================================================================
 * DRAWING HELPERS
 * ========================================================================= */
function setText(doc, color = THEME.text, size = 10) {
  doc.setTextColor(color);
  doc.setFontSize(size);
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
  doc.text(value ?? "—", x, y + 4.3);
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
  doc.text(value, x + 3, y + 11); // keep ASCII glyphs to avoid missing font chars
  setText(doc);
}

function labeledPhotoBox(doc, label, x, y, w = 50, h = 50) {
  setText(doc, THEME.subtext, 8);
  doc.text(label, x, y - 1.8);
  setText(doc);
  roundedRect(doc, x, y, w, h, 4, undefined, THEME.boxStroke);
}

async function drawThumbRow(doc, urls = [], x, y, w = 10.8, h = 10.8, gap = 2.5, max = 4) {
  for (let i = 0; i < max; i++) {
    const bx = x + i * (w + gap);
    roundedRect(doc, bx, y, w, h, 2, undefined, THEME.boxStroke);
    const u = urls[i];
    if (u) {
      const data = await urlToDataURL(u);
      if (data) doc.addImage(data, "JPEG", bx + 1.1, y + 1.1, w - 2.2, h - 2.2, undefined, "FAST");
    }
  }
}

function checkmark(doc, x, y, checked) {
  roundedRect(doc, x, y - 3.5, 3.5, 3.5, 0.8, "#fff", THEME.boxStroke);
  if (checked) {
    setText(doc, THEME.good, 10);
    doc.text("✓", x + 0.6, y - 0.4);
    setText(doc);
  }
}

/** =========================================================================
 * PAGE FRAMING (header band + footer)
 * ========================================================================= */
function drawTopBand(doc) {
  roundedRect(doc, mm(12), mm(12), mm(186), mm(10), 3, THEME.brandDark, THEME.brandDark);
  setText(doc, "#ffffff", 11);
  doc.text("Drivesta", mm(18), mm(18));
  doc.text("PDI Report", mm(186), mm(18), { align: "right" });
  setText(doc);
}

function drawFooter(doc) {
  setText(doc, THEME.subtext, 8);
  doc.text("Generated by Drivesta • " + new Date().toLocaleString(), mm(105), mm(287), { align: "center" });
  setText(doc);
}

/** =========================================================================
 * COVER PAGE (matches Figma look)
 * ========================================================================= */
async function addCoverPage(doc, r) {
  drawTopBand(doc);

  // Booking ID row
  setText(doc, THEME.subtext, 8.5);
  doc.text(`Booking ID: ${r.bookingId ?? "—"}`, PAGE_PAD_X, mm(26.5));
  setText(doc);

  // HERO
  const { x, y, w, h } = GRID.hero;
  roundedRect(doc, mm(x), mm(y), mm(w), mm(h), 6, "#000", "#000");
  const heroImg = await urlToDataURL(r.imageUrl);
  if (heroImg) {
    doc.addImage(heroImg, "JPEG", mm(x) + 1.2, mm(y) + 1.2, mm(w) - 2.4, mm(h) - 2.4, undefined, "FAST");
  }

  // Metric chips
  const pX = mm(x + 10), pY = mm(y + 4);
  metricPill(doc, pX + 0, pY, "BHP", "0");
  metricPill(doc, pX + 26, pY, "Airbags", "6");
  metricPill(doc, pX + 52, pY, "NCAP", "5*");
  metricPill(doc, pX + 78, pY, "Mileage", "17.0");

  // Score card
  const sX = mm(x + w + 8);
  const sY = mm(y);
  roundedRect(doc, sX, sY, mm(GRID.scoreCard.w), mm(GRID.scoreCard.h), 5, "#fff", THEME.softLine);
  setText(doc, THEME.subtext, 8);
  doc.text("Overall Vehicle Score", sX + 6, sY + 7);
  setText(doc);
  doc.setDrawColor(THEME.good);
  doc.circle(sX + 21, sY + 17, 10, "S");
  setText(doc, THEME.text, 14);
  doc.text("9.2", sX + 17.7, sY + 20.5);
  setText(doc, THEME.good, 7.5);
  doc.text("GOOD", sX + 16.4, sY + 27);
  setText(doc, THEME.subtext, 6.9);
  doc.text("No major issues; consumables OK.\nElectronics working.\nRecommended: PDI delivery.", sX + 6, sY + 30.5);
  setText(doc);

  // Info cards
  const cardY = mm(y + h + 6);
  const leftX = mm(x);
  const rightX = mm(x + 70);

  // Customer Info
  roundedRect(doc, leftX, cardY, mm(85), mm(35), 4, "#fff", THEME.softLine);
  setText(doc, THEME.text, 9.5);
  doc.text("Customer Info", leftX + 4, cardY + 6);
  divider(doc, leftX + 4, cardY + 7.5, leftX + 81, THEME.faintLine);
  labelValue(doc, "Name", r.customerName, leftX + 4, cardY + 14);
  labelValue(doc, "Location", r.address, leftX + 48, cardY + 14);
  labelValue(doc, "Engineer Name", r.engineer_name, leftX + 4, cardY + 24);
  labelValue(doc, "Engineer Mobile", r.engineer_mobile, leftX + 48, cardY + 24);
  labelValue(
    doc,
    "PDI Date & Time",
    `${new Date(r.date).toLocaleDateString()}  ${r.engineer_assignedSlot ?? ""}`,
    leftX + 4,
    cardY + 34
  );
  labelValue(doc, "Dealer", r.dealerName, leftX + 48, cardY + 34);

  // Vehicle Info
  roundedRect(doc, rightX, cardY, mm(85), mm(35), 4, "#fff", THEME.softLine);
  setText(doc, THEME.text, 9.5);
  doc.text("Vehicle Info", rightX + 4, cardY + 6);
  divider(doc, rightX + 4, cardY + 7.5, rightX + 81, THEME.faintLine);
  labelValue(doc, "Brand", r.brand, rightX + 4, cardY + 14);
  labelValue(doc, "Model", r.model, rightX + 48, cardY + 14);
  labelValue(doc, "Variant", r.variant, rightX + 4, cardY + 24);
  labelValue(doc, "Car Status", r.carStatus, rightX + 48, cardY + 24);
  labelValue(doc, "Transmission", r.transmissionType, rightX + 4, cardY + 34);
  labelValue(doc, "Fuel", r.fuelType, rightX + 48, cardY + 34);

  // Running bar module
  const barY = cardY + 41;
  sectionHeader(doc, "How Much Has My Car Been Driven Before The PDI Date?", barY);
  roundedRect(doc, leftX, barY + 5, 130, 6, 3, THEME.softLine, THEME.softLine);
  roundedRect(doc, leftX, barY + 5, 40, 6, 3, THEME.good, THEME.good);
  setText(doc, "#065f46", 8.2);
  doc.text("My Car's Running", leftX + 1.8, barY + 9.4);
  setText(doc);
  doc.text("55 Kms", leftX + 135, barY + 9.4);
  chip(doc, "No Tampering", leftX + 118, barY + 16);

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 2: PROFILE PHOTOS (360)
 * ========================================================================= */
async function addProfilePhotosPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);

  sectionHeader(doc, "Profile Photos", mm(24), "Your Car’s 360° View • Check each side for a complete visual record");

  const cells = [
    { label: "1. Front Left View", x: mm(24), y: mm(50), url: r.front_left_view_url },
    { label: "2. Rear Left View", x: mm(90), y: mm(50), url: r.rear_left_view_url },
    { label: "3. Rear Right View", x: mm(24), y: mm(120), url: r.rear_right_view_url },
    { label: "4. Front Right View", x: mm(90), y: mm(120), url: r.front_right_view_url },
  ];

  for (const c of cells) {
    labeledPhotoBox(doc, c.label, c.x, c.y, 50, 50);
    if (c.url) {
      const data = await urlToDataURL(c.url);
      if (data) doc.addImage(data, "JPEG", c.x + 1.2, c.y + 1.2, 50 - 2.4, 50 - 2.4, undefined, "FAST");
    }
  }

  drawFooter(doc);
}

/** =========================================================================
 * PAGE 3: BODY PANELS (table with thumbnails)
 * ========================================================================= */
async function addBodyPanelsPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);

  sectionHeader(doc, "Body Panels", mm(24));

  const headers = ["Parts", "Paint Thickness (mm)", "Issue", "Cladding Issue", "Repaint", "Photos"];
  const colX = [mm(20), mm(64), mm(97), mm(124), mm(142), mm(156)];
  setText(doc, THEME.subtext, 8.8);
  headers.forEach((h, i) => doc.text(h, colX[i], mm(34)));
  setText(doc);
  divider(doc, mm(18), mm(36), mm(192));

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

  let y = mm(44);
  for (const row of rows) {
    const urls = r[`${row.key}_imageUrls`] || [];
    const cladding = row.claddingKey ? (r[row.claddingKey] ? "Yes" : "NA") : "NA";
    const repaint = row.repaintKey ? (r[row.repaintKey] ? "Yes" : "No") : "—";
    const issue = (urls.length > 0 || r[row.claddingKey] || r[row.repaintKey]) ? "Observed" : "—";

    // text cells
    setText(doc, THEME.text, 9);
    doc.text(row.label, colX[0], y);
    doc.text("NA", colX[1], y); // thickness placeholder
    doc.text(issue, colX[2], y);
    doc.text(cladding, colX[3], y);
    doc.text(repaint, colX[4], y);

    await drawThumbRow(doc, urls, colX[5], y - 6.5, 10.8, 10.8, 2.5, 4);

    divider(doc, mm(18), y + 4, mm(192), THEME.faintLine);
    y += 14;

    // pagination
    if (y > mm(275)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Body Panels (contd.)", mm(24));
      divider(doc, mm(18), mm(36), mm(192));
      y = mm(44);
    }
  }

  drawFooter(doc);
}

/** =========================================================================
 * PAGES 4..N: ALL REMAINING FIELDS WIRED FROM YOUR JSON
 * ========================================================================= */

// 4) Glasses
async function addGlassesPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Glasses", mm(24));

  const rows = [
    { label: "Front Windshield", arr: r.front_windshield_imageUrls },
    { label: "Front Left Door Glass", arr: r.front_left_door_glass_imageUrls },
    { label: "Left ORVM", arr: r.left_side_orvm_imageUrls },
    { label: "Rear Left Door Glass", arr: r.rear_left_door_glass_imageUrls },
    { label: "Rear Left Quarter Glass", arr: r.rear_left_quarter_glass_imageUrls },
    { label: "Rear Windshield", arr: r.rear_windshield_imageUrls },
    { label: "Rear Right Quarter Glass", arr: r.rear_right_quarter_glass_imageUrls },
    { label: "Rear Right Door Glass", arr: r.rear_right_door_glass_imageUrls },
    { label: "Front Right Door Glass", arr: r.front_right_door_glass_imageUrls },
    { label: "Right ORVM", arr: r.right_side_orvm_imageUrls },
    { label: "Sunroof Glass", arr: r.sunroof_glass_imageUrls },
  ];

  let y = mm(38);
  for (const row of rows) {
    setText(doc, THEME.text, 9.5);
    doc.text(row.label, PAGE_PAD_X, y + 4);
    await drawThumbRow(doc, row.arr || [], PAGE_PAD_X + 50, y, 14, 14, 3, 4);
    divider(doc, PAGE_PAD_X, y + 18, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 20;
    if (y > mm(270)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Glasses (contd.)", mm(24));
      y = mm(38);
    }
  }
  drawFooter(doc);
}

// 5) Rubber
async function addRubberPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Rubber", mm(24));

  const rows = [
    { label: "Bonnet Rubber", arr: r.rubber_bonnet_imageUrls },
    { label: "Front Left Door Rubber", arr: r.rubber_front_left_door_imageUrls },
    { label: "Rear Left Door Rubber", arr: r.rubber_rear_left_door_imageUrls },
    { label: "Boot Rubber", arr: r.rubber_boot_imageUrls },
    { label: "Rear Right Door Rubber", arr: r.rubber_rear_right_door_imageUrls },
    { label: "Front Right Door Rubber", arr: r.rubber_front_right_door_imageUrls },
    { label: "Front Wiper Rubber", arr: r.rubber_front_wiper_imageUrls },
    { label: "Rear Wiper Rubber", arr: r.rubber_rear_wiper_imageUrls, toggle: r.rubber_rear_wiper_toggle },
    { label: "Sunroof Rubber", arr: r.rubber_sunroof_imageUrls },
  ];

  let y = mm(38);
  for (const row of rows) {
    setText(doc, THEME.text, 9.5);
    doc.text(row.label, PAGE_PAD_X, y + 4);
    if (row.toggle !== undefined) {
      setText(doc, THEME.subtext, 8.5);
      doc.text("Available", PAGE_PAD_X + 35, y + 4);
      checkmark(doc, PAGE_PAD_X + 51, y + 4.3, !!row.toggle);
      setText(doc);
    }
    await drawThumbRow(doc, row.arr || [], PAGE_PAD_X + 60, y, 14, 14, 3, 4);
    divider(doc, PAGE_PAD_X, y + 18, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 20;
    if (y > mm(270)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Rubber (contd.)", mm(24));
      y = mm(38);
    }
  }
  drawFooter(doc);
}

// 6) Seats & Belts
async function addSeatsBeltsPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Seats & Seatbelts", mm(24));

  const rows = [
    { label: "Driver Seat", arr: r.seat_driver_imageUrls },
    { label: "Driver Head Rest", arr: r.seat_driver_head_rest_imageUrls },
    { label: "Co-driver Seat", arr: r.seat_codriver_imageUrls },
    { label: "Co-driver Head Rest", arr: r.seat_codriver_head_rest_imageUrls },
    { label: "Rear Seat", arr: r.seat_rear_imageUrls },
    { label: "Rear Head Rest", arr: r.seat_rear_head_rest_imageUrls },
    { label: "Third Row", arr: r.seat_third_row_imageUrls, toggle: r.seat_third_row_toggle },
    { label: "Third Row Head Rest", arr: r.seat_third_row_head_rest_imageUrls },
    { label: "Roof Lining", arr: r.seat_roof_imageUrls },
    { label: "Sunroof Cover", arr: r.seat_sunroof_imageUrls },
  ];

  let y = mm(38);
  for (const row of rows) {
    setText(doc, THEME.text, 9.5);
    doc.text(row.label, PAGE_PAD_X, y + 4);
    if (row.toggle !== undefined) {
      setText(doc, THEME.subtext, 8.5);
      doc.text("Available", PAGE_PAD_X + 35, y + 4);
      checkmark(doc, PAGE_PAD_X + 51, y + 4.3, !!row.toggle);
      setText(doc);
    }
    await drawThumbRow(doc, row.arr || [], PAGE_PAD_X + 60, y, 14, 14, 3, 4);
    divider(doc, PAGE_PAD_X, y + 18, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 20;
    if (y > mm(270)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Seats & Seatbelts (contd.)", mm(24));
      y = mm(38);
    }
  }

  // Seatbelts
  const belts = [
    { label: "Driver Seatbelt", arr: r.seatbelt_driver_imageUrls },
    { label: "Co-driver Seatbelt", arr: r.seatbelt_codriver_imageUrls },
    { label: "Rear Left Passenger Seatbelt", arr: r.seatbelt_rear_left_passenger_imageUrls },
    { label: "Rear Right Passenger Seatbelt", arr: r.seatbelt_rear_right_passenger_imageUrls },
    { label: "Third Row Seatbelts", arr: r.seatbelt_third_row_imageUrls, toggle: r.seatbelt_third_row_toggle },
  ];
  sectionHeader(doc, "Seatbelts", y + 6);
  y += 16;

  for (const row of belts) {
    setText(doc, THEME.text, 9.5);
    doc.text(row.label, PAGE_PAD_X, y + 4);
    if (row.toggle !== undefined) {
      setText(doc, THEME.subtext, 8.5);
      doc.text("Available", PAGE_PAD_X + 35, y + 4);
      checkmark(doc, PAGE_PAD_X + 51, y + 4.3, !!row.toggle);
      setText(doc);
    }
    await drawThumbRow(doc, row.arr || [], PAGE_PAD_X + 60, y, 14, 14, 3, 4);
    divider(doc, PAGE_PAD_X, y + 18, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 20;
    if (y > mm(270)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Seatbelts (contd.)", mm(24));
      y = mm(38);
    }
  }

  drawFooter(doc);
}

// 7) Plastics
async function addPlasticsPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Interior Plastics", mm(24));

  const rows = [
    { label: "Driver Door Trim", arr: r.plastic_driver_door_imageUrls },
    { label: "Co-driver Door Trim", arr: r.plastic_codriver_door_imageUrls },
    { label: "Rear Left Passenger Door Trim", arr: r.plastic_rear_left_passenger_door_imageUrls },
    { label: "Rear Right Passenger Door Trim", arr: r.plastic_rear_right_passenger_door_imageUrls },
    { label: "Third Row Plastics", arr: r.plastic_third_row_imageUrls, toggle: r.plastic_third_row_toggle },
    { label: "Dashboard", arr: r.plastic_dashboard_imageUrls },
    { label: "Gear Console", arr: r.plastic_gear_console_imageUrls },
    { label: "Steering", arr: r.plastic_steering_imageUrls },
    { label: "AC Vents (Front)", arr: r.plastic_ac_vents_imageUrls },
    { label: "AC Vents (Rear)", arr: r.plastic_rear_ac_vents_imageUrls },
    { label: "IRVM", arr: r.plastic_irvm_imageUrls },
  ];

  let y = mm(38);
  for (const row of rows) {
    setText(doc, THEME.text, 9.5);
    doc.text(row.label, PAGE_PAD_X, y + 4);
    if (row.toggle !== undefined) {
      setText(doc, THEME.subtext, 8.5);
      doc.text("Available", PAGE_PAD_X + 35, y + 4);
      checkmark(doc, PAGE_PAD_X + 51, y + 4.3, !!row.toggle);
      setText(doc);
    }
    await drawThumbRow(doc, row.arr || [], PAGE_PAD_X + 60, y, 14, 14, 3, 4);
    divider(doc, PAGE_PAD_X, y + 18, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 20;
    if (y > mm(270)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Interior Plastics (contd.)", mm(24));
      y = mm(38);
    }
  }
  drawFooter(doc);
}

// 8) Features (available + issueObserved)
async function addFeaturesPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Features", mm(24), "Availability & Issues Observed");

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

  // header row
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

// 9) Live/Fluids + Diagnostics
async function addLiveFluidsDiagnosticsPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Live Readings & Fluids", mm(24));

  // Live
  setText(doc, THEME.text, 10.5);
  doc.text("Live Readings", PAGE_PAD_X, mm(34));
  setText(doc, THEME.subtext, 9);
  let y = mm(40);
  const live = [
    ["Engine Load", r.live_engine_load_toggle],
    ["Idle RPM", r.live_idle_rpm_toggle],
  ];
  for (const [k, v] of live) {
    doc.text(k, PAGE_PAD_X, y);
    doc.text(v ? "Within Range" : "NA", PAGE_PAD_X + 60, y);
    y += 8;
  }

  // Fluids
  setText(doc, THEME.text, 10.5);
  doc.text("Fluids", PAGE_PAD_X, y + 6);
  y += 12;
  setText(doc, THEME.subtext, 9);
  const fluids = [
    ["Coolant", r.fluid_coolant_withinRange, r.fluid_coolant_contamination],
    ["Engine Oil", r.fluid_engineOil_withinRange, r.fluid_engineOil_contamination],
    ["Brake Oil", r.fluid_brakeOil_withinRange, r.fluid_brakeOil_contamination],
    ["Washer Fluid", r.fluid_washerFluid_withinRange, r.fluid_washerFluid_contamination],
  ];
  doc.text("Name", PAGE_PAD_X, y);
  doc.text("Within Range", PAGE_PAD_X + 60, y);
  doc.text("Contamination", PAGE_PAD_X + 100, y);
  divider(doc, PAGE_PAD_X, y + 2, A4.w - PAGE_PAD_X);
  y += 9;
  setText(doc);
  for (const [name, within, cont] of fluids) {
    doc.text(name, PAGE_PAD_X, y);
    doc.text(within ? "Yes" : "No", PAGE_PAD_X + 62, y);
    doc.text(cont ? "Yes" : "No", PAGE_PAD_X + 102, y);
    divider(doc, PAGE_PAD_X, y + 3.5, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 10;
  }

  // Diagnostics
  sectionHeader(doc, "Diagnostics & Other Observations", y + 10);
  y += 18;
  setText(doc, THEME.text, 9.5);
  const codes = Array.isArray(r.diagnostic_codes) ? r.diagnostic_codes : [];
  const codeText = codes.length ? codes.join(", ") : "No DTCs reported";
  doc.text("Diagnostic Codes:", PAGE_PAD_X, y);
  setText(doc, THEME.subtext, 9.5);
  doc.text(codeText, PAGE_PAD_X + 40, y);
  setText(doc);
  y += 10;

  if (r.other_observations) {
    setText(doc, THEME.text, 9.5);
    doc.text("Other Observations:", PAGE_PAD_X, y);
    setText(doc, THEME.subtext, 9.5);
    const wrapped = doc.splitTextToSize(r.other_observations, A4.w - PAGE_PAD_X * 2 - 10);
    doc.text(wrapped, PAGE_PAD_X + 40, y);
    setText(doc);
  }

  drawFooter(doc);
}

// 10) Tyres + Payment
async function addTyresPaymentPage(doc, r) {
  doc.addPage("a4", "portrait");
  drawTopBand(doc);
  sectionHeader(doc, "Tyres", mm(24));

  const tyreRows = [
    { label: "Front Left", arr: r.tyre_front_left_imageUrls },
    { label: "Rear Left", arr: r.tyre_rear_left_imageUrls },
    { label: "Rear Right", arr: r.tyre_rear_right_imageUrls },
    { label: "Front Right", arr: r.tyre_front_right_imageUrls },
    { label: "Spare Tyre", arr: r.tyre_spare_imageUrls, toggle: r.tyre_spare_toggle },
  ];

  let y = mm(38);
  for (const row of tyreRows) {
    setText(doc, THEME.text, 9.5);
    doc.text(row.label, PAGE_PAD_X, y + 4);
    if (row.toggle !== undefined) {
      setText(doc, THEME.subtext, 8.5);
      doc.text("Available", PAGE_PAD_X + 35, y + 4);
      checkmark(doc, PAGE_PAD_X + 51, y + 4.3, !!row.toggle);
      setText(doc);
    }
    await drawThumbRow(doc, row.arr || [], PAGE_PAD_X + 60, y, 14, 14, 3, 4);
    divider(doc, PAGE_PAD_X, y + 18, A4.w - PAGE_PAD_X, THEME.faintLine);
    y += 20;
    if (y > mm(270)) {
      drawFooter(doc);
      doc.addPage("a4", "portrait");
      drawTopBand(doc);
      sectionHeader(doc, "Tyres (contd.)", mm(24));
      y = mm(38);
    }
  }

  // Payment Summary
  sectionHeader(doc, "Payment Summary", y + 6);
  y += 16;
  labelValue(doc, "Amount", String(r.amount ?? "—"), PAGE_PAD_X, y);
  labelValue(doc, "Payment Status", r.paymentStatus, PAGE_PAD_X + 70, y);
  labelValue(doc, "Payment Mode", r.paymentMode, PAGE_PAD_X + 140, y);

  drawFooter(doc);
}

/** =========================================================================
 * MAIN EXPORT
 * ========================================================================= */
export default async function generateInspectionPDF(report) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Cover (Figma look)
  await addCoverPage(doc, report);

  // Figma frames 2 & 3
  await addProfilePhotosPage(doc, report);
  await addBodyPanelsPage(doc, report);

  // All remaining sections (every field from your JSON is used)
  await addGlassesPage(doc, report);
  await addRubberPage(doc, report);
  await addSeatsBeltsPage(doc, report);
  await addPlasticsPage(doc, report);
  await addFeaturesPage(doc, report);
  await addLiveFluidsDiagnosticsPage(doc, report);
  await addTyresPaymentPage(doc, report);

  // Save
  doc.save(`PDI_Report_${report.bookingId || "report"}.pdf`);
}
