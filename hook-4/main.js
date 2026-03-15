const yearNodes = document.querySelectorAll("[data-year]");
const updatedNodes = document.querySelectorAll("[data-last-updated]");
const navNodes = document.querySelectorAll("[data-page]");
const siteData = window.AURCADE_DATA || {};

const groupState = new Map();
const sideCharacterAssets = {
  mazegrid: {
    src: "assets/fighters/aurcade-emblems/mazegrid.svg",
    scale: 1.03,
    name: "Maze Grid",
  },
  comboburst: {
    src: "assets/fighters/aurcade-emblems/comboburst.svg",
    scale: 1.04,
    name: "Combo Burst",
  },
  speedlane: {
    src: "assets/fighters/aurcade-emblems/speedlane.svg",
    scale: 1.03,
    name: "Speed Lane",
  },
  pinballorbit: {
    src: "assets/fighters/aurcade-emblems/pinballorbit.svg",
    scale: 1.04,
    name: "Pinball Orbit",
  },
  cabinetcore: {
    src: "assets/fighters/aurcade-emblems/cabinetcore.svg",
    scale: 1.03,
    name: "Cabinet Core",
  },
  mapradar: {
    src: "assets/fighters/aurcade-emblems/mapradar.svg",
    scale: 1.03,
    name: "Map Radar",
  },
  wrcrown: {
    src: "assets/fighters/aurcade-emblems/wrcrown.svg",
    scale: 1.04,
    name: "WR Crown",
  },
  bracketgrid: {
    src: "assets/fighters/aurcade-emblems/bracketgrid.svg",
    scale: 1.03,
    name: "Bracket Grid",
  },
  tokenspark: {
    src: "assets/fighters/aurcade-emblems/tokenspark.svg",
    scale: 1.03,
    name: "Token Spark",
  },
  leaderpulse: {
    src: "assets/fighters/aurcade-emblems/leaderpulse.svg",
    scale: 1.03,
    name: "Leader Pulse",
  },
  eventbeacon: {
    src: "assets/fighters/aurcade-emblems/eventbeacon.svg",
    scale: 1.03,
    name: "Event Beacon",
  },
  neondojo: {
    src: "assets/fighters/aurcade-emblems/neondojo.svg",
    scale: 1.05,
    name: "Neon Dojo",
  },
};

const sideCharacterWheels = {
  left: ["mazegrid", "comboburst", "speedlane", "pinballorbit", "cabinetcore", "mapradar"],
  right: ["wrcrown", "bracketgrid", "tokenspark", "leaderpulse", "eventbeacon", "neondojo"],
};

const sideCharacterJapanese = {
  mazegrid: "\u30e1\u30a4\u30ba\u30b0\u30ea\u30c3\u30c9",
  comboburst: "\u30b3\u30f3\u30dc\u30d0\u30fc\u30b9\u30c8",
  speedlane: "\u30b9\u30d4\u30fc\u30c9\u30ec\u30fc\u30f3",
  pinballorbit: "\u30d4\u30f3\u30dc\u30fc\u30eb\u30aa\u30fc\u30d3\u30c3\u30c8",
  cabinetcore: "\u30ad\u30e3\u30d3\u30cd\u30c3\u30c8\u30b3\u30a2",
  mapradar: "\u30de\u30c3\u30d7\u30ec\u30fc\u30c0\u30fc",
  wrcrown: "\u30ef\u30fc\u30eb\u30c9\u30ec\u30b3\u30fc\u30c9\u30af\u30e9\u30a6\u30f3",
  bracketgrid: "\u30d6\u30e9\u30b1\u30c3\u30c8\u30b0\u30ea\u30c3\u30c9",
  tokenspark: "\u30c8\u30fc\u30af\u30f3\u30b9\u30d1\u30fc\u30af",
  leaderpulse: "\u30ea\u30fc\u30c0\u30fc\u30d1\u30eb\u30b9",
  eventbeacon: "\u30a4\u30d9\u30f3\u30c8\u30d3\u30fc\u30b3\u30f3",
  neondojo: "\u30cd\u30aa\u30f3\u30c9\u30fc\u30b8\u30e7\u30fc",
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
      queries: {},
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
    const activeQueries = Object.values(state.queries || {}).filter((value) => value && value !== "");
    const passesQuery = activeQueries.every((query) => searchText.includes(query));
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
    const queryKey = input.dataset.searchKey || input.id || "q";
    state.queries[queryKey] = (input.value || "").trim().toLowerCase();

    input.addEventListener("input", () => {
      state.queries[queryKey] = (input.value || "").trim().toLowerCase();
      applyFilters(groupName);
    });
  });

  const globalQuery = (new URLSearchParams(window.location.search).get("q") || "").trim();
  if (globalQuery !== "") {
    const page = getCurrentPage();
    const prefillTarget =
      page === "venues.html" ? document.getElementById("loc-name") : document.getElementById("name");

    if (prefillTarget instanceof HTMLInputElement && prefillTarget.value.trim() === "") {
      prefillTarget.value = globalQuery;
      const groupName = prefillTarget.dataset.searchGroup || "";
      if (groupName !== "") {
        const state = getState(groupName);
        const queryKey = prefillTarget.dataset.searchKey || prefillTarget.id || "q";
        state.queries[queryKey] = globalQuery.toLowerCase();
      }
    }
  }

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

