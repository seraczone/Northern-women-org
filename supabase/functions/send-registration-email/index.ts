import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
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
const EVENT_TIMEZONE = Deno.env.get("EVENT_TIMEZONE") ?? "Africa/Lagos";
const PUBLIC_SITE_URL = (
  Deno.env.get("PUBLIC_SITE_URL") ?? "https://northernwomeninitiative.org"
).replace(/\/+$/, "");

type Flow = "event" | "join_us" | "summit_2026" | "volunteer";

type FlowContent = {
  adminLabel: string;
  confirmationTitle: string;
  submittedText: string;
  updatedText: string;
};

type EmailAttachment = {
  content: string;
  filename: string;
  contentId?: string;
  contentType?: string;
};

type CalendarEvent = {
  title: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  description: string;
  googleCalendarLink: string;
  icsAttachment: EmailAttachment;
};

type EventTicketAssets = {
  registrationCode: string;
  verificationUrl: string;
  qrAttachment: EmailAttachment;
};

type RegistrationSummaryItem = {
  label: string;
  value: string;
};

const flowContent: Record<Exclude<Flow, "event">, FlowContent> = {
  join_us: {
    adminLabel: "Join Us Registration",
    confirmationTitle: "Join Us Registration",
    submittedText:
      "We have successfully received your Join Us registration. Our team will review your details and reach out when relevant opportunities for engagement and participation arise.",
    updatedText:
      "Your Join Us registration has been updated successfully. Any future follow-up will be based on your latest information.",
  },
  summit_2026: {
    adminLabel: "Summit 2026 Registration",
    confirmationTitle: "Northern Women Summit 2026 Registration",
    submittedText:
      "We have received your summit registration and payment details. Your attendance will be confirmed after payment verification is completed.",
    updatedText:
      "Your summit registration has been updated successfully. Any ongoing payment verification will continue using your latest details.",
  },
  volunteer: {
    adminLabel: "Volunteer Application",
    confirmationTitle: "Volunteer Application",
    submittedText:
      "We have successfully received your volunteer application. Thank you for offering your time, skills, and support to our mission.",
    updatedText:
      "Your volunteer application has been updated successfully. We will use your latest details for future follow-up.",
  },
};

const getFlowContent = (
  flow: Flow,
  submission: Record<string, unknown>,
): FlowContent => {
  if (flow === "event") {
    const rawEventName = String(submission.event_name ?? "").trim();
    const eventName = rawEventName || "your selected event";

    return {
      adminLabel: `${eventName} Event Registration`,
      confirmationTitle: `${eventName} Registration`,
      submittedText:
        `We have successfully received your registration for ${eventName}. Event updates, attendance information, and important reminders will be shared with you by email.`,
      updatedText:
        `Your registration for ${eventName} has been updated successfully. We will use your latest details for future event communication.`,
    };
  }

  return flowContent[flow];
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatLabel = (key: string) =>
  key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const formatDisplayValue = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return "";
};

const buildSubmissionRows = (submission: Record<string, unknown>) =>
  Object.entries(submission)
    .map(([key, value]) => [key, formatDisplayValue(value)] as const)
    .filter(([, value]) => value.length > 0)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;">${escapeHtml(
          formatLabel(key),
        )}</td><td style="padding:8px 12px;border:1px solid #ddd;">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");

const padNumber = (value: number) => String(value).padStart(2, "0");

const encodeBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};

const formatUtcTimestamp = (date: Date) =>
  `${date.getUTCFullYear()}${padNumber(date.getUTCMonth() + 1)}${padNumber(
    date.getUTCDate(),
  )}T${padNumber(date.getUTCHours())}${padNumber(date.getUTCMinutes())}${padNumber(
    date.getUTCSeconds(),
  )}Z`;

const formatDateStamp = ({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}) => `${year}${padNumber(month)}${padNumber(day)}`;

const formatDateTimeStamp = ({
  year,
  month,
  day,
  hours,
  minutes,
}: {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
}) =>
  `${year}${padNumber(month)}${padNumber(day)}T${padNumber(hours)}${padNumber(
    minutes,
  )}00`;

