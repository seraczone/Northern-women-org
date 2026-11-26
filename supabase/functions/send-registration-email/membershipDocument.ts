import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib@1.17.1";
import { MEMBERSHIP_LOGO_BASE64 } from "./membershipLogo.ts";

export type ApprovedMembershipDetails = {
  first_name: string;
  last_name: string;
  membership_id: string;
  membership_type: string;
  membership_year: number;
  expiry_date: string;
};

const colors = {
  burgundy: rgb(0.34, 0.08, 0.20),
  gold: rgb(0.72, 0.53, 0.23),
  ink: rgb(0.17, 0.14, 0.15),
  muted: rgb(0.40, 0.37, 0.39),
  line: rgb(0.87, 0.84, 0.80),
  pale: rgb(0.98, 0.965, 0.94),
  white: rgb(1, 1, 1),
};

const formatDate = (value: string) => {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Lagos",
      });
};

const wrapText = (
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  maxWidth: number,
) => {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
};

export async function buildMembershipDocumentPdf(member: ApprovedMembershipDetails) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`NWI Membership Confirmation - ${member.membership_id}`);
  pdf.setAuthor("Northern Women Initiative For Empowerment, Growth and Development");
  pdf.setSubject(`Active membership for ${member.membership_year}`);

  const page = pdf.addPage();
  page.setSize(595.28, 841.89);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  // Data URI input is reliable across the Deno Edge Function and Node preview runtimes.
  const logo = await pdf.embedPng(`data:image/png;base64,${MEMBERSHIP_LOGO_BASE64}`);

  const margin = 58;
  const contentWidth = 595.28 - margin * 2;
  const logoScale = Math.min(138 / logo.width, 48 / logo.height);
  page.drawImage(logo, {
    x: margin,
    y: 760,
    width: logo.width * logoScale,
    height: logo.height * logoScale,
  });
  page.drawText("Northern Women Initiative", {
    x: margin + 155,
    y: 786,
    size: 15,
    font: bold,
    color: colors.burgundy,
  });
  page.drawText("For Empowerment, Growth and Development", {
    x: margin + 155,
    y: 766,
    size: 9,
    font: regular,
    color: colors.muted,
  });
  page.drawRectangle({ x: margin, y: 744, width: contentWidth, height: 2, color: colors.gold });

  page.drawText("MEMBERSHIP CONFIRMATION", {
    x: margin,
    y: 698,
    size: 19,
    font: bold,
    color: colors.burgundy,
  });
  page.drawText(`Membership Year ${member.membership_year}`, {
    x: margin,
    y: 677,
    size: 11,
    font: regular,
    color: colors.muted,
  });

  const fullName = `${member.first_name} ${member.last_name}`.trim() || "Member";
  let cursorY = 625;
  const drawParagraph = (text: string, size = 11.5, lineHeight = 18) => {
    const lines = wrapText(text, regular, size, contentWidth);
    for (const line of lines) {
      page.drawText(line, { x: margin, y: cursorY, size, font: regular, color: colors.ink });
      cursorY -= lineHeight;
    }
    cursorY -= 12;
  };

  page.drawText(`Dear ${fullName},`, {
    x: margin,
    y: cursorY,
    size: 11.5,
    font: bold,
    color: colors.ink,
  });
  cursorY -= 30;
  drawParagraph(
    "Northern Women Initiative For Empowerment, Growth and Development is pleased to confirm that your membership payment has been verified and your membership has been approved. We welcome you as an active member of our community.",
  );
  drawParagraph(
    "Your membership supports our work to advance the empowerment, growth, and development of women and communities. We look forward to your participation in our programmes, activities, and member engagements.",
  );

  cursorY -= 3;
  page.drawText("MEMBERSHIP DETAILS", {
    x: margin,
    y: cursorY,
    size: 10,
    font: bold,
    color: colors.burgundy,
  });
  cursorY -= 45;
  const rows = [
    ["Member name", fullName],
    ["Permanent Membership ID", member.membership_id],
    ["Membership type", member.membership_type === "renewal" ? "Renewal" : "New membership"],
    ["Membership year", String(member.membership_year)],
    ["Valid through", formatDate(member.expiry_date)],
    ["Status", "Active"],
  ];
  const rowHeight = 34;
  const labelWidth = 180;
  for (const [label, value] of rows) {
    page.drawRectangle({
      x: margin,
      y: cursorY - 7,
      width: contentWidth,
      height: rowHeight,
      color: colors.pale,
      borderColor: colors.line,
      borderWidth: 0.6,
    });
    page.drawText(label, {
      x: margin + 12,
      y: cursorY + 5,
      size: 9.5,
      font: bold,
      color: colors.muted,
    });
    page.drawText(value || "-", {
      x: margin + labelWidth,
      y: cursorY + 5,
      size: 10,
      font: bold,
      color: colors.ink,
    });
    cursorY -= rowHeight;
  }

  cursorY -= 14;
  drawParagraph(
    "Please keep this document for your records. Your permanent Membership ID should be quoted when contacting NWI about your membership or renewal.",
    10.5,
    16,
  );
  page.drawText("Warm regards,", {
    x: margin,
    y: cursorY,
    size: 10.5,
    font: regular,
    color: colors.ink,
  });
  cursorY -= 20;
  page.drawText("Mrs Maryam Mohammed Nasir", {
    x: margin,
    y: cursorY,
    size: 10.5,
    font: bold,
    color: colors.burgundy,
  });
  cursorY -= 16;
  page.drawText("Northern Women Initiative For Empowerment, Growth and Development", {
    x: margin,
    y: cursorY,
    size: 10,
    font: regular,
    color: colors.ink,
  });

  page.drawRectangle({ x: margin, y: 48, width: contentWidth, height: 0.8, color: colors.line });
  page.drawText("Northern Women Initiative For Empowerment, Growth and Development", {
    x: margin,
    y: 31,
    size: 8,
    font: regular,
    color: colors.muted,
  });

  return pdf.save();
}
