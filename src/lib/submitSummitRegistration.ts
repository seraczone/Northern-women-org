import { supabase } from "@/lib/supabase";
import {
  SUMMIT_PAYMENT_RECEIPTS_BUCKET,
  SUMMIT_STANDARD_TICKET_TYPE,
  SummitRegistrationFormData,
  buildReceiptStoragePath,
  calculateTicketTotal,
  getFirstNameFromFullName,
  yesNoChoiceToBoolean,
} from "@/lib/summitRegistration";

const MAX_RECEIPT_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;

type SubmitSummitRegistrationOptions = {
  formData: SummitRegistrationFormData;
  receiptFile: File;
};

type SubmitSummitRegistrationResult = {
  error: { message: string; code?: string | null } | null;
  notificationError: { message: string } | null;
};

const toNullableString = (value: string) => {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
};

const buildLegacyNameParts = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? null;
  const lastName = parts.slice(1).join(" ").trim() || parts[0] || null;

  return {
    firstName,
    lastName,
  };
};

export function validateSummitReceiptFile(file: File | null) {
  if (!file) {
    return "Upload a payment receipt to continue.";
  }

  if (!ACCEPTED_RECEIPT_TYPES.includes(file.type as (typeof ACCEPTED_RECEIPT_TYPES)[number])) {
    return "Receipt must be a JPG, PNG, or PDF file.";
  }

  if (file.size > MAX_RECEIPT_FILE_SIZE) {
    return "Receipt file must be 5MB or smaller.";
  }

  return null;
}

export async function submitSummitRegistration({
  formData,
  receiptFile,
}: SubmitSummitRegistrationOptions): Promise<SubmitSummitRegistrationResult> {
  const fileValidationError = validateSummitReceiptFile(receiptFile);

  if (fileValidationError) {
    return {
      error: { message: fileValidationError },
      notificationError: null,
    };
  }

  const normalizedEmail = formData.email.trim().toLowerCase();
  const registrationReference = formData.registration_reference.trim();
  const normalizedTicketType = SUMMIT_STANDARD_TICKET_TYPE;
  const totalAmount = calculateTicketTotal(normalizedTicketType, formData.quantity);
  const receiptPath = buildReceiptStoragePath(registrationReference, receiptFile.name);
  const { firstName, lastName } = buildLegacyNameParts(formData.full_name);

  const uploadResponse = await supabase.storage
    .from(SUMMIT_PAYMENT_RECEIPTS_BUCKET)
    .upload(receiptPath, receiptFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: receiptFile.type,
    });

  if (uploadResponse.error) {
    return {
      error: uploadResponse.error,
      notificationError: null,
    };
  }

  const registrationRecord = {
    first_name: firstName,
    last_name: lastName,
    email: normalizedEmail,
    phone: formData.phone.trim(),
    address: toNullableString(formData.city),
    state: formData.state,
    country: formData.country.trim() || "Nigeria",
    occupation: toNullableString(formData.industry),
    organization: toNullableString(formData.business_name),
    expectations: toNullableString(formData.summit_interest),
    full_name: formData.full_name.trim(),
    city: toNullableString(formData.city),
    member_status: yesNoChoiceToBoolean(formData.member_status),
    membership_id:
      formData.member_status === "yes" ? toNullableString(formData.membership_id) : null,
    ticket_type: normalizedTicketType,
    quantity: formData.quantity,
    total_amount: totalAmount,
    registration_reference: registrationReference,
    payment_status: "pending",
    transaction_reference: formData.transaction_reference.trim(),
    receipt_url: receiptPath,
    payment_date: formData.payment_date,
    payment_method: formData.payment_method,
    summit_interest: toNullableString(formData.summit_interest),
    attended_before: yesNoChoiceToBoolean(formData.attended_before),
    business_owner: yesNoChoiceToBoolean(formData.business_owner),
    business_name:
      formData.business_owner === "yes" ? toNullableString(formData.business_name) : null,
    industry: toNullableString(formData.industry),
    networking_interest: yesNoChoiceToBoolean(formData.networking_interest),
    networking_directory: yesNoChoiceToBoolean(formData.networking_directory),
    dietary_requirements: toNullableString(formData.dietary_requirements),
    emergency_contact: toNullableString(formData.emergency_contact),
    referral_source: toNullableString(formData.referral_source),
    media_consent: formData.media_consent,
    agreement: formData.agreement,
  };

  const { error } = await supabase.from("summit_2026_registrations").insert([registrationRecord]);

  if (error) {
    const normalizedMessage =
      error.code === "23505"
        ? "A registration with this email, transaction reference, or registration reference already exists."
        : error.message;

    return {
      error: {
        ...error,
        message: normalizedMessage,
      },
      notificationError: null,
    };
  }

  const notificationResponse = await supabase.functions.invoke("send-summit-email", {
    body: {
      action: "registration_received",
      registration: {
        email: normalizedEmail,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        city: toNullableString(formData.city),
        state: formData.state,
        country: formData.country.trim() || "Nigeria",
        ticket_type: normalizedTicketType,
        quantity: formData.quantity,
        total_amount: totalAmount,
        registration_reference: registrationReference,
        payment_status: "pending",
        transaction_reference: formData.transaction_reference.trim(),
        payment_method: formData.payment_method,
        payment_date: formData.payment_date,
        first_name: getFirstNameFromFullName(formData.full_name),
      },
    },
  });

  return {
    error: null,
    notificationError: notificationResponse.error
      ? {
          message:
            notificationResponse.error.message ||
            "Unable to send summit registration email notifications.",
        }
      : null,
  };
}
