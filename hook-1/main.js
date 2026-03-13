const scanToggle = document.querySelector("[data-scan-toggle]");
const revealNodes = document.querySelectorAll(".reveal");
const countupNodes = document.querySelectorAll(".countup");
const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (scanToggle) {
  scanToggle.addEventListener("click", () => {
    const disabled = document.body.classList.toggle("scanlines-off");
    scanToggle.textContent = disabled ? "CRT FX: OFF" : "CRT FX: ON";
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const countupObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.counted === "true") {
        return;
      }

      const target = Number(entry.target.dataset.target || "0");
      const start = performance.now();
      const duration = 850;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        entry.target.textContent = String(value);
        if (progress < 1) {
          requestAnimationFrame(tick);
          return;
        }
        entry.target.textContent = String(target);
        entry.target.dataset.counted = "true";
      };

      requestAnimationFrame(tick);
    });
  },
  {
    threshold: 0.35,
  }
);

countupNodes.forEach((node) => countupObserver.observe(node));
