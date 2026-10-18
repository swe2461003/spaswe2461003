import { titleFromKey, escapeHtml } from "../fn/format.js";
import { renderTable } from "../layouts/tableLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { getImagesByFoodCode } from "../services/imageService.js";

/*
  Хайлтын үр дүнгийн хүснэгт үүсгэнэ.

  items = Хайлтаар олдсон хүнсний мэдээллийн JSON өгөгдөл
  selectedTypes = Сонгосон шим тэжээлийн төрлүүд
  Жишээ: ["proximates", "minerals", "vitamins"]
*/
export function renderNutritionTables(items, selectedTypes) {
  // Хайлтын үр дүн олдоогүй бол мэдэгдэл харуулна.
  if (!items || !items.length) {
    return renderNotification("No match found.");
  }

  // Шим тэжээлийн төрөл сонгоогүй бол мэдэгдэл харуулна.
  if (!selectedTypes || !selectedTypes.length) {
    return renderNotification("Please select at least one nutrition category.");
  }

  // Сонгосон төрөл бүрээр хүснэгт үүсгэнэ.
  return selectedTypes.map((type) => renderTableByType(type, items)).join("");
}

/*
  Сонгосон төрлөөс хамаарч хүснэгт үүсгэнэ.
*/
function renderTableByType(type, items) {
  // 1. Хүнсний ерөнхий мэдээлэл
  if (type === "description") {
    return renderTable({
      title: "Description",
      columns: [
        { key: "food_name", label: "Food name" },
        { key: "food_group", label: "Food group" },
        { key: "scientific_name", label: "Scientific name" },
        { key: "native_name", label: "Native name" },
        { key: "province", label: "Province" },
      ],
      rows: items,
    });
  }

  // 2. Хүнсний зургийн мэдээлэл
  if (type === "images") {
    return renderTable({
      title: "Images",
      columns: [
        {
          key: "food_name",
          label: "Food name",
        },
        {
          key: "number_of_images",
          label: "Number of Images",
          render: (item) => {
            const images = getImagesByFoodCode(item.food_code);
            const count = images.length;

            if (count === 0) {
              return "-";
            }

            return `
              <span
                class="tag is-primary image-count-tag open-image-btn"
                data-foodcode="${escapeHtml(item.food_code ?? "")}"
                data-foodname="${escapeHtml(item.food_name ?? "")}"
                role="button"
                tabindex="0"
                aria-label="View ${count} images"
              >
                ${count}
              </span>
            `;
          },
        },
      ],
      rows: items,
    });
  }

  /*
    3. Шим тэжээлийн мэдээлэл.

    Жишээ төрөл:
    proximates, minerals, vitamins

    Сонгосон төрөл доторх бүх талбарын нэрийг цуглуулна.
  */
  const nutrientKeys = Array.from(
    new Set(
      items.flatMap((item) => {
        const data = item?.[type];

        return data && typeof data === "object" && !Array.isArray(data) ? Object.keys(data) : [];
      }),
    ),
  );

  // Хүснэгтийн багануудыг үүсгэнэ.
  const columns = [
    { key: "food_name", label: "Food name" },
    ...nutrientKeys.map((key) => ({
      key,
      label: key,
    })),
  ];

  // Хүснэгтийн мөрүүдийг үүсгэнэ.
  const rows = items.map((item) => {
    const data = item?.[type];

    return {
      food_name: item.food_name ?? "",
      ...(data && typeof data === "object" && !Array.isArray(data) ? data : {}),
    };
  });

  // Бэлэн хүснэгтийг буцаана.
  return renderTable({
    title: titleFromKey(type),
    columns,
    rows,
  });
}
