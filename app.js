const { valueChains = [], announcementLinksByProjectId = {} } = window.AI_MENU_DATA || {};

const state = {
  selectedValueChainId: null,
  selectedProjectId: null,
  selectedTabId: "overview",
  showStructureIntro: true
};

const elements = {
  pageShell: document.querySelector(".page-shell"),
  structureDiagramRoot: document.querySelector("#structureDiagramRoot"),
  openStructureIntroButton: document.querySelector("#openStructureIntroButton"),
  valueChainGrid: document.querySelector("#valueChainGrid"),
  projectList: document.querySelector("#projectList"),
  selectedProjectCount: document.querySelector("#selectedProjectCount"),
  selectedBudgetTotal: document.querySelector("#selectedBudgetTotal"),
  totalProjectCount: document.querySelector("#totalProjectCount"),
  totalBudgetCount: document.querySelector("#totalBudgetCount"),
  selectedValueChainTitle: document.querySelector("#selectedValueChainTitle"),
  selectedValueChainSummary: document.querySelector("#selectedValueChainSummary"),
  showAllButton: document.querySelector("#showAllButton"),
  detailValueChain: document.querySelector("#detailValueChain"),
  detailProjectTitle: document.querySelector("#detailProjectTitle"),
  detailBudget: document.querySelector("#detailBudget"),
  detailCard: document.querySelector("#detailCard"),
  detailMeta: document.querySelector("#detailMeta"),
  detailTabs: document.querySelector("#detailTabs"),
  detailPanel: document.querySelector("#detailPanel"),
  announcementLinks: document.querySelector("#announcementLinks")
};

function formatBudget(value) {
  return value === 0 ? "" : `${value.toLocaleString("ko-KR")}백만원`;
}

function leaveStructureIntroToDashboard(payload) {
  if (payload.type === "center") {
    state.selectedValueChainId = null;
    const all = getAllProjects();
    state.selectedProjectId = all[0]?.id ?? null;
  } else if (payload.type === "chain") {
    state.selectedValueChainId = payload.chainId;
    const chain = valueChains.find((c) => c.id === payload.chainId);
    state.selectedProjectId = chain?.projects[0]?.id ?? null;
  } else {
    state.selectedValueChainId = payload.chainId;
    state.selectedProjectId = payload.projectId;
  }
  state.selectedTabId = "overview";
  state.showStructureIntro = false;
  render();
}

function bindStructureIntroControl(el, payload) {
  const activate = () => leaveStructureIntroToDashboard(payload);
  el.addEventListener("click", activate);
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
}

function renderStructureDiagram() {
  const root = elements.structureDiagramRoot;
  if (!root) return;
  root.innerHTML = "";

  if (!valueChains.length) {
    const empty = document.createElement("p");
    empty.className = "structure-diagram-empty";
    empty.textContent = "표시할 벨류체인 데이터가 없습니다.";
    root.appendChild(empty);
    return;
  }

  const inner = document.createElement("div");
  inner.className = "structure-diagram-inner";

  const rootBtn = document.createElement("button");
  rootBtn.type = "button";
  rootBtn.className = "structure-root";
  rootBtn.setAttribute("aria-label", "AI반도체본부 벨류체인 전체, 전체 사업 현황으로 이동");
  const rootLine1 = document.createElement("span");
  rootLine1.className = "structure-root-label";
  rootLine1.textContent = "AI반도체본부";
  const rootLine2 = document.createElement("span");
  rootLine2.className = "structure-root-sub";
  rootLine2.textContent = "벨류체인 전체";
  rootBtn.appendChild(rootLine1);
  rootBtn.appendChild(rootLine2);
  bindStructureIntroControl(rootBtn, { type: "center" });

  const rail = document.createElement("div");
  rail.className = "structure-rail";
  rail.setAttribute("aria-hidden", "true");

  const columns = document.createElement("div");
  columns.className = "structure-columns";

  valueChains.forEach((chain) => {
    const col = document.createElement("div");
    col.className = "structure-column";

    const head = document.createElement("button");
    head.type = "button";
    head.className = "structure-column-head";
    head.setAttribute("aria-label", `${chain.title}, 해당 벨류체인 사업 목록으로 이동`);
    const hTitle = document.createElement("span");
    hTitle.className = "structure-column-title";
    hTitle.textContent = chain.title;
    const hMeta = document.createElement("span");
    hMeta.className = "structure-column-meta";
    let metaText = `${chain.projects.length}개 사업`;
    if (chain.budget > 0) metaText += ` · ${formatBudget(chain.budget)}`;
    hMeta.textContent = metaText;
    head.appendChild(hTitle);
    head.appendChild(hMeta);
    bindStructureIntroControl(head, { type: "chain", chainId: chain.id });

    const list = document.createElement("ul");
    list.className = "structure-project-list";

    chain.projects.forEach((project) => {
      const li = document.createElement("li");
      const pb = document.createElement("button");
      pb.type = "button";
      pb.className = "structure-project";
      pb.setAttribute("aria-label", `${project.name}, 사업 상세로 이동`);
      pb.title = project.name;
      pb.textContent = project.name;
      bindStructureIntroControl(pb, { type: "project", chainId: chain.id, projectId: project.id });
      li.appendChild(pb);
      list.appendChild(li);
    });

    col.appendChild(head);
    col.appendChild(list);
    columns.appendChild(col);
  });

  inner.appendChild(rootBtn);
  inner.appendChild(rail);
  inner.appendChild(columns);
  root.appendChild(inner);
}

