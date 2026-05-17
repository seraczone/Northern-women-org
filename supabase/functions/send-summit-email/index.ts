import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";
import * as QRCode from "npm:qrcode@1.5.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL =
  Deno.env.get("RESEND_FROM_EMAIL") ??
  "Northern Women Initiative <onboarding@resend.dev>";
const CONTACT_ADMIN_EMAIL = Deno.env.get("CONTACT_ADMIN_EMAIL");
const SUPPORT_EMAIL =
  Deno.env.get("SUPPORT_EMAIL") ?? CONTACT_ADMIN_EMAIL ?? "support@northernwomen.org";
const SUPPORT_WHATSAPP_NUMBER =
  Deno.env.get("SUPPORT_WHATSAPP_NUMBER") ?? "+234 906 737 9828";
const PUBLIC_SITE_URL = (
  Deno.env.get("PUBLIC_SITE_URL") ?? "https://northernwomeninitiative.org"
).replace(/\/+$/, "");

const SUMMIT_EVENT_TITLE = "Northern Women Summit 2026";
const SUMMIT_EVENT_DATE = "November 1, 2026";
const SUMMIT_EVENT_VENUE = "International Conference Centre, Abuja";

type SummitEmailAction =
  | "registration_received"
  | "payment_approved"
  | "payment_rejected";

type EmailAttachment = {
  content: string;
  filename: string;
  contentType?: string;
};

type RegistrationPayload = {
  email: string;
  full_name: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  ticket_type?: string | null;
  quantity?: number | null;
  total_amount?: number | null;
  registration_reference?: string | null;
  payment_status?: string | null;
  transaction_reference?: string | null;
  payment_method?: string | null;
  payment_date?: string | null;
};

