/* Общее для всех страниц: язык UZ/RU/EN, меню, контакты, цены, формы заказа (концепт: текст в буфер + чат мастера). */
(function(){
'use strict';
var C = window.ELNUR, D = window.I18N;
var $ = function(s,r){return (r||document).querySelector(s)};
var $$ = function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var LANGS = ['uz','ru','en'];
var lang = 'uz', cbs = [], isReady = false;

function tr(k,v,l){
  l = l || lang;
  var s = (D[l] && D[l][k] != null) ? D[l][k] : (D.uz[k] != null ? D.uz[k] : k);
  if(v && typeof s === 'string') s = s.replace(/\{(\w+)\}/g,function(m,n){return v[n]!=null?v[n]:m});
  return s;
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(n,l){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,(l||lang)==='en'?',':' ')}

/* ---------- цены: одно правило для всего сайта ---------- */
function priceNum(key){return key==='hat' ? C.HAT_PRICE : C.PRICES[key]}
function confirmed(key){return C.CONFIRMED.indexOf(key) > -1}
/* mode: from | fixed | approx | ask; возвращает {text, note, approx} */
function priceInfo(mode,key,l){
  if(mode==='ask') return {text:tr('p.ask',null,l),note:'',ask:true};
  var p = fmt(priceNum(key),l);
  if(mode==='from') return {text:tr('p.from',{p:p},l),note:''};
  if(mode==='fixed' || confirmed(key)) return {text:tr('p.fixed',{p:p},l),note:''};
  return {text:tr('p.approx',{p:p},l),note:tr('p.note',null,l),approx:true};
}
function itemPrice(item,l){return priceInfo(item==='strap'?'from':'approx',item,l)}
function priceHtml(i,withNote){return '<span class="pv">'+esc(i.text)+'</span>'+((withNote&&i.note)?' <span class="pn">· '+esc(i.note)+'</span>':'')}
function prodPrice(p,l){return priceInfo(p.price.mode,p.price.key,l)}

var WEBP_W = {"bag-backpack":[361],"bag-tote":[640],"bag-woman":[640],"belt":[800,1280],"emboss":[800,1600],"hat-detail":[800,1012],"hat-full":[720],"emboss-logo":[700],"master":[800,1600],"process":[357],"set-black":[630],"shop":[800,1600],"strap-black":[800,900],"strap-croco":[800,900],"strap-matte":[800,900],"strap-nature":[800,900],"strap-suede":[800,900],"table":[800,1600],"wallet-bifold":[574]};
/* Фото в WebP: <picture> с запасным JPG. Список ширин WebP — по файлам (как в img/). */
function picSrcset(name){var ws = WEBP_W[name]; return ws ? ws.map(function(w){return 'img/'+name+'-'+w+'.webp '+w+'w'}).join(', ') : ''}
function picHtml(name, attrs, sizes){
  var ss = picSrcset(name);
  return '<picture>'+(ss ? '<source type="image/webp" srcset="'+ss+'" sizes="'+sizes+'">' : '')+'<img src="img/'+name+'.jpg" '+attrs+'></picture>';
}
function setPic(img, name){
  var pic = img.parentNode, src = pic && pic.tagName === 'PICTURE' ? pic.querySelector('source') : null;
  if(src) src.srcset = picSrcset(name);
  img.src = 'img/'+name+'.jpg';
}

var EL = window.EL = {
  get lang(){return lang}, maxW: function(n){var w = WEBP_W[n]; return w ? w[w.length-1] : 0}, t: tr, cfg: C, esc: esc, fmt: fmt, $: $, $$: $$,
  priceInfo: priceInfo, itemPrice: itemPrice, priceHtml: priceHtml, prodPrice: prodPrice,
  pic: picHtml, setPic: setPic,
  onLang: function(cb){cbs.push(cb); if(isReady) cb(lang)},
  ready: function(){isReady = true; cbs.forEach(function(cb){cb(lang)})}
};

/* ---------- ссылки ---------- */
function setLinks(){
  var m = {master:C.TELEGRAM_MASTER_URL, channel:C.TELEGRAM_URL, ig:C.INSTAGRAM_URL, fb:C.FACEBOOK_URL, mail:'mailto:'+C.EMAIL, tel:'tel:'+C.PHONE_TEL,
           'route-ws':C.MAP_WORKSHOP_URL, 'route-sh':C.MAP_SHOP_URL};
  $$('[data-link]').forEach(function(a){
    var h = m[a.dataset.link]; if(!h) return;
    a.href = h; if(/^https?:/.test(h)){a.target = '_blank'; a.rel = 'noopener'}
    if(/^route-/.test(a.dataset.link)) a.hidden = false;
  });
  var anyRoute = !!(C.MAP_WORKSHOP_URL || C.MAP_SHOP_URL);
  $$('[data-noroute]').forEach(function(e){e.hidden = anyRoute});
  $$('[data-map]').forEach(function(box){
    var u = box.dataset.map === 'ws' ? C.MAP_WORKSHOP_URL : C.MAP_SHOP_URL;
    if(u && /\/maps\/embed/.test(u)){var f = $('iframe',box); f.src = u; box.hidden = false}
  });
  $$('[data-phone]').forEach(function(e){e.textContent = C.PHONE_VIEW});
  $$('[data-email]').forEach(function(e){e.textContent = C.EMAIL});
  $$('[data-sax]').forEach(function(e){e.hidden = !C.SHOW_SAXOVAT});
}

/* ---------- язык ---------- */
function applyMeta(){
  var meta = window.PAGE_META && (window.PAGE_META[lang] || window.PAGE_META.uz);
  if(!meta) return;
  document.title = meta[0];
  [['meta[name=description]',meta[1]],['meta[property="og:title"]',meta[0]],['meta[property="og:description"]',meta[1]]].forEach(function(x){var e = $(x[0]); if(e) e.content = x[1]});
}
EL.applyMeta = applyMeta;
function applyLang(){
  document.documentElement.lang = lang;
  $$('[data-t]').forEach(function(e){e.textContent = tr(e.dataset.t)});
  $$('[data-ph]').forEach(function(e){e.placeholder = tr(e.dataset.ph)});
  $$('[data-aria]').forEach(function(e){e.setAttribute('aria-label', tr(e.dataset.aria))});
  $$('[data-alt]').forEach(function(e){e.setAttribute('alt', tr(e.dataset.alt))});
  $$('[data-set]').forEach(function(b){b.setAttribute('aria-pressed', b.dataset.set === lang)});
  $$('[data-price]').forEach(function(e){e.textContent = tr('p.plus',{p:fmt(e.dataset.price==='box'?C.BOX_PRICE:C.ENGRAVE_PRICE)})});
  $$('.fb-name[data-empty]').forEach(function(e){if(!e.dataset.file) e.textContent = tr(e.dataset.empty)});
  if(window.PRODUCTS) $$('.js-price').forEach(function(e){
    var p = window.PRODUCTS.filter(function(x){return x.id===e.dataset.pid})[0]; if(p) e.textContent = prodPrice(p).text;
  });
  applyMeta(); renderFaq();
}
function renderFaq(){
  var box = $('#faq'); if(!box) return;
  var open = $$('details',box).map(function(d){return d.open});
  var h = '';
  for(var i = 1; i <= 4; i++) h += '<details><summary>'+esc(tr('faq.'+i+'q'))+'</summary><p>'+esc(tr('faq.'+i+'a'))+'</p></details>';
  box.innerHTML = h;
  $$('details',box).forEach(function(d,i){d.open = !!open[i]});
}
function setLang(l, save){
  if(LANGS.indexOf(l) < 0) l = 'uz';
  lang = l;
  if(save !== false){ try{localStorage.setItem('elnur-lang', l)}catch(e){} }
  applyLang();
  cbs.forEach(function(cb){cb(lang)});
}

/* ---------- буфер обмена ---------- */
function copyText(text){
  return new Promise(function(res){
    function legacy(){
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly',''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select(); try{ta.setSelectionRange(0,99999)}catch(e){}
      var ok = false; try{ok = document.execCommand('copy')}catch(e){}
      ta.remove(); return ok;
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      try{navigator.clipboard.writeText(text).then(function(){res(true)}, function(){res(legacy())})}catch(e){res(legacy())}
    } else res(legacy());
  });
}
EL.copyText = copyText;
function toast(msg){
  var t = $('.toast') || document.body.appendChild(Object.assign(document.createElement('div'),{className:'toast',role:'status'}));
  t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(function(){t.classList.remove('on')},4200);
}
EL.toast = toast;

/* ---------- заказ (концепт): текст в буфер + чат мастера ---------- */
function orderNo(){var d = new Date(), p = function(n){return (n<10?'0':'')+n}; return 'EL-'+p(d.getMonth()+1)+p(d.getDate())+'-'+(100+Math.floor(Math.random()*900))}
function digits(s){return String(s||'').replace(/\D/g,'')}
function phoneOk(s){var d = digits(s); return d.length === 9 || (d.length === 12 && d.indexOf('998') === 0)}
function phoneNice(s){var d = digits(s); if(d.length === 9) d = '998'+d; return '+'+d.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,'$1 $2 $3 $4 $5')}
function openChat(){window.open(C.TELEGRAM_MASTER_URL,'_blank','noopener')}
EL.openChat = openChat;

/* текст заказа — всегда по-узбекски (язык мастера) */
function buildText(kind,p,no){
  var u = function(k,v){return tr(k,v,'uz')}, L = [], add = function(l,v){if(v) L.push(l+': '+v)};
  if(kind === 'corporate'){
    L.push('Kompaniya arizasi № '+no);
    add('Kompaniya',p.company); add('Aloqa uchun shaxs',p.name); add('Telefon',p.phone); add('Buyumlar',p.goods); add('Soni',p.qty); add('Muddat',p.deadline); add('Izoh',p.comment);
  } else if(kind === 'product'){
    L.push('Buyurtma № '+no);
    add('Buyum',p.item.name); add('Narx',p.item.price); add('Havola',p.item.link);
    add('Ism',p.name); add('Telefon',p.phone); add('Izoh',p.comment);
  } else {
    var o = p.order; L.push('Buyurtma № '+no);
    add('Buyum',o.item); add('Charm',o.leather); add('Ip',o.thread); add('Toʻqa / tugma',o.hardware); add('Oʻlcham',o.size); add('Yozuv',o.engraving); add('Sovgʻa qutisi',o.box?'ha':'');
    add('Narx',o.priceText); add('Havola',o.link);
    add('Ism',p.name); add('Telefon',p.phone); add('Bogʻlanish',p.contact); add('Shahar',p.city); add('Izoh',p.comment);
  }
  L.push('Manba: sayt');
  return L.join('\n');
}

function showThanks(box,state){
  var th = $('.thanks',box); if(!th) return;
  function render(){
    var s = state, ok = s.copied;
    th.innerHTML =
      '<h2 class="h3">'+esc(tr('ok.h'))+'</h2>'+
      '<p class="no">'+esc(tr('ok.no',{no:s.no}))+'</p>'+
      '<p class="hint-ok">'+esc(tr(ok===false?'ok.hintfail':'ok.hint'))+'</p>'+
      (s.hasFile?'<p class="fine">'+esc(tr('ok.photo'))+'</p>':'')+
      '<div class="row"><button type="button" class="btn btn-primary" data-act="copy">'+esc(tr(s.again?'ok.copied':(s.copied===false?'ok.copy1':'ok.copy')))+'</button>'+
      '<a class="btn btn-line" href="'+esc(C.TELEGRAM_MASTER_URL)+'" target="_blank" rel="noopener">'+esc(tr('ok.open'))+'</a>'+
      '<a class="link" href="index.html">'+esc(tr('ok.home'))+'</a></div>'+
      '<details class="otext"'+(ok===false?' open':'')+'><summary>'+esc(tr('ok.text'))+'</summary><textarea readonly rows="9"></textarea></details>'+
      '<p class="fine">'+esc(tr('ok.again'))+'</p>';
    var ta = $('textarea',th); ta.value = s.text;
    $('[data-act=copy]',th).onclick = function(){
      var b = this; copyText(s.text).then(function(r){s.copied = r; s.again = r; if(r){b.textContent = tr('ok.copied')} else {render()}});
    };
    ta.onfocus = function(){ta.select()};
  }
  box._thanks = render; render();
  if(!box._thanksLang){box._thanksLang = true; EL.onLang(function(){if(box._thanks) box._thanks()})}
  th.classList.add('on');
  $$('[data-hide-on-ok]',box).forEach(function(e){e.hidden = true});
  var f = $('form',box); if(f) f.hidden = true;
  th.scrollIntoView({behavior:'smooth',block:'start'});
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) th.setAttribute('tabindex','-1');
  th.focus({preventScroll:true});
}

