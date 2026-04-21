const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const scriptPath = path.join(rootDir, "script.js");
const outputDir = path.join(rootDir, "data");

function escapeCsv(value) {
  const normalized = String(value ?? "");
  return `"${normalized.replace(/"/g, '""')}"`;
}

function joinList(items) {
  return (items || []).join(" || ");
}

function joinLinks(items) {
  return (items || [])
    .map((item) => [item.label, item.href, item.description].map((part) => String(part ?? "")).join(" >>> "))
    .join(" || ");
}

function extractCurrentData(source) {
  const valueChainsMatch = source.match(/const valueChains = ([\s\S]*?);\n\nconst announcementLinksByProjectId =/);
  const announcementsMatch = source.match(/const announcementLinksByProjectId = ([\s\S]*?);\n\nfunction createProject/);

  if (!valueChainsMatch || !announcementsMatch) {
    throw new Error("script.js에서 데이터 구간을 찾지 못했습니다.");
  }

  const sandbox = {};
  const bootstrap = `
    function createProject({
      id,
      name,
      budget,
      target,
      stage,
      source,
      description,
      overview,
      targetContent,
      scale,
      support,
      schedule,
      effect
    }) {
      return {
        id,
        name,
        budget,
        target,
        stage,
        source,
        description,
        tabs: [
          { id: "overview", label: "사업개요", content: overview },
          { id: "target", label: "지원대상", content: targetContent },
          { id: "scale", label: "지원규모", content: scale },
          { id: "support", label: "지원내용", content: support },
          { id: "schedule", label: "추진절차", content: schedule },
          { id: "effect", label: "기대효과", content: effect }
        ]
      };
    }

    valueChains = ${valueChainsMatch[1]};
    announcementLinksByProjectId = ${announcementsMatch[1]};
  `;

  vm.runInNewContext(bootstrap, sandbox);

  return {
    valueChains: sandbox.valueChains,
    announcementLinksByProjectId: sandbox.announcementLinksByProjectId
  };
}

function toMasterRows(valueChains, announcementLinksByProjectId) {
  return valueChains.flatMap((chain) =>
    chain.projects.map((project) => {
      const links = announcementLinksByProjectId[project.id] || [];
      const introLinks = links.filter((link) => link.label.includes("사업소개"));
      const noticeLinks = links.filter((link) => !link.label.includes("사업소개"));
      const tabMap = Object.fromEntries(project.tabs.map((tab) => [tab.id, tab.content]));

      return {
        valueChainId: chain.id,
        valueChainTitle: chain.title,
        valueChainFocus: chain.focus,
        valueChainBudget: chain.budget,
        valueChainSummary: chain.summary,
        projectId: project.id,
        projectName: project.name,
        projectBudget: project.budget,
        target: project.target,
        stage: project.stage,
        description: project.description,
        overview: joinList(tabMap.overview),
        targetContent: joinList(tabMap.target),
        scale: joinList(tabMap.scale),
        support: joinList(tabMap.support),
        schedule: joinList(tabMap.schedule),
        effect: joinList(tabMap.effect),
        introLinks: joinLinks(introLinks),
        noticeLinks: joinLinks(noticeLinks)
      };
    })
  );
}

function writeMasterCsv(rows) {
  const headers = [
    "valueChainId",
    "valueChainTitle",
    "valueChainFocus",
    "valueChainBudget",
    "valueChainSummary",
    "projectId",
    "projectName",
    "projectBudget",
    "target",
    "stage",
    "description",
    "overview",
    "targetContent",
    "scale",
    "support",
    "schedule",
    "effect",
    "introLinks",
    "noticeLinks"
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(","))
  ];

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "projects-master.csv"), lines.join("\n"), "utf8");
}

function writeMasterJson(rows) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "projects-master.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2),
    "utf8"
  );
}

function main() {
  const source = fs.readFileSync(scriptPath, "utf8");
  const { valueChains, announcementLinksByProjectId } = extractCurrentData(source);
  const rows = toMasterRows(valueChains, announcementLinksByProjectId);

  writeMasterCsv(rows);
  writeMasterJson(rows);
}

main();
