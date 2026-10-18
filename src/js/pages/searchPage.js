import { getNutritions } from "../services/nutritionService.js";

import { buildFoodGroups, bindSearchEvents, renderDefaultTables, initNutritionData } from "../fn/foodSearchEvents.js";

import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { bindSidebar, bindMenuListToggle } from "../fn/sidebarEvents.js";

import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";

import { renderSearchFoodName } from "../components/searchFoodNameSidebar.js";
import { renderSearchSettings } from "../components/searchSettingsSidebar.js";
import { renderFoodGroupList } from "../components/searchFoodGroupListSidebar.js";

import { loadImages } from "../services/imageService.js";

import { renderImageModal, bindImageModalEvents } from "../components/imageModal.js";

let imageModalBound = false;

/*
  Хайлтын хуудсыг үүсгэнэ.
*/
export async function renderSearchPage() {
  const app = document.getElementById("app");

  if (!app) {
    console.error('Element with id="app" was not found.');
    return;
  }

  // Өгөгдөл ачаалж байх үед мэдэгдэл харуулна.
  app.innerHTML = renderPageLayout({
    content: renderNotification("Loading data..."),
  });

  try {
    // Хүнсний найрлагын өгөгдлийг авна.
    const nutritionData = await getNutritions();

    // Зургийн JSON өгөгдлийг ачаална.
    await loadImages();

    // Хайлтын модулийн өгөгдлийг тохируулна.
    initNutritionData(nutritionData);

    // Хүнсийг food_group-ээр бүлэглэнэ.
    const groupedFoods = buildFoodGroups(nutritionData);

    /*
      Sidebar болон үндсэн агуулгыг үүсгэнэ.
      renderImageModal() нь modal цонхны HTML-ийг нэмнэ.
    */
    app.innerHTML =
      renderSidebarPageLayout({
        sidebarContent: `
          ${renderSearchFoodName()}
          ${renderSearchSettings()}
          ${renderFoodGroupList(groupedFoods)}
        `,
        pageId: "search",
        pageTitle: "Food Composition Database",
        mainContent: `
          <div id="resultTbl">
            ${renderDefaultTables(nutritionData)}
          </div>
        `,
      }) + renderImageModal();

    // Sidebar болон хайлтын үйлдлүүдийг холбоно.
    bindSidebar();
    bindMenuListToggle();
    bindSearchEvents();

    // Зургийн modal event-үүдийг нэг удаа холбоно.
    if (!imageModalBound) {
      bindImageModalEvents();
      imageModalBound = true;
    }
  } catch (error) {
    app.innerHTML = renderPageLayout({
      content: renderNotification("Failed to load nutrition data.", "danger"),
    });

    console.error("Failed to load nutrition data:", error);
  }
}