const parseDateParts = (rawDate: string) => {
  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    year: parsedDate.getUTCFullYear(),
    month: parsedDate.getUTCMonth() + 1,
    day: parsedDate.getUTCDate(),
  };
};

const parseTimeParts = (rawTime: string) => {
  const match = rawTime.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);

  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3]?.toLowerCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59) {
    return null;
  }

  if (meridiem) {
    if (hours < 1 || hours > 12) {
      return null;
    }

    if (meridiem === "pm" && hours !== 12) {
      hours += 12;
    }

    if (meridiem === "am" && hours === 12) {
      hours = 0;
    }
  } else if (hours > 23) {
    return null;
  }

  return {
    hours,
    minutes,
  };
};

const addMinutesToLocalDateTime = (
  value: {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
  },
  minutesToAdd: number,
) => {
  const parsedDate = new Date(
    Date.UTC(value.year, value.month - 1, value.day, value.hours, value.minutes),
  );

  parsedDate.setUTCMinutes(parsedDate.getUTCMinutes() + minutesToAdd);

  return {
    year: parsedDate.getUTCFullYear(),
    month: parsedDate.getUTCMonth() + 1,
    day: parsedDate.getUTCDate(),
    hours: parsedDate.getUTCHours(),
    minutes: parsedDate.getUTCMinutes(),
  };
};

const splitTimeRange = (rawTime: string) =>
  rawTime
    .trim()
    .replace(/\s+/g, " ")
    .split(/\s*(?:-|–|—|to)\s*/i)
    .filter((segment) => segment.length > 0);

const splitTimeRangeSafe = (rawTime: string) =>
  rawTime
    .trim()
    .replace(/\s+/g, " ")
    .split(/\s*(?:-|\u2013|\u2014|to)\s*/i)
    .filter((segment) => segment.length > 0);

const escapeIcsText = (value: string) =>
  value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\r\n", "\\n")
    .replaceAll("\n", "\\n");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "event";

const getRegistrationCode = (submission: Record<string, unknown>) =>
  String(submission.registration_code ?? "").trim().toUpperCase();

const buildVerificationUrl = (registrationCode: string) => {
  const verificationUrl = new URL("/verify-event-registration", PUBLIC_SITE_URL);
  verificationUrl.searchParams.set("code", registrationCode);
  return verificationUrl.toString();
};

const buildEventTicketAssets = async (
  submission: Record<string, unknown>,
): Promise<EventTicketAssets | null> => {
  const registrationCode = getRegistrationCode(submission);

  if (!registrationCode) {
    return null;
  }

  const verificationUrl = buildVerificationUrl(registrationCode);
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
  });
  const [, qrContent = ""] = qrDataUrl.split(",", 2);

  if (!qrContent) {
    return null;
  }

  return {
    registrationCode,
    verificationUrl,
    qrAttachment: {
      filename: `${registrationCode.toLowerCase()}.png`,
      content: qrContent,
      contentId: "event-registration-qr",
      contentType: "image/png",
    },
  };
};