function initializeAuthRow() {
  const utilityStrip = document.querySelector(".utility-strip");
  if (!(utilityStrip instanceof HTMLElement)) {
    return;
  }

  if (utilityStrip.querySelector(".auth-row")) {
    return;
  }

  const row = document.createElement("p");
  row.className = "auth-row";
  row.innerHTML = [
    'Not Logged In - ',
    '<a href="https://www.aurcade.com/members/default.aspx" target="_blank" rel="noreferrer">Login Now</a>',
    " or ",
    '<a href="https://www.aurcade.com/members/default.aspx" target="_blank" rel="noreferrer">Create Account</a>',
  ].join("");
  utilityStrip.prepend(row);
}

function initializeGlobalSearch() {
  const utilityStrip = document.querySelector(".utility-strip");
  if (!(utilityStrip instanceof HTMLElement)) {
    return;
  }

  const existing = utilityStrip.querySelector(".global-search");
  if (existing) {
    return;
  }

  const searchForm = document.createElement("form");
  searchForm.className = "global-search";
  searchForm.method = "get";
  searchForm.action = "./games.html";
  searchForm.innerHTML = [
    '<label for="global-search-input">Search</label>',
    '<input id="global-search-input" name="q" type="search" autocomplete="off" placeholder="Game, location, event, forum..." />',
    '<button type="submit">Go</button>',
  ].join("");
  utilityStrip.appendChild(searchForm);

  const params = new URLSearchParams(window.location.search);
  const incomingQuery = (params.get("q") || "").trim();
  const input = searchForm.querySelector("input");
  if (input instanceof HTMLInputElement && incomingQuery !== "") {
    input.value = incomingQuery;
  }

  const gameText = Object.values(siteData.games || {})
    .map((game) => `${game.name || ""} ${game.maker || ""} ${game.genre || ""}`.toLowerCase())
    .join(" ");
  const locationText = (siteData.locations || [])
    .map((location) => `${location.name || ""} ${location.city || ""} ${location.state || ""}`.toLowerCase())
    .join(" ");
  const eventText = (siteData.events || [])
    .map((eventEntry) => `${eventEntry.title || ""} ${eventEntry.location || ""} ${eventEntry.game || ""}`.toLowerCase())
    .join(" ");
  const forumText = (siteData.forums || [])
    .map((topic) => `${topic.title || ""} ${topic.section || ""}`.toLowerCase())
    .join(" ");

  searchForm.addEventListener("submit", (event) => {
    const formInput = searchForm.querySelector('input[name="q"]');
    if (!(formInput instanceof HTMLInputElement)) {
      return;
    }
    const query = formInput.value.trim().toLowerCase();
    if (query === "") {
      return;
    }

    let target = "./games.html";
    if (locationText.includes(query)) {
      target = "./venues.html";
    } else if (eventText.includes(query)) {
      target = "./events.html";
    } else if (forumText.includes(query)) {
      target = "./community.html";
    } else if (gameText.includes(query)) {
      target = "./games.html";
    }

    searchForm.action = target;
  });
}

