import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const recipientEmail = "abdomansourshalaby@gmail.com";
const rateLimit = new Map<string, RateLimitEntry>();
const maxRequests = 5;
const windowMs = 60 * 1000;

function toCleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();

  Array.from(rateLimit.entries()).forEach(([key, entry]) => {
    if (entry.resetAt <= now) {
      rateLimit.delete(key);
    }
  });

  const entry = rateLimit.get(ip);

  if (!entry) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count += 1;
  return false;
}

function validatePayload(payload: ContactPayload) {
  const name = toCleanString(payload.name);
  const email = toCleanString(payload.email).toLowerCase();
  const phone = toCleanString(payload.phone);
  const company = toCleanString(payload.company);
  const message = toCleanString(payload.message);
  const website = toCleanString(payload.website);
  const startedAt = Number(payload.startedAt);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+()\d\s-]{6,25}$/;
  const linkCount = (message.match(/https?:\/\//gi) || []).length;

  if (website) {
    return { ok: false as const, message: "Spam protection rejected the submission." };
  }

  if (Number.isFinite(startedAt) && Date.now() - startedAt < 1200) {
    return { ok: false as const, message: "Please wait a moment before submitting the form." };
  }

  if (name.length < 2 || name.length > 80) {
    return { ok: false as const, message: "Please enter a valid name." };
  }

  if (!emailRegex.test(email) || email.length > 120) {
    return { ok: false as const, message: "Please enter a valid email address." };
  }

  if (!phoneRegex.test(phone)) {
    return { ok: false as const, message: "Please enter a valid phone number." };
  }

  if (company.length < 2 || company.length > 120) {
    return { ok: false as const, message: "Please enter a valid company or project name." };
  }

  if (message.length < 10 || message.length > 2000) {
    return { ok: false as const, message: "Please enter a message between 10 and 2000 characters." };
  }

  if (linkCount > 2) {
    return { ok: false as const, message: "Please remove extra links before submitting." };
  }

  return {
    ok: true as const,
    data: {
      name,
      email,
      phone,
      company,
      message
    }
  };
}

function buildEmailTemplate(data: { name: string; email: string; phone: string; company: string; message: string }) {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company", data.company]
  ];

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New TiTANiUM Technology Website Inquiry</title>
  </head>
  <body style="margin:0;background:#030508;color:#eef6ff;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#030508;padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;border:1px solid rgba(123,217,255,0.24);border-radius:12px;overflow:hidden;background:#080b10;">
            <tr>
              <td style="padding:28px;background:linear-gradient(135deg,#07111d,#0c1f2d);border-bottom:1px solid rgba(255,255,255,0.1);">
                <p style="margin:0 0 10px;color:#7bd9ff;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">TiTANiUM Technology</p>
                <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">New website inquiry</h1>
                <p style="margin:12px 0 0;color:#b4c3d5;font-size:15px;line-height:1.7;">A new contact form submission arrived from the TiTANiUM Technology website.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows
                    .map(
                      ([label, value]) => `<tr>
                        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#8497ad;font-size:13px;text-transform:uppercase;letter-spacing:1.8px;width:34%;">${escapeHtml(label)}</td>
                        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#ffffff;font-size:15px;">${escapeHtml(value)}</td>
                      </tr>`
                    )
                    .join("")}
                </table>
                <div style="margin-top:24px;padding:18px;border:1px solid rgba(123,217,255,0.18);border-radius:10px;background:rgba(255,255,255,0.035);">
                  <p style="margin:0 0 10px;color:#7bd9ff;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Message</p>
                  <p style="margin:0;color:#eef6ff;font-size:16px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
                </div>
                <p style="margin:22px 0 0;color:#8497ad;font-size:13px;line-height:1.7;">Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many submissions. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }

  const validated = validatePayload(payload);

  if (!validated.ok) {
    return NextResponse.json(
      { success: false, message: validated.message },
      { status: 400 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { success: false, message: "Email service is not configured. Please add RESEND_API_KEY." },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "TiTANiUM Website <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: validated.data.email,
      subject: `New TiTANiUM inquiry from ${validated.data.name}`,
      html: buildEmailTemplate(validated.data),
      text: [
        "New TiTANiUM Technology website inquiry",
        `Name: ${validated.data.name}`,
        `Email: ${validated.data.email}`,
        `Phone: ${validated.data.phone}`,
        `Company: ${validated.data.company}`,
        "",
        validated.data.message
      ].join("\n")
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: "Email provider rejected the message. Please try WhatsApp if this continues." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch {
    return NextResponse.json(
      { success: false, message: "Email delivery failed. Please try again shortly." },
      { status: 502 }
    );
  }
}
