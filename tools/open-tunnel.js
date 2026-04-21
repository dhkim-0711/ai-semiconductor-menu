const fs = require("fs");
const path = require("path");

const port = Number(process.argv[2] || 4173);
const outputPath = process.argv[3];
const subdomain = process.argv[4] && process.argv[4] !== "-" ? process.argv[4] : "";
const moduleRoot =
  process.argv[5] ||
  path.resolve(__dirname, "..", ".share", "tunnel-deps", "node_modules", "localtunnel");

async function main() {
  const localtunnel = require(moduleRoot);
  const options = { port };

  if (subdomain) {
    options.subdomain = subdomain;
  }

  const tunnel = await localtunnel(options);

  if (outputPath) {
    fs.writeFileSync(outputPath, `${tunnel.url}\n`, "utf8");
  }

  console.log(tunnel.url);

  tunnel.on("close", () => {
    process.exit(0);
  });

  setInterval(() => {}, 1 << 30);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