const buildCalendarEvent = (
  submission: Record<string, unknown>,
): CalendarEvent | null => {
  const title = String(submission.event_name ?? "").trim();
  const dateLabel = String(submission.event_date ?? "").trim();
  const timeLabel = String(submission.event_time ?? "").trim();
  const location = String(submission.event_location ?? "").trim();

  if (!title || !dateLabel) {
    return null;
  }

  const dateParts = parseDateParts(dateLabel);

  if (!dateParts) {
    return null;
  }

  const [startTimeLabel, endTimeLabel] = splitTimeRangeSafe(timeLabel);
  const startTimeParts = startTimeLabel ? parseTimeParts(startTimeLabel) : null;
  const endTimeParts = endTimeLabel ? parseTimeParts(endTimeLabel) : null;

  const description = [
    `Registration confirmed for ${title}.`,
    location ? `Location: ${location}` : null,
    SUPPORT_EMAIL ? `Support Email: ${SUPPORT_EMAIL}` : null,
    SUPPORT_WHATSAPP_NUMBER ? `Support WhatsApp: ${SUPPORT_WHATSAPP_NUMBER}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  let googleCalendarDates = "";
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Northern Women Initiative//Event Registration//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@northernwomeninitiative.org`,
    `DTSTAMP:${formatUtcTimestamp(new Date())}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
  ];

  if (location) {
    icsLines.push(`LOCATION:${escapeIcsText(location)}`);
  }

  if (startTimeParts) {
    const startDateTime = {
      ...dateParts,
      hours: startTimeParts.hours,
      minutes: startTimeParts.minutes,
    };
    const endDateTime =
      endTimeParts && (
          endTimeParts.hours > startTimeParts.hours ||
          (endTimeParts.hours === startTimeParts.hours &&
            endTimeParts.minutes > startTimeParts.minutes)
        )
        ? {
            ...dateParts,
            hours: endTimeParts.hours,
            minutes: endTimeParts.minutes,
          }
        : addMinutesToLocalDateTime(startDateTime, 120);

    googleCalendarDates =
      `${formatDateTimeStamp(startDateTime)}/${formatDateTimeStamp(endDateTime)}`;

    icsLines.push(
      `DTSTART;TZID=${EVENT_TIMEZONE}:${formatDateTimeStamp(startDateTime)}`,
      `DTEND;TZID=${EVENT_TIMEZONE}:${formatDateTimeStamp(endDateTime)}`,
    );
  } else {
    const nextDay = addMinutesToLocalDateTime(
      {
        ...dateParts,
        hours: 0,
        minutes: 0,
      },
      24 * 60,
    );

    googleCalendarDates =
      `${formatDateStamp(dateParts)}/${formatDateStamp(nextDay)}`;

    icsLines.push(
      `DTSTART;VALUE=DATE:${formatDateStamp(dateParts)}`,
      `DTEND;VALUE=DATE:${formatDateStamp(nextDay)}`,
    );
  }

  icsLines.push(
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`${title} starts in 7 days.`)}`,
    "TRIGGER:-P7D",
    "END:VALARM",
  );
  icsLines.push("END:VEVENT", "END:VCALENDAR");

  const googleCalendarLink = new URL("https://calendar.google.com/calendar/render");
  googleCalendarLink.searchParams.set("action", "TEMPLATE");
  googleCalendarLink.searchParams.set("text", title);
  googleCalendarLink.searchParams.set("dates", googleCalendarDates);
  googleCalendarLink.searchParams.set("details", description);

  if (location) {
    googleCalendarLink.searchParams.set("location", location);
  }

  if (startTimeParts) {
    googleCalendarLink.searchParams.set("ctz", EVENT_TIMEZONE);
  }

  return {
    title,
    dateLabel,
    timeLabel,
    location,
    description,
    googleCalendarLink: googleCalendarLink.toString(),
    icsAttachment: {
      filename: `${slugify(title)}.ics`,
      content: encodeBase64(icsLines.join("\r\n")),
    },
  };
};

const buildDefaultUserEmailHtml = ({
  greeting,
  content,
  wasUpdate,
}: {
  greeting: string;
  content: FlowContent;
  wasUpdate: boolean;
}) => `
  <p>${greeting}</p>
  <p>${escapeHtml(wasUpdate ? content.updatedText : content.submittedText)}</p>
  <p>If you need to share anything else, you can reply to this email or contact the team directly.</p>
`;

const getSubmissionText = (submission: Record<string, unknown>, key: string) =>
  formatDisplayValue(submission[key]);

const buildSummaryList = (items: RegistrationSummaryItem[]) => {
  const renderedItems = items
    .filter((item) => item.value)
    .map(
      (item) =>
        `<li style="margin:0 0 8px 0;"><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}</li>`,
    )
    .join("");

  if (!renderedItems) {
    return "";
  }

  return `
    <h3 style="margin-top:24px;">Submitted Details</h3>
    <ul style="padding-left:20px;">
      ${renderedItems}
    </ul>
  `;
};

