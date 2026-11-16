/* Главная v2: появление первого экрана, шторка на главном фото, ряд ремешков с прогрессом. */
(function(){
'use strict';
var hero=document.querySelector('.h-hero'), sh=document.querySelector('.shutter');
function open(){ if(hero) hero.classList.add('in'); if(sh) sh.classList.add('open'); }
var img=sh&&sh.querySelector('img');
if(img && !img.complete){ img.addEventListener('load',function(){setTimeout(open,30)}); setTimeout(open,1200); }
else setTimeout(open,60);

var row=document.getElementById('straps'), bar=document.getElementById('prog');
if(row && bar){
  function upd(){
    var max=row.scrollWidth-row.clientWidth, vis=row.clientWidth/row.scrollWidth;
    bar.style.width=(vis*100)+'%';
    var p=max>0?row.scrollLeft/max:0;
    bar.style.transform='translateX('+(p*(1/vis-1)*100)+'%)';
  }
  row.addEventListener('scroll',upd,{passive:true}); window.addEventListener('resize',upd); upd();
  [].forEach.call(document.querySelectorAll('.straps-nav .sq'),function(b){
    b.addEventListener('click',function(){row.scrollBy({left:(+b.dataset.dir)*312,behavior:'smooth'})});
  });
}
/* параллакс */
var par=[].slice.call(document.querySelectorAll('[data-par]'));
if(par.length && !(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
  var tick=false;
  function run(){tick=false;var vh=innerHeight;par.forEach(function(el){var r=el.parentNode.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;var k=(r.top+r.height/2-vh/2)/vh;el.style.transform='translateY('+(k*-36).toFixed(1)+'px) scale(1.12)'})}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(run)}},{passive:true});run();
}
})();
