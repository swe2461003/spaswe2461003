let imageMap = {};

// ./data/images.json файлаас бүх зургийн замыг авна.
export async function loadImages() {
  // Зургийн мэдээлэл өмнө нь ачаалагдсан бол дахин ачаалахгүй.
  if (Object.keys(imageMap).length > 0) {
    return;
  }

  const response = await fetch("./data/images.json");

  if (!response.ok) {
    throw new Error("Failed to load images.json");
  }

  imageMap = await response.json();
}

// Жишээ:
// "01_0001" -> ["img/foods/01_0001_001.jpg", "img/foods/01_0001_002.jpg"]
export function getImagesByFoodCode(foodCode) {
  return imageMap[foodCode] || [];
}
