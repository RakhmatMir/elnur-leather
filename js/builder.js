/* Конструктор: схемы изделий (4 отдельные), цена, адрес-состояние, мини-версия на главной и полная страница. Цены — js/config.js. */
(function(){
'use strict';
var C = window.ELNUR, EL = window.EL;
var ITEMS = ['strap','belt','wallet','card'];
var LEATHER = ['#9A5B2E','#4A2F20','#22221F','#C9AA82','#6A2330','#5C6833'];
var THREAD = ['#E8DCBF','#FBFAF5','#151513','#B33B2E','#D9A63A'];
var HW = ['#BFC1BC','#C9A44E','#2A2A28'];
var LIVE = {strap:['strap-qora','strap-black'], belt:['belt','belt'], wallet:['wallet-bifold','wallet-bifold'], card:['cardholders','table']};
var $ = EL.$, $$ = EL.$$, esc = EL.esc, fmt = function(n){return EL.fmt(n)}, t = function(k,v){return EL.t(k,v)};
var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

function def(){return {item:'strap',leather:0,thread:0,hw:0,size:'',sizeMode:'waist',model:'',engr:'',engrOn:false,box:false}}
function hasHw(it){return it !== 'card'}
function hasSize(it){return it !== 'card'}
function total(S){
  var p = C.PRICES[S.item];
  if(S.engrOn && S.engr) p += C.ENGRAVE_PRICE;
  if(S.box) p += C.BOX_PRICE;
  return p;
}
/* итог: подтверждённая цена — без «≈» (только ремешок «от») */
function totalText(S,l){
  var info = EL.itemPrice(S.item,l), n = fmt(total(S));
  return (S.item === 'strap' ? EL.t('p.from',{p:n},l) : EL.t('p.approx',{p:n},l));
}
function shade(hex,k){
  var n = parseInt(hex.slice(1),16), r = n>>16, g = (n>>8)&255, b = n&255;
  var f = function(c){return Math.round(k<0 ? c*(1+k) : c+(255-c)*k)};
  return 'rgb('+f(r)+','+f(g)+','+f(b)+')';
}
function lum(hex){var n = parseInt(hex.slice(1),16); return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255}

/* ================= схемы изделий (viewBox 520 × 320) ================= */
function strapPath(x0,x1,cy,h0,h1){
  return 'M'+x0+' '+(cy-h0)+' L'+(x1-h1)+' '+(cy-h1)+' A'+h1+' '+h1+' 0 0 1 '+(x1-h1)+' '+(cy+h1)+' L'+x0+' '+(cy+h0)+' Z';
}
function artItem(S){
  var L = LEATHER[S.leather], T = THREAD[S.thread], H = HW[S.hw], E = shade(L,-.28), id = S.item;
  var ink = lum(L) > .55 ? 'rgba(38,30,20,.6)' : 'rgba(255,245,225,.8)';
  var txt = (S.engrOn ? S.engr : '').toUpperCase();
  var stitch = 'fill="none" stroke="'+T+'" stroke-width="2.4" stroke-dasharray="7 6" stroke-linecap="round"';
  var text = function(x,y,sz){return txt ? '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="600" font-size="'+sz+'" letter-spacing="3" fill="'+ink+'">'+esc(txt)+'</text>' : ''};
  var s = '', bb;
  if(id === 'strap'){
    var x0 = 78, x1 = 470;
    /* верхний ремешок — с пряжкой и шлёвкой */
    s += '<path d="'+strapPath(x0,x1,98,34,23)+'" fill="'+L+'" stroke="'+E+'" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<path d="'+strapPath(x0+9,x1-6,98,25,15)+'" '+stitch+'/>';
    s += '<rect x="52" y="52" width="40" height="92" rx="9" fill="none" stroke="'+H+'" stroke-width="7"/>';
    s += '<line x1="70" y1="98" x2="132" y2="98" stroke="'+H+'" stroke-width="5" stroke-linecap="round"/>';
    s += '<rect x="174" y="62" width="15" height="72" rx="4" fill="'+E+'"/><rect x="174" y="62" width="15" height="72" rx="4" fill="none" stroke="'+T+'" stroke-width="1.6" stroke-dasharray="5 5" opacity=".8"/>';
    s += text(318,106,19);
    /* нижний — с отверстиями */
    s += '<path d="'+strapPath(x0,x1,214,34,22)+'" fill="'+L+'" stroke="'+E+'" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<path d="'+strapPath(x0+9,x1-6,214,25,14)+'" '+stitch+'/>';
    for(var i = 0; i < 5; i++) s += '<circle cx="'+(318+i*30)+'" cy="214" r="4.6" fill="rgba(20,16,10,.5)"/>';
    bb = [44,48,432,206];
  } else if(id === 'belt'){
    var cy = 160;
    s += '<path d="M78 '+(cy-24)+' H452 L494 '+cy+' L452 '+(cy+24)+' H78 Z" fill="'+L+'" stroke="'+E+'" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<path d="M118 '+(cy-15)+' H448 M118 '+(cy+15)+' H448" '+stitch+'/>';
    s += '<rect x="168" y="'+(cy-29)+'" width="17" height="58" rx="4" fill="'+E+'"/>';
    s += '<rect x="34" y="'+(cy-40)+'" width="92" height="80" rx="12" fill="none" stroke="'+H+'" stroke-width="11"/>';
    s += '<rect x="78" y="'+(cy-40)+'" width="9" height="80" fill="'+H+'"/>';
    s += '<line x1="82" y1="'+cy+'" x2="146" y2="'+cy+'" stroke="'+H+'" stroke-width="6" stroke-linecap="round"/>';
    for(var j = 0; j < 5; j++) s += '<circle cx="'+(318+j*22)+'" cy="'+cy+'" r="4.6" fill="rgba(20,16,10,.5)"/>';
    s += text(262,cy+6,19);
    bb = [28,112,470,96];
  } else if(id === 'wallet'){
    s += '<defs><clipPath id="wclip"><rect x="110" y="56" width="300" height="208" rx="18"/></clipPath></defs>';
    s += '<rect x="110" y="56" width="300" height="208" rx="18" fill="'+L+'" stroke="'+E+'" stroke-width="2.5"/>';
    s += '<g clip-path="url(#wclip)"><path d="M110 56 H410 V132 Q260 196 110 132 Z" fill="'+shade(L,.1)+'" stroke="'+E+'" stroke-width="2.5"/>';
    s += '<path d="M110 144 Q260 208 410 144" fill="none" stroke="'+T+'" stroke-width="2.4" stroke-dasharray="7 6" stroke-linecap="round" opacity="0"/></g>';
    s += '<rect x="122" y="68" width="276" height="184" rx="11" '+stitch+'/>';
    s += '<circle cx="260" cy="172" r="13" fill="'+H+'" stroke="'+E+'" stroke-width="2"/><circle cx="260" cy="172" r="5" fill="'+shade(H,-.25)+'"/>';
    s += text(260,236,20);
    bb = [100,46,320,228];
  } else {
    s += '<rect x="176" y="62" width="168" height="62" rx="7" fill="#F4F1E6" stroke="#DEDAC9" stroke-width="2"/><rect x="190" y="76" width="44" height="7" rx="3.5" fill="#DEDAC9"/>';
    s += '<rect x="148" y="92" width="224" height="148" rx="14" fill="'+L+'" stroke="'+E+'" stroke-width="2.5"/>';
    s += '<path d="M148 128 Q260 100 372 128 V226 a14 14 0 0 1 -14 14 H162 a14 14 0 0 1 -14 -14 Z" fill="'+shade(L,.09)+'" stroke="'+E+'" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<path d="M160 142 V224 a6 6 0 0 0 6 6 H354 a6 6 0 0 0 6 -6 V142" '+stitch+'/>';
    s += text(260,204,19);
    bb = [140,56,240,194];
  }
  return {svg:s, bb:bb};
}
function art(S){
  var a = artItem(S), s = a.svg;
  if(S.box){
    var b = a.bb, p = 22, x = b[0]-p, y = b[1]-p, w = b[2]+2*p, h = b[3]+2*p, lid = Math.max(34,h*.2);
    var boxSvg = '<g class="gbox"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="14" fill="#E3DCC2"/>'+
      '<rect x="'+(x-5)+'" y="'+y+'" width="'+(w+10)+'" height="'+lid+'" rx="10" fill="#D3CAAB"/>'+
      '<rect x="'+(x+w/2-13)+'" y="'+y+'" width="26" height="'+h+'" fill="rgba(78,94,46,.28)"/></g>';
    s = boxSvg + s;
  }
  return s;
}
function apx(S){$$('.ap').forEach(function(e){e.hidden = S.item === 'strap'})}
function paint(svgEl,S){svgEl.innerHTML = art(S); svgEl.setAttribute('viewBox','0 0 520 320'); svgEl.setAttribute('aria-label',t('b.art'))}

/* ---------- состояние <-> адрес ---------- */
function toParams(S){
  var p = new URLSearchParams();
  p.set('i',S.item); p.set('l',S.leather); p.set('t',S.thread);
  if(hasHw(S.item)) p.set('h',S.hw);
  if(S.size) p.set('s',S.size);
  if(S.item === 'belt' && S.size) p.set('m',S.sizeMode);
  if(S.item === 'wallet' && S.model) p.set('mo',S.model);
  if(S.engrOn && S.engr) p.set('e',S.engr);
  if(S.box) p.set('b','1');
  return p.toString();
}
function fromParams(q){
  var S = def(), p = new URLSearchParams(q != null ? q : location.search);
  var n = function(k,max){var v = parseInt(p.get(k),10); return (v >= 0 && v < max) ? v : 0};
  if(ITEMS.indexOf(p.get('i')) > -1) S.item = p.get('i');
  S.leather = n('l',LEATHER.length); S.thread = n('t',THREAD.length); S.hw = n('h',HW.length);
  var s = p.get('s') || '';
  if(S.item === 'strap' && /^(18|20|22|24|x)$/.test(s)) S.size = s;
  if(S.item === 'belt' && /^\d{2,3}$/.test(s)) S.size = s;
  if(p.get('m') === 'old') S.sizeMode = 'old';
  if(/^(classic|compact)$/.test(p.get('mo')||'') && S.item === 'wallet') S.model = p.get('mo');
  var e = (p.get('e')||'').replace(/[^\p{L}\p{N}. ʻ]/gu,'').slice(0,C.ENGRAVE_MAX);
  if(e){S.engr = e; S.engrOn = true}
  S.box = p.get('b') === '1';
  return S;
}

/* ---------- плавная смена числа ---------- */
function counter(el,start){
  var shown = start || 0, raf = 0;
  return function(to){
    cancelAnimationFrame(raf);
    if(REDUCED){shown = to; el.textContent = fmt(to); return}
    var from = shown, t0 = performance.now();
    function step(now){
      var p = Math.min(1,(now-t0)/380), e = 1-Math.pow(1-p,3);
      shown = from+(to-from)*e; el.textContent = fmt(Math.round(shown/1000)*1000);
      if(p < 1) raf = requestAnimationFrame(step); else {shown = to; el.textContent = fmt(to)}
    }
    raf = requestAnimationFrame(step);
  };
}
function swatches(box,list,key,S,onPick,nameKey){
  box.innerHTML = '';
  list.forEach(function(c,i){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'sw'; b.style.background = c;
    b.setAttribute('aria-label',t(nameKey+'.'+i)); b.title = t(nameKey+'.'+i);
    b.onclick = function(){S[key] = i; onPick()}; box.appendChild(b);
  });
}
function markSw(box,idx){$$('.sw',box).forEach(function(b,i){b.setAttribute('aria-pressed',i === idx)})}
function sizeLabel(S,lang){
  if(S.item === 'strap' && S.size) return S.size === 'x' ? EL.t('kb.unknown',null,lang) : S.size+' '+EL.t('kb.mm',null,lang);
  if(S.item === 'belt' && S.size) return S.size+' '+EL.t('kb.cm',null,lang);
  if(S.item === 'wallet' && S.model) return EL.t(S.model === 'classic' ? 'kb.classic' : 'kb.compact',null,lang).split(' — ')[0];
  return '';
}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function chipList(S){
  var c = [t('i.'+S.item), t('l.'+S.leather), cap(t('chip.thread',{c:t('t.'+S.thread).toLowerCase()}))];
  if(hasHw(S.item)) c.push(cap(t(S.item === 'wallet' ? 'chip.snap' : 'chip.buckle',{c:t('hw.'+S.hw).toLowerCase()})));
  var sz = sizeLabel(S); if(sz) c.push(sz);
  if(S.engrOn && S.engr) c.push('«'+S.engr.toUpperCase()+'»');
  if(S.box) c.push(t('chip.box'));
  return c;
}
function chipsHtml(S){return chipList(S).map(function(c){return '<span class="chip">'+esc(c)+'</span>'}).join('')}
function itemButtons(box,S,onPick){
  box.innerHTML = '';
  ITEMS.forEach(function(it){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'item'; b.dataset.it = it;
    var pr = EL.itemPrice(it).text;
    b.setAttribute('aria-label',t('i.'+it)+', '+pr);
    b.innerHTML = '<b>'+esc(t('i.'+it))+'</b><small>'+esc(pr)+'</small>';
    b.onclick = function(){onPick(it)}; box.appendChild(b);
  });
}

/* ================= мини-конструктор на главной ================= */
function initMini(root){
  var S = def(), els = {
    art:$('#art',root), chips:$('#chips',root), items:$('#items',root), leather:$('#leather',root), thread:$('#thread',root),
    ln:$('#leatherName',root), tn:$('#threadName',root), engr:$('#engr',root), cnt:$('#cnt',root), box:$('#box',root), sum:$('#sum',root), go:$('#miniGo',root)
  };
  var anim = counter(els.sum,C.PRICES.strap);
  function sync(){
    $$('.item',els.items).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.it === S.item)});
    markSw(els.leather,S.leather); markSw(els.thread,S.thread);
    els.ln.textContent = t('l.'+S.leather); els.tn.textContent = t('t.'+S.thread);
    paint(els.art,S); els.chips.innerHTML = chipsHtml(S); apx(S);
    anim(total(S));
    els.go.href = 'konstruktor.html?'+toParams(S)+'#kb';
  }
  function render(){
    itemButtons(els.items,S,function(it){S.item = it; sync()});
    swatches(els.leather,LEATHER,'leather',S,sync,'l'); swatches(els.thread,THREAD,'thread',S,sync,'t');
    els.cnt.textContent = els.engr.value.length+' / '+C.ENGRAVE_MAX; sync();
  }
  els.engr.maxLength = C.ENGRAVE_MAX;
  els.engr.addEventListener('input',function(){
    els.engr.value = els.engr.value.replace(/[^\p{L}\p{N}. ʻ]/gu,'');
    S.engr = els.engr.value.trim(); S.engrOn = !!S.engr;
    els.cnt.textContent = els.engr.value.length+' / '+C.ENGRAVE_MAX; sync();
  });
  els.box.addEventListener('change',function(){S.box = els.box.checked; sync()});
  EL.onLang(render);
}