function getAllProjects() {
  return valueChains.flatMap((chain) =>
    chain.projects.map((project) => ({
      ...project,
      parentTitle: chain.title,
      parentId: chain.id
    }))
  );
}

function getSelectedValueChain() {
  return valueChains.find((chain) => chain.id === state.selectedValueChainId) || null;
}

function getVisibleProjects() {
  const selectedChain = getSelectedValueChain();
  return selectedChain
    ? selectedChain.projects.map((project) => ({
        ...project,
        parentTitle: selectedChain.title,
        parentId: selectedChain.id
      }))
    : getAllProjects();
}

function getSelectedProject() {
  return getAllProjects().find((project) => project.id === state.selectedProjectId) || getAllProjects()[0];
}

function renderValueChains() {
  elements.valueChainGrid.innerHTML = valueChains
    .map(
      (chain, index) => `
        <button class="value-chain-card ${chain.id === state.selectedValueChainId ? "is-active" : ""}" type="button" data-id="${chain.id}">
          <span class="card-index">${index + 1}</span>
          <h3>${chain.title}</h3>
          <div class="chip-row">
            <span class="chip">${chain.projects.length}개 사업</span>
            ${chain.budget > 0 ? `<span class="chip">${formatBudget(chain.budget)}</span>` : ""}
          </div>
          <p class="card-caption">${chain.focus}</p>
        </button>
      `
    )
    .join("");

  [...elements.valueChainGrid.querySelectorAll("[data-id]")].forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedValueChainId = button.dataset.id;
      const firstVisibleProject = getVisibleProjects()[0];
      if (firstVisibleProject) {
        state.selectedProjectId = firstVisibleProject.id;
        state.selectedTabId = "overview";
      }
      render();
    });
  });
}

function renderProjects() {
  const visibleProjects = getVisibleProjects();
  elements.projectList.innerHTML = visibleProjects
    .map(
      (project) => `
        <article class="project-card ${project.id === state.selectedProjectId ? "is-selected" : ""}">
          <div class="project-card-header">
            <div class="project-card-main">
              <div class="chip-row">
                <span class="chip">${project.parentTitle}</span>
                <span class="chip">${project.stage}</span>
                <span class="chip">${project.target}</span>
              </div>
              <button class="project-title-button" type="button" data-project-id="${project.id}">
                ${project.name}
              </button>
            </div>
            ${project.budget > 0 ? `<div class="budget-badge">${formatBudget(project.budget)}</div>` : ""}
          </div>
          <p class="project-description">${project.description}</p>
        </article>
      `
    )
    .join("");

  [...elements.projectList.querySelectorAll("[data-project-id]")].forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedProjectId = button.dataset.projectId;
      state.selectedTabId = "overview";
      render();
    });
  });
}

