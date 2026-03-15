const yearNodes = document.querySelectorAll("[data-year]");
const updatedNodes = document.querySelectorAll("[data-last-updated]");
const navNodes = document.querySelectorAll("[data-page]");
const siteData = window.AURCADE_DATA || {};

const groupState = new Map();
const sideCharacterAssets = {
  class1981: {
    screen: "https://www.aurcade.com/games/screens/00000011.jpg",
    screenFallback: "https://www.aurcade.com/games/screens/00000011m.jpg",
    screenPosition: "50% 24%",
    screenScale: 1.2,
    player: "Andrew Iwaszko",
    score: "2,946,700",
    location: "Galloping Ghost Arcade",
    scale: 1.05,
    name: "MS. PAC-MAN / GALAGA CLASS OF 1981",
  },
  mspacman: {
    screen: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ms._Pac-Man_gameplay_Screenshot.png",
    screenFallback: "https://www.aurcade.com/games/screens/00000011m.jpg",
    screenPosition: "50% 50%",
    screenScale: 1.04,
    screenFit: "contain",
    player: "GBU",
    score: "1,290,022",
    location: "Galloping Ghost Arcade",
    scale: 1.05,
    name: "MS. PAC-MAN",
  },
  galaga: {
    screen: "https://www.aurcade.com/games/screens/00000012.jpg",
    screenFallback: "https://www.aurcade.com/games/screens/00000012m.jpg",
    screenPosition: "50% 12%",
    screenScale: 1.14,
    screenFit: "contain",
    player: "KEV",
    score: "156,934",
    location: "Ground Kontrol",
    scale: 1.04,
    name: "GALAGA",
  },
  pacman: {
    screen: "https://www.aurcade.com/games/screens/00000011.jpg",
    screenFallback: "https://www.aurcade.com/games/screens/00000011m.jpg",
    screenPosition: "50% 22%",
    screenScale: 1.3,
    player: "GUN",
    score: "900,000",
    location: "Galloping Ghost Arcade",
    scale: 1.04,
    name: "PAC-MAN",
  },
  donkeykong: {
    screen: "https://www.aurcade.com/games/screens/00000009.jpg",
    screenFallback: "https://www.aurcade.com/games/screens/00000009m.jpg",
    screenPosition: "50% 18%",
    screenScale: 1.4,
    player: "NAM",
    score: "500,000",
    location: "Ground Kontrol",
    scale: 1.04,
    name: "DONKEY KONG",
  },
  sf2ww: {
    screen: "https://www.aurcade.com/games/screens/00001227.jpg",
    screenFallback: "https://www.aurcade.com/games/screens/00001227m.jpg",
    screenPosition: "50% 24%",
    screenScale: 1.18,
    player: "Craig Roach",
    score: "5,004,780",
    location: "Galloping Ghost Arcade",
    scale: 1.06,
    name: "STREET FIGHTER II: THE WORLD WARRIOR",
  },
  sf3strike: {
    screen: "https://www.aurcade.com/games/screens/00000537.jpg",
    screenFallback: "https://www.aurcade.com/games/screens/00000537m.jpg",
    screenPosition: "50% 20%",
    screenScale: 1.22,
    player: "Matty Thomas",
    score: "2,361,900",
    location: "Galloping Ghost Arcade",
    scale: 1.05,
    name: "STREET FIGHTER III: 3RD STRIKE",
  },
  kof98: {
    screen: "https://www.aurcade.com/games/screens/00000675.jpg",
    screenFallback: "https://www.aurcade.com/games/screens/00000675m.jpg",
    screenPosition: "50% 22%",
    screenScale: 1.2,
    player: "Colin C Brown",
    score: "1,882,400",
    location: "Ground Kontrol",
    scale: 1.05,
    name: "KING OF FIGHTERS '98, THE",
  },
};

const sideCharacterWheels = {
  left: ["class1981", "mspacman", "galaga", "pacman"],
  right: ["donkeykong", "sf2ww", "sf3strike", "kof98"],
};

