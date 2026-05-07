const fs = require("fs");
const path = require("path");
const { execFileSync } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const csvPath = path.join(dataDir, "projects-master.csv");
const outputPath = path.join(dataDir, "auto-notice-links.json");

const BASE_URL = "https://www.nipa.kr";
const NOTICE_LIST_URL = `${BASE_URL}/home/bsnsAll/0/nttList?bbsNo=4&bsnsDtlsIemNo={id}&tab=2`;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";
const MAX_NOTICE_LINKS = 5;

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
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
        index += 1;
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

  const [headerRow, ...bodyRows] = rows;
  return bodyRows.map((bodyRow) =>
    Object.fromEntries(headerRow.map((header, index) => [header, bodyRow[index] ?? ""]))
  );
}

function splitList(value) {
  return value
    .split(" || ")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLinks(value) {
  return splitList(value).map((item) => {
    const [label = "", href = "", description = ""] = item.split(" >>> ");
    return { label, href, description };
  });
}

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

function extractNoticeIds(row) {
  const rawLinks = [...splitLinks(row.introLinks), ...splitLinks(row.noticeLinks)];
  return [
    ...new Set(
      rawLinks
        .flatMap((link) => [...link.href.matchAll(/bsnsDtlsIemNo=(\d+)/g)].map((match) => match[1]))
        .filter(Boolean)
    )
  ];
}

function parsePostedDate(value) {
  const match = value.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function buildNoticeDescription({ sourceLabel, status, requestPeriod, postedAt }) {
  const details = [];

  if (status) {
    details.push(status);
  }

  if (requestPeriod) {
    details.push(requestPeriod);
  } else if (postedAt) {
    details.push(`등록일 ${postedAt}`);
  }

  if (sourceLabel) {
    details.push(sourceLabel);
  }

  return `NIPA 자동반영${details.length ? ` · ${details.join(" · ")}` : ""}`;
}

function getStatusRank(status) {
  if (status.includes("진행")) return 0;
  if (status.includes("예정")) return 1;
  if (status.includes("종료")) return 2;
  return 3;
}

function compareNotice(a, b) {
  const statusRank = getStatusRank(a.meta.status) - getStatusRank(b.meta.status);
  if (statusRank !== 0) {
    return statusRank;
  }

  const postedAtDiff = b.meta.postedAt.localeCompare(a.meta.postedAt);
  if (postedAtDiff !== 0) {
    return postedAtDiff;
  }

  return b.meta.nttNo.localeCompare(a.meta.nttNo, "en");
}

function parseNoticeRows(html, listUrl, projectNoticeId) {
  const rowMatches = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
  const notices = [];

  rowMatches.forEach((rowMatch) => {
    const rowHtml = rowMatch[1];
    const linkMatch = rowHtml.match(
      /<a href="([^"]*?nttDetail\?[^"]*?bbsNo=4[^"]*?nttNo=(\d+)[^"]*)">([\s\S]*?)<\/a>/
    );

    if (!linkMatch) {
      return;
    }

    const href = toAbsoluteUrl(linkMatch[1], listUrl);
    const title = normalizeText(linkMatch[3]);
    const status = normalizeText(rowHtml.match(/<div class="point[^"]*">\s*<b>([\s\S]*?)<\/b>/)?.[1] ?? "");
    const sourceLabel = normalizeText(rowHtml.match(/<span class="box[^"]*">([\s\S]*?)<\/span>/)?.[1] ?? "");
    const bcoMatches = [...rowHtml.matchAll(/<span class="bco">([\s\S]*?)<\/span>/g)].map((match) =>
      normalizeText(match[1])
    );
    const requestPeriod = bcoMatches.find((value) => value.includes("신청기간")) ?? "";
    const postedAt = parsePostedDate(
      bcoMatches.find((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)) ?? ""
    );

    if (!title) {
      return;
    }

    notices.push({
      label: title,
      href,
      description: buildNoticeDescription({ sourceLabel, status, requestPeriod, postedAt }),
      meta: {
        projectNoticeId,
        nttNo: linkMatch[2],
        status,
        sourceLabel,
        requestPeriod,
        postedAt
      }
    });
  });

  return notices;
}

async function fetchHtml(url) {
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

function dedupeNotices(notices) {
  const seen = new Set();
  const unique = [];

  notices.forEach((notice) => {
    const key = notice.href;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    unique.push(notice);
  });

  return unique;
}

function readRows() {
  const csv = fs.readFileSync(csvPath, "utf8");
  return parseCsv(csv);
}

function createProjectIndex(rows) {
  return rows.map((row) => ({
    projectId: row.projectId,
    projectName: row.projectName,
    noticeIds: extractNoticeIds(row)
  }));
}

function buildOutput({ generatedAt, projects, errors }) {
  return {
    generatedAt,
    source: "NIPA 사업공고",
    projectCount: Object.keys(projects).length,
    projects,
    errors
  };
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

function sameProjectNotices(previousProjects, nextProjects) {
  return JSON.stringify(previousProjects || {}) === JSON.stringify(nextProjects || {});
}

function writeOutput(data) {
  const previous = readExistingOutput();
  const finalData =
    previous && sameProjectNotices(previous.projects, data.projects)
      ? { ...data, generatedAt: previous.generatedAt, errors: data.errors }
      : data;

  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), "utf8");
}

async function collectProjectNotices(project) {
  const notices = [];
  const errors = [];
  let fetchedCount = 0;

  for (const noticeId of project.noticeIds) {
    const listUrl = NOTICE_LIST_URL.replace("{id}", noticeId);

    try {
      const html = await fetchHtml(listUrl);
      fetchedCount += 1;
      notices.push(...parseNoticeRows(html, listUrl, noticeId));
    } catch (error) {
      errors.push({
        projectId: project.projectId,
        projectName: project.projectName,
        noticeId,
        listUrl,
        message: error.message
      });
    }
  }

  return {
    fetchedCount,
    links: dedupeNotices(notices).sort(compareNotice).slice(0, MAX_NOTICE_LINKS),
    errors
  };
}

async function main() {
  const rows = readRows();
  const projects = createProjectIndex(rows);
  const withNoticeSource = projects.filter((project) => project.noticeIds.length > 0);
  const autoNoticeProjects = {};
  const errors = [];
  let fetchedPageCount = 0;

  for (const project of withNoticeSource) {
    const result = await collectProjectNotices(project);
    fetchedPageCount += result.fetchedCount;
    autoNoticeProjects[project.projectId] = result.links.map(({ label, href, description }) => ({
      label,
      href,
      description
    }));
    errors.push(...result.errors);
  }

  if (withNoticeSource.length > 0 && fetchedPageCount === 0) {
    throw new Error("NIPA 사업공고 페이지를 가져오지 못했습니다.");
  }

  const output = buildOutput({
    generatedAt: new Date().toISOString(),
    projects: autoNoticeProjects,
    errors
  });

  writeOutput(output);

  const syncedCount = Object.values(autoNoticeProjects).reduce((sum, links) => sum + links.length, 0);
  console.log(`Synced ${syncedCount} notice links across ${withNoticeSource.length} projects.`);
  if (errors.length) {
    console.warn(`Encountered ${errors.length} fetch errors while syncing notices.`);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
