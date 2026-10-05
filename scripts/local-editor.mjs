import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "public", "data");
const productsFile = path.join(dataDir, "products.json");
const uploadsDir = path.join(root, "public", "uploads");
const port = 3002;

await fs.mkdir(dataDir, { recursive: true });
await fs.mkdir(uploadsDir, { recursive: true });

function corsHeaders(origin) {
  const allowed = ["http://localhost:3000", "http://127.0.0.1:3000"];
  return {
    "Access-Control-Allow-Origin": allowed.includes(origin || "") ? origin : "http://localhost:3000",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Cache-Control": "no-store",
  };
}

function send(res, status, body, origin) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function cleanId(value) {
  return String(value || "urun")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "") || "urun";
}

async function persistDataImage(source, productId, name) {
  if (!String(source || "").startsWith("data:image/")) return source || "";
  const match = String(source).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  if (!match) return source;
  const mime = match[1];
  const base64 = match[2];
  const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  const safeId = cleanId(productId);
  const folder = path.join(uploadsDir, safeId);
  await fs.mkdir(folder, { recursive: true });
  const filename = `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await fs.writeFile(path.join(folder, filename), Buffer.from(base64, "base64"));
  return `/uploads/${safeId}/${filename}`;
}

async function normalizeProducts(products) {
  const result = [];
  for (const product of products) {
    const id = cleanId(product.id || product.title);
    const mainImage = await persistDataImage(product.mainImage, id, "ana");
    const hoverImages = [];
    for (let i = 0; i < (product.hoverImages || []).length; i += 1) {
      hoverImages.push(await persistDataImage(product.hoverImages[i], id, `galeri-${i + 1}`));
    }
    result.push({ ...product, id, mainImage, hoverImages });
  }
  return result;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, shell: false, windowsHide: true });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data) => (stdout += data.toString()));
    child.stderr.on("data", (data) => (stderr += data.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr || stdout || `${command} başarısız oldu.`));
    });
  });
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders(origin));
    return res.end();
  }

  try {
    if (req.url === "/health" && req.method === "GET") {
      return send(res, 200, { ok: true }, origin);
    }

    if (req.url === "/products" && req.method === "GET") {
      try {
        const content = await fs.readFile(productsFile, "utf8");
        return send(res, 200, { products: JSON.parse(content) }, origin);
      } catch {
        return send(res, 200, { products: null }, origin);
      }
    }

    if (req.url === "/save" && req.method === "POST") {
      const body = await readBody(req);
      if (!Array.isArray(body.products)) return send(res, 400, { error: "Ürün listesi bulunamadı." }, origin);
      const products = await normalizeProducts(body.products);
      await fs.writeFile(productsFile, `${JSON.stringify(products, null, 2)}\n`, "utf8");
      return send(res, 200, { ok: true, products }, origin);
    }

    if (req.url === "/publish" && req.method === "POST") {
      await run(process.platform === "win32" ? "git.exe" : "git", ["add", "-A"]);
      const diff = await run(process.platform === "win32" ? "git.exe" : "git", ["diff", "--cached", "--name-only"]);
      if (!diff.stdout.trim()) return send(res, 200, { ok: true, changed: false, message: "Yayınlanacak yeni değişiklik yok." }, origin);
      const stamp = new Date().toLocaleString("tr-TR").replace(/[/:]/g, "-");
      await run(process.platform === "win32" ? "git.exe" : "git", ["commit", "-m", `Siteyi yayinla ${stamp}`]);
      await run(process.platform === "win32" ? "git.exe" : "git", ["push", "origin", "main"]);
      return send(res, 200, { ok: true, changed: true, message: "GitHub'a gönderildi. Cloudflare otomatik yayına alacak." }, origin);
    }

    return send(res, 404, { error: "Bulunamadı." }, origin);
  } catch (error) {
    console.error(error);
    return send(res, 500, { error: error instanceof Error ? error.message : "İşlem başarısız." }, origin);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`3Dbade yerel editor servisi: http://127.0.0.1:${port}`);
});