function initForm(form){
  var kind = form.dataset.kind, box = form.closest('[data-formbox]') || form.parentNode;
  var fileInput = $('input[type=file]',form), busy = false;
  function bad(name,on){var f = form.elements[name]; if(f){var w = f.closest('.fld'); if(w) w.classList.toggle('bad',!!on)}}
  if(fileInput) fileInput.addEventListener('change',function(){
    var nm = $('.fb-name',form), f = fileInput.files[0];
    if(f){nm.textContent = f.name; nm.dataset.file = '1'} else {delete nm.dataset.file; nm.textContent = tr(nm.dataset.empty)}
  });
  form.addEventListener('submit',function(ev){
    ev.preventDefault(); if(busy) return;
    var f = form.elements, ok = true;
    if(f.name){var v = f.name.value.trim().length < 2; bad('name',v); if(v) ok = false}
    var pv = !phoneOk(f.phone.value); bad('phone',pv); if(pv) ok = false;
    var file = fileInput && fileInput.files[0];
    if(file && file.size > 10*1024*1024){fileInput.closest('.fld').classList.add('bad'); ok = false}
    else if(fileInput) fileInput.closest('.fld').classList.remove('bad');
    var order = (kind === 'order' && window.ElnurOrderData) ? window.ElnurOrderData() : null;
    var item = (kind === 'product' && window.ElnurProductData) ? window.ElnurProductData() : null;
    if(kind === 'order' && !order) ok = false;
    if(!ok){var first = $('.fld.bad input, .fld.bad textarea',form); if(first) first.focus(); return}

    var p = {phone:phoneNice(f.phone.value), name:f.name?f.name.value.trim():''};
    ['city','comment','company','goods','qty','deadline'].forEach(function(k){if(f[k]) p[k] = f[k].value.trim()});
    if(f.contact){var c = form.querySelector('input[name=contact]:checked'); p.contact = c ? tr(c.value==='tg'?'f.tg':'f.callopt',null,'uz') : ''}
    if(order) p.order = order; if(item) p.item = item;
    var no = orderNo(), text = buildText(kind,p,no);

    if(C.ORDER_MODE === 'server'){
      busy = true;
      fetch(C.ORDER_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:kind,lang:lang,text:text,phone:p.phone,name:p.name,website:(f.website||{}).value||''})})
        .then(function(r){return r.json()}).catch(function(){return {ok:false}}).then(function(r){
          busy = false;
          if(r && r.ok) showThanks(box,{no:r.number||no,text:text,copied:true,hasFile:false});
          else showThanks(box,{no:no,text:text,copied:false,hasFile:!!file});
        });
      return;
    }
    /* всё синхронно в обработчике нажатия: буфер, затем чат (иначе браузер заблокирует окно) */
    var state = {no:no,text:text,copied:null,hasFile:!!file};
    var cp = copyText(text);
    openChat();
    showThanks(box,state);
    cp.then(function(r){state.copied = r; if(box._thanks) box._thanks()});
  });
  form.addEventListener('input',function(e){var w = e.target.closest && e.target.closest('.fld'); if(w) w.classList.remove('bad')});
}

