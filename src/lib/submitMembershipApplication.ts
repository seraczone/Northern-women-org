import { supabase } from "@/lib/supabase";
import {
  getMembershipFee,
  MEMBERSHIP_RECEIPTS_BUCKET,
  MEMBERSHIP_POLICY_VERSION,
  MembershipFormData,
  MembershipPaymentSettings,
  validateMembershipReceiptFile,
} from "@/lib/membershipApplication";

type SubmitMembershipApplicationOptions = {
  formData: MembershipFormData;
  receiptFile: File | null;
  paymentReference: string;
  paymentSettings: MembershipPaymentSettings;
};

type MembershipSubmissionResult = {
  error: { message: string; code?: string | null } | null;
  notificationError: { message: string } | null;
  applicationSaved: boolean;
  applicationId: string | null;
  uploadToken: string | null;
  receiptSubmitted: boolean;
};

const result = (
  values: Partial<MembershipSubmissionResult> = {},
): MembershipSubmissionResult => ({
  error: null,
  notificationError: null,
  applicationSaved: false,
  applicationId: null,
  uploadToken: null,
  receiptSubmitted: false,
  ...values,
});

const toNullableString = (value: string) => value.trim() || null;

function buildReceiptPath(applicationId: string, uploadToken: string, file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "file";
  return `${applicationId}/${uploadToken}/${crypto.randomUUID()}.${extension}`;
}

async function uploadAndSubmitReceipt({
  applicationId,
  uploadToken,
  receiptFile,
  paymentReference,
}: {
  applicationId: string;
  uploadToken: string;
  receiptFile: File;
  paymentReference: string;
}) {
  const receiptPath = buildReceiptPath(applicationId, uploadToken, receiptFile);
  const uploadResponse = await supabase.storage
    .from(MEMBERSHIP_RECEIPTS_BUCKET)
    .upload(receiptPath, receiptFile, {
      cacheControl: "3600",
      contentType: receiptFile.type,
      upsert: false,
    });

  if (uploadResponse.error) return uploadResponse.error;

  const { error } = await supabase.rpc("submit_membership_payment_receipt", {
    p_application_id: applicationId,
    p_token: uploadToken,
    p_receipt_path: receiptPath,
    p_payment_reference: toNullableString(paymentReference),
  });

  return error;
}

async function notifyMembershipSubmission({
  formData,
  fee,
  year,
  paymentSettings,
  paymentReference,
  wasUpdate,
}: {
  formData: MembershipFormData;
  fee: number;
  year: number;
  paymentSettings: MembershipPaymentSettings;
  paymentReference: string;
  wasUpdate: boolean;
}) {
  const { error } = await supabase.functions.invoke("send-registration-email", {
    body: {
      flow: "membership",
      wasUpdate,
      submission: {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        business_name: formData.business_name.trim(),
        business_category: formData.business_category === "Other"
          ? formData.business_category_other.trim()
          : formData.business_category,
        state: formData.state,
        country: formData.country.trim(),
        membership_type: formData.membership_type,
        membership_year: year,
        fee,
        expiry_date: `${year}-12-31`,
        payment_status: "pending_verification",
        membership_status: "pending",
        ...(wasUpdate
          ? {}
          : {
              bank_name: paymentSettings.bank_name,
              account_name: paymentSettings.account_name,
              account_number: paymentSettings.account_number,
              payment_instructions: paymentSettings.payment_instructions,
              payment_reference: paymentReference.trim(),
            }),
      },
    },
  });

  return error ? { message: error.message || "Unable to send membership email notification." } : null;
}

export async function submitMembershipApplication({
  formData,
  receiptFile,
  paymentReference,
  paymentSettings,
}: SubmitMembershipApplicationOptions): Promise<MembershipSubmissionResult> {
  const fileValidationError = validateMembershipReceiptFile(receiptFile);
  if (fileValidationError) return result({ error: { message: fileValidationError } });

  if (!paymentSettings.bank_name.trim() || !paymentSettings.account_name.trim() || !/^[0-9]{10}$/.test(paymentSettings.account_number.trim())) {
    return result({ error: { message: "Membership payment details are not ready. Please contact Northern Women Initiative for assistance." } });
  }

  const safeFile = receiptFile as File;
  const applicationId = crypto.randomUUID();
  const uploadToken = crypto.randomUUID();
  const year = Number(formData.membership_year);
  const fee = getMembershipFee(formData.membership_type);
  const { business_category_other: businessCategoryOther, ...applicationFields } = formData;

  const { error: insertError } = await supabase.from("membership_applications").insert({
    ...applicationFields,
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    email: formData.email.trim().toLowerCase(),
    date_of_birth: null,
    occupation: null,
    residential_address: null,
    local_government: null,
    town_city: null,
    business_name: toNullableString(formData.business_name),
    business_category: toNullableString(
      formData.business_category === "Other"
        ? businessCategoryOther
        : formData.business_category,
    ),
    id: applicationId,
    receipt_upload_token: uploadToken,
    membership_year: year,
    fee,
    expiry_date: `${year}-12-31`,
    accepted_at: new Date().toISOString(),
    policy_version: MEMBERSHIP_POLICY_VERSION,
  });

  if (insertError) {
    return result({
      error: {
        ...insertError,
        message: insertError.code === "23505"
          ? "An application for this email and membership year already exists. Please contact NWI for help."
          : insertError.message,
      },
    });
  }

  const receiptError = await uploadAndSubmitReceipt({
    applicationId,
    uploadToken,
    receiptFile: safeFile,
    paymentReference,
  });

  if (receiptError) {
    return result({
      error: { message: receiptError.message },
      applicationSaved: true,
      applicationId,
      uploadToken,
    });
  }

  const notificationError = await notifyMembershipSubmission({
    formData,
    fee,
    year,
    paymentSettings,
    paymentReference,
    wasUpdate: false,
  });

  return result({
    applicationSaved: true,
    applicationId,
    uploadToken,
    receiptSubmitted: true,
    notificationError,
  });
}

export async function submitMembershipReceipt({
  applicationId,
  uploadToken,
  receiptFile,
  formData,
  paymentReference,
}: {
  applicationId: string;
  uploadToken: string;
  receiptFile: File | null;
  formData: MembershipFormData;
  paymentReference: string;
}): Promise<MembershipSubmissionResult> {
  const fileValidationError = validateMembershipReceiptFile(receiptFile);
  if (fileValidationError) return result({ error: { message: fileValidationError } });

  const error = await uploadAndSubmitReceipt({
    applicationId,
    uploadToken,
    receiptFile: receiptFile as File,
    paymentReference,
  });
  if (error) return result({ error: { message: error.message } });

  const notificationError = await notifyMembershipSubmission({
    formData,
    fee: getMembershipFee(formData.membership_type),
    year: Number(formData.membership_year),
    paymentSettings: { bank_name: "", account_name: "", account_number: "", payment_instructions: "" },
    paymentReference,
    wasUpdate: true,
  });

  return result({ receiptSubmitted: true, notificationError });
}
