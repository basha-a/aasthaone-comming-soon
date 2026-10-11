// AasthaOne – Coming Soon

// ---- Settings ----
const CONFIG = {
  // Launch date and time, e.g. "2026-12-01T09:00:00+05:30". Leave null to hide the countdown.
  launchDate: null,
  // URL that accepts POST { email } as JSON, e.g. your backend's subscribe endpoint.
  // Leave empty to hide the "Notify me" form.
  notifyEndpoint: "",
};

document.documentElement.classList.add("js");

// ---- Footer year ----
document.getElementById("year").textContent = new Date().getFullYear();

// ---- Mandala petals (12 petals drawn around the diya) ----
(function drawPetals() {
  const group = document.getElementById("petals");
  const petal = "M100 22 C110 40 110 52 100 62 C90 52 90 40 100 22 Z";
  for (let i = 0; i < 12; i++) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", petal);
    path.setAttribute("transform", `rotate(${i * 30} 100 100)`);
    group.appendChild(path);
  }
})();

// ---- Countdown ----
(function startCountdown() {
  if (!CONFIG.launchDate) return;
  const target = new Date(CONFIG.launchDate).getTime();
  if (Number.isNaN(target)) return;

  const el = document.getElementById("countdown");
  const parts = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
  };
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const s = Math.floor(diff / 1000);
    parts.days.textContent = pad(Math.floor(s / 86400));
    parts.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    parts.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    parts.seconds.textContent = pad(s % 60);
    if (diff === 0) clearInterval(timer);
  }

  el.classList.remove("d-none");
  tick();
  const timer = setInterval(tick, 1000);
})();

// ---- Notify form ----
(function setupNotifyForm() {
  if (!CONFIG.notifyEndpoint) return;

  const form = document.getElementById("notify-form");
  const input = document.getElementById("notify-email");
  const message = document.getElementById("notify-message");
  const button = form.querySelector("button");

  const show = (text, type) => {
    message.textContent = text;
    message.className = `notify-message ${type}`;
  };

  form.classList.remove("d-none");
  // The form is now the main action, so make "See what's coming" a quieter link
  const explore = document.getElementById("explore-btn");
  explore.classList.remove("btn-brand", "btn-lg");
  explore.classList.add("btn-link-brand");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!input.checkValidity() || !email) {
      show("Please enter a valid email address.", "error");
      input.focus();
      return;
    }

    button.disabled = true;
    try {
      const res = await fetch(CONFIG.notifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      show("Thank you! We'll let you know as soon as AasthaOne launches.", "success");
      form.reset();
    } catch {
      show("Sorry, something went wrong. Please try again in a moment.", "error");
    } finally {
      button.disabled = false;
    }
  });
})();

// ---- Fade sections in as they scroll into view ----
(function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
})();
