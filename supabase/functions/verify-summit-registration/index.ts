import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const normalizeReference = (value: string) => value.trim().toUpperCase();

const maskEmail = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();
  const [localPart = "", domain = ""] = normalizedValue.split("@");

  if (!localPart || !domain) {
    return normalizedValue;
  }

  const visibleLocalPart = localPart.slice(0, Math.min(2, localPart.length));
  const hiddenCount = Math.max(localPart.length - visibleLocalPart.length, 3);

  return `${visibleLocalPart}${"*".repeat(hiddenCount)}@${domain}`;
};

const maskPhone = (value: string) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  if (normalizedValue.length <= 4) {
    return "*".repeat(normalizedValue.length);
  }

  const visiblePrefix = normalizedValue.slice(0, 4);
  const visibleSuffix = normalizedValue.slice(-2);
  const hiddenCount = Math.max(normalizedValue.length - 6, 3);

  return `${visiblePrefix}${"*".repeat(hiddenCount)}${visibleSuffix}`;
};

const formatTicketType = (value: string) =>
  value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const toNumberOrNull = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
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
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase service role configuration");
    }

    const body = await req.json();
    const registrationReference = normalizeReference(
      String(body.registrationReference ?? body.reference ?? ""),
    );

    if (!registrationReference) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Missing registration reference",
        }),
        {
          status: 200,
          headers: corsHeaders,
        },
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabaseAdmin
      .from("summit_2026_registrations")
      .select(
        "registration_reference, full_name, email, phone, city, state, country, ticket_type, quantity, total_amount, payment_status, payment_date, created_at",
      )
      .eq("registration_reference", registrationReference)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Registration reference not found",
        }),
        {
          status: 200,
          headers: corsHeaders,
        },
      );
    }

    return new Response(
      JSON.stringify({
        valid: true,
        registration: {
          registrationReference: String(data.registration_reference ?? "").trim(),
          fullName: String(data.full_name ?? "").trim(),
          emailPreview: maskEmail(String(data.email ?? "").trim()),
          phonePreview: maskPhone(String(data.phone ?? "").trim()),
          city: String(data.city ?? "").trim(),
          state: String(data.state ?? "").trim(),
          country: String(data.country ?? "").trim(),
          ticketType: formatTicketType(String(data.ticket_type ?? "standard")),
          quantity: Number(data.quantity ?? 1),
          totalAmount: toNumberOrNull(data.total_amount),
          paymentStatus: String(data.payment_status ?? "pending").trim().toLowerCase(),
          paymentDate: data.payment_date,
          registeredAt: data.created_at,
        },
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

    return new Response(JSON.stringify({ error: message, valid: false }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