type SummitApprovedAssets = {
  verificationUrl: string;
  approvedPassAttachment: EmailAttachment;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const encodeBase64Bytes = (bytes: Uint8Array) => {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};

const decodeDataUrlContent = (value: string) => {
  const [, base64 = ""] = value.split(",", 2);

  if (!base64) {
    return new Uint8Array();
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const formatCurrency = (amount?: number | null) => {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return "";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatTicketType = (value?: string | null) => {
  if (!value) {
    return "";
  }

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const formatLocation = (...parts: Array<string | null | undefined>) =>
  parts
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(", ");

const getFirstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? "";

const formatDisplayDate = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};

const buildSummitVerificationUrl = (registrationReference: string) => {
  const verificationUrl = new URL("/verify-summit-registration", PUBLIC_SITE_URL);
  verificationUrl.searchParams.set("reference", registrationReference);
  return verificationUrl.toString();
};

const logoCache = new Map<string, Promise<Uint8Array | null>>();

const fetchLogoBytes = async () => {
  const cacheKey = `${PUBLIC_SITE_URL}/north-logo.png`;

  if (!logoCache.has(cacheKey)) {
    logoCache.set(
      cacheKey,
      (async () => {
        try {
          const response = await fetch(cacheKey);

          if (!response.ok) {
            return null;
          }

          return new Uint8Array(await response.arrayBuffer());
        } catch {
          return null;
        }
      })(),
    );
  }

  return logoCache.get(cacheKey) ?? Promise.resolve(null);
};

const wrapText = (
  text: string,
  maxWidth: number,
  font: { widthOfTextAtSize: (value: string, size: number) => number },
  size: number,
) => {
  const normalizedText = text.trim().replace(/\s+/g, " ");

  if (!normalizedText) {
    return [""];
  }

  const words = normalizedText.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] ?? "";

  for (const word of words.slice(1)) {
    const nextLine = `${currentLine} ${word}`;

    if (font.widthOfTextAtSize(nextLine, size) <= maxWidth) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  lines.push(currentLine);
  return lines;
};

const drawLabelValue = ({
  page,
  label,
  value,
  x,
  y,
  width,
  labelFont,
  valueFont,
}: {
  page: Awaited<ReturnType<typeof PDFDocument.create>>["getPages"][number];
  label: string;
  value: string;
  x: number;
  y: number;
  width: number;
  labelFont: Awaited<ReturnType<typeof PDFDocument.create>>["embedFont"];
  valueFont: Awaited<ReturnType<typeof PDFDocument.create>>["embedFont"];
}) => {
  const labelSize = 9;
  const valueSize = 12;
  const labelColor = rgb(0.43, 0.45, 0.52);
  const valueColor = rgb(0.08, 0.11, 0.18);

  page.drawText(label.toUpperCase(), {
    x,
    y,
    size: labelSize,
    font: labelFont,
    color: labelColor,
  });

  const lines = wrapText(value || "-", width, valueFont, valueSize);
  let currentY = y - 18;

  for (const line of lines) {
    page.drawText(line, {
      x,
      y: currentY,
      size: valueSize,
      font: valueFont,
      color: valueColor,
    });

    currentY -= 15;
  }

  return currentY;
};

const buildApprovedPassPdf = async (registration: RegistrationPayload) => {
  const registrationReference = registration.registration_reference?.trim();

  if (!registrationReference) {
    return null;
  }

  const verificationUrl = buildSummitVerificationUrl(registrationReference);
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 360,
  });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const margin = 42;
  const primary = rgb(0.06, 0.13, 0.24);
  const secondary = rgb(0.81, 0.63, 0.23);
  const cream = rgb(0.98, 0.97, 0.94);
  const cardFill = rgb(1, 1, 1);
  const lightBorder = rgb(0.89, 0.9, 0.93);

  const headingFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const qrImage = await pdfDoc.embedPng(decodeDataUrlContent(qrDataUrl));
  const logoBytes = await fetchLogoBytes();
  const logoImage = logoBytes ? await pdfDoc.embedPng(logoBytes) : null;

  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: cream,
  });

  page.drawRectangle({
    x: 0,
    y: pageHeight - 190,
    width: pageWidth,
    height: 190,
    color: primary,
  });

  page.drawRectangle({
    x: 0,
    y: pageHeight - 204,
    width: pageWidth,
    height: 14,
    color: secondary,
  });

  if (logoImage) {
    const scaled = logoImage.scale(0.34);
    page.drawImage(logoImage, {
      x: margin,
      y: pageHeight - 112,
      width: scaled.width,
      height: scaled.height,
    });
  }

  page.drawText("NORTHERN WOMEN INITIATIVE", {
    x: logoImage ? 168 : margin,
    y: pageHeight - 76,
    size: 18,
    font: headingFont,
    color: rgb(1, 1, 1),
  });

  page.drawText("Approved Summit Pass", {
    x: margin,
    y: pageHeight - 132,
    size: 30,
    font: headingFont,
    color: rgb(1, 1, 1),
  });

  page.drawText("Print this pass or present the PDF at check-in.", {
    x: margin,
    y: pageHeight - 158,
    size: 12,
    font: bodyFont,
    color: rgb(0.88, 0.9, 0.95),
  });

  page.drawRectangle({
    x: margin,
    y: pageHeight - 682,
    width: pageWidth - margin * 2,
    height: 420,
    color: cardFill,
    borderColor: lightBorder,
    borderWidth: 1,
  });

  page.drawRectangle({
    x: margin + 24,
    y: pageHeight - 322,
    width: pageWidth - margin * 2 - 48,
    height: 52,
    color: rgb(0.95, 0.97, 0.99),
    borderColor: rgb(0.84, 0.87, 0.92),
    borderWidth: 1,
  });

  page.drawText("REGISTRATION REFERENCE", {
    x: margin + 42,
    y: pageHeight - 303,
    size: 10,
    font: bodyFont,
    color: rgb(0.4, 0.44, 0.52),
  });

  page.drawText(registrationReference, {
    x: margin + 42,
    y: pageHeight - 322 + 12,
    size: 22,
    font: headingFont,
    color: primary,
  });

  page.drawText("STATUS: APPROVED", {
    x: pageWidth - margin - 178,
    y: pageHeight - 322 + 16,
    size: 12,
    font: headingFont,
    color: rgb(0.08, 0.45, 0.24),
  });

  const leftColumnX = margin + 34;
  const rightColumnX = pageWidth - margin - 192;
  const columnTop = pageHeight - 364;

  drawLabelValue({
    page,
    label: "Attendee",
    value: registration.full_name,
    x: leftColumnX,
    y: columnTop,
    width: 250,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Email Address",
    value: registration.email,
    x: leftColumnX,
    y: columnTop - 64,
    width: 250,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Phone Number",
    value: registration.phone ?? "",
    x: leftColumnX,
    y: columnTop - 128,
    width: 250,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Location",
    value: formatLocation(registration.city, registration.state, registration.country),
    x: leftColumnX,
    y: columnTop - 192,
    width: 250,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Ticket Type",
    value: formatTicketType(registration.ticket_type) || "Standard",
    x: leftColumnX,
    y: columnTop - 272,
    width: 120,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Quantity",
    value: registration.quantity ? String(registration.quantity) : "1",
    x: leftColumnX + 145,
    y: columnTop - 272,
    width: 90,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Amount Confirmed",
    value: formatCurrency(registration.total_amount) || "Confirmed",
    x: leftColumnX,
    y: columnTop - 336,
    width: 250,
    labelFont: headingFont,
    valueFont: bodyFont,
  });

  drawLabelValue({
    page,
    label: "Event",
    value: SUMMIT_EVENT_TITLE,
    x: rightColumnX,
    y: columnTop,
    width: 128,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Date",
    value: SUMMIT_EVENT_DATE,
    x: rightColumnX,
    y: columnTop - 64,
    width: 128,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Venue",
    value: SUMMIT_EVENT_VENUE,
    x: rightColumnX,
    y: columnTop - 128,
    width: 128,
    labelFont: headingFont,
    valueFont: bodyFont,
  });
  drawLabelValue({
    page,
    label: "Payment Date",
    value: formatDisplayDate(registration.payment_date) || "-",
    x: rightColumnX,
    y: columnTop - 214,
    width: 128,
    labelFont: headingFont,
    valueFont: bodyFont,
  });

  page.drawRectangle({
    x: rightColumnX - 6,
    y: pageHeight - 620,
    width: 140,
    height: 140,
    color: rgb(1, 1, 1),
    borderColor: lightBorder,
    borderWidth: 1,
  });

  page.drawImage(qrImage, {
    x: rightColumnX + 6,
    y: pageHeight - 608,
    width: 116,
    height: 116,
  });

  page.drawText("Scan to verify this pass", {
    x: rightColumnX - 2,
    y: pageHeight - 636,
    size: 10,
    font: headingFont,
    color: primary,
  });

  const footerY = 130;
  page.drawText("Verification Link", {
    x: margin,
    y: footerY + 44,
    size: 10,
    font: headingFont,
    color: rgb(0.38, 0.42, 0.5),
  });
  const verificationLines = wrapText(verificationUrl, 500, bodyFont, 10);
  let verificationY = footerY + 28;

  for (const line of verificationLines) {
    page.drawText(line, {
      x: margin,
      y: verificationY,
      size: 10,
      font: bodyFont,
      color: rgb(0.18, 0.2, 0.26),
    });
    verificationY -= 13;
  }

  page.drawRectangle({
    x: margin,
    y: 56,
    width: pageWidth - margin * 2,
    height: 44,
    color: primary,
  });

  page.drawText("Support", {
    x: margin + 18,
    y: 82,
    size: 11,
    font: headingFont,
    color: rgb(1, 1, 1),
  });
  page.drawText(`${SUPPORT_EMAIL}   |   ${SUPPORT_WHATSAPP_NUMBER}`, {
    x: margin + 18,
    y: 66,
    size: 10,
    font: bodyFont,
    color: rgb(0.9, 0.92, 0.97),
  });
  page.drawText("Northern Women Summit 2026 Approved Admission Pass", {
    x: pageWidth - margin - 265,
    y: 74,
    size: 9,
    font: bodyFont,
    color: rgb(0.9, 0.92, 0.97),
  });

  const bytes = await pdfDoc.save();

  return {
    verificationUrl,
    approvedPassAttachment: {
      filename: `Northern-Women-Summit-2026-${registrationReference}-Pass.pdf`,
      content: encodeBase64Bytes(bytes),
      contentType: "application/pdf",
    },
  } satisfies SummitApprovedAssets;
};

