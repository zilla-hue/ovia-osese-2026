// Vercel serverless entry-point — re-exports the shared Express app.
// All /api/* requests are routed here by vercel.json rewrites.
import "../lib/supabase.js"; // ensure env validation runs early
import { app } from "../lib/app.js";

export default app;
