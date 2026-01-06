import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, db } from "./db.js";
import crypto from "crypto";

(async () => {
  try {
    await connectDB();
    console.log("MongoDB ready");
  } catch (err) {
    console.error("MongoDB failed:", err);
  }
})();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public"); // frontend root folder
function getSessionId(req, res) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/sessionId=([^;]+)/);
  if (match) {
    return match[1];
  }
  const sessionId = crypto.randomUUID();
  res.setHeader(
    "Set-Cookie",
    `sessionId=${sessionId};Path=/;HttpOnly;Max-Age=2592000;SameSite=Lax;`
  );
  return sessionId;
}
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const sessionId = getSessionId(req, res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // ------------------------- PUBLIC FRONTEND -------------------------
  if (req.method === "GET" && !req.url.startsWith("/api")) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    let safePath = pathname;

    if (pathname === "/" || pathname === "/amazon") {
      safePath = "/index.html";
    } else if (pathname === "/tracking") {
      safePath = "/tracking.html";
    }

    const filePath = path.join(publicDir, safePath);

    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath);
      const contentTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
      };

      res.writeHead(200, {
        "Content-Type": contentTypes[ext] || "application/octet-stream",
      });
      res.end(data);
    } catch {
      const html = await fs.readFile(path.join(publicDir, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    }
    return;
  }

  // ------------------------- API ROUTES -------------------------

  // PRODUCTS
  if (req.method === "GET" && req.url === "/api/products") {
    const filePath = path.join(__dirname, "data", "products.json");
    const data = await fs.readFile(filePath, "utf-8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
    return;
  }

  // CART POST
  if (req.method === "POST" && req.url === "/api/cart") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const cartData = JSON.parse(body);
        await db.collection("carts").updateOne(
          { sessionId },
          {
            $set: {
              items: cartData.items,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false }));
      }
    });
    return;
  }

  // CART GET
  if (req.method === "GET" && req.url === "/api/cart") {
    const cartData = await db.collection("carts").findOne({ sessionId });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cartData ?? { items: [] }));
    return;
  }

  // ORDERS GET
  if (req.method === "GET" && req.url === "/api/orders") {
    const ordersData = await db
      .collection("orders")
      .find({ sessionId })
      .sort({ createdTime: -1 })
      .toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ orders: ordersData }));
    return;
  }

  // ORDERS POST
  if (req.method === "POST" && req.url === "/api/orders") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const newOrder = JSON.parse(body);
        const orderId = crypto.randomUUID();
        await db.collection("orders").insertOne({
          ...newOrder,
          sessionId,
          orderId,
          createdTime: new Date(),
        });

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ orderId, success: true }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server Running", PORT);
});
