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

type NotificationError = {
  message: string;
} | null;

type SaveRegistrationResult = {
  error: { message: string; code?: string | null } | null;
  notificationError: NotificationError;
  wasUpdate: boolean;
};

const registrationFlowByTable: Record<RegistrationTable, string> = {
  join_us_registrations: "join_us",
  summit_2026_registrations: "summit_2026",
  volunteer_applications: "volunteer",
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

const sendRegistrationNotification = async ({
  table,
  email,
  payload,
  wasUpdate,
}: {
  table: RegistrationTable;
  email: string;
  payload: RegistrationPayload;
  wasUpdate: boolean;
}): Promise<NotificationError> => {
  const { error } = await supabase.functions.invoke("send-registration-email", {
    body: {
      flow: registrationFlowByTable[table],
      wasUpdate,
      submission: {
        ...payload,
        email,
      },
    },
  });

  if (!error) {
    return null;
  }

  return {
    message: error.message || "Unable to send registration email notifications.",
  };
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
      notificationError: null,
      wasUpdate: false,
    };
  }

  const existingIds = existingRecord.data?.map((record) => record.id) || [];
  let writeError: { message: string; code?: string | null } | null = null;
  let wasUpdate = false;

  if (existingIds.length > 0) {
    const { error } = await supabase.from(table).update(record).in("id", existingIds);
    writeError = error;
    wasUpdate = !error;
  } else {
    const { error } = await supabase.from(table).insert([record]);

    if (error?.code !== "23505") {
      writeError = error;
      wasUpdate = false;
    } else {
      const retryLookup = await findExistingRecordIds(table, rawEmail, normalizedEmail);
      const retryIds = retryLookup.data?.map((record) => record.id) || [];

      if (retryLookup.error || retryIds.length === 0) {
        return {
          error: retryLookup.error || error,
          notificationError: null,
          wasUpdate: false,
        };
      }

      const retryUpdate = await supabase.from(table).update(record).in("id", retryIds);
      writeError = retryUpdate.error;
      wasUpdate = !retryUpdate.error;
    }
  }

  if (writeError) {
    return {
      error: writeError,
      notificationError: null,
      wasUpdate: false,
    };
  }

  const notificationError = await sendRegistrationNotification({
    table,
    email: normalizedEmail,
    payload,
    wasUpdate,
  });

  return {
    error: null,
    notificationError,
    wasUpdate,
  };
}
