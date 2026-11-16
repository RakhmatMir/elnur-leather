/* Одностраничник «экран за экраном»: каждый экран = высота окна (100vh).
   Колесо / свайп / клавиши / точки / меню меняют экран целиком, между экранами проезжает оливковая шторка.
   Если экран на телефоне выше окна, сначала прокручивается он сам, потом переключается следующий. */
(function(){
'use strict';
var scr=[].slice.call(document.querySelectorAll('.scr')), dots=document.getElementById('dots'), bar=document.getElementById('lbar');
var wipe=document.getElementById('wipe'), wipeName=document.getElementById('wipeName');
var lightIds={build:1,menu:1}, cur=-1, busy=false, lock=0;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* общий фон на весь сайт: у каждого экрана своё фото, при смене экрана оно плавно проявляется и чуть сдвигается (как в образце Burger Street) */
var sbg=document.getElementById('sbg'), sbgWrap=document.getElementById('sbgWrap'), bgOf=[], bgLayers=[], bgCur=-1;
scr.forEach(function(s,k){
  var im=s.querySelector(':scope>.bg');
  if(im){var d=document.createElement('div');d.className='sbg-l';d.style.backgroundImage='url("'+im.getAttribute('src')+'")';sbgWrap.appendChild(d);bgOf[k]=bgLayers.length;bgLayers.push(d);im.remove();s.classList.add('has-bg')}
  else bgOf[k]=-1;
  var deco=document.createElement('div');deco.className='deco';deco.setAttribute('aria-hidden','true');
  [].forEach.call(s.querySelectorAll(':scope>.mosaic'),function(el){deco.appendChild(el)});
  if(deco.children.length) s.insertBefore(deco,s.firstChild);
});
function showBg(k){
  var i=bgOf[k]; sbg.classList.toggle('off',i<0);
  if(i<0||i===bgCur) return;
  if(bgCur>-1) bgLayers[bgCur].classList.remove('on');
  bgCur=i; bgLayers[i].classList.add('on');
  sbgWrap.style.transform='translate('+((k%2?1:-1)*2)+'%,'+(((k%3)-1)*2.5)+'%) scale('+(1.04+(k%3)*0.03)+') rotate('+(k%2?.6:-.6)+'deg)';
}

/* текст, который проявляется по словам / по буквам; пересобирается после смены языка */
function splitWords(el){
  var txt=el.textContent; el.setAttribute('aria-label',txt); el.textContent='';
  txt.split(/\s+/).forEach(function(w,i){var sp=document.createElement('span');sp.className='w';sp.setAttribute('aria-hidden','true');sp.textContent=w;sp.style.setProperty('--d',(0.25+i*0.06)+'s');el.appendChild(sp);el.appendChild(document.createTextNode(' '))});
}
function splitChars(el){
  var txt=el.textContent; el.setAttribute('aria-label',txt); el.textContent='';
  [].forEach.call(txt,function(c,i){var sp=document.createElement('span');sp.className='ch';sp.setAttribute('aria-hidden','true');sp.textContent=c===' '?' ':c;sp.style.setProperty('--d',(0.15+i*0.05)+'s');el.appendChild(sp)});
}
var man=document.querySelector('.man'), year=document.querySelector('.year');
if(year) splitChars(year);
if(window.EL&&man) EL.onLang(function(){splitWords(man)});

/* части экрана появляются по очереди */
scr.forEach(function(s){
  var parts=s.querySelectorAll('.kick,h2,.tag,.ctas,.track,.builder,.build-text>p,.year,.band-t,.gt,.gifts .btn,.mlist li,.places,.visit-pic,.picks-head .arrows,.gift-pic');
  [].forEach.call(parts,function(p,i){p.setAttribute('data-in','');p.style.transitionDelay=(0.1+Math.min(i,8)*0.08)+'s'});
  var a=document.createElement('a');a.href='#'+s.id;a.setAttribute('aria-label',s.dataset.name||s.id);
  var sp=document.createElement('span');sp.textContent=s.dataset.name||'';a.appendChild(sp);dots.appendChild(a);
});
var links=[].slice.call(dots.children), nav=[].slice.call(document.querySelectorAll('.lnav a'));

function show(i){
  scr.forEach(function(s,k){
    var on=k===i;
    s.classList.toggle('cur',on);
    if(!on) s.classList.remove('on');
    links[k].classList.toggle('on',on);
    s.setAttribute('aria-hidden',on?'false':'true');
  });
  var s=scr[i]; s.scrollTop=0; showBg(i);
  document.body.classList.toggle('nofab',s.id==='build'||s.id==='visit');
  var light=!!lightIds[s.id];
  dots.classList.toggle('light',light); bar.classList.toggle('light',light);
  nav.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+s.id)});
  if(cur>-1&&cur!==i) flashDots();
  cur=i;
  try{history.replaceState(null,'','#'+s.id)}catch(e){}
}
function enter(i){ requestAnimationFrame(function(){ scr[i].classList.add('on') }); setTimeout(function(){scr[i].classList.add('on')},50); }

