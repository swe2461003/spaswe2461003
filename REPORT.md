# Гүйцэтгэлийн тайлан

Дугаар нь гарын авлагын хэсгийн дугаар (жишээ нь 2.10.1 = `src/img/map.svg`).

## Эхний засвар (сайт ачаалагдахгүй байсан)
| Хэсэг | Хийсэн зүйл |
|---|---|
| 2.8.2 `imageService.js` | `src/services/` дотор буруу байсныг `src/js/services/` руу зөөсөн (импорт унаж, бүх апп ачаалахгүй байсан). |
| 2.9.2 `convertNutritionsEnMn.js` | Хуулахад орсон markdown ` ``` ` тэмдэгтийг устгаж ажиллуулан `nutritionsEnMn.json` үүсгэсэн. |
| 2.3.2–2.3.7 pages | `overviewPage.js`, `calculationPage.js`, `booksPage.js`, `contactPage.js`, `notFoundPage.js` байхгүй `renderSimplePage`-ийг импортолж байсныг `renderPageLayout`-оор сольсон. |
| 1.5 Font Awesome | `fontawesomeall.min.js` repo-д байхгүй байсан тул нэмсэн. |
| 1.6 docs руу хуулах | `src` -> `docs` хуулалтыг GitHub Pages-д зориулж хийсэн (дараа нь өөрчлөлт бүрийн дараа давтсан). |

## 2.9 Хэл солих (гарын авлагын кодоор сольсон)
| Хэсэг | Хийсэн зүйл |
|---|---|
| 2.9.3 `translations.js` | Гарын авлагын хувилбараар сольж, төгсгөлд байсан ` ``` ` тэмдэгтийг арилгасан. |
| 2.9.4 `i18n.js`, 2.9.5–2.9.7 sidebar-ууд, 2.9.9 `foodSearchEvents.js`, 2.9.10 `nutritionTables.js`, 2.9.11 `searchPage.js` | Гарын авлагын кодоор сольсон. |
| 2.9.8 `config.js` | `nutritionsEnMn.json` руу заадаг хэвээр. |

## 2.8 Зураг
| Хэсэг | Хийсэн зүйл |
|---|---|
| 2.8.1 `images.json` | `generate-images-json.mjs` ажиллуулж дахин үүсгэсэн. |
| `src/img/foods` | Илгээсэн 2 зургийг `01_0001_001.jpg`, `01_0001_002.jpg` нэрээр нэмсэн. |
| `nutritions.json` | Зураг харагдахын тулд `01_0001` (Wheat, whole, raw) мөр нэмсэн. Шим тэжээлийн утга хоосон. |
| `tableLayout.js` | Зургийн тоо (`render`) гарахгүй байсан тул баганы `render` дэмжлэг нэмсэн. |
| Sass | `_button.scss` -> `_buttons.scss` болгож нэрийг зассан, CSS-ийг дахин үүсгэсэн (зургийн modal-ийн загвар орсон). |

## 2.10 Тойм (overviewPage)
| Хэсэг | Хийсэн зүйл |
|---|---|
| 2.10.1 `map.svg` | Нэмсэн. |
| 2.10.2 `mapService.js` | Нэмсэн (эхний мөр тайлбар байсныг `//` тайлбар болгосон). |
| 2.10.3 `map.js` | Нэмсэн. |
| 2.10.4 `_map.scss` | Нэмсэн. |
| 2.10.5 `infoModal.js` | Нэмсэн. **Засвар:** `updateSelectedCount` функц `bindModalEvents` дотор зарлагдсан байсныг `openModal`-д харагдахаар гадуур гаргасан. |
| 2.10.6 `translations.js` | 2.13.3-ын эцсийн хувилбарт нэгтгэгдсэн. |
| 2.10.7 `txt.json`, 2.10.8 `txtService.js`, 2.10.9 `overviewText.js`, 2.10.10 `_overviewText.scss` | Нэмсэн. |
| 2.10.11 `main.scss` | `map`, `overviewText` import нэмсэн. |
| 2.10.12 `splitPageLayout.js`, 2.10.13 `overviewPage.js` | Нэмсэн / сольсон. |
| 2.10.14 `foodSearchEvents.js`, 2.10.15 `searchPage.js` | Сольсон. **Засвар:** `t("searchPage.title")` -> `t("search.title")` (орчуулгад ийм түлхүүр байгаагүй). |
| 2.10.16, 2.10.17 | Тест хийж, push хийсэн. |