/* ---------- сводка заявки для компаний ---------- */
function initCorpSummary(){
  var form = $('#corpForm'), dl = $('#corpSum'); if(!form || !dl) return;
  var keys = [['company','g.company'],['name','g.person'],['phone','g.phone'],['goods','g.goods'],['qty','g.qty'],['deadline','g.deadline'],['comment','g.comment']];
  function upd(){
    var h = '';
    keys.forEach(function(k){var v = form.elements[k[0]].value.trim(); if(v) h += '<div><dt>'+esc(tr(k[1]))+'</dt><dd>'+esc(v)+'</dd></div>'});
    dl.innerHTML = h || '<p class="empty">'+esc(tr('g.empty'))+'</p>';
  }
  form.addEventListener('input',upd); EL.onLang(upd);
}

/* ---------- запуск ---------- */
function init(){
  var saved = null; try{saved = localStorage.getItem('elnur-lang')}catch(e){}
  var q = new URLSearchParams(location.search).get('lang');
  lang = LANGS.indexOf(q) > -1 ? q : (LANGS.indexOf(saved) > -1 ? saved : 'uz');
  setLinks(); applyLang();
  $$('[data-set]').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.set)})});

  var mb = $('.menu-btn'), dr = $('#drawer');
  if(mb){mb.addEventListener('click',function(){var o = dr.classList.toggle('open'); mb.setAttribute('aria-expanded',o)});
    document.addEventListener('keydown',function(e){if(e.key === 'Escape' && dr.classList.contains('open')){dr.classList.remove('open'); mb.setAttribute('aria-expanded',false); mb.focus()}})}

  $$('form[data-kind]').forEach(initForm);
  initCorpSummary();

  /* плавающие кнопки: прячем при вводе в форму и у подвала; показываем после прокрутки */
  var root = document.documentElement;
  document.addEventListener('focusin',function(e){if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) root.classList.add('typing')});
  document.addEventListener('focusout',function(){root.classList.remove('typing')});
  var st = 0;
  function sc(){root.classList.toggle('scrolled',window.scrollY > 500); root.classList.add('moving'); clearTimeout(st); st = setTimeout(function(){root.classList.remove('moving')},700)}
  addEventListener('scroll',sc,{passive:true}); sc();
  var ft = $('.h-foot');
  if(ft && 'IntersectionObserver' in window) new IntersectionObserver(function(es){root.classList.toggle('at-foot',es[0].isIntersecting)}).observe(ft);

  EL.ready();
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