function renderSummary() {
  const selectedChain = getSelectedValueChain();
  const selectedProjects = getVisibleProjects();
  const selectedBudget = selectedChain
    ? selectedChain.budget
    : valueChains.reduce((sum, chain) => sum + chain.budget, 0);
  const totalProjects = getAllProjects();
  const totalBudget = valueChains.reduce((sum, chain) => sum + chain.budget, 0);

  elements.selectedProjectCount.textContent = `${selectedProjects.length}개`;
  elements.selectedBudgetTotal.textContent = formatBudget(selectedBudget);
  elements.totalProjectCount.textContent = `${totalProjects.length}개`;
  elements.totalBudgetCount.textContent = formatBudget(totalBudget);
  elements.selectedValueChainTitle.textContent = selectedChain ? selectedChain.title : "전체 사업 현황";
  elements.selectedValueChainSummary.textContent = selectedChain
    ? selectedChain.summary
    : "벨류체인과 사업명을 선택하면 사업개요, 지원대상, 지원규모, 지원내용, 추진절차, 기대효과를 한눈에 확인할 수 있습니다.";
}

function renderProjectDetail() {
  const project = getSelectedProject();
  const selectedTab = project.tabs.find((tab) => tab.id === state.selectedTabId) || project.tabs[0];
  const announcementLinks = announcementLinksByProjectId[project.id] || [];

  elements.detailCard.dataset.projectId = project.id;
  elements.detailValueChain.textContent = project.parentTitle;
  elements.detailProjectTitle.textContent = project.name;
  elements.detailBudget.textContent = project.budget > 0 ? formatBudget(project.budget) : "";
  elements.detailBudget.classList.toggle("is-hidden", project.budget === 0);
  elements.detailMeta.innerHTML = `
    <span class="chip">${project.stage}</span>
    <span class="chip">${project.target}</span>
  `;

  elements.detailTabs.innerHTML = project.tabs
    .map(
      (tab) => `
        <button type="button" class="detail-tab ${tab.id === selectedTab.id ? "is-active" : ""}" data-tab-id="${tab.id}">
          ${tab.label}
        </button>
      `
    )
    .join("");

  elements.detailPanel.innerHTML = `
    <h4>${selectedTab.label}</h4>
    <ul class="detail-points">
      ${selectedTab.content.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;

  elements.announcementLinks.innerHTML = announcementLinks.length
    ? announcementLinks
        .map(
          (link) => `
            <a class="announcement-link" href="${link.href}" target="_blank" rel="noreferrer">
              <strong>${link.label}</strong>
              <span>${link.description}</span>
            </a>
          `
        )
        .join("")
    : `
        <div class="announcement-empty">
          현재 확인된 사업소개 또는 2026년 사업공고 링크가 없습니다.
        </div>
      `;

  [...elements.detailTabs.querySelectorAll("[data-tab-id]")].forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTabId = button.dataset.tabId;
      renderProjectDetail();
    });
  });
}

function ensureSelection() {
  const visibleProjects = getVisibleProjects();
  if (!state.selectedProjectId || !visibleProjects.some((project) => project.id === state.selectedProjectId)) {
    state.selectedProjectId = visibleProjects[0]?.id || getAllProjects()[0]?.id || null;
    state.selectedTabId = "overview";
  }
}

function render() {
  if (elements.pageShell) {
    elements.pageShell.dataset.mode = state.showStructureIntro ? "structure" : "dashboard";
  }
  if (state.showStructureIntro) {
    renderStructureDiagram();
    return;
  }
  ensureSelection();
  renderValueChains();
  renderProjects();
  renderSummary();
  renderProjectDetail();
}

elements.showAllButton.addEventListener("click", () => {
  state.selectedValueChainId = null;
  state.selectedTabId = "overview";
  render();
});

if (elements.openStructureIntroButton) {
  elements.openStructureIntroButton.addEventListener("click", () => {
    state.showStructureIntro = true;
    render();
  });
}

render();
