import { titleFromKey } from "../fn/format.js";
import { renderTable } from "../layouts/tableLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";

/*
  Хайлтын үр дүнгийн хүснэгт харуулах функц.

  items = Хайлтаар олдсон хүнсний найрлагын JSON өгөгдөл.
  selectedTypes = Сонгосон шим тэжээлийн төрлүүд.
*/
export function renderNutritionTables(items, selectedTypes) {
  // Хайлтын үр дүн олдоогүй үед мэдэгдэл харуулна.
  if (!items || !items.length) {
    return renderNotification("No match found.");
  }

  // Шим тэжээлийн төрөл сонгоогүй үед мэдэгдэл харуулна.
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
  // Хүнсний ерөнхий мэдээллийн хүснэгт.
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

  // Зургийн мэдээллийн хүснэгт.
  if (type === "images") {
    return renderTable({
      title: "Images",
      columns: [
        { key: "food_name", label: "Food name" },
        { key: "number_of_images", label: "Number of Images" },
      ],
      rows: items.map((item) => ({
        food_name: item.food_name,
        number_of_images: item.number_of_images ?? (Array.isArray(item.images) ? item.images.length : 0),
      })),
    });
  }

  /*
    Сонгосон шим тэжээлийн төрөлд хамаарах
    бүх талбарын нэрийг давхардалгүй цуглуулна.
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
    const nutrientData = item?.[type];

    return {
      food_name: item.food_name,
      ...(nutrientData && typeof nutrientData === "object" && !Array.isArray(nutrientData) ? nutrientData : {}),
    };
  });

  // Эцсийн хүснэгтийг буцаана.
  return renderTable({
    title: titleFromKey(type),
    columns,
    rows,
  });
}
