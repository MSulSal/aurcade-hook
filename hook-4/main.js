const yearNodes = document.querySelectorAll("[data-year]");
const updatedNodes = document.querySelectorAll("[data-last-updated]");
const navNodes = document.querySelectorAll("[data-page]");

const groupState = new Map();
const sideCharacterAssets = {
  ryu: {
    src: "./assets/fighters/ryu3.gif",
    scale: 1.12,
    name: "Ryu",
  },
  chunli: {
    src: "./assets/fighters/chun3.gif",
    scale: 1.16,
    name: "Chun-Li",
  },
  alex: {
    src: "./assets/fighters/alex.gif",
    scale: 1.15,
    name: "Alex",
  },
  dudley: {
    src: "./assets/fighters/dudley.gif",
    scale: 1.14,
    name: "Dudley",
  },
  pacman: {
    src: "https://www.aurcade.com/icons/iconPacman.gif",
    scale: 1.05,
    name: "Pac-Man",
  },
  blinky: {
    src: "https://www.aurcade.com/icons/iconGhost2.gif",
    scale: 1.05,
    name: "Blinky",
  },
  pinky: {
    src: "https://www.aurcade.com/icons/iconGhost3.gif",
    scale: 1.05,
    name: "Pinky",
  },
  inky: {
    src: "https://www.aurcade.com/icons/iconGhost1.gif",
    scale: 1.05,
    name: "Inky",
  },
  sue: {
    src: "https://www.aurcade.com/icons/iconGhost4.gif",
    scale: 1.05,
    name: "Sue",
  },
};

const sideCharacterRosters = {
  "index.html": ["ryu", "chunli", "alex", "pacman"],
  "leaderboards.html": ["dudley", "ryu", "chunli", "alex"],
  "games.html": ["ryu", "chunli", "alex", "dudley"],
  "venues.html": ["alex", "chunli", "ryu", "dudley"],
  "events.html": ["alex", "chunli", "dudley", "ryu"],
  "community.html": ["dudley", "chunli", "ryu", "alex"],
  "resources.html": ["ryu", "alex", "chunli", "dudley"],
};

const sideSceneBudget = {
  "index.html": 3,
  "leaderboards.html": 2,
  "games.html": 4,
  "venues.html": 2,
  "events.html": 2,
  "community.html": 2,
  "resources.html": 2,
};

function pad(value) {
  return value.toString().padStart(2, "0");
}

function getCurrentPage() {
  const raw = window.location.pathname.split("/").pop();
  if (!raw || raw.trim() === "") {
    return "index.html";
  }
  return raw;
}

