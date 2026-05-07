const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const csvPath = path.join(dataDir, "projects-master.csv");
const jsonPath = path.join(dataDir, "projects-master.json");
const outputJsPath = path.join(dataDir, "portfolio-data.generated.js");
const autoNoticePath = path.join(dataDir, "auto-notice-links.json");

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

function getLinkKey(link) {
  const nttNoMatch = link.href.match(/(?:nttNo=|\/home\/2-2\/)(\d+)/);
  if (nttNoMatch) {
    return `nttNo:${nttNoMatch[1]}`;
  }

  return `${link.href}::${link.label}`;
}

function isNoticeLikeLink(link) {
  return /(?:nttNo=|\/home\/2-2\/)/.test(link.href);
}

function dedupeLinks(links) {
  const seen = new Set();

  return links.filter((link) => {
    const key = getLinkKey(link);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function readAutoNoticeData() {
  if (!fs.existsSync(autoNoticePath)) {
    return {
      generatedAt: null,
      projects: {}
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(autoNoticePath, "utf8"));
    return {
      generatedAt: parsed.generatedAt || null,
      projects: parsed.projects || {}
    };
  } catch (error) {
    console.warn(`Failed to read auto notice data: ${error.message}`);
    return {
      generatedAt: null,
      projects: {}
    };
  }
}

function buildData(rows, autoNoticeData) {
  const chainMap = new Map();
  const announcementLinksByProjectId = {};
  const autoNoticeLinksByProjectId = autoNoticeData.projects || {};

  rows.forEach((row) => {
    if (!chainMap.has(row.valueChainId)) {
      chainMap.set(row.valueChainId, {
        id: row.valueChainId,
        title: row.valueChainTitle,
        focus: row.valueChainFocus,
        budget: Number(row.valueChainBudget || 0),
        summary: row.valueChainSummary,
        projects: []
      });
    }

    const project = {
      id: row.projectId,
      name: row.projectName,
      budget: Number(row.projectBudget || 0),
      target: row.target,
      stage: row.stage,
      description: row.description,
      tabs: [
        { id: "overview", label: "사업개요", content: splitList(row.overview) },
        { id: "target", label: "지원대상", content: splitList(row.targetContent) },
        { id: "scale", label: "지원규모", content: splitList(row.scale) },
        { id: "support", label: "지원내용", content: splitList(row.support) },
        { id: "schedule", label: "추진절차", content: splitList(row.schedule) },
        { id: "effect", label: "기대효과", content: splitList(row.effect) }
      ]
    };

    chainMap.get(row.valueChainId).projects.push(project);
    const introLinks = splitLinks(row.introLinks);
    const introPages = introLinks.filter((link) => !isNoticeLikeLink(link));
    const manualNoticeLinks = [...introLinks.filter(isNoticeLikeLink), ...splitLinks(row.noticeLinks)];
    announcementLinksByProjectId[row.projectId] = dedupeLinks([
      ...introPages,
      ...(autoNoticeLinksByProjectId[row.projectId] || []),
      ...manualNoticeLinks
    ]);
  });

  return {
    generatedAt: new Date().toISOString(),
    noticeSyncGeneratedAt: autoNoticeData.generatedAt || null,
    valueChains: [...chainMap.values()],
    announcementLinksByProjectId
  };
}

function readExistingGeneratedData() {
  if (!fs.existsSync(outputJsPath)) {
    return null;
  }

  try {
    const source = fs.readFileSync(outputJsPath, "utf8");
    const match = source.match(/^window\.AI_MENU_DATA = ([\s\S]*);\s*$/);
    return match ? JSON.parse(match[1]) : null;
  } catch {
    return null;
  }
}

function sameGeneratedData(previous, next) {
  const { generatedAt: _previousGeneratedAt, ...previousRest } = previous || {};
  const { generatedAt: _nextGeneratedAt, ...nextRest } = next || {};
  return JSON.stringify(previousRest) === JSON.stringify(nextRest);
}

function writeOutputs(rows, data) {
  const existingData = readExistingGeneratedData();
  const finalData =
    existingData && sameGeneratedData(existingData, data)
      ? { ...data, generatedAt: existingData.generatedAt }
      : data;

  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: finalData.generatedAt, rows }, null, 2), "utf8");
  fs.writeFileSync(outputJsPath, `window.AI_MENU_DATA = ${JSON.stringify(finalData, null, 2)};\n`, "utf8");
}

function main() {
  const csv = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(csv);
  const autoNoticeData = readAutoNoticeData();
  const data = buildData(rows, autoNoticeData);
  writeOutputs(rows, data);
}

main();
