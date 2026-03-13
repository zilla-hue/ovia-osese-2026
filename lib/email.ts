import { Resend } from "resend";

// ── Configuration ─────────────────────────────────────────────────────────────

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM =
  process.env.RESEND_FROM_EMAIL || "Ovia Osese <noreply@oviaosese.org>";

const BASE_URL = process.env.APP_URL || "https://oviaosese.org";

export const emailEnabled = !!resend;

// ── Core send helper ──────────────────────────────────────────────────────────

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function send(payload: EmailPayload): Promise<void> {
  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set. Skipping send to ${payload.to}: "${payload.subject}"`
    );
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    if (error) {
      console.error(`[email] Delivery error to ${payload.to}:`, error);
    } else {
      console.log(`[email] Sent id=${data?.id} to=${payload.to} subject="${payload.subject}"`);
    }
  } catch (err) {
    console.error(`[email] Unexpected error sending to ${payload.to}:`, err);
  }
}

// ── HTML layout wrapper ───────────────────────────────────────────────────────

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:#001a4d;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#a3b7d6;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Ovia Osese Festival</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.3px;">2026</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;">
              ${body}
              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:40px;padding-top:24px;border-top:1px solid #e7e5e4;">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 4px;color:#78716c;font-size:12px;">
                      Ovia Osese Cultural Festival 2026 &nbsp;|&nbsp;
                      <a href="${BASE_URL}" style="color:#722f37;text-decoration:none;">oviaosese.org</a>
                    </p>
                    <p style="margin:0;color:#a8a29e;font-size:11px;">
                      You received this email because you interacted with Ovia Osese 2026.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Template helpers ──────────────────────────────────────────────────────────

function heading(text: string): string {
  return `<h2 style="margin:0 0 8px;color:#1c1917;font-size:22px;font-weight:700;">${text}</h2>`;
}

function subheading(text: string): string {
  return `<p style="margin:0 0 24px;color:#78716c;font-size:15px;">${text}</p>`;
}

function infoTable(rows: [string, string][]): string {
  const cells = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;color:#78716c;font-size:13px;white-space:nowrap;border-bottom:1px solid #f5f5f4;">${label}</td>
          <td style="padding:10px 12px;color:#1c1917;font-size:13px;font-weight:600;border-bottom:1px solid #f5f5f4;">${value}</td>
        </tr>`
    )
    .join("");
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:1px solid #e7e5e4;border-radius:8px;border-collapse:collapse;margin:20px 0;">
      ${cells}
    </table>`;
}

function button(label: string, url: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display:inline-block;background:#722f37;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;letter-spacing:0.2px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

function para(text: string, small = false): string {
  const size = small ? "13px" : "15px";
  const color = small ? "#78716c" : "#44403c";
  return `<p style="margin:0 0 16px;color:${color};font-size:${size};line-height:1.6;">${text}</p>`;
}

function highlight(text: string): string {
  return `<span style="color:#722f37;font-weight:700;">${text}</span>`;
}

// ── Donation confirmation ──────────────────────────────────────────────────────

export interface DonationEmailData {
  donorName: string;
  email: string;
  amount: number;
  reference: string;
  donationType: string;
  date?: string;
}

export async function sendDonationConfirmation(
  data: DonationEmailData
): Promise<void> {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(data.amount);

  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const typeLabel =
    data.donationType === "recurring" ? "Recurring donation" : "One-time donation";

  const body = `
    ${heading(`Thank You, ${data.donorName}!`)}
    ${subheading("Your generous support means everything to us.")}

    ${para(
      `We have received your donation of ${highlight(formattedAmount)} toward the Ovia Osese Cultural Festival 2026. ` +
      `Your contribution helps us celebrate our heritage, empower our youth, and bring our community together.`
    )}

    ${infoTable([
      ["Donor Name", data.donorName],
      ["Amount", formattedAmount],
      ["Transaction Reference", data.reference],
      ["Donation Type", typeLabel],
      ["Date", formattedDate],
    ])}

    ${para(
      "Please keep your transaction reference safe — you may need it if you have any questions about your donation."
    )}

    ${para(
      `If you have any questions or need assistance, please reach out to us at ` +
      `<a href="mailto:info@oviaosese.org" style="color:#722f37;">info@oviaosese.org</a>.`
    )}

    ${button("Visit Ovia Osese 2026", BASE_URL)}

    ${para("With gratitude,", true)}
    ${para("<strong>The Ovia Osese 2026 Team</strong>", true)}
  `;

  await send({
    to: data.email,
    subject: `Thank You for Your Donation — Ovia Osese 2026 (${data.reference})`,
    html: layout("Donation Confirmation — Ovia Osese 2026", body),
  });
}

// ── Registration confirmation ─────────────────────────────────────────────────

export interface RegistrationEmailData {
  fullName: string;
  email: string;
  planningToAttend?: string | null;
  arrivalDate?: string | null;
}

export async function sendRegistrationConfirmation(
  data: RegistrationEmailData
): Promise<void> {
  const firstName = data.fullName.trim().split(" ")[0];
  const isAttending = data.planningToAttend === "yes";

  const attendanceNote = isAttending
    ? `<p style="margin:0 0 16px;padding:12px 16px;background:#f0fdf4;border-left:4px solid #22c55e;border-radius:4px;color:#15803d;font-size:14px;">
        We look forward to welcoming you in person at the festival!
       </p>`
    : "";

  const nextSteps = [
    `<li style="margin-bottom:8px;">Explore the <a href="${BASE_URL}" style="color:#722f37;">festival website</a> for schedules and announcements.</li>`,
    `<li style="margin-bottom:8px;">Follow us on social media for live updates as the event approaches.</li>`,
    isAttending
      ? `<li style="margin-bottom:8px;">Keep an eye on your inbox — we'll send important logistics details closer to the event date.</li>`
      : `<li style="margin-bottom:8px;">If your plans change, you can always update your attendance preference by reaching out to us.</li>`,
    `<li style="margin-bottom:8px;">Consider <a href="${BASE_URL}/donate" style="color:#722f37;">making a donation</a> to support the festival or <a href="${BASE_URL}/volunteer" style="color:#722f37;">volunteering</a> your time.</li>`,
  ].join("");

  const body = `
    ${heading(`Welcome, ${firstName}!`)}
    ${subheading("Your registration has been received.")}

    ${para(
      `Thank you for registering with Ovia Osese 2026. We're thrilled to have you as part of our growing community. ` +
      `Your registration has been successfully recorded.`
    )}

    ${attendanceNote}

    <p style="margin:0 0 12px;color:#44403c;font-size:15px;font-weight:600;">What's next?</p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#44403c;font-size:14px;line-height:1.7;">
      ${nextSteps}
    </ul>

    ${para(
      `Questions? Reach us at <a href="mailto:info@oviaosese.org" style="color:#722f37;">info@oviaosese.org</a> — we're always happy to help.`
    )}

    ${button("Explore the Festival", BASE_URL)}

    ${para("See you at the festival,", true)}
    ${para("<strong>The Ovia Osese 2026 Team</strong>", true)}
  `;

  await send({
    to: data.email,
    subject: `Registration Confirmed — Welcome to Ovia Osese 2026!`,
    html: layout("Registration Confirmed — Ovia Osese 2026", body),
  });
}

// ── Volunteer confirmation ────────────────────────────────────────────────────

const AREA_LABELS: Record<string, string> = {
  event_management: "Event Management",
  cultural_documentation: "Cultural Documentation",
  security_crowd: "Security & Crowd Management",
  medical_support: "Medical Support",
  technical_it: "Technical / IT",
  hospitality: "Hospitality",
  media_communications: "Media & Communications",
  general_support: "General Support",
};

const AVAIL_LABELS: Record<string, string> = {
  full_festival: "Full Festival Duration",
  weekdays: "Weekdays Only",
  weekends: "Weekends Only",
  remote: "Remote / Online",
  flexible: "Flexible",
};

export interface VolunteerEmailData {
  fullName: string;
  email: string;
  areaOfInterest: string;
  availability: string;
}

export async function sendVolunteerConfirmation(
  data: VolunteerEmailData
): Promise<void> {
  const firstName = data.fullName.trim().split(" ")[0];
  const areaLabel = AREA_LABELS[data.areaOfInterest] ?? data.areaOfInterest;
  const availLabel = AVAIL_LABELS[data.availability] ?? data.availability;

  const body = `
    ${heading(`Thank You, ${firstName}!`)}
    ${subheading("Your volunteer application has been received.")}

    ${para(
      `We're so grateful for your willingness to give your time and energy to Ovia Osese 2026. ` +
      `Volunteers like you are the backbone of this festival, and your support makes it possible.`
    )}

    ${infoTable([
      ["Name", data.fullName],
      ["Area of Interest", areaLabel],
      ["Availability", availLabel],
    ])}

    <p style="margin:0 0 12px;color:#44403c;font-size:15px;font-weight:600;">What happens next?</p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#44403c;font-size:14px;line-height:1.8;">
      <li style="margin-bottom:8px;">Our volunteer coordination team will review your application.</li>
      <li style="margin-bottom:8px;">You will be contacted by email within <strong>5–7 working days</strong> with more information about your role and orientation.</li>
      <li style="margin-bottom:8px;">Please keep an eye on your inbox (and spam folder — just in case!).</li>
    </ul>

    ${para(
      `If you have any questions in the meantime, please contact us at ` +
      `<a href="mailto:volunteers@oviaosese.org" style="color:#722f37;">volunteers@oviaosese.org</a>.`
    )}

    ${button("Learn More About the Festival", BASE_URL)}

    ${para("With appreciation,", true)}
    ${para("<strong>The Ovia Osese 2026 Volunteer Team</strong>", true)}
  `;

  await send({
    to: data.email,
    subject: `Volunteer Application Received — Ovia Osese 2026`,
    html: layout("Volunteer Application Confirmed — Ovia Osese 2026", body),
  });
}
