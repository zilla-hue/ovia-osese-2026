import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
const db = new Database(path.join(__dirname, "ovia-osese.db"));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL,
    participationInterest TEXT NOT NULL,
    arrivalDate TEXT,
    departureDate TEXT,
    contactPreference TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sponsors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT NOT NULL,
    contactName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    sponsorshipLevel TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    imageUrl TEXT,
    publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert some mock news if empty
const newsCount = db.prepare("SELECT COUNT(*) as count FROM news").get() as { count: number };
if (newsCount.count === 0) {
  const insertNews = db.prepare(
    "INSERT INTO news (title, slug, content, excerpt, imageUrl) VALUES (?, ?, ?, ?, ?)"
  );
  insertNews.run(
    "Ovia Osese 2026 Dates Announced",
    "dates-announced",
    "The official dates for Ovia Osese 2026 have been announced. The festival will culminate on April 12, 2026.",
    "The official dates for Ovia Osese 2026 have been announced.",
    "https://picsum.photos/seed/festival/800/400.webp"
  );
  insertNews.run(
    "Call for Sponsors Open",
    "call-for-sponsors",
    "We are now accepting applications for corporate and individual sponsors for the upcoming festival.",
    "We are now accepting applications for corporate and individual sponsors.",
    "https://picsum.photos/seed/sponsor/800/400.webp"
  );
}

async function startServer() {
  const app = express();
  let PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Visitor Registration
  app.post("/api/register", (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        country,
        participationInterest,
        arrivalDate,
        departureDate,
        contactPreference,
      } = req.body;

      const stmt = db.prepare(`
        INSERT INTO visitors (
          fullName, email, phone, country, participationInterest, 
          arrivalDate, departureDate, contactPreference
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        fullName,
        email,
        phone,
        country,
        participationInterest,
        arrivalDate || null,
        departureDate || null,
        contactPreference
      );

      res.status(201).json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ success: false, error: "Failed to register" });
    }
  });

  // Sponsor Inquiry
  app.post("/api/sponsor", (req, res) => {
    try {
      const { companyName, contactName, email, phone, sponsorshipLevel, message } = req.body;

      const stmt = db.prepare(`
        INSERT INTO sponsors (
          companyName, contactName, email, phone, sponsorshipLevel, message
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        companyName,
        contactName,
        email,
        phone,
        sponsorshipLevel,
        message || null
      );

      res.status(201).json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error("Sponsor error:", error);
      res.status(500).json({ success: false, error: "Failed to submit inquiry" });
    }
  });

  // Get News
  app.get("/api/news", (req, res) => {
    try {
      const news = db.prepare("SELECT * FROM news ORDER BY publishedAt DESC").all();
      res.json({ success: true, data: news });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch news" });
    }
  });

  // Contact Message
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      const stmt = db.prepare(`
        INSERT INTO messages (
          name, email, subject, message
        ) VALUES (?, ?, ?, ?)
      `);

      const info = stmt.run(
        name,
        email,
        subject,
        message
      );

      res.status(201).json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error("Contact error:", error);
      res.status(500).json({ success: false, error: "Failed to send message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Handle port already in use error
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
