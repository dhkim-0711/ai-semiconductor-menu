const http = require("http");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".hwp": "application/x-hwp",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

function safeResolve(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const targetPath = normalizedPath === path.sep || normalizedPath === "/"
    ? path.join(projectRoot, "index.html")
    : path.join(projectRoot, normalizedPath.replace(/^[/\\]/, ""));

  if (!targetPath.startsWith(projectRoot)) {
    return null;
  }

  return targetPath;
}

function sendFile(filePath, response) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  const stream = fs.createReadStream(filePath);
  response.writeHead(200, { "Content-Type": contentType });
  stream.pipe(response);
  stream.on("error", () => {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Failed to read file.");
  });
}

const server = http.createServer((request, response) => {
  const resolvedPath = safeResolve(request.url || "/");

  if (!resolvedPath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.stat(resolvedPath, (error, stats) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(resolvedPath, "index.html");
      fs.stat(indexPath, (indexError, indexStats) => {
        if (indexError || !indexStats.isFile()) {
          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Not found");
          return;
        }

        sendFile(indexPath, response);
      });
      return;
    }

    sendFile(resolvedPath, response);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Static server running on http://0.0.0.0:${port}`);
});