/* ================= страница конструктора ================= */
function initFull(root){
  var S = fromParams();
  var els = {
    art:$('#kArt'), chips:$('#kChips'), stepTxt:$('#kStepTxt'), items:$('#kItems'), leather:$('#kLeather'), thread:$('#kThread'),
    hwBox:$('#kHw'), hwStep:$('#stHw'), hwTitle:$('#kHwTitle'), hwName:$('#kHwName'),
    sizeStep:$('#stSize'), sizeTitle:$('#kSizeTitle'), sizeBox:$('#kSize'),
    engrOn:$('#kEngrOn'), engrWrap:$('#kEngrWrap'), engr:$('#kEngr'), cnt:$('#kCnt'), engrFld:$('#kEngrFld'), engrErr:$('#kEngrErr'), engrHint:$('#kEngrHint'),
    box:$('#kBox'), ln:$('#kLeatherName'), tn:$('#kThreadName'),
    sum:$('#kSum'), sum2:$('#mSum'), need:$('#kNeed'), msg:$('#kMsg'), send:$('#kSend'), mSend:$('#mSend'), share:$('#kShare'),
    order:$('#order'), oArt:$('#oArt'), oChips:$('#oChips'), oSum:$('#oSum'),
    liveImg:$('#kLiveImg'), liveLink:$('#kLiveLink')
  };
  var anim = counter(els.sum,C.PRICES.strap), anim2 = counter(els.sum2,C.PRICES.strap), cm = C.ENGRAVE_MAX;

  function visibleSteps(){return $$('.step',root).filter(function(s){return !s.hidden})}
  function missing(){
    if(hasSize(S.item) && !S.size) return {el:els.sizeStep, key:S.item === 'strap' ? 'kb.s5strap' : 'kb.s5belt'};
    if(S.item === 'wallet' && !S.model) return {el:els.sizeStep, key:'kb.s5wallet'};
    return null;
  }
  function buildSize(){
    var b = els.sizeBox; b.innerHTML = '';
    els.sizeStep.hidden = !hasSize(S.item);
    if(S.item === 'strap'){
      els.sizeTitle.textContent = t('kb.s5strap');
      var h = '<div class="pills" role="group" aria-label="'+esc(t('kb.s5strap'))+'">';
      ['18','20','22','24','x'].forEach(function(v){
        h += '<label class="pill"><input type="radio" name="sw" value="'+v+'"><span>'+esc(v === 'x' ? t('kb.unknown') : v+' '+t('kb.mm'))+'</span></label>';
      });
      h += '</div><details class="measure"><summary>'+esc(t('kb.measure'))+'</summary><p>'+esc(t('kb.strapmeasure'))+'</p></details>';
      b.innerHTML = h;
      $$('input',b).forEach(function(r){r.checked = r.value === S.size; r.onchange = function(){S.size = r.value; sync()}});
    } else if(S.item === 'belt'){
      els.sizeTitle.textContent = t('kb.s5belt');
      b.innerHTML = '<div class="pills" role="group"><label class="pill"><input type="radio" name="bm" value="waist"><span>'+esc(t('kb.waist'))+'</span></label>'+
        '<label class="pill"><input type="radio" name="bm" value="old"><span>'+esc(t('kb.oldbelt'))+'</span></label></div>'+
        '<div class="fld" id="kBeltFld"><label class="field wide"><input id="kBelt" inputmode="numeric" maxlength="3" autocomplete="off" aria-label="'+esc(t('kb.beltlabel'))+'" aria-describedby="kBeltHint"><small>'+esc(t('kb.cm'))+'</small></label>'+
        '<p class="hint ex" id="kBeltHint">'+esc(t('kb.beltex'))+'</p><p class="err">'+esc(t('kb.belterr'))+'</p></div>'+
        '<p class="hint">'+esc(t('kb.beltmeasure'))+'</p>';
      $$('input[name=bm]',b).forEach(function(r){r.checked = r.value === S.sizeMode; r.onchange = function(){S.sizeMode = r.value; sync()}});
      var bi = $('#kBelt',b), bf = $('#kBeltFld',b); bi.value = S.size;
      bi.oninput = function(){
        bi.value = bi.value.replace(/\D/g,''); var n = parseInt(bi.value,10);
        S.size = (n >= 40 && n <= 200) ? String(n) : ''; bf.classList.remove('bad'); sync();
      };
      bi.onblur = function(){if(bi.value && !S.size) bf.classList.add('bad')};
    } else if(S.item === 'wallet'){
      els.sizeTitle.textContent = t('kb.s5wallet');
      b.innerHTML = '<div class="pills" role="group"><label class="pill"><input type="radio" name="wm" value="classic"><span>'+esc(t('kb.classic'))+'</span></label>'+
        '<label class="pill"><input type="radio" name="wm" value="compact"><span>'+esc(t('kb.compact'))+'</span></label></div>';
      $$('input',b).forEach(function(r){r.checked = r.value === S.model; r.onchange = function(){S.model = r.value; sync()}});
    }
  }
  function live(){
    var pid = LIVE[S.item][0], file = LIVE[S.item][1];
    var p = (window.PRODUCTS||[]).filter(function(x){return x.id === pid})[0];
    EL.setPic(els.liveImg, file); els.liveImg.alt = p ? p.n[EL.lang] : '';
    els.liveLink.href = 'mahsulot.html?id='+pid;
  }
  function sync(){
    $$('.item',els.items).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.it === S.item)});
    markSw(els.leather,S.leather); markSw(els.thread,S.thread);
    if(hasHw(S.item)){
      els.hwStep.hidden = false;
      els.hwTitle.textContent = t(S.item === 'wallet' ? 'kb.s4s' : 'kb.s4b');
      markSw(els.hwBox,S.hw); els.hwName.textContent = t('hw.'+S.hw);
    } else els.hwStep.hidden = true;
    els.ln.textContent = t('l.'+S.leather); els.tn.textContent = t('t.'+S.thread);
    els.engrWrap.hidden = !S.engrOn; els.engrOn.checked = S.engrOn; els.box.checked = S.box;
    paint(els.art,S); els.chips.innerHTML = chipsHtml(S); apx(S);
    var tt = total(S); anim(tt); anim2(tt);
    els.need.textContent = '';
    live(); updateCounter();
    try{history.replaceState(null,'','?'+toParams(S)+location.hash)}catch(e){}
    if(!els.order.hidden) fillSummary();
  }
  function fillSummary(){
    paint(els.oArt,S); els.oChips.innerHTML = chipsHtml(S); els.oSum.textContent = totalText(S);
  }
  function updateCounter(){
    var vs = visibleSteps(), cur = 0, mid = window.innerHeight*0.4;
    vs.forEach(function(s,i){if(s.getBoundingClientRect().top < mid) cur = i});
    els.stepTxt.textContent = t('kb.stepof',{n:cur+1,t:vs.length});
  }
  function render(){
    itemButtons(els.items,S,function(it){if(S.item === it) return; S.item = it; S.size = ''; S.model = ''; buildSize(); sync()});
    swatches(els.leather,LEATHER,'leather',S,sync,'l'); swatches(els.thread,THREAD,'thread',S,sync,'t'); swatches(els.hwBox,HW,'hw',S,sync,'hw');
    els.engr.value = S.engr; els.cnt.textContent = S.engr.length+' / '+cm;
    els.engrHint.textContent = t('kb.engrhint',{max:cm});
    buildSize(); sync();
  }
  els.engrOn.onchange = function(){S.engrOn = els.engrOn.checked; sync(); if(S.engrOn) els.engr.focus()};
  els.box.onchange = function(){S.box = els.box.checked; sync()};
  els.engr.addEventListener('input',function(){
    var raw = els.engr.value, v = raw.replace(/[^\p{L}\p{N}. ʻ]/gu,''), err = '';
    if(v !== raw) err = 'kb.engrchars';
    if(v.length > cm){v = v.slice(0,cm); err = 'kb.engrlong'}
    els.engr.value = v; S.engr = v.trim();
    els.engrFld.classList.toggle('bad',!!err);
    if(err) els.engrErr.textContent = t(err,{max:cm});
    els.cnt.textContent = v.length+' / '+cm; sync();
  });
  $$('[data-go]',root).forEach(function(b){b.onclick = function(){
    var vs = visibleSteps(), cur = vs.indexOf(b.closest('.step')), n = vs[cur+(b.dataset.go === 'next' ? 1 : -1)];
    if(n) n.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'start'});
  }});
  window.addEventListener('scroll',function(){requestAnimationFrame(updateCounter)},{passive:true});

  els.share.onclick = function(){
    var url = location.origin+location.pathname+'?'+toParams(S);
    if(location.protocol === 'file:') url = location.href.split('#')[0];
    EL.copyText(url).then(function(ok){if(ok) els.msg.textContent = t('kb.copiedlink'); else prompt('',url)});
  };

  function openOrder(){
    var m = missing();
    if(m){
      els.need.textContent = t('kb.need',{s:t(m.key)});
      var f = $('#kBeltFld'); if(S.item === 'belt' && f){f.classList.add('bad'); var bi = $('#kBelt'); if(bi) bi.focus({preventScroll:true})}
      m.el.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'center'}); return;
    }
    fillSummary();
    els.order.hidden = false;
    els.order.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'start'});
    var f2 = $('input[name=name]',els.order); if(f2) setTimeout(function(){f2.focus({preventScroll:true})},500);
  }
  els.send.onclick = openOrder; els.mSend.onclick = openOrder;

  /* данные заказа для мастера (по-узбекски — язык мастера) */
  window.ElnurOrderData = function(){
    var u = function(k,v){return EL.t(k,v,'uz')};
    var hw = hasHw(S.item) ? u('hw.'+S.hw) : '', size = '';
    if(S.item === 'strap') size = S.size === 'x' ? u('kb.unknown') : S.size+' mm';
    if(S.item === 'belt') size = S.size+' sm ('+u(S.sizeMode === 'old' ? 'kb.oldbelt' : 'kb.waist').toLowerCase()+')';
    if(S.item === 'wallet') size = S.model === 'classic' ? 'Klassik' : 'Ixcham';
    return {item:u('i.'+S.item), leather:u('l.'+S.leather), thread:u('t.'+S.thread), hardware:hw, size:size,
      engraving:(S.engrOn && S.engr) ? S.engr.toUpperCase() : '', box:S.box, price:EL.fmt(total(S),'uz'), priceText:(S.item === 'strap' ? EL.t('p.from',{p:EL.fmt(total(S),'uz')},'uz') : '≈ '+EL.fmt(total(S),'uz')+' soʻm (taxminiy)'), link:location.href.split('#')[0]};
  };
  EL.onLang(render);
  window.addEventListener('resize',updateCounter);
}

function boot(){
  var m = $('#mini'), k = $('#kb');
  if(m) initMini(m);
  if(k) initFull(k);
}
boot();
})();
