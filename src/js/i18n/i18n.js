import { translations } from "./translations.js";

// Апп эхлэхэд ашиглах үндсэн хэл
const DEFAULT_LANGUAGE = "mn";

// Одоогийн сонгогдсон хэлийг авна
export function getCurrentLanguage() {
  return localStorage.getItem("language") || DEFAULT_LANGUAGE;
}

// Хэрэглэгчийн сонгосон хэлийг хадгална
export function setLanguage(language) {
  if (language !== "mn" && language !== "en") {
    throw new Error("Дэмжигдээгүй хэл: " + language);
  }

  localStorage.setItem("language", language);
}

// Түлхүүр замаар орчуулгын текст авна
// Жишээ: t("nav.search")
export function t(path) {
  const language = getCurrentLanguage();
  const keys = path.split(".");
  let value = translations[language];

  for (const key of keys) {
    value = value?.[key];
  }

  return value ?? path;
}

// Монгол болон англи хэлний хооронд солино
export function toggleLanguage() {
  const current = getCurrentLanguage();
  const next = current === "mn" ? "en" : "mn";

  setLanguage(next);

  return next;
}

// Одоогийн хэлэнд тохирсон өгөгдөл авна
// { en: "Barley flour", mn: "Арвайн гурил" }
// Хуучин string бүтэц мөн дэмжинэ
export function getLocalizedValue(value, fallback = "") {
  const language = getCurrentLanguage();

  if (value == null) {
    return fallback;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    if ("en" in value || "mn" in value) {
      return value[language] || value.en || value.mn || fallback;
    }

    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, getLocalizedValue(val, fallback)]));
  }

  return value;
}

// Огноог Монгол эсвэл Англи хэлний форматаар харуулна
// Дэмжих формат: 25.11.2021, 2021.11.25, 2021-11-25
export function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const language = getCurrentLanguage();
  const parts = String(dateString).split(/[.-]/);

  if (parts.length !== 3) {
    return dateString;
  }

  let day;
  let month;
  let year;

  // YYYY.MM.DD эсвэл YYYY-MM-DD
  if (parts[0].length === 4) {
    [year, month, day] = parts;
  }
  // DD.MM.YYYY
  else if (parts[2].length === 4) {
    [day, month, year] = parts;
  } else {
    return dateString;
  }

  day = String(day).padStart(2, "0");
  month = String(month).padStart(2, "0");

  // Огнооны утга зөв эсэхийг шалгана
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) {
    return dateString;
  }

  // Монгол формат: 2021.11.25
  if (language === "mn") {
    return `${year}.${month}.${day}`;
  }

  // Англи формат: November 25, 2021
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
