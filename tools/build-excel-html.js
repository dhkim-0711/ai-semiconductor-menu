const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const csvPath = path.join(dataDir, "projects-master.csv");
const outputPath = path.join(dataDir, "projects-master.xls");

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(current);
      current = "";
      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function main() {
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  const [headerRow, ...bodyRows] = rows;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>AI반도체본부 사업관리표</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #cfd8d3; padding: 8px; vertical-align: top; text-align: left; }
    th { background: #e8f1eb; font-weight: 700; }
    tr:nth-child(even) td { background: #f8fbf9; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>${headerRow.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${bodyRows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
        .join("\n")}
    </tbody>
  </table>
</body>
</html>
`;

  fs.writeFileSync(outputPath, html, "utf8");
}

main();
