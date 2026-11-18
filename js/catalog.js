/* Каталог: ремешки на главной, страница каталога с фильтром, страница товара. Данные — js/products.js, цены — js/config.js. */
(function(){
'use strict';
var EL = window.EL, P = window.PRODUCTS, CATS = window.CATEGORIES, C = window.ELNUR;
var $ = EL.$, $$ = EL.$$, esc = EL.esc;
var BASE = 'https://rakhmatmir.github.io/elnur-leather/';
function name(p){return p.n[EL.lang] || p.n.uz}
function desc(p){return p.d[EL.lang] || p.d.uz}
function byId(id){return P.filter(function(p){return p.id === id})[0]}
function href(p){return 'mahsulot.html?id='+encodeURIComponent(p.id)}
function cardHtml(p,i){
  var pr = EL.prodPrice(p);
  return '<li class="pcard" data-cat="'+p.cat+'"><a class="pc-link" href="'+href(p)+'">'+
    '<span class="pc-img cur">'+EL.pic(p.img[0], 'alt="'+esc(name(p))+'" loading="lazy" width="900" height="900"', '(max-width: 768px) 50vw, 25vw')+'</span>'+
    '<span class="pc-name">'+esc(name(p))+'</span>'+
    '<span class="pc-price">'+EL.priceHtml(pr,false)+(pr.note ? '<small class="pn">'+esc(pr.note)+'</small>' : '<small class="pn">&nbsp;</small>')+'</span></a></li>';
}

/* ---------- главная: ремешки ---------- */
function initStraps(box){
  function render(){
    var list = P.filter(function(p){return p.cat === 'strap'});
    box.innerHTML = list.map(cardHtml).join('') +
      '<li class="pcard more on-dark"><b>'+esc(EL.t('s.more'))+'</b><p>'+esc(EL.t('hm.ss'))+'</p><a class="btn btn-light btn-sm" href="konstruktor.html?i=strap">'+esc(EL.t('hm.cta'))+'</a></li>';
    if(window.ElMotion) window.ElMotion.scan(box);
  }
  EL.onLang(render);
}

/* ---------- каталог ---------- */
function initCatalog(grid){
  var fl = $('#filters'), cur = (location.hash || '#all').slice(1);
  var cats = CATS.filter(function(c){return P.some(function(p){return p.cat === c})});
  if(cats.indexOf(cur) < 0) cur = 'all';
  function apply(){
    $$('.fchip',fl).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f === cur)});
    $$('.pcard[data-cat]',grid).forEach(function(li){li.hidden = cur !== 'all' && li.dataset.cat !== cur});
    fill();
  }
  function fill(){
    var more = $('.pcard.more',grid); if(!more) return;
    more.style.gridColumn = '';
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    var n = $$('.pcard[data-cat]',grid).filter(function(li){return !li.hidden}).length, rem = n % cols;
    if(rem) more.style.gridColumn = 'span '+(cols-rem);
  }
  function render(){
    fl.innerHTML = ['all'].concat(cats).map(function(c){
      return '<button type="button" class="fchip" data-f="'+c+'" aria-pressed="false">'+esc(EL.t(c === 'all' ? 'cat.all' : 'cat.'+c))+'</button>';
    }).join('');
    $$('.fchip',fl).forEach(function(b){b.onclick = function(){cur = b.dataset.f; try{history.replaceState(null,'',cur === 'all' ? location.pathname : '#'+cur)}catch(e){} apply()}});
    grid.innerHTML = P.map(cardHtml).join('')+'<li class="pcard more on-dark"><b>'+esc(EL.t('cat.more'))+'</b><a class="btn btn-light btn-sm" data-link="master" href="'+esc(C.TELEGRAM_MASTER_URL)+'" target="_blank" rel="noopener">'+esc(EL.t('th.tg'))+'</a></li>';
    apply();
    if(window.ElMotion) window.ElMotion.scan(grid);
  }
  window.addEventListener('resize',fill);
  window.addEventListener('hashchange',function(){var h = location.hash.slice(1); cur = cats.indexOf(h) > -1 ? h : 'all'; apply()});
  EL.onLang(render);
}

