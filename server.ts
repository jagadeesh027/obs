import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("luxury_estates.db");
const JWT_SECRET = process.env.JWT_SECRET || "luxury-secret-key-123";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    price INTEGER,
    location TEXT,
    neighborhood TEXT,
    beds INTEGER,
    baths INTEGER,
    sqft INTEGER,
    image_url TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS neighborhoods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    image_url TEXT,
    avg_price INTEGER
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyId TEXT,
    name TEXT,
    email TEXT,
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS favorites (
    userId TEXT,
    propertyId INTEGER,
    PRIMARY KEY(userId, propertyId)
  );
`);

// Seed Data if empty
const propertyCount = db.prepare("SELECT COUNT(*) as count FROM properties").get() as { count: number };
if (propertyCount.count === 0) {
  const insertProperty = db.prepare(`
    INSERT INTO properties (title, price, location, neighborhood, beds, baths, sqft, image_url, description, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const properties = [
    ["The Lotus Pavilion", 450000000, "Alibaug, Maharashtra", "Alibaug", 6, 8, 12000, "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", "A masterpiece of tropical modernism with private beach access and lush coconut groves.", 1],
    ["Himalayan Sanctuary", 180000000, "Rishikesh, Uttarakhand", "Rishikesh", 5, 6, 8500, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", "A serene retreat overlooking the Ganges with private yoga shala and infinity pool.", 1],
    ["Skyline Penthouse", 350000000, "Worli, Mumbai", "South Mumbai", 4, 4, 5200, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "Unrivaled views of the Arabian Sea from the highest residential tower in Mumbai.", 0],
    ["Heritage Haveli", 280000000, "Udaipur, Rajasthan", "Udaipur", 8, 10, 15000, "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80", "A meticulously restored 18th-century haveli with intricate stone carvings and lake views.", 0],
    ["Coffee Estate Villa", 120000000, "Coorg, Karnataka", "Coorg", 5, 5, 6800, "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80", "Luxury living amidst a 50-acre private coffee plantation with colonial elegance.", 0],
    ["Coastal Zen Retreat", 220000000, "Goa", "North Goa", 4, 5, 7200, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80", "Modern minimalist architecture meets Goan charm, featuring a private lap pool and sunset deck.", 0],
    ["Royal Jaipur Manor", 310000000, "Jaipur, Rajasthan", "Jaipur", 7, 9, 13500, "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80", "A grand estate inspired by Rajputana architecture with sprawling courtyards and marble finishes.", 0]
  ];

  properties.forEach(p => insertProperty.run(...p));

  const insertNeighborhood = db.prepare(`
    INSERT INTO neighborhoods (name, description, image_url, avg_price)
    VALUES (?, ?, ?, ?)
  `);

  const neighborhoods = [
    ["South Mumbai", "The historic heart of Mumbai, home to iconic Art Deco buildings and the city's most prestigious addresses.", "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=800&q=80", 250000000],
    ["Alibaug", "The Hamptons of Mumbai, offering coastal luxury and private beach estates just a ferry ride away.", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", 150000000],
    ["Udaipur", "The City of Lakes, where royal heritage meets modern luxury in a breathtaking landscape.", "https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=1200&q=80", 120000000],
    ["North Goa", "Vibrant coastal living with a mix of Portuguese heritage and modern luxury villas.", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", 80000000]
  ];

  neighborhoods.forEach(n => insertNeighborhood.run(...n));

  // Update existing data if already seeded with broken image
  db.prepare("UPDATE properties SET image_url = ? WHERE title = ? AND image_url LIKE '%photo-1590050752117-23a9d7fc6bbd%'").run(
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200",
    "Heritage Haveli"
  );
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // API Routes
  app.get("/api/properties", (req, res) => {
    const properties = db.prepare("SELECT * FROM properties").all();
    res.json(properties);
  });

  app.get("/api/properties/:id", (req, res) => {
    const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  });

  app.post("/api/properties", (req, res) => {
    const { title, price, location, neighborhood, beds, baths, sqft, image_url, description, featured } = req.body;
    const info = db.prepare(`
      INSERT INTO properties (title, price, location, neighborhood, beds, baths, sqft, image_url, description, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, price, location, neighborhood, beds, baths, sqft, image_url, description, featured ? 1 : 0);
    res.json({ id: info.lastInsertRowid, success: true });
  });

  app.delete("/api/properties/:id", (req, res) => {
    db.prepare("DELETE FROM properties WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/inquire", (req, res) => {
    const { propertyId, name, email, message } = req.body;
    db.prepare(`
      INSERT INTO inquiries (propertyId, name, email, message)
      VALUES (?, ?, ?, ?)
    `).run(propertyId, name, email, message);
    res.json({ success: true, message: "Inquiry sent successfully. Our agent will contact you shortly." });
  });

  app.get("/api/inquiries", (req, res) => {
    const inquiries = db.prepare("SELECT * FROM inquiries ORDER BY createdAt DESC").all();
    res.json(inquiries);
  });

  app.get("/api/neighborhoods", (req, res) => {
    const neighborhoods = db.prepare("SELECT * FROM neighborhoods").all();
    res.json(neighborhoods);
  });

  app.get("/api/favorites/:userId", (req, res) => {
    const favorites = db.prepare("SELECT propertyId FROM favorites WHERE userId = ?").all(req.params.userId);
    res.json(favorites.map((f: any) => f.propertyId));
  });

  app.post("/api/favorites", (req, res) => {
    const { userId, propertyId } = req.body;
    if (!userId || !propertyId) {
      return res.status(400).json({ message: "Missing userId or propertyId" });
    }

    const existing = db.prepare("SELECT * FROM favorites WHERE userId = ? AND propertyId = ?").get(userId, propertyId);
    
    if (existing) {
      db.prepare("DELETE FROM favorites WHERE userId = ? AND propertyId = ?").run(userId, propertyId);
      res.json({ favorited: false });
    } else {
      db.prepare("INSERT INTO favorites (userId, propertyId) VALUES (?, ?)").run(userId, propertyId);
      res.json({ favorited: true });
    }
  });

  app.get("/api/market-insights", (req, res) => {
    // Mock market data for Recharts
    const data = [
      { month: "Jan", price: 420000000, inventory: 120 },
      { month: "Feb", price: 435000000, inventory: 115 },
      { month: "Mar", price: 450000000, inventory: 110 },
      { month: "Apr", price: 445000000, inventory: 125 },
      { month: "May", price: 460000000, inventory: 130 },
      { month: "Jun", price: 480000000, inventory: 105 },
    ];
    res.json(data);
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    // For demo purposes, we'll allow any login with a specific password
    // In a real app, we'd check the DB
    if (password === "luxury123") {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ success: true, token, user: { name: "Luxury Client", email } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
