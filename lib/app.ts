import express from "express";
import { supabase } from "./supabase.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

const IS_DEV = process.env.NODE_ENV !== "production";

function dbError(res: express.Response, label: string, error: unknown, status = 500) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[${label}]`, error);
  res.status(status).json({ success: false, error: IS_DEV ? msg : label });
}

function toCamel(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
      v,
    ])
  );
}

function generateRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `OVE-${ts}-${rand}`;
}

const rateLimiter = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimiter.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2026";
function adminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  next();
}

// ── App ───────────────────────────────────────────────────────────────────────

export const app = express();
app.use(express.json());

// ── Public API ────────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/register", async (req, res) => {
  try {
    const {
      fullName, email, phone, country, state, indigene,
      planningToAttend, arrivalDate, departureDate, groupSize,
      accommodation, accommodationHelp, interests, receiveUpdates,
    } = req.body;

    const { data, error } = await supabase
      .from("visitors")
      .insert({
        full_name: fullName,
        email,
        phone,
        country,
        state: state || null,
        indigene: indigene || null,
        planning_to_attend: planningToAttend || null,
        arrival_date: arrivalDate || null,
        departure_date: departureDate || null,
        group_size: groupSize || null,
        accommodation: accommodation || null,
        accommodation_help: accommodationHelp || null,
        interests: Array.isArray(interests) ? interests.join(", ") : (interests || null),
        receive_updates: receiveUpdates || null,
      })
      .select("id")
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, id: data.id });
  } catch (error) {
    return dbError(res, "Failed to register", error);
  }
});

app.post("/api/sponsor", async (req, res) => {
  try {
    const { companyName, contactName, email, phone, sponsorshipLevel, message } = req.body;

    const { data, error } = await supabase
      .from("sponsors")
      .insert({
        company_name: companyName,
        contact_name: contactName,
        email,
        phone,
        sponsorship_level: sponsorshipLevel,
        message: message || null,
      })
      .select("id")
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, id: data.id });
  } catch (error) {
    return dbError(res, "Failed to submit inquiry", error);
  }
});

app.get("/api/news", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data.map(toCamel) });
  } catch (error) {
    return dbError(res, "Failed to fetch news", error);
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const { data, error } = await supabase
      .from("messages")
      .insert({ name, email, subject, message })
      .select("id")
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, id: data.id });
  } catch (error) {
    return dbError(res, "Failed to send message", error);
  }
});

// ── Donations ─────────────────────────────────────────────────────────────────

app.post("/api/donations", async (req, res) => {
  const ip = (req.ip || req.socket?.remoteAddress || "unknown").replace("::ffff:", "");
  if (!checkRateLimit(ip, 5, 60_000)) {
    return res.status(429).json({ success: false, error: "Too many requests. Please try again later." });
  }

  const { donorName, email, amount, donationType, message } = req.body;

  if (!donorName || typeof donorName !== "string" || donorName.trim().length < 2)
    return res.status(400).json({ success: false, error: "Valid donor name is required" });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)))
    return res.status(400).json({ success: false, error: "Valid email address is required" });

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount < 100)
    return res.status(400).json({ success: false, error: "Minimum donation amount is ₦100" });

  const safeType = ["one-time", "recurring"].includes(donationType) ? donationType : "one-time";

  try {
    const reference = generateRef();
    const { data, error } = await supabase
      .from("donations")
      .insert({
        donor_name: donorName.trim(),
        email: String(email).toLowerCase().trim(),
        amount: parsedAmount,
        donation_type: safeType,
        payment_reference: reference,
        message: message?.trim() || null,
      })
      .select("id")
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, id: data.id, reference, message: "Donation recorded. Thank you for your generosity!" });
  } catch (error) {
    return dbError(res, "Failed to process donation", error);
  }
});

app.get("/api/donations", adminAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data.map(toCamel) });
  } catch (error) {
    return dbError(res, "Failed to fetch donations", error);
  }
});

app.put("/api/donations/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  if (!["pending", "completed", "failed"].includes(paymentStatus))
    return res.status(400).json({ success: false, error: "Invalid status value" });

  try {
    const { data, error } = await supabase
      .from("donations")
      .update({ payment_status: paymentStatus })
      .eq("id", id)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ success: false, error: "Donation not found" });
    res.json({ success: true });
  } catch (error) {
    return dbError(res, "Failed to update donation", error);
  }
});

app.get("/api/donations/verify/:reference", async (req, res) => {
  const { reference } = req.params;
  if (!reference || typeof reference !== "string")
    return res.status(400).json({ success: false, error: "Invalid reference" });

  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET)
    return res.status(503).json({ success: false, error: "Payment verification not configured on server" });

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    type PaystackVerifyResponse = {
      status: boolean;
      message: string;
      data: { status: string; reference: string; amount: number; currency: string };
    };
    const paystackData = (await paystackRes.json()) as PaystackVerifyResponse;

    if (!paystackData.status)
      return res.status(400).json({ success: false, error: paystackData.message || "Verification failed" });

    const txStatus = paystackData.data.status;
    const dbStatus = txStatus === "success" ? "completed" : "failed";

    const { data, error } = await supabase
      .from("donations")
      .update({ payment_status: dbStatus })
      .eq("payment_reference", reference)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ success: false, error: "Donation record not found for this reference" });

    res.json({ success: true, status: txStatus, reference });
  } catch (error) {
    return dbError(res, "Payment verification failed", error);
  }
});

// ── Volunteers ────────────────────────────────────────────────────────────────

app.post("/api/volunteer", async (req, res) => {
  const ip = (req.ip || req.socket?.remoteAddress || "unknown").replace("::ffff:", "");
  if (!checkRateLimit(ip, 5, 60_000))
    return res.status(429).json({ success: false, error: "Too many requests. Please try again later." });

  const { fullName, email, phone, country, areaOfInterest, availability, message } = req.body;

  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2)
    return res.status(400).json({ success: false, error: "Full name is required" });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)))
    return res.status(400).json({ success: false, error: "Valid email address is required" });
  if (!phone || typeof phone !== "string" || phone.trim().length < 7)
    return res.status(400).json({ success: false, error: "Valid phone number is required" });
  if (!country || typeof country !== "string" || country.trim().length < 2)
    return res.status(400).json({ success: false, error: "Country / location is required" });
  if (!areaOfInterest || typeof areaOfInterest !== "string")
    return res.status(400).json({ success: false, error: "Area of interest is required" });
  if (!availability || typeof availability !== "string")
    return res.status(400).json({ success: false, error: "Availability is required" });

  try {
    const { data, error } = await supabase
      .from("volunteers")
      .insert({
        full_name: fullName.trim(),
        email: String(email).toLowerCase().trim(),
        phone: phone.trim(),
        country: country.trim(),
        area_of_interest: areaOfInterest,
        availability,
        message: message?.trim() || null,
      })
      .select("id")
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, id: data.id });
  } catch (error) {
    return dbError(res, "Failed to submit volunteer application", error);
  }
});

app.get("/api/volunteers", adminAuth, async (req, res) => {
  const { status } = req.query;
  const validStatuses = ["pending", "contacted", "approved"];
  try {
    let query = supabase.from("volunteers").select("*").order("created_at", { ascending: false });
    if (status && validStatuses.includes(status as string))
      query = query.eq("status", status as string);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: data.map(toCamel) });
  } catch (error) {
    return dbError(res, "Failed to fetch volunteers", error);
  }
});

app.put("/api/volunteers/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["pending", "contacted", "approved"].includes(status))
    return res.status(400).json({ success: false, error: "Invalid status value" });

  try {
    const { data, error } = await supabase
      .from("volunteers")
      .update({ status })
      .eq("id", id)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ success: false, error: "Volunteer not found" });
    res.json({ success: true });
  } catch (error) {
    return dbError(res, "Failed to update volunteer status", error);
  }
});

// ── Admin ─────────────────────────────────────────────────────────────────────

app.get("/api/admin/stats", adminAuth, async (_req, res) => {
  try {
    const [
      { count: totalVisitors },
      { count: totalDonations },
      { count: totalVolunteers },
      { count: totalMessages },
      { count: pendingVolunteers },
      { data: completedDonations },
    ] = await Promise.all([
      supabase.from("visitors").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("*", { count: "exact", head: true }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("donations").select("amount").eq("payment_status", "completed"),
    ]);

    const totalAmount = completedDonations?.reduce((sum, r) => sum + Number(r.amount), 0) ?? 0;

    res.json({
      success: true,
      data: {
        totalVisitors: totalVisitors ?? 0,
        totalDonations: totalDonations ?? 0,
        totalAmount,
        totalVolunteers: totalVolunteers ?? 0,
        totalMessages: totalMessages ?? 0,
        pendingVolunteers: pendingVolunteers ?? 0,
      },
    });
  } catch (error) {
    return dbError(res, "Failed to fetch stats", error);
  }
});

app.get("/api/admin/registrations", adminAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("visitors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data.map(toCamel) });
  } catch (error) {
    return dbError(res, "Failed to fetch registrations", error);
  }
});
