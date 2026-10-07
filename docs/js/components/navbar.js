import { t, toggleLanguage } from "../i18n/i18n.js";

const items = [["overview", "❓"], ["search", "🔍"], ["calculation", "🧮"], ["books", "📖"], ["contact", "📇"]];

export function renderNavbar() {
  const links = items.map(([k, icon]) => `
    <a class="navbar-item" href="#/${k}"><span class="icon">${icon}</span><span>${t("nav." + k)}</span></a>`).join("");
  return `
  <header class="app-sticky app-shadow">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item has-text-weight-bold is-uppercase app-logo" href="#/overview">
            <p><span class="is-hidden-mobile">${t("nav.brandSpan")}</span> ${t("nav.brand")}</p>
          </a>
          <a class="navbar-burger" role="button" aria-expanded="false" data-target="topNavbar">
            <span aria-hidden="true"></span><span aria-hidden="true"></span>
            <span aria-hidden="true"></span><span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu has-text-weight-semibold has-text-centered" id="topNavbar">
          <div class="navbar-start app-top-navbar-right">${links}</div>
          <div class="navbar-end"><a class="navbar-item" href="#" id="langToggle">${t("nav.language")}</a></div>
        </div>
      </div>
    </nav>
  </header>`;
}

export function updateActiveLink() {
  const hash = (location.hash || "#/overview").split("?")[0];
  document.querySelectorAll("#topNavbar .navbar-start .navbar-item")
    .forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === hash));
}

export function mountNavbar(root, onLanguageChange) {
  if (!root) return;
  root.innerHTML = renderNavbar();
  const burger = root.querySelector(".navbar-burger");
  const menu = root.querySelector("#topNavbar");
  const setOpen = (open) => {
    burger.classList.toggle("is-active", open);
    menu.classList.toggle("is-active", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => setOpen(!burger.classList.contains("is-active")));
  menu.querySelectorAll(".navbar-start .navbar-item").forEach((a) =>
    a.addEventListener("click", () => setOpen(false)));
  root.querySelector("#langToggle").addEventListener("click", (e) => {
    e.preventDefault();
    toggleLanguage();
    onLanguageChange?.(); // reload хийхгүй, дахин зурна
  });
  updateActiveLink();
}
