// import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// serve(async (req) => {
//   try {
//     const body = await req.json();

//     const { first_name, last_name, email, subject, message } = body;

//     const res = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${RESEND_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: "Northern Women Initiative <onboarding@resend.dev>",
//         to: ["ogunmodederidwan@gmail.com"], // ADMIN EMAIL
//         subject: `New Contact Message: ${subject}`,
//         html: `
//           <h2>New Contact Message</h2>
//           <p><strong>Name:</strong> ${first_name} ${last_name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Subject:</strong> ${subject}</p>
//           <p><strong>Message:</strong></p>
//           <p>${message}</p>
//         `,
//       }),
//     });

//     const data = await res.json();

//     return new Response(JSON.stringify(data), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error: any) {
//     return new Response(
//       JSON.stringify({ error: error.message }),
//       { status: 500 }
//     );
//   }
// });

// import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// // Make sure you set your RESEND_API_KEY in Supabase secrets
// const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// serve(async (req) => {
//   try {
//     const body = await req.json();
//     const { first_name, last_name, email, subject, message } = body;

//     const res = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${RESEND_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         // Using your personal email as FROM to ensure it works
//         from: "Ogunmodederidwan <ogunmodederidwan@gmail.com>", 
//         to: ["ogunmodederidwan@gmail.com"], // Admin receives here
//         subject: `New Contact Message: ${subject}`,
//         html: `
//           <h2>New Contact Message</h2>
//           <p><strong>Name:</strong> ${first_name} ${last_name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Subject:</strong> ${subject}</p>
//           <p><strong>Message:</strong></p>
//           <p>${message}</p>
//         `,
//       }),
//     });

//     const data = await res.json();

//     return new Response(JSON.stringify(data), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error: any) {
//     console.error("Error sending email:", error);
//     return new Response(
//       JSON.stringify({ error: error.message }),
//       { status: 500 }
//     );
//   }
// });

// import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// serve(async (req) => {
//   try {
//     const body = await req.json();
//     const { first_name, last_name, email, subject, message } = body;

//     const res = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${RESEND_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: "Northern Women Initiative <onboarding@resend.dev>",
//         to: ["ogunmodederidwan@gmail.com"], // Admin email
//         subject: `New Contact Message: ${subject}`,
//         html: `
//           <h2>New Contact Message</h2>
//           <p><strong>Name:</strong> ${first_name} ${last_name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Subject:</strong> ${subject}</p>
//           <p><strong>Message:</strong></p>
//           <p>${message}</p>
//         `,
//       }),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       return new Response(JSON.stringify({ error: errorText }), {
//         status: res.status,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const data = await res.json();

//     return new Response(JSON.stringify(data), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error: any) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// });

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Get Resend API key from Supabase secrets
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.json();

    const { first_name, last_name, email, subject, message } = body;

    // Prepare email payload
    const emailPayload = {
      from: "Northern Women Initiative <onboarding@resend.dev>", // verified sender email
      to: ["ogunmodederidwan@gmail.com"], // your admin email
      subject: `New Contact Message: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${first_name} ${last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email via Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await res.json();

    // Check if Resend API returned error
    if (!res.ok) {
      console.error("Resend API error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: data }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Success
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