const buildSupportBlock = () => {
  const supportEmail = SUPPORT_EMAIL?.trim();
  const supportNumber = SUPPORT_WHATSAPP_NUMBER.trim();

  if (!supportEmail && !supportNumber) {
    return "";
  }

  return `
    <h3 style="margin-top:24px;">Need Help?</h3>
    ${supportNumber ? `<p><strong>WhatsApp:</strong> ${escapeHtml(supportNumber)}</p>` : ""}
    ${supportEmail ? `<p><strong>Email:</strong> ${escapeHtml(supportEmail)}</p>` : ""}
  `;
};

const buildJoinUsUserEmailHtml = ({
  greeting,
  content,
  wasUpdate,
  submission,
}: {
  greeting: string;
  content: FlowContent;
  wasUpdate: boolean;
  submission: Record<string, unknown>;
}) => {
  const summary = buildSummaryList([
    {
      label: "Full Name",
      value: `${getSubmissionText(submission, "first_name")} ${getSubmissionText(submission, "last_name")}`.trim(),
    },
    {
      label: "Email",
      value: getSubmissionText(submission, "email"),
    },
    {
      label: "Phone",
      value: getSubmissionText(submission, "phone"),
    },
    {
      label: "Occupation",
      value: getSubmissionText(submission, "occupation"),
    },
    {
      label: "Location",
      value: [
        getSubmissionText(submission, "town_city"),
        getSubmissionText(submission, "state"),
        getSubmissionText(submission, "country"),
      ]
        .filter(Boolean)
        .join(", "),
    },
  ]);

  return `
    <p>${greeting}</p>
    <p>Thank you for choosing to connect with Northern Women Initiative. We are delighted to confirm that your registration has been received successfully.</p>
    <p>${escapeHtml(wasUpdate ? content.updatedText : content.submittedText)}</p>
    <h3 style="margin-top:24px;">Next Steps</h3>
    <ul style="padding-left:20px;">
      <li>Our team will review your details and keep them on record for future engagement and follow-up.</li>
      <li>You may receive updates about programs, mentorship opportunities, community outreach, and partnership initiatives led by the initiative.</li>
      <li>If we need any clarification, we will contact you using the email address or phone number you provided.</li>
    </ul>
    ${summary}
    ${buildSupportBlock()}
    <p style="margin-top:24px;">We appreciate your desire to be part of a growing network committed to empowering women, nurturing leadership, and strengthening community development across Northern Nigeria and beyond.</p>
    <p>Together, we can continue building opportunities that uplift women, families, and communities.</p>
    <p>Warm regards,<br />Northern Women Initiative for Empowerment, Growth and Development Team</p>
  `;
};

const buildVolunteerUserEmailHtml = ({
  greeting,
  content,
  wasUpdate,
  submission,
}: {
  greeting: string;
  content: FlowContent;
  wasUpdate: boolean;
  submission: Record<string, unknown>;
}) => {
  const summary = buildSummaryList([
    {
      label: "Full Name",
      value: `${getSubmissionText(submission, "first_name")} ${getSubmissionText(submission, "last_name")}`.trim(),
    },
    {
      label: "Email",
      value: getSubmissionText(submission, "email"),
    },
    {
      label: "Phone",
      value: getSubmissionText(submission, "phone"),
    },
    {
      label: "Message",
      value: getSubmissionText(submission, "message"),
    },
  ]);

  return `
    <p>${greeting}</p>
    <p>Thank you for offering to serve with Northern Women Initiative. We are delighted to confirm that your volunteer application has been received successfully.</p>
    <p>${escapeHtml(wasUpdate ? content.updatedText : content.submittedText)}</p>
    <h3 style="margin-top:24px;">Next Steps</h3>
    <ul style="padding-left:20px;">
      <li>Our team will review your skills, availability, and stated areas of interest.</li>
      <li>We will contact you when there is a suitable volunteer opportunity, onboarding update, or next action required.</li>
      <li>Please keep this email as confirmation that your volunteer application has been submitted.</li>
    </ul>
    ${summary}
    ${buildSupportBlock()}
    <p style="margin-top:24px;">Thank you for your willingness to contribute your time, compassion, and support toward empowering women and strengthening communities.</p>
    <p>Your willingness to serve helps advance the work of dignity, opportunity, and community transformation that defines our mission.</p>
    <p>Warm regards,<br />Northern Women Initiative for Empowerment, Growth and Development Team</p>
  `;
};

