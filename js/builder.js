/* Конструктор: общее ядро (картинка, цена, адрес-состояние), мини-конструктор на главной, карточки «Популярное»
   и полная страница конструктора. Цены — из js/config.js. */
(function(){
'use strict';
var C = window.ELNUR, EL = window.EL;
var ITEMS = ['strap','belt','wallet','card'];
var LEATHER = ['#9A5B2E','#4A2F20','#22221F','#C9AA82','#6A2330','#5C6833'];
var THREAD = ['#E8DCBF','#FBFAF5','#151513','#B33B2E','#D9A63A'];
var HW = ['#BFC1BC','#C9A44E','#2A2A28'];
var $ = function(s,r){return (r||document).querySelector(s)};
var $$ = function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var fmt = function(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')};
var t = function(k,v){return EL.t(k,v)};

function def(){return {item:'strap',leather:0,thread:0,hw:0,size:'',sizeMode:'waist',model:'',engr:'',engrOn:false,box:false}}
function hasHw(it){return it!=='card'}
function hasSize(it){return it!=='card'}
function total(S){
  var p=C.PRICES[S.item];
  if(S.engrOn&&S.engr) p+=C.ENGRAVE_PRICE;
  if(S.box) p+=C.BOX_PRICE;
  return p;
}
function itemPrice(it,lang){
  var p=fmt(C.PRICES[it]);
  if(it==='strap') return EL.t('fromfmt',{p:p},lang);
  return EL.t('apxfmt',{p:p},lang);
}
function lum(hex){var n=parseInt(hex.slice(1),16);return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ---- картинка изделия (плоская схема, как в варианте 2) ---- */
function art(S){
  var L=LEATHER[S.leather], T=THREAD[S.thread], H=HW[S.hw], id=S.item;
  var ink=lum(L)>0.55?'rgba(38,30,20,.55)':'rgba(255,245,225,.72)';
  var txt=(S.engrOn?S.engr:'').toUpperCase();
  var s='', vb;
  if(id==='strap'||id==='belt'){
    var belt=id==='belt', x=belt?16:56, w=belt?488:408, h=belt?58:64, y=120-h/2;
    s+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(belt?10:h/2)+'" fill="'+L+'"/>';
    s+='<rect x="'+(x+10)+'" y="'+(y+9)+'" width="'+(w-20)+'" height="'+(h-18)+'" rx="'+(belt?6:(h-18)/2)+'" fill="none" stroke="'+T+'" stroke-width="2.4" stroke-dasharray="7 6"/>';
    var bx=x+22;
    s+='<rect x="'+bx+'" y="'+(y-14)+'" width="40" height="'+(h+28)+'" rx="9" fill="none" stroke="'+H+'" stroke-width="7"/>';
    s+='<line x1="'+(bx+20)+'" y1="120" x2="'+(bx+78)+'" y2="120" stroke="'+H+'" stroke-width="6" stroke-linecap="round"/>';
    var hx=x+w-(belt?140:110);
    for(var i=0;i<(belt?5:4);i++) s+='<circle cx="'+(hx+i*24)+'" cy="120" r="4.2" fill="rgba(0,0,0,.35)"/>';
    if(txt) s+='<text x="'+(x+w/2-10)+'" y="128" text-anchor="middle" font-family="Lora,serif" font-weight="600" font-size="22" letter-spacing="3" fill="'+ink+'">'+esc(txt)+'</text>';
    vb=belt?'4 52 512 136':'40 52 440 136';
  } else {
    var wal=id==='wallet', W=wal?250:190, Hh=wal?168:124, X=260-W/2, Y=120-Hh/2;
    s+='<rect x="'+X+'" y="'+Y+'" width="'+W+'" height="'+Hh+'" rx="16" fill="'+L+'"/>';
    s+='<rect x="'+(X+10)+'" y="'+(Y+10)+'" width="'+(W-20)+'" height="'+(Hh-20)+'" rx="10" fill="none" stroke="'+T+'" stroke-width="2.4" stroke-dasharray="7 6"/>';
    if(wal){
      s+='<path d="M'+X+' '+(Y+58)+' H'+(X+W-40)+' a14 14 0 0 1 0 28 H'+X+'" fill="rgba(0,0,0,.14)"/>';
      s+='<circle cx="'+(X+W-40)+'" cy="'+(Y+72)+'" r="8" fill="'+H+'"/>';
    } else {
      s+='<path d="M'+(X+30)+' '+(Y+36)+' Q260 '+(Y+58)+' '+(X+W-30)+' '+(Y+36)+'" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="3" stroke-linecap="round"/>';
    }
    if(txt) s+='<text x="260" y="'+(Y+Hh-30)+'" text-anchor="middle" font-family="Lora,serif" font-weight="600" font-size="20" letter-spacing="3" fill="'+ink+'">'+esc(txt)+'</text>';
    vb='96 24 328 192';
  }
  return {svg:s,vb:vb};
}
function paint(svgEl,S){var a=art(S);svgEl.innerHTML=a.svg;svgEl.setAttribute('viewBox',a.vb);svgEl.setAttribute('aria-label',t('b.art'))}

/* ---- состояние <-> адрес ---- */
function toParams(S){
  var p=new URLSearchParams();
  p.set('i',S.item);p.set('l',S.leather);p.set('t',S.thread);
  if(hasHw(S.item)) p.set('h',S.hw);
  if(S.size) p.set('s',S.size);
  if(S.item==='belt'&&S.size) p.set('m',S.sizeMode);
  if(S.item==='wallet'&&S.model) p.set('mo',S.model);
  if(S.engrOn&&S.engr) p.set('e',S.engr);
  if(S.box) p.set('b','1');
  return p.toString();
}
function fromParams(q){
  var S=def(),p=new URLSearchParams(q||location.search);
  var n=function(k,max){var v=parseInt(p.get(k),10);return (v>=0&&v<max)?v:0};
  if(ITEMS.indexOf(p.get('i'))>-1) S.item=p.get('i');
  S.leather=n('l',LEATHER.length);S.thread=n('t',THREAD.length);S.hw=n('h',HW.length);
  var s=p.get('s')||'';
  if(S.item==='strap'&&/^(18|20|22|24|x)$/.test(s)) S.size=s;
  if(S.item==='belt'&&/^\d{2,3}$/.test(s)) S.size=s;
  if(p.get('m')==='old') S.sizeMode='old';
  if(/^(classic|compact)$/.test(p.get('mo')||'')&&S.item==='wallet') S.model=p.get('mo');
  var e=(p.get('e')||'').replace(/[^\p{L}\p{N}. ʻ]/gu,'').slice(0,C.ENGRAVE_MAX);
  if(e){S.engr=e;S.engrOn=true}
  S.box=p.get('b')==='1';
  return S;
}

/* ---- плавное «докручивание» суммы ---- */
function counter(el,start){
  var shown=start||0;
  return function(to){
    var from=shown,t0=performance.now();
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){shown=to;el.textContent=fmt(to);return}
    function step(now){var p=Math.min(1,(now-t0)/320),e=1-Math.pow(1-p,3);el.textContent=fmt(Math.round((from+(to-from)*e)/1000)*1000);if(p<1)requestAnimationFrame(step);else{shown=to;el.textContent=fmt(to)}}
    requestAnimationFrame(step);
  };
}
function swatches(box,list,key,S,onPick,nameKey){
  box.innerHTML='';
  list.forEach(function(c,i){
    var b=document.createElement('button');b.type='button';b.className='sw';b.style.background=c;
    b.setAttribute('aria-label',t(nameKey+'.'+i));b.dataset.i=i;
    b.onclick=function(){S[key]=i;onPick()};box.appendChild(b);
  });
}
function markSw(box,idx){$$('.sw',box).forEach(function(b,i){b.setAttribute('aria-pressed',i===idx)})}
function chipList(S){
  var c=[t('i.'+S.item),t('l.'+S.leather),t('chip.thread',{c:t('t.'+S.thread).toLowerCase()})];
  if(hasHw(S.item)) c.push(t(S.item==='wallet'?'chip.snap':'chip.buckle',{c:t('hw.'+S.hw).toLowerCase()}));
  var sz=sizeLabel(S);if(sz) c.push(sz);
  if(S.engrOn&&S.engr) c.push('«'+S.engr.toUpperCase()+'»');
  if(S.box) c.push(t('chip.box'));
  return c;
}
function sizeLabel(S,lang){
  if(S.item==='strap'&&S.size) return S.size==='x'?EL.t('kb.unknown',null,lang):S.size+' '+(((lang||EL.lang)==='ru')?'мм':'mm');
  if(S.item==='belt'&&S.size) return S.size+' '+EL.t('kb.cm',null,lang);
  if(S.item==='wallet'&&S.model) return EL.t(S.model==='classic'?'kb.classic':'kb.compact',null,lang).split(' — ')[0];
  return '';
}
function chipsHtml(S){return chipList(S).map(function(c){return '<span class="chip">'+esc(c)+'</span>'}).join('')}

/* ================= мини-конструктор на главной ================= */
function initMini(root){
  var S=def(),els={
    art:$('#art',root),chips:$('#chips',root),items:$('#items',root),leather:$('#leather',root),thread:$('#thread',root),
    ln:$('#leatherName',root),tn:$('#threadName',root),engr:$('#engr',root),cnt:$('#cnt',root),box:$('#box',root),
    sum:$('#sum',root),go:$('#miniGo',root)
  };
  var anim=counter(els.sum,C.PRICES.strap);
  function sync(){
    $$('.item',els.items).forEach(function(b,i){b.setAttribute('aria-pressed',ITEMS[i]===S.item)});
    markSw(els.leather,S.leather);markSw(els.thread,S.thread);
    els.ln.textContent=t('l.'+S.leather);els.tn.textContent=t('t.'+S.thread);
    paint(els.art,S);els.chips.innerHTML=chipsHtml(S);
    anim(total(S));
    els.go.href='konstruktor.html?'+toParams(S)+'#kb';
  }
  function render(){
    els.items.innerHTML='';
    ITEMS.forEach(function(it){
      var b=document.createElement('button');b.type='button';b.className='item';
      b.innerHTML='<b>'+esc(t('i.'+it))+'</b><small>'+esc(itemPrice(it))+'</small>';
      b.onclick=function(){S.item=it;sync()};els.items.appendChild(b);
    });
    swatches(els.leather,LEATHER,'leather',S,sync,'l');swatches(els.thread,THREAD,'thread',S,sync,'t');
    els.cnt.textContent=els.engr.value.length+' / '+C.ENGRAVE_MAX;
    sync();
  }
  els.engr.maxLength=C.ENGRAVE_MAX;
  els.engr.addEventListener('input',function(){
    els.engr.value=els.engr.value.replace(/[^\p{L}\p{N}. ʻ]/gu,'');
    S.engr=els.engr.value.trim();S.engrOn=!!S.engr;
    els.cnt.textContent=els.engr.value.length+' / '+C.ENGRAVE_MAX;sync();
  });
  els.box.addEventListener('change',function(){S.box=els.box.checked;sync()});
  EL.onLang(render);
}

/* ================= «Популярное» ================= */
/* Это не товары, а примеры сборки из конструктора (готовых изделий и их цен в материалах нет). */
var PRESETS=[
  {item:'belt',leather:0,thread:0,hw:0},
  {item:'strap',leather:2,thread:1,hw:2},
  {item:'wallet',leather:1,thread:0,hw:1},
  {item:'card',leather:5,thread:0,hw:0}
];
function initPopular(box){
  function render(){
    box.innerHTML='';
    PRESETS.forEach(function(p,k){
      var S=def();for(var x in p)S[x]=p[x];
      var a=art(S),q=toParams(S);
      var d=document.createElement('article');d.className='card rv d'+(k%4);
      d.innerHTML='<div class="im"><svg viewBox="'+a.vb+'" role="img" aria-label="'+esc(t('i.'+S.item)+', '+t('l.'+S.leather))+'">'+a.svg+'</svg></div>'+
        '<div class="nm"><b>'+esc(t('i.'+S.item))+'</b><span>'+esc(itemPrice(S.item))+'</span></div>'+
        '<div class="sub">'+esc(t('l.'+S.leather)+' · '+t('chip.thread',{c:t('t.'+S.thread).toLowerCase()}))+'</div>'+
        '<div class="acts"><a class="btn btn-primary" href="konstruktor.html?'+q+'&amp;go=1#kb">'+esc(t('p.order'))+'</a>'+
        '<a class="btn btn-line" href="konstruktor.html?'+q+'#kb">'+esc(t('p.change'))+'</a></div>';
      box.appendChild(d);
      requestAnimationFrame(function(){d.classList.add('in')});
    });
  }
  EL.onLang(render);
}

/* ================= страница конструктора ================= */
function initFull(root){
  var S=fromParams();
  var els={
    art:$('#kArt'),chips:$('#kChips'),stepTxt:$('#kStepTxt'),items:$('#kItems'),leather:$('#kLeather'),thread:$('#kThread'),
    hwBox:$('#kHw'),hwStep:$('#stHw'),hwTitle:$('#kHwTitle'),hwName:$('#kHwName'),
    sizeStep:$('#stSize'),sizeTitle:$('#kSizeTitle'),sizeBox:$('#kSize'),
    engrOn:$('#kEngrOn'),engrWrap:$('#kEngrWrap'),engr:$('#kEngr'),cnt:$('#kCnt'),engrFld:$('#kEngrFld'),engrErr:$('#kEngrErr'),
    box:$('#kBox'),ln:$('#kLeatherName'),tn:$('#kThreadName'),
    sum:$('#kSum'),sum2:$('#mSum'),need:$('#kNeed'),msg:$('#kMsg'),send:$('#kSend'),mSend:$('#mSend'),share:$('#kShare'),
    order:$('#order'),summary:$('#oSummary')
  };
  var anim=counter(els.sum,C.PRICES.strap),anim2=counter(els.sum2,C.PRICES.strap);
  var cm=C.ENGRAVE_MAX;

  function visibleSteps(){return $$('.step',root).filter(function(s){return !s.hidden})}
  function missing(){
    if(hasSize(S.item)&&!S.size) return {el:els.sizeStep,key:S.item==='strap'?'kb.s5strap':'kb.s5belt'};
    if(S.item==='wallet'&&!S.model) return {el:els.sizeStep,key:'kb.s5wallet'};
    return null;
  }
  function buildSize(){
    var b=els.sizeBox;b.innerHTML='';
    els.sizeStep.hidden=!hasSize(S.item);
    if(S.item==='strap'){
      els.sizeTitle.textContent=t('kb.s5strap');
      var h='<div class="pills" role="group">';
      ['18','20','22','24','x'].forEach(function(v){
        h+='<label class="pill"><input type="radio" name="sw" value="'+v+'"><span>'+esc(v==='x'?t('kb.unknown'):v+' '+(EL.lang==='ru'?'мм':'mm'))+'</span></label>';
      });
      h+='</div><details class="measure"><summary>'+esc(t('kb.measure'))+'</summary><p>'+esc(t('kb.strapmeasure'))+'</p></details>';
      b.innerHTML=h;
      $$('input',b).forEach(function(r){r.checked=r.value===S.size;r.onchange=function(){S.size=r.value;sync()}});
    } else if(S.item==='belt'){
      els.sizeTitle.textContent=t('kb.s5belt');
      b.innerHTML='<div class="pills" role="group"><label class="pill"><input type="radio" name="bm" value="waist"><span>'+esc(t('kb.waist'))+'</span></label>'+
        '<label class="pill"><input type="radio" name="bm" value="old"><span>'+esc(t('kb.oldbelt'))+'</span></label></div>'+
        '<div class="fld" id="kBeltFld"><div class="sizebox"><label class="field"><input id="kBelt" inputmode="numeric" maxlength="3" autocomplete="off" placeholder="95" aria-label="'+esc(t('kb.s5belt'))+'"></label><span>'+esc(t('kb.cm'))+'</span></div><p class="err">'+esc(t('kb.beltrr'))+'</p></div>'+
        '<p class="hint">'+esc(t('kb.beltmeasure'))+'</p>';
      /* ширина ремня: варианты не известны [уточнить у владельца] — шаг не показываем */
      $$('input[name=bm]',b).forEach(function(r){r.checked=r.value===S.sizeMode;r.onchange=function(){S.sizeMode=r.value;sync()}});
      var bi=$('#kBelt',b),bf=$('#kBeltFld',b);bi.value=S.size;
      bi.oninput=function(){bi.value=bi.value.replace(/\D/g,'');var n=parseInt(bi.value,10);
        S.size=(n>=40&&n<=200)?String(n):'';bf.classList.remove('bad');sync()};
      bi.onblur=function(){if(bi.value&&!S.size)bf.classList.add('bad')};
    } else if(S.item==='wallet'){
      els.sizeTitle.textContent=t('kb.s5wallet');
      b.innerHTML='<div class="pills" role="group"><label class="pill"><input type="radio" name="wm" value="classic"><span>'+esc(t('kb.classic'))+'</span></label>'+
        '<label class="pill"><input type="radio" name="wm" value="compact"><span>'+esc(t('kb.compact'))+'</span></label></div>';
      $$('input',b).forEach(function(r){r.checked=r.value===S.model;r.onchange=function(){S.model=r.value;sync()}});
    }
    /* картхолдер: варианты моделей не известны [уточнить у владельца] — шаг скрыт */
  }
  function buildItems(){
    els.items.innerHTML='';
    ITEMS.forEach(function(it){
      var b=document.createElement('button');b.type='button';b.className='item';
      b.innerHTML='<b>'+esc(t('i.'+it))+'</b><small>'+esc(itemPrice(it))+'</small>';
      b.onclick=function(){
        if(S.item===it) return;
        S.item=it;S.size='';S.model='';buildSize();sync();
      };
      els.items.appendChild(b);
    });
  }
  function sync(){
    $$('.item',els.items).forEach(function(b,i){b.setAttribute('aria-pressed',ITEMS[i]===S.item)});
    markSw(els.leather,S.leather);markSw(els.thread,S.thread);
    if(hasHw(S.item)){
      els.hwStep.hidden=false;
      els.hwTitle.textContent=t(S.item==='wallet'?'kb.s4s':'kb.s4b');
      markSw(els.hwBox,S.hw);els.hwName.textContent=t('hw.'+S.hw);
    } else els.hwStep.hidden=true;
    els.ln.textContent=t('l.'+S.leather);els.tn.textContent=t('t.'+S.thread);
    els.engrWrap.hidden=!S.engrOn;els.engrOn.checked=S.engrOn;els.box.checked=S.box;
    paint(els.art,S);els.chips.innerHTML=chipsHtml(S);
    var tt=total(S);anim(tt);anim2(tt);
    els.need.textContent='';
    updateCounter();
    try{history.replaceState(null,'','?'+toParams(S)+location.hash)}catch(e){}
  }
  function updateCounter(){
    var vs=visibleSteps(),cur=0,mid=window.innerHeight*0.4;
    vs.forEach(function(s,i){if(s.getBoundingClientRect().top<mid)cur=i});
    els.stepTxt.textContent=t('kb.stepof',{n:cur+1,t:vs.length});
  }
  function render(){
    buildItems();
    swatches(els.leather,LEATHER,'leather',S,sync,'l');swatches(els.thread,THREAD,'thread',S,sync,'t');
    swatches(els.hwBox,HW,'hw',S,sync,'hw');
    els.engr.value=S.engr;els.cnt.textContent=S.engr.length+' / '+cm;
    els.engrHint.textContent=t('kb.engrhint',{max:cm});
    buildSize();sync();
  }
  els.engrHint=$('#kEngrHint');
  els.engrOn.onchange=function(){S.engrOn=els.engrOn.checked;sync();if(S.engrOn)els.engr.focus()};
  els.box.onchange=function(){S.box=els.box.checked;sync()};
  els.engr.addEventListener('input',function(){
    var raw=els.engr.value,v=raw.replace(/[^\p{L}\p{N}. ʻ]/gu,''),err='';
    if(v!==raw) err='kb.engrchars';
    if(v.length>cm){v=v.slice(0,cm);err='kb.engrlong'}
    els.engr.value=v;S.engr=v.trim();
    els.engrFld.classList.toggle('bad',!!err);
    if(err) els.engrErr.textContent=t(err,{max:cm});
    els.cnt.textContent=v.length+' / '+cm;sync();
  });
  /* кнопки «Дальше/Назад» (телефон) */
  $$('[data-go]',root).forEach(function(b){b.onclick=function(){
    var vs=visibleSteps(),cur=vs.indexOf(b.closest('.step')),n=vs[cur+(b.dataset.go==='next'?1:-1)];
    if(n) n.scrollIntoView({behavior:'smooth',block:'start'});
  }});
  window.addEventListener('scroll',function(){requestAnimationFrame(updateCounter)},{passive:true});

  /* поделиться ссылкой */
  els.share.onclick=function(){
    var url=location.origin+location.pathname+'?'+toParams(S);
    if(location.protocol==='file:') url=location.href.split('#')[0];
    var done=function(){els.msg.textContent=t('kb.copiedlink')};
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done,function(){prompt('',url)});
    else prompt('',url);
  };

  /* кнопка «Отправить мастеру» → форма */
  function openOrder(){
    var m=missing();
    if(m){
      els.need.textContent=t('kb.need',{s:t(m.key)});
      m.el.scrollIntoView({behavior:'smooth',block:'center'});return;
    }
    els.summary.innerHTML='<b>'+esc(chipList(S).join(' · '))+'</b><br>'+esc(t('total'))+': '+esc(t('apxfmt',{p:fmt(total(S))}));
    els.order.hidden=false;
    els.order.scrollIntoView({behavior:'smooth',block:'start'});
    var f=$('input[name=name]',els.order);if(f) setTimeout(function(){f.focus({preventScroll:true})},500);
  }
  els.send.onclick=openOrder;els.mSend.onclick=openOrder;

  /* данные заказа для мастера (на узбекском — язык мастера) */
  window.ElnurOrderData=function(){
    var u=function(k,v){return EL.t(k,v,'uz')};
    var hw=hasHw(S.item)?u('hw.'+S.hw):'';
    var size='';
    if(S.item==='strap') size=S.size==='x'?u('kb.unknown'):S.size+' mm';
    if(S.item==='belt') size=S.size+' sm ('+u(S.sizeMode==='old'?'kb.oldbelt':'kb.waist').toLowerCase()+')';
    if(S.item==='wallet') size=S.model==='classic'?'Klassik':'Ixcham';
    return {item:u('i.'+S.item),leather:u('l.'+S.leather),thread:u('t.'+S.thread),hardware:hw,size:size,
      engraving:(S.engrOn&&S.engr)?S.engr.toUpperCase():'',box:S.box,price:fmt(total(S)),link:location.href.split('#')[0]};
  };
  EL.onLang(render);
  window.addEventListener('resize',updateCounter);
  if(new URLSearchParams(location.search).get('go')==='1'){
    var tgt=$('#kTotal');if(tgt) setTimeout(function(){tgt.scrollIntoView({block:'center'})},400);
  }
}

document.addEventListener('DOMContentLoaded',function(){
  var m=$('#mini'),p=$('#popular'),k=$('#kb');
  if(m) initMini(m);
  if(p) initPopular(p);
  if(k) initFull(k);
  /* onLang вызывает колбэки сразу, если язык уже выбран; в противном случае main.js запустит их после инициализации */
  EL.ready();
});
})();