function go(i){
  if(i<0||i>=scr.length||i===cur||busy) return false;
  var dir=i>cur?1:-1;
  if(cur<0){ show(i); enter(i); return true; }
  busy=true;
  wipeName.textContent=scr[i].dataset.name||'';
  wipe.className='wipe';
  wipe.style.transformOrigin=dir>0?'50% 100%':'50% 0%';
  wipe.style.transform='scaleY(0)';
  void wipe.offsetWidth;
  wipe.className='wipe go-in'; wipe.style.transform='scaleY(1)';
  setTimeout(function(){
    show(i);
    wipe.className='wipe';
    wipe.style.transformOrigin=dir>0?'50% 0%':'50% 100%';
    void wipe.offsetWidth;
    wipe.className='wipe go-out'; wipe.style.transform='scaleY(0)';
    setTimeout(function(){enter(i)},200);
    setTimeout(function(){busy=false},620);
  },500);
  return true;
}

/* экран, который сам прокручивается (на телефоне) — сначала листаем его */
function scrollsInside(el,dir){
  var box=el&&el.closest&&el.closest('.scr'); if(!box||box.scrollHeight<=box.clientHeight+2) return false;
  return dir>0 ? box.scrollTop+box.clientHeight<box.scrollHeight-2 : box.scrollTop>2;
}
addEventListener('wheel',function(e){
  if(e.ctrlKey) return;
  var dy=e.deltaY; if(Math.abs(e.deltaX)>Math.abs(dy)) return;
  var dir=dy>0?1:-1;
  if(scrollsInside(e.target,dir)) return;
  e.preventDefault();
  var now=performance.now();
  if(busy||now<lock){lock=Math.max(lock,now+160);return}
  if(Math.abs(dy)<6) return;
  if(go(cur+dir)) lock=now+1300;
},{passive:false});

var t0=null;
addEventListener('touchstart',function(e){if(e.target.closest&&e.target.closest('#dots')){t0=null;return}var p=e.touches[0];t0={x:p.clientX,y:p.clientY,el:e.target,top:(e.target.closest&&e.target.closest('.scr')||{}).scrollTop||0}},{passive:true});
addEventListener('touchend',function(e){
  if(!t0||(e.target.closest&&e.target.closest('#dots'))) return; var p=e.changedTouches[0], dx=t0.x-p.clientX, dy=t0.y-p.clientY, st=t0; t0=null;
  if(Math.abs(dx)>Math.abs(dy)||Math.abs(dy)<55) return;
  var dir=dy>0?1:-1, box=st.el.closest&&st.el.closest('.scr');
  if(box&&box.scrollHeight>box.clientHeight+2){
    var atEnd=dir>0?box.scrollTop+box.clientHeight>=box.scrollHeight-2:box.scrollTop<=2;
    var wasEnd=dir>0?st.top+box.clientHeight>=box.scrollHeight-2:st.top<=2;
    if(!(atEnd&&wasEnd)) return;
  }
  go(cur+dir);
},{passive:true});

addEventListener('keydown',function(e){
  if(/input|textarea|select/i.test((e.target||{}).tagName||'')) return;
  var k=e.key, d=0;
  if(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey)) d=1;
  else if(k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey)) d=-1;
  else if(k==='Home'){e.preventDefault();go(0);return}
  else if(k==='End'){e.preventDefault();go(scr.length-1);return}
  if(!d) return;
  var box=scr[cur];
  e.preventDefault();
  if(scrollsInside(box,d)){ box.scrollBy({top:d*box.clientHeight*0.8,behavior:reduce?'auto':'smooth'}); return; }
  go(cur+d);
});

/* точки справа: подписи скрыты; при смене экрана видны 1 с и гаснут за 1 с;
   мышка — «волна» (точка под курсором шире, текст дальше от края); палец — касание показывает названия, зажать и вести — выбор экрана */
