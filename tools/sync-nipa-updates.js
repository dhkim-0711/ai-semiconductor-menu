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

const GOOGLE_NEWS_QUERY =
  '("국산 AI반도체" OR "AI 반도체" OR "AX 디바이스" OR "온디바이스 AI") -ETF -주가 -증시 -순매수 -마켓';
const GOOGLE_NEWS_RSS_URL = `https://news.google.com/rss/search?q=${encodeURIComponent(
  GOOGLE_NEWS_QUERY
)}&hl=ko&gl=KR&ceid=KR:ko`;

const SEARCH_CONFIGS = {
  press: {
    label: "외부 뉴스",
    type: "googleNewsRss",
    maxItems: 2
  },
  notice: {
    label: "공지사항",
    type: "nipaBoard",
    path: "/home/2-1",
    maxItems: 2,
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
  /AI\s*응용제품/i,
  /NPU/i
];

const EXTERNAL_NEWS_EXCLUDE_PATTERNS = [
  /ETF/i,
  /주가/,
  /증시/,
  /순매수/,
  /시총/,
  /경상흑자/,
  /마켓/,
  /랠리/,
  /S&P/i,
  /KODEX/i,
  /HANARO/i,
  /골드만삭스/,
  /Investing/i,
  /금리/,
  /경기/,
  /성장/
];

const EXTERNAL_NEWS_SOURCE_EXCLUDE_PATTERNS = [/네이트/, /v\.daum\.net/i];

const EXTERNAL_NEWS_PRIORITY_PATTERNS = [
  { pattern: /국산\s*AI\s*-?\s*반도체/i, score: 4 },
  { pattern: /AX\s*디바이스/i, score: 4 },
  { pattern: /온디바이스/i, score: 4 },
  { pattern: /NPU/i, score: 3 },
  { pattern: /생태계/i, score: 3 },
  { pattern: /실증/i, score: 3 },
  { pattern: /수주/i, score: 3 },
  { pattern: /개발/i, score: 2 },
  { pattern: /R&D/i, score: 2 },
  { pattern: /클라우드/i, score: 2 },
  { pattern: /인력양성/i, score: 2 },
  { pattern: /협력/i, score: 1 }
];

function decodeHtml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
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

function fetchText(url) {
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

function isRelevantExternalNewsTitle(title) {
  return isRelevantTitle(title) && !EXTERNAL_NEWS_EXCLUDE_PATTERNS.some((pattern) => pattern.test(title));
}

function isRelevantExternalNewsSource(source) {
  return !EXTERNAL_NEWS_SOURCE_EXCLUDE_PATTERNS.some((pattern) => pattern.test(source));
}

function getExternalNewsPriority(title) {
  return EXTERNAL_NEWS_PRIORITY_PATTERNS.reduce(
    (score, item) => score + (item.pattern.test(title) ? item.score : 0),
    0
  );
}

function parsePostedDate(cells) {
  return cells.find((cell) => /^\d{4}-\d{2}-\d{2}$/.test(cell)) || "";
}

function formatRssDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function parseNipaRows(html, config) {
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

function parseGoogleNewsRss(xml, config) {
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  const items = [];

  itemMatches.forEach((match) => {
    const itemXml = match[1];
    const title = normalizeText(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const href = normalizeText(itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "");
    const publishedAt = formatRssDate(itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "");
    const source = normalizeText(itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? config.label);

    if (!title || !href || !isRelevantExternalNewsTitle(title) || !isRelevantExternalNewsSource(source)) {
      return;
    }

    items.push({
      title: title.replace(/\s+-\s+[^-]+$/, ""),
      href,
      publishedAt,
      source,
      priority: getExternalNewsPriority(title)
    });
  });

  return items;
}

function dedupeItems(items) {
  const seen = new Set();
  const unique = [];

  items.forEach((item) => {
    const key = `${item.href}::${item.title}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    unique.push(item);
  });

  return unique;
}

function tokenizeTitle(title) {
  return (title.match(/[A-Za-z0-9가-힣]+/g) || [])
    .map((token) => token.toLowerCase())
    .filter((token) => token.length >= 2);
}

function isNearDuplicateTitle(a, b) {
  const normalizedA = a.replace(/\s+/g, " ").trim();
  const normalizedB = b.replace(/\s+/g, " ").trim();

  if (normalizedA === normalizedB || normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA)) {
    return true;
  }

  const tokensA = new Set(tokenizeTitle(normalizedA));
  const tokensB = new Set(tokenizeTitle(normalizedB));

  if (!tokensA.size || !tokensB.size) {
    return false;
  }

  let intersectionCount = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) {
      intersectionCount += 1;
    }
  });

  const unionCount = new Set([...tokensA, ...tokensB]).size;
  return intersectionCount / unionCount >= 0.6;
}

function dedupeSimilarTitles(items) {
  const unique = [];

  items.forEach((item) => {
    if (unique.some((existing) => isNearDuplicateTitle(existing.title, item.title))) {
      return;
    }

    unique.push(item);
  });

  return unique;
}

function getLeadToken(title) {
  const ignored = new Set(["국산", "ai", "반도체", "온디바이스", "ax", "디바이스", "사업"]);
  return tokenizeTitle(title).find((token) => !ignored.has(token)) || "";
}

function dedupeByLeadToken(items) {
  const seen = new Set();
  const unique = [];

  items.forEach((item) => {
    const leadToken = getLeadToken(item.title);
    const key = leadToken || item.title;

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    unique.push(item);
  });

  return unique;
}

function compareItems(a, b) {
  const priorityDiff = (b.priority || 0) - (a.priority || 0);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

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

function buildNipaSearchUrl(config, searchTerm, pageNumber) {
  const url = new URL(config.path, BASE_URL);
  url.searchParams.set("srchKey", "sj");
  url.searchParams.set("srchText", searchTerm);
  url.searchParams.set("curPage", String(pageNumber));
  return url.toString();
}

async function collectNipaBoardItems(config) {
  const items = [];
  const errors = [];

  for (const searchTerm of config.searchTerms) {
    for (let pageNumber = 1; pageNumber <= MAX_SEARCH_PAGES; pageNumber += 1) {
      const url = buildNipaSearchUrl(config, searchTerm, pageNumber);

      try {
        const html = await fetchText(url);
        const parsed = parseNipaRows(html, config);

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

async function collectGoogleNewsItems(config) {
  try {
    const xml = await fetchText(GOOGLE_NEWS_RSS_URL);
    return {
      items: dedupeByLeadToken(
        dedupeSimilarTitles(dedupeItems(parseGoogleNewsRss(xml, config)).sort(compareItems))
      ).slice(0, config.maxItems),
      errors: []
    };
  } catch (error) {
    return {
      items: [],
      errors: [
        {
          source: config.label,
          url: GOOGLE_NEWS_RSS_URL,
          message: error.message
        }
      ]
    };
  }
}

async function collectCategoryItems(config) {
  if (config.type === "googleNewsRss") {
    return collectGoogleNewsItems(config);
  }

  return collectNipaBoardItems(config);
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
    source: "외부 뉴스 및 NIPA 공지사항",
    categories,
    errors
  });
}

main();
