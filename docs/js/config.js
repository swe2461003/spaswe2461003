/*
 * Өгөгдөл авах горим.
 * "local" бол JSON файлаас өгөгдөл авна.
 * "api" бол серверийн API-аас өгөгдөл авна.
 */
export const DATA_MODE = "local";

// Дотоод JSON өгөгдлийн файлын зам
export const LOCAL_NUTRITIONS_URL = "./data/nutritionsEnMn.json";

// API серверийн үндсэн хаяг
export const API_BASE_URL = "https://example.com/api";

// Шим тэжээлийн мэдээлэл авах API хаяг
export const API_NUTRITIONS_URL = `${API_BASE_URL}/nutritions`;
