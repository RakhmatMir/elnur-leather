/* Общее для всех страниц: язык UZ/RU/EN, меню, контакты из config.js, появление блоков, FAQ, фильтры, формы заявок. */
(function(){
'use strict';
var C = window.ELNUR, D = window.I18N;
var $ = function(s,r){return (r||document).querySelector(s)};
var $$ = function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var allowed = (document.body.dataset.langs||'uz,ru').split(',');
var lang = 'uz', cbs = [], isReady = false;

function tr(k,v,l){
  l = l || lang;
  var s = (D[l] && D[l][k] != null) ? D[l][k] : (D.uz[k] != null ? D.uz[k] : k);
  if(v && typeof s === 'string') s = s.replace(/\{(\w+)\}/g,function(m,n){return v[n]!=null?v[n]:m});
  return s;
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

var EL = window.EL = {
  get lang(){return lang}, t: tr, cfg: C,
  onLang: function(cb){cbs.push(cb); if(isReady) cb(lang)},
  ready: function(){isReady = true; cbs.forEach(function(cb){cb(lang)})}
};

/* ---------- ссылки на контакты ---------- */
function mapUrl(q){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}
function setLinks(){
  var m = {tg:C.TELEGRAM_URL, ig:C.INSTAGRAM_URL, fb:C.FACEBOOK_URL, mail:'mailto:'+C.EMAIL, tel:'tel:'+C.PHONE_TEL,
           'route-ws':mapUrl(C.MAP_WORKSHOP_Q), 'route-sh':mapUrl(C.MAP_SHOP_Q)};
  $$('[data-link]').forEach(function(a){var h=m[a.dataset.link]; if(h) a.href=h; if(/^https?:/.test(h)){a.target='_blank';a.rel='noopener'}});
  $$('[data-phone]').forEach(function(e){e.textContent=C.PHONE_VIEW});
  $$('[data-email]').forEach(function(e){e.textContent=C.EMAIL});
  $$('[data-sax]').forEach(function(e){e.hidden=!C.SHOW_SAXOVAT});
}

/* ---------- язык ---------- */
function applyLang(){
  var d = document.documentElement; d.lang = lang;
  $$('[data-t]').forEach(function(e){e.textContent = tr(e.dataset.t)});
  $$('[data-h]').forEach(function(e){
    e.innerHTML = tr(e.dataset.h,{tg:C.TELEGRAM_URL,tel:C.PHONE_TEL,phone:C.PHONE_VIEW});
  });
  $$('[data-ph]').forEach(function(e){e.placeholder = tr(e.dataset.ph)});
  $$('[data-aria]').forEach(function(e){e.setAttribute('aria-label', tr(e.dataset.aria))});
  $$('[data-noen]').forEach(function(e){e.hidden = (lang==='en')});
  $$('[data-set]').forEach(function(b){
    b.hidden = allowed.indexOf(b.dataset.set) < 0;
    b.setAttribute('aria-pressed', b.dataset.set === lang);
  });
  var meta = window.PAGE_META && (window.PAGE_META[lang] || window.PAGE_META.uz);
  if(meta){
    document.title = meta[0];
    var md = $('meta[name=description]'); if(md) md.content = meta[1];
    var og = $('meta[property="og:title"]'); if(og) og.content = meta[0];
    var od = $('meta[property="og:description"]'); if(od) od.content = meta[1];
  }
  renderFaq();
}
function renderFaq(){
  var box = $('#faq'); if(!box) return;
  var list = (D[lang] && D[lang].faq) || D.uz.faq;
  box.innerHTML = list.map(function(f){return '<details><summary>'+esc(f[0])+'</summary><p>'+esc(f[1])+'</p></details>'}).join('');
}
function setLang(l, save){
  if(allowed.indexOf(l) < 0) l = 'uz';
  lang = l;
  if(save !== false){ try{localStorage.setItem('elnur-lang', l)}catch(e){} }
  applyLang();
  cbs.forEach(function(cb){cb(lang)});
}

document.addEventListener('DOMContentLoaded', function(){
  var saved = 'uz'; try{saved = localStorage.getItem('elnur-lang') || 'uz'}catch(e){}
  lang = allowed.indexOf(saved) > -1 ? saved : 'uz';
  setLinks(); applyLang();
  $$('[data-set]').forEach(function(b){b.addEventListener('click', function(){setLang(b.dataset.set)})});

  var mb = $('.menu-btn'), dr = $('#drawer');
  if(mb) mb.addEventListener('click', function(){var o = dr.classList.toggle('open'); mb.setAttribute('aria-expanded', o)});

  /* появление блоков при прокрутке */
  var rv = $$('.rv');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in'); io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(e){io.observe(e)});
  } else rv.forEach(function(e){e.classList.add('in')});

  /* ленивые карты */
  $$('iframe[data-q]').forEach(function(f){
    f.src = 'https://www.google.com/maps?q='+encodeURIComponent(C[f.dataset.q])+'&output=embed';
  });

  /* фильтры каталога */
  var fl = $('#filters');
  if(fl){
    $$('.fchip', fl).forEach(function(b){b.addEventListener('click', function(){
      $$('.fchip', fl).forEach(function(x){x.setAttribute('aria-pressed', x===b)});
      $$('[data-cat]').forEach(function(t){t.hidden = b.dataset.f !== 'all' && t.dataset.cat !== b.dataset.f});
    })});
  }

  /* формы заявок */
  $$('form[data-kind]').forEach(initForm);

  /* если builder.js не подключён — отдаём управление сами */
  if(!window.__builderLoaded && !$('script[src*="builder.js"]')) EL.ready();
});

/* ================= отправка заявок ================= */
function digits(s){return String(s||'').replace(/\D/g,'')}
function phoneOk(s){var d = digits(s); return d.length === 9 || (d.length === 12 && d.indexOf('998') === 0)}
function phoneNice(s){var d = digits(s); if(d.length === 9) d = '998'+d; return '+'+d.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,'$1 $2 $3 $4 $5')}

function readPhoto(file){
  return new Promise(function(res, rej){
    if(!file) return res(null);
    var r = new FileReader();
    r.onload = function(){res({name:file.name, type:file.type, data:String(r.result).split(',')[1]})};
    r.onerror = rej; r.readAsDataURL(file);
  });
}
function send(payload){
  var ctl = new AbortController(), to = setTimeout(function(){ctl.abort()}, 25000);
  return fetch(C.ORDER_ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:ctl.signal})
    .then(function(r){return r.json().then(function(j){return j}, function(){return {ok:false, reason:'bad_response'}})})
    .catch(function(){return {ok:false, reason:'network'}})
    .then(function(j){clearTimeout(to); return j});
}
EL.send = send;