var flashT1,flashT2,hideT;
function flashDots(){
  if(dots.classList.contains('show')) return;
  clearTimeout(flashT1);clearTimeout(flashT2);
  dots.classList.remove('fade');dots.classList.add('flash');
  flashT1=setTimeout(function(){dots.classList.add('fade');dots.classList.remove('flash');flashT2=setTimeout(function(){dots.classList.remove('fade')},1050)},1000);
}
function setWave(y){
  links.forEach(function(a){
    var r=a.getBoundingClientRect(), d=y==null?99:Math.abs(y-(r.top+r.height/2))/r.height;
    var g=Math.max(0,1-d/2.6);
    a.style.setProperty('--g',g.toFixed(3));
    a.style.setProperty('--o',(g<.2?0:Math.min(1,g*g*1.15)).toFixed(3));
    a.classList.toggle('near',d<.5);
  });
}
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  dots.addEventListener('mousemove',function(e){dots.classList.add('hov');setWave(e.clientY)});
  dots.addEventListener('mouseleave',function(){dots.classList.remove('hov');setWave(null)});
}
function linkAt(y){
  var best=0,bd=1e9; links.forEach(function(a,k){var r=a.getBoundingClientRect(),d=Math.abs(y-(r.top+r.height/2));if(d<bd){bd=d;best=k}}); return best;
}
var tt=null;
function pick(k){ links.forEach(function(a,j){a.classList.toggle('pick',j===k)}); dots.classList.toggle('has-pick',k>-1); }
function hideLater(ms){ clearTimeout(hideT); hideT=setTimeout(function(){dots.classList.add('fade');dots.classList.remove('show');pick(-1);setTimeout(function(){dots.classList.remove('fade')},1050)},ms); }
dots.addEventListener('touchstart',function(e){
  var p=e.touches[0]; clearTimeout(hideT);
  tt={y:p.clientY,t:performance.now(),was:dots.classList.contains('show')||dots.classList.contains('flash'),moved:false,k:linkAt(p.clientY)};
  dots.classList.remove('fade','flash'); dots.classList.add('show');
  tt.hold=setTimeout(function(){ if(tt){tt.moved=true; pick(tt.k); if(navigator.vibrate) navigator.vibrate(8);} },320);
},{passive:true});
dots.addEventListener('touchmove',function(e){
  if(!tt) return; e.preventDefault();
  var p=e.touches[0];
  if(Math.abs(p.clientY-tt.y)>8) tt.moved=true;
  if(tt.moved){ var k=linkAt(p.clientY); if(k!==tt.k&&navigator.vibrate) navigator.vibrate(6); tt.k=k; pick(k); }
},{passive:false});
dots.addEventListener('touchend',function(e){
  if(!tt) return; e.preventDefault(); clearTimeout(tt.hold);
  var t=tt; tt=null;
  if(t.moved||t.was){ pick(-1); go(t.k); hideLater(900); }
  else hideLater(2500);
},{passive:false});
dots.addEventListener('touchcancel',function(){ if(tt){clearTimeout(tt.hold);tt=null} hideLater(600); });

/* все ссылки вида #id ведут на свой экран */
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href^="#"]'); if(!a) return;
  var id=a.getAttribute('href').slice(1), i=scr.findIndex(function(s){return s.id===id});
  if(i>=0){e.preventDefault();go(i)}
});

/* карусель */
var tr=document.getElementById('track');
[].forEach.call(document.querySelectorAll('.arrows .arr'),function(b){
  b.addEventListener('click',function(){var li=tr.querySelector('li');tr.scrollBy({left:(+b.dataset.dir)*(li.offsetWidth+22)*2,behavior:'smooth'})});
});

/* конструктор по шагам (на телефоне и невысоких экранах видна одна вкладка) */
var ctl=document.querySelector('#mini .controls'), tabs=ctl?[].slice.call(ctl.querySelectorAll('.btabs button')):[];
function setStep(n){ ctl.setAttribute('data-step',n); tabs.forEach(function(b){b.setAttribute('aria-selected',b.dataset.st==n)}); }
tabs.forEach(function(b){b.addEventListener('click',function(){setStep(b.dataset.st)})});

/* каждый экран строго в одно окно: если содержимое выше окна — плавно уменьшаем его (zoom) до размера окна */
function kidsOf(s){return [].filter.call(s.children,function(c){return !c.classList.contains('deco')&&getComputedStyle(c).position!=='absolute'})}
function need(s){
  if(s.id!=='build'||!ctl) return s.scrollHeight;
  var keep=ctl.getAttribute('data-step'), h=0;
  ['1','2','3'].forEach(function(n){ctl.setAttribute('data-step',n);h=Math.max(h,s.scrollHeight)});
  ctl.setAttribute('data-step',keep); return h;
}
function fit(){
  scr.forEach(function(s){
    var kids=kidsOf(s), st=s.scrollTop;
    kids.forEach(function(k){k.style.zoom='';k.style.width=''});
    var H=s.clientHeight, z=1, wide=kids.length===1||getComputedStyle(s).flexDirection==='column';
    for(var t=0;t<4;t++){
      var h=need(s); if(h<=H+1) break;
      z=Math.max(.45,z*(H/h)*0.995);
      kids.forEach(function(k){k.style.zoom=z;if(wide)k.style.width=(100/z)+'%'});
    }
    s.classList.toggle('fitted',z<1); s.scrollTop=st;
  });
}
var fitT; function refit(){clearTimeout(fitT);fitT=setTimeout(fit,120)}
addEventListener('resize',refit);
if(window.EL) EL.onLang(refit);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
addEventListener('load',fit);
fit();

/* старт: экран из адреса (#build и т. п.) или первый */
var start=scr.findIndex(function(s){return '#'+s.id===location.hash});
show(start<0?0:start);
var loader=document.getElementById('loader'), t0l=performance.now();
function ready(){
  var wait=Math.max(0,900-(performance.now()-t0l));
  setTimeout(function(){loader.classList.add('done');enter(cur);setTimeout(function(){loader.remove()},700)},wait);
}
if(document.readyState==='complete') ready(); else addEventListener('load',ready);
setTimeout(function(){if(document.body.contains(loader)) ready()},4000);
})();
