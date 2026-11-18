/*
  ИЗДЕЛИЯ САЙТА — единственный источник для главной, каталога и страницы товара.
  Добавить изделие: скопируйте блок, поменяйте id, фото (положите в img/), названия и описания.
  price: {mode:'from'|'fixed'|'approx'|'ask', key:'<ключ из config.js PRICES или hat>'}
    from  — «от N»   fixed — «N»   approx — «≈ N · цена примерная»   ask — «Узнать цену» (Telegram)
  builder: параметры конструктора (i = изделие, l = кожа, t = нитка, h = фурнитура). Нет поля — кнопки «Изменить в конструкторе» не будет.
  Описания: только то, что видно на фото и подтверждено; ничего не выдумываем.
*/
window.CATEGORIES = ['strap', 'belt', 'wallet', 'bag', 'hat', 'set'];
window.PRODUCTS = [
 {id:'strap-kroko', cat:'strap', img:['strap-croco'], price:{mode:'from', key:'strap'}, builder:'i=strap&l=2&t=2',
  n:{uz:'Kroko bosma tasma', ru:'Ремешок «кроко»', en:'Croc-embossed strap'},
  d:{uz:'Krokodil terisi naqshi bosilgan qora charm, qora ip bilan tikilgan.',
     ru:'Чёрная кожа с тиснением под крокодила, чёрная строчка.',
     en:'Black leather with a crocodile-skin embossing and black stitching.'}},
 {id:'strap-zamsh', cat:'strap', img:['strap-suede'], price:{mode:'from', key:'strap'}, builder:'i=strap&l=1&t=0',
  n:{uz:'Zamsh tasma', ru:'Замшевый ремешок', en:'Suede strap'},
  d:{uz:'Toʻq jigarrang zamsh, och rangli ip bilan.', ru:'Тёмно-коричневая замша, светлая строчка.', en:'Dark brown suede with light stitching.'}},
 {id:'strap-perforatsiya', cat:'strap', img:['strap-nature'], price:{mode:'from', key:'strap'}, builder:'i=strap&l=3&t=0',
  n:{uz:'Perforatsiyali tasma', ru:'Ремешок с перфорацией', en:'Perforated strap'},
  d:{uz:'Tabiiy rangdagi teshikchali charm, yashil ip.', ru:'Кожа натурального цвета с перфорацией, зелёная строчка.', en:'Natural-tan leather with perforation and green stitching.'}},
 {id:'strap-qora', cat:'strap', img:['strap-black'], price:{mode:'from', key:'strap'}, builder:'i=strap&l=2&t=2',
  n:{uz:'Qora klassik tasma', ru:'Чёрный классический ремешок', en:'Classic black strap'},
  d:{uz:'Silliq qora charm, qora ip.', ru:'Гладкая чёрная кожа, чёрная строчка.', en:'Smooth black leather with black stitching.'}},
 {id:'strap-matoviy', cat:'strap', img:['strap-matte'], price:{mode:'from', key:'strap'}, builder:'i=strap&l=2&t=2&h=0',
  n:{uz:'Qora matoviy tasma', ru:'Чёрный матовый ремешок', en:'Matte black strap'},
  d:{uz:'Matoviy qora charm, kumush rangli toʻqa.', ru:'Матовая чёрная кожа, серебристая пряжка.', en:'Matte black leather with a silver-tone buckle.'}},
 {id:'belt', cat:'belt', img:['belt'], price:{mode:'approx', key:'belt'}, builder:'i=belt&l=1&t=0&h=1',
  n:{uz:'Latun toʻqali kamar', ru:'Ремень с латунной пряжкой', en:'Belt with a brass buckle'},
  d:{uz:'Qoʻlda tikilgan charm kamar, latun rangli toʻqa.', ru:'Кожаный ремень ручной работы с латунной пряжкой.', en:'Handmade leather belt with a brass buckle.'}},
 {id:'wallet-bifold', cat:'wallet', img:['wallet-bifold'], price:{mode:'approx', key:'wallet'}, builder:'i=wallet&l=0&t=0',
  n:{uz:'Jigarrang hamyon (bifold)', ru:'Коричневый кошелёк-бифолд', en:'Brown bifold wallet'},
  d:{uz:'Ikki xil charmdan, qoʻlda tikilgan jigarrang hamyon.', ru:'Коричневый кошелёк из двух видов кожи, прошит вручную.', en:'Brown wallet in two kinds of leather, stitched by hand.'}},
 {id:'wallet-emboss', cat:'wallet', img:['emboss'], price:{mode:'approx', key:'wallet'}, builder:'i=wallet&l=2&t=2',
  n:{uz:'Bosma naqshli hamyon', ru:'Кошелёк с тиснением', en:'Embossed wallet'},
  d:{uz:'Bosma naqshli qora charm hamyon.', ru:'Кошелёк из чёрной кожи с тиснёным узором.', en:'Black leather wallet with an embossed pattern.'}},
 {id:'cardholders', cat:'wallet', img:['table'], price:{mode:'approx', key:'card'}, builder:'i=card&l=0&t=0',
  n:{uz:'Kartxolderlar', ru:'Картхолдеры', en:'Card holders'},
  d:{uz:'Turli rangdagi qoʻlda tikilgan kartxolderlar.', ru:'Картхолдеры ручной работы разных цветов.', en:'Handmade card holders in different colours.'}},
 {id:'bag-tote', cat:'bag', img:['bag-tote'], price:{mode:'ask'},
  n:{uz:'Ikatli sumka-tout', ru:'Сумка-тоут с икатом', en:'Ikat tote bag'},
  d:{uz:'Ikat matosi va charm birga tikilgan sumka.', ru:'Сумка из ткани икат и кожи.', en:'A bag that combines ikat fabric and leather.'}},
 {id:'bag-backpack', cat:'bag', img:['bag-backpack'], price:{mode:'ask'},
  n:{uz:'Ikatli ryukzak', ru:'Рюкзак с икатом', en:'Ikat backpack'},
  d:{uz:'Ikat matosi va charmdan tikilgan ryukzak.', ru:'Рюкзак из ткани икат и кожи.', en:'A backpack made from ikat fabric and leather.'}},
 {id:'hat', cat:'hat', img:['hat-full','hat-detail'], price:{mode:'fixed', key:'hat'},
  n:{uz:'Kovboy shlyapasi', ru:'Ковбойская шляпа', en:'Cowboy hat'},
  d:{uz:'Jigarrang charm shlyapa, toʻqilgan bogʻichi bor.', ru:'Шляпа из коричневой кожи с плетёным ремешком.', en:'Brown leather hat with a braided band.'}},
 {id:'set-black', cat:'set', img:['set-black'], price:{mode:'ask'},
  n:{uz:'Qora erkaklar toʻplami', ru:'Чёрный мужской набор', en:'Black men’s set'},
  d:{uz:'Molniyali hamyon, kamar, chexol va kartxolder — qora charmdan.', ru:'Кошелёк на молнии, ремень, чехол и картхолдер из чёрной кожи.', en:'Zip wallet, belt, case and card holder in black leather.'}}
];
