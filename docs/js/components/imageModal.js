import { getImagesByFoodCode } from "../services/imageService.js";

let slideshowImages = [];
let currentIndex = 0;
let imageModalEventsBound = false;

let zoomLevel = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

/*
  Зураг үзэх modal цонхны HTML бүтцийг үүсгэнэ.
*/
export function renderImageModal() {
  return `
    <div id="imageModal" class="modal">
      <div class="modal-background" id="modalBg"></div>

      <div class="modal-card">
        <header class="modal-card-head">
          <p
            class="modal-card-title has-text-centered"
            id="modalImgTitle"
          ></p>

          <button
            class="button is-small mr-2"
            id="fullscreenBtn"
            type="button"
            aria-label="Toggle fullscreen"
          >
            ⛶
          </button>

          <button
            class="delete"
            aria-label="Close"
            id="closeImgModalBtn"
            type="button"
          ></button>
        </header>

        <section class="modal-card-body has-text-centered">
          <img
            id="slideshowImage"
            class="modal-slideshow-image zoomable-image"
            draggable="false"
            src=""
            alt=""
          >

          <div class="buttons is-centered mt-3">
            <button
              class="button is-small is-primary"
              id="prevImageBtn"
              type="button"
              aria-label="Previous image"
            >
              ←
            </button>

            <button
              class="button is-small is-primary"
              id="nextImageBtn"
              type="button"
              aria-label="Next image"
            >
              →
            </button>
          </div>
        </section>
      </div>
    </div>
  `;
}

/*
  Modal цонхны event-үүдийг холбоно.
  Нэгээс олон удаа дуудагдсан ч event давхар холбогдохгүй.
*/
export function bindImageModalEvents() {
  if (imageModalEventsBound) return;

  imageModalEventsBound = true;

  // Зураг нээх, хаах, шилжүүлэх, fullscreen үйлдлүүд
  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const openBtn = target.closest(".open-image-btn");

    if (openBtn) {
      const foodCode = openBtn.dataset.foodcode;
      const foodName = openBtn.dataset.foodname || "Food";

      if (foodCode) {
        showImages(foodCode, foodName);
      }

      return;
    }

    if (target.closest("#closeImgModalBtn")) {
      closeImgModal();
      return;
    }

    if (target.closest("#modalBg")) {
      closeImgModal();
      return;
    }

    if (target.closest("#prevImageBtn")) {
      prevImage();
      return;
    }

    if (target.closest("#nextImageBtn")) {
      nextImage();
      return;
    }

    if (target.closest("#fullscreenBtn")) {
      toggleFullscreen();
    }
  });

  // Зургийг хулганаар чирэх
  document.addEventListener("mousedown", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const imageEl = target.closest("#slideshowImage");

    if (!imageEl || zoomLevel <= 1) return;

    event.preventDefault();

    isDragging = true;
    startX = event.clientX - translateX;
    startY = event.clientY - translateY;

    imageEl.style.cursor = "grabbing";
  });

  // Чирж хөдөлгөх
  document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const imageEl = document.getElementById("slideshowImage");

    if (!imageEl) return;

    event.preventDefault();

    translateX = event.clientX - startX;
    translateY = event.clientY - startY;

    updateImageTransform(imageEl);
  });

  // Хулганын товч суллах
  document.addEventListener("mouseup", stopDragging);

  document.addEventListener("mouseleave", stopDragging);

  // ESC товчоор modal хаах
  document.addEventListener("keydown", (event) => {
    const modalEl = document.getElementById("imageModal");

    if (!modalEl?.classList.contains("is-active")) return;

    if (event.key === "Escape") {
      closeImgModal();
    }

    if (event.key === "ArrowRight") {
      nextImage();
    }

    if (event.key === "ArrowLeft") {
      prevImage();
    }
  });

  // Хулганы дугуйгаар томруулж, жижгэрүүлэх
  document.addEventListener(
    "wheel",
    (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const imageEl = target.closest("#slideshowImage");

      if (!imageEl) return;

      event.preventDefault();

      zoomLevel += event.deltaY < 0 ? 0.15 : -0.15;
      zoomLevel = Math.min(Math.max(zoomLevel, 1), 4);

      if (zoomLevel === 1) {
        translateX = 0;
        translateY = 0;
      }

      updateImageTransform(imageEl);
    },
    { passive: false },
  );
}

/*
  Сонгосон хүнсний кодын зургуудыг modal цонхонд харуулна.
*/
function showImages(foodCode, foodName) {
  slideshowImages = getImagesByFoodCode(foodCode);

  if (!slideshowImages.length) {
    alert(`No images found for ${foodName}`);
    return;
  }

  currentIndex = 0;

  const imageEl = document.getElementById("slideshowImage");
  const titleEl = document.getElementById("modalImgTitle");
  const modalEl = document.getElementById("imageModal");

  if (!imageEl || !titleEl || !modalEl) return;

  imageEl.src = slideshowImages[currentIndex];
  imageEl.alt = foodName;

  titleEl.textContent = foodName;

  resetImageZoom(imageEl);

  modalEl.classList.add("is-active");
}

/*
  Дараагийн зураг руу шилжинэ.
  Сүүлийн зурагт хүрвэл эхний зураг руу буцна.
*/
function nextImage() {
  if (!slideshowImages.length) return;

  currentIndex = (currentIndex + 1) % slideshowImages.length;

  updateCurrentImage();
}

/*
  Өмнөх зураг руу шилжинэ.
  Эхний зураг дээр байвал сүүлийн зураг руу шилжинэ.
*/
function prevImage() {
  if (!slideshowImages.length) return;

  currentIndex = (currentIndex - 1 + slideshowImages.length) % slideshowImages.length;

  updateCurrentImage();
}

/*
  Одоогийн зургийг шинэчилнэ.
*/
function updateCurrentImage() {
  const imageEl = document.getElementById("slideshowImage");

  if (!imageEl) return;

  imageEl.src = slideshowImages[currentIndex];

  resetImageZoom(imageEl);
}

/*
  Modal цонхыг хаана.
*/
function closeImgModal() {
  const modalEl = document.getElementById("imageModal");

  if (modalEl) {
    modalEl.classList.remove("is-active");
  }

  const imageEl = document.getElementById("slideshowImage");

  if (imageEl) {
    resetImageZoom(imageEl);
  }

  isDragging = false;
}

/*
  Зургийн zoom болон байрлалыг анхны төлөвт оруулна.
*/
function resetImageZoom(imageEl) {
  zoomLevel = 1;
  translateX = 0;
  translateY = 0;
  isDragging = false;

  imageEl.style.transform = "translate(0px, 0px) scale(1)";
  imageEl.style.cursor = "zoom-in";
}

/*
  Зургийн байрлал болон томруулалтын хэмжээг шинэчилнэ.
*/
function updateImageTransform(imageEl) {
  imageEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;

  imageEl.style.cursor = isDragging ? "grabbing" : zoomLevel > 1 ? "grab" : "zoom-in";
}

/*
  Зураг чирэх үйлдлийг зогсооно.
*/
function stopDragging() {
  isDragging = false;

  const imageEl = document.getElementById("slideshowImage");

  if (imageEl) {
    imageEl.style.cursor = zoomLevel > 1 ? "grab" : "zoom-in";
  }
}

/*
  Fullscreen горимыг асаах эсвэл унтраах.
*/
async function toggleFullscreen() {
  const imageEl = document.getElementById("slideshowImage");

  if (!imageEl) return;

  try {
    if (!document.fullscreenElement) {
      await imageEl.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error("Fullscreen error:", error);
  }
}
