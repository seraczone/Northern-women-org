import { supabase } from "@/lib/supabase";

type RegistrationPayload = Record<string, string | null>;
type RegistrationTable =
  | "join_us_registrations"
  | "summit_2026_registrations"
  | "volunteer_applications";

type SaveRegistrationOptions = {
  table: RegistrationTable;
  email: string;
  payload: RegistrationPayload;
};

type SaveRegistrationResult = {
  error: { message: string; code?: string | null } | null;
  wasUpdate: boolean;
};

const findExistingRecordIds = async (
  table: RegistrationTable,
  rawEmail: string,
  normalizedEmail: string,
) => {
  const recordIds = new Set<string>();

  const exactLookup = await supabase
    .from(table)
    .select("id")
    .eq("email", rawEmail)
    .limit(20);

  if (exactLookup.error) {
    return exactLookup;
  }

  exactLookup.data?.forEach((record) => {
    recordIds.add(record.id);
  });

  if (normalizedEmail !== rawEmail) {
    const normalizedLookup = await supabase
      .from(table)
      .select("id")
      .eq("email", normalizedEmail)
      .limit(20);

    if (normalizedLookup.error) {
      return normalizedLookup;
    }

    normalizedLookup.data?.forEach((record) => {
      recordIds.add(record.id);
    });
  }

  if (recordIds.size > 0) {
    return {
      data: Array.from(recordIds).map((id) => ({ id })),
      error: null,
    };
  }

  return supabase
    .from(table)
    .select("id")
    .ilike("email", rawEmail.replace(/[%_]/g, "\\$&"))
    .limit(20);
};

export async function saveRegistrationByEmail({
  table,
  email,
  payload,
}: SaveRegistrationOptions): Promise<SaveRegistrationResult> {
  const rawEmail = email.trim();
  const normalizedEmail = rawEmail.toLowerCase();
  const record = {
    ...payload,
    email: normalizedEmail,
  };

  const existingRecord = await findExistingRecordIds(table, rawEmail, normalizedEmail);

  if (existingRecord.error) {
    return {
      error: existingRecord.error,
      wasUpdate: false,
    };
  }

  const existingIds = existingRecord.data?.map((record) => record.id) || [];

  if (existingIds.length > 0) {
    const { error } = await supabase.from(table).update(record).in("id", existingIds);

    return {
      error,
      wasUpdate: !error,
    };
  }

  const { error } = await supabase.from(table).insert([record]);

  if (error?.code !== "23505") {
    return {
      error,
      wasUpdate: false,
    };
  }

  const retryLookup = await findExistingRecordIds(table, rawEmail, normalizedEmail);

  const retryIds = retryLookup.data?.map((record) => record.id) || [];

  if (retryLookup.error || retryIds.length === 0) {
    return {
      error: retryLookup.error || error,
      wasUpdate: false,
    };
  }

  const retryUpdate = await supabase.from(table).update(record).in("id", retryIds);

  return {
    error: retryUpdate.error,
    wasUpdate: !retryUpdate.error,
  };
}