/* ---------- страница товара ---------- */
function initProduct(){
  var id = new URLSearchParams(location.search).get('id'), p = byId(id);
  var pd = $('#pd'), miss = $('#pdMissing');
  if(!p){miss.hidden = false; var ar = $('#crumbArr'); if(ar) ar.hidden = true; return}
  pd.hidden = false;
  var img = $('#pdImg'), th = $('#pdThumbs'), idx = 0;
  function setImg(i){
    idx = i; EL.setPic(img, p.img[i]);
    var mw = EL.maxW(p.img[i]); img.style.maxWidth = mw ? Math.round(mw*1.1)+'px' : '';
    $$('button',th).forEach(function(b,k){b.setAttribute('aria-pressed',k === i)});
  }
  th.innerHTML = p.img.length > 1 ? p.img.map(function(f,i){return '<button type="button" data-i="'+i+'" aria-label="'+(i+1)+'">'+EL.pic(f, 'alt="" width="96" height="96"', '96px')+'</button>'}).join('') : '';
  $$('button',th).forEach(function(b){b.onclick = function(){setImg(+b.dataset.i)}});
  setImg(0);
  var form = $('#pdForm'), orderBtn = $('#pdOrder'), isAsk = p.price.mode === 'ask';
  window.ElnurProductData = function(){
    var pr = EL.priceInfo(p.price.mode,p.price.key,'uz');
    return {name:p.n.uz, price:isAsk ? '' : pr.text+(pr.note ? ' · '+pr.note : ''), link:location.href.split('#')[0]};
  };
  orderBtn.onclick = function(){
    if(isAsk){
      var msg = EL.t('pd.askmsg',{n:p.n.uz},'uz');
      EL.copyText(msg+'\n'+location.href.split('#')[0]).then(function(ok){EL.toast(EL.t(ok ? 'ok.hint' : 'ok.hintfail'))});
      EL.openChat(); return;
    }
    form.hidden = false;
    form.scrollIntoView({behavior:'smooth',block:'center'});
    var f = $('input[name=name]',form); if(f) setTimeout(function(){f.focus({preventScroll:true})},450);
  };
  var bl = $('#pdBuild'); if(p.builder){bl.hidden = false; bl.href = 'konstruktor.html?'+p.builder+'#kb'}

  function render(){
    var pr = EL.prodPrice(p), n = name(p);
    $('#crumbName').textContent = n;
    img.alt = n;
    $('#pdCat').textContent = EL.t('cat.'+p.cat);
    $('#pdName').textContent = n;
    var pp = $('#pdPrice'); pp.classList.toggle('ask',!!pr.ask);
    if(pr.ask) pp.innerHTML = '<span class="pn">'+esc(EL.t('pd.askprice'))+'</span>'; else pp.innerHTML = EL.priceHtml(pr,true);
    var sp = $('#pdSpec'); sp.hidden = p.cat !== 'strap'; sp.textContent = EL.t('pd.strapw');
    $('#pdSteps').innerHTML = [1,2,3].map(function(k){return '<li>'+esc(EL.t((isAsk?'pd.a':'pd.s')+k))+'</li>'}).join('');
    $('#pdDesc').textContent = desc(p);
    $('span',orderBtn).textContent = EL.t(isAsk ? 'pd.ask' : 'pd.order');
    window.PAGE_META = {};
    ['uz','ru','en'].forEach(function(l){window.PAGE_META[l] = [p.n[l]+' — El-Nur Leathercraft', p.d[l]]});
    EL.applyMeta();
    var u = BASE+'mahsulot.html?id='+p.id;
    [['link[rel=canonical]','href',u],['meta[property="og:url"]','content',u],['meta[property="og:image"]','content',BASE+'img/'+p.img[0]+'.jpg'],['meta[name="twitter:image"]','content',BASE+'img/'+p.img[0]+'.jpg']].forEach(function(x){var e = $(x[0]); if(e) e.setAttribute(x[1],x[2])});
    /* похожие: сначала из той же категории */
    var rel = P.filter(function(x){return x.id !== p.id && x.cat === p.cat}).concat(P.filter(function(x){return x.id !== p.id && x.cat !== p.cat})).slice(0,3);
    $('#relGrid').innerHTML = rel.map(cardHtml).join('');
    $('#pdRel').hidden = !rel.length;
    if(window.ElMotion) window.ElMotion.scan($('#pdRel'));
  }
  EL.onLang(render);
}

var s = $('#straps'), g = $('#grid'), pd = $('#pd');
if(s) initStraps(s);
if(g) initCatalog(g);
if(pd) initProduct();
})();
