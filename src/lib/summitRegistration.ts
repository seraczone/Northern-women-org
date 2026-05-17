export const SUMMIT_REGISTRATION_DRAFT_KEY = "summit-2026-registration-draft";
export const SUMMIT_PAYMENT_RECEIPTS_BUCKET = "payment-receipts";
export const SUMMIT_SUPPORT_EMAIL = "support@northernwomen.org";
export const SUMMIT_SUPPORT_WHATSAPP = "+234 906 737 9828";
export const SUMMIT_DATE_LABEL = "November 1, 2026";
export const SUMMIT_VENUE_LABEL = "International Conference Centre, Abuja";
export const SUMMIT_BASE_FEE = 70000;
export const SUMMIT_STANDARD_TICKET_TYPE = "standard" as const;

export type YesNoChoice = "" | "yes" | "no";
export type TicketType = "standard" | "group" | "vip";
export type PaymentStatus = "pending" | "approved" | "rejected";

export type SummitRegistrationFormData = {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  member_status: YesNoChoice;
  membership_id: string;
  ticket_type: TicketType;
  quantity: number;
  registration_reference: string;
  transaction_reference: string;
  payment_date: string;
  payment_method: string;
  summit_interest: string;
  attended_before: YesNoChoice;
  business_owner: YesNoChoice;
  business_name: string;
  industry: string;
  networking_interest: YesNoChoice;
  networking_directory: YesNoChoice;
  dietary_requirements: string;
  emergency_contact: string;
  referral_source: string;
  media_consent: boolean;
  agreement: boolean;
};

export type SummitRegistrationRecord = {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  city: string | null;
  state: string;
  country: string;
  member_status: boolean | null;
  membership_id: string | null;
  ticket_type: TicketType;
  quantity: number;
  total_amount: number;
  registration_reference: string;
  payment_status: PaymentStatus;
  transaction_reference: string;
  receipt_url: string | null;
  payment_date: string | null;
  payment_method: string | null;
  summit_interest: string | null;
  attended_before: boolean | null;
  business_owner: boolean | null;
  business_name: string | null;
  industry: string | null;
  networking_interest: boolean | null;
  networking_directory: boolean | null;
  dietary_requirements: string | null;
  emergency_contact: string | null;
  referral_source: string | null;
  media_consent: boolean | null;
  agreement: boolean | null;
  created_at: string;
  updated_at?: string;
};

export const summitStepLabels = [
  "Personal Information",
  "Membership Verification",
  "Ticket Information",
  "Payment Information",
  "Summit Experience",
  "Business & Networking",
  "Additional Information",
  "Consent & Confirmation",
] as const;

export const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export const paymentMethodOptions = [
  "Bank Transfer",
  "Bank Deposit",
  "POS Transfer",
] as const;

export const industryOptions = [
  "Agriculture",
  "Fashion",
  "Tech",
  "NGO",
  "Finance",
  "Education",
  "Health",
  "Media",
  "Beauty",
  "Other",
] as const;

export const referralSourceOptions = [
  "Instagram",
  "WhatsApp",
  "Facebook",
  "TikTok",
  "Friend/Family",
  "Church/Mosque",
  "Community",
  "Other",
] as const;

export const yesNoOptions = [
  { label: "Yes", value: "yes" as const },
  { label: "No", value: "no" as const },
] as const;

export const summitTicketOptions = [
  {
    value: SUMMIT_STANDARD_TICKET_TYPE,
    label: "Standard Pass",
    price: 70000,
    detail: "Full summit access for one attendee.",
  },
] as const;

export const summitInitialFormData = (
  registrationReference = generateRegistrationReference(),
): SummitRegistrationFormData => ({
  full_name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  country: "Nigeria",
  member_status: "",
  membership_id: "",
  ticket_type: SUMMIT_STANDARD_TICKET_TYPE,
  quantity: 1,
  registration_reference: registrationReference,
  transaction_reference: "",
  payment_date: "",
  payment_method: "",
  summit_interest: "",
  attended_before: "",
  business_owner: "",
  business_name: "",
  industry: "",
  networking_interest: "",
  networking_directory: "",
  dietary_requirements: "",
  emergency_contact: "",
  referral_source: "",
  media_consent: false,
  agreement: false,
});

export function generateRegistrationReference() {
  return `NWS2026-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function getTicketOption(ticketType: TicketType) {
  return summitTicketOptions.find((option) => option.value === ticketType) ?? summitTicketOptions[0];
}

export function calculateTicketTotal(ticketType: TicketType, quantity: number) {
  return getTicketOption(ticketType).price * quantity;
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function yesNoChoiceToBoolean(value: YesNoChoice) {
  if (value === "yes") {
    return true;
  }

  if (value === "no") {
    return false;
  }

  return null;
}

export function booleanToYesNoChoice(value: boolean | null | undefined): YesNoChoice {
  if (value === true) {
    return "yes";
  }

  if (value === false) {
    return "no";
  }

  return "";
}

export function sanitizeStorageFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export function getFirstNameFromFullName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

export function buildReceiptStoragePath(reference: string, fileName: string) {
  const cleanedReference = reference.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const timestamp = Date.now();
  return `${cleanedReference}/${timestamp}-${sanitizeStorageFileName(fileName)}`;
}

export function formatBooleanLabel(value: boolean | null | undefined) {
  if (value === true) {
    return "Yes";
  }

  if (value === false) {
    return "No";
  }

  return "Not provided";
}
