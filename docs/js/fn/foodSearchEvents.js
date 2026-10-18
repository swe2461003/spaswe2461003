import { renderNotification } from "../layouts/notificationLayout.js";
import { renderNutritionTables } from "../components/nutritionTables.js";
import { nutritionGroups } from "../components/searchSettingsSidebar.js";
import { getLocalizedValue, t } from "../i18n/i18n.js";

// Хүнсний бүлгүүдийг food_group-ээр бүлэглэнэ
export function buildFoodGroups(data) {
  const grouped = new Map();

  for (const item of data) {
    const groupKey =
      typeof item.food_group === "object" ? item.food_group?.en || item.food_group?.mn || "Other" : item.food_group || "Other";

    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupName: item.food_group || {
          en: "Other",
          mn: "Бусад",
        },
        items: new Map(),
      });
    }

    const groupData = grouped.get(groupKey);

    groupData.items.set(item.food_code, {
      food_code: item.food_code,
      food_name: item.food_name,
    });
  }

  return Array.from(grouped.values()).map((group) => ({
    groupName: group.groupName,
    items: Array.from(group.items.values()).sort((a, b) =>
      String(getLocalizedValue(a.food_name, "")).localeCompare(String(getLocalizedValue(b.food_name, "")), getCurrentLocale()),
    ),
  }));
}

// Одоогийн хэлний эрэмбэлэлтийн тохиргоо
function getCurrentLocale() {
  return localStorage.getItem("language") === "en" ? "en" : "mn";
}

// Хүнсний мэдээлэл
let nutritionData = [];

export function initNutritionData(data) {
  nutritionData = Array.isArray(data) ? data : [];
}

// Анх сонгогдсон шим тэжээлийн төрлүүд
const DEFAULT_TYPES = nutritionGroups
  .flatMap((group) => group.items)
  .filter((item) => item.checked)
  .map((item) => item.value);

// Эхлээд харуулах хүнсний тоо
const DEFAULT_ITEM_COUNT = 3;

// Хайлтын event-үүдийг холбоно
export function bindSearchEvents() {
  const searchBtn = document.getElementById("searchBtn");
  const searchTxt = document.getElementById("searchTxt");

  // Хайх товч дарах
  searchBtn?.addEventListener("click", handleTextSearch);

  // Enter дарахад хайх
  searchTxt?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleTextSearch();
    }
  });

  // Checkbox-ийн өөрчлөлтийг хянах
  document.addEventListener("change", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.matches('input[name="foodcode"]')) {
      handleFoodCodeSearch();
      return;
    }

    if (target.matches('input[name="nutrition"]')) {
      rerenderCurrentSelection();
    }
  });
}

// Текстээр хайх
function handleTextSearch() {
  clearCheckedFoodCodes();

  const keyword = getSearchKeyword();

  if (!keyword) {
    setResultHtml(renderNotification(t("notification.enterFoodName")));
    return;
  }

  renderCurrentResults();
}

// Сонгосон food_code-оор хайх
function handleFoodCodeSearch() {
  const searchTxt = document.getElementById("searchTxt");

  if (searchTxt) {
    searchTxt.value = "";
  }

  const selectedCodes = getSelectedFoodCodes();

  if (!selectedCodes.length) {
    setResultHtml(renderDefaultTables(nutritionData));
    return;
  }

  renderCurrentResults();
}

// Сонголт өөрчлөгдөхөд үр дүнг шинэчлэх
function rerenderCurrentSelection() {
  renderCurrentResults();
}

// Одоогийн хайлтын үр дүнг харуулах
function renderCurrentResults() {
  const matched = getMatchedItems();
  const selectedTypes = getSelectedNutritionTypes();

  setResultHtml(renderNutritionTables(matched, selectedTypes));
}

// Хүнсний мэдээллийг шүүх
function getMatchedItems() {
  const selectedCodes = getSelectedFoodCodes();
  const keyword = getSearchKeyword();

  // Сонгосон food_code-оор шүүх
  if (selectedCodes.length) {
    return nutritionData.filter((item) => selectedCodes.includes(item.food_code));
  }

  // Текстээр хайх
  if (keyword) {
    if (keyword.length < 2) {
      return [];
    }

    return nutritionData.filter((item) => {
      const foodName = String(getLocalizedValue(item.food_name, "")).toLowerCase();

      const words = foodName.split(/\s+/);

      return words.some((word) => word.startsWith(keyword));
    });
  }

  // Хайлтын утга байхгүй үед эхний 3 хүнсийг харуулах
  return nutritionData.slice(0, DEFAULT_ITEM_COUNT);
}

// Хайлтын текст авах
function getSearchKeyword() {
  return document.getElementById("searchTxt")?.value.trim().toLowerCase() || "";
}

// Сонгосон хүнсний код авах
function getSelectedFoodCodes() {
  return Array.from(document.querySelectorAll('input[name="foodcode"]:checked')).map((checkbox) => checkbox.value);
}

// Сонгосон шим тэжээлийн төрлүүдийг авах
function getSelectedNutritionTypes() {
  return Array.from(document.querySelectorAll('input[name="nutrition"]:checked')).map((checkbox) => checkbox.value);
}

// Хүнсний кодын сонголтыг цэвэрлэх
function clearCheckedFoodCodes() {
  document.querySelectorAll('input[name="foodcode"]:checked').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

// Үр дүнгийн HTML-ийг харуулах
function setResultHtml(html) {
  const resultTbl = document.getElementById("resultTbl");

  if (resultTbl) {
    resultTbl.innerHTML = html;
  }
}

// Анхны хүснэгтүүдийг харуулах
export function renderDefaultTables(data) {
  const defaultItems = data.slice(0, DEFAULT_ITEM_COUNT);

  return renderNutritionTables(defaultItems, DEFAULT_TYPES);
}