const buildSummitUserEmailHtml = ({
  greeting,
  content,
  wasUpdate,
  submission,
}: {
  greeting: string;
  content: FlowContent;
  wasUpdate: boolean;
  submission: Record<string, unknown>;
}) => {
  const summary = buildSummaryList([
    {
      label: "Full Name",
      value: `${getSubmissionText(submission, "first_name")} ${getSubmissionText(submission, "last_name")}`.trim(),
    },
    {
      label: "Email",
      value: getSubmissionText(submission, "email"),
    },
    {
      label: "Phone",
      value: getSubmissionText(submission, "phone"),
    },
    {
      label: "Occupation",
      value: getSubmissionText(submission, "occupation"),
    },
    {
      label: "Organization",
      value: getSubmissionText(submission, "organization"),
    },
    {
      label: "Location",
      value: [getSubmissionText(submission, "state"), getSubmissionText(submission, "country")]
        .filter(Boolean)
        .join(", "),
    },
  ]);

  return `
    <p>${greeting}</p>
    <p>Thank you for registering for the Northern Women Summit 2026. We are delighted to confirm that your registration has been received successfully.</p>
    <p>${escapeHtml(wasUpdate ? content.updatedText : content.submittedText)}</p>
    <h3 style="margin-top:24px;">Next Steps</h3>
    <ul style="padding-left:20px;">
      <li>You will receive future summit updates, participation guidance, and important announcements by email.</li>
      <li>Your submitted details will help the team plan communication, attendance support, and event coordination effectively.</li>
      <li>Please keep this email for your records as confirmation of your summit registration.</li>
    </ul>
    ${summary}
    ${buildSupportBlock()}
    <p style="margin-top:24px;">We look forward to welcoming you to a meaningful gathering centered on empowerment, leadership, shared learning, and sustainable community development.</p>
    <p>The summit is part of our continued commitment to amplifying women’s voices and building stronger communities through collective action.</p>
    <p>Warm regards,<br />Northern Women Initiative for Empowerment, Growth and Development Team</p>
  `;
};

const buildSummitUserEmailHtmlBranded = ({
  greeting,
  content,
  wasUpdate,
  submission,
}: {
  greeting: string;
  content: FlowContent;
  wasUpdate: boolean;
  submission: Record<string, unknown>;
}) => {
  const summary = buildSummaryList([
    {
      label: "Full Name",
      value: `${getSubmissionText(submission, "first_name")} ${getSubmissionText(submission, "last_name")}`.trim(),
    },
    {
      label: "Email",
      value: getSubmissionText(submission, "email"),
    },
    {
      label: "Phone",
      value: getSubmissionText(submission, "phone"),
    },
    {
      label: "Occupation",
      value: getSubmissionText(submission, "occupation"),
    },
    {
      label: "Organization",
      value: getSubmissionText(submission, "organization"),
    },
    {
      label: "Location",
      value: [getSubmissionText(submission, "state"), getSubmissionText(submission, "country")]
        .filter(Boolean)
        .join(", "),
    },
  ]);

  return `
    <p>${greeting}</p>
    <p>Thank you for registering for the Northern Women Summit 2026. We are delighted to confirm that your registration has been received successfully.</p>
    <p>${escapeHtml(wasUpdate ? content.updatedText : content.submittedText)}</p>
    <h3 style="margin-top:24px;">Next Steps</h3>
    <ul style="padding-left:20px;">
      <li>You will receive future summit updates, participation guidance, and important announcements by email.</li>
      <li>Your submitted details will help the team plan communication, attendance support, and event coordination effectively.</li>
      <li>Please keep this email for your records as confirmation of your summit registration.</li>
    </ul>
    ${summary}
    ${buildSupportBlock()}
    <p style="margin-top:24px;">We look forward to welcoming you to a meaningful gathering centered on empowerment, leadership, shared learning, and sustainable community development.</p>
    <p>The summit is part of our continued commitment to amplifying women's voices and building stronger communities through collective action.</p>
    <p>Warm regards,<br />Northern Women Initiative for Empowerment, Growth and Development Team</p>
  `;
};

