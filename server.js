import http from "http";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public"); // frontend root folder

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
      safePath = "/amazon.html";
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
      const html = await fs.readFile(path.join(publicDir, "amazon.html"));
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
        const cartPath = path.join(__dirname, "data", "cart.json");
        await fs.writeFile(cartPath, JSON.stringify(cartData, null, 2));
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
    const cartPath = path.join(__dirname, "data", "cart.json");

    if (!fsSync.existsSync(cartPath)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ items: [] }));
      return;
    }

    const cartData = await fs.readFile(cartPath, "utf-8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(cartData);
    return;
  }

  // ORDERS GET
  if (req.method === "GET" && req.url === "/api/orders") {
    const ordersPath = path.join(__dirname, "data", "orders.json");

    if (!fsSync.existsSync(ordersPath)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ orders: [] }));
      return;
    }

    const ordersData = await fs.readFile(ordersPath, "utf-8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(ordersData);
    return;
  }

  // ORDERS POST
  if (req.method === "POST" && req.url === "/api/orders") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const newOrder = JSON.parse(body);
        newOrder["orderId"] = crypto.randomUUID();
        const ordersPath = path.join(__dirname, "data", "orders.json");

        let ordersData = { orders: [] };
        if (fsSync.existsSync(ordersPath)) {
          ordersData = JSON.parse(await fs.readFile(ordersPath, "utf-8"));
        }

        ordersData.orders.push(newOrder);

        await fs.writeFile(ordersPath, JSON.stringify(ordersData, null, 2));

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ orderId: newOrder.orderId, success: true }));
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

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
