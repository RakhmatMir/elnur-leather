/*
  ЕДИНЫЙ ФАЙЛ НАСТРОЕК САЙТА: цены, контакты, карта, режим заказа.
  Токен Telegram-бота и chat_id здесь НЕ хранятся (файл открыт всем посетителям) — они только на сервере: config/telegram.json.
*/
window.ELNUR = {
  /* ---------- ЦЕНЫ (сум). Единственное место, где живут числа. ---------- */
  PRICES: { strap: 200000, belt: 350000, wallet: 450000, card: 180000,
    /* Цены из админки старого сайта elnurleather.uz (их вписал владелец), 21.11.2026 */
    strap300: 300000, beltClassic: 350000, beltPodium: 450000, walletAnor: 300000,
    pendantAnor: 200000, boxDome: 450000, gourd: 50000 },
  ENGRAVE_PRICE: 30000,   // гравировка [уточнить у владельца]
  BOX_PRICE: 20000,       // подарочная коробка [уточнить у владельца]
  ENGRAVE_MAX: 12,        // знаков в гравировке [уточнить у владельца]
  /* Подтверждённые цены показываются как есть: ремешок «от …», шляпа точно. Остальные — «≈ … · цена примерная».
     Когда владелец подтвердит цену — добавьте ключ в CONFIRMED, пометка «≈» исчезнет. */
  CONFIRMED: ['strap', 'hat', 'strap300', 'beltClassic', 'beltPodium', 'walletAnor', 'pendantAnor', 'boxDome', 'gourd'],
  HAT_PRICE: 1200000,

  /* ---------- КОНТАКТЫ ---------- */
  PHONE_TEL: '+998916751088',
  PHONE_VIEW: '+998 91 675 10 88',
  TELEGRAM_MASTER_URL: 'https://t.me/eldor6ek',   // личный Telegram мастера: ВСЕ кнопки «Написать / Заказать»
  TELEGRAM_URL: 'https://t.me/elnurleather',      // канал/группа: только контакты и подвал
  INSTAGRAM_URL: 'https://www.instagram.com/elnurleather/',
  FACEBOOK_URL: 'https://www.facebook.com/elnurleather',
  EMAIL: 'eldorbek@gmail.com',

  /* ---------- КАРТА ----------
     Пока пусто: сайт показывает адреса текстом и кнопку «Уточнить дорогу у мастера».
     Вставьте ссылку на точную метку (Google Maps / Яндекс Карты) — появится кнопка маршрута.
     Если ссылка вида https://www.google.com/maps/embed?... — появится и сама карта. */
  MAP_WORKSHOP_URL: '',
  MAP_SHOP_URL: '',

  /* ---------- ЗАКАЗЫ ----------
     'telegram' — концепт (GitHub Pages без сервера): текст заказа копируется в буфер, открывается чат с мастером.
     'server'   — отправка через server.py (/api/order) ботом; нужен сервер и config/telegram.json. */
  ORDER_MODE: 'telegram',
  ORDER_ENDPOINT: '/api/order',

  SHOW_SAXOVAT: false  // «Saxovat uyi»: показывать ТОЛЬКО с согласия владельца
};