const buildSupportBlock = () => `
  <h3 style="margin-top:24px;">Support</h3>
  <p><strong>WhatsApp:</strong> ${escapeHtml(SUPPORT_WHATSAPP_NUMBER)}</p>
  <p><strong>Email:</strong> ${escapeHtml(SUPPORT_EMAIL)}</p>
`;

const buildSummaryList = (registration: RegistrationPayload) => {
  const location = [registration.city, registration.state, registration.country]
    .filter(Boolean)
    .join(", ");

  const entries = [
    ["Full Name", registration.full_name],
    ["Email", registration.email],
    ["Phone", registration.phone ?? ""],
    ["Registration Reference", registration.registration_reference ?? ""],
    ["Ticket Type", formatTicketType(registration.ticket_type)],
    ["Number of Tickets", registration.quantity ? String(registration.quantity) : ""],
    ["Total Amount", formatCurrency(registration.total_amount)],
    ["Transaction Reference", registration.transaction_reference ?? ""],
    ["Payment Method", registration.payment_method ?? ""],
    ["Payment Date", registration.payment_date ?? ""],
    ["Location", location],
    ["Verification Status", registration.payment_status ?? "pending"],
  ].filter(([, value]) => String(value ?? "").trim().length > 0);

  if (entries.length === 0) {
    return "";
  }

  return `
    <h3 style="margin-top:24px;">Registration Summary</h3>
    <ul style="padding-left:20px;">
      ${entries
        .map(
          ([label, value]) =>
            `<li style="margin:0 0 8px 0;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value))}</li>`,
        )
        .join("")}
    </ul>
  `;
};

const buildUserSubject = (action: SummitEmailAction) => {
  if (action === "payment_approved") {
    return "Your Registration Has Been Confirmed";
  }

  if (action === "payment_rejected") {
    return "Payment Verification Issue";
  }

  return "Registration Received - Northern Women Summit 2026";
};

const buildUserHtml = ({
  action,
  registration,
  approvedAssets,
}: {
  action: SummitEmailAction;
  registration: RegistrationPayload;
  approvedAssets: SummitApprovedAssets | null;
}) => {
  const firstName = getFirstName(registration.full_name);
  const greeting = firstName ? `Dear ${escapeHtml(firstName)},` : "Dear Attendee,";

  if (action === "payment_approved") {
    return `
      <p>${greeting}</p>
      <p>Your registration for Northern Women Summit 2026 has been confirmed successfully.</p>
      <p>Your payment has been verified and your attendance status is now <strong>Approved</strong>.</p>
      <p>Your printable summit pass is attached as a PDF. It includes your unique registration reference and a verification QR code.</p>
      ${buildSummaryList({
        ...registration,
        payment_status: "approved",
      })}
      ${
        approvedAssets
          ? `<p><a href="${escapeHtml(approvedAssets.verificationUrl)}">Open your verification page</a></p>`
          : ""
      }
      <p>Please print the attached pass or keep the PDF available on your phone for check-in at the venue.</p>
      ${buildSupportBlock()}
      <p style="margin-top:24px;">We look forward to welcoming you to the summit.</p>
      <p>Warm regards,<br />Northern Women Initiative for Empowerment, Growth and Development Team</p>
    `;
  }

  if (action === "payment_rejected") {
    return `
      <p>${greeting}</p>
      <p>We reviewed your payment details for Northern Women Summit 2026, but we could not complete verification yet.</p>
      <p>Your registration remains on hold until the payment issue is resolved. Please contact support with your registration reference and transaction details.</p>
      ${buildSummaryList({
        ...registration,
        payment_status: "rejected",
      })}
      ${buildSupportBlock()}
      <p style="margin-top:24px;">Once the payment issue is resolved, we will continue your verification.</p>
      <p>Warm regards,<br />Northern Women Initiative for Empowerment, Growth and Development Team</p>
    `;
  }

  return `
    <p>${greeting}</p>
    <p>Thank you for registering for Northern Women Summit 2026.</p>
    <p>Your registration has been received and is awaiting payment verification.</p>
    ${buildSummaryList({
      ...registration,
      payment_status: registration.payment_status ?? "pending",
    })}
    <h3 style="margin-top:24px;">What Happens Next</h3>
    <ul style="padding-left:20px;">
      <li>Your payment receipt and transaction reference will be reviewed by the summit team.</li>
      <li>Your attendance is only confirmed after payment verification.</li>
      <li>Please include your registration reference in any payment support message.</li>
    </ul>
    ${buildSupportBlock()}
    <p style="margin-top:24px;">We look forward to hosting you at International Conference Centre, Abuja, on November 1, 2026.</p>
    <p>Warm regards,<br />Northern Women Initiative for Empowerment, Growth and Development Team</p>
  `;
};

const buildAdminHtml = (registration: RegistrationPayload) => `
  <h2>Northern Women Summit 2026 Registration Received</h2>
  <p>A new summit registration was submitted and is awaiting payment verification.</p>
  ${buildSummaryList({
    ...registration,
    payment_status: registration.payment_status ?? "pending",
  })}
