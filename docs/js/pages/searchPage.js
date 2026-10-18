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

import { t } from "../i18n/i18n.js";

let imageModalBound = false;

// Хайлтын хуудсыг үүсгэх
export async function renderSearchPage() {
  const app = document.getElementById("app");

  if (!app) {
    console.error('HTML дотор id="app" элемент олдсонгүй.');
    return;
  }

  // Өгөгдөл ачаалж байх үеийн мэдээлэл
  app.innerHTML = renderPageLayout({
    content: renderNotification(t("notification.loadingData")),
  });

  try {
    // Хүнсний найрлагын JSON өгөгдлийг ачаална
    const nutritionData = await getNutritions();

    // Хүнсний зургийн өгөгдлийг ачаална
    await loadImages();

    // Хайлтын модульд өгөгдлийг дамжуулна
    initNutritionData(nutritionData);

    // Хүнсийг food_group-ээр бүлэглэнэ
    const groupedFoods = buildFoodGroups(nutritionData);

    // Хайлтын хуудсыг үүсгэж харуулна
    app.innerHTML =
      renderSidebarPageLayout({
        sidebarContent: `
                    ${renderSearchFoodName()}
                    ${renderSearchSettings()}
                    ${renderFoodGroupList(groupedFoods)}
                `,
        pageId: "search",
        pageTitle: t("searchPage.title"),
        mainContent: `
                    <div id="resultTbl">
                        ${renderDefaultTables(nutritionData)}
                    </div>
                `,
      }) + renderImageModal();

    // Sidebar болон жагсаалтын үйлдлүүдийг холбоно
    bindSidebar();
    bindMenuListToggle();

    // Хайлтын event-үүдийг холбоно
    bindSearchEvents();

    // Зургийн modal-ийн event-ийг нэг удаа холбоно
    if (!imageModalBound) {
      bindImageModalEvents();
      imageModalBound = true;
    }
  } catch (error) {
    // Өгөгдөл ачаалахад алдаа гарвал мэдээлэл харуулна
    app.innerHTML = renderPageLayout({
      content: renderNotification(t("notification.failedToLoadNutritionData"), "danger"),
    });

    console.error("Failed to load nutrition data:", error);
  }
}
