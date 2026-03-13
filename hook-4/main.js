const yearNodes = document.querySelectorAll("[data-year]");
const updatedNodes = document.querySelectorAll("[data-last-updated]");
const navNodes = document.querySelectorAll("[data-page]");

const groupState = new Map();
const sideCharacterAssets = {
  ryu: {
    src: "./assets/fighters/ryu3.gif",
    scale: 1.12,
  },
  chunli: {
    src: "./assets/fighters/chun3.gif",
    scale: 1.16,
  },
  alex: {
    src: "./assets/fighters/alex.gif",
    scale: 1.15,
  },
  dudley: {
    src: "./assets/fighters/dudley.gif",
    scale: 1.14,
  },
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

  const resolvedScenes = [...document.querySelectorAll(".page-grid .panel[data-scene-fighter]")]
    .map((node) => {
      const rect = node.getBoundingClientRect();
      const fighter = (node.dataset.sceneFighter || "").toLowerCase();
      if (rect.height < 120 || !fighter || !sideCharacterAssets[fighter]) {
        return null;
      }
      return {
        node,
        fighter,
        fighterName: node.dataset.sceneFighterName || fighter,
      };
    })
    .filter(Boolean);

  if (resolvedScenes.length === 0) {
    return;
  }

  const popupLayer = document.createElement("div");
  popupLayer.className = "side-popups";
  popupLayer.innerHTML = [
    '<div class="side-character side-left" aria-hidden="true">',
    '  <img alt="" />',
    "</div>",
  ].join("");
  document.body.appendChild(popupLayer);

  const fighterNode = popupLayer.querySelector(".side-character");
  const imageNode = popupLayer.querySelector(".side-character img");
  if (!fighterNode || !imageNode) {
    return;
  }

  let activeIndex = -1;
  let hasUserScrolled = false;
  const initialScrollY = window.scrollY || window.pageYOffset || 0;
  const introThreshold = 72;

  function enterCharacter(node) {
    node.classList.remove("is-entering");
    // Triggering layout reflow ensures the class animation restarts on each scene change.
    void node.offsetWidth;
    node.classList.add("is-entering");
    window.setTimeout(() => {
      node.classList.remove("is-entering");
    }, 320);
  }

  function hideCharacters() {
    fighterNode.classList.remove("is-visible", "is-bobbing", "is-entering");
    activeIndex = -1;
  }

  function setScene(index) {
    if (index === activeIndex) {
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

    imageNode.src = asset.src;
    imageNode.alt = scene.fighterName;
    imageNode.style.setProperty("--fighter-scale", String(asset.scale || 1.2));
    fighterNode.classList.remove("side-left", "side-right");
    fighterNode.classList.add(index % 2 === 0 ? "side-left" : "side-right");
    enterCharacter(fighterNode);
    fighterNode.classList.add("is-visible");
    fighterNode.classList.toggle("is-bobbing", !reduceMotion);
    activeIndex = index;
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

      updateSceneFromScrollState();
    },
    {
      root: null,
      threshold: [0, 0.15, 0.35, 0.55, 0.75],
      rootMargin: "-28% 0px -35% 0px",
    },
  );

  resolvedScenes.forEach((scene) => {
    observer.observe(scene.node);
  });

  window.addEventListener("scroll", updateSceneFromScrollState, { passive: true });
  updateSceneFromScrollState();
}

initializeHeader();
initializeGroups();
initializeVotes();
initializeContentViews();
initializeGameProfiles();
initializeSideCharacters();
