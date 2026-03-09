import "dotenv/config";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { app } from "./lib/app.js";
import { supabase } from "./lib/supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedNews() {
  const { count } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true });

  if (count === 0) {
    await supabase.from("news").insert([
      {
        title: "Ovia Osese 2026 Dates Announced",
        slug: "dates-announced",
        content: "The official dates for Ovia Osese 2026 have been announced. The festival will culminate on April 12, 2026.",
        excerpt: "The official dates for Ovia Osese 2026 have been announced.",
        image_url: "https://picsum.photos/seed/festival/800/400.webp",
      },
      {
        title: "Call for Sponsors Open",
        slug: "call-for-sponsors",
        content: "We are now accepting applications for corporate and individual sponsors for the upcoming festival.",
        excerpt: "We are now accepting applications for corporate and individual sponsors.",
        image_url: "https://picsum.photos/seed/sponsor/800/400.webp",
      },
    ]);
  }
}

async function startServer() {
  await seedNews();

  let PORT = parseInt(process.env.PORT || "3000", 10);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const { default: express } = await import("express");
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is in use, trying ${PORT + 1}...`);
      PORT++;
      server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } else {
      throw err;
    }
  });
}

startServer();