function initializeMobileNav() {
  const nav = document.querySelector(".main-nav");
  if (!(nav instanceof HTMLElement)) {
    return;
  }

  if (nav.querySelector(".nav-toggle")) {
    return;
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Toggle navigation");
  toggle.textContent = "Menu";
  nav.prepend(toggle);

  const media = window.matchMedia("(max-width: 731px)");

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  }

  function syncLayout() {
    if (media.matches) {
      nav.classList.add("is-collapsed");
    } else {
      nav.classList.remove("is-collapsed");
      closeMenu();
    }
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.textContent = isOpen ? "Close" : "Menu";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (media.matches) {
        closeMenu();
      }
    });
  });

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", syncLayout);
  } else if (typeof media.addListener === "function") {
    media.addListener(syncLayout);
  }

  syncLayout();
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

  const fallbackGameDb = {
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
  const gameDb = Object.keys(siteData.games || {}).length > 0 ? siteData.games : fallbackGameDb;

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
    const gameId = link.dataset.gameLink || "";
    if (gameDb[gameId]) {
      link.setAttribute("href", `#game-${gameId}`);
    }

    link.addEventListener("click", () => {
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

  window.addEventListener("hashchange", () => {
    const hashGame = (window.location.hash || "").replace("#game-", "");
    if (gameDb[hashGame]) {
      renderGame(hashGame);
    }
  });
}

function initializeSideCharacters() {
  if (window.matchMedia("(max-width: 1260px)").matches) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const leftRoster = [...new Set(sideCharacterWheels.left)].filter((key) => sideCharacterAssets[key]);
  const rightRoster = [...new Set(sideCharacterWheels.right)].filter((key) => sideCharacterAssets[key]);
  if (leftRoster.length === 0 || rightRoster.length === 0) {
    return;
  }

  const hud = document.createElement("div");
  hud.className = "selector-hud";
  hud.innerHTML = [
    '<aside class="selector-wheel wheel-left" data-wheel="left" aria-label="Left character wheel">',
    '  <div class="wheel-row">',
    '    <div class="selector-card" data-wheel-card="left">',
    '      <img class="silhouette" alt="" />',
    '      <img class="sprite" alt="" />',
    '      <span class="name-ring name-ring-front" aria-hidden="true">',
    '        <span class="name-ring-track"><span class="name-ring-text" data-wheel-ring-front="left"></span><span class="name-ring-text" data-wheel-ring-front-clone="left"></span></span>',
    "      </span>",
    '      <span class="holo-layer" aria-hidden="true"></span>',
    '    </div>',
    '  </div>',
    '</aside>',
    '<aside class="selector-wheel wheel-right" data-wheel="right" aria-label="Right character wheel">',
    '  <div class="wheel-row">',
    '    <div class="selector-card" data-wheel-card="right">',
    '      <img class="silhouette" alt="" />',
    '      <img class="sprite" alt="" />',
    '      <span class="name-ring name-ring-front" aria-hidden="true">',
    '        <span class="name-ring-track"><span class="name-ring-text" data-wheel-ring-front="right"></span><span class="name-ring-text" data-wheel-ring-front-clone="right"></span></span>',
    "      </span>",
    '      <span class="holo-layer" aria-hidden="true"></span>',
    '    </div>',
    '  </div>',
    '</aside>',
  ].join("");
  document.body.appendChild(hud);

  const wheelNodes = {
    left: hud.querySelector('[data-wheel="left"]'),
    right: hud.querySelector('[data-wheel="right"]'),
  };

  const wheelSlots = {
    left: {
      card: hud.querySelector('[data-wheel-card="left"]'),
      sprite: hud.querySelector('[data-wheel-card="left"] .sprite'),
      silhouette: hud.querySelector('[data-wheel-card="left"] .silhouette'),
      ringFront: hud.querySelector('[data-wheel-ring-front="left"]'),
      ringFrontClone: hud.querySelector('[data-wheel-ring-front-clone="left"]'),
      holo: hud.querySelector('[data-wheel-card="left"] .holo-layer'),
    },
    right: {
      card: hud.querySelector('[data-wheel-card="right"]'),
      sprite: hud.querySelector('[data-wheel-card="right"] .sprite'),
      silhouette: hud.querySelector('[data-wheel-card="right"] .silhouette'),
      ringFront: hud.querySelector('[data-wheel-ring-front="right"]'),
      ringFrontClone: hud.querySelector('[data-wheel-ring-front-clone="right"]'),
      holo: hud.querySelector('[data-wheel-card="right"] .holo-layer'),
    },
  };

  if (
    !(wheelNodes.left instanceof HTMLElement) ||
    !(wheelNodes.right instanceof HTMLElement) ||
    !(wheelSlots.left.card instanceof HTMLElement) ||
    !(wheelSlots.right.card instanceof HTMLElement) ||
    !(wheelSlots.left.sprite instanceof HTMLImageElement) ||
    !(wheelSlots.left.silhouette instanceof HTMLImageElement) ||
    !(wheelSlots.right.sprite instanceof HTMLImageElement) ||
    !(wheelSlots.right.silhouette instanceof HTMLImageElement) ||
    !(wheelSlots.left.ringFront instanceof Element) ||
    !(wheelSlots.left.ringFrontClone instanceof Element) ||
    !(wheelSlots.right.ringFront instanceof Element) ||
    !(wheelSlots.right.ringFrontClone instanceof Element) ||
    !(wheelSlots.left.holo instanceof HTMLElement) ||
    !(wheelSlots.right.holo instanceof HTMLElement)
  ) {
    hud.remove();
    return;
  }

  function preloadUrl(url) {
    if (!url) {
      return;
    }
    const image = new Image();
    image.decoding = "async";
    image.src = url;
  }

  Object.values(sideCharacterAssets).forEach((asset) => preloadUrl(asset?.src));
  const state = {
    left: 0,
    right: 0,
  };

  function normalizeIndex(index, length) {
    return ((index % length) + length) % length;
  }

  function pulseCard(node) {
    if (reduceMotion) {
      return;
    }
    node.classList.remove("is-entering");
    void node.offsetWidth;
    node.classList.add("is-entering");
    window.setTimeout(() => {
      node.classList.remove("is-entering");
    }, 360);
  }

  function renderCharacter(side, index) {
    const roster = side === "left" ? leftRoster : rightRoster;
    const slot = wheelSlots[side];
    if (!slot || roster.length === 0) {
      return;
    }

    const normalized = normalizeIndex(index, roster.length);
    state[side] = normalized;
    const characterKey = roster[normalized];
    const asset = sideCharacterAssets[characterKey];
    if (!asset) {
      return;
    }

    slot.sprite.src = asset.src;
    slot.sprite.alt = asset.name || characterKey;
    slot.silhouette.src = asset.src;
    slot.silhouette.alt = "";
    slot.card.style.setProperty("--fighter-scale", String((asset.scale || 1) * 1.04));
    slot.card.style.setProperty("--fighter-image", `url("${asset.src}")`);
    const ringLabelEn = (asset.name || characterKey).toUpperCase();
    const ringLabelJp = sideCharacterJapanese[characterKey] || ringLabelEn;
    const ringText = ` ${ringLabelEn}  *  ${ringLabelJp}  *  ${ringLabelEn}  *  ${ringLabelJp}  *  ${ringLabelEn}  *  ${ringLabelJp}  *  ${ringLabelEn}  *  ${ringLabelJp}  * `;
    slot.ringFront.textContent = ringText;
    slot.ringFrontClone.textContent = ringText;
    const ringSpeed = `${18 + Math.floor(Math.random() * 7)}s`;
    const ringDelay = `-${Math.floor(Math.random() * 6)}s`;
    slot.card.style.setProperty("--ring-speed", ringSpeed);
    slot.card.style.setProperty("--ring-delay", ringDelay);
    pulseCard(slot.card);
  }

  function transitionCharacter(side, index) {
    const slot = wheelSlots[side];
    if (!slot || reduceMotion) {
      renderCharacter(side, index);
      return;
    }

    slot.ringFront.textContent = "";
    slot.ringFrontClone.textContent = "";
    slot.card.classList.add("is-fading");
    window.setTimeout(() => {
      renderCharacter(side, index);
      slot.card.classList.remove("is-fading");
    }, 320);
  }

  function stepCharacter(side, direction) {
    transitionCharacter(side, state[side] + direction);
  }

  function randomNextIndex(rosterLength, currentIndex) {
    if (rosterLength <= 1) {
      return currentIndex;
    }
    let next = currentIndex;
    while (next === currentIndex) {
      next = Math.floor(Math.random() * rosterLength);
    }
    return next;
  }

  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
      return;
    }
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepCharacter("left", -1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      stepCharacter("right", 1);
    }
  });

  const initialLeft = Math.floor(Math.random() * leftRoster.length);
  let initialRight = Math.floor(Math.random() * rightRoster.length);
  if (leftRoster.length > 0 && rightRoster.length > 0) {
    let guard = 0;
    while (rightRoster[initialRight] === leftRoster[initialLeft] && guard < 24) {
      initialRight = Math.floor(Math.random() * rightRoster.length);
      guard += 1;
    }
  }

  renderCharacter("left", initialLeft);
  renderCharacter("right", initialRight);

  if (!reduceMotion) {
    const randomWheelLoopMs = 5600;
    window.setInterval(() => {
      const side = Math.random() < 0.5 ? "left" : "right";
      const rosterLength = side === "left" ? leftRoster.length : rightRoster.length;
      const next = randomNextIndex(rosterLength, state[side]);
      transitionCharacter(side, next);
    }, randomWheelLoopMs);
  }
}

initializeHeader();
initializeAuthRow();
initializeGlobalSearch();
initializeMobileNav();
initializeGroups();
initializeVotes();
initializeContentViews();
initializeGameProfiles();
initializeSideCharacters();