function normalizeTags(value) {
  return (value || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function getGroupConfig(groupName) {
  const button = document.querySelector(`[data-filter-group="${groupName}"]`);
  const search = document.querySelector(`[data-search-group="${groupName}"]`);

  const targetSelector = button?.dataset.filterTarget || search?.dataset.searchTarget;
  if (!targetSelector) {
    return null;
  }

  return {
    buttons: document.querySelectorAll(`[data-filter-group="${groupName}"]`),
    searchInputs: document.querySelectorAll(`[data-search-group="${groupName}"]`),
    countNodes: document.querySelectorAll(`[data-filter-count="${groupName}"]`),
    targetSelector,
  };
}

function getState(groupName) {
  if (!groupState.has(groupName)) {
    groupState.set(groupName, {
      filter: "all",
      query: "",
    });
  }
  return groupState.get(groupName);
}

function applyFilters(groupName) {
  const config = getGroupConfig(groupName);
  if (!config) {
    return;
  }

  const state = getState(groupName);
  const items = document.querySelectorAll(config.targetSelector);
  let visibleCount = 0;

  items.forEach((item) => {
    const tags = normalizeTags(item.dataset.tags);
    const searchText = (item.dataset.searchText || item.textContent || "").toLowerCase();

    const passesFilter = state.filter === "all" || tags.includes(state.filter);
    const passesQuery = state.query === "" || searchText.includes(state.query);
    const visible = passesFilter && passesQuery;

    item.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  config.countNodes.forEach((node) => {
    node.textContent = String(visibleCount);
  });

  config.buttons.forEach((button) => {
    const isActive = (button.dataset.filterValue || "all").toLowerCase() === state.filter;
    button.classList.toggle("active", isActive);
  });
}

function initializeGroups() {
  const groups = new Set();

  document.querySelectorAll("[data-filter-group]").forEach((button) => {
    const groupName = button.dataset.filterGroup;
    if (!groupName) {
      return;
    }
    groups.add(groupName);
    const state = getState(groupName);
    if (button.classList.contains("active")) {
      state.filter = (button.dataset.filterValue || "all").toLowerCase();
    }

    button.addEventListener("click", () => {
      state.filter = (button.dataset.filterValue || "all").toLowerCase();
      applyFilters(groupName);
    });
  });

  document.querySelectorAll("[data-search-group]").forEach((input) => {
    const groupName = input.dataset.searchGroup;
    if (!groupName) {
      return;
    }
    groups.add(groupName);
    const state = getState(groupName);
    state.query = (input.value || "").trim().toLowerCase();

    input.addEventListener("input", () => {
      state.query = (input.value || "").trim().toLowerCase();
      applyFilters(groupName);
    });
  });

  groups.forEach((groupName) => {
    const state = getState(groupName);
    if (!state.filter || state.filter === "") {
      state.filter = "all";
    }
    applyFilters(groupName);
  });
}

function initializeVotes() {
  document.querySelectorAll("[data-vote-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.voteTarget;
      if (!targetId) {
        return;
      }
      const counter = document.getElementById(targetId);
      if (!counter) {
        return;
      }

      const current = Number(counter.textContent) || 0;
      counter.textContent = String(current + 1);
      button.disabled = true;
      button.textContent = "VOTED";
    });
  });
}

function initializeHeader() {
  const now = new Date();
  const stamp = `${now.toLocaleDateString()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  yearNodes.forEach((node) => {
    node.textContent = String(now.getFullYear());
  });

  updatedNodes.forEach((node) => {
    node.textContent = stamp;
  });

  const page = getCurrentPage();
  const pageClass = `page-${page.replace(".html", "") || "index"}`;
  document.body.classList.add(pageClass);
  navNodes.forEach((node) => {
    if (node.dataset.page === page) {
      node.classList.add("active");
    }
  });
}

function initializeContentViews() {
  const page = getCurrentPage();
  const pageKey = page.replace(".html", "") || "index";
  const forumPages = new Set(["events.html", "community.html"]);
  const sections = document.querySelectorAll(".page-grid main .panel, .page-grid aside .panel");
  let viewSectionIndex = 0;

  sections.forEach((section) => {
    const grids = [...section.querySelectorAll(".card-grid, .game-grid")];
    if (grids.length === 0) {
      return;
    }

    if (forumPages.has(page)) {
      grids.forEach((grid) => {
        grid.classList.add("is-list-view");
      });
      return;
    }

    const switchNode = document.createElement("div");
    switchNode.className = "view-switch";
    switchNode.innerHTML = [
      '<button type="button" data-view="grid" class="is-active">Grid</button>',
      '<button type="button" data-view="list">List</button>',
    ].join("");

    const insertAfter = section.querySelector(".section-head") || section.querySelector("h2");
    if (insertAfter) {
      insertAfter.insertAdjacentElement("afterend", switchNode);
    } else {
      section.prepend(switchNode);
    }

    const storageKey = `aurcade-view-${pageKey}-${viewSectionIndex}`;
    viewSectionIndex += 1;

    let mode = "grid";
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "list" || saved === "grid") {
        mode = saved;
      }
    } catch {
      mode = "grid";
    }

    function applyMode(nextMode) {
      const listMode = nextMode === "list";
      grids.forEach((grid) => {
        grid.classList.toggle("is-list-view", listMode);
      });
      switchNode.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("is-active", (button.dataset.view || "grid") === nextMode);
      });
    }

    applyMode(mode);

    switchNode.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const nextMode = (button.dataset.view || "grid") === "list" ? "list" : "grid";
        applyMode(nextMode);
        try {
          window.localStorage.setItem(storageKey, nextMode);
        } catch {
          // no-op when storage is unavailable
        }
      });
    });
  });
}

function initializeGameProfiles() {
  if (getCurrentPage() !== "games.html") {
    return;
  }

  const gameDb = {
    class1981: {
      name: "MS. PAC-MAN / GALAGA CLASS OF 1981",
      maker: "Namco",
      year: "1981",
      type: "Arcade",
      locations: "323",
      image: "https://www.aurcade.com/games/screens/00000496m.jpg",
      scores: [
        { score: "2,946,700", player: "Andrew Iwaszko", date: "03/12/2026" },
        { score: "1,000,000", player: "Matty Thomas", date: "03/10/2026" },
        { score: "960,440", player: "Craig Roach", date: "03/07/2026" },
      ],
      venues: [
        { name: "Ground Kontrol", type: "Arcade", location: "Portland, OR" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Brookfield, IL" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Chicago, IL" },
      ],
    },
    mspacman: {
      name: "MS. PAC-MAN",
      maker: "Bally Midway",
      year: "1981",
      type: "Arcade",
      locations: "293",
      image: "https://www.aurcade.com/games/screens/00000011m.jpg",
      scores: [
        { score: "1,290,022", player: "GBU", date: "03/11/2026" },
        { score: "819,188", player: "RAF", date: "03/09/2026" },
        { score: "700,000", player: "BUL", date: "03/05/2026" },
      ],
      venues: [
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Brookfield, IL" },
        { name: "Ground Kontrol", type: "Arcade", location: "Portland, OR" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Chicago, IL" },
      ],
    },
    galaga: {
      name: "GALAGA",
      maker: "Namco",
      year: "1981",
      type: "Arcade",
      locations: "291",
      image: "https://www.aurcade.com/games/screens/00000012m.jpg",
      scores: [
        { score: "156,934", player: "KEV", date: "03/12/2026" },
        { score: "150,996", player: "ASS", date: "03/10/2026" },
        { score: "129,022", player: "GBU", date: "03/08/2026" },
      ],
      venues: [
        { name: "Ground Kontrol", type: "Arcade", location: "Portland, OR" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Brookfield, IL" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Chicago, IL" },
      ],
    },
    pacman: {
      name: "PAC-MAN",
      maker: "Namco",
      year: "1980",
      type: "Arcade",
      locations: "245",
      image: "https://www.aurcade.com/games/screens/00000011m.jpg",
      scores: [
        { score: "900,000", player: "GUN", date: "03/11/2026" },
        { score: "700,000", player: "BUL", date: "03/08/2026" },
        { score: "600,000", player: "LET", date: "03/03/2026" },
      ],
      venues: [
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Brookfield, IL" },
        { name: "Ground Kontrol", type: "Arcade", location: "Portland, OR" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Chicago, IL" },
      ],
    },
    donkeykong: {
      name: "DONKEY KONG",
      maker: "Nintendo",
      year: "1981",
      type: "Arcade",
      locations: "194",
      image: "https://www.aurcade.com/games/screens/00000009m.jpg",
      scores: [
        { score: "500,000", player: "NAM", date: "03/07/2026" },
        { score: "420,800", player: "RAF", date: "03/05/2026" },
        { score: "381,220", player: "LET", date: "03/04/2026" },
      ],
      venues: [
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Brookfield, IL" },
        { name: "Ground Kontrol", type: "Arcade", location: "Portland, OR" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Chicago, IL" },
      ],
    },
    sf2ww: {
      name: "STREET FIGHTER II: THE WORLD WARRIOR",
      maker: "Capcom",
      year: "1991",
      type: "Arcade",
      locations: "142",
      image: "https://www.aurcade.com/games/screens/00001227m.jpg",
      scores: [
        { score: "5,004,780", player: "Craig Roach", date: "03/12/2026" },
        { score: "4,118,660", player: "Colin C Brown", date: "03/09/2026" },
        { score: "3,992,800", player: "Matty Thomas", date: "03/06/2026" },
      ],
      venues: [
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Brookfield, IL" },
        { name: "Ground Kontrol", type: "Arcade", location: "Portland, OR" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Chicago, IL" },
      ],
    },
    sf3strike: {
      name: "STREET FIGHTER III: 3RD STRIKE",
      maker: "Capcom",
      year: "1999",
      type: "Arcade",
      locations: "93",
      image: "https://www.aurcade.com/games/screens/00000537m.jpg",
      scores: [
        { score: "2,361,900", player: "Matty Thomas", date: "03/11/2026" },
        { score: "2,045,220", player: "Andrew Iwaszko", date: "03/07/2026" },
        { score: "1,906,400", player: "Craig Roach", date: "03/03/2026" },
      ],
      venues: [
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Brookfield, IL" },
        { name: "Ground Kontrol", type: "Arcade", location: "Portland, OR" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Chicago, IL" },
      ],
    },
    kof98: {
      name: "KING OF FIGHTERS '98, THE",
      maker: "SNK",
      year: "1998",
      type: "Arcade",
      locations: "71",
      image: "https://www.aurcade.com/games/screens/00000675m.jpg",
      scores: [
        { score: "1,882,400", player: "Colin C Brown", date: "03/10/2026" },
        { score: "1,774,900", player: "Andrew Iwaszko", date: "03/08/2026" },
        { score: "1,660,240", player: "Craig Roach", date: "03/04/2026" },
      ],
      venues: [
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Brookfield, IL" },
        { name: "Ground Kontrol", type: "Arcade", location: "Portland, OR" },
        { name: "Galloping Ghost Arcade", type: "Arcade", location: "Chicago, IL" },
      ],
    },
  };

  const profileSection = document.getElementById("game-profile");
  if (!profileSection) {
    return;
  }

  const titleNode = document.querySelector("[data-game-profile-title]");
  const subtitleNode = document.querySelector("[data-game-profile-subtitle]");
  const imageNode = document.querySelector("[data-game-profile-image]");
  const makerNode = document.querySelector("[data-game-profile-maker]");
  const yearNode = document.querySelector("[data-game-profile-year]");
  const typeNode = document.querySelector("[data-game-profile-type]");
  const locationsNode = document.querySelector("[data-game-profile-locations]");
  const scoresBody = document.querySelector("[data-game-profile-scores]");
  const locationsBody = document.querySelector("[data-game-profile-locations-table]");

  if (
    !titleNode ||
    !subtitleNode ||
    !imageNode ||
    !makerNode ||
    !yearNode ||
    !typeNode ||
    !locationsNode ||
    !scoresBody ||
    !locationsBody
  ) {
    return;
  }

  function renderGame(gameId) {
    const game = gameDb[gameId];
    if (!game) {
      return;
    }

    titleNode.textContent = game.name;
    subtitleNode.textContent = "High Scores";
    imageNode.src = game.image;
    imageNode.alt = `${game.name} screenshot`;
    makerNode.textContent = game.maker;
    yearNode.textContent = game.year;
    typeNode.textContent = game.type;
    locationsNode.textContent = game.locations;

    scoresBody.innerHTML = game.scores
      .map(
        (entry) =>
          `<tr><td>${entry.score}</td><td>${entry.player}</td><td>${entry.date}</td></tr>`,
      )
      .join("");

    locationsBody.innerHTML = game.venues
      .map(
        (entry) =>
          `<tr><td>${entry.name}</td><td>${entry.type}</td><td>${entry.location}</td></tr>`,
      )
      .join("");

    document.querySelectorAll("[data-game-id]").forEach((node) => {
      node.classList.toggle("is-selected", node.dataset.gameId === gameId);
    });

    try {
      window.history.replaceState(null, "", `#game-${gameId}`);
    } catch {
      // ignore hash update failure
    }
  }

  const smoothScroll = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function openGame(gameId) {
    renderGame(gameId);
    profileSection.scrollIntoView({
      behavior: smoothScroll ? "smooth" : "auto",
      block: "start",
    });
  }

  document.querySelectorAll("[data-game-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const gameId = link.dataset.gameLink || "";
      if (!gameDb[gameId]) {
        return;
      }
      openGame(gameId);
    });
  });

  document.querySelectorAll("[data-game-id]").forEach((node) => {
    node.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("[data-game-link]")) {
        return;
      }
      const gameId = node.dataset.gameId || "";
      if (!gameDb[gameId]) {
        return;
      }
      openGame(gameId);
    });
  });

  const initialHash = (window.location.hash || "").replace("#game-", "");
  const initialGame = gameDb[initialHash] ? initialHash : "sf2ww";
  renderGame(initialGame);
}

