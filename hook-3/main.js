const yearNodes = document.querySelectorAll("[data-year]");
const updatedNodes = document.querySelectorAll("[data-last-updated]");
const navLinks = document.querySelectorAll("[data-page]");

const filterButtons = document.querySelectorAll("[data-filter]");
const gameCards = document.querySelectorAll("[data-genre]");
const resultCountNodes = document.querySelectorAll("[data-results-count]");

const pageName = (() => {
  const raw = window.location.pathname.split("/").pop();
  if (!raw || raw.trim() === "") {
    return "index.html";
  }
  return raw;
})();

yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const now = new Date();
const stamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
updatedNodes.forEach((node) => {
  node.textContent = stamp;
});

navLinks.forEach((link) => {
  if (link.dataset.page === pageName) {
    link.classList.add("active");
  }
});

function updateVisibleCount() {
  if (resultCountNodes.length === 0 || gameCards.length === 0) {
    return;
  }
  const count = Array.from(gameCards).filter((card) => !card.hidden).length;
  resultCountNodes.forEach((node) => {
    node.textContent = String(count);
  });
}

if (filterButtons.length > 0 && gameCards.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((node) => node.classList.remove("active"));
      button.classList.add("active");

      gameCards.forEach((card) => {
        const tags = (card.dataset.genre || "")
          .split(",")
          .map((entry) => entry.trim().toLowerCase())
          .filter(Boolean);

        const visible = filter === "all" || tags.includes(filter.toLowerCase());
        card.hidden = !visible;
      });

      updateVisibleCount();
    });
  });
}

updateVisibleCount();
