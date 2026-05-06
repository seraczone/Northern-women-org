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
    const firstName = String(body.first_name ?? "").trim();
    const lastName = String(body.last_name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!firstName || !lastName || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required contact form fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: insertError } = await supabaseAdmin
      .from("contact_messages")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          subject,
          message,
          status: "new",
        },
      ]);

    if (insertError) {
      throw new Error(`Unable to save contact message: ${insertError.message}`);
    }

    try {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [CONTACT_ADMIN_EMAIL],
          reply_to: email,
          subject: `New Contact Message: ${subject}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        }),
      });

      const data = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error("Resend API error:", data);
        return new Response(
          JSON.stringify({
            success: false,
            messageSaved: true,
            emailSent: false,
            error: "Failed to send email",
            details: data,
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      return new Response(
        JSON.stringify({ success: true, messageSaved: true, emailSent: true, data }),
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown email function error";

      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          messageSaved: true,
          emailSent: false,
          error: message,
        }),
        { status: 200, headers: corsHeaders }
      );
    }
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
