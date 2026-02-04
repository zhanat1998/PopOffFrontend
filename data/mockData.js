// Категории (Pinduoduo style) - много категорий
export const CATEGORIES = [
  { id: "1", name: "Топ" },
  { id: "2", name: "Еда" },
  { id: "3", name: "Техника" },
  { id: "4", name: "Мужское" },
  { id: "5", name: "Обувь" },
  { id: "6", name: "Аптека" },
  { id: "7", name: "Фрукты" },
  { id: "8", name: "Авто" },
  { id: "9", name: "Красота" },
  { id: "10", name: "Бельё" },
  { id: "11", name: "Ноутбуки" },
  { id: "12", name: "Мебель" },
  { id: "13", name: "Текстиль" },
  { id: "14", name: "Украшения" },
  { id: "15", name: "Ремонт" },
  { id: "16", name: "Спорт" },
  { id: "17", name: "Импорт" },
  { id: "18", name: "Женское" },
  { id: "19", name: "Телефоны" },
  { id: "20", name: "Детское" },
  { id: "21", name: "Игрушки" },
  { id: "22", name: "Книги" },
  { id: "23", name: "Зоотовары" },
  { id: "24", name: "Сад" },
  { id: "25", name: "Офис" },
];

// Быстрые действия
export const QUICK_ACTIONS = [
  { id: "1", name: "Распродажа", icon: "flash", color: "#ff4757" },
  { id: "2", name: "Пополнить", icon: "card", color: "#3498db" },
  { id: "3", name: "Розыгрыш", icon: "gift", color: "#e74c3c" },
  { id: "4", name: "Бесплатно", icon: "leaf", color: "#2ecc71" },
  { id: "5", name: "Ещё", icon: "grid", color: "#f39c12" },
];

// Товары
export const PRODUCTS = [
  {
    id: "1",
    title: "Беспроводные наушники Bluetooth Pro с шумоподавлением",
    price: 2990,
    originalPrice: 5990,
    image: "https://picsum.photos/400/400?random=1",
    sold: 12500,
    rating: 4.8,
    category: "3",
  },
  {
    id: "2",
    title: "Смарт часы с фитнес трекером и мониторингом сердца",
    price: 4590,
    originalPrice: 8990,
    image: "https://picsum.photos/400/400?random=2",
    sold: 8300,
    rating: 4.6,
    category: "3",
  },
  {
    id: "3",
    title: "Портативный аккумулятор 20000mAh быстрая зарядка",
    price: 1990,
    originalPrice: 3990,
    image: "https://picsum.photos/400/400?random=3",
    sold: 25000,
    rating: 4.9,
    category: "3",
  },
  {
    id: "4",
    title: "Кольцевая лампа 26см со штативом для блогеров",
    price: 2490,
    originalPrice: 4990,
    image: "https://picsum.photos/400/400?random=4",
    sold: 5600,
    rating: 4.5,
    category: "3",
  },
  {
    id: "5",
    title: "Механическая игровая клавиатура с RGB подсветкой",
    price: 3590,
    originalPrice: 7990,
    image: "https://picsum.photos/400/400?random=5",
    sold: 3200,
    rating: 4.7,
    category: "3",
  },
  {
    id: "6",
    title: "Беспроводная мышь эргономичная бесшумная",
    price: 1590,
    originalPrice: 2990,
    image: "https://picsum.photos/400/400?random=6",
    sold: 18900,
    rating: 4.4,
    category: "3",
  },
  {
    id: "7",
    title: "Летняя футболка хлопок оверсайз унисекс",
    price: 1290,
    originalPrice: 2490,
    image: "https://picsum.photos/400/400?random=7",
    sold: 45000,
    rating: 4.3,
    category: "2",
  },
  {
    id: "8",
    title: "Женские кроссовки для бега дышащие легкие",
    price: 3890,
    originalPrice: 6990,
    image: "https://picsum.photos/400/400?random=8",
    sold: 22000,
    rating: 4.6,
    category: "2",
  },
  {
    id: "9",
    title: "Bluetooth колонка водонепроницаемая портативная",
    price: 3290,
    originalPrice: 6490,
    image: "https://picsum.photos/400/400?random=9",
    sold: 9500,
    rating: 4.5,
    category: "3",
  },
  {
    id: "10",
    title: "Чехол для телефона прозрачный противоударный",
    price: 890,
    originalPrice: 1990,
    image: "https://picsum.photos/400/400?random=10",
    sold: 85000,
    rating: 4.2,
    category: "3",
  },
  {
    id: "11",
    title: "Коврик для йоги нескользящий фитнес мат",
    price: 2290,
    originalPrice: 4490,
    image: "https://picsum.photos/400/400?random=11",
    sold: 15000,
    rating: 4.7,
    category: "6",
  },
  {
    id: "12",
    title: "Крем для лица увлажняющий гиалуроновая кислота",
    price: 1890,
    originalPrice: 3590,
    image: "https://picsum.photos/400/400?random=12",
    sold: 28000,
    rating: 4.8,
    category: "5",
  },
];

