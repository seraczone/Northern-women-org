export type MembershipType = "new" | "renewal";

export type MembershipFormData = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
  occupation: string;
  business_name: string;
  business_category: string;
  residential_address: string;
  local_government: string;
  town_city: string;
  state: string;
  country: string;
  membership_type: MembershipType;
  membership_year: string;
  terms_accepted: boolean;
  conduct_accepted: boolean;
  privacy_accepted: boolean;
};

export type MembershipPaymentSettings = {
  bank_name: string;
  account_name: string;
  account_number: string;
  payment_instructions: string;
};

export const MEMBERSHIP_POLICY_VERSION = "2026-11-21";
export const MEMBERSHIP_RECEIPTS_BUCKET = "membership-payment-receipts";
export const MEMBERSHIP_RECEIPT_MAX_SIZE = 5 * 1024 * 1024;
export const MEMBERSHIP_RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;

export const initialMembershipForm = (): MembershipFormData => ({
  first_name: "",
  last_name: "",
  date_of_birth: "",
  phone: "",
  email: "",
  occupation: "",
  business_name: "",
  business_category: "",
  residential_address: "",
  local_government: "",
  town_city: "",
  state: "",
  country: "Nigeria",
  membership_type: "new",
  membership_year: String(new Date().getFullYear()),
  terms_accepted: false,
  conduct_accepted: false,
  privacy_accepted: false,
});

export const getMembershipFee = (membershipType: MembershipType) =>
  membershipType === "new" ? 40000 : 30000;

export function validateMembershipReceiptFile(file: File | null) {
  if (!file) return "Upload a payment receipt to continue.";
  if (!MEMBERSHIP_RECEIPT_TYPES.includes(file.type as (typeof MEMBERSHIP_RECEIPT_TYPES)[number])) {
    return "Receipt must be a JPG, PNG, or PDF file.";
  }
  if (file.size > MEMBERSHIP_RECEIPT_MAX_SIZE) {
    return "Receipt file must be 5MB or smaller.";
  }
  return null;
}
