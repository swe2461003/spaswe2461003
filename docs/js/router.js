export function initRouter(routes) {
  function renderRoute() {
    const hash = (window.location.hash || "#/overview").split("?")[0];
    (routes[hash] || routes["#/404"])?.();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", renderRoute);
  renderRoute(); // module script defer-тэй тул DOM бэлэн
  return renderRoute;
}
