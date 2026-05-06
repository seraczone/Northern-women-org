import { supabase } from "@/lib/supabase";

type SubscribeResult = {
  error: { message: string; code?: string | null } | null;
  notificationError: { message: string } | null;
  wasUpdate: boolean;
};

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.functions.invoke("send-newsletter-email", {
    body: {
      email: normalizedEmail,
    },
  });

  if (error) {
    return {
      error: {
        message: error.message || "Unable to save newsletter subscription.",
      },
      notificationError: null,
      wasUpdate: false,
    };
  }

  return {
    error: null,
    notificationError:
      data?.notificationError && typeof data.notificationError.message === "string"
        ? { message: data.notificationError.message }
        : null,
    wasUpdate: Boolean(data?.wasUpdate),
  };
}