const buildUserEmailHtml = ({
  flow,
  greeting,
  content,
  wasUpdate,
  submission,
  calendarEvent,
  eventTicketAssets,
}: {
  flow: Flow;
  greeting: string;
  content: FlowContent;
  wasUpdate: boolean;
  submission: Record<string, unknown>;
  calendarEvent: CalendarEvent | null;
  eventTicketAssets: EventTicketAssets | null;
}) => {
  if (flow === "event") {
    return buildEventUserEmailHtml({
      greeting,
      content,
      wasUpdate,
      calendarEvent,
      eventTicketAssets,
    });
  }

  if (flow === "join_us") {
    return buildJoinUsUserEmailHtml({
      greeting,
      content,
      wasUpdate,
      submission,
    });
  }

  if (flow === "volunteer") {
    return buildVolunteerUserEmailHtml({
      greeting,
      content,
      wasUpdate,
      submission,
    });
  }

  if (flow === "summit_2026") {
    return buildSummitUserEmailHtmlBranded({
      greeting,
      content,
      wasUpdate,
      submission,
    });
  }

  return buildDefaultUserEmailHtml({
    greeting,
    content,
    wasUpdate,
  });
};

const buildEventUserEmailHtml = ({
  greeting,
  content,
  wasUpdate,
  calendarEvent,
  eventTicketAssets,
}: {
  greeting: string;
  content: FlowContent;
  wasUpdate: boolean;
  calendarEvent: CalendarEvent | null;
  eventTicketAssets: EventTicketAssets | null;
}) => {
  const eventTitle = calendarEvent?.title ?? content.confirmationTitle.replace(/ Registration$/, "");
  const eventDate = calendarEvent?.dateLabel || "To be confirmed";
  const eventTime = calendarEvent?.timeLabel || "To be confirmed";
  const eventLocation = calendarEvent?.location || "To be confirmed";
  const supportEmail = SUPPORT_EMAIL?.trim();
  const supportNumber = SUPPORT_WHATSAPP_NUMBER.trim();
  const registrationCode = eventTicketAssets?.registrationCode || "Pending assignment";
  const verificationUrl = eventTicketAssets?.verificationUrl || "";

  return `
    <p>${greeting}</p>
    <p>Thank you for registering for our upcoming event. We are delighted to confirm your successful registration.</p>
    <p><strong>Registration ID:</strong> ${escapeHtml(registrationCode)}</p>
    <h3 style="margin-top:24px;">Event Details</h3>
    <p><strong>Event Title:</strong> ${escapeHtml(eventTitle)}</p>
    <p><strong>Date:</strong> ${escapeHtml(eventDate)}</p>
    <p><strong>Time:</strong> ${escapeHtml(eventTime)}</p>
    <p><strong>Venue / Link:</strong> ${escapeHtml(eventLocation)}</p>
    ${
      eventTicketAssets
        ? `
          <h3 style="margin-top:24px;">Your Event QR Code</h3>
          <p>Please keep this QR code and your registration ID available. The QR code opens your secure registration verification page.</p>
          <p><img src="cid:event-registration-qr" alt="Event registration QR code" width="220" height="220" style="display:block;border:1px solid #ddd;border-radius:16px;padding:12px;background:#fff;" /></p>
          <p><a href="${escapeHtml(verificationUrl)}">Open your verification page</a></p>
        `
        : ""
    }
    ${
      calendarEvent
        ? `
          <h3 style="margin-top:24px;">Add to Your Calendar</h3>
          <p><strong>Action required:</strong> add this event to your calendar now so you receive a reminder before the event date.</p>
          <p><a href="${escapeHtml(calendarEvent.googleCalendarLink)}">Click here to add this event to Google Calendar</a></p>
          <p>If you use Outlook, Apple Calendar, or another calendar app, open the attached <strong>${escapeHtml(calendarEvent.icsAttachment.filename)}</strong> file and save it to your calendar.</p>
          <p>The attached calendar file includes a reminder scheduled for <strong>7 days before the event</strong>.</p>
        `
        : ""
    }
    <h3 style="margin-top:24px;">Important Information</h3>
    <ul>
      <li>Please arrive at least 10 to 15 minutes early, or join the online link promptly if the event is virtual.</li>
      <li>Keep this email as your registration confirmation.</li>
      <li>Please add this event to your calendar immediately after reading this email.</li>
    </ul>
    ${
      supportEmail || supportNumber
        ? `
          <h3 style="margin-top:24px;">Need Help?</h3>
          ${supportNumber ? `<p><strong>WhatsApp:</strong> ${escapeHtml(supportNumber)}</p>` : ""}
          ${supportEmail ? `<p><strong>Email:</strong> ${escapeHtml(supportEmail)}</p>` : ""}
        `
        : ""
    }
    <p style="margin-top:24px;">We look forward to welcoming you and having you participate in this meaningful session dedicated to empowering women and strengthening community development.</p>
    <p>Thank you for standing with Northern Women Initiative as we continue to create spaces for learning, leadership, and lasting impact.</p>
    <p>Warm regards,<br />Northern Women Initiative for Empowerment, Growth and Development Team</p>
    ${
      wasUpdate
        ? `<p style="color:#666;">${escapeHtml(content.updatedText)}</p>`
        : ""
    }
  `;
};

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
      ...(attachment.contentId ? { content_id: attachment.contentId } : {}),
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

  return data;
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

    if (!CONTACT_ADMIN_EMAIL) {
      throw new Error("Missing CONTACT_ADMIN_EMAIL secret");
    }

    const body = await req.json();
    const flow = String(body.flow ?? "") as Flow;
    const wasUpdate = Boolean(body.wasUpdate);
    const submission =
      typeof body.submission === "object" && body.submission !== null
        ? (body.submission as Record<string, unknown>)
        : null;

    if (!submission) {
      return new Response(JSON.stringify({ error: "Missing submission payload" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (flow !== "event" && !(flow in flowContent)) {
      return new Response(JSON.stringify({ error: "Unsupported registration flow" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const email = String(submission.email ?? "").trim();
    const firstName = String(submission.first_name ?? "").trim();

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing registrant email" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const content = getFlowContent(flow, submission);
    const calendarEvent = flow === "event" ? buildCalendarEvent(submission) : null;
    const eventTicketAssets =
      flow === "event" ? await buildEventTicketAssets(submission) : null;
    const submissionRows = buildSubmissionRows(submission);
    const actionText = wasUpdate ? "Updated" : "Submitted";
    const userGreeting = firstName ? `Dear ${escapeHtml(firstName)},` : "Dear Registrant,";
    const userSubject =
      flow === "event"
        ? `${content.confirmationTitle} ${wasUpdate ? "Updated - Update Your Calendar" : "Received - Add to Calendar"}`
        : `${content.confirmationTitle} ${wasUpdate ? "Updated" : "Received"}`;

    await sendEmail({
      to: CONTACT_ADMIN_EMAIL,
      replyTo: email,
      subject: `${content.adminLabel} ${actionText}`,
      html: `
        <h2>${escapeHtml(content.adminLabel)} ${escapeHtml(actionText)}</h2>
        <p>A ${wasUpdate ? "registration update" : "new registration"} was received.</p>
        <table style="border-collapse:collapse;width:100%;max-width:720px;">
          ${submissionRows}
        </table>
        ${
          eventTicketAssets
            ? `<p style="margin-top:16px;"><strong>Verification Link:</strong> <a href="${escapeHtml(eventTicketAssets.verificationUrl)}">${escapeHtml(eventTicketAssets.verificationUrl)}</a></p>`
            : ""
        }
      `,
    });

    await sendEmail({
      to: email,
      subject: userSubject,
      html: buildUserEmailHtml({
        flow,
        greeting: userGreeting,
        content,
        wasUpdate,
        submission,
        calendarEvent,
        eventTicketAssets,
      }),
      replyTo: CONTACT_ADMIN_EMAIL,
      attachments: [calendarEvent?.icsAttachment, eventTicketAssets?.qrAttachment].filter(
        Boolean,
      ) as EmailAttachment[],
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