function initializeSideCharacters() {
  if (window.matchMedia("(max-width: 1120px)").matches) {
    return;
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = getCurrentPage();
  const roster = sideCharacterRosters[page] || ["ryu", "chunli", "alex", "dudley", "pacman"];
  const sceneLimit = Math.max(
    1,
    Math.min(
      sideSceneBudget[page] || 3,
      [...document.querySelectorAll(".page-grid main .panel, .page-grid aside .panel")].length,
    ),
  );

  const panels = [...document.querySelectorAll(".page-grid main .panel, .page-grid aside .panel")]
    .map((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.height < 120) {
        return null;
      }
      return {
        node,
        rect,
        title:
          (node.querySelector("h2, h3")?.textContent || node.getAttribute("aria-label") || "")
            .trim()
            .toLowerCase(),
      };
    })
    .filter(Boolean);

  const primaryPanels = panels.filter((entry) => entry.node.closest("main"));
  const pool = primaryPanels.length >= 3 ? primaryPanels : panels;
  const selectedNodes = [];
  const selectedSet = new Set();

  for (let step = 0; step < sceneLimit; step += 1) {
    const rawIndex = Math.round(((step + 0.45) * pool.length) / sceneLimit - 1);
    const index = Math.max(0, Math.min(pool.length - 1, rawIndex));
    const candidate = pool[index];
    if (!candidate || selectedSet.has(candidate.node)) {
      continue;
    }
    selectedSet.add(candidate.node);
    selectedNodes.push(candidate);
  }

  if (selectedNodes.length === 0 && pool[0]) {
    selectedNodes.push(pool[0]);
  }

  const availableRoster = roster.filter(
    (candidate, index) => sideCharacterAssets[candidate] && roster.indexOf(candidate) === index,
  );
  if (availableRoster.length === 0) {
    return;
  }
  let rosterCursor = 0;
  let previousFighter = "";
  const usedFighters = new Set();

  function hasUniqueCapacity() {
    return usedFighters.size < availableRoster.length;
  }

  function commitFighter(candidate) {
    previousFighter = candidate;
    usedFighters.add(candidate);
    return candidate;
  }

  function pickFallbackFighter() {
    for (let pass = 0; pass < availableRoster.length; pass += 1) {
      const candidate = availableRoster[(rosterCursor + pass) % availableRoster.length];
      if (hasUniqueCapacity() && usedFighters.has(candidate)) {
        continue;
      }
      if (candidate === previousFighter && availableRoster.length > 1) {
        continue;
      }
      rosterCursor = (rosterCursor + pass + 1) % availableRoster.length;
      return commitFighter(candidate);
    }

    for (let pass = 0; pass < availableRoster.length; pass += 1) {
      const candidate = availableRoster[(rosterCursor + pass) % availableRoster.length];
      if (candidate === previousFighter && availableRoster.length > 1) {
        continue;
      }
      rosterCursor = (rosterCursor + pass + 1) % availableRoster.length;
      return commitFighter(candidate);
    }

    return commitFighter(availableRoster[0]);
  }

  function pickByTitle(title) {
    const weightedCandidates = [];
    if (/(game|profile|fighter|screens|browse games)/.test(title)) {
      weightedCandidates.push("ryu", "chunli", "alex", "dudley");
    }
    if (/(score|record|leader|rank|high score|newest)/.test(title)) {
      weightedCandidates.push("dudley", "ryu", "alex", "pacman");
    }
    if (/(event|tournament|calendar|bracket|ladder)/.test(title)) {
      weightedCandidates.push("alex", "chunli", "dudley", "ryu");
    }
    if (/(forum|community|discussion|posts|news)/.test(title)) {
      weightedCandidates.push("dudley", "chunli", "ryu", "alex");
    }
    if (/(location|venue|city|state|gallery|map)/.test(title)) {
      weightedCandidates.push("alex", "chunli", "ryu", "dudley");
    }
    if (/(about|resource|project|system|collection)/.test(title)) {
      weightedCandidates.push("ryu", "alex", "chunli", "dudley");
    }
    if (/(pac-?man|galaga|maze|ghost)/.test(title)) {
      weightedCandidates.push("pacman", "blinky", "inky");
    }

    for (const candidate of weightedCandidates) {
      if (!sideCharacterAssets[candidate]) {
        continue;
      }
      if (!availableRoster.includes(candidate)) {
        continue;
      }
      if (hasUniqueCapacity() && usedFighters.has(candidate)) {
        continue;
      }
      if (candidate === previousFighter && availableRoster.length > 1) {
        continue;
      }
      return commitFighter(candidate);
    }

    return pickFallbackFighter();
  }

  const resolvedScenes = selectedNodes
    .map((entry, index) => {
      const explicit = (entry.node.dataset.sceneFighter || "").toLowerCase();
      let fighter = "";

      if (page === "games.html" && sideCharacterAssets[explicit]) {
        fighter = explicit;
        if (hasUniqueCapacity() && usedFighters.has(fighter)) {
          fighter = pickFallbackFighter();
        } else {
          commitFighter(fighter);
        }
      } else {
        fighter = pickByTitle(entry.title || `scene-${index + 1}`);
      }

      const asset = sideCharacterAssets[fighter];
      if (!asset) {
        return null;
      }

      return {
        node: entry.node,
        fighter,
        fighterName: asset.name || fighter,
        emphasis: entry.node.closest(".hero-grid") ? 1.07 : 1,
      };
    })
    .filter(Boolean);

  if (resolvedScenes.length === 0) {
    return;
  }

  const popupLayer = document.createElement("div");
  popupLayer.className = "side-popups";
  popupLayer.innerHTML = [
    '<div class="side-character side-left slot-a" aria-hidden="true">',
    '  <img alt="" />',
    "</div>",
    '<div class="side-character side-right slot-b" aria-hidden="true">',
    '  <img alt="" />',
    "</div>",
  ].join("");
  document.body.appendChild(popupLayer);

  const characterNodes = [...popupLayer.querySelectorAll(".side-character")];
  if (characterNodes.length === 0) {
    return;
  }
  characterNodes.forEach((node) => {
    const image = node.querySelector("img");
    if (image) {
      image.decoding = "async";
    }
  });

  Object.values(sideCharacterAssets).forEach((asset) => {
    if (!asset || !asset.src) {
      return;
    }
    const preloadImage = new Image();
    preloadImage.decoding = "async";
    preloadImage.src = asset.src;
  });

  let activeSceneIndex = -1;
  let activeSlotIndex = -1;
  let hasUserScrolled = false;
  const initialScrollY = window.scrollY || window.pageYOffset || 0;
  const introThreshold = 72;
  const sceneSwitchDelay = reduceMotion ? 0 : 220;
  let lastSceneSwitchAt = 0;
  let queuedSceneIndex = -1;
  let queueTimer = null;
  let rafHandle = null;
  let transitionToken = 0;

  function updateCharacterEconomy() {
    const shellNode = document.querySelector(".site-shell");
    const shellWidth = shellNode?.getBoundingClientRect().width || window.innerWidth;
    const gutter = Math.max(0, (window.innerWidth - shellWidth) / 2);

    const compact = gutter < 120;
    const roomy = gutter > 210;
    const sizeFactor = roomy ? 1 : compact ? 0.8 : 0.9;
    const visibleShift = roomy ? 11 : compact ? 2 : 7;
    const alpha = roomy ? 0.97 : compact ? 0.78 : 0.88;

    popupLayer.style.setProperty("--side-size-factor", String(sizeFactor));
    popupLayer.style.setProperty("--side-visible-shift", `${visibleShift}%`);
    popupLayer.style.setProperty("--side-alpha", alpha.toFixed(2));
  }

  function enterCharacter(node) {
    node.classList.remove("is-entering");
    // Triggering layout reflow ensures the class animation restarts on each scene change.
    void node.offsetWidth;
    node.classList.add("is-entering");
    window.setTimeout(() => {
      node.classList.remove("is-entering");
    }, 460);
  }

  function hideCharacters() {
    characterNodes.forEach((node) => {
      node.classList.remove("is-visible", "is-bobbing", "is-entering", "is-exiting");
      node.style.zIndex = "0";
      delete node.dataset.transitionToken;
    });
    activeSceneIndex = -1;
    activeSlotIndex = -1;
    queuedSceneIndex = -1;
    if (queueTimer) {
      window.clearTimeout(queueTimer);
      queueTimer = null;
    }
  }

  function setScene(index) {
    if (index === activeSceneIndex) {
      return;
    }

    const scene = resolvedScenes[index] || resolvedScenes[0];
    if (!scene) {
      return;
    }

    const asset = sideCharacterAssets[scene.fighter];
    if (!asset) {
      return;
    }

    const now = window.performance?.now ? window.performance.now() : Date.now();
    if (sceneSwitchDelay > 0 && activeSceneIndex >= 0 && now - lastSceneSwitchAt < sceneSwitchDelay) {
      queuedSceneIndex = index;
      if (!queueTimer) {
        const delay = Math.max(16, sceneSwitchDelay - (now - lastSceneSwitchAt));
        queueTimer = window.setTimeout(() => {
          queueTimer = null;
          const next = queuedSceneIndex;
          queuedSceneIndex = -1;
          if (next >= 0) {
            setScene(next);
          }
        }, delay);
      }
      return;
    }

    const nextSlotIndex = activeSlotIndex < 0 ? 0 : (activeSlotIndex + 1) % characterNodes.length;
    const nextSlot = characterNodes[nextSlotIndex];
    const nextImage = nextSlot?.querySelector("img");
    if (!nextSlot || !nextImage) {
      return;
    }

    const previousSlot = activeSlotIndex >= 0 ? characterNodes[activeSlotIndex] : null;
    const token = String(++transitionToken);

    if (previousSlot) {
      previousSlot.dataset.transitionToken = token;
      previousSlot.classList.remove("is-bobbing", "is-entering");
      previousSlot.classList.add("is-exiting");
      previousSlot.style.zIndex = "1";
      window.setTimeout(() => {
        if (previousSlot.dataset.transitionToken !== token) {
          return;
        }
        previousSlot.classList.remove("is-visible", "is-exiting");
        previousSlot.style.zIndex = "0";
      }, 460);
    }

    nextSlot.dataset.transitionToken = token;
    nextImage.src = asset.src;
    nextImage.alt = scene.fighterName || asset.name || scene.fighter;
    nextImage.style.setProperty("--fighter-scale", String((asset.scale || 1.2) * (scene.emphasis || 1)));
    nextSlot.classList.remove("side-left", "side-right", "is-exiting", "is-visible", "is-bobbing");
    nextSlot.classList.add(index % 2 === 0 ? "side-left" : "side-right");
    enterCharacter(nextSlot);
    nextSlot.classList.add("is-visible");
    nextSlot.classList.toggle("is-bobbing", !reduceMotion);
    nextSlot.style.zIndex = "2";

    activeSlotIndex = nextSlotIndex;
    activeSceneIndex = index;
    lastSceneSwitchAt = window.performance?.now ? window.performance.now() : Date.now();
  }

  function pickBestSceneIndex() {
    let selectedIndex = -1;
    let highestRatio = 0;
    visibility.forEach((ratio, index) => {
      if (ratio > highestRatio) {
        highestRatio = ratio;
        selectedIndex = index;
      }
    });

    if (selectedIndex >= 0) {
      return selectedIndex;
    }

    let fallbackIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    const anchorY = window.innerHeight * 0.48;
    resolvedScenes.forEach((scene, index) => {
      const rect = scene.node.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = Math.abs(centerY - anchorY);
      if (distance < bestDistance) {
        bestDistance = distance;
        fallbackIndex = index;
      }
    });
    return fallbackIndex;
  }

  function updateSceneFromScrollState() {
    const currentY = window.scrollY || window.pageYOffset || 0;
    if (!hasUserScrolled && Math.abs(currentY - initialScrollY) > 24) {
      hasUserScrolled = true;
    }

    if (!hasUserScrolled || currentY <= introThreshold) {
      hideCharacters();
      return;
    }

    setScene(pickBestSceneIndex());
  }

  function scheduleSceneUpdate() {
    if (rafHandle) {
      return;
    }
    rafHandle = window.requestAnimationFrame(() => {
      rafHandle = null;
      updateSceneFromScrollState();
    });
  }

  const visibility = new Map();
  resolvedScenes.forEach((scene, index) => {
    scene.node.dataset.sceneIndex = String(index);
    visibility.set(index, 0);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.sceneIndex || "-1");
        if (Number.isNaN(index)) {
          return;
        }

        visibility.set(index, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      scheduleSceneUpdate();
    },
    {
      root: null,
      threshold: [0, 0.15, 0.35, 0.55, 0.75],
      rootMargin: "-24% 0px -40% 0px",
    },
  );

  resolvedScenes.forEach((scene) => {
    observer.observe(scene.node);
  });

  updateCharacterEconomy();
  window.addEventListener("scroll", scheduleSceneUpdate, { passive: true });
  window.addEventListener("resize", () => {
    updateCharacterEconomy();
    scheduleSceneUpdate();
  });
  updateSceneFromScrollState();
}

initializeHeader();
initializeGroups();
initializeVotes();
initializeContentViews();
initializeGameProfiles();
initializeSideCharacters();