// Горячие товары (горизонтальный скролл)
export const HOT_PRODUCTS = [
  {
    id: "h1",
    title: "AirPods Pro",
    price: 14990,
    image: "https://picsum.photos/200/200?random=21",
  },
  {
    id: "h2",
    title: "Кроссовки Nike",
    price: 8990,
    image: "https://picsum.photos/200/200?random=22",
  },
  {
    id: "h3",
    title: "Смарт часы",
    price: 19990,
    image: "https://picsum.photos/200/200?random=23",
  },
  {
    id: "h4",
    title: "Рюкзак",
    price: 4590,
    image: "https://picsum.photos/200/200?random=24",
  },
  {
    id: "h5",
    title: "Очки",
    price: 2990,
    image: "https://picsum.photos/200/200?random=25",
  },
];

// Форматирование количества продаж
export const formatSold = (num) => {
  if (num >= 10000) {
    return (num / 1000).toFixed(0) + "тыс+";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "тыс+";
  }
  return num + "+";
};

// Расчёт скидки
export const calculateDiscount = (original, current) => {
  return Math.round(((original - current) / original) * 100);
};

// Flash Sale товары (ограниченное время)
export const FLASH_SALE_PRODUCTS = [
  {
    id: "f1",
    title: "Беспроводные наушники TWS",
    price: 990,
    originalPrice: 2990,
    image: "https://picsum.photos/300/300?random=31",
    sold: 892,
    totalStock: 1000,
    endTime: Date.now() + 3600000 * 2, // 2 часа
  },
  {
    id: "f2",
    title: "Портативная колонка JBL",
    price: 1490,
    originalPrice: 4990,
    image: "https://picsum.photos/300/300?random=32",
    sold: 456,
    totalStock: 500,
    endTime: Date.now() + 3600000 * 2,
  },
  {
    id: "f3",
    title: "Фитнес браслет Mi Band",
    price: 790,
    originalPrice: 1990,
    image: "https://picsum.photos/300/300?random=33",
    sold: 1203,
    totalStock: 1500,
    endTime: Date.now() + 3600000 * 2,
  },
  {
    id: "f4",
    title: "USB кабель Type-C 2м",
    price: 190,
    originalPrice: 590,
    image: "https://picsum.photos/300/300?random=34",
    sold: 2341,
    totalStock: 3000,
    endTime: Date.now() + 3600000 * 2,
  },
];

// Clearance / Распродажа товары (топ скидки)
export const CLEARANCE_PRODUCTS = [
  {
    id: "c1",
    rank: 1,
    title: "Зимняя куртка мужская пуховик",
    price: 2990,
    originalPrice: 8990,
    image: "https://picsum.photos/300/300?random=41",
    sold: 5621,
    discount: 67,
  },
  {
    id: "c2",
    rank: 2,
    title: "Кроссовки женские спортивные",
    price: 1590,
    originalPrice: 4590,
    image: "https://picsum.photos/300/300?random=42",
    sold: 3892,
    discount: 65,
  },
  {
    id: "c3",
    rank: 3,
    title: "Рюкзак городской водонепроницаемый",
    price: 890,
    originalPrice: 2490,
    image: "https://picsum.photos/300/300?random=43",
    sold: 2103,
    discount: 64,
  },
  {
    id: "c4",
    rank: 4,
    title: "Термокружка 500мл нержавейка",
    price: 490,
    originalPrice: 1290,
    image: "https://picsum.photos/300/300?random=44",
    sold: 4521,
    discount: 62,
  },
  {
    id: "c5",
    rank: 5,
    title: "Набор кистей для макияжа 12шт",
    price: 390,
    originalPrice: 990,
    image: "https://picsum.photos/300/300?random=45",
    sold: 6732,
    discount: 61,
  },
  {
    id: "c6",
    rank: 6,
    title: "Электробритва мужская Xiaomi",
    price: 1290,
    originalPrice: 3290,
    image: "https://picsum.photos/300/300?random=46",
    sold: 1892,
    discount: 61,
  },
];
