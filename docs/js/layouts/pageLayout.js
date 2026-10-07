import { t } from "../i18n/i18n.js";

export function renderPageLayout({
  id = "", title = "", content = "",
  sectionClass = "section", containerClass = "container",
  titleClass = "title is-3 has-text-centered",
}) {
  return `
    <section ${id ? `id="${id}"` : ""} class="${sectionClass}">
      <div class="${containerClass}">
        ${title ? `<h1 class="${titleClass}">${title}</h1>` : ""}
        ${content}
      </div>
    </section>`;
}

// Энгийн page-үүдийн нийтлэг render (page бүр өөрийн файлтай хэвээр)
export function renderSimplePage(key) {
  document.getElementById("app").innerHTML = renderPageLayout({
    id: key,
    title: t(`pages.${key}.title`),
    content: `<p>${t(`pages.${key}.text`)}</p>`,
  });
}