const sideCharacterJapanese = {
  class1981: "\u30df\u30ba\u30fb\u30d1\u30c3\u30af\u30de\u30f3 /\u30ac\u30e9\u30ac \u30af\u30e9\u30b9 \u30aa\u30d6 1981",
  mspacman: "\u30df\u30ba\u30fb\u30d1\u30c3\u30af\u30de\u30f3",
  galaga: "\u30ac\u30e9\u30ac",
  pacman: "\u30d1\u30c3\u30af\u30de\u30f3",
  donkeykong: "\u30c9\u30f3\u30ad\u30fc\u30b3\u30f3\u30b0",
  sf2ww: "\u30b9\u30c8\u30ea\u30fc\u30c8\u30d5\u30a1\u30a4\u30bf\u30fc2",
  sf3strike: "\u30b9\u30c8\u30ea\u30fc\u30c8\u30d5\u30a1\u30a4\u30bf\u30fc3 \u30b5\u30fc\u30c9\u30b9\u30c8\u30e9\u30a4\u30af",
  kof98: "\u30b6 \u30ad\u30f3\u30b0 \u30aa\u30d6 \u30d5\u30a1\u30a4\u30bf\u30fc\u30ba 98",
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

function initializeScrollChrome() {
  const utilityStrip = document.querySelector(".utility-strip");
  const nav = document.querySelector(".main-nav");
  if (!(utilityStrip instanceof HTMLElement) || !(nav instanceof HTMLElement)) {
    return;
  }

  const root = document.documentElement;
  const mobileMedia = window.matchMedia("(max-width: 731px)");

  let lastScrollY = window.scrollY || 0;
  let mobileUiHidden = false;

  function syncStickyOffset() {
    const stripHeight = Math.max(0, Math.ceil(utilityStrip.getBoundingClientRect().height));
    root.style.setProperty("--utility-strip-height", `${stripHeight}px`);
    root.style.setProperty("--sticky-nav-top", `${stripHeight + 6}px`);
  }

  function setMobileUiHidden(hidden) {
    if (mobileUiHidden === hidden) {
      return;
    }
    mobileUiHidden = hidden;
    document.body.classList.toggle("mobile-scroll-ui-hidden", hidden);

    if (hidden && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      const toggle = nav.querySelector(".nav-toggle");
      if (toggle instanceof HTMLElement) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    }
  }

  function onScroll() {
    if (!mobileMedia.matches) {
      return;
    }
    const currentY = Math.max(0, window.scrollY || 0);
    const delta = currentY - lastScrollY;
    if (Math.abs(delta) < 6) {
      return;
    }

    if (currentY <= 20) {
      setMobileUiHidden(false);
    } else if (delta > 0) {
      setMobileUiHidden(true);
    } else {
      setMobileUiHidden(false);
    }

    lastScrollY = currentY;
  }

  function onModeChange() {
    if (mobileMedia.matches) {
      lastScrollY = Math.max(0, window.scrollY || 0);
      setMobileUiHidden(false);
    } else {
      setMobileUiHidden(false);
      syncStickyOffset();
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", syncStickyOffset, { passive: true });
  window.addEventListener("orientationchange", syncStickyOffset, { passive: true });

  if (typeof window.ResizeObserver === "function") {
    const observer = new ResizeObserver(() => {
      syncStickyOffset();
    });
    observer.observe(utilityStrip);
  }

  if (typeof mobileMedia.addEventListener === "function") {
    mobileMedia.addEventListener("change", onModeChange);
  } else if (typeof mobileMedia.addListener === "function") {
    mobileMedia.addListener(onModeChange);
  }

  onModeChange();
  syncStickyOffset();
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
    '      <span class="name-ring name-ring-top" aria-hidden="true">',
    '        <span class="name-ring-track"><span class="name-ring-text" data-wheel-ring-top="left"></span><span class="name-ring-text" data-wheel-ring-top-clone="left"></span></span>',
    "      </span>",
    '      <span class="popcorn-entry" data-wheel-entry="left" aria-hidden="true">',
    '        <span class="popcorn-plane" data-wheel-plane="left">',
    '          <img class="silhouette" alt="" />',
    '          <img class="sprite" alt="" />',
    '          <span class="cabinet-screen"><img class="cabinet-screen-image" data-wheel-screen="left" alt="" /></span>',
    '          <span class="cabinet-meta"><span class="cabinet-meta-game" data-wheel-meta-game="left"></span><span class="cabinet-meta-score" data-wheel-meta-score="left"></span></span>',
    '          <span class="holo-layer"></span>',
    "        </span>",
    "      </span>",
    '      <span class="name-ring name-ring-bottom" aria-hidden="true">',
    '        <span class="name-ring-track"><span class="name-ring-text" data-wheel-ring-bottom="left"></span><span class="name-ring-text" data-wheel-ring-bottom-clone="left"></span></span>',
    "      </span>",
    '    </div>',
    '  </div>',
    '</aside>',
    '<aside class="selector-wheel wheel-right" data-wheel="right" aria-label="Right character wheel">',
    '  <div class="wheel-row">',
    '    <div class="selector-card" data-wheel-card="right">',
    '      <span class="name-ring name-ring-top" aria-hidden="true">',
    '        <span class="name-ring-track"><span class="name-ring-text" data-wheel-ring-top="right"></span><span class="name-ring-text" data-wheel-ring-top-clone="right"></span></span>',
    "      </span>",
    '      <span class="popcorn-entry" data-wheel-entry="right" aria-hidden="true">',
    '        <span class="popcorn-plane" data-wheel-plane="right">',
    '          <img class="silhouette" alt="" />',
    '          <img class="sprite" alt="" />',
    '          <span class="cabinet-screen"><img class="cabinet-screen-image" data-wheel-screen="right" alt="" /></span>',
    '          <span class="cabinet-meta"><span class="cabinet-meta-game" data-wheel-meta-game="right"></span><span class="cabinet-meta-score" data-wheel-meta-score="right"></span></span>',
    '          <span class="holo-layer"></span>',
    "        </span>",
    "      </span>",
    '      <span class="name-ring name-ring-bottom" aria-hidden="true">',
    '        <span class="name-ring-track"><span class="name-ring-text" data-wheel-ring-bottom="right"></span><span class="name-ring-text" data-wheel-ring-bottom-clone="right"></span></span>',
    "      </span>",
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
      entry: hud.querySelector('[data-wheel-entry="left"]'),
      plane: hud.querySelector('[data-wheel-plane="left"]'),
      sprite: hud.querySelector('[data-wheel-card="left"] .sprite'),
      silhouette: hud.querySelector('[data-wheel-card="left"] .silhouette'),
      screen: hud.querySelector('[data-wheel-screen="left"]'),
      metaGame: hud.querySelector('[data-wheel-meta-game="left"]'),
      metaScore: hud.querySelector('[data-wheel-meta-score="left"]'),
      ringTop: hud.querySelector('[data-wheel-ring-top="left"]'),
      ringTopClone: hud.querySelector('[data-wheel-ring-top-clone="left"]'),
      ringBottom: hud.querySelector('[data-wheel-ring-bottom="left"]'),
      ringBottomClone: hud.querySelector('[data-wheel-ring-bottom-clone="left"]'),
      holo: hud.querySelector('[data-wheel-card="left"] .holo-layer'),
    },
    right: {
      card: hud.querySelector('[data-wheel-card="right"]'),
      entry: hud.querySelector('[data-wheel-entry="right"]'),
      plane: hud.querySelector('[data-wheel-plane="right"]'),
      sprite: hud.querySelector('[data-wheel-card="right"] .sprite'),
      silhouette: hud.querySelector('[data-wheel-card="right"] .silhouette'),
      screen: hud.querySelector('[data-wheel-screen="right"]'),
      metaGame: hud.querySelector('[data-wheel-meta-game="right"]'),
      metaScore: hud.querySelector('[data-wheel-meta-score="right"]'),
      ringTop: hud.querySelector('[data-wheel-ring-top="right"]'),
      ringTopClone: hud.querySelector('[data-wheel-ring-top-clone="right"]'),
      ringBottom: hud.querySelector('[data-wheel-ring-bottom="right"]'),
      ringBottomClone: hud.querySelector('[data-wheel-ring-bottom-clone="right"]'),
      holo: hud.querySelector('[data-wheel-card="right"] .holo-layer'),
    },
  };

  if (
    !(wheelNodes.left instanceof HTMLElement) ||
    !(wheelNodes.right instanceof HTMLElement) ||
    !(wheelSlots.left.card instanceof HTMLElement) ||
    !(wheelSlots.right.card instanceof HTMLElement) ||
    !(wheelSlots.left.entry instanceof HTMLElement) ||
    !(wheelSlots.right.entry instanceof HTMLElement) ||
    !(wheelSlots.left.plane instanceof HTMLElement) ||
    !(wheelSlots.right.plane instanceof HTMLElement) ||
    !(wheelSlots.left.sprite instanceof HTMLImageElement) ||
    !(wheelSlots.left.silhouette instanceof HTMLImageElement) ||
    !(wheelSlots.left.screen instanceof HTMLImageElement) ||
    !(wheelSlots.left.metaGame instanceof HTMLElement) ||
    !(wheelSlots.left.metaScore instanceof HTMLElement) ||
    !(wheelSlots.right.sprite instanceof HTMLImageElement) ||
    !(wheelSlots.right.silhouette instanceof HTMLImageElement) ||
    !(wheelSlots.right.screen instanceof HTMLImageElement) ||
    !(wheelSlots.right.metaGame instanceof HTMLElement) ||
    !(wheelSlots.right.metaScore instanceof HTMLElement) ||
    !(wheelSlots.left.ringTop instanceof Element) ||
    !(wheelSlots.left.ringTopClone instanceof Element) ||
    !(wheelSlots.left.ringBottom instanceof Element) ||
    !(wheelSlots.left.ringBottomClone instanceof Element) ||
    !(wheelSlots.right.ringTop instanceof Element) ||
    !(wheelSlots.right.ringTopClone instanceof Element) ||
    !(wheelSlots.right.ringBottom instanceof Element) ||
    !(wheelSlots.right.ringBottomClone instanceof Element) ||
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

  Object.values(sideCharacterAssets).forEach((asset) => preloadUrl(asset?.screen));
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

    slot.sprite.src = asset.screen || "";
    slot.sprite.alt = `${asset.name || characterKey} thumbnail`;
    slot.silhouette.src = asset.screen || "";
    slot.silhouette.alt = "";
    const primaryScreen = asset.screen || "";
    const fallbackScreen = asset.screenFallback || "";
    slot.screen.onerror = null;
    if (fallbackScreen !== "") {
      slot.screen.onerror = () => {
        slot.screen.onerror = null;
        slot.screen.src = fallbackScreen;
      };
    }
    slot.screen.src = primaryScreen || fallbackScreen;
    slot.screen.alt = `${asset.name || characterKey} screenshot`;
    slot.screen.style.objectPosition = asset.screenPosition || "50% 22%";
    slot.screen.style.objectFit = asset.screenFit || "cover";
    slot.screen.style.setProperty("--screen-scale", String(asset.screenScale || 1.18));
    slot.card.style.setProperty("--fighter-scale", String((asset.scale || 1) * 1.02));
    slot.card.style.setProperty("--fighter-image", `url("${asset.screen || ""}")`);
    const spinSpeed = `${52 + Math.floor(Math.random() * 14)}s`;
    slot.plane.style.setProperty("--spin-speed", spinSpeed);

    const ringLabelEn = (asset.name || characterKey).toUpperCase();
    const ringLabelJp = sideCharacterJapanese[characterKey] || ringLabelEn;
    const player = (asset.player || "Top Player").toUpperCase();
    const score = asset.score || "TOP SCORE";
    const location = (asset.location || "ARCADE").toUpperCase();
    slot.metaGame.textContent = "";
    slot.metaScore.textContent = "";

    const topText = ` ${ringLabelEn} :: HIGH SCORE ${score} :: ${ringLabelJp} :: ${score} :: `;
    const bottomText = ` ${ringLabelEn} :: PLAYER ${player} :: ${location} :: ${player} :: `;
    slot.ringTop.textContent = topText;
    slot.ringTopClone.textContent = topText;
    slot.ringBottom.textContent = bottomText;
    slot.ringBottomClone.textContent = bottomText;
    const baseSpeed = 30 + Math.floor(Math.random() * 8);
    const topDelay = Math.floor(Math.random() * 6);
    const bottomDelay = topDelay + 3;
    slot.card.style.setProperty("--ring-speed-top", `${baseSpeed}s`);
    slot.card.style.setProperty("--ring-speed-bottom", `${baseSpeed + 4}s`);
    slot.card.style.setProperty("--ring-delay-top", `-${topDelay}s`);
    slot.card.style.setProperty("--ring-delay-bottom", `-${bottomDelay}s`);
    pulseCard(slot.card);
  }

  function transitionCharacter(side, index) {
    const slot = wheelSlots[side];
    if (!slot || reduceMotion) {
      renderCharacter(side, index);
      return;
    }

    slot.card.classList.add("is-fading");
    window.setTimeout(() => {
      renderCharacter(side, index);
      slot.card.classList.remove("is-fading");
    }, 320);
  }

  function stepCharacter(side, direction) {
    const roster = side === "left" ? leftRoster : rightRoster;
    if (roster.length <= 1) {
      transitionCharacter(side, state[side]);
      return;
    }

    const currentIndex = normalizeIndex(state[side], roster.length);
    const currentKey = roster[currentIndex];
    let candidateIndex = currentIndex;
    let guard = 0;
    while (guard < roster.length) {
      candidateIndex = normalizeIndex(candidateIndex + direction, roster.length);
      if (roster[candidateIndex] !== currentKey) {
        break;
      }
      guard += 1;
    }
    transitionCharacter(side, candidateIndex);
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

  const mspacmanIndex = leftRoster.indexOf("mspacman");
  const initialLeft = mspacmanIndex >= 0 ? mspacmanIndex : Math.floor(Math.random() * leftRoster.length);
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
    const cycleLoopMs = 8500;
    let sideToggle = "left";
    window.setInterval(() => {
      stepCharacter(sideToggle, 1);
      sideToggle = sideToggle === "left" ? "right" : "left";
    }, cycleLoopMs);
  }
}

initializeHeader();
initializeAuthRow();
initializeGlobalSearch();
initializeMobileNav();
initializeScrollChrome();
initializeGroups();
initializeVotes();
initializeContentViews();
initializeGameProfiles();
initializeSideCharacters();


