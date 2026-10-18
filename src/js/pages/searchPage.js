import { getNutritions } from "../services/nutritionService.js";

import { buildFoodGroups, bindSearchEvents, renderDefaultTables, initNutritionData } from "../fn/foodSearchEvents.js";

import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { bindSidebar, bindMenuListToggle } from "../fn/sidebarEvents.js";

import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";

import { renderSearchFoodName } from "../components/searchFoodNameSidebar.js";
import { renderSearchSettings } from "../components/searchSettingsSidebar.js";
import { renderFoodGroupList } from "../components/searchFoodGroupListSidebar.js";

export async function renderSearchPage() {
  const app = document.getElementById("app");

  if (!app) {
    console.error('Element with id="app" was not found.');
    return;
  }

  // Өгөгдөл ачаалж байх үеийн мэдээлэл
  app.innerHTML = renderPageLayout({
    content: renderNotification("Loading data..."),
  });

  try {
    // Хүнсний найрлагын JSON өгөгдлийг авах
    const nutritionData = await getNutritions();

    // Өгөгдлийг хайлтын функцэд дамжуулах
    initNutritionData(nutritionData);

    // Хүнсийг бүлгээр ангилах
    const groupedFoods = buildFoodGroups(nutritionData);

    // Хуудасны layout үүсгэх
    app.innerHTML = renderSidebarPageLayout({
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
    });

    // Sidebar болон хайлтын event-үүдийг холбох
    bindSidebar();
    bindMenuListToggle();
    bindSearchEvents();
  } catch (error) {
    // Алдаа гарсан үед мэдэгдэл харуулах
    app.innerHTML = renderPageLayout({
      content: renderNotification("Failed to load nutrition data.", "danger"),
    });

    console.error("Failed to load nutrition data:", error);
  }
}
