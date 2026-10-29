import http from "node:http";

const liveSiteUrl = "https://3dbadeneon.com";
const port = 3000;

const server = http.createServer(async (req, res) => {
  try {
    const target = new URL(req.url || "/", liveSiteUrl);
    const headers = {};
    for (const name of ["accept", "accept-language", "user-agent"]) {
      if (req.headers[name]) headers[name] = req.headers[name];
    }

    const response = await fetch(target, {
      method: req.method === "HEAD" ? "HEAD" : "GET",
      headers,
      redirect: "follow",
    });

    res.statusCode = response.status;
    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "HEAD") return res.end();
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`3DBadeNeon paneli acilamadi: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`3Dbade urun paneli: http://localhost:${port}/yonetim/urunler`);
});
