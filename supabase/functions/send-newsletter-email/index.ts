import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const sendEmail = async ({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
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

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase service role configuration");
    }

    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing subscriber email" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const existingLookup = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (existingLookup.error) {
      throw new Error(existingLookup.error.message);
    }

    const wasUpdate = Boolean(existingLookup.data);

    const upsertResponse = await supabaseAdmin.from("newsletter_subscribers").upsert(
      [
        {
          email,
          source: "footer",
          status: "subscribed",
        },
      ],
      {
        onConflict: "email",
      },
    );

    if (upsertResponse.error) {
      throw new Error(upsertResponse.error.message);
    }

    let notificationError: { message: string } | null = null;

    try {
      await sendEmail({
        to: CONTACT_ADMIN_EMAIL,
        replyTo: email,
        subject: `Newsletter Subscription ${wasUpdate ? "Updated" : "Received"}`,
        html: `
          <h2>Newsletter Subscription ${wasUpdate ? "Updated" : "Received"}</h2>
          <p>Email: ${escapeHtml(email)}</p>
          <p>Source: footer</p>
        `,
      });

      await sendEmail({
        to: email,
        replyTo: CONTACT_ADMIN_EMAIL,
        subject: `Newsletter Subscription ${wasUpdate ? "Updated" : "Confirmed"}`,
        html: `
          <p>Hello,</p>
          <p>${
            wasUpdate
              ? "Your newsletter subscription is active and your details have been refreshed."
              : "You have been subscribed to Northern Women Initiative updates."
          }</p>
          <p>We will use this email to share news, opportunities, and program updates.</p>
        `,
      });
    } catch (error: unknown) {
      notificationError = {
        message:
          error instanceof Error
            ? error.message
            : "Unable to send newsletter confirmation emails.",
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        wasUpdate,
        notificationError,
      }),
      {
        status: 200,
        headers: corsHeaders,
      },
    );
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
