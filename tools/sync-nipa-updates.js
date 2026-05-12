const fs = require("fs");
const path = require("path");
const { execFileSync } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const outputPath = path.join(dataDir, "ai-updates.json");

const BASE_URL = "https://www.nipa.kr";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";
const MAX_SEARCH_PAGES = 2;

const SEARCH_CONFIGS = {
  press: {
    label: "보도자료",
    path: "/home/4-4-1",
    maxItems: 4,
    searchTerms: ["반도체"]
  },
  notice: {
    label: "공지사항",
    path: "/home/2-1",
    maxItems: 6,
    searchTerms: ["AI반도체", "AI-반도체", "AX 디바이스", "온디바이스", "엔드프로덕트"]
  }
};

const RELEVANT_TITLE_PATTERNS = [
  /AI\s*-?\s*반도체/i,
  /국산\s*AI\s*-?\s*반도체/i,
  /인공지능\s*(?:\(AI\)\s*)?-?\s*반도체/i,
  /AX\s*디바이스/i,
  /온디바이스/i,
  /엔드프로덕트/i,
  /AI\s*응용제품/i
];

function decodeHtml(value) {
  return value
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(value) {
  return value.replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ");
}

function normalizeText(value) {
  return decodeHtml(stripTags(value)).replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(url, baseUrl) {
  return new URL(decodeHtml(url), baseUrl).toString();
}

function fetchHtml(url) {
  const curlCommand = process.platform === "win32" ? "curl.exe" : "curl";
  const curlArgs = [
    ...(process.platform === "win32" ? ["--ssl-no-revoke"] : []),
    "--fail",
    "--silent",
    "--show-error",
    "--location",
    "--user-agent",
    USER_AGENT,
    url
  ];

  return execFileSync(curlCommand, curlArgs, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function isRelevantTitle(title) {
  return RELEVANT_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

function parsePostedDate(cells) {
  return cells.find((cell) => /^\d{4}-\d{2}-\d{2}$/.test(cell)) || "";
}

function parseRows(html, config) {
  const rowMatches = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
  const items = [];

  rowMatches.forEach((match) => {
    const rowHtml = match[1];
    const linkMatch = rowHtml.match(/<a href="([^"]+)">([\s\S]*?)<\/a>/);
    if (!linkMatch) {
      return;
    }

    const title = normalizeText(linkMatch[2]);
    if (!title || !isRelevantTitle(title)) {
      return;
    }

    const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((cellMatch) =>
      normalizeText(cellMatch[1])
    );
    const publishedAt = parsePostedDate(cells);

    items.push({
      title,
      href: toAbsoluteUrl(linkMatch[1], `${BASE_URL}${config.path}`),
      publishedAt,
      source: config.label
    });
  });

  return items;
}

function dedupeItems(items) {
  const seen = new Set();
  const unique = [];

  items.forEach((item) => {
    if (seen.has(item.href)) {
      return;
    }

    seen.add(item.href);
    unique.push(item);
  });

  return unique;
}

function compareItems(a, b) {
  const dateDiff = (b.publishedAt || "").localeCompare(a.publishedAt || "");
  if (dateDiff !== 0) {
    return dateDiff;
  }

  return a.title.localeCompare(b.title, "ko");
}

function readExistingOutput() {
  if (!fs.existsSync(outputPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(outputPath, "utf8"));
  } catch {
    return null;
  }
}

function sameCategories(previous, next) {
  return JSON.stringify(previous || {}) === JSON.stringify(next || {});
}

function writeOutput(data) {
  const previous = readExistingOutput();
  const finalData =
    previous && sameCategories(previous.categories, data.categories)
      ? { ...data, generatedAt: previous.generatedAt, errors: data.errors }
      : data;

  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), "utf8");
}

function buildSearchUrl(config, searchTerm, pageNumber) {
  const url = new URL(config.path, BASE_URL);
  url.searchParams.set("srchKey", "sj");
  url.searchParams.set("srchText", searchTerm);
  url.searchParams.set("curPage", String(pageNumber));
  return url.toString();
}

async function collectCategoryItems(config) {
  const items = [];
  const errors = [];

  for (const searchTerm of config.searchTerms) {
    for (let pageNumber = 1; pageNumber <= MAX_SEARCH_PAGES; pageNumber += 1) {
      const url = buildSearchUrl(config, searchTerm, pageNumber);

      try {
        const html = await fetchHtml(url);
        const parsed = parseRows(html, config);

        if (!parsed.length) {
          break;
        }

        items.push(...parsed);
      } catch (error) {
        errors.push({
          source: config.label,
          searchTerm,
          pageNumber,
          url,
          message: error.message
        });
      }
    }
  }

  return {
    items: dedupeItems(items).sort(compareItems).slice(0, config.maxItems),
    errors
  };
}

async function main() {
  const categories = {};
  const errors = [];

  for (const [categoryId, config] of Object.entries(SEARCH_CONFIGS)) {
    const result = await collectCategoryItems(config);
    categories[categoryId] = result.items;
    errors.push(...result.errors);
  }

  writeOutput({
    generatedAt: new Date().toISOString(),
    source: "NIPA 보도자료 및 공지사항",
    categories,
    errors
  });
}

main();