function plain(p){
  var o = p.order, L = [];
  if(p.type === 'corporate'){
    L.push('KORPORATIV / Корпоративная заявка');
    ['company','person','phone','goods','qty','deadline','comment'].forEach(function(k){if(p[k]) L.push(k+': '+p[k])});
  } else {
    L.push('Buyurtma / Заказ — saytdan / с сайта');
    if(o) L.push(o.item+' · '+o.leather+' · '+o.thread+(o.hardware?' · '+o.hardware:'')+(o.size?' · '+o.size:'')+(o.engraving?' · «'+o.engraving+'»':'')+(o.box?' · sovgʻa qutisi':'')+' · ≈ '+o.price+' soʻm');
    if(o && o.link) L.push(o.link);
    ['name','phone','contact','city','comment'].forEach(function(k){if(p[k]) L.push(k+': '+p[k])});
  }
  return L.join('\n');
}

function initForm(form){
  var kind = form.dataset.kind, box = form.closest('[data-formbox]') || form.parentNode;
  var fail = $('.fail', box), thanks = $('.thanks', box), btn = $('button[type=submit]', form), busy = false;
  var fileInput = $('input[type=file]', form);
  function bad(name, on){var f = form.elements[name]; if(f){var w = f.closest('.fld'); if(w) w.classList.toggle('bad', !!on)}}

  form.addEventListener('submit', function(ev){
    ev.preventDefault(); if(busy) return;
    var f = form.elements, ok = true;
    if(f.name){var v = f.name.value.trim().length < 2; bad('name', v); if(v) ok = false}
    var pv = !phoneOk(f.phone.value); bad('phone', pv); if(pv) ok = false;
    var file = fileInput && fileInput.files[0];
    if(file && file.size > 10*1024*1024){
      var w = fileInput.closest('.fld'); w.classList.add('bad'); ok = false;
    } else if(fileInput){fileInput.closest('.fld').classList.remove('bad')}
    if(!ok){var first = $('.fld.bad input, .fld.bad textarea', form); if(first) first.focus(); return}

    var p = {type:kind, lang:lang, phone:phoneNice(f.phone.value), website:(f.website||{}).value||''};
    ['name','city','comment','company','person','goods','qty','deadline'].forEach(function(k){if(f[k]) p[k] = f[k].value.trim()});
    if(f.contact){var c = form.querySelector('input[name=contact]:checked'); p.contact = c ? tr(c.value==='tg'?'f.tg':'f.callopt','', 'uz') : ''}
    if(kind === 'order' && window.ElnurOrderData) p.order = window.ElnurOrderData();

    busy = true; btn.disabled = true; var label = btn.textContent; btn.textContent = tr('f.sending');
    if(fail) fail.classList.remove('on');
    readPhoto(file).then(function(photo){ if(photo) p.photo = photo; return send(p); }).then(function(r){
      busy = false; btn.disabled = false; btn.textContent = label;
      if(r && r.ok){
        form.hidden = true;
        $$('[data-hide-on-ok]', box).forEach(function(e){e.hidden = true});
        if(thanks){
          if(kind === 'order'){
            $('.th-h', thanks).textContent = tr('th.h');
            $('.th-t', thanks).innerHTML = tr('th.t',{no:esc(r.number||'')});
            $('.th-s', thanks).textContent = tr('th.save');
          } else {
            $('.th-h', thanks).textContent = tr('k.ok.h');
            $('.th-t', thanks).textContent = tr('k.ok.t');
          }
          thanks.classList.add('on');
          thanks.scrollIntoView({behavior:'smooth', block:'center'});
        }
      } else if(fail){
        /* заявка не ушла: токен не вписан / нет сервера / нет интернета — предлагаем написать в Telegram напрямую */
        $('.fail-t', fail).textContent = tr(kind === 'order' ? 'e.fail' : 'k.fail');
        var cp = $('.copy', fail);
        if(cp){cp.hidden = (kind !== 'order'); cp.textContent = tr('e.copy'); cp.onclick = function(){
          var done = function(){cp.textContent = tr('e.copied')};
          if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(plain(p)).then(done, function(){prompt('', plain(p))});
          else prompt('', plain(p));
        }}
        var tg = $('.tgbtn', fail); if(tg){tg.textContent = tr('e.failbtn'); tg.href = C.TELEGRAM_URL}
        fail.classList.add('on');
        fail.scrollIntoView({behavior:'smooth', block:'center'});
      }
    });
  });
  form.addEventListener('input', function(e){var w = e.target.closest && e.target.closest('.fld'); if(w) w.classList.remove('bad')});
}
})();
