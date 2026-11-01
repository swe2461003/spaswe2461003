import { mountNavbar, updateActiveLink } from "./components/navbar.js";
import { mountFooter } from "./components/footer.js";
import { initRouter } from "./router.js";
import { routes } from "./routes.js";
import { getCurrentLanguage, setLanguage } from "./i18n/i18n.js";

setLanguage(getCurrentLanguage());

const navbarRoot = document.getElementById("navbar");
const footerRoot = document.getElementById("footer");
const renderRoute = initRouter(routes);

// Хэл солигдох үед navbar, footer болон идэвхтэй хуудсыг дахин зурна.
function onLanguageChange() {
  mountNavbar(navbarRoot, onLanguageChange);
  mountFooter(footerRoot);
  renderRoute();
}

mountNavbar(navbarRoot, onLanguageChange);
mountFooter(footerRoot);
window.addEventListener("hashchange", updateActiveLink);
