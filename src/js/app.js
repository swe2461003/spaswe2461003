import { mountNavbar, updateActiveLink } from "./components/navbar.js";
import { initRouter } from "./router.js";
import { routes } from "./routes.js";
import { getCurrentLanguage, setLanguage } from "./i18n/i18n.js";

setLanguage(getCurrentLanguage());
const navbarRoot = document.getElementById("navbar");
const renderRoute = initRouter(routes);

function onLanguageChange() {
  mountNavbar(navbarRoot, onLanguageChange);
  renderRoute();
}
mountNavbar(navbarRoot, onLanguageChange);
window.addEventListener("hashchange", updateActiveLink);
