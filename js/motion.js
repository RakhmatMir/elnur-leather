/* Анимации: поэтапное появление блоков, «шторка» на фото, лёгкий параллакс, переход между страницами.
   Анимируются только transform / opacity / clip-path. При prefers-reduced-motion и без скрипта всё видно сразу. */
(function(){
'use strict';
var doc = document.documentElement;
window.__mot = 1;
var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var pt = document.querySelector('.pt');

/* ---------- вход на страницу после перехода ---------- */
if(pt && doc.classList.contains('pt-in')){
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    pt.classList.add('out'); doc.classList.remove('pt-in');
    setTimeout(function(){pt.classList.remove('out')},520);
  })});
}
window.addEventListener('pageshow',function(e){
  if(e.persisted && pt){pt.classList.remove('on','out'); doc.classList.remove('pt-in')}
});

if(reduced){doc.classList.add('nomotion'); return}
if(!('IntersectionObserver' in window)){doc.classList.add('nomotion'); return}

/* ---------- появление по частям ---------- */
var seen = new WeakSet(), io = new IntersectionObserver(function(entries){
  var vis = entries.filter(function(e){return e.isIntersecting}).map(function(e){return e.target});
  vis.sort(function(a,b){return (a.compareDocumentPosition(b) & 4) ? -1 : 1});
  vis.forEach(function(el,i){
    el.style.setProperty('--d',Math.min(i,8)*75+'ms');
    el.classList.add('in'); io.unobserve(el);
    if(el.classList.contains('rv')) setTimeout(function(){el.classList.remove('rv')},2200+i*75);
  });
},{rootMargin:'0px 0px -6% 0px',threshold:0.06});

function scan(root){
  root = root || document;
  var list = [].slice.call(root.querySelectorAll('.rv, .cur'));
  if(root.matches && root.matches('.rv, .cur')) list.push(root);
  list.forEach(function(el){if(!seen.has(el)){seen.add(el); io.observe(el)}});
}
window.ElMotion = {scan:scan};
scan(document);

/* ---------- параллакс ---------- */
var par = [].slice.call(document.querySelectorAll('[data-par]')), tick = false;
function run(){
  tick = false; var vh = window.innerHeight;
  par.forEach(function(el){
    var img = el.querySelector('img'); if(!img) return;
    var r = el.getBoundingClientRect(); if(r.bottom < -50 || r.top > vh+50) return;
    var k = (r.top + r.height/2 - vh/2) / vh;
    img.style.translate = '0 '+(k * -22).toFixed(1)+'px';
  });
}
if(par.length){
  addEventListener('scroll',function(){if(!tick){tick = true; requestAnimationFrame(run)}},{passive:true});
  addEventListener('resize',run); run();
}

/* ---------- переход между страницами ---------- */
/* Если браузер умеет межстраничные View Transitions (@view-transition в CSS), работает он; иначе — оливковая шторка. */
var vt = 'CSSViewTransitionRule' in window;
if(!vt && pt){
  document.addEventListener('click',function(e){
    if(e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if(!a) return;
    if((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var u; try{u = new URL(a.href,location.href)}catch(x){return}
    var same = u.protocol === location.protocol && (u.protocol === 'file:' || u.origin === location.origin);
    if(!same || !/\.html$|\/$/.test(u.pathname)) return;
    if(u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault();
    try{sessionStorage.setItem('pt','1')}catch(x){}
    pt.classList.add('on');
    setTimeout(function(){location.href = a.href},380);
  });
}
})();