`;

const sendEmail = async ({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}) => {
  const payload: Record<string, unknown> = {
    from: RESEND_FROM_EMAIL,
    to: [to],
    subject,
    html,
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  if (attachments?.length) {
    payload.attachments = attachments.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      ...(attachment.contentType ? { content_type: attachment.contentType } : {}),
    }));
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Resend email failed: ${typeof data === "object" ? JSON.stringify(data) : String(data)}`,
    );
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY secret");
    }

    const body = await req.json();
    const action = String(body.action ?? "") as SummitEmailAction;
    const registration =
      typeof body.registration === "object" && body.registration !== null
        ? (body.registration as RegistrationPayload)
        : null;

    if (
      action !== "registration_received" &&
      action !== "payment_approved" &&
      action !== "payment_rejected"
    ) {
      return new Response(JSON.stringify({ error: "Unsupported summit email action" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!registration?.email || !registration.full_name) {
      return new Response(JSON.stringify({ error: "Missing registration details" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const approvedAssets =
      action === "payment_approved"
        ? await buildApprovedPassPdf(registration)
        : null;

    if (action === "registration_received" && CONTACT_ADMIN_EMAIL) {
      await sendEmail({
        to: CONTACT_ADMIN_EMAIL,
        subject: "Summit 2026 Registration Submitted",
        html: buildAdminHtml(registration),
        replyTo: registration.email,
      });
    }

    await sendEmail({
      to: registration.email,
      subject: buildUserSubject(action),
      html: buildUserHtml({
        action,
        registration,
        approvedAssets,
      }),
      replyTo: CONTACT_ADMIN_EMAIL ?? SUPPORT_EMAIL,
      attachments: approvedAssets ? [approvedAssets.approvedPassAttachment] : undefined,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown function error";
    console.error("Function error:", error);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
