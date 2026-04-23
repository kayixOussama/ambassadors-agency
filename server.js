import "dotenv/config";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const productsFilePath = path.join(__dirname, "data", "products.json");

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

app.use(express.json({ limit: "1mb" }));

async function readProducts() {
  const raw = await fs.readFile(productsFilePath, "utf-8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Products data must be an array.");
  }
  return parsed;
}

async function writeProducts(products) {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), "utf-8");
}

function createAdminToken() {
  return jwt.sign({ role: "admin", username: ADMIN_USERNAME }, JWT_SECRET, {
    expiresIn: "8h",
  });
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Missing token." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== "admin") {
      return res.status(403).json({ message: "Invalid token role." });
    }
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function validateProductsPayload(products) {
  if (!Array.isArray(products)) return "Products must be an array.";
  for (const p of products) {
    if (!p || typeof p !== "object") return "Each product must be an object.";
    if (!p.id || !p.name) return "Each product needs at least id and name.";
    if (!Array.isArray(p.sizes) || !Array.isArray(p.prices)) {
      return `Product ${p.id || "(unknown)"} must have sizes and prices arrays.`;
    }
  }
  return null;
}

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = createAdminToken();
  return res.json({ token });
});

app.get("/api/admin/verify", requireAdmin, (req, res) => {
  return res.json({ ok: true, admin: req.admin?.username || "admin" });
});

app.get("/api/products", async (_req, res) => {
  try {
    const products = await readProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load products.", error: String(error) });
  }
});

app.get("/api/admin/products", requireAdmin, async (_req, res) => {
  try {
    const products = await readProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load products.", error: String(error) });
  }
});

app.put("/api/admin/products", requireAdmin, async (req, res) => {
  const products = req.body;
  const validationError = validateProductsPayload(products);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    await writeProducts(products);
    return res.json({ message: "Products updated.", count: products.length });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save products.", error: String(error) });
  }
});

// Cache static assets (JS, CSS, images) for 1 year
app.use(
  express.static(distDir, {
    maxAge: "1y",
    setHeaders(res, filePath) {
      // Don't cache HTML files
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

// SPA fallback — serve index.html for all non-file routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
