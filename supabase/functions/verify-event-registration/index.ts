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

const normalizeCode = (value: string) => value.trim().toUpperCase();

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
    const registrationCode = normalizeCode(String(body.registrationCode ?? ""));

    if (!registrationCode) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Missing registration code",
        }),
        {
          status: 200,
          headers: corsHeaders,
        },
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabaseAdmin
      .from("event_registration")
      .select(
        "registration_code, first_name, last_name, email, phone, event_name, event_date, event_time, event_location, created_at, checked_in_at",
      )
      .eq("registration_code", registrationCode)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Registration not found",
        }),
        {
          status: 200,
          headers: corsHeaders,
        },
      );
    }

    const fullName = [data.first_name, data.last_name]
      .map((value) => String(value ?? "").trim())
      .filter(Boolean)
      .join(" ");

    return new Response(
      JSON.stringify({
        valid: true,
        registration: {
          registrationCode: data.registration_code,
          firstName: String(data.first_name ?? "").trim(),
          lastName: String(data.last_name ?? "").trim(),
          fullName,
          email: String(data.email ?? "").trim(),
          phone: String(data.phone ?? "").trim(),
          eventName: String(data.event_name ?? "").trim(),
          eventDate: String(data.event_date ?? "").trim(),
          eventTime: String(data.event_time ?? "").trim(),
          eventLocation: String(data.event_location ?? "").trim(),
          registeredAt: data.created_at,
          checkedInAt: data.checked_in_at,
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
