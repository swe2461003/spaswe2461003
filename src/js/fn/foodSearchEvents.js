import { renderNotification } from "../layouts/notificationLayout.js";
import { renderNutritionTables } from "../components/nutritionTables.js";
import { nutritionGroups } from "../components/searchSettingsSidebar.js";

// Хүнсний мэдээллийг food_group-ээр бүлэглэх
export function buildFoodGroups(data) {
  const grouped = new Map();

  for (const item of data) {
    const groupName = item.food_group || "Other";

    if (!grouped.has(groupName)) {
      grouped.set(groupName, new Map());
    }

    const groupItems = grouped.get(groupName);

    groupItems.set(item.food_code, {
      food_code: item.food_code,
      food_name: item.food_name,
    });
  }

  return Array.from(grouped.entries()).map(([groupName, itemsMap]) => ({
    groupName,
    items: Array.from(itemsMap.values()).sort((a, b) => (a.food_name || "").localeCompare(b.food_name || "")),
  }));
}

// Хайлтын өгөгдөл
let nutritionData = [];

export function initNutritionData(data) {
  nutritionData = Array.isArray(data) ? data : [];
}

// Анхдагч шим тэжээлийн төрлүүд
const DEFAULT_TYPES =
  nutritionGroups
    .find((group) => group.groupName === "Nutritions")
    ?.items.filter((item) => item.checked)
    .map((item) => item.value) || [];

const DEFAULT_ITEM_COUNT = 4;

// Хайлтын үйлдлүүдийг event-тэй холбох
export function bindSearchEvents() {
  const searchRoot = document;
  const searchBtn = document.getElementById("searchBtn");
  const searchTxt = document.getElementById("searchTxt");

  if (!searchRoot) return;

  // Хайх товч дээр дарах
  searchBtn?.addEventListener("click", handleTextSearch);

  // Enter товчоор хайх
  searchTxt?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleTextSearch();
    }
  });

  // Checkbox-ийн өөрчлөлтийг хянах
  searchRoot.addEventListener("change", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    if (target.matches('input[name="foodcode"]')) {
      handleFoodCodeSearch();
      return;
    }

    if (target.matches('input[name="nutrition"]')) {
      rerenderCurrentSelection();
    }
  });
}

// Хүнсний нэрээр хайх
function handleTextSearch() {
  clearCheckedFoodCodes();

  const keyword = getSearchKeyword();

  if (!keyword) {
    setResultHtml(renderNotification("Please enter a food name."));
    return;
  }

  renderCurrentResults();
}

// Food code-оор хайх
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

// Сонгосон нөхцөлөөр хүснэгтийг шинэчлэх
function rerenderCurrentSelection() {
  renderCurrentResults();
}

// Хайлтын үр дүнг харуулах
function renderCurrentResults() {
  const matched = getMatchedItems();
  const selectedTypes = getSelectedNutritionTypes();

  setResultHtml(renderNutritionTables(matched, selectedTypes));
}

// Хүнсний өгөгдлийг шүүх
function getMatchedItems() {
  const selectedCodes = getSelectedFoodCodes();
  const keyword = getSearchKeyword();

  if (selectedCodes.length) {
    return nutritionData.filter((item) => selectedCodes.includes(item.food_code));
  }

  if (keyword) {
    return nutritionData.filter((item) => (item.food_name || "").toLowerCase().includes(keyword));
  }

  return nutritionData.slice(0, DEFAULT_ITEM_COUNT);
}

// Хайх үгийг авах
function getSearchKeyword() {
  return document.getElementById("searchTxt")?.value.trim().toLowerCase() || "";
}

// Сонгосон food code-уудыг авах
function getSelectedFoodCodes() {
  return Array.from(document.querySelectorAll('input[name="foodcode"]:checked')).map((checkbox) => checkbox.value);
}

// Сонгосон шим тэжээлийн төрлүүдийг авах
function getSelectedNutritionTypes() {
  return Array.from(document.querySelectorAll('input[name="nutrition"]:checked')).map((checkbox) => checkbox.value);
}

// Food code-ийн checkbox-уудын сонголтыг арилгах
function clearCheckedFoodCodes() {
  document.querySelectorAll('input[name="foodcode"]:checked').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

// Үр дүнгийн хэсэгт HTML харуулах
function setResultHtml(html) {
  const resultTbl = document.getElementById("resultTbl");

  if (resultTbl) {
    resultTbl.innerHTML = html;
  }
}

// Анхдагч хүснэгтүүдийг харуулах
export function renderDefaultTables(data) {
  const defaultItems = data.slice(0, DEFAULT_ITEM_COUNT);

  return renderNutritionTables(defaultItems, DEFAULT_TYPES);
}