## 2.11 Тооцоолуур (calculationPage)
| Хэсэг | Хийсэн зүйл |
|---|---|
| 2.11.1 `calculationInfo.js` | Нэмсэн. |
| 2.11.2 `translations.js` | Эцсийн хувилбарт нэгтгэгдсэн. |
| 2.11.3 `tableLayout.js` | Гарын авлагын хувилбараар сольсон. |
| 2.11.4 `nutrientRequirements.json` | Нэмсэн (20 мөр, JSON шалгасан). |
| 2.11.5 `nutrientRequirementService.js`, 2.11.6 `nutrientGetters.js`, 2.11.7 `calculationTable.js`, 2.11.8 `calculationPage.js` | Нэмсэн. |
| 2.11.9 | Push хийсэн. |

## 2.12 Ном (booksPage)
| Хэсэг | Хийсэн зүйл |
|---|---|
| 2.12.1 `bookService.js`, 2.12.2 `gridPageLayout.js`, 2.12.3 `bookCard.js`, 2.12.4 `_bookCard.scss`, 2.12.5 `pdfModal.js`, 2.12.6 `_pdfModal.scss` | Нэмсэн (`gridPageLayout.js`-ийн эхний мөр код биш тайлбар байсныг хассан). |
| 2.12.7 `bookPage.js` | `booksPage.js` нэрээр хадгалсан (routes ийм нэрээр импортолдог). |
| 2.12.8 `translations.js` | `books` хэсэг эцсийн хувилбарт орсон. |
| `main.scss` | `bookCard`, `pdfModal` import нэмсэн. |

## 2.13 Footer
| Хэсэг | Хийсэн зүйл |
|---|---|
| 2.13.1 `index.html` | `<div id="footer">` нэмсэн. |
| 2.13.2 `app.js` | Footer залгасан. **Анхаар:** гарын авлагын хувилбар хэл солих логикийг устгадаг тул өмнөх `onLanguageChange`-ийг хадгалж, footer-ийг хэл солигдоход дахин зурдаг болгосон. |
| 2.13.3 `translations.js` | Эцсийн хувилбараар сольсон (mn/en адил түлхүүртэй, шалгасан). |
| 2.13.4 `footer.js`, 2.13.5 `_footer.scss` | Нэмсэн. |
| 2.13.6 `main.scss` | `footer` import нэмж, mobile дээр `.app-shell { height: auto }` болгосон. |

## Нэмэлт
- `guide-examples/`: `src.docx`-ийн 45 хэсгийн код (үгчлэн) болон 47 зураг.
- `book-images/chapter2/`: 2-р бүлгийн 3 зураг (`src/img`, `src/img/foods` хавтасны screenshot).

## Шалгалт
Chromium дээр Тойм (газрын зураг -> аймаг -> modal -> хайлт), Хайлт, Тооцоолуур, Ном, footer, EN/MN солилтыг туршсан. JavaScript алдаа гараагүй.

## Хийгдээгүй (файл дутуу)
- `src/img/icon/`: `icon.png`, `afaci.png`, `muls.png`, `rda.png`, `mfali.png`
- `src/img/books/`: 3 хавтасны зураг
- `src/pdf/`: 4 PDF
- 99 дээжтэй бүтэн `nutritions.json` (одоо 3 мөр)
