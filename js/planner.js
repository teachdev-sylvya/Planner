
window.__plannerDevy=true;
/* =================== constants & helpers =================== */
const CATS={
  wakasek:{name:"Wakasek Kurikulum",short:"Wakasek",color:"var(--c-wakasek)",hex:"#7b5ea7"},
  ipa:{name:"Guru IPA",short:"IPA",color:"var(--c-ipa)",hex:"#4f8f6a"},
  s2:{name:"Kuliah S2",short:"S2",color:"var(--c-s2)",hex:"#3f6fb0"},
  sport:{name:"Sport",short:"Sport",color:"var(--c-gym)",hex:"#d07a3e"},
  religi:{name:"Ibadah & Religi",short:"Ibadah",color:"#b07d2b",hex:"#b07d2b"},
  fin:{name:"Keuangan",short:"Keuangan",color:"#1f7a5a",hex:"#1f7a5a",hide:true},
  gym:{name:"Sport",short:"Sport",color:"var(--c-gym)",hex:"#d07a3e",hide:true},
  zumba:{name:"Sport",short:"Sport",color:"var(--c-gym)",hex:"#d07a3e",hide:true},
  pribadi:{name:"Pribadi",short:"Pribadi",color:"var(--c-pribadi)",hex:"#7a8496"}
};
const HARI=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const HR=["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const BULAN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const ymd=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parseD=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const fmtLong=d=>HARI[d.getDay()]+", "+d.getDate()+" "+BULAN[d.getMonth()]+" "+d.getFullYear();
const fmtShort=d=>HR[d.getDay()]+" "+d.getDate()+" "+BULAN[d.getMonth()].slice(0,3);
const catOf=it=>CATS[it.cat]||CATS.pribadi;
const CAT_LIST=()=>Object.entries(CATS).filter(([k,c])=>!c.hide);
const normCat=c=>c==="gym"||c==="zumba"?"sport":(CATS[c]?c:"pribadi");
const uid=()=>"i"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function weekStart(d){const x=new Date(d);x.setDate(x.getDate()-((x.getDay()+6)%7));x.setHours(0,0,0,0);return x}

/* =================== decorations (original SVG) =================== */
const SVG={
  cloud:(w=120)=>`<svg width="${w}" viewBox="0 0 120 80"><path d="M28 70c-14 0-22-9-22-19 0-11 9-19 20-18 2-13 13-23 27-23 11 0 20 6 24 15 3-1 6-2 9-2 13 0 23 10 23 23 0 13-10 24-23 24z" fill="#fff" stroke="#9fb6d6" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="48" cy="46" r="2.6" fill="#24395f"/><circle cx="72" cy="46" r="2.6" fill="#24395f"/><path d="M54 52q6 6 12 0" stroke="#24395f" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="40" cy="53" r="4" fill="#f4c7cf" opacity=".8"/><circle cx="80" cy="53" r="4" fill="#f4c7cf" opacity=".8"/></svg>`,
  flower:(s=60,c="#7d9cc8")=>{let p="";for(let i=0;i<5;i++){const a=i*72*Math.PI/180;p+=`<ellipse cx="${30+Math.sin(a)*13}" cy="${30-Math.cos(a)*13}" rx="10" ry="13" transform="rotate(${i*72} ${30+Math.sin(a)*13} ${30-Math.cos(a)*13})" fill="${c}" stroke="#fff" stroke-width="1.5"/>`}
    return `<svg width="${s}" viewBox="0 0 60 60">${p}<circle cx="30" cy="30" r="7" fill="#f6e3b4" stroke="#fff" stroke-width="1.5"/><circle cx="30" cy="30" r="2.5" fill="#d9b66b"/></svg>`},
  heart:(s=26,c="#5f7fb0")=>`<svg width="${s}" viewBox="0 0 24 22"><path d="M12 21S1 14 1 7a5.5 5.5 0 0 1 11-1 5.5 5.5 0 0 1 11 1c0 7-11 14-11 14z" fill="${c}" stroke="#fff" stroke-width="1.5"/></svg>`,
  sparkle:(s=18)=>`<svg width="${s}" viewBox="0 0 20 20"><path d="M10 0c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10z" fill="#5f7fb0"/></svg>`,
  clip:()=>`<svg width="26" height="64" viewBox="0 0 26 64"><path d="M8 18v30a6 6 0 0 0 12 0V12a9 9 0 0 0-18 0v36" fill="none" stroke="#8796ab" stroke-width="3" stroke-linecap="round"/></svg>`,
  pot:()=>`<svg width="90" viewBox="0 0 90 110"><path d="M45 60V20M45 45q-18-6-22-22M45 38q16-4 20-20" stroke="#7f9a83" stroke-width="3" fill="none"/>${[[23,22],[65,18],[45,14]].map(([x,y])=>`<g transform="translate(${x-14} ${y-14}) scale(.47)">${SVG.flowerRaw("#7d9cc8")}</g>`).join("")}<path d="M18 62h54l-7 44H25z" fill="#8aa6cf" stroke="#fff" stroke-width="2"/><rect x="14" y="58" width="62" height="10" rx="4" fill="#6f8fbf"/><path d="M45 92s-9-6-9-11a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 5-9 11-9 11z" fill="#fff"/></svg>`,
  flowerRaw:c=>{let p="";for(let i=0;i<5;i++){const a=i*72*Math.PI/180;p+=`<ellipse cx="${30+Math.sin(a)*13}" cy="${30-Math.cos(a)*13}" rx="10" ry="13" transform="rotate(${i*72} ${30+Math.sin(a)*13} ${30-Math.cos(a)*13})" fill="${c}" stroke="#fff" stroke-width="1.5"/>`}return p+`<circle cx="30" cy="30" r="7" fill="#f6e3b4"/>`}
};
const deco=(html,style)=>`<div class="deco" style="${style}">${html}</div>`;
const tape=(style)=>`<div class="tape gingham" style="${style}"></div>`;
function header(title,quote,extra=""){
  return `<div class="head">
    ${deco(SVG.cloud(118),"left:-6px;top:-8px")}
    ${deco(SVG.flower(70,"#7d9cc8"),"right:6px;top:-12px")}${deco(SVG.flower(42,"#a9bfdd"),"right:66px;top:34px")}
    ${deco(SVG.sparkle(16),"left:140px;top:14px")}${deco(SVG.sparkle(11),"left:160px;top:40px")}
    <span class="ribbon">Planner Devy ♥</span>
    <h1>${title}</h1>
    <div class="divider">${SVG.heart(18,"#7d9cc8")}</div>
    ${quote?`<div class="quote">“${quote}”</div>`:""}${extra}</div>`;
}
const box=(label,inner,cls="",style="")=>`<div class="box ${cls}" style="${style}"><span class="label">${label}</span>${inner}</div>`;

/* =================== state =================== */
let items=[], store=null, db=null;
let cur={p:"cover"}, navStack=[];
let mode="type", stylusOnly=false, zoom=1, assetsNS=null;
const notesCache={}, inkCache={}, mediaCache={};
const undoStack=[], redoStack=[];
let editing=null, kind="agenda", days=[];

/* =================== storage backend =================== */
const LSK="pd2:";
const local={
  get(p){try{const v=localStorage.getItem(LSK+p);return Promise.resolve(v?JSON.parse(v):null)}catch(e){return Promise.resolve(null)}},
  set(p,b){try{localStorage.setItem(LSK+p,JSON.stringify(b))}catch(e){}return Promise.resolve()},
  del(p){try{localStorage.removeItem(LSK+p)}catch(e){}return Promise.resolve()}
};
const backend={
  // data from the store arrives frozen (read-only): always work on an editable copy
  get:p=>db?db.doc(p).get().then(s=>s.exists?JSON.parse(JSON.stringify(s.data())):null):local.get(p),
  set:(p,b)=>db?db.doc(p).set(b):local.set(p,b),
  del:p=>db?db.doc(p).delete():local.del(p)
};
const writing={}, timers={};
const pendingSaves={};let saveFails=0;
function saveStatus(){const n=Object.keys(pendingSaves).length+Object.keys(writing).length,el=document.getElementById("status");if(!el)return;
  el.textContent=n?"⏳ Menyimpan…":saveFails?"⚠️ Ada yang gagal tersimpan":(db?"☁ Tersimpan":"Mode lokal")}
function runSave(path){const g=pendingSaves[path];if(!g)return;delete pendingSaves[path];clearTimeout(timers[path]);
  if(writing[path]){writing[path].again=true;writing[path].get=g;return}
  writing[path]={again:false,get:g};saveStatus();
  (async()=>{do{writing[path].again=false;try{const body=writing[path].get();
      if(body&&body.__patch){const k=body.key,names=[...(notePatch[k]||[])];delete notePatch[k];const full=(notesCache[k]&&notesCache[k].f)||{};
        if(!names.length)continue;
        if(db){const f={};names.forEach(nm=>f[nm]=full[nm]===undefined?"":full[nm]);
          try{await db.doc(path).update({f})}catch(e){if(e&&e.code==="invalid_argument"){const cur0=await db.doc(path).get().catch(()=>null);const base=cur0&&cur0.exists?(cur0.data().f||{}):{};await db.doc(path).set({f:{...base,...f}})}else{names.forEach(nm=>queueNoteField(k,nm));throw e}}}
        else await backend.set(path,{f:full})}
      else await backend.set(path,body);saveFails=0}catch(e){saveFails++;err(e)}}while(writing[path].again);delete writing[path];saveStatus()})();
}
function queueSave(path,getBody,delay=700){
  pendingSaves[path]=getBody;clearTimeout(timers[path]);saveStatus();
  timers[path]=setTimeout(()=>runSave(path),delay);
}
function flushSaves(){Object.keys(pendingSaves).forEach(runSave)}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flushSaves()});
window.addEventListener("pagehide",flushSaves);

/* items */
async function putItem(obj){
  const {id,...body}=obj;
  if(db){await db.doc("planner/"+id).set(body)}
  else{const i=items.findIndex(x=>x.id===id);if(i>=0)items[i]=obj;else items.push(obj);local.set("items",items);refreshAuto()}
}
async function removeItem(id){
  if(db){await db.doc("planner/"+id).delete()}
  else{items=items.filter(x=>x.id!==id);local.set("items",items);refreshAuto()}
}

/* =================== undo / redo =================== */
function pushUndo(entry){undoStack.push(entry);if(undoStack.length>200)undoStack.shift();redoStack.length=0;updUndo()}
function updUndo(){$("#undoBtn").disabled=!undoStack.length;$("#redoBtn").disabled=!redoStack.length}
async function doUndo(){const e=undoStack.pop();if(!e)return;await ensurePage(e.page);try{await e.undo()}catch(x){err(x)}redoStack.push(e);updUndo();toast("↶ Dibatalkan: "+esc(e.label))}
async function doRedo(){const e=redoStack.pop();if(!e)return;await ensurePage(e.page);try{await e.redo()}catch(x){err(x)}undoStack.push(e);updUndo();toast("↷ Diulang: "+esc(e.label))}
async function ensurePage(pg){if(pg&&pageKey(pg)!==pageKey(cur)){navStack.push(cur);await go(pg,false)}}

/* =================== occurrence & reminders =================== */
function occursOn(it,ds){
  if(it.kind==="tugas")return it.date===ds;
  if(!it.date)return false;
  const r=it.repeat||"none";
  if(r==="none")return it.date===ds;
  if(ds<it.date||(it.until&&ds>it.until))return false;
  if(r==="daily")return true;
  return (it.days||[]).includes(parseD(ds).getDay());
}
const byTime=(a,b)=>(a.start||"99").localeCompare(b.start||"99")||String(a.title||"").localeCompare(String(b.title||""),"id",{numeric:true});
const onDay=(ds,cats)=>items.filter(i=>(!cats||cats.includes(i.cat))&&occursOn(i,ds)).sort(byTime);
function dtOf(ds,t,fb){const d=parseD(ds);const [h,m]=(t||fb).split(":").map(Number);d.setHours(h,m,0,0);return d}
function reminders(){
  const now=new Date(),out=[];
  for(let i=0;i<8;i++){const ds=ymd(addDays(now,i));
    for(const it of items){if(it.kind!=="agenda"||!occursOn(it,ds))continue;const rm=+it.remind||0;if(!rm)continue;
      const at=dtOf(ds,it.start,"07:00"),end=it.end?dtOf(ds,it.end,"23:59"):new Date(+at+3600000);
      if(now>=new Date(at-rm*60000)&&now<end)out.push({it,at,ds,type:"agenda",late:false})}}
  for(const it of items){if(it.kind!=="tugas"||it.done)continue;const at=dtOf(it.date,it.start,"23:59"),rm=+it.remind||0;
    if(now>at)out.push({it,at,ds:it.date,type:"tugas",late:true});else if(rm&&now>=new Date(at-rm*60000))out.push({it,at,ds:it.date,type:"tugas",late:false})}
  return out.sort((a,b)=>a.at-b.at);
}
function rel(at,type){const diff=Math.round((at-new Date())/60000);
  if(diff<0){if(type==="agenda")return"sedang berlangsung";const a=-diff;return a<60?`lewat ${a} mnt`:a<1440?`lewat ${Math.round(a/60)} jam`:`lewat ${Math.round(a/1440)} hari`}
  return diff<60?`${diff} mnt lagi`:diff<1440?`${Math.round(diff/60)} jam lagi`:`${Math.round(diff/1440)} hari lagi`}

/* =================== item renderers =================== */
function itRow(it,o={}){
  const c=catOf(it);
  const tm=it.kind==="tugas"?(o.date?fmtShort(parseD(it.date)):"Tenggat")+(it.start?" "+it.start:""):(it.start?it.start+(it.end?"–"+it.end:""):"Seharian");
  const ck=it.kind==="tugas"?`<input type="checkbox" class="ck" data-done="${it.id}" ${it.done?"checked":""}>`:`<span class="dot" style="background:${c.color}"></span>`;
  const pr=it.kind==="tugas"&&it.prio==="tinggi"&&!it.done?` <span class="badge late">penting</span>`:"";
  return `<div class="it ${it.done?"done":""}" data-id="${it.id}">${ck}<span class="tm">${esc(tm)}</span>
    <div style="flex:1;min-width:0"><div class="tt">${esc(it.title)}${pr}</div><div class="mt">${c.short}${it.cat==="s2"&&typeof mkOf==="function"&&mkOf(it)?" · "+MKN[mkOf(it)].s:""}${it.jenis&&typeof JENIS!=="undefined"&&JENIS[it.jenis]?" · "+JENIS[it.jenis][1]:""}${it.repeat&&it.repeat!=="none"?" · rutin":""}${it.notes?" · "+esc(it.notes):""}</div></div></div>`;
}
const list=(arr,empty,o)=>arr.length?arr.map(i=>itRow(i,o)).join(""):`<div class="empty">${empty}</div>`;
const mini=it=>`<div class="mini" data-id="${it.id}"><span class="dot" style="background:${catOf(it).color}"></span>${it.kind==="tugas"?(it.done?"✓ ":"☐ "):""}${it.start?`<b>${it.start}</b>`:""} ${esc(it.title)}</div>`;
function quickAdd(defCat,date){
  return `<div class="quick"><select data-qcat>${CAT_LIST().map(([k,c])=>`<option value="${k}" ${k===defCat?"selected":""}>${c.short}</option>`).join("")}</select>
    <input class="line" data-qadd="${date||""}" placeholder="+ ketik tugas baru, tekan Enter" style="font-size:17px"></div>`;
}
const tasksFor=(cats)=>items.filter(i=>i.kind==="tugas"&&(!cats||cats.includes(i.cat))).sort((a,b)=>(a.done-b.done)||(a.date+(a.start||"99")).localeCompare(b.date+(b.start||"99")));

/* =================== fields =================== */
const fv=(name)=>{const n=notesCache[pageKey(cur)];return n&&n.f?n.f[name]:undefined};
const ta=(name,rows=3,ph="")=>`<textarea class="lined" data-f="${name}" rows="${rows}" placeholder="${ph}">${esc(fv(name)||"")}</textarea>`;
const covTitleSize=t=>{const n=String(t||"").length;return n<=12?84:Math.max(38,Math.round(84*12/n))};
document.addEventListener("input",e=>{const t=e.target;if(t&&t.classList&&t.classList.contains("kvt"))t.style.fontSize=covTitleSize(t.value||"My Planner")+"px"},true);
const inp=(name,ph="",st="")=>`<input class="line" data-f="${name}" value="${esc(fv(name)||"")}" placeholder="${ph}" style="${st}">`;
const numbered=(prefix,n)=>Array.from({length:n},(_,i)=>`<div class="numrow"><span class="num">${i+1}</span>${inp(prefix+(i+1))}</div>`).join("");
/* per-field saving: only the changed fields are written, so two open devices never wipe each other's entries */
const notePatch={};
const localEdits={};
function queueNoteField(key,name){(localEdits[key]=localEdits[key]||{})[name]=Date.now();(notePatch[key]=notePatch[key]||new Set()).add(name);
  queueSave("notes/"+key,()=>({__patch:true,key}),700)}
function editableNote(key){let n=notesCache[key];if(!n||Object.isFrozen(n)||Object.isFrozen(n.f||{})){n=notesCache[key]={f:{...((n&&n.f)||{})}}}n.f=n.f||{};return n}
function setField(key,name,val){
  const n=editableNote(key);n.f[name]=val;
  if(pageKey(cur)===key){const el=document.querySelector(`[data-f="${CSS.escape(name)}"]`);if(el){if(el.type==="checkbox")el.checked=!!val;else el.value=val??""}}
  queueNoteField(key,name);
  if(key.startsWith("ibadah-"))syncIbDay(key.slice(7));
}

/* =================== pages =================== */
const PAGES={
  cover:{title:"Sampul",tab:null},
  index:{title:"Daftar Isi",tab:null},
  yearly:{title:"Tahunan",tab:"#24395f",icon:"🗓"},
  monthly:{title:"Bulanan",tab:"#3f5f8f",icon:"📆"},
  weekly:{title:"Mingguan",tab:"#5f7fb0",icon:"🗓️"},
  daily:{title:"Harian",tab:"#7d9cc8",icon:"☀️"},
  rutin:{title:"Jadwal Rutin",tab:"#24395f",icon:"🔁"},
  wakasek:{title:"Wakasek",tab:"#7b5ea7",icon:"🏫",cats:["wakasek"]},
  ipa:{title:"Guru IPA",tab:"#4f8f6a",icon:"🔬",cats:["ipa"]},
  s2:{title:"Kuliah S2",tab:"#3f6fb0",icon:"🎓",cats:["s2"]},
  olahraga:{title:"Sport",tab:"#d07a3e",icon:"💪",cats:["sport","gym","zumba"]},
  ibadah:{title:"Ibadah",tab:"#b07d2b",icon:"🕌"},
  keuangan:{title:"Keuangan",tab:"#1f7a5a",icon:"💰"},
  catatan:{title:"Catatan",tab:"#c95b8e",icon:"📝"},
  teacher:{title:"Teacher Dev",tab:"#2a9d8f",icon:"🧪",app:"teacher.html?v=30"},
  wkapp:{title:"Sistem Kurikulum",tab:"#5b4590",icon:"📋",app:"wakasek.html?v=35"}
};
function pageKey(pg){if(pg&&pg.cv)return pg.p+"~sampul";if(pg&&pg.x)return pg.p+"~"+pg.x;return pageKeyBase0(pg)}
function pageKeyBase0(pg){
  switch(pg.p){
    case"daily":return"daily-"+pg.d;
    case"weekly":return"weekly-"+ymd(weekStart(parseD(pg.d)));
    case"monthly":return"monthly-"+pg.d.slice(0,7);
    case"yearly":return"yearly-"+taStart(parseD(pg.d));
    case"catatan":return"catatan-"+(pg.n||1);
    case"ibadah":return"ibadah-"+pg.d;
    default:return pg.p;
  }
}
const PNUM={cover:1,index:2,yearly:3,monthly:4,weekly:5,daily:6,rutin:7,wakasek:8,ipa:9,s2:10,olahraga:11,ibadah:12,keuangan:13,catatan:14,teacher:15,wkapp:16};

const autos={}; // id -> fn returning html (for current page)
const auto=(id,fn)=>{autos[id]=fn;return `<div data-auto="${id}">${fn()}</div>`};

const DOOD={
  books:`<svg width="120" height="104" viewBox="0 0 120 104" fill="none" stroke="#24395f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 70h86v14H14z" fill="#e9d29a"/><path d="M20 56h82v14H20z" fill="#a9c2a8"/><path d="M12 42h86v14H12z" fill="#8aa6c8"/><path d="M22 28h76v14H22z" fill="#f2c9cf"/><path d="M14 74h80M20 60h76M18 46h74"/><path d="M58 31c-2-3-7-1-5 3l5 4 5-4c2-4-3-6-5-3z" fill="#fff" stroke-width="1.6"/><path d="M8 20l-6-6M20 12l-2-8M104 18l6-6"/></svg>`,
  laptop:`<svg width="118" height="92" viewBox="0 0 118 92" fill="none" stroke="#24395f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10h72l4 52H18z" fill="#fffdf8"/><path d="M6 64h106l-8 12H14z" fill="#d6e1ef"/><path d="M58 30c-3-4-9-1-6 4l6 5 6-5c3-5-3-8-6-4z" fill="#f2c9cf" stroke-width="1.8"/></svg>`,
  coffee:`<svg width="84" height="110" viewBox="0 0 84 110" fill="none" stroke="#24395f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22h56l-8 82H22z" fill="#fffdf8"/><path d="M18 50h48l-3 32H21z" fill="#8aa6c8"/><path d="M10 12h64v10H10z" fill="#e8dcc8"/><path d="M42 61c-2-3-7-1-5 3l5 4 5-4c2-4-3-6-5-3z" fill="#fff" stroke-width="1.6"/></svg>`,
  sprig:`<svg width="70" height="100" viewBox="0 0 70 100" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M30 98C30 70 36 40 52 8"/><path d="M33 72c-12-2-20-10-22-22 12 2 20 10 22 22zM38 52c12-4 18-14 18-24-10 4-18 12-18 24zM36 40C26 36 22 26 24 16c8 6 12 14 12 24zM46 24c8-6 10-14 8-20-6 4-10 12-8 20z"/></svg>`,
  smile:`<svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#24395f" stroke-width="2.4" stroke-linecap="round"><circle cx="28" cy="28" r="22"/><circle cx="20" cy="23" r="1.6" fill="#24395f"/><circle cx="36" cy="23" r="1.6" fill="#24395f"/><path d="M18 33c5 7 15 7 20 0"/></svg>`,
  spark:(s=26,c="#24395f")=>`<svg width="${s}" height="${s}" viewBox="0 0 26 26" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"><path d="M13 2c1 6 5 10 11 11-6 1-10 5-11 11-1-6-5-10-11-11 6-1 10-5 11-11z"/></svg>`,
  heart:(s=34,c="#24395f")=>`<svg width="${s}" height="${s}" viewBox="0 0 34 34" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="M17 29C8 22 3 17 4 11c1-5 7-7 11-3l2 2 2-2c4-4 10-2 11 3 1 6-4 11-13 18z"/></svg>`,
  rays:(c="#24395f")=>`<svg width="60" height="50" viewBox="0 0 60 50" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"><path d="M50 6L38 16M56 26H40M50 44L38 36"/></svg>`,
  arrow:`<svg width="60" height="36" viewBox="0 0 60 36" fill="none" stroke="#24395f" stroke-width="2" stroke-linecap="round"><path d="M56 6C46 26 24 32 6 24M6 24l8-8M6 24l10 4"/></svg>`
};
const BLOB=(w,h,c,path)=>`<svg width="${w}" height="${h}" viewBox="0 0 200 200" preserveAspectRatio="none"><path d="${path}" fill="${c}" opacity=".78" filter="url(#wc)"/></svg>`;
const BLOBS=["M0 0H170C190 30 160 60 120 70 80 82 60 120 30 150 15 165 0 160 0 150Z","M30 0H200V140C170 150 150 120 120 110 80 96 40 80 20 50 8 30 14 10 30 0Z","M0 40C30 30 60 50 80 80 100 110 130 130 150 160 160 180 150 200 140 200H0Z","M200 30C170 40 150 70 140 100 130 130 100 150 80 170 70 185 70 200 80 200H200Z"];
function pgCover(){
  const roles=[["wakasek","Wakasek Kurikulum","wakasek"],["ipa","Guru IPA","ipa"],["s2","Mahasiswi S2 UHAMKA","s2"],["sport","Sport","olahraga"],["religi","Ibadah","ibadah"],["fin","Keuangan","keuangan"]];
  return `<div class="cover kv">
    <svg width="0" height="0" style="position:absolute"><filter id="wc"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter></svg>
    ${deco(BLOB(250,230,"#9db8a3",BLOBS[0]),"left:-10px;top:-10px")}${deco(BLOB(230,200,"#8aa6c8",BLOBS[1]),"right:-10px;top:-10px")}
    ${deco(BLOB(230,300,"#e3b9b4",BLOBS[2]),"left:-10px;bottom:-10px")}${deco(BLOB(240,320,"#d5b48a",BLOBS[3]),"right:-10px;bottom:-10px")}
    ${deco(DOOD.rays(),"left:150px;top:46px;transform:scaleX(-1)")}${deco(DOOD.rays(),"right:150px;top:46px")}
    <div class="kv-top"><div class="kv-ta">Tahun Ajaran 2026/2027</div><h1><input class="kvt" data-f="covtitle" value="${esc(fv("covtitle")||"My Planner")}" placeholder="My Planner" title="Ketuk untuk mengganti judul cover" maxlength="40" autocomplete="off" style="font-size:${covTitleSize(fv("covtitle")||"My Planner")}px"></h1><svg class="kv-uline" width="300" height="14" viewBox="0 0 300 14"><path d="M4 9C80 3 200 3 296 7" stroke="#24395f" stroke-width="3" fill="none" stroke-linecap="round"/></svg></div>
    <div class="kv-note n1">Proses juga<br>adalah<br>kemajuan ♡</div>
    <div class="kv-note n2"><span>Ilmu hari ini<br>bekal untuk<br>masa depan ♡</span></div>
    ${deco(DOOD.books,"left:30px;top:410px;transform:rotate(-6deg)")}${deco(DOOD.laptop,"right:30px;top:420px;transform:rotate(-4deg)")}
    ${deco(DOOD.spark(26),"right:60px;top:580px")}${deco(DOOD.spark(30),"left:200px;top:300px")}${deco(DOOD.heart(36),"right:190px;top:300px;transform:rotate(10deg)")}
    ${deco(DOOD.spark(20,"#fff"),"left:60px;top:650px")}${deco(DOOD.spark(16,"#fff"),"left:90px;top:690px")}
    <div class="kv-photo"><img src="devy.png" alt="Devy Sylvya" draggable="false"></div>
    <div class="kv-name brush" style="--bc:#efcfcc"><span>Devy Sylvya</span>${DOOD.heart(34)}</div>
    <div class="kv-sub">Muslimah · Pendidik · Pembelajar</div>
    <div class="kv-roles">${roles.map(([k,t,g],i)=>`<button class="kv-role brush" data-go="${g}" style="--bc:color-mix(in srgb,${CATS[k].color} 62%,#f3ece1);--r:${[-2,1.5,-1,2,-1.5,1][i]}deg" title="Buka rekap ${t}"><span>${t} ›</span></button>`).join("")}</div>
    <div class="kv-motto">${DOOD.heart(20)}${inp("motto","Tulis motto tahun ini…","text-align:center;font-size:22px")}${DOOD.heart(20)}</div>
    <div class="kv-btns"><button class="tb primary" data-go="daily">Buka hari ini ›</button><button class="tb" data-go="index">Daftar isi</button></div>
    ${deco(DOOD.coffee,"left:34px;bottom:58px;transform:rotate(-5deg)")}<div class="kv-note n3">Semangat<br>terus! ♡</div>${deco(DOOD.arrow,"left:120px;bottom:70px")}
    ${deco(DOOD.sprig,"right:70px;bottom:120px")}<div class="kv-note n4">Better<br>Me ♡</div>
  </div>`;
}
function pgIndex(){
  const desc={yearly:"Satu tahun ajaran dalam satu halaman: klik bulan, minggu, atau tanggal",daily:"Jadwal per jam, to-do, pengingat, catatan harian",weekly:"Satu minggu dalam satu halaman",monthly:"Kalender bulan dengan semua agenda",
    rutin:"Isi jadwal tetap sekali, muncul otomatis di semua halaman",wakasek:"Program, rapat, tugas kurikulum",ipa:"Jadwal mengajar 9H, 9I, 9J & catatan kelas",
    s2:"Mata kuliah, tugas & tenggat kuliah",olahraga:"Sesi PT, kelas zumba & log latihan",ibadah:"Shalat, rawatib, dzikir, Al-Qur'an, puasa sunnah & rekap",keuangan:"Pemasukan, pengeluaran, posisi uang & grafik",catatan:"Halaman kosong bergaris untuk apa saja",teacher:"Absensi, nilai, agenda mengajar, modul & kalender akademik IPA",wkapp:"Data siswa & guru, DUK, pembagian tugas, jadwal, supervisi, rapor"};
  return header("Daftar Isi","Rencana yang baik adalah langkah awal menuju keberhasilan.")+
    `<div class="idx">${Object.entries(PAGES).filter(([k])=>desc[k]).map(([k,p])=>`<button class="idxcard" data-go="${k}"><span class="ic" style="background:${p.tab}">${p.icon}</span><span><small>Hal. ${PNUM[k]}</small><b>${p.title}</b><small>${desc[k]}</small></span></button>`).join("")}</div>
    <div class="cols c2" style="margin-top:6px">${box("Cara pakai",`<div style="font-size:14px;line-height:1.6">
      ⌨ <b>Ketik</b>: klik garis mana saja lalu tulis — tersimpan otomatis.<br>✎ <b>Tulis</b>: pakai stylus/jari/mouse untuk tulisan tangan.<br>
      ＋ <b>Agenda/Tugas</b> sekali isi → otomatis muncul di halaman harian, mingguan, bulanan & halaman peran.<br>‹ <b>Kembali</b> ke halaman sebelumnya, ↶ <b>Undo</b> / ↷ <b>Redo</b> untuk ketikan, coretan & agenda.</div>`,"note")}
      ${box("Warna kategori",`<div style="display:grid;gap:6px">${CAT_LIST().map(([k,c])=>c).map(c=>`<div style="display:flex;gap:8px;align-items:center;font-family:'Patrick Hand';font-size:18px;color:var(--navy)"><span style="width:16px;height:16px;border-radius:50%;background:${c.color}"></span>${c.name}</div>`).join("")}</div>`,"sky")}</div>`;
}
function pgDaily(){
  const ds=cur.d,d=parseD(ds),isToday=ds===ymd(new Date());
  const nav=`<div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:8px">
    <button class="navbtn" data-dnav="-1">‹</button><button class="pill" data-dnav="0">Hari ini</button><button class="navbtn" data-dnav="1">›</button>
    <input type="date" class="pill" data-djump value="${ds}" style="padding:3px 8px"></div>`;
  const hours=[];for(let h=5;h<=21;h++)hours.push(h);
  const timeline=()=>{
    const ev=onDay(ds).filter(i=>i.kind==="agenda");
    const allday=ev.filter(i=>!i.start);
    return (allday.length?`<div class="hour"><span class="h">—</span><div class="slot">${allday.map(chipEv).join("")}</div></div>`:"")+
      hours.map(h=>{const here=ev.filter(i=>i.start&&+i.start.slice(0,2)===h||(h===5&&i.start&&+i.start.slice(0,2)<5)||(h===21&&i.start&&+i.start.slice(0,2)>21));
        return `<div class="hour"><span class="h">${pad(h)}.00</span><div class="slot">${here.map(chipEv).join("")}${inp("h"+pad(h))}</div></div>`}).join("");
  };
  const todo=()=>{const due=items.filter(i=>i.kind==="tugas"&&(i.date===ds||(isToday&&!i.done&&i.date<ds))).sort((a,b)=>(a.done-b.done)||a.date.localeCompare(b.date));
    return list(due,"Belum ada tugas untuk hari ini.",{date:true})};
  const rem=()=>{const r=reminders();return r.length?r.slice(0,6).map(x=>`<div class="it" data-id="${x.it.id}"><span class="dot" style="background:${catOf(x.it).color}"></span><div style="flex:1"><div class="tt">${esc(x.it.title)}</div><div class="mt">${x.type==="tugas"?"Tenggat":"Mulai"} ${fmtShort(x.at)} ${x.it.start||""}</div></div><span class="badge ${x.late?"late":""}">${rel(x.at,x.type)}</span></div>`).join(""):`<div class="empty">Tidak ada yang mendesak 🌤️</div>`};
  const sport=()=>{const s=onDay(ds,["sport","gym","zumba"]).filter(i=>i.kind==="agenda");return s.length?s.map(i=>itRow(i)).join(""):`<div class="empty">Tidak ada jadwal latihan hari ini.</div>`};
  return header(fmtLong(d).replace(/, (\d+)/,",<br>$1"),"",crumbs("daily")+nav).replace("<h1>","<h1 style='font-size:40px'>")+
  `<div class="cols c32">
    <div>${box("Jadwal Hari Ini",`<div style="margin-top:-4px">${auto("tl",timeline)}</div>`)}</div>
    <div>
      ${box("3 Prioritas Utama",numbered("prio",3),"sky")}
      ${box("To-Do List",auto("todo",todo)+quickAdd("pribadi",ds))}
      ${box("🔔 Pengingat",auto("rem",rem),"note")}
      ${box("🕌 Ibadah",auto("ibd",()=>{const k="ibadah-"+ds;if(!notesCache[k]){loadNotesKey(k).then(()=>{if(cur.p==="daily")refreshAuto()})}
        const sc=ibScore(notesCache[k]&&notesCache[k].f),pt=prayerTimes(d),n=isToday?nextPrayer():null;
        return `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">${SHALAT.map(([kk,nm])=>`<span class="badge" style="background:${notesCache[k]&&notesCache[k].f&&notesCache[k].f["s_"+kk]?"#e5f4ea;color:#1f7a4d":"var(--blue-xl);color:var(--blue-d)"}">${nm} ${pt[kk]}</span>`).join("")}</div>
          <div class="mt" style="font-size:13px">${sc.uzur?"Sedang uzur":`Shalat ${sc.s}/5 · rawatib ${sc.r}/5`}${n?` · berikutnya <b>${n.nm} ${n.time}</b>`:""}</div>
          <div style="margin-top:6px"><button class="tb" data-go="ibadah" style="font-size:13px">Buka ibadah harian ›</button></div>`}),"note")}
      ${box("💰 Keuangan Hari Ini",auto("fday",()=>{const L=fin.filter(x=>x.date===ds),inn=L.filter(x=>x.t==="in").reduce((q,x)=>q+x.amt,0),out=L.filter(x=>x.t==="out").reduce((q,x)=>q+x.amt,0);
        return `<div class="ftiles" style="grid-template-columns:1fr 1fr"><div class="ft"><small>Pemasukan</small><b style="color:#1d5fae;font-size:15px">${fmtRp(inn)}</b></div><div class="ft"><small>Pengeluaran</small><b style="color:#b8501f;font-size:15px">${fmtRp(out)}</b></div></div>
          ${L.slice(0,4).map(x=>`<div class="mt" style="font-size:12.5px;display:flex;justify-content:space-between;gap:6px;padding:2px 0"><span>${esc(x.desc||catName(x))}</span><b>${x.t==="in"?"+":x.t==="out"?"−":"⇄"}${fmtShortRp(x.amt)}</b></div>`).join("")}${L.length>4?`<div class="mt" style="font-size:12px">+${L.length-4} transaksi lagi</div>`:""}
          <div style="margin-top:6px"><button class="tb" data-fday="${ds}" style="font-size:13px">${L.length?"Lihat laporan hari ini ›":"＋ Catat transaksi ›"}</button></div>`}))}
      ${box("Sport",auto("sport",sport)+`<label style="display:flex;gap:8px;align-items:center;font-family:'Patrick Hand';font-size:18px;color:var(--navy);margin-top:6px"><input type="checkbox" class="ck" data-f="latihan" ${fv("latihan")?"checked":""}> Sudah latihan hari ini</label>`+ta("olahraga",2,"Catatan latihan…"))}
    </div>
  </div>
  <div class="cols c2">${box("Catatan",ta("catatan",5))}${box("Syukur & Refleksi",ta("syukur",5),"note")}</div>`;
}
function chipEv(i){const c=catOf(i);return `<div class="chipev" data-id="${i.id}" style="background:${c.color}">${esc(i.title)} <small>${i.start?i.start+(i.end?"–"+i.end:""):"seharian"}</small></div>`}
function pgWeekly(){
  const s=weekStart(parseD(cur.d)),e=addDays(s,6),today=ymd(new Date());
  const t=`${s.getDate()} ${BULAN[s.getMonth()].slice(0,3)} – ${e.getDate()} ${BULAN[e.getMonth()].slice(0,3)}`;
  const nav=`<div style="display:flex;gap:8px;justify-content:center;margin-top:8px"><button class="navbtn" data-wnav="-7">‹</button><button class="pill" data-wnav="0">Minggu ini</button><button class="navbtn" data-wnav="7">›</button></div>`;
  let grid="";
  for(let i=0;i<7;i++){const d=addDays(s,i),ds=ymd(d);
    grid+=`<div class="daybox ${ds===today?"today":""}" data-dctx="${ds}"><h3 data-goday="${ds}">${HARI[d.getDay()]} <span>${d.getDate()} ${BULAN[d.getMonth()].slice(0,3)}</span></h3>
      ${auto("w"+i,()=>onDay(ds).map(mini).join("")||`<div class="empty" style="font-size:14px">—</div>`)}${ta("d"+i,3)}</div>`}
  grid+=`<div class="daybox" style="background:var(--blue-xl)"><h3>Fokus Minggu Ini</h3>${ta("fokus",6)}</div>`;
  const wt=()=>{const a=ymd(s),b=ymd(e);return list(items.filter(i=>i.kind==="tugas"&&i.date>=a&&i.date<=b).sort((x,y)=>x.date.localeCompare(y.date)),"Tidak ada tenggat minggu ini.",{date:true})};
  return header("Minggu "+t,"",crumbs("weekly")+nav)+`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${grid}</div>`+
    `<div class="cols c2">${box("Tenggat Minggu Ini",auto("wt",wt))}${box("Evaluasi Minggu Ini",ta("eval",5),"note")}</div>`;
}
function pgMonthly(){
  const d=parseD(cur.d),y=d.getFullYear(),m=d.getMonth(),s=weekStart(new Date(y,m,1)),today=ymd(new Date());
  const nav=`<div style="display:flex;gap:8px;justify-content:center;margin-top:8px"><button class="navbtn" data-mnav="-1">‹</button><button class="pill" data-mnav="0">Bulan ini</button><button class="navbtn" data-mnav="1">›</button></div>`;
  const cal=()=>{let h=`<div class="dh" style="background:var(--navy)">Mg</div>`+["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map(x=>`<div class="dh">${x}</div>`).join("");
    for(let i=0;i<42;i++){const dd=addDays(s,i),ds=ymd(dd);if(i>=35&&dd.getMonth()!==m)break;const l=onDay(ds);
      if(i%7===0)h+=`<button class="wkbtn" data-gowk="${ds}" title="Buka halaman mingguan">${i/7+1}<small>›</small></button>`;
      h+=`<div class="dc ${dd.getMonth()!==m?"o":""} ${ds===today?"t":""}" data-goday="${ds}"><b>${dd.getDate()}</b>${l.slice(0,4).map(mini).join("")}${l.length>4?`<div class="mini" style="color:var(--muted)">+${l.length-4} lagi</div>`:""}</div>`}
    return `<div class="cal">${h}</div>`};
  return header(BULAN[m]+" "+y,"",crumbs("monthly")+nav)+box("Kalender",auto("cal",cal)+`<div class="legend">${CAT_LIST().map(([k,c])=>c).map(c=>`<span><i class="dot" style="width:9px;height:9px;border-radius:50%;background:${c.color};display:inline-block"></i>${c.short}</span>`).join("")}</div>`)+
    `<div class="cols c2">${box("Target Bulan Ini",numbered("target",5),"sky")}${box("Tanggal Penting",ta("penting",6),"note")}</div>`;
}
function pgRutin(){
  const body=()=>{const ag=items.filter(i=>i.kind==="agenda");if(!ag.length)return`<div class="empty">Belum ada jadwal. Tekan “＋ Tambah jadwal rutin” untuk mulai.</div>`;
    return CAT_LIST().map(([k,c])=>{const a=ag.filter(i=>normCat(i.cat)===k).sort(byTime);if(!a.length)return"";
      return `<div style="margin:8px 0 4px;font-family:'Patrick Hand';font-size:19px;color:${c.color}">● ${c.name}</div>`+a.map(i=>{
        const when=i.repeat==="weekly"?(i.days||[]).slice().sort((x,y)=>((x+6)%7)-((y+6)%7)).map(x=>HR[x]).join(", "):i.repeat==="daily"?"Setiap hari":fmtShort(parseD(i.date));
        return `<div class="it" data-id="${i.id}"><span class="dot" style="background:${c.color}"></span><span class="tm">${i.start||"Seharian"}${i.end?"–"+i.end:""}</span><div style="flex:1"><div class="tt">${esc(i.title)}</div><div class="mt">${when}${i.until?" · s.d. "+fmtShort(parseD(i.until)):""}</div></div><span class="badge" style="background:var(--blue-xl);color:var(--blue-d)">ubah</span></div>`}).join("")}).join("")};
  return header("Jadwal Rutin","Isi sekali, muncul otomatis di setiap halaman.")+
    box("Semua Jadwal",auto("rutin",body)+`<div style="margin-top:10px"><button class="tb primary" data-new="agenda">＋ Tambah jadwal rutin</button></div>`)+
    `<div class="cols c2">${box("Catatan",ta("catatan",5),"note")}<div class="box sky quotecard" style="display:grid;place-items:center">“Mengatur waktu adalah <b>bentuk sayang</b> pada diri sendiri.”</div></div>`;
}
function pgRole(){
  if(cur.p==="s2"&&!cur.x)return pgS2();
  const P=PAGES[cur.p],cats=P.cats;
  const upcoming=()=>{const now=new Date();let h="";for(let i=0;i<14;i++){const ds=ymd(addDays(now,i)),l=onDay(ds,cats).filter(x=>x.kind==="agenda");
      if(l.length)h+=`<div style="font-family:'Patrick Hand';color:var(--blue-d);font-size:16px;margin-top:4px">${fmtShort(parseD(ds))}</div>`+l.map(x=>itRow(x)).join("")}
    return h||`<div class="empty">Tidak ada agenda 2 minggu ke depan.</div>`};
  const tasks=()=>list(tasksFor(cats),"Belum ada tugas.",{date:true});
  let extra="";
  const appBtn=cur.p==="wakasek"?`<div style="text-align:center;margin:14px 0 4px"><button class="tb primary" data-go="wkapp" style="font-size:16px;padding:10px 20px">📋 Buka Sistem Wakasek Kurikulum ›</button></div>`:cur.p==="ipa"?`<div style="text-align:center;margin:14px 0 4px"><button class="tb primary" data-go="teacher" style="font-size:16px;padding:10px 20px;background:#2a9d8f;border-color:#2a9d8f">🧪 Buka Teacher Dev (absen, nilai, modul) ›</button></div>`:"";
  if(cur.p==="wakasek") extra=`<div class="cols c2">${box("Program Kerja Bulan Ini",numbered("prog",6),"sky")}${box("Rapat & Koordinasi",ta("rapat",6),"note")}</div>`;
  if(cur.p==="ipa"){
    const jad=()=>{let r="";for(const dw of [1,2,3,4,5,6]){const l=items.filter(i=>i.cat==="ipa"&&i.kind==="agenda"&&i.repeat==="weekly"&&(i.days||[]).includes(dw)).sort(byTime);
        r+=`<tr><td>${HARI[dw]}</td><td>${l.map(i=>`<div class="mini" data-id="${i.id}"><b>${i.start||""}${i.end?"–"+i.end:""}</b> ${esc(i.title)}</div>`).join("")}${inp("j"+dw,"","font-size:16px")}</td></tr>`}
      return `<table class="tbl"><tr><th>Hari</th><th>Jadwal mengajar (otomatis dari Jadwal Rutin + ketik bebas)</th></tr>${r}</table>`};
    extra=box("Jadwal Mengajar",auto("jad",jad))+`<div class="cols" style="grid-template-columns:1fr 1fr 1fr">${["9H","9I","9J"].map(k=>box("Kelas "+k,ta("k"+k,5,"materi, siswa, catatan…"),"note")).join("")}</div>`;
  }
  if(cur.p==="s2") extra=`<div class="cols c2">${box("Mata Kuliah & Dosen",numbered("mk",6),"sky")}${box("Ide Makalah & Bacaan",ta("ide",6),"note")}</div>`;
  if(cur.p==="olahraga"){
    let rows="";for(let i=1;i<=6;i++)rows+=`<tr><td>${inp("lt"+i,"tgl","text-align:center")}</td><td>${inp("lj"+i,"latihan/kelas")}</td><td>${inp("lc"+i,"catatan PT / progres")}</td></tr>`;
    extra=`<div class="cols c2">${box("Target Latihan",numbered("tg",4),"sky")}${box("Catatan dari PT",ta("pt",4),"note")}</div>`+
      box("Log Latihan",`<table class="tbl"><tr><th>Tanggal</th><th>Latihan</th><th>Catatan</th></tr>${rows}</table>`);
  }
  const quotes={wakasek:"Kurikulum yang baik lahir dari koordinasi yang baik.",ipa:"Sains dimulai dari rasa ingin tahu.",s2:"Belajar adalah investasi yang tidak pernah rugi.",olahraga:"Tubuh yang kuat, pikiran yang segar."};
  const s2c=cur.p==="s2"?`<div class="s2cover"><span class="tape s2t1"></span><span class="tape s2t2"></span><img src="s2cover.jpg" alt="Sampul Kuliah S2 UHAMKA" draggable="false"></div>`:"";
  return s2c+header(cur.p==="olahraga"?"Sport":CATS[cats[0]].name,quotes[cur.p])+
    appBtn+`<div class="cols c2">${box("Agenda 2 Minggu ke Depan",auto("up",upcoming))}${box("Daftar Tugas",auto("tasks",tasks)+quickAdd(cats[0],""))}</div>`+extra+box("Catatan",ta("catatan",6));
}
function pgCatatan(){
  const n=cur.n||1;
  const nav=`<div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:8px"><button class="navbtn" data-cnav="-1" ${n<=1?"disabled":""}>‹</button><span class="pill">Halaman ${n} dari ${Math.max(n,catMax())}</span><button class="navbtn" data-cnav="1">›</button></div>`;
  return header("Catatan","Tulis apa saja: ide, rapat, materi, curhat.",nav)+box("Judul",inp("judul","Judul catatan…","font-size:24px"),"sky")+box("Isi",ta("isi",26));
}
const RENDER={keuangan:pgKeuangan,yearly:pgYearly,ibadah:pgIbadah,cover:pgCover,index:pgIndex,daily:pgDaily,weekly:pgWeekly,monthly:pgMonthly,rutin:pgRutin,wakasek:pgRole,ipa:pgRole,s2:pgRole,olahraga:pgRole,catatan:pgCatatan};

/* =================== navigation & rendering =================== */
let noteUnsub=null;
function watchNotes(key){if(noteUnsub){try{noteUnsub()}catch(e){}noteUnsub=null}if(!db)return;
  try{noteUnsub=db.doc("notes/"+key).onSnapshot(snap=>{if(!snap.exists||snap.metadata.hasPendingWrites||snap.metadata.fromCache)return;
    const path="notes/"+key;if(pendingSaves[path]||writing[path])return; // our own save is still on its way: wait for the confirmed state
    const inc=JSON.parse(JSON.stringify((snap.data()||{}).f||{}));const n=notesCache[key]||(notesCache[key]={f:{}});if(Object.isFrozen(n)||Object.isFrozen(n.f||{}))notesCache[key]={f:{...(n.f||{})}};const nn=notesCache[key];
    const pend=notePatch[key]||new Set(),LE=localEdits[key]||{};let changed=false;
    for(const [nm,v] of Object.entries(inc)){if(pend.has(nm)||JSON.stringify(nn.f[nm])===JSON.stringify(v))continue;
      if(LE[nm]&&Date.now()-LE[nm]<120000)continue; // a change made here in the last 2 minutes always wins over what the server echoes back
      const el=pageKey(cur)===key?document.querySelector(`[data-f="${CSS.escape(nm)}"]`):null;if(el&&document.activeElement===el)continue;
      nn.f[nm]=v;changed=true;if(el){if(el.type==="checkbox")el.checked=!!v;else el.value=v??""}}
    if(changed&&pageKey(cur)===key){if(key.startsWith("ibadah-"))syncIbDay(key.slice(7));setTimeout(refreshAuto,50)}
  },()=>{})}catch(e){}}
async function go(pg,push=true){
  flushSaves();navDir=window.__turnDir||(push?1:-1);window.__turnDir=0;
  if(typeof pg==="string")pg={p:pg};
  if(["daily","weekly","monthly","ibadah","yearly","keuangan"].includes(pg.p)&&!pg.d)pg.d=ymd(new Date());
  if(pg.p==="catatan"&&!pg.n)pg.n=1;
  if(push&&pageKey(pg)!==pageKey(cur))navStack.push(cur);
  if(navStack.length>100)navStack.shift();
  cur=pg;
  if(PAGES[cur.p].app&&!cur.cv){showApp();try{localStorage.setItem(LSK+"last",JSON.stringify(cur))}catch(e){}return}
  document.body.classList.remove("appmode");
  const key=pageKey(cur);
  await loadNotesKey(key);watchNotes(key);
  if(!inkCache[key]){let v;try{v={s:decInk(await backend.get("ink/"+key))}}catch(e){v={s:[]}}if(!inkCache[key])inkCache[key]=v}
  if(!mediaCache[key]){let v;try{const d=await backend.get("media/"+key);v={m:(d&&d.m)||[]}}catch(e){v={m:[]}}if(!mediaCache[key])mediaCache[key]=v}
  clearSel();selMedia=null;setTimeout(()=>refreshRemote(key),400);
  if(cur.p==="catatan"&&(cur.n||1)>catMax())setCatMax(cur.n);
  if(pageKey(cur)!==key)return; // navigated again meanwhile
  renderPage();
  window.scrollTo({top:0});
  try{localStorage.setItem(LSK+"last",JSON.stringify(cur))}catch(e){}
}
function renderPage(){
  if(PAGES[cur.p].app&&!cur.cv)return;
  for(const k in autos)delete autos[k];
  const P=PAGES[cur.p];
  const tabs=Object.entries(PAGES).filter(([,p])=>p.tab).map(([k,p])=>`<button class="tab ${k===cur.p?"on":""}" data-gocv="${k}" style="background:${p.tab}">${p.title}</button>`).join("");
  $("#page").innerHTML=`<div class="rings">${"<i></i>".repeat(22)}</div><div class="tabs">${tabs}</div>
    <div class="sheet" id="sheet"><div class="paper${cur.p==="cover"&&!cur.x?" kraft":""}" id="paper">${pagerBar()}${cur.cv?pgSecCover():curExtra()&&curExtra().t==="blank"?pgBlank(curExtra()):curExtra()&&curExtra().t==="img"?pgImg(curExtra()):RENDER[cur.p]()}<span class="pnum">${PNUM[cur.p]}${cur.x?"."+(extraList(cur.p).findIndex(e=>e.id===cur.x)+2):""}</span><div class="mlayer" id="mlayer"></div><canvas class="cv hl" id="cv-hl"></canvas><canvas class="cv ink" id="cv-ink"></canvas><canvas class="cv live" id="cv-live"></canvas><div class="selmenu" id="selMenu"></div></div><div id="sheetMask"></div><div id="sheetFoot"></div></div>`;
  renderMedia();try{updNav()}catch(e){}
  {const pp=$("#paper");if(pp&&renderPage.done){pp.classList.add(navDir<0?"flipB":"flipF");pp.addEventListener("animationend",()=>pp.classList.remove("flipF","flipB"),{once:true})}renderPage.done=true}
  if(cur.p==="keuangan"&&!cur.x){finSetup();asetSetup();emasSetup()}
  $("#crumb").textContent=P.title+(curExtra()?" · "+(curExtraTitle()):cur.p==="daily"?" · "+fmtShort(parseD(cur.d)):"");
  $("#backBtn").disabled=!navStack.length;
  layout();
}
function refreshAuto(){
  if(PAGES[cur.p]&&PAGES[cur.p].app)return;
  for(const [id,fn] of Object.entries(autos)){const el=document.querySelector(`[data-auto="${id}"]`);if(el)el.innerHTML=fn()}
  layout();
}
let scale=1;
function layout(){
  if(document.body.classList.contains("appmode")){sizeApp();return}
  const page=$("#page"),stage=$("#stage");
  const railW=document.body.classList.contains("railhidden")?0:76,inkW=(document.body.classList.contains("inkmode")&&!document.body.classList.contains("appmode"))?168:0;
  const avail=Math.min(document.documentElement.clientWidth-railW-inkW-24,1100);
  scale=Math.min(1.25,avail/820)*zoom;
  try{applySheet()}catch(e){console.warn(e)}
  page.style.transform=`scale(${scale})`;
  stage.style.width=820*scale+"px";stage.style.height=page.offsetHeight*scale+"px";
  if(layout.fast){clearTimeout(layout.t);layout.t=setTimeout(sizeCanvas,250)}else sizeCanvas();
}
window.addEventListener("resize",layout);

/* =================== mode lembar (halaman proporsional) =================== */
let sheetMode=true;try{const v=localStorage.getItem(LSK+"sheet");if(v!==null)sheetMode=v==="1"}catch(e){}
const SHEET_H=1080,SHEET_PB=58;let sheetIdx=0,sheetBreaks=[0],sheetKey="";
function offTop(el,root){let y=0;while(el&&el!==root){y+=el.offsetTop;el=el.offsetParent}return el===root?y:null}
let sheetCont=[];
const SHEET_CT=26;function computeSheets(){const paper=$("#paper");if(!paper)return;if(cur.p==="cover"||cur.cv){sheetBreaks=[0];sheetCont=[""];return}const H=SHEET_H-SHEET_PB-12-2*SHEET_CT;
  paper.querySelectorAll(".cols.stack").forEach(c=>c.classList.remove("stack"));
  const top0=[...paper.children].filter(c=>!c.matches(".pnum,.mlayer,canvas,.selmenu,svg,.deco")&&c.offsetHeight>0);
  top0.forEach(c=>{if(c.matches(".cols")&&c.offsetHeight>H*.85)c.classList.add("stack")});
  const kids=[];top0.forEach(c=>{if(c.matches(".cols.stack"))kids.push(...[...c.children].filter(x=>x.offsetHeight>0));else kids.push(c)});
  const total=paper.offsetHeight,br=[0],cont=[""];let c0=0;
  const vtop=el=>{if(el.matches(".box")){const t=offTop(el,paper);return t==null?null:t-15}const ib=[...el.querySelectorAll(":scope>.box")].map(x=>offTop(x,paper)).filter(y=>y!=null);if(ib.length)return Math.min(...ib)-15;const t=offTop(el,paper);return t==null?null:t-4};
  const labelAt=y=>{let best=null;paper.querySelectorAll(".box").forEach(bx=>{const t=offTop(bx,paper);if(t!=null&&t<y-4&&t+bx.offsetHeight>y+4){if(!best||t>best.t)best={t,l:(bx.querySelector(":scope>.label")||{}).textContent||""}}});return best?best.l:""};
  const rows=el=>{const set=new Set([...el.querySelectorAll("tr,.ftx,.it,.s2r,.fgh,.mini,.tli,.frt,.lchips,.mkcard,.ftiles,.idxcard,.ymon,.quick,.s2add,.finform,.znis,.zhead,.mkhead,.legend,.fgrp,.jcard,.box,.ibtiles,.detrow,h3,.empty"),...el.children,...[...el.children].flatMap(c=>{if(c.matches(".box"))return[];const d=getComputedStyle(c).display;return d==="grid"||d==="flex"?[...c.children]:[]})]);
    return [...set].map(e=>{const y=offTop(e,paper);return y==null?null:(e.matches(".box")?y-15:e.matches(".ymon,.mkcard,.idxcard,.jcard,.mini,.s2r,.fgh,.quick,.s2add,.finform,.ibtiles,.ftiles")?y-9:y-6)}).filter(y=>y!=null).sort((x,y)=>x-y)};
  for(const k of kids){const t=offTop(k,paper);if(t==null)continue;const vt=vtop(k),b=t+k.offsetHeight+3;
    if(b-c0<=H)continue;
    const fits=b-vt<=H,room=c0+H-vt,rs=rows(k),inner=rs.filter(y=>y>vt+100&&y<=c0+H);
    if(vt>c0+30&&(room<H*.3||(fits&&!inner.length))){c0=vt;br.push(c0);cont.push("");if(b-c0<=H)continue}
    const leaf=[...k.querySelectorAll("label,input,select,textarea,button,td,th,h3,p,small,b,img,canvas,svg,.ln")].map(e=>{const y=offTop(e,paper);return y==null||!e.offsetHeight?null:[y,y+e.offsetHeight]}).filter(Boolean);
           const clean=y=>!leaf.some(([t1,b1])=>t1<y-1&&b1>y+1);
           while(b-c0>H){const ok=rs.filter(y=>y>c0+140&&y<=c0+H);let c=ok.filter(clean).pop();if(c==null||c<c0+H*.5)c=ok.pop()??c;if(c==null)c=c0+H;c0=c;br.push(c0);cont.push(labelAt(c0+8))}}
  const cBot=Math.max(0,...kids.map(k=>{const t=offTop(k,paper);return t==null?0:t+k.offsetHeight}));
  while(cBot-c0>H+4&&br.length<80){c0+=H;br.push(c0);cont.push(labelAt(c0+8))}
  /* judul bagian (.fsec) jangan tertinggal sendirian di bawah lembar */
  const heads=[...paper.querySelectorAll(".fsec")].map(e=>{const y=offTop(e,paper);return y==null?null:[y,y+e.offsetHeight]}).filter(Boolean);
  for(let i=1;i<br.length;i++){const y=br[i];const h=heads.find(([t,bt])=>bt<=y+2&&y-bt<140&&t>br[i-1]+100);if(h){br[i]=h[0]-8;cont[i]=""}}
  /* seimbangkan: lembar terakhir jangan hanya berisi sisa sedikit */
  if(br.length>1){const last=br[br.length-1],prev=br[br.length-2];if(total-last<170){
    const cands=[...new Set(kids.flatMap(k=>[vtop(k),...rows(k)]))].filter(y=>y!=null&&y>prev+H*.45&&y<last&&total-y<=H).sort((a,b)=>a-b);
    if(cands.length){const y=cands[0];br[br.length-1]=y;cont[cont.length-1]=labelAt(y+8)}}}
  sheetBreaks=br;sheetCont=cont}
function applySheet(){const sh=$("#sheet"),paper=$("#paper"),mask=$("#sheetMask"),foot=$("#sheetFoot");if(!sh||!paper)return;
  document.body.classList.toggle("sheetmode",sheetMode);
  if(!sheetMode){paper.style.top="";return}
  const key=pageKey(cur);if(key!==sheetKey){sheetKey=key;sheetIdx=0}
  computeSheets();const n=sheetBreaks.length;sheetIdx=Math.max(0,Math.min(sheetIdx,n-1));
  const top=sheetBreaks[sheetIdx],end=sheetIdx<n-1?sheetBreaks[sheetIdx+1]:paper.offsetHeight,vis=end-top;
  const off=sheetIdx>0?SHEET_CT:0;paper.style.top=(off-top)+"px";sh.scrollTop=0;
  mask.style.top=Math.max(0,vis+off)+"px";mask.style.display=vis+off<SHEET_H?"":"none";
  const pn=PNUM[cur.p]?PNUM[cur.p]+(cur.x?"."+(extraList(cur.p).findIndex(e=>e.id===cur.x)+2):""):"";
  let ct=$("#sheetCont");if(!ct){ct=document.createElement("div");ct.id="sheetCont";sh.appendChild(ct)}
  const cTop=sheetCont[sheetIdx],cNext=sheetIdx<n-1?sheetCont[sheetIdx+1]:"";
  ct.innerHTML=(off?`<div class="ct-band" style="height:${off+3}px"></div>`:"")+(cTop?`<span class="ct-top">↪ lanjutan · ${esc(cTop)}</span>`:"")+(cNext?`<span class="ct-bot" style="top:${Math.max(0,vis+off)+4}px">bersambung ke lembar berikutnya ›</span>`:"");
  foot.innerHTML=(n>1&&sheetIdx>0?`<button data-sheet="-1" title="Lembar sebelumnya">‹</button>`:"")+`<span class="pnum2">${pn}</span>${n>1?`<span class="lbr">Lembar ${sheetIdx+1}/${n}</span>`:""}`+(n>1&&sheetIdx<n-1?`<button data-sheet="1" title="Lembar berikutnya">›</button>`:"");
  try{updNav()}catch(e){}}
function sheetGo(d){const n=sheetBreaks.length,ni=sheetIdx+d;if(ni<0||ni>=n)return false;sheetIdx=ni;applySheet();
  const sh=$("#sheet");sh.classList.remove("flipF","flipB");void sh.offsetWidth;sh.classList.add(d>0?"flipF":"flipB");sh.addEventListener("animationend",()=>sh.classList.remove("flipF","flipB"),{once:true});
  const st=$("#stage");if(st){const r=st.getBoundingClientRect();if(r.top<0)window.scrollBy({top:r.top-8,behavior:"smooth"})}return true}
function setSheetMode(v){sheetMode=v;try{localStorage.setItem(LSK+"sheet",v?"1":"0")}catch(e){}sheetIdx=0;$("#paper")&&($("#paper").style.top="");document.body.classList.toggle("sheetmode",v);
  const b=$("#sheetBtn");if(b){b.querySelector("i").textContent=v?"📄":"📜";b.querySelector("small").textContent=v?"Lembar":"Gulir"}
  layout();toast(v?"📄 Mode lembar: halaman berukuran tetap, isi panjang dibagi ke beberapa lembar.":"📜 Mode gulir: halaman memanjang ke bawah.")}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-sheet]");if(b){e.stopPropagation();sheetGo(+b.dataset.sheet)}},true);
document.addEventListener("scroll",e=>{if(e.target&&e.target.id==="sheet"&&e.target.scrollTop)e.target.scrollTop=0},true);

/* =================== handwriting =================== */
const TOOLDEF={
  select:{ic:"✋",lb:"Geser",tip:"Pilih, geser, ubah ukuran & kunci stiker/gambar"},
  lasso:{ic:"➰",lb:"Laso",tip:"Lingkari tulisan tangan untuk digeser, disalin, dihapus atau diganti warnanya"},
  pen:{ic:"✒️",lb:"Pulpen",c:"#24395f",w:3,o:100},
  pencil:{ic:"✏️",lb:"Pensil",c:"#4b5563",w:2.5,o:80},
  brush:{ic:"🖌️",lb:"Kuas",c:"#3f6fb0",w:10,o:100},
  marker:{ic:"🖊️",lb:"Spidol",c:"#c0392b",w:6,o:90},
  calli:{ic:"🖋️",lb:"Kaligrafi",c:"#24395f",w:8,o:100},
  hl:{ic:"🖍️",lb:"Stabilo",c:"#ffe45c",w:20,o:55},
  eraser:{ic:"🧽",lb:"Hapus",w:16}
};
const DRAW=["pen","pencil","brush","marker","calli","hl"];
const OPA=["pencil","marker","hl"];
let TS={};try{TS=JSON.parse(localStorage.getItem(LSK+"tools")||"{}")}catch(e){}
for(const k in TOOLDEF)TS[k]={...TOOLDEF[k],...(TS[k]||{}),ic:TOOLDEF[k].ic,lb:TOOLDEF[k].lb};
let tool="pen",lastDraw="pen",eraseMode="stroke",straight=false;
const saveTS=()=>{try{localStorage.setItem(LSK+"tools",JSON.stringify(TS))}catch(e){}};
const PENC=["#24395f","#111827","#6b7280","#ffffff","#3f6fb0","#38bdf8","#2a9d8f","#4f8f6a","#7b5ea7","#c95b8e","#c0392b","#d07a3e","#e0a526","#8b5e3c"];
const HLC=["#ffe45c","#ffb3c7","#9ff0b0","#a9d8ff","#ffc98a","#d9c2ff"];

/* ---- stroke encoding: p = [x,y,pressure,...] ---- */
function decInk(d){
  if(!d||!d.s)return[];
  if(d.v===2)return d.s.map(x=>({t:x.t,c:x.c,w:x.w,o:x.o??100,p:x.p.map((v,i)=>i%3===2?v/9:v/2)}));
  return d.s.map(x=>{const p=[];for(let i=0;i<x.p.length;i+=2)p.push(x.p[i],x.p[i+1],.5);return x.h?{t:"hl",c:x.c,w:x.w*4,o:35,p}:{t:"pen",c:x.c,w:x.w,o:100,p}});
}
const encInk=arr=>({v:2,s:arr.map(x=>({t:x.t,c:x.c,w:x.w,o:x.o,p:x.p.map((v,i)=>i%3===2?Math.round(v*9):Math.round(v*2))}))});
function saveInk(key){queueSave("ink/"+key,()=>encInk(inkCache[key].s),1000)}
const lay=s=>s.t==="hl"?"hl":"ink";
const bbC=new WeakMap();
function bbox(s){let b=bbC.get(s);if(b)return b;let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;const p=s.p;
  for(let i=0;i<p.length;i+=3){if(p[i]<x1)x1=p[i];if(p[i]>x2)x2=p[i];if(p[i+1]<y1)y1=p[i+1];if(p[i+1]>y2)y2=p[i+1]}
  b={x:x1,y:y1,w:x2-x1,h:y2-y1};bbC.set(s,b);return b}

/* ---- canvases ---- */
let paperEl=null,BS=1,cvW=0,cvH=0,curEl=null;
const LY={hl:{},ink:{},live:{}};
let drawing=null,sel=null,lassoPts=null,moveOff=null,eraserPos=null;
const hidden=new Set();
function sizeCanvas(){
  paperEl=$("#paper");if(!paperEl||!$("#cv-live"))return;
  const w=paperEl.offsetWidth,h=Math.max(paperEl.offsetHeight,paperEl.scrollHeight),bs=Math.min((window.devicePixelRatio||1)*scale,2.2);
  const same=w===cvW&&h===cvH&&Math.abs(bs-BS)<.01&&curEl===$("#cv-live");
  cvW=w;cvH=h;BS=bs;curEl=$("#cv-live");
  if(!same)for(const n of["hl","ink","live"]){const L=LY[n];L.el=$("#cv-"+n);L.el.style.width=w+"px";L.el.style.height=h+"px";
    L.el.width=Math.round(w*bs);L.el.height=Math.round(h*bs);L.ctx=L.el.getContext("2d",n==="live"?{desynchronized:true}:undefined);L.ctx.setTransform(bs,0,0,bs,0,0)}
  rebuild();
}
function clearCtx(L){L.ctx.setTransform(1,0,0,1,0,0);L.ctx.clearRect(0,0,L.el.width,L.el.height);L.ctx.setTransform(BS,0,0,BS,0,0)}
function rebuild(){
  if(!LY.ink.ctx)return;const k=inkCache[pageKey(cur)];
  for(const n of["hl","ink"]){const L=LY[n];clearCtx(L);if(k)for(const s of k.s)if(!hidden.has(s)&&lay(s)===n)drawStroke(L.ctx,s)}
  frame();
}
let rafP=false;const schedFrame=()=>{if(rafP)return;rafP=true;requestAnimationFrame(()=>{rafP=false;frame()})};
function frame(){
  const L=LY.live;if(!L.ctx)return;clearCtx(L);const c=L.ctx;
  if(drawing&&drawing.s){if(drawing.s.t==="hl"){c.save();c.globalCompositeOperation="multiply";drawStroke(c,drawing.s);c.restore()}else drawStroke(c,drawing.s)}
  if(sel){const dx=moveOff?moveOff.dx:0,dy=moveOff?moveOff.dy:0;if(moveOff)for(const s of sel.set)drawStroke(c,s,dx,dy);
    const b=sel.box;c.save();c.setLineDash([6,5]);c.strokeStyle="#3f5f8f";c.lineWidth=1.5;c.fillStyle="rgba(125,156,200,.10)";c.fillRect(b.x+dx,b.y+dy,b.w,b.h);c.strokeRect(b.x+dx,b.y+dy,b.w,b.h);c.restore()}
  if(lassoPts&&lassoPts.length>2){c.save();c.setLineDash([5,5]);c.strokeStyle="#3f5f8f";c.lineWidth=1.6;c.fillStyle="rgba(125,156,200,.12)";c.beginPath();c.moveTo(lassoPts[0],lassoPts[1]);
    for(let i=2;i<lassoPts.length;i+=2)c.lineTo(lassoPts[i],lassoPts[i+1]);c.closePath();c.fill();c.stroke();c.restore()}
  if(eraserPos){c.save();c.strokeStyle="#7a8496";c.lineWidth=1.2;c.setLineDash([3,3]);c.beginPath();c.arc(eraserPos[0],eraserPos[1],TS.eraser.w/2,0,7);c.stroke();c.restore()}
}
function pathOf(c,X,Y,n){c.beginPath();c.moveTo(X(0),Y(0));if(n===2){c.lineTo(X(1),Y(1));return}
  for(let i=1;i<n-1;i++)c.quadraticCurveTo(X(i),Y(i),(X(i)+X(i+1))/2,(Y(i)+Y(i+1))/2);c.lineTo(X(n-1),Y(n-1))}
function drawStroke(c,s,dx=0,dy=0){
  const p=s.p,n=p.length/3;if(!n)return;
  const X=i=>p[i*3]+dx,Y=i=>p[i*3+1]+dy,P=i=>p[i*3+2];
  c.save();c.lineCap="round";c.lineJoin="round";c.strokeStyle=s.c;c.fillStyle=s.c;c.globalAlpha=(s.o??100)/100;
  if(n===1){c.beginPath();c.arc(X(0),Y(0),Math.max(.8,s.w/2),0,7);c.fill();c.restore();return}
  if(s.t==="hl"||s.t==="marker"||s.t==="pencil"){
    c.lineWidth=s.w;if(s.t==="hl")c.lineCap="square";
    pathOf(c,X,Y,n);c.stroke();
    if(s.t==="pencil"){c.globalAlpha*=.4;c.lineWidth=Math.max(.5,s.w*.45);
      for(const [ox,oy] of[[.45,-.35],[-.4,.4]]){pathOf(c,i=>X(i)+ox*s.w*.5,i=>Y(i)+oy*s.w*.5,n);c.stroke()}}
  }else{
    // variable width: smooth curve pieces between midpoints
    const W=i=>{if(s.t==="calli"){const j=Math.max(1,i),a=Math.atan2(Y(j)-Y(j-1),X(j)-X(j-1));return s.w*(.15+.85*Math.abs(Math.sin(a-Math.PI/4)))}
      return s.t==="brush"?s.w*(.2+1.5*P(i)):s.w*(.55+.9*P(i))};
    let mx=X(0),my=Y(0);
    for(let i=1;i<n;i++){const nx=i<n-1?(X(i)+X(i+1))/2:X(i),ny=i<n-1?(Y(i)+Y(i+1))/2:Y(i);
      c.lineWidth=Math.max(.5,W(i));c.beginPath();c.moveTo(mx,my);c.quadraticCurveTo(X(i),Y(i),nx,ny);c.stroke();mx=nx;my=ny}
  }
  c.restore();
}

/* ---- pointer input (stylus-friendly) ---- */
const touches=new Map();let pinch=null,penDown=false,fling=null;
try{stylusOnly=localStorage.getItem(LSK+"stylus")==="1"}catch(e){}
function pp(e){const r=paperEl.getBoundingClientRect();return[(e.clientX-r.left)/scale,(e.clientY-r.top)/scale]}
const inBox=(x,y,b)=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h;
function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-2;i<P.length;j=i,i+=2){const xi=P[i],yi=P[i+1],xj=P[j],yj=P[j+1];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
function cancelDraw(){if(drawing&&drawing.erase&&drawing.changed)inkCache[drawing.key].s=drawing.before;drawing=null;lassoPts=null;moveOff=null;eraserPos=null;hidden.clear();rebuild()}
function setStylusOnly(v,quiet){stylusOnly=v;try{localStorage.setItem(LSK+"stylus",v?"1":"0")}catch(e){}
  $("#stylusBtn").classList.toggle("on",v);document.body.classList.toggle("stylusonly",v);
  if(!quiet)toast(v?"🖊️ Mode stylus: hanya stylus yang menulis. Geser halaman dengan 1 jari, zoom dengan 2 jari.":"✍️ Jari juga bisa menulis. Geser halaman dengan 2 jari.")}
/* stop the browser from scrolling/zooming/selecting while writing on the page */
const onInkSurface=t=>mode==="ink"&&tool!=="select"&&t&&t.id==="cv-live";
["touchstart","touchmove"].forEach(ev=>document.addEventListener(ev,e=>{if(onInkSurface(e.target)||penDown||drawing)e.preventDefault()},{passive:false}));
document.addEventListener("gesturestart",e=>{if(mode==="ink")e.preventDefault()});
document.addEventListener("contextmenu",e=>{if(mode==="ink"&&e.target.closest&&e.target.closest("#paper"))e.preventDefault()});
document.addEventListener("selectstart",e=>{if(mode==="ink"&&e.target.closest&&e.target.closest("#paper"))e.preventDefault()});

document.addEventListener("pointerdown",e=>{
  if(mediaDown(e))return;
  if(e.target.id!=="cv-live"||mode!=="ink"||tool==="select")return;
  e.preventDefault();if(fling){cancelAnimationFrame(fling);fling=null}
  if(e.pointerType==="pen"&&!stylusOnly)setStylusOnly(true);
  if(e.pointerType==="touch"){
    if(penDown)return; // palm rejection
    touches.set(e.pointerId,{x:e.clientX,y:e.clientY,t:e.timeStamp,vx:0,vy:0});
    if(touches.size===2){cancelDraw();const [a,b]=[...touches.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,z:zoom,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2};return}
    if(stylusOnly||touches.size>2)return; // one finger = scroll
  }
  if(e.pointerType==="pen")penDown=true;
  try{e.target.setPointerCapture(e.pointerId)}catch(x){}
  closePops();
  const [x,y]=pp(e),key=pageKey(cur),k=inkCache[key];
  if(tool==="eraser"){drawing={erase:true,key,before:k.s.slice(),changed:false,pid:e.pointerId};eraseAt(x,y);return}
  if(tool==="lasso"){
    if(sel&&inBox(x,y,sel.box)){drawing={move:true,key,sx:x,sy:y,pid:e.pointerId};moveOff={dx:0,dy:0};sel.set.forEach(s=>hidden.add(s));$("#selMenu").style.display="none";rebuild();return}
    clearSel();lassoPts=[x,y];drawing={lasso:true,key,pid:e.pointerId};return}
  if(sel)clearSel();
  const T=TS[tool];lastDraw=tool;
  const pr=e.pointerType==="pen"&&e.pressure>0?e.pressure:.5;
  drawing={key,pid:e.pointerId,s:{t:tool,c:T.c,w:T.w,o:OPA.includes(tool)?T.o:100,p:[x,y,pr]},lt:e.timeStamp,pr:.55,sx:x,sy:y};schedFrame();
},{passive:false});

document.addEventListener("pointermove",e=>{
  if(mdrag){mediaMove(e);return}
  if(e.pointerType==="touch"&&touches.has(e.pointerId)){
    const t=touches.get(e.pointerId),dt=Math.max(1,e.timeStamp-t.t),dx=e.clientX-t.x,dy=e.clientY-t.y;
    if(pinch&&touches.size===2){t.x=e.clientX;t.y=e.clientY;t.t=e.timeStamp;const [a,b]=[...touches.values()],cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
      window.scrollBy(pinch.cx-cx,pinch.cy-cy);pinch.cx=cx;pinch.cy=cy;
      setZoom(pinch.z*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d,cx,cy,true);return}
    if(touches.size===1&&(stylusOnly)&&!drawing){window.scrollBy(-dx,-dy);t.vx=t.vx*.6+(-dx/dt)*.4;t.vy=t.vy*.6+(-dy/dt)*.4;t.x=e.clientX;t.y=e.clientY;t.t=e.timeStamp;return}
  }
  if(!drawing||e.pointerId!==drawing.pid)return;
  let evs=e.getCoalescedEvents?e.getCoalescedEvents():[];if(!evs.length)evs=[e];
  for(const ev of evs){let [x,y]=pp(ev);
    if(drawing.erase){eraseAt(x,y);continue}
    if(drawing.lasso){lassoPts.push(x,y);continue}
    if(drawing.move){moveOff={dx:x-drawing.sx,dy:y-drawing.sy};continue}
    const s=drawing.s,p=s.p,L=p.length;
    if(s.t!=="hl"&&!straight){x=p[L-3]+(x-p[L-3])*.65;y=p[L-2]+(y-p[L-2])*.65} // light smoothing
    const d=Math.hypot(x-p[L-3],y-p[L-2]);if(d<.6&&!straight)continue;
    let pr;if(ev.pointerType==="pen"&&ev.pressure>0)pr=p[L-1]*.5+ev.pressure*.5;
    else{const v=d/Math.max(1,ev.timeStamp-drawing.lt);pr=drawing.pr=drawing.pr*.75+Math.max(.15,Math.min(.95,.9-v*.35))*.25}
    drawing.lt=ev.timeStamp;drawing.rx=ev.clientX;drawing.ry=ev.clientY;
    if(straight){let ey=y;if(s.t==="hl"&&Math.abs(ey-drawing.sy)<12)ey=drawing.sy;s.p=[drawing.sx,drawing.sy,p[2],x,ey,pr]}else p.push(x,y,pr)}
  schedFrame();
},{passive:false});

function startFling(t){let vx=t.vx*16,vy=t.vy*16;if(Math.hypot(vx,vy)<2)return;
  const step=()=>{window.scrollBy(vx,vy);vx*=.92;vy*=.92;fling=Math.hypot(vx,vy)>.5?requestAnimationFrame(step):null};fling=requestAnimationFrame(step)}
function endPointer(e){
  if(mdrag){mediaUp();return}
  if(e.pointerType==="pen")penDown=false;
  if(e.pointerType==="touch"&&touches.has(e.pointerId)){const t=touches.get(e.pointerId);touches.delete(e.pointerId);
    if(pinch&&touches.size<2){pinch=null;sizeCanvas();for(const v of touches.values()){v.x=NaN}touches.clear();return}
    if(stylusOnly&&!drawing&&e.type==="pointerup")startFling(t)}
  if(!drawing||e.pointerId!==drawing.pid)return;const d=drawing;drawing=null;const k=inkCache[d.key];
  if(d.erase){eraserPos=null;if(d.changed)commitInk(d.key,d.before,k.s.slice(),"hapus coretan");else frame();return}
  if(d.lasso){finishLasso();return}
  if(d.move){const {dx,dy}=moveOff;moveOff=null;sel.set.forEach(s=>hidden.delete(s));
    if(Math.abs(dx)+Math.abs(dy)<1){rebuild();showSelMenu();return}
    const before=k.s.slice(),ns=new Set();
    const after=k.s.map(s=>{if(!sel.set.has(s))return s;const n={...s,p:s.p.map((v,i)=>i%3===0?v+dx:i%3===1?v+dy:v)};ns.add(n);return n});
    sel={set:ns,box:{...sel.box,x:sel.box.x+dx,y:sel.box.y+dy}};commitInk(d.key,before,after,"geser tulisan");showSelMenu();return}
  const s=d.s;
  if(!straight&&d.rx!==undefined&&s.t!=="hl"){const [x,y]=pp({clientX:d.rx,clientY:d.ry});const L=s.p.length;if(Math.hypot(x-s.p[L-3],y-s.p[L-2])>.6)s.p.push(x,y,s.p[L-1])}
  if(straight&&s.p.length===6){const [x1,y1,p1,x2,y2,p2]=s.p,n=Math.max(1,Math.ceil(Math.hypot(x2-x1,y2-y1)/3));s.p=[];for(let i=0;i<=n;i++){const t=i/n;s.p.push(x1+(x2-x1)*t,y1+(y2-y1)*t,p1+(p2-p1)*t)}}
  const before=k.s.slice(),after=[...before,s];
  inkCache[d.key].s=after.slice();drawStroke(LY[lay(s)].ctx,s);frame();saveInk(d.key);
  pushUndo({label:"coretan",page:{...cur},undo:()=>setInk(d.key,before),redo:()=>setInk(d.key,after)});
}
document.addEventListener("pointerup",endPointer);
document.addEventListener("pointercancel",e=>{if(e.pointerType==="pen")penDown=false;if(e.pointerType==="touch"){touches.delete(e.pointerId);if(touches.size<2&&pinch){pinch=null;sizeCanvas()}}
  if(drawing&&e.pointerId===drawing.pid){if(drawing.s)endPointer(e);else cancelDraw()}if(mdrag)mediaUp()});

function commitInk(key,before,after,label){setInk(key,after);pushUndo({label,page:{...cur},undo:()=>setInk(key,before),redo:()=>setInk(key,after)})}
function setInk(key,arr){inkCache[key]=inkCache[key]||{s:[]};inkCache[key].s=arr.slice();
  if(sel){const live=new Set(arr);for(const s of[...sel.set])if(!live.has(s))sel.set.delete(s);if(!sel.set.size)clearSel()}
  if(pageKey(cur)===key)rebuild();saveInk(key)}
function distSeg(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;let t=l?((px-ax)*dx+(py-ay)*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(px-ax-t*dx,py-ay-t*dy)}
function eraseAt(x,y){
  eraserPos=[x,y];const k=inkCache[drawing.key],r=TS.eraser.w/2;let out=[],ch=false;
  for(const s of k.s){const b=bbox(s),rr=r+s.w/2;
    if(x<b.x-rr||x>b.x+b.w+rr||y<b.y-rr||y>b.y+b.h+rr){out.push(s);continue}
    const p=s.p,n=p.length/3;
    if(eraseMode==="stroke"){let hit=n===1&&Math.hypot(p[0]-x,p[1]-y)<rr;
      for(let i=1;i<n&&!hit;i++)if(distSeg(x,y,p[i*3-3],p[i*3-2],p[i*3],p[i*3+1])<rr)hit=true;
      if(hit){ch=true;continue}out.push(s)}
    else{let seg=[],pcs=[],hit=false;
      for(let i=0;i<n;i++){if(Math.hypot(p[i*3]-x,p[i*3+1]-y)<rr){hit=true;if(seg.length)pcs.push(seg);seg=[]}else seg.push(p[i*3],p[i*3+1],p[i*3+2])}
      if(seg.length)pcs.push(seg);if(!hit){out.push(s);continue}ch=true;for(const pc of pcs)out.push({...s,p:pc})}}
  if(ch){k.s=out;drawing.changed=true;rebuild()}else schedFrame();
}

/* ---- lasso selection ---- */
function finishLasso(){
  const poly=lassoPts;lassoPts=null;if(!poly||poly.length<6){frame();return}
  const set=new Set();
  for(const s of inkCache[pageKey(cur)].s){const p=s.p,n=p.length/3;let c=0;for(let i=0;i<n;i++)if(inPoly(p[i*3],p[i*3+1],poly))c++;if(c/n>=.5)set.add(s)}
  if(!set.size){toast("Tidak ada tulisan tangan di dalam laso.");frame();return}
  sel={set,box:selBox(set)};showSelMenu();frame();
}
function selBox(set){let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;for(const s of set){const b=bbox(s),m=s.w/2+6;x1=Math.min(x1,b.x-m);y1=Math.min(y1,b.y-m);x2=Math.max(x2,b.x+b.w+m);y2=Math.max(y2,b.y+b.h+m)}return{x:x1,y:y1,w:x2-x1,h:y2-y1}}
function showSelMenu(){const m=$("#selMenu");if(!m||!sel){if(m)m.style.display="none";return}
  m.innerHTML=`<button data-sa="color">🎨 Warna</button><button data-sa="dup">⧉ Salin</button><button data-sa="del">🗑 Hapus</button><button data-sa="done">✓ Selesai</button>`;
  m.style.display="flex";m.style.left=Math.max(4,sel.box.x)+"px";m.style.top=Math.max(4,sel.box.y-46)+"px"}
function clearSel(){sel=null;const m=$("#selMenu");if(m)m.style.display="none";if(LY.ink.ctx)schedFrame()}
function selAction(a){
  if(!sel)return;const key=pageKey(cur),k=inkCache[key],before=k.s.slice();
  if(a==="done"){clearSel();return}
  if(a==="del"){commitInk(key,before,before.filter(s=>!sel.set.has(s)),"hapus tulisan");clearSel();return}
  if(a==="dup"){const cp=[...sel.set].map(s=>({...s,p:s.p.map((v,i)=>i%3===2?v:v+24)}));sel={set:new Set(cp),box:selBox(cp)};commitInk(key,before,[...before,...cp],"salin tulisan");showSelMenu();return}
  if(a==="color"){recolorSel(TS[lastDraw].c)}
}
function recolorSel(c){if(!sel)return;const key=pageKey(cur),before=inkCache[key].s.slice(),ns=new Set();
  const after=before.map(s=>{if(!sel.set.has(s))return s;const n={...s,c};ns.add(n);return n});sel={set:ns,box:sel.box};commitInk(key,before,after,"ganti warna tulisan");showSelMenu()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-sa]");if(b)selAction(b.dataset.sa)});

/* ---- zoom ---- */
function setZoom(nz,cx=innerWidth/2,cy=innerHeight/2,fast=false){
  nz=Math.min(3,Math.max(.5,nz));if(Math.abs(nz-zoom)<.001)return;
  const r=$("#paper").getBoundingClientRect(),px=(cx-r.left)/scale,py=(cy-r.top)/scale;
  zoom=nz;layout.fast=fast;layout();layout.fast=false;
  const r2=$("#paper").getBoundingClientRect();window.scrollBy(r2.left+px*scale-cx,r2.top+py*scale-cy);
  $("#zFit").textContent=Math.round(zoom*100)+"%";try{updZoomUI()}catch(e){}
}
$("#zIn").onclick=()=>zoomStep(1);$("#zOut").onclick=()=>zoomStep(-1);$("#zFit").onclick=()=>zoomStep(0);
$("#stage").addEventListener("wheel",e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();setZoom(zoom*(e.deltaY<0?1.1:1/1.1),e.clientX,e.clientY,true)}},{passive:false});

/* ---- tool UI ---- */
function buildTools(){
  const btn=k=>`<button class="tool ${k===tool?"on":""}" data-tool="${k}" title="${TS[k].tip||TS[k].lb}">${TS[k].ic}<small>${TS[k].lb}</small></button>`;
  $("#toolsA").innerHTML=["select","lasso"].map(btn).join("");
  $("#toolsB").innerHTML=[...DRAW,"eraser"].map(btn).join("");
  const T=TS[tool];
  $("#swatches").innerHTML=(tool==="hl"?HLC.concat(PENC.slice(0,6)):PENC.concat(HLC.slice(0,2))).map(c=>`<button class="sw ${T&&T.c===c?"on":""}" data-color="${c}" style="background:${c}" title="${c}"></button>`).join("")+
    `<input type="color" class="cpick" id="cpick" value="${(T&&T.c)||"#24395f"}" title="Warna lain">`;
  const showSize=DRAW.includes(tool)||tool==="eraser";
  $("#sizeGrp").style.display=showSize?"":"none";
  if(showSize){$("#szRange").max=tool==="hl"?60:tool==="eraser"?80:40;$("#szRange").value=T.w;$("#szVal").textContent=T.w;
    const pv=Math.min(26,Math.max(2,T.w));$("#szPrev").style.cssText=`width:${pv}px;height:${pv}px;background:${tool==="eraser"?"#c7d4e7":T.c};opacity:${OPA.includes(tool)?T.o/100:1}`}
  if(OPA.includes(tool)){$("#opRange").value=T.o;$("#opVal").textContent=T.o+"%"}
  const B=document.body;B.classList.toggle("drawtool",DRAW.includes(tool));B.classList.toggle("opaTool",OPA.includes(tool));
  ["select","lasso","eraser"].forEach(t=>B.classList.toggle("tool-"+t,tool===t));
  document.querySelectorAll("[data-emode]").forEach(b=>b.classList.toggle("on",b.dataset.emode===eraseMode));
  $("#straightBtn").classList.toggle("on",straight);
}
function setTool(t){tool=t;if(t!=="lasso")clearSel();if(t!=="select"&&selMedia){selMedia=null;renderMedia()}buildTools()}
function setColor(c){
  if(sel&&tool==="lasso"){recolorSel(c);return}
  if(!DRAW.includes(tool))setTool(lastDraw);
  TS[tool].c=c;saveTS();buildTools()}
$("#inkRow").addEventListener("click",e=>{
  const t=e.target.closest("[data-tool]");if(t){setTool(t.dataset.tool);return}
  const c=e.target.closest("[data-color]");if(c){setColor(c.dataset.color);return}
  const em=e.target.closest("[data-emode]");if(em){eraseMode=em.dataset.emode;buildTools();return}
});
$("#inkRow").addEventListener("input",e=>{
  if(e.target.id==="szRange"){TS[tool].w=+e.target.value;saveTS();$("#szVal").textContent=e.target.value;const pv=Math.min(26,Math.max(2,+e.target.value));$("#szPrev").style.width=$("#szPrev").style.height=pv+"px"}
  if(e.target.id==="opRange"){TS[tool].o=+e.target.value;saveTS();$("#opVal").textContent=e.target.value+"%";$("#szPrev").style.opacity=e.target.value/100}
  if(e.target.id==="cpick"){const c=e.target.value;if(sel&&tool==="lasso"){clearTimeout(setColor.t);setColor.t=setTimeout(()=>recolorSel(c),300);return}if(!DRAW.includes(tool))setTool(lastDraw);TS[tool].c=c;saveTS();$("#szPrev").style.background=c}
});
$("#inkRow").addEventListener("change",e=>{if(e.target.id==="cpick")buildTools()});
$("#straightBtn").onclick=()=>{straight=!straight;buildTools()};
$("#stylusBtn").onclick=()=>setStylusOnly(!stylusOnly);
function setMode(m){const prev=mode;mode=m;setTimeout(()=>{if(!document.body.classList.contains("appmode"))layout()},0);document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("on",x.dataset.mode===m));
  document.body.classList.toggle("inkmode",m==="ink");if(document.activeElement)document.activeElement.blur();
  if(m!=="ink"){clearSel();if(selMedia){selMedia=null;renderMedia()}closePops()}buildTools()}

/* =================== stickers, images & PDF =================== */
const X='xmlns="http://www.w3.org/2000/svg"';
const flw=(c,cc="#f6e3b4")=>{let p="";for(let i=0;i<5;i++)p+=`<ellipse cx="50" cy="27" rx="15" ry="21" transform="rotate(${i*72} 50 50)" fill="${c}" stroke="#fff" stroke-width="3"/>`;return `<svg ${X} viewBox="0 0 100 100">${p}<circle cx="50" cy="50" r="12" fill="${cc}" stroke="#fff" stroke-width="3"/><circle cx="50" cy="50" r="4" fill="#d9a441"/></svg>`};
const tapeS=(c1,c2)=>`<svg ${X} viewBox="0 0 200 50"><defs><pattern id="g" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="${c1}"/><rect width="7" height="14" fill="${c2}" opacity=".55"/><rect width="14" height="7" fill="${c2}" opacity=".55"/></pattern></defs><path d="M4 4 L10 0 L16 5 L22 0 L28 4 L196 3 L192 9 L198 15 L192 21 L198 27 L192 33 L198 39 L194 47 L30 46 L24 50 L18 45 L12 50 L6 45 L2 46 L6 39 L1 33 L6 27 L1 21 L6 15 L1 9z" fill="url(#g)" opacity=".92"/></svg>`;
const lbl=(t,bg,fg="#fff")=>`<svg ${X} viewBox="0 0 220 64"><rect x="4" y="6" width="212" height="52" rx="26" fill="${bg}" stroke="#fff" stroke-width="4"/><text x="110" y="42" text-anchor="middle" font-family="Arial Rounded MT Bold,Arial,sans-serif" font-weight="800" font-size="26" fill="${fg}" letter-spacing="1">${t}</text></svg>`;
const STICKERS={
  cloud:`<svg ${X} viewBox="0 0 120 80"><path d="M28 72c-14 0-22-9-22-19 0-11 9-19 20-18 2-13 13-23 27-23 11 0 20 6 24 15 3-1 6-2 9-2 13 0 23 10 23 23 0 13-10 24-23 24z" fill="#fff" stroke="#9fb6d6" stroke-width="3" stroke-dasharray="6 4"/><circle cx="48" cy="48" r="3" fill="#24395f"/><circle cx="72" cy="48" r="3" fill="#24395f"/><path d="M54 54q6 6 12 0" stroke="#24395f" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="40" cy="55" r="5" fill="#f4c7cf"/><circle cx="80" cy="55" r="5" fill="#f4c7cf"/></svg>`,
  fblue:flw("#7d9cc8"),fpink:flw("#f2a7bd"),fyellow:flw("#f6cf63","#fff3c4"),fwhite:flw("#ffffff","#a9bfdd"),
  heart:`<svg ${X} viewBox="0 0 24 22"><path d="M12 21S1 14 1 7a5.5 5.5 0 0 1 11-1 5.5 5.5 0 0 1 11 1c0 7-11 14-11 14z" fill="#5f7fb0" stroke="#fff" stroke-width="1.6"/></svg>`,
  heartp:`<svg ${X} viewBox="0 0 24 22"><path d="M12 21S1 14 1 7a5.5 5.5 0 0 1 11-1 5.5 5.5 0 0 1 11 1c0 7-11 14-11 14z" fill="#f08aa8" stroke="#fff" stroke-width="1.6"/></svg>`,
  star:`<svg ${X} viewBox="0 0 100 100"><path d="M50 6l13 28 30 4-22 21 6 30-27-15-27 15 6-30L7 38l30-4z" fill="#f6cf63" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><circle cx="41" cy="52" r="3.5" fill="#5b4520"/><circle cx="59" cy="52" r="3.5" fill="#5b4520"/><path d="M45 61q5 5 10 0" stroke="#5b4520" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  sparkle:`<svg ${X} viewBox="0 0 60 60"><path d="M30 2c2 16 9 23 26 28-17 4-24 11-26 28-2-17-9-24-26-28 17-5 24-12 26-28z" fill="#7d9cc8"/><path d="M50 4c1 5 3 7 8 8-5 1-7 3-8 8-1-5-3-7-8-8 5-1 7-3 8-8z" fill="#a9bfdd"/></svg>`,
  tblue:tapeS("#bccde5","#ffffff"),tpink:tapeS("#f6c6d4","#ffffff"),tyellow:tapeS("#f8e3a3","#ffffff"),tgreen:tapeS("#bfe3c9","#ffffff"),
  clip:`<svg ${X} viewBox="0 0 30 80"><path d="M9 22v38a7 7 0 0 0 14 0V14a10 10 0 0 0-20 0v46" fill="none" stroke="#8796ab" stroke-width="4" stroke-linecap="round"/></svg>`,
  pin:`<svg ${X} viewBox="0 0 60 80"><path d="M30 46v32" stroke="#8796ab" stroke-width="4" stroke-linecap="round"/><circle cx="30" cy="26" r="22" fill="#e46a6a" stroke="#fff" stroke-width="4"/><circle cx="22" cy="18" r="6" fill="#fff" opacity=".6"/></svg>`,
  note:`<svg ${X} viewBox="0 0 120 120"><rect x="8" y="10" width="104" height="104" fill="#000" opacity=".08" transform="rotate(2 60 60)"/><rect x="4" y="4" width="104" height="104" fill="#fff4b8"/><path d="M4 4h104v14H4z" fill="#f6df7a"/></svg>`,
  noteb:`<svg ${X} viewBox="0 0 120 120"><rect x="8" y="10" width="104" height="104" fill="#000" opacity=".08" transform="rotate(-2 60 60)"/><rect x="4" y="4" width="104" height="104" fill="#dbe7f6"/><path d="M4 4h104v14H4z" fill="#b9cde8"/></svg>`,
  notep:`<svg ${X} viewBox="0 0 120 120"><rect x="8" y="10" width="104" height="104" fill="#000" opacity=".08"/><rect x="4" y="4" width="104" height="104" fill="#fde0e8"/><path d="M4 4h104v14H4z" fill="#f7bfcf"/></svg>`,
  check:`<svg ${X} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#4f8f6a" stroke="#fff" stroke-width="5"/><path d="M28 52l15 15 30-32" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  penting:lbl("PENTING!","#c0392b"),selesai:lbl("SELESAI ✓","#4f8f6a"),deadline:lbl("DEADLINE","#d07a3e"),rapat:lbl("RAPAT","#7b5ea7"),
  kuliah:lbl("KULIAH","#3f6fb0"),latihan:lbl("LATIHAN","#c95b8e"),ujian:lbl("UJIAN","#24395f"),libur:lbl("LIBUR","#f6cf63","#5b4520"),
  bear:`<svg ${X} viewBox="0 0 100 100"><circle cx="24" cy="26" r="14" fill="#b98b62"/><circle cx="76" cy="26" r="14" fill="#b98b62"/><circle cx="24" cy="26" r="7" fill="#e8c9a6"/><circle cx="76" cy="26" r="7" fill="#e8c9a6"/><circle cx="50" cy="55" r="36" fill="#c99a6e"/><ellipse cx="50" cy="66" rx="16" ry="12" fill="#efd8bd"/><circle cx="38" cy="50" r="4" fill="#3b2a1d"/><circle cx="62" cy="50" r="4" fill="#3b2a1d"/><ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#3b2a1d"/><path d="M45 69q5 4 10 0" stroke="#3b2a1d" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="30" cy="62" r="5" fill="#f2a7bd" opacity=".7"/><circle cx="70" cy="62" r="5" fill="#f2a7bd" opacity=".7"/></svg>`,
  coffee:`<svg ${X} viewBox="0 0 100 100"><path d="M38 10q-6 8 0 14t0 14M54 8q-6 8 0 14t0 14" stroke="#a9bfdd" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M18 42h56l-6 46H24z" fill="#7d9cc8" stroke="#fff" stroke-width="3"/><path d="M74 50h6a10 10 0 0 1 0 20h-9" stroke="#7d9cc8" stroke-width="7" fill="none"/><path d="M46 74s-9-6-9-11a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 5-9 11-9 11z" fill="#fff"/></svg>`,
  books:`<svg ${X} viewBox="0 0 100 100"><rect x="12" y="68" width="76" height="16" rx="3" fill="#7d9cc8" stroke="#fff" stroke-width="3"/><rect x="18" y="52" width="66" height="16" rx="3" fill="#f2a7bd" stroke="#fff" stroke-width="3"/><rect x="14" y="36" width="70" height="16" rx="3" fill="#4f8f6a" stroke="#fff" stroke-width="3"/><path d="M60 36V18l8 6 8-6v18" fill="#f6cf63"/></svg>`,
  apple:`<svg ${X} viewBox="0 0 100 100"><path d="M50 30c-10-8-36-6-36 22 0 22 16 40 28 40 4 0 6-2 8-2s4 2 8 2c12 0 28-18 28-40 0-28-26-30-36-22z" fill="#e46a6a" stroke="#fff" stroke-width="3"/><path d="M50 30q0-14 8-20" stroke="#7a5230" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M56 18q14-8 22 2-12 8-22-2z" fill="#6fae7c"/><ellipse cx="32" cy="48" rx="6" ry="10" fill="#fff" opacity=".4"/></svg>`,
  flask:`<svg ${X} viewBox="0 0 100 100"><path d="M38 8h24M42 8v28L16 84a6 6 0 0 0 5 9h58a6 6 0 0 0 5-9L58 36V8" fill="#fff" stroke="#24395f" stroke-width="5" stroke-linejoin="round"/><path d="M27 66h46l11 18a4 4 0 0 1-4 6H20a4 4 0 0 1-4-6z" fill="#7fd1b0"/><circle cx="44" cy="76" r="4" fill="#fff"/><circle cx="58" cy="70" r="3" fill="#fff"/></svg>`,
  atom:`<svg ${X} viewBox="0 0 100 100"><g fill="none" stroke="#3f6fb0" stroke-width="4"><ellipse cx="50" cy="50" rx="44" ry="16"/><ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(120 50 50)"/></g><circle cx="50" cy="50" r="8" fill="#e46a6a"/></svg>`,
  cap:`<svg ${X} viewBox="0 0 100 100"><path d="M50 18L4 40l46 22 46-22z" fill="#24395f" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M24 50v20c0 8 52 8 52 0V50L50 62z" fill="#3f5f8f"/><path d="M88 42v26" stroke="#f6cf63" stroke-width="4"/><circle cx="88" cy="72" r="5" fill="#f6cf63"/></svg>`,
  dumbbell:`<svg ${X} viewBox="0 0 120 60"><rect x="30" y="25" width="60" height="10" rx="4" fill="#8796ab"/><rect x="14" y="10" width="16" height="40" rx="5" fill="#d07a3e" stroke="#fff" stroke-width="3"/><rect x="90" y="10" width="16" height="40" rx="5" fill="#d07a3e" stroke="#fff" stroke-width="3"/><rect x="4" y="18" width="12" height="24" rx="4" fill="#24395f"/><rect x="104" y="18" width="12" height="24" rx="4" fill="#24395f"/></svg>`,
  music:`<svg ${X} viewBox="0 0 100 100"><path d="M36 74V22l46-10v52" stroke="#c95b8e" stroke-width="7" fill="none" stroke-linejoin="round"/><ellipse cx="26" cy="76" rx="13" ry="10" fill="#c95b8e"/><ellipse cx="72" cy="66" rx="13" ry="10" fill="#c95b8e"/></svg>`,
  sun:`<svg ${X} viewBox="0 0 100 100"><g stroke="#f6b84a" stroke-width="6" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(a=>`<path d="M50 6v12" transform="rotate(${a} 50 50)"/>`).join("")}</g><circle cx="50" cy="50" r="24" fill="#f6cf63" stroke="#fff" stroke-width="3"/><circle cx="42" cy="48" r="3" fill="#5b4520"/><circle cx="58" cy="48" r="3" fill="#5b4520"/><path d="M44 56q6 5 12 0" stroke="#5b4520" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  rainbow:`<svg ${X} viewBox="0 0 120 70"><g fill="none" stroke-width="10" stroke-linecap="round"><path d="M14 64a46 46 0 0 1 92 0" stroke="#f2a7bd"/><path d="M26 64a34 34 0 0 1 68 0" stroke="#f6cf63"/><path d="M38 64a22 22 0 0 1 44 0" stroke="#7d9cc8"/></g></svg>`,
  arrow:`<svg ${X} viewBox="0 0 120 60"><path d="M8 44C30 10 70 6 104 26" stroke="#24395f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M90 14l16 13-19 7" stroke="#24395f" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  bubble:`<svg ${X} viewBox="0 0 120 100"><path d="M60 6C28 6 6 24 6 46c0 14 9 26 22 33l-6 17 22-11c5 1 10 2 16 2 32 0 54-18 54-41S92 6 60 6z" fill="#fff" stroke="#7d9cc8" stroke-width="4"/></svg>`,
  plant:`<svg ${X} viewBox="0 0 90 110"><path d="M45 60V24M45 46q-18-6-22-22M45 38q16-4 20-20" stroke="#7f9a83" stroke-width="3" fill="none"/><circle cx="23" cy="24" r="9" fill="#7d9cc8"/><circle cx="65" cy="18" r="9" fill="#7d9cc8"/><circle cx="45" cy="16" r="9" fill="#a9bfdd"/><path d="M18 62h54l-7 44H25z" fill="#8aa6cf" stroke="#fff" stroke-width="2"/><rect x="14" y="58" width="62" height="10" rx="4" fill="#6f8fbf"/><path d="M45 92s-9-6-9-11a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 5-9 11-9 11z" fill="#fff"/></svg>`
};
const stURI=k=>"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(STICKERS[k]||(window.__stEkstra?STICKERS.heart:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>`));
const stSize=k=>{const m=(STICKERS[k]||"").match(/viewBox="0 0 (\d+) (\d+)"/);const w=+(m?m[1]:100),h=+(m?m[2]:100);const W=(window.ST_BIG&&ST_BIG.has(k))?240:(window.ST_TAPE&&ST_TAPE.has(k))?190:/^c[a-z]+_/.test(k)?120:["tblue","tpink","tyellow","tgreen"].includes(k)?170:(w>h*2?170:100);return[W,Math.round(W*h/w)]};

let selMedia=null,mdrag=null;
const mediaArr=()=>(mediaCache[pageKey(cur)]||(mediaCache[pageKey(cur)]={m:[]})).m;
const mSrc=m=>m.k==="st"?stURI(m.s):(String(m.s).startsWith("data:")?m.s:String(m.s).startsWith("f:")?m.s.slice(2):window.__pdvBlob(m.s));
function renderMedia(){
  const L=$("#mlayer");if(!L)return;const arr=mediaArr();
  L.innerHTML=arr.map(m=>`<div class="media ${selMedia===m.id?"sel":""} ${m.lk?"locked":""}" data-mid="${m.id}" style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;transform:rotate(${m.r||0}deg)">
    <img src="${esc(mSrc(m))}" alt="" draggable="false" onerror="this.style.background='#eef2f8'">${m.lk?'<span class="lockb">🔒</span>':""}
    ${selMedia===m.id&&!m.lk?'<span class="h-res" data-h="res"></span><span class="h-rot" data-h="rot"></span>':""}</div>`).join("")+mbarHTML();
}
function mbarHTML(){const m=mediaArr().find(x=>x.id===selMedia);if(!m)return"";
  return `<div class="mbar" style="left:${Math.max(0,m.x+m.w/2)}px;top:${Math.max(4,m.y-(m.lk?46:92))}px;transform:translateX(-50%)">
    <button data-ma="lock">${m.lk?"🔓 Buka kunci":"🔒 Kunci"}</button>${m.lk?"":`<button data-ma="front">⬆ Depan</button><button data-ma="back">⬇ Belakang</button><button data-ma="dup">⧉ Salin</button>${m.k==="img"?`<button data-ma="fav">⭐ Jadikan stiker</button>`:""}`}<button data-ma="del">🗑 Hapus</button><button data-ma="done">✓</button></div>`}
function setMedia(key,arr){mediaCache[key]={m:arr.slice()};if(pageKey(cur)===key){if(selMedia&&!arr.some(x=>x.id===selMedia))selMedia=null;renderMedia()}
  queueSave("media/"+key,()=>({m:mediaCache[key].m}),500)}
function commitMedia(before,after,label){const key=pageKey(cur);setMedia(key,after);pushUndo({label,page:{...cur},undo:()=>setMedia(key,before),redo:()=>setMedia(key,after)})}
function mediaDown(e){
  if(mode!=="ink"||tool!=="select")return false;
  const ma=e.target.closest("[data-ma]");if(ma){e.preventDefault();mediaAction(ma.dataset.ma);return true}
  const el=e.target.closest(".media");
  if(!el){if(e.target.closest("#paper")&&selMedia){selMedia=null;renderMedia()}return false}
  e.preventDefault();closePops();
  const id=el.dataset.mid,m=mediaArr().find(x=>x.id===id);if(!m)return true;
  const h=e.target.dataset.h||"move";
  if(selMedia!==id){selMedia=id;renderMedia()}
  if(m.lk)return true;
  const [x,y]=pp(e);mdrag={id,h,sx:x,sy:y,o:{...m},cur:{...m},before:mediaArr().slice()};return true;
}
function mediaMove(e){
  const [x,y]=pp(e),d=mdrag,o=d.o,dx=x-d.sx,dy=y-d.sy;let m={...o};
  if(d.h==="move"){m.x=o.x+dx;m.y=o.y+dy}
  else if(d.h==="res"){const a=(o.r||0)*Math.PI/180,dxr=dx*Math.cos(a)+dy*Math.sin(a),dyr=-dx*Math.sin(a)+dy*Math.cos(a);
    const sc=Math.max(24/o.w,(o.w+(dxr+dyr*o.w/o.h)/2)/o.w);m.w=o.w*sc;m.h=o.h*sc}
  else{const cx=o.x+o.w/2,cy=o.y+o.h/2;let r=Math.atan2(y-cy,x-cx)*180/Math.PI+90;r=((r%360)+360)%360;for(const s of[0,90,180,270,360])if(Math.abs(r-s)<5)r=s%360;m.r=Math.round(r)}
  m.x=Math.round(m.x);m.y=Math.round(m.y);m.w=Math.round(m.w);m.h=Math.round(m.h);d.cur=m;
  const el=document.querySelector(`[data-mid="${d.id}"]`);if(el)el.style.cssText=`left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;transform:rotate(${m.r||0}deg)`;
  const bar=document.querySelector(".mbar");if(bar){bar.style.left=(m.x+m.w/2)+"px";bar.style.top=Math.max(4,m.y-92)+"px"}
}
function mediaUp(){const d=mdrag;mdrag=null;const m=d.cur,o=d.o;
  if(m.x===o.x&&m.y===o.y&&m.w===o.w&&m.h===o.h&&(m.r||0)===(o.r||0)){renderMedia();return}
  commitMedia(d.before,d.before.map(x=>x.id===m.id?m:x),d.h==="move"?"geser gambar":d.h==="res"?"ubah ukuran":"putar gambar")}
function mediaAction(a){
  const arr=mediaArr(),m=arr.find(x=>x.id===selMedia);if(!m)return;
  if(a==="done"){selMedia=null;renderMedia();return}
  if(a==="lock"){commitMedia(arr,arr.map(x=>x.id===m.id?{...m,lk:!m.lk}:x),m.lk?"buka kunci":"kunci gambar");toast(m.lk?"🔓 Kunci dibuka, gambar bisa digeser lagi.":"🔒 Terkunci. Pilih alat tulis untuk menulis di atasnya.");return}
  if(a==="fav"){putSt({id:uid(),s:m.s,ar:m.w/m.h,ts:Date.now()}).then(()=>toast("⭐ Disimpan ke Stiker Saya."),err);return}
  if(a==="del"){selMedia=null;commitMedia(arr,arr.filter(x=>x.id!==m.id),"hapus gambar");return}
  if(a==="front")commitMedia(arr,[...arr.filter(x=>x.id!==m.id),m],"ke depan");
  if(a==="back")commitMedia(arr,[m,...arr.filter(x=>x.id!==m.id)],"ke belakang");
  if(a==="dup"){const c={...m,id:uid(),x:m.x+24,y:m.y+24,lk:false};selMedia=c.id;commitMedia(arr,[...arr,c],"salin gambar")}
}
function viewCenter(w,h){const r=$("#paper").getBoundingClientRect();const pw=$("#paper").offsetWidth,ph=$("#paper").offsetHeight;
  let cx=(innerWidth/2-r.left)/scale,cy=(innerHeight/2-r.top)/scale;cx=Math.min(pw-w/2-10,Math.max(w/2+10,cx));cy=Math.min(ph-h/2-10,Math.max(h/2+10,cy));return[Math.round(cx-w/2),Math.round(cy-h/2)]}
function addMedia(list,label){const arr=mediaArr();commitMedia(arr,[...arr,...list],label);selMedia=list[list.length-1].id;setTool("select");renderMedia()}

/* sticker picker */
let myStickers=[],stTab="bawaan",stEdit=false;
const ST_GROUPS=[["Dekorasi",["cloud","fblue","fpink","fyellow","fwhite","heart","heartp","star","sparkle","sun","rainbow","plant","bear"]],
  ["Washi tape & kertas",["tblue","tpink","tyellow","tgreen","note","noteb","notep","bubble","clip","pin","arrow"]],
  ["Label",["penting","selesai","deadline","rapat","kuliah","latihan","ujian","libur","check"]],
  ["Sekolah, kuliah & olahraga",["apple","books","flask","atom","cap","coffee","dumbbell","music"]]];
/* ---- themed kawaii stickers ---- */
const F=(cx,cy,s=1,col="#3b2a1d")=>`<g transform="translate(${cx} ${cy}) scale(${s})"><circle cx="-7" cy="0" r="2.6" fill="${col}"/><circle cx="7" cy="0" r="2.6" fill="${col}"/><path d="M-3.5 4q3.5 3.5 7 0" stroke="${col}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="-12" cy="5" r="3.2" fill="#f4a7b9" opacity=".75"/><circle cx="12" cy="5" r="3.2" fill="#f4a7b9" opacity=".75"/></g>`;
const SV=(vb,body)=>`<svg ${X} viewBox="${vb}">${body}</svg>`;
const lbl2=(t,bg,fg="#fff")=>{const fs=Math.min(26,Math.round(330/Math.max(6,t.length)));return SV("0 0 220 64",`<rect x="4" y="6" width="212" height="52" rx="26" fill="${bg}" stroke="#fff" stroke-width="4"/><rect x="12" y="12" width="196" height="40" rx="20" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 4" opacity=".7"/><text x="110" y="${32+fs*.36}" text-anchor="middle" font-family="Arial Rounded MT Bold,Arial,sans-serif" font-weight="800" font-size="${fs}" fill="${fg}">${t}</text>`)};
Object.assign(STICKERS,{
  /* Wakasek kurikulum */
  clipboard:SV("0 0 100 110",`<rect x="14" y="14" width="72" height="90" rx="10" fill="#8aa6cf" stroke="#fff" stroke-width="3"/><rect x="22" y="24" width="56" height="72" rx="5" fill="#fff"/><rect x="34" y="6" width="32" height="16" rx="6" fill="#24395f"/><path d="M30 70h40M30 80h28" stroke="#c7d4e7" stroke-width="4" stroke-linecap="round"/>${F(50,48,1.1)}`),
  calendar:SV("0 0 100 100",`<rect x="10" y="16" width="80" height="76" rx="12" fill="#fff" stroke="#7d9cc8" stroke-width="4"/><path d="M10 28a12 12 0 0 1 12-12h56a12 12 0 0 1 12 12v8H10z" fill="#e46a6a"/><rect x="28" y="8" width="8" height="18" rx="4" fill="#24395f"/><rect x="64" y="8" width="8" height="18" rx="4" fill="#24395f"/>${F(50,62,1.2)}`),
  folder:SV("0 0 110 90",`<path d="M8 20a8 8 0 0 1 8-8h26l10 10h42a8 8 0 0 1 8 8v46a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8z" fill="#f6cf63" stroke="#fff" stroke-width="3"/><rect x="18" y="26" width="74" height="10" rx="3" fill="#fff" opacity=".8"/>${F(55,56,1.2,"#5b4520")}`),
  stamp:SV("0 0 100 100",`<circle cx="50" cy="50" r="42" fill="none" stroke="#c0392b" stroke-width="6"/><circle cx="50" cy="50" r="33" fill="none" stroke="#c0392b" stroke-width="2" stroke-dasharray="4 4"/><text x="50" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="#c0392b" transform="rotate(-14 50 50)">ACC ✓</text>`),
  megaphone:SV("0 0 110 90",`<path d="M20 34h14l42-22v66L34 56H20a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z" fill="#7b5ea7" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M26 56l6 22h12l-6-22" fill="#5b4590"/><path d="M88 30q10 15 0 30M96 22q16 23 0 46" stroke="#f6cf63" stroke-width="5" fill="none" stroke-linecap="round"/>${F(50,44,.9,"#fff")}`),
  school:SV("0 0 120 100",`<path d="M60 8l46 26H14z" fill="#e46a6a" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><rect x="20" y="34" width="80" height="58" fill="#fff4e0" stroke="#d9c7a6" stroke-width="3"/><rect x="50" y="62" width="20" height="30" rx="3" fill="#8aa6cf"/><rect x="28" y="44" width="14" height="12" rx="2" fill="#a9d8ff"/><rect x="78" y="44" width="14" height="12" rx="2" fill="#a9d8ff"/><circle cx="60" cy="24" r="6" fill="#f6cf63"/><path d="M60 8V0h12v6h-12" fill="#4f8f6a"/>`),
  laptop:SV("0 0 120 90",`<rect x="18" y="8" width="84" height="56" rx="8" fill="#24395f" stroke="#fff" stroke-width="3"/><rect x="25" y="15" width="70" height="42" rx="4" fill="#dbe7f6"/><path d="M6 68h108l-6 12H12z" fill="#a9bfdd" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>${F(60,36,1.1,"#24395f")}`),
  trophy:SV("0 0 100 100",`<path d="M28 12h44v24a22 22 0 0 1-44 0z" fill="#f6cf63" stroke="#fff" stroke-width="3"/><path d="M28 18H14q0 20 16 22M72 18h14q0 20-16 22" stroke="#f6cf63" stroke-width="5" fill="none"/><rect x="44" y="56" width="12" height="16" fill="#e0a526"/><rect x="30" y="72" width="40" height="14" rx="4" fill="#8b5e3c"/>${F(50,32,.9,"#5b4520")}`),
  supervisi:lbl2("SUPERVISI","#7b5ea7"),modulajar:lbl2("MODUL AJAR","#5f7fb0"),asesmen:lbl2("ASESMEN","#e46a6a"),administrasi:lbl2("ADMINISTRASI","#8b5e3c"),
  /* Guru IPA */
  microscope:SV("0 0 100 110",`<rect x="18" y="92" width="64" height="10" rx="5" fill="#24395f"/><path d="M40 90V70h22" stroke="#7d9cc8" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="44" y="12" width="18" height="44" rx="6" fill="#a9bfdd" stroke="#fff" stroke-width="3" transform="rotate(-20 53 34)"/><rect x="38" y="56" width="30" height="8" rx="3" fill="#24395f"/><path d="M70 90a26 26 0 0 0 0-46" stroke="#7d9cc8" stroke-width="7" fill="none"/>${F(50,32,.7,"#24395f")}`),
  magnet:SV("0 0 100 100",`<path d="M20 14h20v40a10 10 0 0 0 20 0V14h20v40a30 30 0 0 1-60 0z" fill="#e46a6a" stroke="#fff" stroke-width="3"/><rect x="20" y="14" width="20" height="16" fill="#dbe7f6"/><rect x="60" y="14" width="20" height="16" fill="#dbe7f6"/>${F(50,62,.9,"#fff")}<path d="M8 20l-6-4M8 30H0M92 20l6-4M92 30h8" stroke="#f6cf63" stroke-width="3" stroke-linecap="round"/>`),
  dna:SV("0 0 70 110",`<path d="M15 6c0 24 40 26 40 50S15 80 15 104" stroke="#3f6fb0" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M55 6c0 24-40 26-40 50s40 24 40 48" stroke="#c95b8e" stroke-width="6" fill="none" stroke-linecap="round"/>${[18,30,82,94].map(y=>`<path d="M${y<50?22:22} ${y}h26" stroke="#a9bfdd" stroke-width="4" stroke-linecap="round"/>`).join("")}`),
  planet:SV("0 0 120 90",`<ellipse cx="60" cy="48" rx="54" ry="14" fill="none" stroke="#f6cf63" stroke-width="6" transform="rotate(-12 60 48)"/><circle cx="60" cy="45" r="30" fill="#c9a6ef" stroke="#fff" stroke-width="3"/><path d="M8 58q52 -6 104-24" stroke="#f6cf63" stroke-width="6" fill="none" stroke-linecap="round" transform="rotate(-2 60 48)" opacity=".0"/>${F(60,46,1.1,"#3b2a5d")}<circle cx="18" cy="14" r="3" fill="#f6cf63"/><circle cx="104" cy="12" r="2" fill="#7d9cc8"/>`),
  leaf:SV("0 0 100 100",`<path d="M18 82C10 40 40 12 88 12c0 48-28 78-70 70z" fill="#7fc391" stroke="#fff" stroke-width="3"/><path d="M18 82Q46 52 74 26" stroke="#4f8f6a" stroke-width="3" fill="none"/>${F(58,52,.9,"#2f5d3f")}`),
  bulb:SV("0 0 80 110",`<path d="M40 8a30 30 0 0 0-18 54c4 4 6 9 6 14h24c0-5 2-10 6-14A30 30 0 0 0 40 8z" fill="#fde68a" stroke="#f6b84a" stroke-width="3"/><rect x="28" y="78" width="24" height="8" rx="3" fill="#a9bfdd"/><rect x="30" y="88" width="20" height="8" rx="3" fill="#8aa6cf"/>${F(40,40,1,"#5b4520")}<path d="M4 20l8 5M76 20l-8 5M40 0v4" stroke="#f6b84a" stroke-width="3" stroke-linecap="round"/>`),
  magnifier:SV("0 0 100 100",`<path d="M62 62l28 28" stroke="#8b5e3c" stroke-width="12" stroke-linecap="round"/><circle cx="40" cy="40" r="30" fill="#dff1ff" stroke="#7d9cc8" stroke-width="8"/>${F(40,40,1,"#24395f")}`),
  tubes:SV("0 0 110 100",`<rect x="6" y="56" width="98" height="12" rx="4" fill="#8b5e3c"/>${[[22,"#7fd1b0"],[46,"#f2a7bd"],[70,"#a9d8ff"],[94,"#f6cf63"]].map(([x,c])=>`<path d="M${x-8} 10h16v62a8 8 0 0 1-16 0z" fill="#fff" stroke="#7d9cc8" stroke-width="2.5"/><path d="M${x-8} 40h16v32a8 8 0 0 1-16 0z" fill="${c}"/>`).join("")}<rect x="6" y="56" width="98" height="12" rx="4" fill="#8b5e3c" opacity=".9"/>`),
  earth:SV("0 0 100 100",`<circle cx="50" cy="50" r="42" fill="#7fb9ea" stroke="#fff" stroke-width="3"/><path d="M22 30q12-6 18 4t-4 18q-12 4-16-6zM58 20q16 2 20 14-10 6-18-2zM56 62q14-4 22 6-6 14-20 12-6-10-2-18z" fill="#7fc391"/>${F(50,52,1.1,"#24395f")}`),
  rocket:SV("0 0 90 120",`<path d="M45 6c22 14 26 44 18 76H27C19 50 23 20 45 6z" fill="#fff" stroke="#7d9cc8" stroke-width="3"/><circle cx="45" cy="44" r="11" fill="#a9d8ff" stroke="#3f6fb0" stroke-width="3"/><path d="M27 62L10 84l18-2M63 62l17 22-18-2" fill="#e46a6a"/><path d="M33 84q12 34 24 0" fill="#f6b84a"/>${F(45,66,.7,"#24395f")}`),
  praktikum:lbl2("PRAKTIKUM","#4f8f6a"),k9h:lbl2("KELAS 9H","#2a9d8f"),k9i:lbl2("KELAS 9I","#3f6fb0"),k9j:lbl2("KELAS 9J","#7b5ea7"),
  /* Kuliah S2 */
  diploma:SV("0 0 120 80",`<rect x="10" y="18" width="100" height="44" rx="22" fill="#fff4e0" stroke="#d9c7a6" stroke-width="3"/><rect x="52" y="14" width="16" height="52" fill="#e46a6a"/><path d="M54 66l-6 12 12-6 12 6-6-12" fill="#e46a6a"/><path d="M22 34h22M22 46h18M78 34h22M80 46h18" stroke="#d9c7a6" stroke-width="3" stroke-linecap="round"/>`),
  glasses:SV("0 0 120 60",`<circle cx="32" cy="32" r="20" fill="#dff1ff" stroke="#24395f" stroke-width="6"/><circle cx="88" cy="32" r="20" fill="#dff1ff" stroke="#24395f" stroke-width="6"/><path d="M52 30q8-8 16 0M12 28L2 20M108 28l10-8" stroke="#24395f" stroke-width="6" fill="none" stroke-linecap="round"/>`),
  pencil:SV("0 0 120 50",`<path d="M20 10h76v30H20z" fill="#f6cf63" stroke="#fff" stroke-width="2"/><path d="M96 10l20 15-20 15z" fill="#f3d6b0"/><path d="M110 21l6 4-6 4z" fill="#3b2a1d"/><rect x="6" y="10" width="16" height="30" rx="4" fill="#f2a7bd"/><rect x="18" y="10" width="6" height="30" fill="#a9bfdd"/>${F(60,24,.9,"#5b4520")}`),
  notebook:SV("0 0 100 110",`<rect x="16" y="8" width="72" height="94" rx="8" fill="#7d9cc8" stroke="#fff" stroke-width="3"/>${[20,34,48,62,76,90].map(y=>`<circle cx="16" cy="${y}" r="4" fill="#24395f"/>`).join("")}<rect x="30" y="22" width="46" height="22" rx="4" fill="#fff"/><path d="M36 30h34M36 37h22" stroke="#a9bfdd" stroke-width="3" stroke-linecap="round"/>${F(52,68,1.1,"#fff")}`),
  bimbingan:lbl2("BIMBINGAN","#3f6fb0"),makalah:lbl2("MAKALAH","#24395f"),presentasi:lbl2("PRESENTASI","#d07a3e"),uas:lbl2("UTS / UAS","#c0392b"),
  /* Gym & Zumba */
  kettlebell:SV("0 0 100 100",`<path d="M32 36a18 18 0 1 1 36 0" stroke="#24395f" stroke-width="10" fill="none"/><circle cx="50" cy="62" r="32" fill="#d07a3e" stroke="#fff" stroke-width="3"/>${F(50,62,1.2,"#fff")}`),
  bottle:SV("0 0 70 120",`<rect x="24" y="4" width="22" height="14" rx="4" fill="#24395f"/><path d="M18 26q0-8 8-8h18q8 0 8 8v80a10 10 0 0 1-10 10H28a10 10 0 0 1-10-10z" fill="#a9d8ff" stroke="#fff" stroke-width="3"/><path d="M18 60h34v46a10 10 0 0 1-10 10H28a10 10 0 0 1-10-10z" fill="#5fb3e8"/>${F(35,46,.9,"#24395f")}`),
  muscle:SV("0 0 110 100",`<path d="M14 84c-6-20 4-40 20-46l10-26c4-8 16-8 18 0l-4 22c18-6 38 4 42 24 4 22-16 32-36 30z" fill="#f3c9a0" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M50 56q12-10 26 2" stroke="#d9a07a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M84 18l4-8M94 28l8-4M98 42h8" stroke="#f6b84a" stroke-width="3" stroke-linecap="round"/>`),
  sneaker:SV("0 0 120 70",`<path d="M8 50c0-14 6-30 20-30 6 0 10 6 18 8 14 4 34 2 50 10 10 4 16 10 16 16v4H8z" fill="#f2a7bd" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><rect x="6" y="54" width="108" height="10" rx="5" fill="#fff" stroke="#e5d5dc" stroke-width="2"/><path d="M36 30l6 10M46 28l6 10M56 30l6 10" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),
  heartbeat:SV("0 0 110 90",`<path d="M55 84S6 56 6 28A22 22 0 0 1 55 18a22 22 0 0 1 49 10c0 28-49 56-49 56z" fill="#f08aa8" stroke="#fff" stroke-width="3"/><path d="M18 46h20l6-12 8 24 8-20 6 8h26" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  stopwatch:SV("0 0 90 110",`<rect x="36" y="4" width="18" height="10" rx="3" fill="#24395f"/><circle cx="45" cy="62" r="38" fill="#fff" stroke="#7d9cc8" stroke-width="7"/><path d="M45 62V38" stroke="#e46a6a" stroke-width="4" stroke-linecap="round"/>${F(45,74,.9,"#24395f")}`),
  maracas:SV("0 0 110 100",`<g transform="rotate(-25 40 50)"><ellipse cx="34" cy="34" rx="20" ry="26" fill="#f6cf63" stroke="#fff" stroke-width="3"/><rect x="30" y="58" width="8" height="34" rx="4" fill="#8b5e3c"/><path d="M18 30h32M20 42h28" stroke="#e46a6a" stroke-width="4"/></g><g transform="rotate(25 72 50)"><ellipse cx="76" cy="34" rx="20" ry="26" fill="#7fc391" stroke="#fff" stroke-width="3"/><rect x="72" y="58" width="8" height="34" rx="4" fill="#8b5e3c"/><path d="M60 30h32M62 42h28" stroke="#c95b8e" stroke-width="4"/></g>`),
  headphones:SV("0 0 110 100",`<path d="M16 64V52a39 39 0 0 1 78 0v12" stroke="#c95b8e" stroke-width="9" fill="none"/><rect x="8" y="56" width="22" height="34" rx="9" fill="#f2a7bd" stroke="#fff" stroke-width="3"/><rect x="80" y="56" width="22" height="34" rx="9" fill="#f2a7bd" stroke="#fff" stroke-width="3"/><path d="M48 50v-18l18-4v22" stroke="#7d9cc8" stroke-width="4" fill="none"/><circle cx="44" cy="52" r="5" fill="#7d9cc8"/><circle cx="62" cy="50" r="5" fill="#7d9cc8"/>`),
  disco:SV("0 0 100 110",`<path d="M50 4v12" stroke="#8796ab" stroke-width="3"/><circle cx="50" cy="56" r="38" fill="#c9d4e4" stroke="#fff" stroke-width="3"/>${Array.from({length:5},(_,i)=>`<path d="M14 ${30+i*12}h72" stroke="#fff" stroke-width="1.5" opacity=".8"/>`).join("")}${Array.from({length:5},(_,i)=>`<path d="M${26+i*12} 20v72" stroke="#fff" stroke-width="1.5" opacity=".8"/>`).join("")}<rect x="30" y="34" width="10" height="10" fill="#f2a7bd"/><rect x="58" y="62" width="10" height="10" fill="#a9d8ff"/><rect x="62" y="38" width="10" height="10" fill="#f6cf63"/>${F(50,58,1,"#24395f")}`),
  semangat:lbl2("SEMANGAT!","#d07a3e"),zumbatime:lbl2("ZUMBA TIME","#c95b8e"),ptsession:lbl2("PT SESSION","#24395f"),legday:lbl2("LEG DAY","#e46a6a"),
  /* Mood & self-care */
  moon:SV("0 0 100 100",`<path d="M64 8a42 42 0 1 0 28 66A36 36 0 0 1 64 8z" fill="#fde68a" stroke="#fff" stroke-width="3"/><path d="M34 52q4 4 8 0M54 52q4 4 8 0" stroke="#5b4520" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="32" cy="60" r="4" fill="#f4a7b9" opacity=".8"/><circle cx="64" cy="60" r="4" fill="#f4a7b9" opacity=".8"/><text x="72" y="30" font-family="Arial" font-weight="800" font-size="14" fill="#7d9cc8">z</text><text x="82" y="18" font-family="Arial" font-weight="800" font-size="10" fill="#7d9cc8">z</text>`),
  cupcake:SV("0 0 100 110",`<path d="M22 56h56l-8 46H30z" fill="#a9d8ff" stroke="#fff" stroke-width="3"/><path d="M30 60l4 40M42 60l2 40M58 60l-2 40M70 60l-4 40" stroke="#fff" stroke-width="2" opacity=".7"/><path d="M16 58c-4-14 8-22 16-18 0-14 22-22 30-8 10-6 26 2 22 16 8 2 6 12-2 12H18z" fill="#f2a7bd" stroke="#fff" stroke-width="3"/><circle cx="50" cy="20" r="7" fill="#e46a6a"/>${F(50,50,.8,"#5b2a3a")}`),
  cat:SV("0 0 100 90",`<path d="M14 30L20 4l20 16h20L80 4l6 26c6 10 6 24 0 34-8 16-64 16-72 0-6-10-6-24 0-34z" fill="#f3d6b0" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M22 14l4 12 8-6zM78 14l-4 12-8-6z" fill="#f2a7bd"/>${F(50,48,1.2)}<path d="M8 52h16M8 60h16M76 52h16M76 60h16" stroke="#c9a37a" stroke-width="2" stroke-linecap="round"/>`),
  bunny:SV("0 0 100 110",`<ellipse cx="34" cy="28" rx="10" ry="26" fill="#fff" stroke="#e5d5dc" stroke-width="3"/><ellipse cx="66" cy="28" rx="10" ry="26" fill="#fff" stroke="#e5d5dc" stroke-width="3"/><ellipse cx="34" cy="28" rx="4" ry="16" fill="#f8c8d6"/><ellipse cx="66" cy="28" rx="4" ry="16" fill="#f8c8d6"/><circle cx="50" cy="72" r="34" fill="#fff" stroke="#e5d5dc" stroke-width="3"/>${F(50,72,1.2)}`),
  rain:SV("0 0 120 100",`<path d="M28 62c-12 0-20-8-20-17 0-10 8-17 18-16 2-12 12-21 25-21 10 0 18 5 22 13 3-1 5-1 8-1 12 0 21 9 21 21s-9 21-21 21z" fill="#dbe7f6" stroke="#9fb6d6" stroke-width="3"/><path d="M38 44q4 -4 8 0M66 44q4 -4 8 0" stroke="#24395f" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M52 52q4 -3 8 0" stroke="#24395f" stroke-width="2.5" fill="none" stroke-linecap="round"/>${[30,56,82].map(x=>`<path d="M${x} 74q-4 8 0 12 4-4 0-12z" fill="#7fb9ea"/>`).join("")}`),
  boba:SV("0 0 90 120",`<path d="M58 4L48 30" stroke="#e46a6a" stroke-width="6" stroke-linecap="round"/><path d="M14 30h62l-8 82a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6z" fill="#f3e0c8" stroke="#fff" stroke-width="3"/><rect x="10" y="24" width="70" height="10" rx="5" fill="#a9bfdd"/>${[[30,100],[44,104],[58,98],[38,90],[54,88]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#5b3a29"/>`).join("")}${F(45,62,1,"#5b3a29")}`),
  metime:lbl2("ME TIME","#c95b8e"),semangatbu:lbl2("SEMANGAT BU!","#f6cf63","#5b4520"),bisa:lbl2("PASTI BISA!","#4f8f6a"),istirahat:lbl2("ISTIRAHAT","#7d9cc8")
});
ST_GROUPS.unshift(
  ["🏫 Wakasek Kurikulum",["clipboard","calendar","folder","stamp","megaphone","school","laptop","trophy","supervisi","modulajar","asesmen","administrasi","rapat"]],
  ["🔬 Guru IPA",["microscope","flask","tubes","atom","dna","magnet","magnifier","bulb","leaf","earth","planet","rocket","praktikum","k9h","k9i","k9j"]],
  ["🎓 Kuliah S2",["cap","diploma","notebook","books","pencil","glasses","coffee","bimbingan","makalah","presentasi","uas","kuliah"]],
  ["💪 Gym & Zumba",["kettlebell","dumbbell","muscle","bottle","sneaker","stopwatch","heartbeat","music","maracas","headphones","disco","semangat","zumbatime","ptsession","legday","latihan"]],
  ["🌙 Mood & me-time",["moon","sun","rain","cupcake","boba","cat","bunny","bear","metime","semangatbu","bisa","istirahat"]]
);
ST_GROUPS.forEach(g=>{if(g[0]==="Dekorasi")g[0]="🌸 Dekorasi";if(g[0]==="Label")g[0]="🏷️ Label umum";if(g[0]==="Washi tape & kertas")g[0]="🎀 Washi tape & kertas"});
const sgi=ST_GROUPS.findIndex(g=>g[0].includes("Sekolah, kuliah"));if(sgi>=0)ST_GROUPS.splice(sgi,1);
const DEVYEX=[["ketawa", "Ketawa", 354, 360], ["kedip", "Kedip", 340, 360], ["kaget", "Kaget", 350, 360], ["sedih", "Sedih", 351, 360], ["terharu", "Terharu", 343, 360], ["kesal", "Kesal", 348, 360], ["malu", "Malu-malu", 340, 360], ["menguap", "Ngantuk", 342, 360], ["mikir", "Mikir", 337, 360], ["senang", "Senang", 336, 360], ["semangat", "Semangat", 339, 360], ["jempol", "Mantap", 339, 360], ["marah", "Marah", 347, 360], ["licik", "Punya ide", 343, 360], ["heboh", "Heboh", 289, 299], ["canggung", "Canggung", 350, 360], ["galau", "Galau", 335, 360], ["nangis", "Nangis", 343, 360], ["bosan", "Bosan", 344, 360], ["syok", "Syok", 343, 360], ["pusing", "Pusing", 350, 360], ["pede", "Percaya diri", 340, 360], ["memelas", "Memelas", 329, 360], ["ngakak", "Ngakak", 335, 360], ["cium", "Cium jauh", 347, 360], ["melet", "Melet", 356, 360], ["keren", "Keren", 360, 357], ["nanya", "Bertanya", 357, 360], ["tolak", "Ogah", 354, 360], ["capek", "Capek", 354, 360], ["lega", "Lega", 357, 360], ["tekad", "Bertekad", 345, 360], ["mohon", "Mohon maaf", 357, 360], ["enak", "Enak", 349, 360], ["sstt", "Sstt", 340, 360], ["hore", "Hore", 360, 336]];
const DEVYST=[["salam","Assalamu'alaikum"],["senyum","Hai!"],["semangat","Semangat!"],["mantap","Mantap!"],["love","Love you!"],["terimakasih","Terima kasih"],["alhamdulillah","Alhamdulillah"],["bismillah","Bismillah"],["masyaallah","MasyaAllah"],["kaget","Hah?!"],["mikir","Hmm…"],["ngantuk","Ngantuk…"],["sedih","Huhu…"],["terharu","Terharu…"],["kesal","Grrr!"],["malu","Malu ih…"],["maaf","Maaf ya…"],["siap","Siap, laksanakan!"],["mengajar","Ayo belajar!"],["deadline","Deadline!!"],["rapat","Lagi rapat"],["ngopi","Ngopi dulu"],["s2","Semangat S2!"],["selamat","Selamat ya!"],["metime","Me time"],["zumba","Zumba time!"]];
const stImg=src=>`<img src="${esc(src)}" alt="" loading="lazy" style="width:56px;height:56px;object-fit:contain;display:block">`;
function renderStickerPanel(){
  document.querySelectorAll("[data-sttab]").forEach(b=>b.classList.toggle("on",b.dataset.sttab===stTab));
  const body=$("#stBody");
  if(stTab==="bawaan"){body.innerHTML=`<div class="stg">🧕 Stiker Devy · ekspresi</div><div class="stgrid devyst">${DEVYEX.map(([k,t,w,h])=>`<button data-fst="devyst2/${k}.webp" data-fw="${w}" data-fh="${h}" title="${esc(t)}">${stImg("devyst2/"+k+".webp")}</button>`).join("")}</div>`+ST_GROUPS.map(([g,ks])=>`<div class="stg">${g}</div><div class="stgrid">${ks.map(k=>`<button data-st="${k}" title="${esc((window.ST_TITLE&&ST_TITLE[k])||k)}">${stImg(stURI(k))}</button>`).join("")}</div>`).join("");return}
  body.innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
      <label class="tb primary" for="stInput" id="stAddFile" style="cursor:pointer">＋ Tambah dari file</label>
      <label style="display:flex;gap:6px;align-items:center;font-size:13px;font-weight:700;color:var(--navy)"><input type="checkbox" id="stRemoveBg" ${localStorage.getItem(LSK+"rmbg")==="0"?"":"checked"}> Hapus latar putih</label>
      ${myStickers.length?`<button class="tb" id="stEditBtn">${stEdit?"✓ Selesai":"✏️ Atur"}</button>`:""}</div>
    <div style="font-size:13px;color:var(--muted);margin-bottom:8px">Pakai gambar PNG/JPG/WebP/GIF dari galeri, unduhan, atau stiker yang dibeli. Di laptop bisa juga seret file ke jendela ini. Bisa juga <b>tempel</b> (Ctrl+V, atau tahan lalu “Tempel” di tablet) gambar yang sudah disalin.</div>
    <div contenteditable="true" id="stPaste" inputmode="none" style="border:2px dashed var(--blue-m);border-radius:12px;padding:12px;text-align:center;color:var(--blue-d);font-family:'Patrick Hand';font-size:17px;margin-bottom:12px;background:var(--paper);-webkit-user-select:text;user-select:text">📋 Tahan di kotak ini lalu pilih <b>Tempel</b> untuk memasukkan gambar yang sudah disalin</div>
    ${myStickers.length?`<div class="stgrid">${myStickers.map(m=>`<button data-myst="${m.id}" style="position:relative">${stImg(String(m.s).startsWith("data:")?m.s:window.__pdvBlob(m.s))}${stEdit?`<span class="stdel" data-stdel="${m.id}">✕</span>`:""}</button>`).join("")}</div>`
      :`<div class="empty" style="text-align:center;padding:24px">Belum ada stiker. Tekan “＋ Tambah dari file”.</div>`}`;
}
function closePops(){document.querySelectorAll(".pop").forEach(p=>p.classList.remove("on"));$("#stickerBg")&&$("#stickerBg").classList.remove("on")}
$("#stickerBtn").onclick=e=>{e.stopPropagation();renderStickerPanel();$("#stickerBg").classList.add("on")};
$("#stickerBg").addEventListener("click",async e=>{
  if(e.target.id==="stickerBg"||e.target.closest("#stClose")){closePops();return}
  const tab=e.target.closest("[data-sttab]");if(tab){stTab=tab.dataset.sttab;stEdit=false;renderStickerPanel();return}
  if(e.target.closest("#stEditBtn")){stEdit=!stEdit;renderStickerPanel();return}
  const del=e.target.closest("[data-stdel]");if(del){e.stopPropagation();delSt(del.dataset.stdel).catch(err);renderStickerPanel();return}
  const b=e.target.closest("[data-st]");if(b){const k=b.dataset.st,[w,h]=stSize(k),[x,y]=viewCenter(w,h);addMedia([{id:uid(),k:"st",s:k,x,y,w,h,r:0,lk:false}],"tambah stiker");closePops();return}
  const fst=e.target.closest("[data-fst]");if(fst){const w=170,h=Math.round(w*(+fst.dataset.fh||372)/(+fst.dataset.fw||360)),[x,y]=viewCenter(w,h);addMedia([{id:uid(),k:"img",s:"f:"+fst.dataset.fst,x,y,w,h,r:0,lk:false}],"tambah stiker");closePops();return}
  const m=e.target.closest("[data-myst]");if(m&&!stEdit){const st=myStickers.find(x=>x.id===m.dataset.myst);if(!st)return;const w=140,h=Math.round(w/(st.ar||1)),[x,y]=viewCenter(w,h);
    addMedia([{id:uid(),k:"img",s:st.s,x,y,w,h,r:0,lk:false}],"tambah stiker");closePops()}
});
$("#stickerBg").addEventListener("change",e=>{if(e.target.id==="stRemoveBg")try{localStorage.setItem(LSK+"rmbg",e.target.checked?"1":"0")}catch(x){}});
async function loadMySt(){
  try{
    if(db){const q=await db.collection("stickers").get();myStickers=q.docs.map(d=>({id:d.id,...JSON.parse(JSON.stringify(d.data()))})).sort((a,b)=>(a.ts||0)-(b.ts||0));
      const old=await backend.get("lib/stickers");if(old&&old.list&&old.list.length){for(const st of old.list)if(!myStickers.some(x=>x.id===st.id))await putSt({...st,ts:st.ts||Date.now()});await backend.set("lib/stickers",{list:[]})}}
    else{const d=await local.get("lib/stickers");myStickers=(d&&d.list)||[]}
  }catch(e){console.warn(e)}
}
async function putSt(st){if(!myStickers.some(x=>x.id===st.id))myStickers.push(st);
  if(db){const {id,...b}=st;await db.doc("stickers/"+id).set(b)}else await local.set("lib/stickers",{list:myStickers})}
async function delSt(id){myStickers=myStickers.filter(x=>x.id!==id);if(db)await db.doc("stickers/"+id).delete();else await local.set("lib/stickers",{list:myStickers})}
function removeWhite(c){const ctx=c.getContext("2d"),d=ctx.getImageData(0,0,c.width,c.height),a=d.data;
  for(let i=0;i<a.length;i+=4){const m=Math.min(a[i],a[i+1],a[i+2]);if(m>238)a[i+3]=0;else if(m>215)a[i+3]=Math.min(a[i+3],Math.round((238-m)/23*255))}
  ctx.putImageData(d,0,0)}
const isImgFile=f=>/^image\//.test(f.type||"")||/\.(png|jpe?g|gif|webp|heic|heif|bmp|svg|avif)$/i.test(f.name||"");
async function decodeImg(f){
  const url=URL.createObjectURL(f);
  try{const img=await loadImg(url);return{src:img,w:img.naturalWidth,h:img.naturalHeight}}
  catch(e){if(window.createImageBitmap){try{const b=await createImageBitmap(f);return{src:b,w:b.width,h:b.height}}catch(x){}}throw new Error("format tidak didukung")}
  finally{setTimeout(()=>URL.revokeObjectURL(url),2000)}
}
async function stickerSrc(c){
  if(assetsNS){try{const blob=await new Promise(r=>c.toBlob(r,"image/png"));if(blob){const r=await assetsNS.upload(blob,{type:"image/png"});return r.id}}catch(e){console.warn("upload",e)}}
  let max=360,url="";
  for(let i=0;i<6;i++){const s=Math.min(1,max/Math.max(c.width,c.height)),c2=document.createElement("canvas");c2.width=Math.max(1,Math.round(c.width*s));c2.height=Math.max(1,Math.round(c.height*s));
    c2.getContext("2d").drawImage(c,0,0,c2.width,c2.height);url=c2.toDataURL("image/webp",.85);if(!url.startsWith("data:image/webp"))url=c2.toDataURL("image/png");
    if(url.length<180000)return url;max=Math.round(max*.75)}
  return url;
}
async function addStickerFiles(files){
  files=[...files];if(!files.length)return;
  const rm=!$("#stRemoveBg")||$("#stRemoveBg").checked;let n=0;const fails=[];
  for(const [i,f] of files.entries()){
    if(!isImgFile(f)){fails.push(`${f.name||"file"} (bukan gambar)`);continue}
    toast(`Menyimpan stiker ${i+1}/${files.length}…`);
    try{const im=await decodeImg(f),s=Math.min(1,600/Math.max(im.w,im.h)),c=document.createElement("canvas");
      c.width=Math.max(1,Math.round(im.w*s));c.height=Math.max(1,Math.round(im.h*s));const ctx=c.getContext("2d");ctx.drawImage(im.src,0,0,c.width,c.height);
      if(rm){const px=ctx.getImageData(0,0,1,1).data;if(px[3]===255&&Math.min(px[0],px[1],px[2])>230)removeWhite(c)}
      const src=await stickerSrc(c);await putSt({id:uid(),s:src,ar:c.width/c.height,ts:Date.now()});n++}
    catch(x){fails.push(`${f.name||"gambar"} (${x.message||x.code||"gagal"})`)}}
  stTab="mine";if($("#stickerBg").classList.contains("on"))renderStickerPanel();
  toast((n?`⭐ ${n} stiker ditambahkan ke Stiker Saya.`:"")+(fails.length?`<br>⚠️ Belum berhasil: ${esc(fails.join(", "))}`:""));
  if(fails.length){clearTimeout(toast._t);toast._t=setTimeout(()=>$("#toast").classList.remove("on"),9000)}
}
$("#stInput").onchange=e=>{const f=[...e.target.files];e.target.value="";addStickerFiles(f)};
const stModal=$("#stickerBg");
stModal.addEventListener("dragover",e=>{e.preventDefault();stModal.querySelector(".modal").classList.add("stdrop")});
stModal.addEventListener("dragleave",()=>stModal.querySelector(".modal").classList.remove("stdrop"));
stModal.addEventListener("drop",e=>{e.preventDefault();stModal.querySelector(".modal").classList.remove("stdrop");stTab="mine";addStickerFiles(e.dataTransfer.files)});
document.addEventListener("input",e=>{if(e.target.id==="stPaste"){const im=e.target.querySelector("img");e.target.innerHTML="📋 Tahan di kotak ini lalu pilih <b>Tempel</b>";if(im&&im.src){loadImg(im.src).then(img=>{const c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext("2d").drawImage(img,0,0);c.toBlob(b=>b?addStickerFiles([new File([b],"tempel.png",{type:"image/png"})]):toast("Gambar tempelan tidak bisa dibaca."),"image/png")}).catch(()=>toast("Gambar tempelan tidak bisa dibaca. Coba salin ulang gambarnya."))}}});
document.addEventListener("paste",e=>{if(!$("#stickerBg").classList.contains("on"))return;const fs=[...(e.clipboardData?.files||[])].filter(f=>/^image\//.test(f.type));if(!fs.length&&e.clipboardData&&e.clipboardData.items){for(const it of e.clipboardData.items){if(it.kind==="file"&&/^image\//.test(it.type)){const f=it.getAsFile();if(f)fs.push(f)}}}if(fs.length){e.preventDefault();stTab="mine";addStickerFiles(fs)}});

/* images */
const loadImg=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src});
async function canvasToStored(c,png){
  const blob=await new Promise(r=>c.toBlob(r,png?"image/png":"image/jpeg",.86));
  if(assetsNS){try{const r=await assetsNS.upload(blob);return r.id}catch(e){toast("Upload gagal ("+esc(e.code||e.message)+"), disimpan versi kecil.")}}
  const s=Math.min(1,700/Math.max(c.width,c.height)),c2=document.createElement("canvas");c2.width=Math.round(c.width*s);c2.height=Math.round(c.height*s);
  c2.getContext("2d").drawImage(c,0,0,c2.width,c2.height);return png?c2.toDataURL("image/png"):c2.toDataURL("image/jpeg",.72);
}
$("#imgInput").onchange=async e=>{
  const files=[...e.target.files];e.target.value="";if(!files.length)return;toast("Menyisipkan gambar…");const out=[];
  for(const f of files){try{const url=URL.createObjectURL(f),img=await loadImg(url);
    const s=Math.min(1,1800/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(img.naturalWidth*s);c.height=Math.round(img.naturalHeight*s);
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);
    const src=await canvasToStored(c,/png|gif|webp|svg/.test(f.type));
    const w=Math.min(360,c.width),h=Math.round(w*c.height/c.width),[x,y]=viewCenter(w,h);out.push({id:uid(),k:"img",s:src,x:x+out.length*20,y:y+out.length*20,w,h,r:0,lk:false})}
    catch(x){toast("Gambar tidak bisa dibuka: "+esc(f.name))}}
  if(out.length){addMedia(out,"tambah gambar");toast("🖼️ Gambar ditambahkan. Geser/ubah ukuran, lalu tekan 🔒 Kunci.")}
};

/* PDF */
const loadScript=src=>new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("gagal memuat "+src));document.head.appendChild(s)});
const PDFJS="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/";
async function ensurePdf(){if(window.pdfjsLib&&window.pdfjsWorker)return;await loadScript(PDFJS+"pdf.min.js");await loadScript(PDFJS+"pdf.worker.min.js")}
let pdfDoc=null,pdfSel=new Set(),pdfName="";
$("#pdfInput").onchange=async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;pdfName=f.name.replace(/\.pdf$/i,"");
  try{toast("Membuka PDF…");await ensurePdf();pdfDoc=await pdfjsLib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise}
  catch(x){toast("PDF tidak bisa dibuka: "+esc(x.message||x));return}
  const n=Math.min(pdfDoc.numPages,60);pdfSel=new Set([1]);
  $("#pdfInfo").textContent=`${f.name} · ${pdfDoc.numPages} halaman${pdfDoc.numPages>60?" (ditampilkan 60 pertama)":""}. Klik halaman untuk memilih.`;
  $("#pdfGrid").innerHTML=Array.from({length:n},(_,i)=>`<div class="pg ${i===0?"on":""}" data-pg="${i+1}"><canvas></canvas>Hal. ${i+1}</div>`).join("");
  $("#pdfBg").classList.add("on");
  for(let i=1;i<=n;i++){if(!$("#pdfBg").classList.contains("on"))break;try{const pg=await pdfDoc.getPage(i),v=pg.getViewport({scale:1}),vp=pg.getViewport({scale:240/v.width});
    const c=document.querySelector(`[data-pg="${i}"] canvas`);if(!c)break;c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise}catch(x){}}
};
$("#pdfGrid").onclick=e=>{const d=e.target.closest("[data-pg]");if(!d)return;const n=+d.dataset.pg;pdfSel.has(n)?pdfSel.delete(n):pdfSel.add(n);d.classList.toggle("on",pdfSel.has(n))};
$("#pdfAll").onclick=()=>{const all=document.querySelectorAll("[data-pg]");const on=pdfSel.size<all.length;pdfSel=new Set(on?[...all].map(d=>+d.dataset.pg):[]);all.forEach(d=>d.classList.toggle("on",on))};
$("#pdfCancel").onclick=()=>$("#pdfBg").classList.remove("on");
async function renderPdfPage(n){const pg=await pdfDoc.getPage(n),v=pg.getViewport({scale:1}),vp=pg.getViewport({scale:1500/v.width}),c=document.createElement("canvas");
  c.width=Math.round(vp.width);c.height=Math.round(vp.height);const ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);
  await pg.render({canvasContext:ctx,viewport:vp}).promise;return c}
$("#pdfHere").onclick=async()=>{
  const pages=[...pdfSel].sort((a,b)=>a-b);if(!pages.length){toast("Pilih minimal satu halaman.");return}$("#pdfBg").classList.remove("on");
  const out=[];for(const [i,n] of pages.entries()){toast(`Menyisipkan halaman ${i+1}/${pages.length}…`);try{const c=await renderPdfPage(n),src=await canvasToStored(c,false);
    const w=pages.length===1?560:420,h=Math.round(w*c.height/c.width),[x,y]=viewCenter(w,h);out.push({id:uid(),k:"img",s:src,x:x+i*24,y:y+i*24,w,h,r:0,lk:false})}catch(x){toast("Gagal: "+esc(x.message||x))}}
  if(out.length){addMedia(out,"tempel PDF");toast("📄 PDF ditempel. Tekan 🔒 Kunci lalu tulis di atasnya.")}
};
const catMax=()=>+(notesCache.meta&&notesCache.meta.f&&notesCache.meta.f.catMax)||1;
function setCatMax(n){notesCache.meta=notesCache.meta||{f:{}};notesCache.meta.f.catMax=n;queueSave("notes/meta",()=>({f:notesCache.meta.f}),300)}
$("#pdfNew").onclick=async()=>{
  const pages=[...pdfSel].sort((a,b)=>a-b);if(!pages.length){toast("Pilih minimal satu halaman.");return}$("#pdfBg").classList.remove("on");
  const start=catMax()+1;let made=0;
  for(const [i,n] of pages.entries()){toast(`Membuat halaman catatan ${i+1}/${pages.length}…`);try{
    const c=await renderPdfPage(n),src=await canvasToStored(c,false),key="catatan-"+(start+i),w=704,h=Math.round(w*c.height/c.width);
    mediaCache[key]={m:[{id:uid(),k:"img",s:src,x:10,y:10,w,h,r:0,lk:true}]};queueSave("media/"+key,()=>({m:mediaCache[key].m}),100);
    inkCache[key]={s:[]};notesCache[key]={f:{judul:`${pdfName} – hal. ${n}`}};queueSave("notes/"+key,()=>({f:notesCache[key].f}),100);made++}catch(x){toast("Gagal: "+esc(x.message||x))}}
  if(made){setCatMax(start+made-1);setMode("ink");setTool(lastDraw);go({p:"catatan",n:start});toast(`📄 ${made} halaman PDF jadi Catatan hal. ${start}${made>1?"–"+(start+made-1):""} (sudah terkunci, langsung bisa ditulis).`)}
};
buildTools();setStylusOnly(stylusOnly,true);

/* =================== modal =================== */
function setKind(k){kind=k;document.querySelectorAll("#kindSeg button").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
  $("#endRow").style.display=k==="agenda"?"":"none";$("#prioBox").style.visibility=k==="tugas"?"visible":"hidden";
  $("#dateLbl").textContent=k==="agenda"?"Tanggal (mulai)":"Tenggat tanggal";$("#startLbl").textContent=k==="agenda"?"Mulai":"Jam tenggat (opsional)";
  $("#repeatBox").style.display=(k==="agenda"&&$("#fRepeat").value==="weekly")?"":"none";updS2Modal()}
function updS2Modal(){const on=$("#fCat").value==="s2"&&kind==="tugas";$("#s2Row").style.display=on?"":"none";$("#s2Ang").style.display=on&&$("#fJenis").value==="kelompok"?"":"none";$("#s2Luar").style.display=on?"":"none"}
function renderDays(){$("#fDays").innerHTML=[1,2,3,4,5,6,0].map(d=>`<button type="button" data-d="${d}" class="${days.includes(d)?"on":""}">${HR[d]}</button>`).join("")}
function openModal(it,preset={}){
  editing=it||null;$("#mTitle").textContent=it?"Ubah":"Tambah";$("#delBtn").style.visibility=it?"visible":"hidden";
  $("#fCat").innerHTML=CAT_LIST().map(([k,c])=>`<option value="${k}">${c.name}</option>`).join("");
  const defCat=preset.cat||(PAGES[cur.p].cats||["wakasek"])[0];
  $("#fTitle").value=it?.title||"";$("#fCat").value=normCat(it?.cat||defCat);$("#fPrio").value=it?.prio||"sedang";
  $("#fDate").value=it?.date||preset.date||(cur.p==="daily"?cur.d:ymd(new Date()));$("#fStart").value=it?.start||"";$("#fEnd").value=it?.end||"";
  $("#fRepeat").value=it?.repeat||(cur.p==="rutin"&&!it?"weekly":"none");$("#fUntil").value=it?.until||"";
  $("#fRemind").value=String(it?.remind??((it?.kind||preset.kind)==="tugas"?1440:60));$("#fNotes").value=it?.notes||"";
  $("#fMk").innerHTML=`<option value="">— pilih —</option>`+MK.map(m=>`<option value="${m.k}">${m.n}</option>`).join("");
  $("#fMk").value=(it?mkOf(it):"")||preset.mk||(cur.p==="s2"&&s2Tab!=="all"?s2Tab:"");$("#fJenis").value=it?.jenis||preset.jenis||"individu";$("#fAng").value=it?.anggota||"";$("#fLuar").value=(it?.luaran||[]).map(x=>x.n).join(", ");
  days=it?.days?[...it.days]:[parseD($("#fDate").value).getDay()];renderDays();setKind(it?.kind||preset.kind||(cur.p==="s2"&&s2Tab!=="all"?"tugas":"agenda"));
  $("#modalBg").classList.add("on");setTimeout(()=>$("#fTitle").focus(),50);
}
function closeModal(){$("#modalBg").classList.remove("on");editing=null}
$("#kindSeg").onclick=e=>{const b=e.target.closest("button");if(b)setKind(b.dataset.k)};
$("#fRepeat").onchange=()=>setKind(kind);
$("#fCat").addEventListener("change",updS2Modal);$("#fJenis").addEventListener("change",updS2Modal);
$("#fDays").onclick=e=>{const b=e.target.closest("button");if(!b)return;const d=+b.dataset.d;days=days.includes(d)?days.filter(x=>x!==d):[...days,d];renderDays()};
$("#cancelBtn").onclick=closeModal;
$("#modalBg").onclick=e=>{if(e.target.id==="modalBg")closeModal()};
$("#delBtn").onclick=async()=>{const b=$("#delBtn");if(!editing)return;
  if(b.dataset.c!=="1"){b.dataset.c="1";b.textContent="Yakin hapus?";setTimeout(()=>{b.dataset.c="";b.textContent="Hapus"},3000);return}
  b.dataset.c="";b.textContent="Hapus";const old={...editing};closeModal();
  try{await removeItem(old.id);pushUndo({label:"hapus "+old.title,page:{...cur},undo:()=>putItem(old),redo:()=>removeItem(old.id)});toast("Dihapus. Tekan ↶ Undo untuk mengembalikan.")}catch(x){err(x)}};
$("#form").onsubmit=async e=>{
  e.preventDefault();const now=new Date().toISOString();
  const o={id:editing?.id||uid(),title:$("#fTitle").value.trim(),cat:$("#fCat").value,kind,date:$("#fDate").value,start:$("#fStart").value||"",
    remind:+$("#fRemind").value,notes:$("#fNotes").value.trim(),updatedAt:now,createdAt:editing?.createdAt||now};
  if(!o.title||!o.date)return;
  if(kind==="agenda"){o.end=$("#fEnd").value||"";o.repeat=$("#fRepeat").value;o.days=o.repeat==="weekly"?(days.length?days:[parseD(o.date).getDay()]):[];o.until=o.repeat!=="none"?($("#fUntil").value||""):""}
  else{o.prio=$("#fPrio").value;o.done=editing?.done||false;if(o.cat==="s2"){o.mk=$("#fMk").value||"";o.jenis=$("#fJenis").value||"individu";o.anggota=o.jenis==="kelompok"?$("#fAng").value.trim():"";const prev=editing?.luaran||[];o.luaran=$("#fLuar").value.split(",").map(x=>x.trim()).filter(Boolean).map(n=>({n,d:!!(prev.find(p=>p.n===n)||{}).d}));if(o.luaran.length)o.done=o.luaran.every(x=>x.d)}}
  if(editing){for(const k of ["mk","jenis","anggota","luaran"])if(o[k]===undefined&&editing[k]!==undefined)o[k]=editing[k]}
  const old=editing?{...editing}:null;closeModal();
  try{await putItem(o);pushUndo({label:(old?"ubah ":"tambah ")+o.title,page:{...cur},undo:()=>old?putItem(old):removeItem(o.id),redo:()=>putItem(o)});toast("Tersimpan ✓")}catch(x){err(x)}
};

/* =================== events =================== */
$("#page").addEventListener("click",async e=>{
  if(mode==="ink")return;
  const t=e.target;
  const g=t.closest("[data-go]");if(g){go(g.dataset.go);return}
  const cr=t.closest("[data-crumb]");if(cr){go({p:cr.dataset.crumb,d:cr.dataset.cd});return}
  const gw=t.closest("[data-gowk]");if(gw){go({p:"weekly",d:gw.dataset.gowk});return}
  const gm=t.closest("[data-gomon]");if(gm){go({p:"monthly",d:gm.dataset.gomon});return}
  const yn=t.closest("[data-ynav]");if(yn){const n=+yn.dataset.ynav,d=parseD(cur.d);go({p:"yearly",d:n?ymd(new Date(taStart(d)+n,6,1)):ymd(new Date())});return}
  const gd=t.closest("[data-goday]");if(gd&&!t.closest("[data-id]")){go({p:"daily",d:gd.dataset.goday});return}
  if(t.matches("[data-done]")){const it=items.find(x=>x.id===t.dataset.done);if(!it)return;const v=t.checked,old=JSON.parse(JSON.stringify(it)),nw={...it,done:v};if(it.luaran&&it.luaran.length)nw.luaran=it.luaran.map(x=>({...x,d:v}));
    try{await putItem(nw);pushUndo({label:(v?"centang ":"batal centang ")+it.title,page:{...cur},undo:()=>putItem(old),redo:()=>putItem(nw)})}catch(x){err(x)}return}
  const dn=t.closest("[data-dnav]");if(dn){const n=+dn.dataset.dnav;go({p:"daily",d:n?ymd(addDays(parseD(cur.d),n)):ymd(new Date())});return}
  const wn=t.closest("[data-wnav]");if(wn){const n=+wn.dataset.wnav;go({p:"weekly",d:n?ymd(addDays(parseD(cur.d),n)):ymd(new Date())});return}
  const mn=t.closest("[data-mnav]");if(mn){const n=+mn.dataset.mnav,d=parseD(cur.d);go({p:"monthly",d:n?ymd(new Date(d.getFullYear(),d.getMonth()+n,1)):ymd(new Date())});return}
  const fv=t.closest("[data-fv]");if(fv){finView=fv.dataset.fv;renderPage();return}
  const fn=t.closest("[data-fnav]");if(fn){const n=+fn.dataset.fnav,d=parseD(cur.d);go({p:"keuangan",d:ymd(finView==="hari"?addDays(d,n):finView==="tahun"?new Date(d.getFullYear()+n,d.getMonth(),1):new Date(d.getFullYear(),d.getMonth()+n,1))},false);return}
  const fday=t.closest("[data-fday]");if(fday){finView="hari";go({p:"keuangan",d:fday.dataset.fday},false);return}
  const ftx=t.closest("[data-fid]");if(ftx){const x=fin.find(q=>q.id===ftx.dataset.fid);if(x&&window.__finEditStart)window.__finEditStart(x);return}
  const ibv=t.closest("[data-ibv]");if(ibv){ibView=ibv.dataset.ibv;refreshAuto();return}
  const gcv=t.closest("[data-gocv]");if(gcv){go({p:gcv.dataset.gocv,cv:1});return}
  const oa=t.closest("[data-openapp]");if(oa){go({p:oa.dataset.openapp});return}
  const xp=t.closest("[data-xp]");if(xp){const b={...cur};delete b.x;delete b.cv;if(xp.dataset.xp)b.x=xp.dataset.xp;go(b);return}
  if(t.closest("[data-addpage]")){openAddPage();return}
  const dp=t.closest("[data-delpage]");if(dp){if(dp.dataset.c!=="1"){dp.dataset.c="1";dp.textContent="Yakin hapus?";setTimeout(()=>{if(dp.isConnected){dp.dataset.c="";dp.textContent="🗑"}},3000);return}delCurPage();return}
  const inv=t.closest("[data-inav]");if(inv){const n=+inv.dataset.inav;go({p:"ibadah",d:n?ymd(addDays(parseD(cur.d),n)):ymd(new Date())});return}
  const gib=t.closest("[data-goib]");if(gib){go({p:"ibadah",d:gib.dataset.goib});return}
  const cn=t.closest("[data-cnav]");if(cn){go({p:"catatan",n:Math.max(1,(cur.n||1)+ +cn.dataset.cnav)});return}
  const nw=t.closest("[data-new]");if(nw){openModal(null,{kind:nw.dataset.new});return}
  const row=t.closest("[data-id]");if(row&&!t.matches("input")&&!t.closest(".lchips,.s2btn")){const it=items.find(x=>x.id===row.dataset.id);if(it){const dc=t.closest("[data-goday],[data-dctx]");openDetail(it,dc?(dc.dataset.goday||dc.dataset.dctx):(["daily","ibadah"].includes(cur.p)?cur.d:it.date))}}
});
$("#page").addEventListener("change",e=>{
  if(e.target.matches("[data-djump]")&&e.target.value)go({p:"daily",d:e.target.value});
  if(e.target.matches('input[type=checkbox][data-f]')){const name=e.target.dataset.f,key=pageKey(cur),v=e.target.checked;setField(key,name,v);
    pushUndo({label:"centang",page:{...cur},undo:()=>setField(key,name,!v),redo:()=>setField(key,name,v)})}
  if(cur.p==="ibadah"&&e.target.matches("[data-f]"))setTimeout(refreshAuto,50);
  if(cur.p==="keuangan"&&e.target.matches("[data-f^=z_]"))setTimeout(refreshAuto,50);
});
let focusOld=null;
$("#page").addEventListener("focusin",e=>{if(e.target.matches("[data-f]"))focusOld=e.target.value});
$("#page").addEventListener("input",e=>{const el=e.target;if(!el.matches("[data-f]")||el.type==="checkbox")return;
  const key=pageKey(cur),n=editableNote(key);n.f[el.dataset.f]=el.value;
  queueNoteField(key,el.dataset.f);
  if(key.startsWith("ibadah-"))syncIbDay(key.slice(7));
  if(cur.p==="keuangan"&&/^(op_|z_)/.test(el.dataset.f)){clearTimeout(window.__opT);window.__opT=setTimeout(refreshAuto,600)}
  if(cur.x&&el.dataset.f==="judul"){const b=document.querySelector(`.pager [data-xp="${cur.x}"]`),t=el.value.trim()||curExtra()?.title||"Halaman";if(b)b.textContent=(curExtra()?.t==="blank"?"📝 ":curExtra()?.t==="img"?"🗓️ ":"📄 ")+t;$("#crumb").textContent=PAGES[cur.p].title+" · "+t}
  if(el.tagName==="TEXTAREA"&&el.scrollHeight>el.clientHeight+2){el.rows+=1;layout()}});
$("#page").addEventListener("focusout",e=>{const el=e.target;if(!el.matches("[data-f]")||el.type==="checkbox")return;
  if(focusOld!==null&&focusOld!==el.value){const key=pageKey(cur),name=el.dataset.f,o=focusOld,v=el.value;
    pushUndo({label:"ketikan",page:{...cur},undo:()=>setField(key,name,o),redo:()=>setField(key,name,v)})}focusOld=null});
$("#page").addEventListener("keydown",async e=>{
  const q=e.target.closest("[data-qadd]");if(!q||e.key!=="Enter"||!q.value.trim())return;e.preventDefault();
  const cat=q.parentElement.querySelector("[data-qcat]").value,now=new Date().toISOString();
  const o={id:uid(),title:q.value.trim(),cat,kind:"tugas",date:q.dataset.qadd||ymd(new Date()),start:"",remind:1440,notes:"",prio:"sedang",done:false,createdAt:now,updatedAt:now};
  q.value="";try{await putItem(o);pushUndo({label:"tambah "+o.title,page:{...cur},undo:()=>removeItem(o.id),redo:()=>putItem(o)})}catch(x){err(x)}
});

$("#backBtn").onclick=()=>{if(document.body.classList.contains("appmode")&&appBack())return;const p=navStack.pop();if(p)go(p,false)};
$("#homeHouse").onclick=()=>go("cover");
$("#homeBtn").onclick=()=>go("index");
$("#undoBtn").onclick=doUndo;$("#redoBtn").onclick=doRedo;
$("#addBtn").onclick=()=>openModal(null);
document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.addEventListener("keydown",e=>{
  if($("#modalBg").classList.contains("on")){if(e.key==="Escape")closeModal();return}
  const inField=e.target.matches("input,textarea,select");
  if(!inField&&(e.key==="Delete"||e.key==="Backspace")&&(sel||selMedia)){e.preventDefault();if(sel)selAction("del");else mediaAction("del");return}
  if(e.key==="Escape"){clearSel();if(selMedia){selMedia=null;renderMedia()}closePops()}
  if((e.ctrlKey||e.metaKey)&&!inField&&(e.key==="="||e.key==="+")){e.preventDefault();setZoom(zoom*1.2)}
  if((e.ctrlKey||e.metaKey)&&!inField&&e.key==="-"){e.preventDefault();setZoom(zoom/1.2)}
  if((e.ctrlKey||e.metaKey)&&!inField){if(e.key==="z"&&!e.shiftKey){e.preventDefault();doUndo()}else if(e.key==="y"||(e.key==="z"&&e.shiftKey)){e.preventDefault();doRedo()}}
  if(e.altKey&&e.key==="ArrowLeft"){e.preventDefault();$("#backBtn").click()}
});

function toast(m){const t=$("#toast");t.innerHTML=m;t.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("on"),5000)}
function err(e){toast("Gagal menyimpan: "+esc(e?.message||e?.code||e))}

/* live reminders */
const shown=new Set();let primed=false;
function checkLive(){for(const r of reminders()){const k=r.it.id+"|"+r.ds+"|"+r.late;if(shown.has(k))continue;shown.add(k);
  if(primed)toast(`🔔 <b>${esc(r.it.title)}</b><br>${r.type==="tugas"?"Tenggat":"Mulai"} ${fmtShort(r.at)} ${r.it.start||""} (${rel(r.at,r.type)})`)}primed=true}
setInterval(()=>{if(!document.activeElement||!document.activeElement.matches("input,textarea"))refreshAuto();checkLive()},60000);

/* =================== ibadah harian =================== */
const LOC={name:"Tangerang",lat:-6.1783,lng:106.6319,tz:7};
function julianDay(y,m,d){if(m<=2){y-=1;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5}
function prayerTimes(date){
  const D2R=Math.PI/180,R2D=180/Math.PI,fix=(a,b)=>{a=a-b*Math.floor(a/b);return a<0?a+b:a};
  const jd=julianDay(date.getFullYear(),date.getMonth()+1,date.getDate())-LOC.lng/(15*24);
  const D=jd-2451545,g=fix(357.529+.98560028*D,360),q=fix(280.459+.98564736*D,360),L=fix(q+1.915*Math.sin(g*D2R)+.02*Math.sin(2*g*D2R),360),e=23.439-.00000036*D;
  const RA=fix(Math.atan2(Math.cos(e*D2R)*Math.sin(L*D2R),Math.cos(L*D2R))*R2D/15,24),eqt=q/15-RA,decl=Math.asin(Math.sin(e*D2R)*Math.sin(L*D2R))*R2D;
  const lat=LOC.lat,dhuhr=12+LOC.tz-LOC.lng/15-eqt;
  const T=a=>Math.acos((-Math.sin(a*D2R)-Math.sin(decl*D2R)*Math.sin(lat*D2R))/(Math.cos(decl*D2R)*Math.cos(lat*D2R)))*R2D/15;
  const asrA=-Math.atan(1/(1+Math.tan(Math.abs(lat-decl)*D2R)))*R2D;
  const h={subuh:dhuhr-T(20),terbit:dhuhr-T(.833),zhuhur:dhuhr,ashar:dhuhr+T(asrA),maghrib:dhuhr+T(.833),isya:dhuhr+T(18)};
  const out={};for(const k in h){let m=Math.ceil(h[k]*60+(k==="terbit"?-2:2));out[k]=pad(Math.floor(m/60))+":"+pad(m%60)}return out; // ihtiyat 2 menit (Kemenag)
}
const SHALAT=[["subuh","Subuh"],["zhuhur","Zhuhur"],["ashar","Ashar"],["maghrib","Maghrib"],["isya","Isya"]];
function hijri(d){try{const f=new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura",{day:"numeric",month:"long",year:"numeric"});
  const parts=f.formatToParts(d),day=+parts.find(p=>p.type==="day").value,mon=parts.find(p=>p.type==="month").value;
  const mnum=+new Intl.DateTimeFormat("en-u-ca-islamic-umalqura",{month:"numeric"}).format(d);
  return{text:f.format(d).replace(/\s*H$/,"")+" H",day,mon,mnum}}catch(e){return null}}
function puasaHint(d){const h=hijri(d),dow=d.getDay(),out=[];
  if(h&&h.mnum===9)out.push("Puasa Ramadhan (wajib)");
  else{if(dow===1)out.push("Puasa Senin");if(dow===4)out.push("Puasa Kamis");
    if(h&&[13,14,15].includes(h.day))out.push("Ayyamul Bidh ("+h.day+" "+h.mon+")");
    if(h&&h.mnum===12&&h.day===9)out.push("Puasa Arafah");
    if(h&&h.mnum===1&&(h.day===9||h.day===10))out.push(h.day===9?"Puasa Tasu'a":"Puasa 'Asyura");
    if(h&&h.mnum===10&&h.day>1)out.push("Puasa 6 hari Syawal");
    if(h&&((h.mnum===10&&h.day===1)||(h.mnum===12&&h.day>=10&&h.day<=13)))return["Hari raya / tasyrik: tidak berpuasa"]}
  return out}
function nextPrayer(now=new Date()){
  for(let k=0;k<2;k++){const d=addDays(now,k),pt=prayerTimes(d);for(const [key,nm] of SHALAT){const t=dtOf(ymd(d),pt[key]);if(t>now)return{key,nm,t,time:pt[key]}}}return null}
const notesLoading={};
function loadNotesKey(key){if(notesCache[key])return Promise.resolve(notesCache[key]);if(notesLoading[key])return notesLoading[key];
  return notesLoading[key]=backend.get("notes/"+key).then(d=>{if(!notesCache[key])notesCache[key]=(d&&d.f)?d:{f:{}};return notesCache[key]})
    .catch(()=>{if(!notesCache[key])notesCache[key]={f:{}};return notesCache[key]}).finally(()=>{delete notesLoading[key]})}
const ckb=(name,label,extra="")=>`<label class="ib"><input type="checkbox" class="ck" data-f="${name}" ${fv(name)?"checked":""}> <span>${label}</span>${extra}</label>`;
function ibScore(f){f=f||{};const s=SHALAT.filter(([k])=>f["s_"+k]).length;const r=["r_qsubuh","r_qzhuhur","r_bzhuhur","r_bmaghrib","r_bisya"].filter(k=>f[k]).length;
  const dz=["dz_pagi","dz_petang"].filter(k=>f[k]).length;return{s,r,dz,q:!!(f.tilawah||f.hafalan),uzur:!!f.uzur}}
function pgIbadah(){
  const ds=cur.d,d=parseD(ds),pt=prayerTimes(d),h=hijri(d),isToday=ds===ymd(new Date()),isJumat=d.getDay()===5;
  const nav=`<div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:8px">
    <button class="navbtn" data-inav="-1">‹</button><button class="pill" data-inav="0">Hari ini</button><button class="navbtn" data-inav="1">›</button></div>`;
  const sub=`<div class="quote" style="margin-top:4px">${fmtLong(d)}${h?` · <b>${h.text}</b>`:""}</div>`;
  const next=()=>{if(!isToday)return`<div class="empty">Jadwal shalat ${fmtShort(d)} (${LOC.name}).</div>`;const n=nextPrayer();if(!n)return"";
    const m=Math.max(0,Math.round((n.t-new Date())/60000));return `<div style="text-align:center"><div style="font-family:'Patrick Hand';font-size:18px;color:var(--blue-d)">Shalat berikutnya</div>
    <div style="font-family:Kalam;font-weight:700;font-size:40px;color:var(--navy);line-height:1">${n.nm} ${n.time}</div><div class="mt" style="font-size:14px">${m<60?m+" menit lagi":Math.floor(m/60)+" jam "+(m%60)+" menit lagi"}</div></div>`};
  const wajib=`<table class="tbl ibt"><tr><th>Shalat</th><th>Waktu*</th><th>Sudah</th><th>Awal waktu</th></tr>${SHALAT.map(([k,nm])=>`<tr><td>${nm}</td><td style="font-weight:800;color:var(--blue-d)">${pt[k]}</td><td style="text-align:center"><input type="checkbox" class="ck" data-f="s_${k}" ${fv("s_"+k)?"checked":""}></td><td style="text-align:center"><input type="checkbox" class="ck" data-f="aw_${k}" ${fv("aw_"+k)?"checked":""}></td></tr>`).join("")}
    <tr><td>Terbit</td><td style="color:var(--muted)">${pt.terbit}</td><td colspan="2" class="mt" style="font-size:12px">batas akhir waktu Subuh</td></tr></table>
    <div style="margin-top:8px">${ckb("uzur","Sedang berhalangan / uzur hari ini")}</div>
    <div class="mt" style="font-size:11.5px;margin-top:4px">*Perkiraan untuk ${LOC.name} (metode Kemenag, +2 menit ihtiyat). Ikuti jadwal masjid setempat bila berbeda.</div>`;
  const sunnah=`<div class="ibgrid">${ckb("r_qsubuh","2 rakaat sebelum Subuh")}${ckb("r_qzhuhur","4 rakaat sebelum Zhuhur")}${ckb("r_bzhuhur","2 rakaat setelah Zhuhur")}${ckb("r_bmaghrib","2 rakaat setelah Maghrib")}${ckb("r_bisya","2 rakaat setelah Isya")}</div>
    <div class="mt" style="font-size:12px;margin:2px 0 8px">12 rakaat rawatib — HR. Muslim no. 728 & At-Tirmidzi no. 415</div>
    <div class="ibgrid">${ckb("dhuha","Shalat Dhuha")}${ckb("witir","Qiyamul lail / Witir")}</div>`;
  const dzikir=`<div class="ibgrid">${ckb("dz_pagi","Dzikir pagi")}${ckb("dz_petang","Dzikir petang")}${ckb("dz_shalat","Dzikir setelah shalat")}${ckb("dz_tidur","Dzikir sebelum tidur")}${ckb("doa","Berdoa & istighfar")}${ckb("shalawat","Shalawat Nabi ﷺ")}</div>`;
  const quran=`<div class="numrow"><span style="min-width:120px;font-family:'Patrick Hand';font-size:18px;color:var(--navy)">📖 Tilawah</span>${inp("tilawah","mis. hal. 120–125 / 1 juz")}</div>
    <div class="numrow"><span style="min-width:120px;font-family:'Patrick Hand';font-size:18px;color:var(--navy)">🧠 Hafalan</span>${inp("hafalan","mis. An-Naba' 1–10 (ziyadah/murajaah)")}</div>
    <div style="margin-top:6px">${ckb("tafsir","Membaca tafsir / tadabbur")}</div>`;
  const ph=puasaHint(d);
  const puasa=`${ph.length?`<div style="margin-bottom:6px">${ph.map(x=>`<span class="badge" style="background:#f3e7cf;color:#7a5a1c;margin:0 4px 4px 0;display:inline-block">🌙 ${x}</span>`).join("")}</div>`:`<div class="mt" style="margin-bottom:6px">Tidak ada puasa sunnah khusus hari ini.</div>`}${ckb("puasa","Berpuasa hari ini")}${ckb("sahur","Makan sahur")}`;
  const amal=`<div class="ibgrid">${ckb("sedekah","Sedekah")}${ckb("ilmu","Menuntut ilmu / kajian")}${ckb("birr","Berbakti & silaturahim")}${ckb("menjaga","Menjaga lisan & pandangan")}</div>`;
  const jumat=isJumat?box("🕌 Amalan Hari Jumat",`<div class="ibgrid">${ckb("jm_kahfi","Membaca Al-Kahfi")}${ckb("jm_shalawat","Memperbanyak shalawat")}${ckb("jm_mandi","Mandi Jumat")}${ckb("jm_doa","Berdoa di akhir waktu Ashar")}</div>`,"note"):"";
  const recap=()=>{let cells="",need=[];for(let i=6;i>=0;i--){const dd=addDays(d,-i),k="ibadah-"+ymd(dd);if(!notesCache[k])need.push(k);const sc=ibScore(notesCache[k]&&notesCache[k].f);
      cells+=`<div class="ibday ${i===0?"today":""}" data-goib="${ymd(dd)}"><b>${HR[dd.getDay()]}</b><small>${dd.getDate()}</small>${sc.uzur?`<div class="ibuz">uzur</div>`:`<div class="ibbar"><i style="height:${sc.s/5*100}%"></i></div><div class="mt" style="font-size:11px">${sc.s}/5</div>`}<div style="font-size:12px;line-height:1.2">${sc.r>=5?"🌟":sc.r?"✨":""}${sc.dz===2?"📿":""}${sc.q?"📖":""}</div></div>`}
    if(need.length)Promise.all(need.map(loadNotesKey)).then(()=>{if(cur.p==="ibadah")refreshAuto()});
    return `<div class="ibweek">${cells}</div><div class="mt" style="font-size:12px;margin-top:6px">Batang = shalat wajib · 🌟 rawatib lengkap · ✨ sebagian · 📿 dzikir pagi & petang · 📖 Al-Qur'an</div>`};
  return header("Ibadah Harian","",sub+nav)+
   `<div class="cols c2"><div>${box("Shalat Wajib",wajib)}${box("Shalat Sunnah",sunnah,"sky")}</div>
    <div>${box("⏰ Waktu",auto("ibnext",next),"note")}${box("Al-Qur'an",quran)}${box("Dzikir & Doa",dzikir,"sky")}</div></div>
   ${jumat}<div class="cols c2">${box("Puasa",puasa)}${box("Amal Shalih",amal,"sky")}</div>
   ${box("📊 Rekap & Grafik Ibadah",auto("ibrec",ibRecapView))}
   ${box("7 Hari Terakhir",auto("ibrecap",recap))}
   <div class="cols c2">${box("Catatan Kajian",ta("kajian",5,"Tema, ustadz, faedah yang dicatat…"))}${box("Muhasabah",ta("muhasabah",5,"Apa yang perlu diperbaiki besok?"),"note")}</div>
   <div class="quotecard">“Amalan yang paling dicintai Allah adalah yang <b>terus-menerus</b> walaupun sedikit.” <span style="font-size:14px;color:var(--muted)">— HR. Al-Bukhari & Muslim</span></div>`;
}
const shownPrayer=new Set();
function checkPrayer(){const now=new Date(),pt=prayerTimes(now),ds=ymd(now);
  for(const [k,nm] of SHALAT){const t=dtOf(ds,pt[k]),diff=(now-t)/60000,key=ds+k;if(diff>=0&&diff<15&&!shownPrayer.has(key)){shownPrayer.add(key);if(checkPrayer.primed)toast(`🕌 Telah masuk waktu <b>${nm}</b> (${pt[k]}) — ${LOC.name}`)}}
  checkPrayer.primed=true}
setInterval(checkPrayer,60000);setTimeout(checkPrayer,3000);

/* =================== grafik (SVG) =================== */
const fmtRp=n=>"Rp "+new Intl.NumberFormat("id-ID").format(Math.round(n||0));
const fmtShortRp=n=>{const a=Math.abs(n),s=n<0?"-":"";return a>=1e9?s+(a/1e9).toFixed(1).replace(".",",")+" M":a>=1e6?s+(a/1e6).toFixed(a>=1e7?0:1).replace(".",",")+" jt":a>=1e3?s+Math.round(a/1e3)+" rb":s+Math.round(a)};
function svgBars(data,{series,max,fmt=v=>v,h=200,labelEvery=1,ticks=3}){
  // data: [{label, values:[..], title}], series: [{name,color}]
  const W=Math.max(320,data.length>14?data.length*(series.length*9+8)+50:data.length*(series.length*14+12)+50),pad={l:44,r:8,t:12,b:26},ih=h-pad.t-pad.b,iw=W-pad.l-pad.r;
  const mx=max||Math.max(1,...data.flatMap(d=>d.values));
  const gw=iw/data.length,bw=Math.max(5,Math.min(22,(gw-6)/series.length-2));
  let g="";for(let i=0;i<=ticks;i++){const y=pad.t+ih-ih*i/ticks;g+=`<line x1="${pad.l}" x2="${W-pad.r}" y1="${y}" y2="${y}" stroke="#e3e9f3" stroke-width="1"/><text x="${pad.l-6}" y="${y+4}" text-anchor="end" font-size="10" fill="#7a8496">${fmt(mx*i/ticks)}</text>`}
  data.forEach((d,i)=>{const x0=pad.l+gw*i+(gw-(bw+2)*series.length+2)/2;
    d.values.forEach((v,j)=>{const bh=v>0?Math.max(2,ih*v/mx):0,x=x0+j*(bw+2),y=pad.t+ih-bh;
      if(d.hatch&&d.hatch[j])g+=`<rect x="${x}" y="${pad.t+ih-ih*.35}" width="${bw}" height="${ih*.35}" rx="3" fill="url(#hatch)"><title>${esc(d.title||d.label)}: uzur</title></rect>`;
      else if(bh)g+=`<path d="M${x} ${pad.t+ih}V${y+Math.min(4,bh)}a4 4 0 0 1 4-4h${bw-8}a4 4 0 0 1 4 4V${pad.t+ih}z" fill="${series[j].color}"><title>${esc(d.title||d.label)} · ${series[j].name}: ${fmt(v)}</title></path>`});
    if(i%labelEvery===0)g+=`<text x="${pad.l+gw*i+gw/2}" y="${h-8}" text-anchor="middle" font-size="10" fill="#4a5a75">${esc(d.label)}</text>`});
  g+=`<line x1="${pad.l}" x2="${W-pad.r}" y1="${pad.t+ih}" y2="${pad.t+ih}" stroke="#a9bfdd" stroke-width="1.5"/>`;
  const legend=series.length>1?`<div class="clegend">${series.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join("")}</div>`:"";
  return `${legend}<div class="chartbox"><svg viewBox="0 0 ${W} ${h}" width="100%" style="max-width:${W}px;min-width:${Math.min(W,520)}px"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#eef2f8"/><line x1="0" y1="0" x2="0" y2="6" stroke="#a9bfdd" stroke-width="2"/></pattern></defs>${g}</svg></div>`;
}
function svgDonut(parts,{center="",sub="",noLeg=false}={}){
  const tot=parts.reduce((a,p)=>a+p.val,0);if(!tot)return`<div class="empty">Belum ada data.</div>`;
  const R=70,r=44,cx=90,cy=90;let a0=-Math.PI/2,g="";
  for(const p of parts){if(!p.val)continue;const a1=a0+2*Math.PI*p.val/tot,large=a1-a0>Math.PI?1:0,pt=(rr,a)=>`${cx+rr*Math.cos(a)} ${cy+rr*Math.sin(a)}`;
    const d=parts.filter(x=>x.val).length===1?`M${cx} ${cy-R}A${R} ${R} 0 1 1 ${cx-.01} ${cy-R}L${cx-.01} ${cy-r}A${r} ${r} 0 1 0 ${cx} ${cy-r}z`:`M${pt(R,a0)}A${R} ${R} 0 ${large} 1 ${pt(R,a1)}L${pt(r,a1)}A${r} ${r} 0 ${large} 0 ${pt(r,a0)}z`;
    g+=`<path d="${d}" fill="${p.color}" stroke="#fffdf8" stroke-width="2"><title>${esc(p.name)}: ${fmtRp(p.val)} (${Math.round(p.val/tot*100)}%)</title></path>`;a0=a1}
  const leg=parts.filter(p=>p.val).sort((a,b)=>b.val-a.val).map(p=>`<div class="dl"><i style="background:${p.color}"></i><span>${esc(p.name)}</span><b>${fmtRp(p.val)}</b><em>${Math.round(p.val/tot*100)}%</em></div>`).join("");
  return `<div class="donut"><svg viewBox="0 0 180 180" width="180" height="180">${g}<text x="90" y="88" text-anchor="middle" font-size="13" font-weight="800" fill="#24395f">${center}</text><text x="90" y="104" text-anchor="middle" font-size="10" fill="#7a8496">${sub}</text></svg>${noLeg?"":`<div class="dleg">${leg}</div>`}</div>`;
}
function hBars(rows,color="#2a78d6"){const mx=Math.max(1,...rows.map(r=>Math.abs(r.val)));
  return rows.map(r=>`<div class="hb"><span class="hbl">${r.icon||""} ${esc(r.name)}</span><span class="hbt"><i style="width:${Math.max(r.val?1.5:0,Math.abs(r.val)/mx*100)}%;background:${r.val<0?"#d14b4b":color}"></i></span><b class="hbv">${fmtRp(r.val)}</b></div>`).join("")}

/* =================== keuangan =================== */
const ACC=[["cash","Tunai","Tunai","💵"],["bca","BCA","Bank","🏦"],["mandiri","Mandiri","Bank","🏦"],["bjb","BJB","Bank","🏦"],["shopee","ShopeePay","E-wallet","📱"],["ovo","OVO","E-wallet","📱"],["lm","Logam Mulia","Simpanan","🪙"],["haji","Tabungan Haji","Simpanan","🕋"]];
const ACCN=Object.fromEntries(ACC.map(a=>[a[0],a]));
const INC={gaji_saya:"Gaji Saya",gaji_suami:"Gaji Suami",sertifikasi:"Sertifikasi",insentif:"Insentif",lain_in:"Pemasukan Lain"};
const INCOL={gaji_saya:"#2a78d6",gaji_suami:"#eb6834",sertifikasi:"#1baf7a",insentif:"#eda100",lain_in:"#e87ba4"};
const OUTC={nafkah_ortu:["Nafkah Orang Tua","Keluarga"],nafkah_mertua:["Nafkah Mertua","Keluarga"],jajan_anak:["Uang Jajan Anak","Keluarga"],bpjs_ibu:["BPJS Ibu","Keluarga"],
  listrik:["Listrik","Rumah & Utilitas"],gas:["Gas Alam","Rumah & Utilitas"],air:["Air","Rumah & Utilitas"],ipl:["IPL Kares","Rumah & Utilitas"],
  bensin:["Bensin","Kendaraan"],pajak_mobil:["Pajak Mobil","Kendaraan"],servis:["Servis Mobil","Kendaraan"],sedekah:["Sedekah & Infaq","Ibadah & Sosial"],
  harian:["Makan & Belanja","Kebutuhan Harian"],pendidikan:["Kuliah & Pendidikan","Kebutuhan Harian"],beli_emas:["Beli Emas / Logam Mulia","Tabungan & Investasi"],lain_out:["Lainnya","Lainnya"]};
const GROUPS=["Keluarga","Rumah & Utilitas","Kendaraan","Ibadah & Sosial","Kebutuhan Harian","Tabungan & Investasi","Lainnya"];
const GCOL={"Keluarga":"#2a78d6","Rumah & Utilitas":"#eb6834","Kendaraan":"#1baf7a","Ibadah & Sosial":"#eda100","Kebutuhan Harian":"#e87ba4","Tabungan & Investasi":"#8a63d2","Lainnya":"#008300"};
const ROUTINE=["nafkah_ortu","nafkah_mertua","jajan_anak","bpjs_ibu","listrik","gas","air","ipl","sedekah","bensin"];
const QUICK={in:["Gaji saya","Gaji suami","Sertifikasi","Insentif"],out:["Nafkah orang tua","Nafkah mertua","Uang jajan anak","Listrik Pondok Arum","Listrik Kares","Gas Pondok Arum","Gas Kares","Air Pondok Arum","Air Kares","IPL Kares","Sedekah","Bensin","BPJS ibu","Pajak mobil","Servis mobil","Beli emas / logam mulia"],
  move:["Tarik tunai","Top up ShopeePay","Top up OVO","Setor tabungan haji"]};
function classify(t,desc){const d=" "+String(desc||"").toLowerCase()+" ",has=r=>r.test(d);
  if(t==="in"){if(has(/suami/))return"gaji_suami";if(has(/sertifikasi|\btpg\b|tunjangan profesi/))return"sertifikasi";if(has(/insentif|tamsil|honor|tunjangan/))return"insentif";if(has(/gaji|\btpp\b|payroll/))return"gaji_saya";return"lain_in"}
  if(has(/mertua/))return"nafkah_mertua";if(has(/bpjs/))return"bpjs_ibu";if(has(/orang ?tua|\bortu\b|\bibu\b|bapak|mamah|\bmama\b|\bpapa\b|\bayah\b/))return"nafkah_ortu";
  if(has(/jajan|uang saku|\banak\b/))return"jajan_anak";if(has(/listrik|\bpln\b|token/))return"listrik";if(has(/\bgas\b|\bpgn\b/))return"gas";if(has(/\bair\b|pdam|tirta/))return"air";if(has(/\bipl\b|iuran pengelolaan/))return"ipl";
  if(has(/sedekah|infa[qk]|zakat|wakaf|donasi|santunan/))return"sedekah";if(has(/bensin|\bbbm\b|pertalite|pertamax|spbu/))return"bensin";if(has(/pajak|samsat|stnk/))return"pajak_mobil";if(has(/servis|service|bengkel|\boli\b|tune ?up/))return"servis";
  if(has(/\bemas\b|logam mulia|antam|perhiasan|\blm\b/))return"beli_emas";if(has(/\bspp\b|\bukt\b|kuliah|uhamka|\bbuku\b|seminar|makalah/))return"pendidikan";if(has(/makan|belanja|sayur|indomaret|alfamart|pasar|grocer|minimarket|warung|gofood|grabfood/))return"harian";return"lain_out"}
function locOf(desc,cat){const d=String(desc||"").toLowerCase();if(/pondok ?arum|\bpa\b/.test(d))return"Pondok Arum";if(/karawaci|kares/.test(d)||cat==="ipl")return"Karawaci Residence";return""}
const catName=x=>x.t==="in"?INC[x.cat]||"Pemasukan Lain":x.t==="out"?(OUTC[x.cat]||OUTC.lain_out)[0]:"Pindah dana";
let fin=[],finEdit=null,finType="out",finView="bulan",finListT="all";
const numOf=v=>+String(v||"").replace(/[^\d]/g,"")||0;
async function putFin(o){const {id,...b}=o;if(db)await db.doc("fin/"+id).set(b);else{const i=fin.findIndex(x=>x.id===id);if(i>=0)fin[i]=o;else fin.push(o);local.set("fin",fin);refreshAuto()}}
async function delFin(id){if(db)await db.doc("fin/"+id).delete();else{fin=fin.filter(x=>x.id!==id);local.set("fin",fin);refreshAuto()}}
function finOpening(acc){const n=notesCache.keuangan;return numOf(n&&n.f&&n.f["op_"+acc])}
function balances(upto){const b={};ACC.forEach(([k])=>b[k]=k==="lm"?0:finOpening(k));
  for(const x of fin){if(upto&&x.date>upto)continue;if(x.t==="in")b[x.acc]=(b[x.acc]||0)+x.amt;else if(x.t==="out")b[x.acc]=(b[x.acc]||0)-x.amt;else{b[x.acc]=(b[x.acc]||0)-x.amt;b[x.to]=(b[x.to]||0)+x.amt}}b.lm=emasStat().lmVal;return b}
function periodRange(){const d=parseD(cur.d);if(finView==="hari")return[cur.d,cur.d,fmtLong(d)];if(finView==="tahun")return[`${d.getFullYear()}-01-01`,`${d.getFullYear()}-12-31`,`Tahun ${d.getFullYear()}`];
  const y=d.getFullYear(),m=d.getMonth();return[ymd(new Date(y,m,1)),ymd(new Date(y,m+1,0)),`${BULAN[m]} ${y}`]}
function pgKeuangan(){
  const [a,b,label]=periodRange(),d=parseD(cur.d);
  const nav=`<div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:8px;flex-wrap:wrap">
    <div class="seg" style="width:auto"><button type="button" data-fv="hari" class="${finView==="hari"?"on":""}">Harian</button><button type="button" data-fv="bulan" class="${finView==="bulan"?"on":""}">Bulanan</button><button type="button" data-fv="tahun" class="${finView==="tahun"?"on":""}">Tahunan</button></div>
    <button class="navbtn" data-fnav="-1">‹</button><span class="pill">${label}</span><button class="navbtn" data-fnav="1">›</button></div>`;
  const form=`<div class="seg" id="finSeg" style="margin-bottom:10px"><button type="button" data-ft="in">＋ Pemasukan</button><button type="button" data-ft="out">－ Pengeluaran</button><button type="button" data-ft="move">⇄ Pindah dana</button></div>
    <div class="finform">
      <label>Nominal<input id="fAmt" inputmode="numeric" placeholder="Rp 0" autocomplete="off"></label>
      <label>Tanggal<input id="fnDate" type="date" value="${finView==="hari"?cur.d:ymd(new Date())}"></label>
      <label id="fAccL">Akun<select id="fAcc">${ACC.filter(a=>a[0]!=="lm").map(([k,n,g,ic])=>`<option value="${k}">${ic} ${n}</option>`).join("")}</select></label>
      <label id="fToL" style="display:none">Ke akun<select id="fTo">${ACC.filter(a=>a[0]!=="lm").map(([k,n,g,ic])=>`<option value="${k}">${ic} ${n}</option>`).join("")}</select></label>
      <label class="wide">Keterangan<input id="fDesc" placeholder="mis. token listrik Pondok Arum" autocomplete="off"></label>
    </div>
    <div id="fQuick" class="fquick"></div>
    <div class="fcat"><span id="fAuto"></span><select id="fnCat"></select></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button type="button" class="tb" id="fDel" style="display:none;color:#a3281d">Hapus</button><button type="button" class="tb" id="fCancel" style="display:none">Batal ubah</button><button type="button" class="tb primary" id="fSave">Simpan</button></div>`;
  const tiles=()=>{const L=fin.filter(x=>x.date>=a&&x.date<=b),inn=L.filter(x=>x.t==="in").reduce((s,x)=>s+x.amt,0),out=L.filter(x=>x.t==="out").reduce((s,x)=>s+x.amt,0),bal=balances(b),tot=Object.values(bal).reduce((s,v)=>s+v,0);
    return `<div class="ftiles"><div class="ft"><small>Pemasukan</small><b style="color:#1d5fae">${fmtRp(inn)}</b></div><div class="ft"><small>Pengeluaran</small><b style="color:#b8501f">${fmtRp(out)}</b></div>
      <div class="ft"><small>${inn-out>=0?"Surplus":"Defisit"}</small><b>${fmtRp(inn-out)}</b></div><div class="ft"><small>Total uang & simpanan</small><b>${fmtRp(tot)}</b></div></div>`};
  const posisi=()=>{const bal=balances(b),grp=["Tunai","Bank","E-wallet","Simpanan"];
    return grp.map(g=>{const rows=ACC.filter(x=>x[2]===g).map(([k,n,gg,ic])=>({name:k==="lm"?`${n} (${fmtG(emasStat().lmG)} g)`:n,icon:ic,val:bal[k]||0}));const sum=rows.reduce((s,r)=>s+r.val,0);
      return `<div class="fgrp"><div class="fgh">${g}<b>${fmtRp(sum)}</b></div>${hBars(rows,g==="Simpanan"?"#eda100":"#2a78d6")}</div>`}).join("")+
      `<div class="mt" style="font-size:12px;margin-top:6px">Posisi per ${fmtLong(parseD(b>ymd(new Date())?ymd(new Date()):b))}. Saldo awal tiap akun diisi di bagian “Saldo awal” di bawah.</div>`};
  const chartYear=()=>{const y=d.getFullYear(),rows=[];for(let m=0;m<12;m++){const s=ymd(new Date(y,m,1)),e=ymd(new Date(y,m+1,0)),L=fin.filter(x=>x.date>=s&&x.date<=e);
      rows.push({label:BULAN[m].slice(0,3),title:`${BULAN[m]} ${y}`,values:[L.filter(x=>x.t==="in").reduce((q,x)=>q+x.amt,0),L.filter(x=>x.t==="out").reduce((q,x)=>q+x.amt,0)]})}
    return svgBars(rows,{series:[{name:"Pemasukan",color:"#2a78d6"},{name:"Pengeluaran",color:"#eb6834"}],fmt:fmtShortRp})};
  const outDonut=(a,b)=>{const L=fin.filter(x=>x.t==="out"&&x.date>=a&&x.date<=b),by={};L.forEach(x=>{const g=(OUTC[x.cat]||OUTC.lain_out)[1];by[g]=(by[g]||0)+x.amt});const tot=L.reduce((s,x)=>s+x.amt,0);
    return svgDonut(GROUPS.map(g=>({name:g,val:by[g]||0,color:GCOL[g]})),{center:fmtShortRp(tot),sub:"pengeluaran"})};
  const inDonut=(a,b)=>{const L=fin.filter(x=>x.t==="in"&&x.date>=a&&x.date<=b),by={};L.forEach(x=>{by[x.cat]=(by[x.cat]||0)+x.amt});const tot=L.reduce((s,x)=>s+x.amt,0);
    return svgDonut(Object.keys(INC).map(k=>({name:INC[k],val:by[k]||0,color:INCOL[k]})),{center:fmtShortRp(tot),sub:"pemasukan"})};
  const catTable=(a,b)=>{const L=fin.filter(x=>x.t==="out"&&x.date>=a&&x.date<=b),tot=L.reduce((s,x)=>s+x.amt,0);if(!L.length)return`<div class="empty">Belum ada pengeluaran.</div>`;
    let h=`<table class="tbl ftbl"><tr><th>Kelompok</th><th>Kategori</th><th>Jumlah</th><th>%</th></tr>`;
    for(const g of GROUPS){const cats=Object.entries(OUTC).filter(([k,v])=>v[1]===g).map(([k,v])=>[k,v[0],L.filter(x=>x.cat===k).reduce((s,x)=>s+x.amt,0)]).filter(c=>c[2]);if(!cats.length)continue;
      cats.forEach((c,i)=>h+=`<tr>${i===0?`<td rowspan="${cats.length}"><i class="sq" style="background:${GCOL[g]}"></i>${g}</td>`:""}<td>${c[1]}</td><td class="r">${fmtRp(c[2])}</td><td class="r">${Math.round(c[2]/tot*100)}%</td></tr>`)}
    return h+`<tr><td colspan="2"><b>Total</b></td><td class="r"><b>${fmtRp(tot)}</b></td><td class="r">100%</td></tr></table>`};
  const rutin=()=>{const m0=ymd(new Date(d.getFullYear(),d.getMonth(),1)),m1=ymd(new Date(d.getFullYear(),d.getMonth()+1,0));
    const rows=ROUTINE.map(k=>{const L=fin.filter(x=>x.t==="out"&&x.cat===k&&x.date>=m0&&x.date<=m1),s=L.reduce((q,x)=>q+x.amt,0);return `<div class="frt ${L.length?"ok":""}"><span>${L.length?"✅":"⬜"}</span><span>${OUTC[k][0]}</span><b>${L.length?fmtRp(s):"belum"}</b></div>`}).join("");
    const yearly=["pajak_mobil","servis"].map(k=>{const L=fin.filter(x=>x.t==="out"&&x.cat===k).sort((p,q)=>q.date.localeCompare(p.date)),last=L[0];
      const due=last?ymd(addDays(parseD(last.date),365)):"";return `<div class="frt ${last?"ok":""}"><span>📅</span><span>${OUTC[k][0]}</span><b>${last?`terakhir ${fmtShort(parseD(last.date))} · berikutnya ±${fmtShort(parseD(due))}`:"belum tercatat"}</b></div>`}).join("");
    return `<div class="mt" style="margin-bottom:4px">${BULAN[d.getMonth()]} ${d.getFullYear()}</div>${rows}<div class="mt" style="margin:8px 0 4px">Tahunan</div>${yearly}`};
  const rumah=(a,b)=>{const L=fin.filter(x=>x.t==="out"&&["listrik","gas","air","ipl"].includes(x.cat)&&x.date>=a&&x.date<=b);if(!L.length)return`<div class="empty">Belum ada tagihan rumah.</div>`;
    const H=["Pondok Arum","Karawaci Residence","Belum ditandai"],C=["listrik","gas","air","ipl"];
    const val=(h,c)=>L.filter(x=>(locOf(x.desc,x.cat)||"Belum ditandai")===h&&x.cat===c).reduce((s,x)=>s+x.amt,0);
    return `<table class="tbl ftbl"><tr><th>Rumah</th>${C.map(c=>`<th>${OUTC[c][0]}</th>`).join("")}<th>Total</th></tr>${H.map(h=>{const v=C.map(c=>val(h,c)),t=v.reduce((p,q)=>p+q,0);return t?`<tr><td>${h}</td>${v.map(x=>`<td class="r">${x?fmtShortRp(x):"–"}</td>`).join("")}<td class="r"><b>${fmtShortRp(t)}</b></td></tr>`:""}).join("")}</table>
      <div class="mt" style="font-size:12px;margin-top:4px">Sebut “Pondok Arum/PA” atau “Kares/Karawaci” di keterangan supaya tagihan masuk ke rumah yang tepat.</div>`};
  const list=()=>{const F=finListT,L0=fin.filter(x=>x.date>=a&&x.date<=b),L=L0.filter(x=>F==="all"||x.t===F).sort((p,q)=>q.date.localeCompare(p.date)||(q.createdAt||"").localeCompare(p.createdAt||""));const cnt=t=>L0.filter(x=>t==="all"||x.t===t).length,seg=`<div class="seg fltseg" style="width:auto;margin-bottom:8px">${[["all","Semua"],["in","＋ Pemasukan"],["out","－ Pengeluaran"],["move","⇄ Pindah dana"]].map(([k,n])=>`<button type="button" data-flt="${k}" class="${F===k?"on":""}">${n} (${cnt(k)})</button>`).join("")}</div>`;
    if(!L.length)return seg+`<div class="empty">Belum ada transaksi${F==="in"?" pemasukan":F==="out"?" pengeluaran":F==="move"?" pindah dana":""} di periode ini.</div>`;
    return seg+L.slice(0,200).map(x=>`<div class="ftx" data-fid="${x.id}"><span class="fd">${fmtShort(parseD(x.date))}</span><span class="fn"><b>${esc(x.desc||catName(x))}</b><small>${catName(x)}${x.t==="move"?` · ${ACCN[x.acc][1]} → ${ACCN[x.to][1]}`:` · ${ACCN[x.acc]?ACCN[x.acc][1]:x.acc}`}${locOf(x.desc,x.cat)?" · "+locOf(x.desc,x.cat):""}</small></span><b class="fa ${x.t}">${x.t==="in"?"+":x.t==="out"?"−":"⇄"} ${fmtRp(x.amt)}</b><span class="rowact"><button type="button" data-fedit="${x.id}">✏️ Ubah</button><button type="button" data-fdel="${x.id}">🗑️ Hapus</button></span></div>`).join("")+`<div class="mt" style="font-size:12px;margin-top:6px">Ketuk ✏️ Ubah untuk mengedit di form Catat Transaksi. Hapus perlu diketuk dua kali; bisa dibatalkan dengan ↶ Undo.</div>`};
  const harian=()=>{const y=d.getFullYear(),m=d.getMonth(),n=new Date(y,m+1,0).getDate(),today=ymd(new Date()),rows=[],tbl=[];
    for(let i=1;i<=n;i++){const ds=ymd(new Date(y,m,i)),L=fin.filter(x=>x.date===ds),inn=L.filter(x=>x.t==="in").reduce((q,x)=>q+x.amt,0),out=L.filter(x=>x.t==="out").reduce((q,x)=>q+x.amt,0);
      rows.push({label:String(i),title:fmtLong(parseD(ds)),values:[inn,out]});
      if(L.length){const bal=balances(ds),tot=Object.values(bal).reduce((q,v)=>q+v,0);tbl.push(`<tr data-fday="${ds}" class="${ds===cur.d&&finView==="hari"?"sel":""}"><td>${HARI[parseD(ds).getDay()].slice(0,3)}, ${i}</td><td class="r" style="color:#1d5fae">${inn?fmtRp(inn):"–"}</td><td class="r" style="color:#b8501f">${out?fmtRp(out):"–"}</td><td class="r">${fmtRp(inn-out)}</td><td class="r">${L.length}</td><td class="r"><b>${fmtRp(tot)}</b></td></tr>`)}}
    return `<div class="mt" style="font-size:12px">${BULAN[m]} ${y} · pemasukan & pengeluaran per hari (arahkan ke batang untuk detail)</div>`+svgBars(rows,{series:[{name:"Pemasukan",color:"#2a78d6"},{name:"Pengeluaran",color:"#eb6834"}],fmt:fmtShortRp,labelEvery:2,h:190})+
      (tbl.length?`<table class="tbl ftbl fdays" style="margin-top:8px"><tr><th>Tanggal</th><th>Pemasukan</th><th>Pengeluaran</th><th>Selisih</th><th>Transaksi</th><th>Total uang akhir hari</th></tr>${tbl.join("")}</table><div class="mt" style="font-size:12px;margin-top:4px">Klik baris untuk membuka laporan hari itu.</div>`:`<div class="empty">Belum ada transaksi bulan ini.</div>`)};
  const opening=`<div class="fopen">${ACC.map(([k,n,g,ic])=>k==="lm"?`<label>${ic} ${n} (gram)${inp("op_lm","0 gram","text-align:right")}</label>`:`<label>${ic} ${n}${inp("op_"+k,"Rp 0","text-align:right")}</label>`).join("")}</div>
    <div class="mt" style="font-size:12px;margin-top:6px">Isi saldo saat mulai mencatat (sekali saja). Logam Mulia diisi dalam <b>gram</b> (yang sudah dimiliki saat mulai mencatat); nilai rupiahnya dihitung otomatis dari harga emas. Pembelian berikutnya dicatat di kotak 🪙 Emas.</div>`;
  const [m0,m1]=[ymd(new Date(d.getFullYear(),d.getMonth(),1)),ymd(new Date(d.getFullYear(),d.getMonth()+1,0))],[y0,y1]=[`${d.getFullYear()}-01-01`,`${d.getFullYear()}-12-31`],mLbl=`${BULAN[d.getMonth()]} ${d.getFullYear()}`,yLbl=`Tahun ${d.getFullYear()}`;
  const sec=(n,t,sub)=>`<div class="fsec"><span class="fsn">${n}</span><b>${t}</b>${sub?`<small>${sub}</small>`:""}</div>`;
  const dayRk=()=>{const ds=cur.d,L=fin.filter(x=>x.date===ds),inn=L.filter(x=>x.t==="in").reduce((q,x)=>q+x.amt,0),out=L.filter(x=>x.t==="out").reduce((q,x)=>q+x.amt,0),tot=Object.values(balances(ds)).reduce((q,v)=>q+v,0);
    return `<div class="ftiles"><div class="ft"><small>Pemasukan</small><b style="color:#1d5fae">${fmtRp(inn)}</b></div><div class="ft"><small>Pengeluaran</small><b style="color:#b8501f">${fmtRp(out)}</b></div><div class="ft"><small>${inn-out>=0?"Surplus":"Defisit"}</small><b>${fmtRp(inn-out)}</b></div><div class="ft"><small>Total uang akhir hari</small><b>${fmtRp(tot)}</b></div></div>`+
      (L.length?L.map(x=>`<div class="ftx" data-fid="${x.id}"><span class="fd">${x.t==="in"?"＋":x.t==="out"?"－":"⇄"}</span><span class="fn"><b>${esc(x.desc||catName(x))}</b><small>${catName(x)}</small></span><b class="fa ${x.t}">${fmtRp(x.amt)}</b><span class="rowact"><button type="button" data-fedit="${x.id}">✏️ Ubah</button><button type="button" data-fdel="${x.id}">🗑️ Hapus</button></span></div>`).join(""):`<div class="empty">Belum ada transaksi pada ${fmtLong(parseD(ds))}.</div>`)};
  return header("Keuangan","Catat pemasukan & pengeluaran, laporannya dikelompokkan otomatis.",nav)+
    box("Ringkasan "+label,auto("ftiles",tiles))+
    box("Catat Transaksi",form,"sky")+box("📋 Daftar Pemasukan & Pengeluaran · "+label,auto("flist",list))+
    sec("1","Rekap Harian",fmtLong(parseD(cur.d)))+
    box("☀️ Hari "+fmtLong(parseD(cur.d)),auto("fday",dayRk))+
    box("📅 Laporan Harian "+mLbl,auto("fharian",harian))+
    sec("2","Rekap Bulanan",mLbl)+
    `<div class="cols c2">${box("Pengeluaran per Kelompok",auto("fdout",()=>outDonut(m0,m1)))}${box("Pemasukan per Sumber",auto("fdin",()=>inDonut(m0,m1)))}</div>`+
    box("Rincian Pengeluaran "+mLbl,auto("fcat",()=>catTable(m0,m1)))+
    `<div class="cols c2">${box("✅ Pengeluaran Rutin",auto("frut",rutin),"note")}${box("🏠 Tagihan Rumah",auto("frumah",()=>rumah(m0,m1)))}</div>`+
    sec("3","Rekap Tahunan",yLbl)+
    box(`Pemasukan vs Pengeluaran ${d.getFullYear()}`,auto("fyear",chartYear))+
    `<div class="cols c2">${box("Pengeluaran per Kelompok "+d.getFullYear(),auto("fdouty",()=>outDonut(y0,y1)))}${box("Pemasukan per Sumber "+d.getFullYear(),auto("fdiny",()=>inDonut(y0,y1)))}</div>`+
    box("Rincian Pengeluaran "+yLbl,auto("fcaty",()=>catTable(y0,y1)))+
    sec("4","Total Aset yang Dimiliki","uang, simpanan, emas & aset")+
    box("💼 Posisi Uang",auto("fpos",posisi))+
    box("🪙 Emas: Logam Mulia & Perhiasan",auto("femas",emasView)+emasForm(),"note")+box("🏛️ Rekap Total Aset",auto("faset",asetRekap))+box("＋ Catat Aset Bergerak & Tidak Bergerak",asetForm(),"sky")+
    box("🕌 Potensi Zakat Mal",auto("fzakat",zakatView)+zakatSettings(),"note")+box("Saldo Awal",opening,"note");
}
function finSetup(){
  const seg=$("#finSeg");if(!seg)return;
  const setT=t=>{finType=t;seg.querySelectorAll("[data-ft]").forEach(b=>b.classList.toggle("on",b.dataset.ft===t));$("#fToL").style.display=t==="move"?"":"none";$("#fAccL").firstChild.textContent=t==="move"?"Dari akun":"Akun";
    $("#fQuick").innerHTML=QUICK[t].map(q=>`<button type="button" data-fq="${q}">${q}</button>`).join("");
    $("#fnCat").style.display=t==="move"?"none":"";$("#fnCat").innerHTML=`<option value="">Kategori otomatis</option>`+(t==="in"?Object.entries(INC).map(([k,v])=>`<option value="${k}">${v}</option>`):Object.entries(OUTC).map(([k,v])=>`<option value="${k}">${v[0]} (${v[1]})</option>`)).join("");updAuto()};
  const updAuto=()=>{if(finType==="move"){$("#fAuto").textContent="";return}const c=classify(finType,$("#fDesc").value),loc=locOf($("#fDesc").value,c);
    $("#fAuto").innerHTML=`🏷️ Otomatis: <b>${finType==="in"?INC[c]:OUTC[c][0]+" · "+OUTC[c][1]}</b>${loc?" · "+loc:""}`};
  seg.onclick=e=>{const b=e.target.closest("[data-ft]");if(b)setT(b.dataset.ft)};
  $("#fQuick").onclick=e=>{const b=e.target.closest("[data-fq]");if(!b)return;$("#fDesc").value=b.dataset.fq;
    const q=b.dataset.fq.toLowerCase();if(finType==="move"){if(q.includes("tarik"))$("#fTo").value="cash";if(q.includes("shopee"))$("#fTo").value="shopee";if(q.includes("ovo"))$("#fTo").value="ovo";if(q.includes("haji"))$("#fTo").value="haji"}
    updAuto();$("#fAmt").focus()};
  $("#fDesc").oninput=updAuto;
  $("#fAmt").oninput=e=>{const n=numOf(e.target.value);e.target.value=n?new Intl.NumberFormat("id-ID").format(n):""};
  try{const la=localStorage.getItem(LSK+"facc");if(la&&ACCN[la])$("#fAcc").value=la}catch(e){}
  const reset=()=>{finEdit=null;$("#fAmt").value="";$("#fDesc").value="";$("#fnCat").value="";$("#fDel").style.display="none";$("#fCancel").style.display="none";$("#fSave").textContent="Simpan";updAuto()};
  $("#fSave").onclick=async()=>{
    const amt=numOf($("#fAmt").value);if(!amt){toast("Isi nominalnya dulu.");$("#fAmt").focus();return}
    const now=new Date().toISOString(),desc=$("#fDesc").value.trim();
    const o={id:finEdit?finEdit.id:uid(),t:finType,amt,date:$("#fnDate").value||ymd(new Date()),acc:$("#fAcc").value,desc,createdAt:finEdit?finEdit.createdAt:now,updatedAt:now};
    if(finType==="move"){o.to=$("#fTo").value;if(o.to===o.acc){toast("Akun asal dan tujuan sama.");return}}
    else{o.cat=$("#fnCat").value||classify(finType,desc);o.manual=!!$("#fnCat").value}
    const old=finEdit?{...finEdit}:null;
    try{await putFin(o);pushUndo({label:(old?"ubah ":"catat ")+(desc||catName(o)),page:{...cur},undo:()=>old?putFin(old):delFin(o.id),redo:()=>putFin(o)});
      try{localStorage.setItem(LSK+"facc",o.acc)}catch(e){}toast(`💾 ${o.t==="in"?"Pemasukan":o.t==="out"?"Pengeluaran":"Pindah dana"} ${fmtRp(amt)} tersimpan${o.t!=="move"?" · "+catName(o):""}.`);reset()}catch(x){err(x)}};
  $("#fCancel").onclick=reset;
  $("#fDel").onclick=async()=>{const b=$("#fDel");if(!finEdit)return;if(b.dataset.c!=="1"){b.dataset.c="1";b.textContent="Yakin hapus?";setTimeout(()=>{b.dataset.c="";b.textContent="Hapus"},3000);return}
    const old={...finEdit};try{await delFin(old.id);pushUndo({label:"hapus transaksi",page:{...cur},undo:()=>putFin(old),redo:()=>delFin(old.id)});toast("Transaksi dihapus. ↶ Undo untuk mengembalikan.");reset()}catch(x){err(x)}};
  window.__finEditStart=x=>{finEdit=x;setT(x.t);$("#fAmt").value=new Intl.NumberFormat("id-ID").format(x.amt);$("#fnDate").value=x.date;$("#fAcc").value=x.acc;if(x.to)$("#fTo").value=x.to;$("#fDesc").value=x.desc||"";$("#fnCat").value=x.manual?x.cat:"";
    $("#fDel").style.display="";$("#fCancel").style.display="";$("#fSave").textContent="Simpan perubahan";updAuto();$("#finSeg").scrollIntoView({behavior:"smooth",block:"center"})};
  setT(finEdit?finEdit.t:finType);if(finEdit)window.__finEditStart(finEdit);
}

/* =================== sampul tiap tab =================== */
const DS='fill="none" stroke="#24395f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const CVD={
  yearCal:`<svg width="110" height="110" viewBox="0 0 100 100" ${DS}><rect x="12" y="18" width="76" height="70" rx="8" fill="#fffdf8"/><path d="M12 34h76"/><rect x="12" y="18" width="76" height="16" rx="8" fill="#8aa6c8"/><path d="M30 12v12M70 12v12"/>${[0,1,2].map(r=>[0,1,2,3].map(c=>`<rect x="${20+c*16}" y="${42+r*14}" width="10" height="8" rx="2" fill="${(r*4+c)%5===2?"#f2a7b6":"#e8edf4"}"/>`).join("")).join("")}</svg>`,
  monthCal:`<svg width="110" height="110" viewBox="0 0 100 100" ${DS}><rect x="14" y="20" width="72" height="66" rx="8" fill="#fffdf8"/><path d="M14 38h72"/><rect x="14" y="20" width="72" height="18" rx="8" fill="#9db8a3"/><circle cx="30" cy="20" r="4" fill="#e8edf4"/><circle cx="70" cy="20" r="4" fill="#e8edf4"/><path d="M26 50h4M40 50h4M54 50h4M68 50h4M26 62h4M40 62h4M68 62h4M26 74h4M40 74h4M54 74h4"/><path d="M56 66c-3-4-9-1-6 3l6 5 6-5c3-4-3-7-6-3z" fill="#f2a7b6" stroke-width="2.4"/></svg>`,
  weekList:`<svg width="104" height="110" viewBox="0 0 100 106" ${DS}><rect x="18" y="10" width="64" height="88" rx="6" fill="#fffdf8"/><rect x="36" y="4" width="28" height="12" rx="4" fill="#e3b9b4"/>${[0,1,2,3,4].map(i=>`<rect x="28" y="${26+i*14}" width="9" height="9" rx="2" fill="${i<3?"#9db8a3":"#fff"}"/>${i<3?`<path d="M30 ${31+i*14}l2 2 4-5" stroke-width="2.2"/>`:""}<path d="M44 ${30+i*14}h28"/>`).join("")}</svg>`,
  sun:`<svg width="110" height="110" viewBox="0 0 100 100" ${DS}><circle cx="44" cy="44" r="18" fill="#f6d27a"/><path d="M44 14v-8M44 82v-8M14 44H6M82 44h-8M23 23l-6-6M71 71l-6-6M65 23l6-6M17 71l6-6"/><circle cx="38" cy="42" r="2" fill="#24395f"/><circle cx="50" cy="42" r="2" fill="#24395f"/><path d="M39 50c3 3 7 3 10 0"/><path d="M58 86c-8 0-12-5-10-10 1-5 7-7 11-5 2-6 10-8 15-4 5-1 10 3 9 9 4 2 3 10-3 10z" fill="#fff"/></svg>`,
  clock:`<svg width="110" height="110" viewBox="0 0 100 100" ${DS}><circle cx="50" cy="52" r="30" fill="#fffdf8"/><path d="M50 34v18l12 8"/><path d="M50 52h0" stroke-width="6"/><path d="M84 30a40 40 0 0 0-30-18" /><path d="M54 6l0 7 7 0" /><path d="M16 74a40 40 0 0 0 30 18"/><path d="M46 98v-7h-7"/><path d="M50 24v4M50 76v4M22 52h4M74 52h4"/></svg>`,
  clipboard:`<svg width="104" height="112" viewBox="0 0 100 108" ${DS}><rect x="16" y="14" width="68" height="88" rx="8" fill="#b6a3cc"/><rect x="24" y="24" width="52" height="70" rx="4" fill="#fffdf8"/><rect x="36" y="8" width="28" height="14" rx="5" fill="#e8edf4"/><path d="M32 40l3 3 6-6M46 40h22M32 56l3 3 6-6M46 56h22M32 72l3 3 6-6M46 72h16"/></svg>`,
  school:`<svg width="120" height="104" viewBox="0 0 110 96" ${DS}><path d="M10 88h90"/><rect x="18" y="44" width="74" height="44" fill="#fffdf8"/><path d="M12 46l43-24 43 24" fill="#e3b9b4"/><rect x="47" y="64" width="16" height="24" fill="#8aa6c8"/><rect x="26" y="54" width="12" height="10" fill="#e8edf4"/><rect x="72" y="54" width="12" height="10" fill="#e8edf4"/><path d="M55 22V4"/><path d="M55 4h16l-4 5 4 5H55" fill="#f2a7b6"/></svg>`,
  flask:`<svg width="104" height="112" viewBox="0 0 100 108" ${DS}><path d="M40 10h20M44 10v28L20 88c-3 6 1 12 8 12h44c7 0 11-6 8-12L56 38V10" fill="#fffdf8"/><path d="M30 70h40l10 18c3 6-1 12-8 12H28c-7 0-11-6-8-12z" fill="#9cc5ab"/><circle cx="44" cy="80" r="4" fill="#fff"/><circle cx="58" cy="88" r="3" fill="#fff"/><circle cx="52" cy="58" r="3"/><circle cx="60" cy="48" r="2"/></svg>`,
  atom:`<svg width="104" height="104" viewBox="0 0 100 100" ${DS}><ellipse cx="50" cy="50" rx="40" ry="15"/><ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(120 50 50)"/><circle cx="50" cy="50" r="7" fill="#f2a7b6"/><circle cx="90" cy="50" r="4" fill="#8aa6c8"/></svg>`,
  grad:`<svg width="112" height="104" viewBox="0 0 110 100" ${DS}><path d="M8 38l47-20 47 20-47 20z" fill="#24395f"/><path d="M28 47v20c0 8 54 8 54 0V47" fill="#8aa6c8"/><path d="M92 42v26"/><circle cx="92" cy="72" r="4" fill="#e6c88a"/><path d="M20 92h70" /><rect x="26" y="80" width="58" height="10" rx="2" fill="#e3b9b4"/></svg>`,
  dumbbell:`<svg width="120" height="80" viewBox="0 0 120 80" ${DS}><path d="M34 40h52" stroke-width="6"/><rect x="14" y="20" width="12" height="40" rx="4" fill="#eb9a62"/><rect x="26" y="26" width="10" height="28" rx="3" fill="#f3c19b"/><rect x="94" y="20" width="12" height="40" rx="4" fill="#eb9a62"/><rect x="84" y="26" width="10" height="28" rx="3" fill="#f3c19b"/></svg>`,
  music:`<svg width="96" height="104" viewBox="0 0 90 100" ${DS}><path d="M34 70V22l40-10v48"/><ellipse cx="26" cy="72" rx="10" ry="8" fill="#e3b9b4"/><ellipse cx="66" cy="62" rx="10" ry="8" fill="#e3b9b4"/><path d="M34 34l40-10"/><path d="M12 30l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fff" stroke-width="2.4"/></svg>`,
  sneaker:`<svg width="120" height="80" viewBox="0 0 120 80" ${DS}><path d="M10 58c0-14 4-30 14-34l14 6c8 10 20 14 36 16 18 2 32 6 34 18v6H10z" fill="#fffdf8"/><path d="M10 58h98" /><path d="M10 64h98" stroke="#eb9a62" stroke-width="6"/><path d="M42 34l-6 8M52 38l-6 8M62 41l-5 8"/></svg>`,
  moon:`<svg width="104" height="104" viewBox="0 0 100 100" ${DS}><path d="M64 14a36 36 0 1 0 22 58A30 30 0 1 1 64 14z" fill="#e6c88a"/><path d="M78 22l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff"/></svg>`,
  rehal:`<svg width="120" height="96" viewBox="0 0 120 96" ${DS}><path d="M60 40L22 22v40l38 18 38-18V22z" fill="#9db8a3"/><path d="M60 40v40"/><path d="M28 30l28 13M28 40l28 13M64 43l28-13M64 53l28-13" stroke-width="2.2"/><path d="M30 70L14 90M90 70l16 20M44 76l-8 14M76 76l8 14"/></svg>`,
  lantern:`<svg width="80" height="112" viewBox="0 0 80 112" ${DS}><path d="M40 4v10"/><path d="M28 14h24l-4 10H32z" fill="#e6c88a"/><path d="M26 24h28c6 14 6 46 0 60H26c-6-14-6-46 0-60z" fill="#fffdf8"/><path d="M40 40c-6 8-6 18 0 24 6-6 6-16 0-24z" fill="#f6d27a"/><path d="M28 84h24l-4 10H32z" fill="#e6c88a"/><path d="M40 94v10"/></svg>`,
  wallet:`<svg width="116" height="96" viewBox="0 0 116 96" ${DS}><rect x="10" y="26" width="84" height="58" rx="10" fill="#9cc5ab"/><path d="M20 26l50-16 8 16"/><rect x="66" y="44" width="38" height="22" rx="6" fill="#fffdf8"/><circle cx="78" cy="55" r="4" fill="#24395f"/></svg>`,
  coins:`<svg width="104" height="104" viewBox="0 0 100 100" ${DS}><ellipse cx="40" cy="78" rx="26" ry="9" fill="#e6c88a"/><path d="M14 78v-10c0 5 12 9 26 9s26-4 26-9v10"/><ellipse cx="40" cy="64" rx="26" ry="9" fill="#f6d27a"/><path d="M14 64v-10c0 5 12 9 26 9s26-4 26-9v10"/><ellipse cx="40" cy="50" rx="26" ry="9" fill="#e6c88a"/><path d="M72 40l10-14 10 8 6-16" /><path d="M92 18h6v6"/></svg>`,
  pencil:`<svg width="116" height="96" viewBox="0 0 116 96" ${DS}><path d="M20 76L76 20l14 14-56 56H20z" fill="#f6d27a"/><path d="M68 28l14 14"/><path d="M76 20l6-6c3-3 8-3 11 0l3 3c3 3 3 8 0 11l-6 6" fill="#f2a7b6"/><path d="M20 76l14 14" /><path d="M20 90l6-6"/></svg>`,
  note:`<svg width="104" height="110" viewBox="0 0 100 106" ${DS}><rect x="18" y="14" width="66" height="84" rx="6" fill="#fffdf8"/><rect x="34" y="8" width="34" height="12" fill="#e3b9b4" opacity=".9" transform="rotate(-4 50 14)"/><path d="M28 36h46M28 50h46M28 64h46M28 78h30"/></svg>`,
  book:`<svg width="112" height="96" viewBox="0 0 110 96" ${DS}><path d="M55 22C40 12 22 12 8 16v62c14-4 32-4 47 6 15-10 33-10 47-6V16C88 12 70 12 55 22z" fill="#fffdf8"/><path d="M55 22v62"/><path d="M18 30c10-2 20-1 28 3M18 44c10-2 20-1 28 3M64 33c8-4 18-5 28-3M64 47c8-4 18-5 28-3"/><path d="M78 14v24l6-5 6 5V14" fill="#f2a7b6"/></svg>`
};
const APPCOVER={teacher:{k:"Teacher Dev · IPA Kelas IX",t:"Teacher Dev",q:"Absensi, nilai, agenda mengajar, modul & kalender akademik",b:["#8cc7c0","#9cc5ab"],l:"flask",r:"book"},
  wkapp:{k:"Wakil Kepala Sekolah Bidang Kurikulum",t:"Sistem Kurikulum",q:"Data siswa & guru, pembagian tugas, jadwal, supervisi, rapor",b:["#b6a3cc","#8aa6c8"],l:"clipboard",r:"school"}};
function renderAppCover(){const box=$("#appCover");if(!box)return;const C=APPCOVER[cur.p];let hid=false;try{hid=localStorage.getItem(LSK+"appcv-"+cur.p)==="1"}catch(e){}
  if(!C){box.innerHTML="";return}
  if(hid){box.innerHTML=`<button class="acv-show" data-acv="show">🖼️ Tampilkan sampul</button>`;return}
  box.innerHTML=`<div class="acv" style="--ac:${PAGES[cur.p].tab}"><svg width="0" height="0" style="position:absolute"><filter id="wc2b"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter></svg>
    ${deco(BLOB(200,120,C.b[0],BLOBS[0]).replace("url(#wc)","url(#wc2b)"),"left:-8px;top:-8px")}${deco(BLOB(200,120,C.b[1],BLOBS[3]).replace("url(#wc)","url(#wc2b)"),"right:-8px;bottom:-8px")}
    <div class="acd l">${CVD[C.l]}</div><div class="acd r">${CVD[C.r]}</div><div class="acx"><span class="pck">${C.k}</span><b>${C.t}</b><small>${C.q}</small></div>
    <button class="acv-hide" data-acv="hide" title="Sembunyikan sampul">✕</button></div>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-acv]");if(!b)return;try{localStorage.setItem(LSK+"appcv-"+cur.p,b.dataset.acv==="hide"?"1":"0")}catch(x){}renderAppCover();sizeApp()});
const COVER={
  index:{k:"Planner Devy",b:["#8aa6c8","#e3b9b4"],l:"book",r:"pencil"},
  yearly:{k:"Rencana Setahun",b:["#8aa6c8","#9db8a3"],l:"yearCal",r:"grad"},
  monthly:{k:"Rencana Bulanan",b:["#9db8a3","#e3b9b4"],l:"monthCal",r:"note"},
  weekly:{k:"Rencana Mingguan",b:["#e3b9b4","#8aa6c8"],l:"weekList",r:"pencil"},
  daily:{k:"Halaman Harian",b:["#f1d79a","#8aa6c8"],l:"sun",r:"weekList"},
  rutin:{k:"Jadwal Tetap",b:["#8aa6c8","#d5b48a"],l:"clock",r:"monthCal"},
  wakasek:{k:"Wakil Kepala Sekolah Bidang Kurikulum",b:["#b6a3cc","#e3b9b4"],l:"clipboard",r:"school"},
  ipa:{k:"Guru IPA · Kelas IX",b:["#9cc5ab","#8aa6c8"],l:"flask",r:"atom"},
  s2:{k:"Magister Administrasi Pendidikan · UHAMKA",b:["#8aa6c8","#b6a3cc"],l:"grad",r:"book"},
  olahraga:{k:"Gym bersama PT · Kelas Zumba",b:["#f3c19b","#e3b9b4"],l:"dumbbell",r:"music"},
  ibadah:{k:"Istiqamah walau sedikit",b:["#e6c88a","#9db8a3"],l:"moon",r:"rehal"},
  keuangan:{k:"Keuangan Keluarga",b:["#9cc5ab","#e6c88a"],l:"wallet",r:"coins"},
  catatan:{k:"Catatan & Ide",b:["#e3b9b4","#b6a3cc"],l:"note",r:"pencil"}
};
function coverHead(title,quote,extra,C){
  const tab=PAGES[cur.p]&&PAGES[cur.p].tab||"#24395f";
  return `<div class="head pcv"><div class="pcover" style="--ac:${tab}"><svg width="0" height="0" style="position:absolute"><filter id="wc"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter></svg>
      ${deco(BLOB(220,170,C.b[0],BLOBS[0]),"left:-8px;top:-8px")}${deco(BLOB(220,170,C.b[1],BLOBS[3]),"right:-8px;bottom:-8px")}
      <div class="pcd l">${CVD[C.l]||""}</div><div class="pcd r">${CVD[C.r]||""}</div>
      ${deco(DOOD.spark(18),"left:132px;bottom:18px")}${deco(DOOD.heart(22),"right:134px;bottom:16px;transform:rotate(12deg)")}
      <div class="pck">${C.k}</div><h1>${title}</h1><svg class="pcu" width="220" height="12" viewBox="0 0 220 12"><path d="M4 8C60 3 150 3 216 6" stroke="${tab}" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
      ${quote?`<div class="pcq">“${quote}”</div>`:""}</div>${extra}</div>`;
}

/* =================== lembar sampul tiap bagian =================== */
const SECTAG={yearly:"Satu tahun ajaran, dijalani selangkah demi selangkah.",monthly:"Setiap bulan adalah kesempatan baru untuk bertumbuh.",weekly:"Rencanakan minggumu, nikmati setiap harinya.",
  daily:"Satu halaman sehari, satu langkah kecil menuju tujuan besar.",rutin:"Kebiasaan baik dibangun dari jadwal yang rapi.",wakasek:"Kurikulum yang baik lahir dari koordinasi yang baik.",
  ipa:"Sains dimulai dari rasa ingin tahu.",olahraga:"Tubuh yang kuat, pikiran yang segar.",ibadah:"Amalan yang paling dicintai Allah adalah yang terus-menerus walaupun sedikit.",
  keuangan:"Catat dengan rapi, kelola dengan amanah.",catatan:"Tulis apa saja: ide, rapat, materi, dan cerita hari ini.",teacher:"Absensi, nilai, agenda mengajar & modul ajar IPA dalam satu tempat.",
  wkapp:"Data siswa & guru, pembagian tugas, jadwal, supervisi, dan rapor."};
const SECKICK={yearly:"Tahun Ajaran 2026/2027",monthly:"Kalender & Agenda Bulanan",weekly:"Rencana Mingguan",daily:"Halaman Harian",rutin:"Jadwal Tetap Mingguan",
  wakasek:"Wakil Kepala Sekolah Bidang Kurikulum · SMP Negeri 5 Tangerang",ipa:"Guru IPA Kelas IX · 9H · 9I · 9J",olahraga:"Gym bersama PT · Kelas Zumba",ibadah:"Ibadah Harian Muslimah",
  keuangan:"Keuangan Keluarga",catatan:"Catatan & Ide",teacher:"Teacher Dev · IPA Kelas IX",wkapp:"Sistem Wakasek Kurikulum"};
const SECPHOTO=["wakasek","ipa"];
function pgSecCover(){const P=PAGES[cur.p],k=cur.p,col=P.tab||"#24395f";
  if(k==="s2")return `<div class="s2cover big"><span class="tape s2t1"></span><span class="tape s2t2"></span><img src="s2cover.jpg" alt="Sampul Kuliah S2 UHAMKA" draggable="false"></div>
    <div class="scv-btns"><button class="tb primary" data-xp="">Buka Kuliah S2 ›</button><small>atau geser ke kiri</small></div>`;
  const C=COVER[k]||APPCOVER[k]||{b:["#8aa6c8","#e3b9b4"],l:"book",r:"pencil"};
  const art=SECPHOTO.includes(k)?`<div class="scv-ph"><img src="devy.png" alt="" draggable="false"><div class="scv-d1">${CVD[C.l]}</div><div class="scv-d2">${CVD[C.r]}</div></div>`
    :`<div class="scv-art"><div class="scv-big">${CVD[C.l]}</div><div class="scv-sm">${CVD[C.r]}</div></div>`;
  const openBtn=P.app?`<button class="tb primary" data-openapp="${k}">Buka ${P.title} ›</button>`:`<button class="tb primary" data-xp="">Buka ${P.title} ›</button>`;
  return `<div class="scv" style="--ac:${col}"><svg width="0" height="0" style="position:absolute"><filter id="wc"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter></svg>
    ${deco(BLOB(300,260,C.b[0],BLOBS[0]),"left:-10px;top:-10px")}${deco(BLOB(260,220,C.b[1],BLOBS[1]),"right:-10px;top:-10px")}${deco(BLOB(260,300,C.b[1],BLOBS[2]),"left:-10px;bottom:-10px")}${deco(BLOB(300,320,C.b[0],BLOBS[3]),"right:-10px;bottom:-10px")}
    ${deco(DOOD.spark(28),"left:70px;top:420px")}${deco(DOOD.heart(30),"right:80px;top:440px;transform:rotate(12deg)")}${deco(DOOD.spark(20),"right:110px;top:300px")}
    <div class="scv-in"><span class="pck">Bagian ${String(PNUM[k]||"").padStart(2,"0")} · Planner Devy</span>
      <h1>${P.title}</h1><svg class="pcu" width="300" height="14" viewBox="0 0 300 14"><path d="M4 9C80 3 200 3 296 7" stroke="${col}" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>
      <div class="scv-k">${SECKICK[k]||""}</div>${art}
      <div class="scv-tag brush" style="--bc:color-mix(in srgb,${col} 30%,#f3ece1)"><span>“${SECTAG[k]||""}”</span></div>
      <div class="scv-btns">${openBtn}<small>atau geser ke kiri</small></div></div></div>`}

/* =================== kuliah S2 per mata kuliah =================== */
const MK=[
  {k:"mp",n:"Manajemen Pendidikan",s:"MP",sks:2,dosen:"Dr. Ir. Hamid Al Jufri, M.M., M.Kom.",j:"Jumat 13.30–16.00",c:"#eb6834"},
  {k:"mpk",n:"Manajemen Pengembangan Kurikulum",s:"MPK",sks:3,dosen:"Dr. Hj. Ihsana El Khuluqo, M.Pd.",j:"Jumat 16.00–18.30",c:"#2a78d6"},
  {k:"fst",n:"Filsafat Sains & Teknologi",s:"FST",sks:2,dosen:"Dr. Musringudin, M.Pd.",j:"Sabtu 09.00–10.40",c:"#1baf7a"},
  {k:"aik",n:"Filsafat Kemuhammadiyahan",s:"AIK",sks:2,dosen:"LPP AIK",j:"Sabtu 11.00–12.40",c:"#eda100"},
  {k:"epp",n:"Evaluasi Program Pendidikan",s:"EPP",sks:3,dosen:"Dr. H. Dwi Priyono, M.Ed. & Dr. Rismita, M.Pd.",j:"Sabtu 13.00–15.30",c:"#e87ba4"},
  {k:"msdm",n:"MSDM Pendidikan",s:"MSDM",sks:3,dosen:"Dr. H. Moh. Suryadi Syarief, M.M.",j:"Sabtu 16.00–18.30",c:"#8a63d2"}];
const MKN=Object.fromEntries(MK.map(m=>[m.k,m]));
const JENIS={individu:["👤","Tugas Individu"],kelompok:["👥","Tugas Kelompok"],akhir:["🎓","Tugas Akhir"]};
const LUARAN=["Makalah","PPT","Presentasi","Resume","Review jurnal","Laporan","Mind map","Video","Poster","Artikel"];
const LDEF={individu:[],kelompok:["Makalah","PPT","Presentasi"],akhir:["Makalah","PPT","Presentasi"]};
const unitsOf=it=>{const L=it.luaran||[];return L.length?[L.filter(x=>x.d).length,L.length]:[it.done?1:0,1]};
function progOf(T){let a=0,b=0;T.forEach(i=>{const [x,y]=unitsOf(i);a+=x;b+=y});return b?Math.round(a/b*100):0}
function luaranHTML(it){const L=it.luaran||[];if(!L.length)return"";const d=L.filter(x=>x.d).length,p=Math.round(d/L.length*100);
  return `<div class="lchips">${L.map((x,i)=>`<label class="lchip ${x.d?"on":""}"><input type="checkbox" data-luar="${it.id}|${i}" ${x.d?"checked":""}>${x.d?"✓":"☐"} ${esc(x.n)}</label>`).join("")}<span class="lprog"><span class="mkbar"><i style="width:${p}%"></i></span>${d}/${L.length}</span></div>`}
let s2Tab="all";try{s2Tab=localStorage.getItem(LSK+"s2tab")||"all";if(s2Tab!=="all"&&!MKN[s2Tab])s2Tab="all"}catch(e){}
function mkOf(it){if(it.mk&&MKN[it.mk])return it.mk;const m=String(it.id||"").match(/^s2-([a-z]+)-\d/);return m&&MKN[m[1]]?m[1]:""}
const s2Tasks=mk=>items.filter(i=>i.kind==="tugas"&&i.cat==="s2"&&(!mk||mkOf(i)===mk));
const byDue=(a,b)=>(a.date+(a.start||"23:59")).localeCompare(b.date+(b.start||"23:59"));
function dueTxt(it){if(it.done)return`<span class="dl ok">✓ selesai</span>`;const at=dtOf(it.date,it.start,"23:59"),d=Math.ceil((at-new Date())/864e5),h=Math.round((at-new Date())/36e5);
  if(at<new Date())return`<span class="dl late">lewat ${Math.max(1,-d)} hari</span>`;if(h<24)return`<span class="dl soon">${h<1?"< 1 jam":h+" jam"} lagi</span>`;return`<span class="dl ${d<=3?"soon":""}">${d} hari lagi</span>`}
function s2Row(it,showMk){const m=MKN[mkOf(it)],j=JENIS[it.jenis];
  return `<div class="s2r ${it.done?"done":""}" data-id="${it.id}"><input type="checkbox" class="ck" data-done="${it.id}" ${it.done?"checked":""}>
    <div class="s2m"><div class="tt">${showMk&&m?`<span class="mkc" style="background:${m.c}">${m.s}</span>`:""}${esc(it.title)}${it.prio==="tinggi"&&!it.done?` <span class="badge late">penting</span>`:""}</div>
    <div class="mt">📅 ${fmtShort(parseD(it.date))}${it.start?" "+it.start:""}${j?` · ${j[0]} ${j[1]}`:""}${it.anggota?` · 👥 ${esc(it.anggota)}`:""}${it.notes?" · "+esc(it.notes):""}</div>${luaranHTML(it)}</div><div class="s2act">${dueTxt(it)}<span class="s2btn"><button type="button" data-s2edit="${it.id}" title="Ubah tugas">✏️ Ubah</button><button type="button" data-s2del="${it.id}" title="Hapus tugas">🗑️ Hapus</button></span></div></div>`}
const s2Tabs=()=>`<div class="s2tabs"><button data-s2tab="all" class="${s2Tab==="all"?"on":""}">📚 Semua</button>${MK.map(m=>`<button data-s2tab="${m.k}" class="${s2Tab===m.k?"on":""}" style="--mc:${m.c}"><i style="background:${m.c}"></i>${m.s}</button>`).join("")}</div>`;
function nextMeet(mk){const today=ymd(new Date());return items.filter(i=>i.kind==="agenda"&&i.cat==="s2"&&mkOf(i)===mk&&i.date>=today).sort((a,b)=>(a.date+(a.start||"")).localeCompare(b.date+(b.start||"")))[0]}
function ujianList(){const today=ymd(new Date());return items.filter(i=>i.cat==="s2"&&i.kind==="agenda"&&/^s2-ujian|ETS|EAS|UTS|UAS/i.test(i.id+" "+i.title)&&i.date>=today).sort((a,b)=>a.date.localeCompare(b.date))}
function deadlineAll(){const L=s2Tasks().filter(i=>!i.done).sort(byDue),now=new Date(),wk=ymd(addDays(now,7));
  const late=L.filter(i=>dtOf(i.date,i.start,"23:59")<now),soon=L.filter(i=>!late.includes(i)&&i.date<=wk),later=L.filter(i=>!late.includes(i)&&i.date>wk);
  const sec=(t,a)=>a.length?`<div class="fgh" style="margin-top:8px">${t}<b>${a.length}</b></div>`+a.map(i=>s2Row(i,true)).join(""):"";
  const uj=ujianList().slice(0,4).map(u=>`<div class="s2r" data-id="${u.id}"><span style="font-size:20px">📝</span><div class="s2m"><div class="tt">${esc(u.title)}</div><div class="mt">📅 ${fmtLong(parseD(u.date))}</div></div><span class="dl">${Math.ceil((parseD(u.date)-new Date())/864e5)} hari lagi</span></div>`).join("");
  const done=s2Tasks().filter(i=>i.done).length;
  return (L.length?sec("⚠️ Terlambat",late)+sec("🔥 7 hari ke depan",soon)+sec("🗓️ Berikutnya",later):`<div class="empty">Belum ada tugas kuliah yang menunggu. Buka salah satu mata kuliah untuk menambah tugas.</div>`)+
    (uj?`<div class="fgh" style="margin-top:10px">Ujian<b></b></div>${uj}`:"")+(done?`<div class="mt" style="margin-top:6px">✓ ${done} tugas sudah selesai.</div>`:"")}
function mkCards(){return `<div class="mkgrid">${MK.map(m=>{const T=s2Tasks(m.k),open=T.filter(i=>!i.done).sort(byDue),dn=T.length-open.length,nm=nextMeet(m.k),pct=progOf(T);
  return `<button class="mkcard" data-s2tab="${m.k}" style="--mc:${m.c}"><b>${m.n}</b><small>${m.sks} SKS · ${m.j}</small><small>${esc(m.dosen)}</small>
    <div class="mkstat">${Object.entries(JENIS).map(([k,v])=>`<span>${v[0]} ${T.filter(i=>i.jenis===k&&!i.done).length}</span>`).join("")}</div>
    <div class="mkbar"><i style="width:${pct}%"></i></div><small>${T.length?`Progres ${pct}% · ${dn}/${T.length} tugas selesai`:"Belum ada tugas"}${open[0]?` · terdekat ${fmtShort(parseD(open[0].date))}`:""}</small>
    ${nm?`<small>Pertemuan berikutnya: ${fmtShort(parseD(nm.date))} ${nm.start||""}</small>`:""}</button>`}).join("")}</div>`}
function mkStat(mk){const T=s2Tasks(mk),dn=T.filter(i=>i.done).length,pct=progOf(T),open=T.filter(i=>!i.done).sort(byDue),nm=nextMeet(mk);
  return `<div class="ftiles"><div class="ft"><small>Progres pengerjaan</small><b>${pct}%</b><div class="mkbar"><i style="width:${pct}%"></i></div><small>${dn}/${T.length} tugas selesai</small></div>
    <div class="ft"><small>Deadline terdekat</small><b>${open[0]?fmtShort(parseD(open[0].date)):"–"}</b><small>${open[0]?esc(open[0].title):"tidak ada"}</small></div>
    <div class="ft"><small>Pertemuan berikutnya</small><b>${nm?fmtShort(parseD(nm.date)):"–"}</b><small>${nm?(nm.start||"")+(/Daring/.test(nm.title)?" · daring":" · luring"):""}</small></div>
    <div class="ft"><small>Belum selesai</small><b>${open.length}</b><small>${Object.entries(JENIS).map(([k,v])=>v[0]+" "+open.filter(i=>i.jenis===k).length).join("  ")}</small></div></div>`}
function mkList(mk,jenis){const L=s2Tasks(mk).filter(i=>(i.jenis||"individu")===jenis).sort((a,b)=>(a.done-b.done)||byDue(a,b));
  return L.length?L.map(i=>s2Row(i,false)).join(""):`<div class="empty">Belum ada ${JENIS[jenis][1].toLowerCase()}.</div>`}
const s2AddForm=(mk,jenis)=>`<div class="s2add" data-mk="${mk}" data-jenis="${jenis}"><input class="line" data-s2t placeholder="+ judul ${JENIS[jenis][1].toLowerCase()}…">
  <label>Deadline<input type="date" data-s2d></label><label>Jam<input type="time" data-s2h></label>${jenis==="kelompok"?`<input class="line" data-s2a placeholder="Anggota kelompok (pisahkan dengan koma)">`:""}
  <div class="lsel"><span>${jenis==="individu"?"Jenis tugas yang harus dibuat:":"Luaran:"}</span>${LUARAN.map(l=>`<button type="button" data-lopt="${l}" class="${LDEF[jenis].includes(l)?"on":""}">${l}</button>`).join("")}<input class="line lother" data-lother placeholder="lainnya…"></div>
  <button type="button" class="tb primary" data-s2save>＋ Tambah</button></div>`;
function mkTimeline(mk){const today=ymd(new Date()),T=s2Tasks(mk).filter(i=>!i.done).map(i=>({d:i.date,t:i.start,it:i,k:"t"})),
  M=items.filter(i=>i.kind==="agenda"&&i.cat==="s2"&&mkOf(i)===mk&&i.date>=today).map(i=>({d:i.date,t:i.start,it:i,k:"m"})),
  U=ujianList().map(i=>({d:i.date,t:"",it:i,k:"u"}));
  const L=[...T,...M,...U].sort((a,b)=>(a.d+(a.t||"99")).localeCompare(b.d+(b.t||"99"))).slice(0,14);
  if(!L.length)return`<div class="empty">Tidak ada jadwal ke depan.</div>`;
  return `<div class="tl">${L.map(x=>`<div class="tli ${x.k}" data-id="${x.it.id}"><span class="tld">${fmtShort(parseD(x.d))}${x.t?" · "+x.t:""}</span><span class="tlt">${x.k==="t"?(JENIS[x.it.jenis]||JENIS.individu)[0]+" Deadline: ":x.k==="m"?"🏫 ":"📝 "}${esc(x.it.title)}</span></div>`).join("")}</div>`}
function pgS2(){
  const tabs=s2Tabs();
  if(s2Tab==="all"){
    const s2c=`<div class="s2cover"><span class="tape s2t1"></span><span class="tape s2t2"></span><img src="s2cover.jpg" alt="Sampul Kuliah S2 UHAMKA" draggable="false"></div>`;
    const upcoming=()=>{const now=new Date();let h="";for(let i=0;i<14;i++){const ds=ymd(addDays(now,i)),l=onDay(ds,["s2"]).filter(x=>x.kind==="agenda");
      if(l.length)h+=`<div style="font-family:'Patrick Hand';color:var(--blue-d);font-size:16px;margin-top:4px">${fmtShort(parseD(ds))}</div>`+l.map(x=>itRow(x)).join("")}return h||`<div class="empty">Tidak ada agenda 2 minggu ke depan.</div>`};
    return header("Kuliah S2","Belajar adalah investasi yang tidak pernah rugi.")+tabs+
      box("📚 Mata Kuliah Semester II",auto("mkc",mkCards),"sky")+
      box("⏰ Deadline Semua Mata Kuliah",auto("s2dl",deadlineAll))+
      `<div class="cols c2">${box("Agenda 2 Minggu ke Depan",auto("up",upcoming))}${box("Ide Makalah & Bacaan",ta("ide",8),"note")}</div>`+box("Catatan",ta("catatan",6));
  }
  const m=MKN[s2Tab];
  return header("Kuliah S2",m.n)+tabs+
    `<div class="mkhead" style="--mc:${m.c}"><span>${m.s}</span><div><b>${m.n}</b><small>${m.dosen} · ${m.sks} SKS · ${m.j}</small></div></div>`+
    box("Ringkasan",auto("mks_"+m.k,()=>mkStat(m.k)))+
    Object.keys(JENIS).map(j=>box(JENIS[j].join(" "),auto(`mkl_${m.k}_${j}`,()=>mkList(m.k,j))+s2AddForm(m.k,j),j==="akhir"?"note":j==="kelompok"?"sky":"")).join("")+
    box("📅 Deadline & Pertemuan",auto("mkt_"+m.k,()=>mkTimeline(m.k)))+
    `<div class="cols c2">${box("Materi & Referensi",ta(m.k+"_ref",6,"judul buku, jurnal, link materi…"),"note")}${box("Catatan Kuliah",ta(m.k+"_cat",6,"poin penting dari dosen…"))}</div>`;
}
$("#page").addEventListener("click",async e=>{if(mode==="ink")return;const t=e.target;
  const tb=t.closest&&t.closest("[data-s2tab]");if(tb){e.stopPropagation();s2Tab=tb.dataset.s2tab;try{localStorage.setItem(LSK+"s2tab",s2Tab)}catch(x){}renderPage();window.scrollTo({top:0});return}
  const sv=t.closest&&t.closest("[data-s2save]");if(!sv)return;const f=sv.closest(".s2add"),title=f.querySelector("[data-s2t]").value.trim(),date=f.querySelector("[data-s2d]").value;
  if(!title){toast("Isi judul tugasnya dulu.");f.querySelector("[data-s2t]").focus();return}if(!date){toast("Pilih tanggal deadline-nya.");f.querySelector("[data-s2d]").focus();return}
  const now=new Date().toISOString(),jn=f.dataset.jenis,a=f.querySelector("[data-s2a]");
  const luaran=[...f.querySelectorAll("[data-lopt].on")].map(b=>b.dataset.lopt).concat(f.querySelector("[data-lother]").value.split(",").map(x=>x.trim()).filter(Boolean)).map(n=>({n,d:false}));
  const o={id:uid(),kind:"tugas",cat:"s2",mk:f.dataset.mk,jenis:jn,luaran,title,date,start:f.querySelector("[data-s2h]").value||"",anggota:a?a.value.trim():"",prio:jn==="akhir"?"tinggi":"sedang",remind:jn==="akhir"?4320:1440,notes:"",done:false,createdAt:now,updatedAt:now};
  try{await putItem(o);pushUndo({label:"tambah "+title,page:{...cur},undo:()=>removeItem(o.id),redo:()=>putItem(o)});toast(`💾 ${JENIS[jn][1]} “${esc(title)}” tersimpan · muncul di harian, mingguan & bulanan.`);
    f.querySelectorAll("input").forEach(i=>i.value="");f.querySelectorAll("[data-lopt]").forEach(b=>b.classList.toggle("on",LDEF[jn].includes(b.dataset.lopt)))}catch(x){err(x)}},true);
$("#page").addEventListener("click",async e=>{if(mode==="ink")return;const t=e.target;
  const op=t.closest&&t.closest("[data-lopt]");if(op){op.classList.toggle("on");return}
  const ed=t.closest&&t.closest("[data-s2edit]");if(ed){e.stopPropagation();const it=items.find(x=>x.id===ed.dataset.s2edit);if(it)openModal(it);return}
  const dl=t.closest&&t.closest("[data-s2del]");if(dl){e.stopPropagation();const it=items.find(x=>x.id===dl.dataset.s2del);if(!it)return;
    if(dl.dataset.c!=="1"){dl.dataset.c="1";dl.classList.add("warn");dl.textContent="Yakin hapus?";setTimeout(()=>{if(dl.isConnected){dl.dataset.c="";dl.classList.remove("warn");dl.textContent="🗑️ Hapus"}},3000);return}
    const old=JSON.parse(JSON.stringify(it));try{await removeItem(old.id);pushUndo({label:"hapus "+old.title,page:{...cur},undo:()=>putItem(old),redo:()=>removeItem(old.id)});toast(`🗑️ “${esc(old.title)}” dihapus. Tekan ↶ Undo untuk mengembalikan.`)}catch(x){err(x)}return}
  if(!(t.matches&&t.matches("input[data-luar]")))return;e.stopPropagation();
  const [id,ix]=t.dataset.luar.split("|"),it=items.find(x=>x.id===id);if(!it)return;
  const old=JSON.parse(JSON.stringify(it)),L=(it.luaran||[]).map((x,i)=>i===+ix?{...x,d:t.checked}:{...x}),all=L.length&&L.every(x=>x.d),nw={...old,luaran:L,done:all,updatedAt:new Date().toISOString()};
  try{await putItem(nw);pushUndo({label:(t.checked?"centang ":"batal centang ")+L[+ix].n,page:{...cur},undo:()=>putItem(old),redo:()=>putItem(nw)});if(all&&!old.done)toast(`🎉 Semua luaran “${esc(it.title)}” selesai — tugas ditandai selesai.`)}catch(x){err(x)}},true);
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.matches&&e.target.matches("[data-s2t]")){e.preventDefault();const b=e.target.closest(".s2add").querySelector("[data-s2save]");b&&b.click()}});

/* =================== emas: logam mulia & perhiasan =================== */
let emas=[],emasEdit=null,emasJenis="lm";
const KARAT=[24,23,22,20,18,17,16,14,10,9,8];
const nk=k=>notesCache.keuangan&&notesCache.keuangan.f&&notesCache.keuangan.f[k];
const gramOf=v=>parseFloat(String(v??"").replace(/[^\d,.\-]/g,"").replace(",","."))||0;
const fmtG=g=>(Math.round(g*1000)/1000).toLocaleString("id-ID",{maximumFractionDigits:3});
function hargaEmas(){return numOf(nk("z_emas"))||ZDEF.emas}
function emasStat(){const h=hargaEmas(),lm=emas.filter(x=>x.jenis==="lm"),pj=emas.filter(x=>x.jenis==="perhiasan");
  const lmG=gramOf(nk("op_lm"))+lm.reduce((s,x)=>s+(x.gram||0),0),pjG=pj.reduce((s,x)=>s+(x.gram||0),0),pjMurni=pj.reduce((s,x)=>s+(x.gram||0)*(x.karat||24)/24,0);
  return{h,lmG,lmVal:Math.round(lmG*h),pjG,pjMurni,pjVal:Math.round(pjMurni*h),pjN:pj.length}}
async function putEmas(o){const {id,...b}=o;if(db)await db.doc("emas/"+id).set(b);else{const i=emas.findIndex(x=>x.id===id);if(i>=0)emas[i]=o;else emas.push(o);local.set("emas",emas);refreshAuto()}}
async function delEmas(id){if(db)await db.doc("emas/"+id).delete();else{emas=emas.filter(x=>x.id!==id);local.set("emas",emas);refreshAuto()}}
function emasView(){const s=emasStat(),op=gramOf(nk("op_lm"));
  const row=x=>{const v=Math.round((x.gram||0)*(x.jenis==="lm"?1:(x.karat||24)/24)*s.h);
    return `<div class="ftx" data-eid="${x.id}"><span class="fd">${x.jenis==="lm"?"🪙":"💍"}</span><span class="fn"><b>${esc(x.nama||(x.jenis==="lm"?"Logam mulia":"Perhiasan"))}</b><small>${fmtG(x.gram||0)} g${x.jenis==="perhiasan"?` · ${x.karat||24}K (≈ ${fmtG((x.gram||0)*(x.karat||24)/24)} g emas murni)`:" · 24K"}${x.tgl?" · beli "+fmtShort(parseD(x.tgl)):""}${x.beli?" · harga beli "+fmtRp(x.beli):""}${x.ket?" · "+esc(x.ket):""}</small></span><b class="fa">${fmtRp(v)}</b><span class="rowact"><button type="button" data-eedit="${x.id}" title="Ubah">✏️ Ubah</button><button type="button" data-edel="${x.id}" title="Hapus">🗑️ Hapus</button></span></div>`};
  const lm=emas.filter(x=>x.jenis==="lm"),pj=emas.filter(x=>x.jenis==="perhiasan");
  return `<div class="ftiles"><div class="ft"><small>🪙 Logam mulia</small><b>${fmtG(s.lmG)} g</b><small>${fmtRp(s.lmVal)}</small></div>
    <div class="ft"><small>💍 Perhiasan (${s.pjN} buah)</small><b>${fmtG(s.pjG)} g</b><small>≈ ${fmtG(s.pjMurni)} g murni · ${fmtRp(s.pjVal)}</small></div>
    <div class="ft"><small>Total emas murni</small><b>${fmtG(s.lmG+s.pjMurni)} g</b><small>${fmtRp(s.lmVal+s.pjVal)}</small></div>
    <div class="ft"><small>Harga emas dipakai</small><b>${fmtRp(s.h)}</b><small>per gram</small></div></div>
    <div class="fgh" style="margin-top:10px">🪙 Logam Mulia<b>${fmtG(s.lmG)} g</b></div>
    ${op?`<div class="ftx"><span class="fd">🪙</span><span class="fn"><b>Saldo awal logam mulia</b><small>${fmtG(op)} g · diubah di bagian “Saldo Awal”</small></span><b class="fa">${fmtRp(Math.round(op*s.h))}</b></div>`:""}
    ${lm.map(row).join("")||(op?"":`<div class="empty">Belum ada logam mulia.</div>`)}
    <div class="fgh" style="margin-top:10px">💍 Perhiasan<b>${fmtG(s.pjG)} g</b></div>${pj.map(row).join("")||`<div class="empty">Belum ada perhiasan.</div>`}
    <div class="mt" style="font-size:12px;margin-top:6px">Nilai = berat × kadar/24 × harga emas per gram. Ketuk salah satu untuk mengubah atau menghapus.</div>`}
const emasForm=()=>`<div class="seg" id="emSeg" style="margin:16px 0 10px"><button type="button" data-ej="lm">🪙 Logam Mulia</button><button type="button" data-ej="perhiasan">💍 Perhiasan</button></div>
  <div class="finform">
    <label class="wide">Nama / keterangan singkat<input id="eNama" placeholder="mis. Antam 10 gram" autocomplete="off"></label>
    <label>Berat (gram)<input id="eGram" inputmode="decimal" placeholder="mis. 2,5" autocomplete="off"></label>
    <label id="eKaratL">Kadar<select id="eKarat">${KARAT.map(k=>`<option value="${k}" ${k===22?"selected":""}>${k} karat (${Math.round(k/24*1000)/10}%)</option>`).join("")}</select></label>
    <label>Tanggal beli<input id="eTgl" type="date"></label>
    <label>Harga beli total (opsional)<input id="eBeli" inputmode="numeric" placeholder="Rp 0" autocomplete="off"></label>
    <label class="wide">Catatan<input id="eKet" placeholder="mis. disimpan di brankas / sertifikat no. …" autocomplete="off"></label>
  </div>
  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button type="button" class="tb" id="eDel" style="display:none;color:#a3281d">Hapus</button><button type="button" class="tb" id="eCancel" style="display:none">Batal ubah</button><button type="button" class="tb primary" id="eSave">Simpan</button></div>
  <div class="zset" style="grid-template-columns:1fr 2fr;align-items:end"><label>Harga emas per gram (Rp)${inp("z_emas",new Intl.NumberFormat("id-ID").format(ZDEF.emas),"text-align:right")}</label><div class="mt" style="font-size:12px">Perbarui sesuai harga emas hari ini (mis. dari logammulia.com). Harga ini juga dipakai untuk saldo logam mulia, total aset, dan nisab zakat.</div></div>`;
function emasSetup(){const seg=$("#emSeg");if(!seg)return;
  const setJ=j=>{emasJenis=j;seg.querySelectorAll("[data-ej]").forEach(b=>b.classList.toggle("on",b.dataset.ej===j));$("#eKaratL").style.display=j==="lm"?"none":"";$("#eNama").placeholder=j==="lm"?"mis. Antam 10 gram":"mis. Gelang, cincin kawin, kalung"};
  seg.onclick=e=>{const b=e.target.closest("[data-ej]");if(b)setJ(b.dataset.ej)};
  $("#eBeli").oninput=e=>{const n=numOf(e.target.value);e.target.value=n?new Intl.NumberFormat("id-ID").format(n):""};
  const reset=()=>{emasEdit=null;["eNama","eGram","eBeli","eKet","eTgl"].forEach(i=>$("#"+i).value="");$("#eDel").style.display="none";$("#eCancel").style.display="none";$("#eSave").textContent="Simpan"};
  $("#eSave").onclick=async()=>{const gram=gramOf($("#eGram").value);if(!gram){toast("Isi beratnya dalam gram dulu.");$("#eGram").focus();return}
    const now=new Date().toISOString(),o={id:emasEdit?emasEdit.id:uid(),jenis:emasJenis,nama:$("#eNama").value.trim(),gram,karat:emasJenis==="lm"?24:+$("#eKarat").value,tgl:$("#eTgl").value||"",beli:numOf($("#eBeli").value),ket:$("#eKet").value.trim(),createdAt:emasEdit?emasEdit.createdAt:now,updatedAt:now};
    const old=emasEdit?{...emasEdit}:null;
    try{await putEmas(o);pushUndo({label:(old?"ubah ":"tambah ")+(o.jenis==="lm"?"logam mulia":"perhiasan"),page:{...cur},undo:()=>old?putEmas(old):delEmas(o.id),redo:()=>putEmas(o)});toast(`💾 ${o.jenis==="lm"?"Logam mulia":"Perhiasan"} ${fmtG(gram)} g tersimpan.`);reset()}catch(x){err(x)}};
  $("#eCancel").onclick=reset;
  $("#eDel").onclick=async()=>{const b=$("#eDel");if(!emasEdit)return;if(b.dataset.c!=="1"){b.dataset.c="1";b.textContent="Yakin hapus?";setTimeout(()=>{b.dataset.c="";b.textContent="Hapus"},3000);return}
    const old={...emasEdit};try{await delEmas(old.id);pushUndo({label:"hapus emas",page:{...cur},undo:()=>putEmas(old),redo:()=>delEmas(old.id)});toast("Dihapus. ↶ Undo untuk mengembalikan.");reset()}catch(x){err(x)}};
  window.__emasEditStart=x=>{emasEdit=x;setJ(x.jenis);$("#eNama").value=x.nama||"";$("#eGram").value=String(x.gram||"").replace(".",",");$("#eKarat").value=String(x.karat||22);$("#eTgl").value=x.tgl||"";$("#eBeli").value=x.beli?new Intl.NumberFormat("id-ID").format(x.beli):"";$("#eKet").value=x.ket||"";
    $("#eDel").style.display="";$("#eCancel").style.display="";$("#eSave").textContent="Simpan perubahan";$("#emSeg").scrollIntoView({behavior:"smooth",block:"center"})};
  setJ(emasEdit?emasEdit.jenis:emasJenis);if(emasEdit)window.__emasEditStart(emasEdit);
}
document.addEventListener("click",e=>{if(mode==="ink")return;const r=e.target.closest&&e.target.closest("[data-eid]");if(!r)return;const x=emas.find(a=>a.id===r.dataset.eid);if(x&&window.__emasEditStart)window.__emasEditStart(x)});

/* =================== aset =================== */
const ASETK={bergerak:{kendaraan:"🚗 Kendaraan",elektronik:"💻 Elektronik & gadget",investasi:"📈 Investasi (deposito, reksa dana, saham)",piutang:"🤝 Piutang",lain_b:"📦 Lainnya"},
  tetap:{rumah:"🏠 Rumah & bangunan",tanah:"🌳 Tanah / kavling",lain_t:"🏢 Lainnya"}};
const ASETJ={bergerak:"Aset Bergerak",tetap:"Aset Tidak Bergerak"};
let aset=[],asetEdit=null,asetJenis="bergerak";
async function putAset(o){const {id,...b}=o;if(db)await db.doc("aset/"+id).set(b);else{const i=aset.findIndex(x=>x.id===id);if(i>=0)aset[i]=o;else aset.push(o);local.set("aset",aset);refreshAuto()}}
async function delAset(id){if(db)await db.doc("aset/"+id).delete();else{aset=aset.filter(x=>x.id!==id);local.set("aset",aset);refreshAuto()}}
function asetTotals(){const bal=balances(ymd(new Date())),g=k=>ACC.filter(a=>a[2]===k).reduce((s,a)=>s+(bal[a[0]]||0),0);
  const sumJ=j=>aset.filter(x=>x.jenis===j).reduce((s,x)=>s+(x.nilai||0),0);
  const t={kas:g("Tunai")+g("Bank"),ew:g("E-wallet"),simp:g("Simpanan"),hias:emasStat().pjVal,bergerak:sumJ("bergerak"),tetap:sumJ("tetap")};t.uang=t.kas+t.ew+t.simp;t.total=t.uang+t.hias+t.bergerak+t.tetap;return t}
function asetRekap(){const t=asetTotals(),pct=v=>t.total?Math.round(v/t.total*100)+"%":"0%";
  const parts=[{name:"Kas & rekening bank",val:t.kas,color:"#2a78d6"},{name:"E-wallet",val:t.ew,color:"#e87ba4"},{name:"Simpanan (logam mulia & haji)",val:t.simp,color:"#eda100"},{name:"Perhiasan emas",val:t.hias,color:"#8a63d2"},{name:"Aset bergerak lain",val:t.bergerak,color:"#1baf7a"},{name:"Aset tidak bergerak",val:t.tetap,color:"#eb6834"}];
  const table=["bergerak","tetap"].map(j=>{const L=aset.filter(x=>x.jenis===j).sort((p,q)=>(q.nilai||0)-(p.nilai||0));
    return `<div class="fgh" style="margin-top:10px">${ASETJ[j]}<b>${fmtRp(j==="bergerak"?t.bergerak:t.tetap)}</b></div>`+(L.length?L.map(x=>`<div class="ftx" data-aid="${x.id}"><span class="fd">${(ASETK[j][x.kat]||"").split(" ")[0]||"•"}</span><span class="fn"><b>${esc(x.nama)}</b><small>${(ASETK[j][x.kat]||"").replace(/^\S+\s/,"")}${x.ket?" · "+esc(x.ket):""}${x.tgl?" · nilai per "+fmtShort(parseD(x.tgl)):""}</small></span><b class="fa">${fmtRp(x.nilai||0)}</b><span class="rowact"><button type="button" data-aedit="${x.id}" title="Ubah">✏️ Ubah</button><button type="button" data-adel="${x.id}" title="Hapus">🗑️ Hapus</button></span></div>`).join(""):`<div class="empty">Belum ada ${ASETJ[j].toLowerCase()}.</div>`)}).join("");
  return `<div class="atotal"><small>Total aset keluarga</small><b>${fmtRp(t.total)}</b><span>per ${fmtLong(new Date())}</span></div>
    <div class="ftiles"><div class="ft"><small>Uang & simpanan</small><b>${fmtRp(t.uang)}</b></div><div class="ft"><small>Aset bergerak (+ perhiasan)</small><b>${fmtRp(t.bergerak+t.hias)}</b></div><div class="ft"><small>Aset tidak bergerak</small><b>${fmtRp(t.tetap)}</b></div><div class="ft"><small>Jumlah barang aset</small><b>${aset.length}</b></div></div>
    <div class="acomp"><div>${svgDonut(parts,{center:fmtShortRp(t.total),sub:"total aset",noLeg:true})}</div>
    <div><table class="tbl ftbl atbl"><tr><th>Komponen</th><th>Nilai</th><th>%</th></tr>${parts.map(p=>`<tr><td><i class="sq" style="background:${p.color}"></i>${p.name}</td><td class="r">${fmtRp(p.val)}</td><td class="r">${pct(p.val)}</td></tr>`).join("")}<tr><td><b>Total</b></td><td class="r"><b>${fmtRp(t.total)}</b></td><td class="r">100%</td></tr></table></div></div>
    ${table}<div class="mt" style="font-size:12px;margin-top:6px">Uang & simpanan diambil otomatis dari saldo akun (termasuk Logam Mulia & Tabungan Haji), perhiasan dari kotak 🪙 Emas, jadi tidak perlu dicatat ulang sebagai aset. Pakai tombol ✏️ Ubah atau 🗑️ Hapus di tiap aset (hapus bisa dibatalkan dengan ↶ Undo).</div>`}
const asetForm=()=>`<div class="seg" id="asSeg" style="margin-bottom:10px"><button type="button" data-aj="bergerak">🚗 Aset Bergerak</button><button type="button" data-aj="tetap">🏠 Aset Tidak Bergerak</button></div>
  <div class="finform">
    <label class="wide">Nama aset<input id="aNama" placeholder="mis. Mobil Avanza 2019 / Rumah Pondok Arum" autocomplete="off"></label>
    <label>Kategori<select id="aKat"></select></label>
    <label>Perkiraan nilai sekarang<input id="aNil" inputmode="numeric" placeholder="Rp 0" autocomplete="off"></label>
    <label>Nilai per tanggal<input id="aTgl" type="date" value="${ymd(new Date())}"></label>
    <label class="wide">Keterangan<input id="aKet" placeholder="mis. atas nama, lokasi, nomor sertifikat/BPKB disimpan di…" autocomplete="off"></label>
  </div>
  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button type="button" class="tb" id="aDel" style="display:none;color:#a3281d">Hapus</button><button type="button" class="tb" id="aCancel" style="display:none">Batal ubah</button><button type="button" class="tb primary" id="aSave">Simpan aset</button></div>`;
function asetSetup(){const seg=$("#asSeg");if(!seg)return;
  const setJ=(j,keep)=>{asetJenis=j;seg.querySelectorAll("[data-aj]").forEach(b=>b.classList.toggle("on",b.dataset.aj===j));$("#aKat").innerHTML=Object.entries(ASETK[j]).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
    $("#aNama").placeholder=j==="bergerak"?"mis. Mobil Avanza 2019, motor, perhiasan":"mis. Rumah Pondok Arum, Rumah Karawaci Residence"};
  seg.onclick=e=>{const b=e.target.closest("[data-aj]");if(b)setJ(b.dataset.aj)};
  $("#aNil").oninput=e=>{const n=numOf(e.target.value);e.target.value=n?new Intl.NumberFormat("id-ID").format(n):""};
  const reset=()=>{asetEdit=null;["aNama","aNil","aKet"].forEach(i=>$("#"+i).value="");$("#aTgl").value=ymd(new Date());$("#aDel").style.display="none";$("#aCancel").style.display="none";$("#aSave").textContent="Simpan aset"};
  $("#aSave").onclick=async()=>{const nama=$("#aNama").value.trim(),nilai=numOf($("#aNil").value);
    if(!nama){toast("Isi nama asetnya dulu.");$("#aNama").focus();return}if(!nilai){toast("Isi perkiraan nilainya dulu.");$("#aNil").focus();return}
    const now=new Date().toISOString(),o={id:asetEdit?asetEdit.id:uid(),jenis:asetJenis,kat:$("#aKat").value,nama,nilai,tgl:$("#aTgl").value||ymd(new Date()),ket:$("#aKet").value.trim(),createdAt:asetEdit?asetEdit.createdAt:now,updatedAt:now};
    const old=asetEdit?{...asetEdit}:null;
    try{await putAset(o);pushUndo({label:(old?"ubah aset ":"tambah aset ")+nama,page:{...cur},undo:()=>old?putAset(old):delAset(o.id),redo:()=>putAset(o)});toast(`💾 ${nama} ${fmtRp(nilai)} tersimpan sebagai ${ASETJ[o.jenis].toLowerCase()}.`);reset()}catch(x){err(x)}};
  $("#aCancel").onclick=reset;
  $("#aDel").onclick=async()=>{const b=$("#aDel");if(!asetEdit)return;if(b.dataset.c!=="1"){b.dataset.c="1";b.textContent="Yakin hapus?";setTimeout(()=>{b.dataset.c="";b.textContent="Hapus"},3000);return}
    const old={...asetEdit};try{await delAset(old.id);pushUndo({label:"hapus aset",page:{...cur},undo:()=>putAset(old),redo:()=>delAset(old.id)});toast("Aset dihapus. ↶ Undo untuk mengembalikan.");reset()}catch(x){err(x)}};
  window.__asetEditStart=x=>{asetEdit=x;setJ(x.jenis);$("#aKat").value=x.kat;$("#aNama").value=x.nama;$("#aNil").value=new Intl.NumberFormat("id-ID").format(x.nilai||0);$("#aTgl").value=x.tgl||ymd(new Date());$("#aKet").value=x.ket||"";
    $("#aDel").style.display="";$("#aCancel").style.display="";$("#aSave").textContent="Simpan perubahan";$("#asSeg").scrollIntoView({behavior:"smooth",block:"center"})};
  setJ(asetEdit?asetEdit.jenis:asetJenis);if(asetEdit)window.__asetEditStart(asetEdit);
}

/* tombol Ubah / Hapus per baris aset & emas */
document.addEventListener("click",async e=>{if(typeof mode!=="undefined"&&mode==="ink")return;const fl=e.target.closest&&e.target.closest("[data-flt]");if(fl){e.stopPropagation();finListT=fl.dataset.flt;refreshAuto();return}
  const fb=e.target.closest&&e.target.closest("[data-fedit],[data-fdel]");if(fb){e.stopPropagation();e.preventDefault();const id=fb.dataset.fedit||fb.dataset.fdel,x=fin.find(q=>q.id===id);if(!x)return;
    if(fb.dataset.fedit){if(window.__finEditStart)window.__finEditStart(x);const sg=$("#finSeg");if(sg)sg.scrollIntoView({behavior:"smooth",block:"center"});toast("✏️ Mengubah: "+esc(x.desc||catName(x))+". Setelah selesai ketuk Simpan.");return}
    if(!fb.classList.contains("sure")){fb.classList.add("sure");fb.textContent="Yakin hapus?";setTimeout(()=>{if(fb.isConnected){fb.classList.remove("sure");fb.textContent="🗑️ Hapus"}},3000);return}
    const old=JSON.parse(JSON.stringify(x)),nm=x.desc||catName(x);try{await delFin(id);pushUndo({label:"hapus "+nm,page:{...cur},undo:()=>putFin(old),redo:()=>delFin(id)});toast("🗑️ "+esc(nm)+" "+fmtRp(x.amt)+" dihapus. Tekan ↶ Undo untuk mengembalikan.")}catch(err_){err(err_)}return}
  const b=e.target.closest&&e.target.closest("[data-aedit],[data-adel],[data-eedit],[data-edel]");if(!b)return;e.stopPropagation();e.preventDefault();
  const isA=b.matches("[data-aedit],[data-adel]"),id=b.dataset.aedit||b.dataset.adel||b.dataset.eedit||b.dataset.edel,list=isA?aset:emas,x=list.find(a=>a.id===id);if(!x)return;
  if(b.matches("[data-aedit],[data-eedit]")){const f=isA?window.__asetEditStart:window.__emasEditStart;if(f)f(x);return}
  if(!b.classList.contains("sure")){b.classList.add("sure");b.textContent="Yakin hapus?";setTimeout(()=>{if(b.isConnected){b.classList.remove("sure");b.textContent="🗑️ Hapus"}},3000);return}
  const old=JSON.parse(JSON.stringify(x)),nm=x.nama||(isA?"aset":"emas");
  try{if(isA){await delAset(id);pushUndo({label:"hapus aset "+nm,page:{...cur},undo:()=>putAset(old),redo:()=>delAset(id)})}
      else{await delEmas(id);pushUndo({label:"hapus "+nm,page:{...cur},undo:()=>putEmas(old),redo:()=>delEmas(id)})}
      toast("🗑️ "+esc(nm)+" dihapus. Tekan ↶ Undo untuk mengembalikan.")}catch(err_){err(err_)}},true);
document.addEventListener("click",e=>{if(mode==="ink")return;const r=e.target.closest&&e.target.closest("[data-aid]");if(!r)return;const x=aset.find(a=>a.id===r.dataset.aid);if(x&&window.__asetEditStart)window.__asetEditStart(x)});

/* =================== zakat mal =================== */
const ZDEF={emas:2570000,perak:42750};
const zchk=(name,label)=>`<label class="zck"><input type="checkbox" data-f="${name}" ${fv(name)===false?"":"checked"}> ${label}</label>`;
function zakatCalc(){const bal=balances(ymd(new Date())),g=k=>ACC.filter(a=>a[2]===k).reduce((s,a)=>s+(bal[a[0]]||0),0),A=k=>aset.filter(x=>x.kat===k).reduce((s,x)=>s+(x.nilai||0),0);
  const emas=hargaEmas(),perak=numOf(fv("z_perak"))||ZDEF.perak,basis=fv("z_basis")||"emas",utang=numOf(fv("z_utang"));
  const rows=[["Kas & rekening bank",g("Tunai")+g("Bank"),true],["E-wallet",g("E-wallet"),true],[`Logam mulia (${fmtG(emasStat().lmG)} g)`,bal.lm||0,true],["Tabungan haji",bal.haji||0,fv("z_haji")!==false],
    ["Investasi (deposito, reksa dana, saham)",A("investasi"),true],["Piutang yang diharapkan kembali",A("piutang"),true],["Perhiasan emas",A("emas")+emasStat().pjVal,fv("z_hias")!==false]];
  const harta=rows.filter(r=>r[2]).reduce((s,r)=>s+r[1],0),bersih=Math.max(0,harta-utang),nE=85*emas,nP=595*perak,nisab=basis==="perak"?nP:nE;
  return{rows,harta,utang,bersih,emas,perak,basis,nE,nP,nisab,wajib:bersih>=nisab&&bersih>0,zakat:Math.round(bersih*0.025)}}
function hijriStr(d){try{return new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura",{day:"numeric",month:"long",year:"numeric"}).format(d)}catch(e){return""}}
function zakatView(){const z=zakatCalc(),haul=fv("z_haul");
  let haulTxt=`<div class="mt" style="font-size:13px">Isi <b>tanggal harta mulai mencapai nisab</b> di bawah supaya jatuh tempo haul (1 tahun hijriah) dihitung otomatis.</div>`;
  if(haul){const s=parseD(haul),due=addDays(s,354),left=Math.ceil((due-new Date())/864e5);
    haulTxt=`<div class="zhaul">🗓️ Awal haul: <b>${fmtLong(s)}</b> (${hijriStr(s)})<br>Jatuh tempo zakat: <b>${fmtLong(due)}</b> (${hijriStr(due)}) · ${left>0?`<b>${left} hari lagi</b>`:`<b style="color:#b8501f">sudah sampai haul — tunaikan bila harta tetap ≥ nisab</b>`}</div>`}
  return `<div class="zhead ${z.wajib?"ok":""}"><div><small>Potensi zakat mal (2,5%)</small><b>${z.wajib?fmtRp(z.zakat):"Rp 0"}</b><span>${z.wajib?`Harta bersih ${fmtRp(z.bersih)} sudah mencapai nisab ${z.basis}`:`Belum wajib: harta bersih ${fmtRp(z.bersih)} masih di bawah nisab ${z.basis} (${fmtRp(z.nisab)})`}</span></div></div>
    <table class="tbl ftbl atbl" style="margin-top:8px"><tr><th>Harta yang dihitung</th><th>Nilai</th></tr>${z.rows.map(r=>`<tr style="${r[2]?"":"opacity:.45"}"><td>${r[0]}${r[2]?"":" <small>(tidak dihitung)</small>"}</td><td class="r">${fmtRp(r[1])}</td></tr>`).join("")}
      <tr><td>Dikurangi utang jatuh tempo</td><td class="r">− ${fmtRp(z.utang)}</td></tr><tr><td><b>Harta bersih wajib zakat</b></td><td class="r"><b>${fmtRp(z.bersih)}</b></td></tr></table>
    <div class="znis"><div class="${z.basis==="emas"?"on":""}"><small>Nisab emas · 85 g × ${fmtRp(z.emas)}</small><b>${fmtRp(z.nE)}</b><span>${z.bersih>=z.nE&&z.bersih>0?"✅ tercapai":"belum tercapai"}</span></div>
      <div class="${z.basis==="perak"?"on":""}"><small>Nisab perak · 595 g × ${fmtRp(z.perak)}</small><b>${fmtRp(z.nP)}</b><span>${z.bersih>=z.nP&&z.bersih>0?"✅ tercapai":"belum tercapai"}</span></div></div>
    ${haulTxt}`}
const zakatSettings=()=>`<div class="zset">
        <label>Harga emas per gram<div style="font-family:Nunito;font-size:13px;color:var(--muted);padding-top:6px">diatur di kotak 🪙 Emas (${fmtRp(hargaEmas())})</div></label>
    <label>Harga perak per gram (Rp)${inp("z_perak",new Intl.NumberFormat("id-ID").format(ZDEF.perak),"text-align:right")}</label>
    <label>Dasar nisab<select class="line" data-f="z_basis"><option value="emas" ${fv("z_basis")!=="perak"?"selected":""}>Emas 85 gram</option><option value="perak" ${fv("z_basis")==="perak"?"selected":""}>Perak 595 gram</option></select></label>
    <label>Utang jatuh tempo (Rp)${inp("z_utang","0","text-align:right")}</label>
    <label>Awal haul (harta mencapai nisab)<input type="date" class="line" data-f="z_haul" value="${esc(fv("z_haul")||"")}"></label>
    <div>${zchk("z_haji","Hitung tabungan haji")}${zchk("z_hias","Hitung perhiasan")}</div></div>
  <details class="zrule"><summary>📖 Ketentuan yang dipakai</summary><ul>
    <li><b>Kadar</b> zakat mal 2,5% dari harta yang mencapai nisab dan sudah genap <b>haul</b> (1 tahun hijriah, ±354 hari).</li>
    <li><b>Nisab</b> setara 85 gram emas atau 595 gram perak. Lajnah Da'imah dan Syaikh Bin Baz memfatwakan nisab uang memakai yang lebih rendah (perak) karena lebih hati-hati dan lebih bermanfaat bagi fakir; BAZNAS dan Kemenag memakai emas. Pilih di “Dasar nisab”.</li>
    <li><b>Dihitung</b>: uang tunai, rekening, e-wallet, emas/logam mulia, tabungan (termasuk tabungan haji yang belum dipakai), investasi, dan piutang yang diharapkan kembali. Utang yang jatuh tempo dikurangkan.</li>
    <li><b>Tidak dihitung</b>: rumah yang ditempati, kendaraan, perabot, dan barang pakai lainnya (aset tidak bergerak & kendaraan di daftar aset tidak masuk hitungan). Tanah/rumah yang memang diniatkan untuk dijual termasuk zakat perdagangan.</li>
    <li><b>Perhiasan yang dipakai</b>: Syaikh Bin Baz dan Syaikh Ibnu Utsaimin berpendapat wajib dizakati bila mencapai nisab; jumhur ulama berpendapat tidak. Centang/hapus centang sesuai pendapat yang Ibu ikuti.</li>
    <li>Zakat dihitung <b>per pemilik harta</b>. Harta suami (misalnya gaji suami) adalah milik beliau; bila ingin memisahkan, hitung sesuai kepemilikan.</li>
    <li>Angka ini perkiraan untuk membantu; untuk kasus khusus tanyakan kepada ustadz yang Ibu percayai. Harga emas dan perak bisa diperbarui di kolom di atas.</li></ul></details>`;
/* =================== rekap & grafik ibadah =================== */
const ibsumCache={},ibsumLoading={};let ibView="minggu";
function ibDayRec(f){f=f||{};const sc=ibScore(f);return{s:sc.s,r:sc.r,dz:sc.dz,q:sc.q?1:0,p:f.puasa?1:0,uz:sc.uz?1:0,dh:f.dhuha?1:0,wt:f.witir?1:0}}
const hasIbData=f=>f&&Object.keys(f).some(k=>f[k]);
function loadIbsum(ym){if(ibsumCache[ym])return Promise.resolve(ibsumCache[ym]);if(ibsumLoading[ym])return ibsumLoading[ym];
  return ibsumLoading[ym]=backend.get("ibsum/"+ym).then(d=>ibsumCache[ym]=d&&d.d?d:{d:{}}).catch(()=>ibsumCache[ym]={d:{}})}
async function syncIbDay(ds){const f=notesCache["ibadah-"+ds]&&notesCache["ibadah-"+ds].f;if(!f)return;const ym=ds.slice(0,7),dd=ds.slice(8),S=await loadIbsum(ym);
  const rec=hasIbData(f)?ibDayRec(f):null;if(JSON.stringify(S.d[dd]||null)===JSON.stringify(rec))return;if(rec)S.d[dd]=rec;else delete S.d[dd];queueSave("ibsum/"+ym,()=>({d:ibsumCache[ym].d}),800)}
let ibPending=false;
function ibNeed(keys,months){const miss=keys.filter(k=>!notesCache[k]),mm=(months||[]).filter(m=>!ibsumCache[m]);if(!miss.length&&!mm.length)return false;
  if(!ibPending){ibPending=true;Promise.all([...miss.map(loadNotesKey),...mm.map(loadIbsum)]).then(()=>{miss.forEach(k=>syncIbDay(k.slice(7)));ibPending=false;if(cur.p==="ibadah")refreshAuto()})}return true}
function ibStats(recs){const R=recs.filter(Boolean),nu=R.filter(r=>!r.uz);const pct=(n,d)=>d?Math.round(n/d*100):0;
  return{days:R.length,uz:R.length-nu.length,shalat:pct(nu.reduce((s,r)=>s+r.s,0),nu.length*5),rawatib:nu.length?(nu.reduce((s,r)=>s+r.r,0)/nu.length).toFixed(1).replace(".",","):"0",
    dz:pct(R.filter(r=>r.dz===2).length,R.length),q:R.filter(r=>r.q).length,p:R.filter(r=>r.p).length,dh:R.filter(r=>r.dh).length,wt:R.filter(r=>r.wt).length}}
function ibTiles(st,unit){return `<div class="ibtiles">
  <div class="ibt1"><b>${st.shalat}%</b><small>Shalat wajib tertunaikan</small></div><div class="ibt1"><b>${st.rawatib}<em>/5</em></b><small>Rawatib rata-rata/hari</small></div>
  <div class="ibt1"><b>${st.dz}%</b><small>Hari dzikir pagi & petang</small></div><div class="ibt1"><b>${st.q}</b><small>${unit} tilawah/hafalan</small></div>
  <div class="ibt1"><b>${st.p}</b><small>${unit} puasa</small></div><div class="ibt1"><b>${st.dh}·${st.wt}</b><small>Dhuha · Witir (${unit})</small></div></div>
  <div class="mt" style="font-size:12px;margin:4px 0 8px">${st.days} hari tercatat${st.uz?` · ${st.uz} hari uzur (tidak dihitung dalam persentase shalat)`:""}</div>`}
function ibRecapView(){
  const d=parseD(cur.d);const seg=`<div class="seg" style="margin-bottom:10px">${[["minggu","Mingguan"],["bulan","Bulanan"],["tahun","Tahunan"]].map(([k,t])=>`<button type="button" data-ibv="${k}" class="${ibView===k?"on":""}">${t}</button>`).join("")}</div>`;
  const GOLD=[{name:"Shalat wajib",color:"#b07d2b"}];
  if(ibView==="minggu"||ibView==="bulan"){
    let days=[];if(ibView==="minggu"){const s=weekStart(d);for(let i=0;i<7;i++)days.push(addDays(s,i))}
    else{const y=d.getFullYear(),m=d.getMonth();for(let i=1;i<=new Date(y,m+1,0).getDate();i++)days.push(new Date(y,m,i))}
    const today=ymd(new Date()),keys=days.filter(x=>ymd(x)<=today).map(x=>"ibadah-"+ymd(x));
    if(ibNeed(keys))return seg+`<div class="empty">Memuat rekap…</div>`;
    const recs=days.map(x=>{const n=notesCache["ibadah-"+ymd(x)];return n&&hasIbData(n.f)?ibDayRec(n.f):null});
    const rows=days.map((x,i)=>({label:ibView==="minggu"?HR[x.getDay()]:String(x.getDate()),title:fmtLong(x),values:[recs[i]&&!recs[i].uz?recs[i].s:0],hatch:[!!(recs[i]&&recs[i].uz)]}));
    const ttl=ibView==="minggu"?`Minggu ${fmtShort(days[0])} – ${fmtShort(days[6])}`:`${BULAN[d.getMonth()]} ${d.getFullYear()}`;
    return seg+`<div class="mt" style="font-family:'Patrick Hand';font-size:18px;color:var(--navy)">${ttl}</div>`+ibTiles(ibStats(recs),"hari")+
      `<div class="mt" style="font-size:12px">Jumlah shalat wajib per hari (0–5) · arsir = uzur</div>`+svgBars(rows,{series:GOLD,max:5,ticks:5,fmt:v=>Math.round(v),labelEvery:ibView==="bulan"?2:1,h:180});
  }
  const ty=d.getFullYear(),months=[];for(let m=0;m<12;m++)months.push(`${ty}-${pad(m+1)}`);
  if(ibNeed([],months))return seg+`<div class="empty">Memuat rekap…</div>`;
  const per=months.map(ym=>Object.values((ibsumCache[ym]||{d:{}}).d));const all=per.flat();
  const rows=months.map((ym,i)=>{const st=ibStats(per[i]);return{label:BULAN[i].slice(0,3),title:`${BULAN[i]} ${ty} · ${st.days} hari tercatat`,values:[per[i].length?st.shalat:0]}});
  return seg+`<div class="mt" style="font-family:'Patrick Hand';font-size:18px;color:var(--navy)">Tahun ${ty}</div>`+ibTiles(ibStats(all),"hari")+
    `<div class="mt" style="font-size:12px">Persentase shalat wajib tertunaikan per bulan</div>`+svgBars(rows,{series:[{name:"Shalat wajib (%)",color:"#b07d2b"}],max:100,ticks:4,fmt:v=>Math.round(v)+"%",h:180})+
    `<table class="tbl ftbl" style="margin-top:8px"><tr><th>Bulan</th><th>Hari</th><th>Shalat</th><th>Rawatib</th><th>Dzikir</th><th>Tilawah</th><th>Puasa</th></tr>${months.map((ym,i)=>{if(!per[i].length)return"";const st=ibStats(per[i]);
      return `<tr><td>${BULAN[i]}</td><td class="r">${st.days}</td><td class="r">${st.shalat}%</td><td class="r">${st.rawatib}</td><td class="r">${st.dz}%</td><td class="r">${st.q}</td><td class="r">${st.p}</td></tr>`}).join("")}</table>`;
}

/* =================== embedded apps =================== */
const OLD={};
const appState={};
function sizeApp(){const h=Math.max(420,window.innerHeight-($("#migr").offsetHeight||0)-($("#appCover")&&$("#appCover").offsetHeight||0)-22);document.querySelectorAll(".appframe").forEach(f=>f.style.height=h+"px")}
const appHist={teacher:[],wkapp:[]};let appBacking=false;
function appDiag(key,fr){return;setTimeout(async()=>{try{const w=fr.contentWindow;const o={t:new Date().toISOString(),src:fr.getAttribute("src")||"",inPlanner:!!(w&&w.__inPlanner),claudeX:!!(w&&w.__claudeX),mode:(w&&w.S&&w.S.mode)||"",bridgeErr:String((w&&w.__bridgeErr)||""),bridgeLog:String((w&&w.__bridgeLog)||"").slice(0,400),parentClaude:!!window.claude,dbTop:!!db,ua:navigator.userAgent.slice(0,120),banner:((w&&w.document&&w.document.body&&w.document.body.innerText)||"").slice(0,300)};if(db)await db.doc("diag/app_"+key).set(o)}catch(e){try{db&&db.doc("diag/app_"+key).set({t:new Date().toISOString(),err:String(e)})}catch(_){}}},15000)}
function hookApp(key,fr){appDiag(key,fr);
  let w,d;try{w=fr.contentWindow;d=fr.contentDocument}catch(e){return}if(!w||!d||w.__pdHooked)return;w.__pdHooked=true;
  if(key==="teacher"){d.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-go]");if(!b)return;
      const on=d.querySelector(".side .nav.on");const now=on&&on.dataset.go;if(appBacking){appBacking=false;return}
      if(now&&now!==b.dataset.go){appHist.teacher.push(now);if(appHist.teacher.length>50)appHist.teacher.shift();$("#backBtn").disabled=false}},true)}
  else w.addEventListener("hashchange",e=>{if(appBacking){appBacking=false;return}let old="";try{old=new URL(e.oldURL).hash.slice(1)}catch(x){}
      appHist.wkapp.push(old||"dashboard");if(appHist.wkapp.length>50)appHist.wkapp.shift();$("#backBtn").disabled=false});
}
function appBack(){
  const H=appHist[cur.p];if(!H||!H.length)return false;const t=H.pop();
  const fr=$(cur.p==="teacher"?"#frame-teacher":"#frame-wakasek");let w,d;try{w=fr.contentWindow;d=fr.contentDocument}catch(e){return false}
  appBacking=true;
  if(cur.p==="teacher"){const b=d.querySelector(`.side [data-go="${t}"]`)||d.querySelector(`[data-go="${t}"]`);if(b)b.click();else appBacking=false}
  else w.location.hash=t;
  $("#backBtn").disabled=!H.length&&!navStack.length;return true;
}
function showApp(){
  setMode("type");document.body.classList.add("appmode");clearSel();
  const P=PAGES[cur.p];
  $("#crumb").textContent=P.title;$("#backBtn").disabled=!navStack.length;
  $("#apptabs").innerHTML=Object.entries(PAGES).filter(([k,p])=>p.tab).map(([k,p])=>`<button class="${k===cur.p?"on":""}" data-goapp="${k}" style="background:${p.tab}">${p.icon||""} ${p.title}</button>`).join("");
  document.querySelectorAll(".appframe").forEach(f=>f.classList.remove("on"));
  const fr=$(cur.p==="teacher"?"#frame-teacher":"#frame-wakasek");
  if(!fr.getAttribute("src")){const key=cur.p;fr.addEventListener("load",()=>hookApp(key,fr));fr.setAttribute("src",P.app)}
  $("#backBtn").disabled=!navStack.length&&!(appHist[cur.p]||[]).length;
  fr.classList.add("on");
  renderMigr();sizeApp();try{updNav()}catch(e){}window.scrollTo({top:0});
}
$("#apptabs").addEventListener("click",e=>{const b=e.target.closest("[data-goapp]");if(b)go(b.dataset.goapp===cur.p?b.dataset.goapp:{p:b.dataset.goapp,cv:1})});
window.addEventListener("resize",()=>{if(document.body.classList.contains("appmode"))sizeApp()});
async function renderMigr(){
  const O=OLD[cur.p],box=$("#migr");box.innerHTML="";if(!O)return;
  let dismissed=false;try{dismissed=localStorage.getItem(LSK+"migr-"+cur.p)==="1"}catch(e){}
  if(dismissed){sizeApp();return}
  if(appState[cur.p]===undefined&&db){appState[cur.p]="checking";
    try{let any=false;for(const c of O.probe){const q=await db.collection(O.pre+c).limit(1).get();if(!q.empty){any=true;break}}appState[cur.p]=any?"has":"empty"}catch(e){appState[cur.p]="unknown"}}
  if(!OLD[cur.p]||OLD[cur.p]!==O)return;
  if(appState[cur.p]==="has"){sizeApp();return}
  box.innerHTML=`<div class="migr"><button class="x" data-migrx title="Tutup">✕</button>📦 <b>Pindahkan data lama ${O.name} ke sini</b> (cukup sekali):
    <ol><li>${O.steps}</li><li>${O.here} <button class="tb primary" data-openrestore style="margin-left:4px;padding:4px 12px;font-size:13px">➜ Buka Pengaturan → Pulihkan</button></li></ol>
    <div style="margin-top:6px;color:var(--muted);font-size:13px">Aplikasi lama tetap utuh sebagai cadangan. Setelah data terlihat di sini, kotak ini hilang sendiri.</div></div>`;
  sizeApp();
}
function openRestore(){
  const fr=$(cur.p==="teacher"?"#frame-teacher":"#frame-wakasek");let w,d;try{w=fr.contentWindow;d=fr.contentDocument}catch(e){}
  if(!w||!d){toast("Aplikasinya masih dimuat, coba sebentar lagi.");return}
  if(cur.p==="teacher"){const b=d.querySelector('[data-go="pengaturan"]');if(b)b.click()}else{w.location.hash="pengaturan"}
  let n=0;const find=()=>{const c=[...d.querySelectorAll(".card")].find(x=>/Cadangan data/.test(x.textContent));
    if(c){c.scrollIntoView({behavior:"smooth",block:"center"});c.style.transition="box-shadow .3s";c.style.boxShadow="0 0 0 5px #e0a526";setTimeout(()=>c.style.boxShadow="",5000);toast("Tekan <b>Pulihkan dari file</b> di kotak yang disorot, lalu pilih file cadangan.")}
    else if(n++<20)setTimeout(find,250)};setTimeout(find,300);
}
$("#migr").addEventListener("click",e=>{if(e.target.closest("[data-openrestore]")){openRestore();return}if(e.target.closest("[data-migrx]")){try{localStorage.setItem(LSK+"migr-"+cur.p,"1")}catch(x){}$("#migr").innerHTML="";sizeApp()}});
setInterval(()=>{if(document.body.classList.contains("appmode")&&appState[cur.p]==="empty"){appState[cur.p]=undefined;renderMigr()}},20000);

/* =================== tahunan, breadcrumb & detail =================== */
const taStart=d=>d.getMonth()>=6?d.getFullYear():d.getFullYear()-1;
function crumbs(level){
  const d=parseD(cur.d),ty=taStart(d),ws=weekStart(d),we=addDays(ws,6);
  const parts=[`<a data-crumb="yearly" data-cd="${ymd(d)}">🗓 TA ${ty}/${ty+1}</a>`];
  if(level!=="yearly")parts.push(`<a data-crumb="monthly" data-cd="${ymd(d)}">${BULAN[d.getMonth()]} ${d.getFullYear()}</a>`);
  if(level==="weekly"||level==="daily")parts.push(`<a data-crumb="weekly" data-cd="${ymd(d)}">Minggu ${ws.getDate()} ${BULAN[ws.getMonth()].slice(0,3)}–${we.getDate()} ${BULAN[we.getMonth()].slice(0,3)}</a>`);
  if(level==="daily")parts.push(`<span>${HARI[d.getDay()]} ${d.getDate()}</span>`);
  return `<div class="crumbs">${parts.join('<i>›</i>')}</div>`;
}
function pgYearly(){
  const d=parseD(cur.d),ty=taStart(d),today=ymd(new Date());
  const nav=`<div style="display:flex;gap:8px;justify-content:center;margin-top:8px"><button class="navbtn" data-ynav="-1">‹</button><button class="pill" data-ynav="0">Tahun ini</button><button class="navbtn" data-ynav="1">›</button></div>`;
  const grid=()=>{let out="";
    for(let k=0;k<12;k++){const y=ty+(k+6>=12?1:0),m=(k+6)%12,first=new Date(y,m,1),s=weekStart(first);
      let cells=["","Sn","Sl","Rb","Km","Jm","Sb","Mg"].map(x=>`<span class="yh">${x}</span>`).join("");
      for(let w=0;w<6;w++){const wd=addDays(s,w*7);if(w>=4&&wd.getMonth()!==m&&addDays(wd,6).getMonth()!==m)break;
        cells+=`<button class="ywk" data-gowk="${ymd(wd)}" title="Buka minggu ini">${w+1}</button>`;
        for(let i=0;i<7;i++){const dd=addDays(wd,i),ds=ymd(dd);
          if(dd.getMonth()!==m){cells+=`<span></span>`;continue}
          const l=onDay(ds),cats=[...new Set(l.map(x=>normCat(x.cat)))].slice(0,3);
          cells+=`<button class="yd ${ds===today?"t":""} ${l.length?"has":""}" data-goday="${ds}" title="${l.length?l.length+" agenda/tugas":""}">${dd.getDate()}<i>${cats.map(c=>`<b style="background:${CATS[c].color}"></b>`).join("")}</i></button>`}}
      const cnt=(()=>{let n=0;for(let i=1;i<=31;i++){const dd=new Date(y,m,i);if(dd.getMonth()!==m)break;n+=onDay(ymd(dd)).length}return n})();
      out+=`<div class="ymon"><button class="ymt" data-gomon="${ymd(first)}">${BULAN[m]} <small>${y}</small><em>${cnt?cnt+" kegiatan":""}</em></button><div class="ygrid">${cells}</div></div>`}
    return `<div class="year">${out}</div>`};
  const big=()=>{const a=ymd(new Date(ty,6,1)),b=ymd(new Date(ty+1,5,30));
    const L=items.filter(i=>i.kind==="tugas"?(i.date>=a&&i.date<=b&&!i.done):(i.repeat==="none"&&i.date>=a&&i.date<=b&&!i.start)).sort((x,y)=>x.date.localeCompare(y.date)).slice(0,14);
    return L.length?L.map(i=>itRow(i,{date:true})).join(""):`<div class="empty">Belum ada agenda besar / tenggat tahun ini.</div>`};
  return header(`Tahun Ajaran ${ty}/${ty+1}`,"Klik bulan untuk kalender bulanan, nomor minggu untuk halaman mingguan, atau tanggal untuk halaman harian.",crumbs("yearly")+nav)+
    box("Kalender Tahunan",auto("year",grid)+`<div class="legend">${CAT_LIST().map(([k,c])=>`<span><i class="dot" style="width:9px;height:9px;border-radius:50%;background:${c.color};display:inline-block"></i>${c.short}</span>`).join("")}</div>`)+
    `<div class="cols c2">${box("Agenda Besar & Tenggat",auto("ybig",big))}${box("Target Tahun Ini",numbered("ty",6),"sky")}</div>`;
}
/* detail view of an agenda/task */
let detailCtx=null;
function openDetail(it,ds){
  detailCtx={it,ds};const c=catOf(it);
  const when=it.kind==="tugas"?`Tenggat ${fmtLong(parseD(it.date))}${it.start?" pukul "+it.start:""}`:
    (it.repeat==="weekly"?`Setiap ${(it.days||[]).map(x=>HARI[x]).join(", ")}`:it.repeat==="daily"?"Setiap hari":fmtLong(parseD(it.date)))+(it.start?` · ${it.start}${it.end?"–"+it.end:""}`:" · seharian")+(it.until?` · s.d. ${fmtShort(parseD(it.until))}`:"");
  const rm={0:"Tanpa pengingat",15:"15 menit sebelum",30:"30 menit sebelum",60:"1 jam sebelum",120:"2 jam sebelum",180:"3 jam sebelum",1440:"1 hari sebelum",4320:"3 hari sebelum",10080:"1 minggu sebelum"}[it.remind||0]||"";
  $("#detBody").innerHTML=`<div style="display:flex;gap:10px;align-items:center;margin-bottom:6px"><span class="badge" style="background:${c.color};color:#fff">${c.name}</span><span class="badge">${it.kind==="tugas"?"Tugas":"Agenda"}</span>${it.prio==="tinggi"?`<span class="badge late">Penting</span>`:""}</div>
    <h2 style="margin:4px 0 10px">${esc(it.title)}</h2>
    <div class="detrow">📅 <span>${when}</span></div>
    ${ds&&it.repeat&&it.repeat!=="none"?`<div class="detrow">📍 <span>Pertemuan ${fmtLong(parseD(ds))}</span></div>`:""}
    <div class="detrow">🔔 <span>${rm}</span></div>
    ${it.cat==="s2"&&mkOf(it)?`<div class="detrow">📚 <span>${MKN[mkOf(it)].n}${it.jenis&&JENIS[it.jenis]?" · "+JENIS[it.jenis][1]:""}</span></div>`:""}${it.anggota?`<div class="detrow">👥 <span>${esc(it.anggota)}</span></div>`:""}${it.luaran&&it.luaran.length?`<div class="detrow">🧩 <span>${it.luaran.map(x=>(x.d?"✓ ":"☐ ")+esc(x.n)).join(" · ")} (${it.luaran.filter(x=>x.d).length}/${it.luaran.length})</span></div>`:""}
    ${it.notes?`<div class="detrow">📝 <span>${esc(it.notes)}</span></div>`:""}
    ${it.kind==="tugas"?`<label class="ib" style="margin-top:8px"><input type="checkbox" class="ck" id="detDone" ${it.done?"checked":""}> <span>Sudah selesai</span></label>`:""}`;
  $("#detBg").classList.add("on");
}

$("#detClose").onclick=()=>$("#detBg").classList.remove("on");
$("#detBg").onclick=e=>{if(e.target.id==="detBg")$("#detBg").classList.remove("on")};
$("#detEdit").onclick=()=>{$("#detBg").classList.remove("on");openModal(detailCtx.it)};
$("#detDel").onclick=async()=>{const b=$("#detDel"),it=detailCtx&&detailCtx.it;if(!it)return;
  if(b.dataset.c!=="1"){b.dataset.c="1";b.textContent="Yakin hapus?";setTimeout(()=>{b.dataset.c="";b.textContent="🗑️ Hapus"},3000);return}
  b.dataset.c="";b.textContent="🗑️ Hapus";$("#detBg").classList.remove("on");const old=JSON.parse(JSON.stringify(it));
  try{await removeItem(old.id);pushUndo({label:"hapus "+old.title,page:{...cur},undo:()=>putItem(old),redo:()=>removeItem(old.id)});toast(`🗑️ “${esc(old.title)}” dihapus. Tekan ↶ Undo untuk mengembalikan.`)}catch(x){err(x)}};
$("#detDay").onclick=()=>{$("#detBg").classList.remove("on");go({p:"daily",d:detailCtx.ds||detailCtx.it.date})};
$("#detBody").addEventListener("change",async e=>{if(e.target.id!=="detDone")return;const it=detailCtx.it,v=e.target.checked,old=JSON.parse(JSON.stringify(it)),nw={...it,done:v};if(it.luaran&&it.luaran.length)nw.luaran=it.luaran.map(x=>({...x,d:v}));
  try{await putItem(nw);detailCtx.it=nw;pushUndo({label:(v?"centang ":"batal centang ")+it.title,page:{...cur},undo:()=>putItem(old),redo:()=>putItem(nw)})}catch(x){err(x)}});
/* =================== extra pages per tab =================== */
const NO_PAGER=["cover","index","catatan"],NO_COPY=["daily","weekly","monthly","ibadah","yearly","keuangan"];
function extraAll(){notesCache.meta=notesCache.meta||{f:{}};notesCache.meta.f=notesCache.meta.f||{};return notesCache.meta.f.pages||(notesCache.meta.f.pages={})}
const extraList=tab=>extraAll()[tab]||[];
const curExtra=()=>cur.x?extraList(cur.p).find(e=>e.id===cur.x):null;
function pgImg(e){const col=PAGES[cur.p].tab||"#3f5f8f";
  return `<div class="imgpg"><div class="imgpg-h" style="--ac:${col}">${inp("judul",esc(e.title||"Judul halaman…"),"font-size:26px;text-align:center")}<div class="imgpg-sub">${esc(e.sub||"")}${e.pdf?` · <a href="${esc(e.pdf)}" target="_blank" rel="noopener">📄 buka PDF asli</a>`:""} · ✍️ pilih mode <b>Tulis</b> untuk mencoret-coret</div></div>
    <img class="imgpg-img" src="${esc(e.src)}" alt="${esc(e.title||"")}" draggable="false" style="aspect-ratio:${e.w||4}/${e.h||3}"></div>`}
function curExtraTitle(){const e=curExtra();if(!e)return"";const n=notesCache[pageKey(cur)];return (n&&n.f&&n.f.judul)||e.title||("Halaman "+(extraList(cur.p).indexOf(e)+2))}
function saveExtra(){queueSave("notes/meta",()=>({f:notesCache.meta.f}),200)}
function pagerBar(){
  if(cur.cv)return"";if(NO_PAGER.includes(cur.p)||PAGES[cur.p].app)return"";
  const col=PAGES[cur.p].tab||"#3f5f8f",L=extraList(cur.p);
  const isMain=!cur.x&&!cur.cv,cvb=`<button class="${cur.cv?"on":""}" data-gocv="${cur.p}" style="${cur.cv?`background:${col}`:""}">📘 Sampul</button>`;
  const main=`<button class="${isMain?"on":""}" data-xp="" style="${isMain?`background:${col}`:""}">${PAGES[cur.p].title}</button>`;
  const ex=L.map((e,i)=>{const n=notesCache[cur.p+"~"+e.id];const t=(n&&n.f&&n.f.judul)||e.title||("Halaman "+(i+2));
    return `<button class="${cur.x===e.id?"on":""}" data-xp="${e.id}" style="${cur.x===e.id?`background:${col}`:""}" title="${esc(t)}">${e.t==="blank"?"📝 ":e.t==="img"?"🗓️ ":"📄 "}${esc(t)}</button>`}).join("");
  return `<div class="pager">${cvb}${main}${ex}<button class="add" data-addpage>＋ Halaman</button>${cur.x?`<button class="del" data-delpage title="Hapus halaman ini">🗑</button>`:""}</div>`;
}
function pgBlank(e){
  const col=PAGES[cur.p].tab||"#3f5f8f";
  return header(`<span style="color:${col}">${esc(PAGES[cur.p].title)}</span>`,"")+box("Judul",inp("judul",e.title||"Judul halaman…","font-size:24px"),"sky")+box("Catatan",ta("isi",28));
}
let apType="copy";
function openAddPage(){
  const canCopy=!NO_COPY.includes(cur.p);apType=canCopy?"copy":"blank";
  $("#apTab").textContent="Di tab "+PAGES[cur.p].title;
  $("#apChoice").innerHTML=(canCopy?`<button type="button" data-apt="copy"><span style="font-size:30px">📄</span><span><b>Salinan halaman ${esc(PAGES[cur.p].title)}</b><small>Tata letak sama seperti halaman utama, isinya masih kosong.</small></span></button>`:"")+
    `<button type="button" data-apt="blank"><span style="font-size:30px">📝</span><span><b>Halaman catatan kosong</b><small>Kertas bergaris dengan tema yang sama, bisa diketik atau ditulis tangan.</small></span></button>`;
  document.querySelectorAll("[data-apt]").forEach(b=>b.classList.toggle("on",b.dataset.apt===apType));
  $("#apTitle").value="";$("#addPageBg").classList.add("on");
}
$("#apChoice").onclick=e=>{const b=e.target.closest("[data-apt]");if(!b)return;apType=b.dataset.apt;document.querySelectorAll("[data-apt]").forEach(x=>x.classList.toggle("on",x===b))};
$("#apCancel").onclick=()=>$("#addPageBg").classList.remove("on");
$("#addPageBg").onclick=e=>{if(e.target.id==="addPageBg")$("#addPageBg").classList.remove("on")};
$("#apOk").onclick=()=>{
  const A=extraAll(),tab=cur.p,e={id:uid(),t:apType,title:$("#apTitle").value.trim()};
  const before=(A[tab]||[]).slice();A[tab]=[...before,e];saveExtra();$("#addPageBg").classList.remove("on");
  const base={...cur};delete base.x;
  pushUndo({label:"tambah halaman",page:base,undo:()=>{A[tab]=before;saveExtra();if(cur.x===e.id)go(base,false);else renderPage()},redo:()=>{A[tab]=[...before,e];saveExtra();renderPage()}});
  go({...base,x:e.id});toast(apType==="copy"?"📄 Halaman salinan ditambahkan.":"📝 Halaman catatan ditambahkan.");
};
function delCurPage(){
  const A=extraAll(),tab=cur.p,id=cur.x,before=(A[tab]||[]).slice(),idx=before.findIndex(x=>x.id===id);if(idx<0)return;
  A[tab]=before.filter(x=>x.id!==id);saveExtra();const base={...cur};delete base.x;go(base,false);
  pushUndo({label:"hapus halaman",page:base,undo:()=>{A[tab]=before;saveExtra();renderPage()},redo:()=>{A[tab]=before.filter(x=>x.id!==id);saveExtra();renderPage()}});
  toast("Halaman dihapus. Tekan ↶ Undo untuk mengembalikan.");
}

/* =================== fullscreen & rail =================== */
function isFs(){return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function updFs(){$("#fsBtn").innerHTML=isFs()?"<i>🗗</i><small>Keluar penuh</small>":"<i>⛶</i><small>Layar penuh</small>";setTimeout(()=>{document.body.classList.contains("appmode")?sizeApp():layout()},120)}
$("#fsBtn").onclick=async()=>{
  try{if(isFs()){await (document.exitFullscreen||document.webkitExitFullscreen).call(document)}
    else{const el=document.documentElement;const f=el.requestFullscreen||el.webkitRequestFullscreen;if(!f)throw new Error("x");await f.call(el,{navigationUI:"hide"})}}
  catch(e){document.body.classList.toggle("railhidden");try{localStorage.setItem(LSK+"rail",document.body.classList.contains("railhidden")?"0":"1")}catch(x){}updFs();
    toast("Browser di sini tidak mengizinkan layar penuh, jadi menu saya sembunyikan untuk memperluas halaman. Tekan ☰ di pojok kiri atas untuk memunculkannya lagi.")}
};
document.addEventListener("fullscreenchange",updFs);document.addEventListener("webkitfullscreenchange",updFs);
function setRail(show){document.body.classList.toggle("railhidden",!show);try{localStorage.setItem(LSK+"rail",show?"1":"0")}catch(e){}document.body.classList.contains("appmode")?sizeApp():layout()}
$("#railHide").onclick=()=>setRail(false);$("#railShow").onclick=()=>setRail(true);
try{if(localStorage.getItem(LSK+"rail")==="0")document.body.classList.add("railhidden")}catch(e){}

/* =================== mode buku: sampul 3D, balik halaman, geser =================== */
let navDir=1,bookMode=false;
try{const v=localStorage.getItem(LSK+"book");bookMode=v===null?(matchMedia("(pointer:coarse)").matches||innerWidth<=1366&&"ontouchstart" in window):v==="1"}catch(e){}
function applyBook(){document.body.classList.toggle("bookmode",bookMode);$("#bookBtn").classList.toggle("on",bookMode);
  if(bookMode)document.body.classList.add("railhidden");setTimeout(()=>{document.body.classList.contains("appmode")?sizeApp():layout()},60)}
function greet(){const h=new Date().getHours();return h<11?"Selamat pagi":h<15?"Selamat siang":h<18?"Selamat sore":"Selamat malam"}
function showIntro(){
  if(document.getElementById("bookIntro"))return;
  const el=document.createElement("div");el.id="bookIntro";
  el.innerHTML=`<div class="desk"></div>
  <div class="bk-scene"><div class="bk">
    <div class="bk-pages"><div class="bk-p1"></div><div class="bk-p2"></div><div class="bk-first">
      <div class="bf-in"><div class="bf-date">${fmtLong(new Date())}</div><div class="bf-hi">${greet()},<br>Bu Devy</div><div class="bf-q">“Amalan yang paling dicintai Allah adalah yang terus-menerus walaupun sedikit.”</div></div></div></div>
    <div class="bk-cover"><div class="bc-front kraftc">
        <svg width="0" height="0" style="position:absolute"><filter id="wc2"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter></svg>
        <svg class="bc-blobs" viewBox="0 0 400 560" preserveAspectRatio="none"><g filter="url(#wc2)" opacity=".8"><path d="M0 0H130C150 30 120 60 80 70 50 80 30 110 0 120Z" fill="#9db8a3"/><path d="M400 0V110C370 100 340 70 320 40 310 20 300 10 300 0Z" fill="#8aa6c8"/><path d="M0 420C40 410 70 440 90 480 100 510 110 540 110 560H0Z" fill="#e3b9b4"/><path d="M400 400C370 410 340 450 320 490 310 520 300 545 300 560H400Z" fill="#d5b48a"/></g></svg>
        <div class="bc-ta2">Tahun Ajaran 2026/2027</div><div class="bc-t2">${esc(((notesCache.cover||{}).f||{}).covtitle||"My Planner")}</div>
        <img class="bc-photo" src="devy.png" alt="">
        <div class="bc-name brush" style="--bc:#efcfcc"><span>Devy Sylvya ♡</span></div>
        <div class="bc-roles2">Wakasek Kurikulum · Guru IPA · Mahasiswi S2<br>Sport · Ibadah · Keuangan</div>
      </div><div class="bc-back"></div></div>
    <div class="bk-band"></div><div class="bk-ribbon"></div>
    <div class="bk-rings">${"<i></i>".repeat(14)}</div>
  </div></div>
  <div class="bk-hint">Ketuk sampul untuk membuka ✨</div><button class="bk-skip">Lewati</button>`;
  document.body.appendChild(el);
  let opened=false;
  const open=async()=>{if(opened)return;opened=true;
    if(bookMode){try{const r=document.documentElement,f=r.requestFullscreen||r.webkitRequestFullscreen;if(f)await f.call(r,{navigationUI:"hide"})}catch(e){}}
    el.classList.add("opening");setTimeout(()=>el.classList.add("zoom"),1500);setTimeout(()=>{el.remove();layout()},2350)};
  el.querySelector(".bk-scene").onclick=open;el.querySelector(".bk-hint").onclick=open;
  el.querySelector(".bk-skip").onclick=e=>{e.stopPropagation();el.remove()};
}
$("#bookBtn").onclick=()=>{bookMode=!bookMode;try{localStorage.setItem(LSK+"book",bookMode?"1":"0")}catch(e){}applyBook();
  if(bookMode){showIntro()}else{document.body.classList.remove("railhidden");if(isFs())(document.exitFullscreen||document.webkitExitFullscreen).call(document).catch(()=>{});toast("Mode buku dimatikan.")}};
/* swipe to turn pages */
function turnPage(step){
  const P=cur.p,d=cur.d?parseD(cur.d):new Date();window.__turnDir=step;
  if(sheetMode&&!document.body.classList.contains("appmode")&&sheetGo(step))return;
  const secOrder=Object.entries(PAGES).filter(([k,p])=>p.tab).map(([k])=>k);
  if(cur.cv){if(step>0)return go({p:P});const i=secOrder.indexOf(P);return i>0?go({p:secOrder[i-1]}):go("index")}
  if(step<0&&!cur.x&&(!["daily","ibadah","weekly","monthly","yearly","keuangan","catatan"].includes(P)||(P==="catatan"&&(cur.n||1)===1)))return go({p:P,cv:1});
  if(P==="daily"||P==="ibadah")return go({p:P,d:ymd(addDays(d,step))});
  if(P==="weekly")return go({p:P,d:ymd(addDays(d,7*step))});
  if(P==="monthly")return go({p:P,d:ymd(new Date(d.getFullYear(),d.getMonth()+step,1))});
  if(P==="yearly")return go({p:P,d:ymd(new Date(taStart(d)+step,6,1))});
  if(P==="keuangan")return go({p:P,d:ymd(finView==="hari"?addDays(d,step):finView==="tahun"?new Date(d.getFullYear()+step,0,1):new Date(d.getFullYear(),d.getMonth()+step,1))});
  if(P==="catatan")return go({p:"catatan",n:Math.max(1,(cur.n||1)+step)});
  const order=Object.entries(PAGES).filter(([k,p])=>(p.tab||k==="cover"||k==="index")&&!p.app).map(([k])=>k),i=order.indexOf(P);
  const nx=order[i+step];if(nx)go(PAGES[nx].tab&&step>0?{p:nx,cv:1}:nx);
}
let sw=null;
document.addEventListener("touchstart",e=>{if(mode==="ink"||document.body.classList.contains("appmode")||e.touches.length!==1)return;
  const t=e.target;if(!t.closest||!t.closest("#stage")||t.closest("select,.chartbox,.modal,input[type=range],input:focus,textarea:focus,canvas"))return;sw={x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now()}},{passive:true});
document.addEventListener("touchend",e=>{if(!sw)return;const s0=sw;sw=null;const c=e.changedTouches[0],dx=c.clientX-s0.x,dy=c.clientY-s0.y;
  if(zoom>1.05&&document.documentElement.scrollWidth>innerWidth+4)return;if(Date.now()-s0.t<700&&Math.abs(dx)>90&&Math.abs(dy)<Math.abs(dx)*.5)turnPage(dx<0?1:-1)},{passive:true});

/* ===== zoom untuk semua halaman (tombol mengambang + cubit dua jari) ===== */
let appZoom=1;try{const z=parseFloat(localStorage.getItem(LSK+"zoom"));if(z>=.5&&z<=3)zoom=z;const az=parseFloat(localStorage.getItem(LSK+"appzoom"));if(az>=.6&&az<=2.5)appZoom=az}catch(e){}
const inApp=()=>document.body.classList.contains("appmode");
function saveZoom(){try{localStorage.setItem(LSK+"zoom",String(zoom));localStorage.setItem(LSK+"appzoom",String(appZoom))}catch(e){}}
function applyAppZoom(){document.querySelectorAll(".appframe").forEach(f=>{try{const d=f.contentDocument;if(d&&d.documentElement){d.documentElement.style.zoom=appZoom;hookPinch(d,true)}}catch(e){}})}
function updZoomUI(){const v=Math.round((inApp()?appZoom:zoom)*100)+"%";const a=$("#zFit");if(a)a.textContent=Math.round(zoom*100)+"%";const b=$("#zpVal");if(b)b.textContent=v}
function zoomStep(dir){if(inApp()){appZoom=Math.min(2.5,Math.max(.6,+(appZoom*(dir>0?1.15:1/1.15)).toFixed(3)));if(dir===0)appZoom=1;applyAppZoom()}else{if(dir===0)setZoom(1);else setZoom(zoom*(dir>0?1.2:1/1.2))}saveZoom();updZoomUI()}
(function(){const z=document.createElement("div");z.id="zPill";z.innerHTML=`<button type="button" data-zp="-1" title="Perkecil">－</button><button type="button" data-zp="0" id="zpVal" title="Kembali 100%">100%</button><button type="button" data-zp="1" title="Perbesar">＋</button>`;document.body.appendChild(z);
  z.addEventListener("click",e=>{const b=e.target.closest("[data-zp]");if(b){e.stopPropagation();zoomStep(+b.dataset.zp)}})})();
let zpin=null;
const tdist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
function hookPinch(doc,isApp){if(doc.__pinchHooked)return;doc.__pinchHooked=true;
  doc.addEventListener("touchstart",e=>{if(e.touches.length!==2)return;if(!isApp&&(!e.target.closest||!e.target.closest("#stage")))return;if(!isApp&&mode==="ink"&&!stylusOnly)return;
    sw=null;zpin={d:tdist(e.touches),z:isApp?appZoom:zoom,app:isApp}},{passive:true});
  doc.addEventListener("touchmove",e=>{if(!zpin||e.touches.length!==2)return;e.preventDefault();const r=tdist(e.touches)/zpin.d;
    if(zpin.app){appZoom=Math.min(2.5,Math.max(.6,zpin.z*r));doc.documentElement.style.zoom=appZoom}
    else{const cx=(e.touches[0].clientX+e.touches[1].clientX)/2,cy=(e.touches[0].clientY+e.touches[1].clientY)/2;setZoom(zpin.z*r,cx,cy,true)}updZoomUI()},{passive:false});
  doc.addEventListener("touchend",e=>{if(zpin&&e.touches.length<2){const wasApp=zpin.app;zpin=null;saveZoom();if(!wasApp){layout()}}},{passive:true})}
hookPinch(document,false);
document.querySelectorAll(".appframe").forEach(f=>f.addEventListener("load",()=>setTimeout(applyAppZoom,300)));
setInterval(()=>{if(inApp())applyAppZoom()},2000);
new MutationObserver(updZoomUI).observe(document.body,{attributes:true,attributeFilter:["class"]});
setTimeout(()=>{updZoomUI();if(zoom!==1)layout()},50);
try{if(innerWidth<700&&!localStorage.getItem(LSK+"zoomhint")){localStorage.setItem(LSK+"zoomhint","1");setTimeout(()=>toast("🔍 Tulisan kecil? Cubit dengan dua jari atau ketuk ＋ di pojok kanan bawah untuk memperbesar."),2500)}}catch(e){}

/* =================== sinkron antar perangkat =================== */
async function refreshRemote(key){if(!db||key!==pageKey(cur))return;
  try{if(!pendingSaves["ink/"+key]&&!writing["ink/"+key]&&!drawing){const v=decInk(await backend.get("ink/"+key));
      if(key===pageKey(cur)&&!pendingSaves["ink/"+key]&&!writing["ink/"+key]&&!drawing&&JSON.stringify(v)!==JSON.stringify(inkCache[key]&&inkCache[key].s)){inkCache[key]={s:v};try{rebuild()}catch(e){}}}
    if(!pendingSaves["media/"+key]&&!writing["media/"+key]){const d=await backend.get("media/"+key),m=(d&&d.m)||[];
      if(key===pageKey(cur)&&!pendingSaves["media/"+key]&&!writing["media/"+key]&&JSON.stringify(m)!==JSON.stringify(mediaCache[key]&&mediaCache[key].m)){mediaCache[key]={m};try{renderMedia()}catch(e){}}}}catch(e){}}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&db&&!document.body.classList.contains("appmode")){const key=pageKey(cur);refreshRemote(key);try{watchNotes(key)}catch(e){}}});
/* =================== sinkron + penyelesaian perbedaan versi =================== */
const SYNC_COL={items:"planner",fin:"fin",aset:"aset",emas:"emas"};
const SYNC_COLNM={items:"Agenda/tugas",fin:"Transaksi keuangan",aset:"Aset",emas:"Emas"};
const FNM={title:"Judul",nama:"Nama",judul:"Judul",ket:"Keterangan",note:"Catatan",notes:"Catatan",d:"Tanggal",date:"Tanggal",tgl:"Tanggal",time:"Jam",jam:"Jam",nominal:"Nominal",amt:"Nominal",nilai:"Nilai",gram:"Berat (g)",karat:"Karat",done:"Selesai",cat:"Kategori",kat:"Kategori",akun:"Akun",acc:"Akun",jenis:"Jenis",mk:"Mata kuliah",anggota:"Anggota",luaran:"Luaran",isi:"Isi"};
const FNM2=[[/^prio(\d+)$/,"Prioritas $1"],[/^(lt|t|tgt|target)_?(\d+)$/,"Target $2"],[/^op_lm$/,"Saldo awal logam mulia"],[/^op_(.+)$/,"Saldo awal $1"],[/^z_(.+)$/,"Pengaturan zakat ($1)"],[/^sh?_(.+)$/,"Shalat $1"],[/^(catatan|syukur|fokus|eval|ide|isi|judul|motto|muhasabah|kajian|tilawah|hafalan|penting|rapat|olahraga|pt)$/,m=>m[0].toUpperCase()+m.slice(1)]];
const fieldName=f=>{if(FNM[f])return FNM[f];for(const [re,r] of FNM2)if(re.test(f))return f.replace(re,r);return f.replace(/_/g," ")};
function syncKeyLabel(k){const [kind,rest]=[k.split("/")[0],k.split("/").slice(1).join("/")];
  const pre={notes:"Isian",ink:"Tulisan tangan",media:"Gambar/stiker"}[kind]||kind;
  const m=rest.match(/^([a-z0-9]+)(?:-(.+))?$/i)||[];const pg=PAGES[(rest.split("~")[0]).split("-")[0]];
  let nm=pg?pg.title:rest;const dt=rest.match(/(\d{4}-\d{2}-\d{2})/);if(dt){try{nm+=" · "+fmtLong(parseD(dt[1]))}catch(e){}}else{const ym=rest.match(/-(\d{4}-\d{2})$/);if(ym){const [y,mo]=ym[1].split("-");nm+=" · "+BULAN[+mo-1]+" "+y}else{const n=rest.match(/catatan-(\d+)/);if(n)nm+=" · hal. "+n[1];if(/~sampul/.test(rest))nm+=" · sampul"}}
  if(rest==="meta")nm="Pengaturan & data planner";return pre+" — "+nm}
const syncShow=v=>{if(v===undefined||v===null||v==="")return"<i style='color:#98a2b3'>(kosong)</i>";if(v===true)return"✔ ya";if(v===false)return"✘ belum";if(typeof v==="object")return esc(JSON.stringify(v).slice(0,140));const s=String(v);return esc(s.length>160?s.slice(0,160)+"…":s)};
const syncStrip=o=>{const c={...o};delete c.updatedAt;delete c.createdAt;delete c.id;return JSON.stringify(Object.keys(c).sort().reduce((a,k)=>(a[k]=c[k],a),{}))};
function syncMergeVal(a,b){if(a===undefined||a===null||a==="")return b;if(b===undefined||b===null||b==="")return a;
  if(typeof a==="boolean"||typeof b==="boolean")return !!(a||b);
  if(typeof a==="string"&&typeof b==="string"){if(a.includes(b))return a;if(b.includes(a))return b;return a+(a.includes("\n")||b.includes("\n")?"\n":" · ")+b}
  if(Array.isArray(a)&&Array.isArray(b)){const seen=new Set(a.map(x=>JSON.stringify(x)));return a.concat(b.filter(x=>!seen.has(JSON.stringify(x))))}
  if(typeof a==="object"&&typeof b==="object"){const o={...a};for(const k in b)o[k]=k in a?syncMergeVal(a[k],b[k]):b[k];return o}
  return a}
let syncConf=[],syncRunning=false;
async function syncLocalToCloud(){if(!db||syncRunning)return;syncRunning=true;try{await syncLocalToCloud0()}finally{syncRunning=false}}
async function syncLocalToCloud0(){const keys=[];
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(LSK))keys.push(k.slice(LSK.length))}}catch(e){return}
  const data=keys.filter(k=>SYNC_COL[k]||/^(notes|ink|media|ibsum)\//.test(k));if(!data.length)return;
  let n=0;const conf=[];
  for(const k of data){let v;try{v=JSON.parse(localStorage.getItem(LSK+k))}catch(e){continue}
    let pend=0;
    try{
      if(SYNC_COL[k]){const col=SYNC_COL[k];if(Array.isArray(v))for(const o of v){if(!o||!o.id)continue;const {id,...body}=o,ref=db.doc(col+"/"+id),sv=await ref.get();
          if(!sv.exists){await ref.set(body);n++;continue}
          const srv=JSON.parse(JSON.stringify(sv.data()||{}));if(syncStrip(body)===syncStrip(srv))continue;
          const flds=[...new Set([...Object.keys(body),...Object.keys(srv)])].filter(f=>!["updatedAt","createdAt","id"].includes(f)&&JSON.stringify(body[f])!==JSON.stringify(srv[f]));
          pend++;conf.push({src:k,kind:"item",col,id,title:SYNC_COLNM[k]+" — "+(body.title||body.nama||body.judul||body.ket||srv.title||srv.nama||srv.ket||id),
            rows:flds.map(f=>({f,nm:fieldName(f),l:body[f],s:srv[f]})),local:body,server:srv})}}
      else if(k.startsWith("notes/")){const f=(v&&v.f)||{},ref=db.doc(k),sv=await ref.get(),srv=sv.exists?JSON.parse(JSON.stringify(sv.data().f||{})):{};let ch=false;const rows=[];
        for(const nm in f){const lv=f[nm];if(lv===""||lv==null||lv===false)continue;const cv=srv[nm];
          if(cv===undefined||cv===""||cv===null||cv===false){srv[nm]=lv;ch=true}else if(JSON.stringify(cv)!==JSON.stringify(lv))rows.push({f:nm,nm:fieldName(nm),l:lv,s:cv})}
        if(ch){await ref.set({f:srv});n++;delete notesCache[k.slice(6)]}
        if(rows.length){pend++;conf.push({src:k,kind:"notes",path:k,title:syncKeyLabel(k),rows,local:f,server:srv})}}
      else if(k.startsWith("ink/")||k.startsWith("media/")){const ref=db.doc(k),sv=await ref.get();
        if(!sv.exists){if(v){await ref.set(v);n++}}
        else{const srv=JSON.parse(JSON.stringify(sv.data()||{}));if(v&&JSON.stringify(srv)!==JSON.stringify(v)){
          const isInk=k.startsWith("ink/"),cl=isInk?decInk(v).length:((v.m||[]).length),cs=isInk?decInk(srv).length:((srv.m||[]).length);
          pend++;conf.push({src:k,kind:isInk?"ink":"media",path:k,title:syncKeyLabel(k),rows:[{f:"_",nm:isInk?"Jumlah goresan":"Jumlah gambar/stiker",l:cl,s:cs}],local:v,server:srv})}}}
      else{const ref=db.doc(k),sv=await ref.get();if(!sv.exists&&v){await ref.set(v);n++}}
      if(!pend)localStorage.removeItem(LSK+k)}catch(e){console.warn("sinkron",k,e)}}
  if(n){toast(`☁ ${n} isian yang sebelumnya hanya tersimpan di perangkat ini sudah dipindahkan ke akun.`);const key=pageKey(cur);await loadNotesKey(key).catch(()=>{});renderPage()}
  if(conf.length){syncConf=conf;openConflicts()}}
async function applyConflict(c,choice){
  if(c.kind==="item"){const ref=db.doc(c.col+"/"+c.id),now=new Date().toISOString();
    if(choice==="local")await ref.set({...c.local,updatedAt:now});
    else if(choice==="both"){const nid=uid(),copy={...c.local,updatedAt:now};if(copy.title)copy.title+=" (perangkat lain)";else if(copy.nama)copy.nama+=" (perangkat lain)";else if(copy.ket)copy.ket+=" (perangkat lain)";await db.doc(c.col+"/"+nid).set(copy)}}
  else if(c.kind==="notes"){const ref=db.doc(c.path),sv=await ref.get(),f=sv.exists?JSON.parse(JSON.stringify(sv.data().f||{})):{};
    if(choice!=="server"){for(const r of c.rows)f[r.f]=choice==="local"?r.l:syncMergeVal(r.s,r.l);await ref.set({f});delete notesCache[c.path.slice(6)]}}
  else if(c.kind==="ink"){if(choice==="local")await db.doc(c.path).set(c.local);
    else if(choice==="both"){const a=decInk(c.server),b=decInk(c.local),seen=new Set(a.map(x=>JSON.stringify(x.p)));await db.doc(c.path).set(encInk(a.concat(b.filter(x=>!seen.has(JSON.stringify(x.p))))));}
    delete inkCache[c.path.slice(4)]}
  else if(c.kind==="media"){if(choice==="local")await db.doc(c.path).set(c.local);
    else if(choice==="both"){const a=c.server.m||[],ids=new Set(a.map(x=>x.id));await db.doc(c.path).set({...c.server,m:a.concat((c.local.m||[]).filter(x=>!ids.has(x.id)))})}
    delete mediaCache[c.path.slice(6)]}
  c.done=choice;
  if(!syncConf.some(x=>x.src===c.src&&!x.done)){try{localStorage.removeItem(LSK+c.src)}catch(e){}}}
function openConflicts(){let bg=$("#confBg");if(!bg){bg=document.createElement("div");bg.id="confBg";bg.className="modal-bg";bg.innerHTML=`<div class="modal jmodal cfmodal" role="dialog" aria-modal="true"><button class="jclose" data-cfclose>✕</button><div id="confBody"></div></div>`;document.body.appendChild(bg);
    bg.addEventListener("click",async e=>{const t=e.target;if(t===bg||t.closest("[data-cfclose]")){bg.classList.remove("on");const left=syncConf.filter(x=>!x.done).length;if(left)toast(`⏳ ${left} perbedaan belum dipilih. Akan ditanyakan lagi saat planner dibuka berikutnya.`);else finishConflicts();return}
      const b=t.closest("[data-cf]");if(b){const [i,ch]=b.dataset.cf.split(":");const c=syncConf[+i];if(!c||c.done)return;b.disabled=true;try{await applyConflict(c,ch)}catch(x){err(x)}renderConflicts();if(!syncConf.some(x=>!x.done)){bg.classList.remove("on");finishConflicts()}return}
      const all=t.closest("[data-cfall]");if(all){all.disabled=true;for(const c of syncConf)if(!c.done){try{await applyConflict(c,all.dataset.cfall)}catch(x){err(x)}}renderConflicts();bg.classList.remove("on");finishConflicts()}})}
  renderConflicts();bg.classList.add("on")}
async function finishConflicts(){const n=syncConf.filter(x=>x.done).length;syncConf=[];toast(`✅ ${n} perbedaan versi sudah diselesaikan dan tersimpan di akun.`);try{await go(cur,false)}catch(e){try{renderPage()}catch(_){}}}
function renderConflicts(){const B=$("#confBody");if(!B)return;const left=syncConf.filter(x=>!x.done).length;
  const ch={local:"📱 Versi perangkat ini",server:"☁ Versi akun",both:"🔗 Gabungkan / simpan keduanya"};
  B.innerHTML=`<h2 style="margin:0 0 4px">Ada isian yang berbeda</h2><p class="mt" style="margin:0 0 10px">Isian di bawah ini sempat diubah di perangkat ini saat belum tersambung, padahal di akun (perangkat lain) isinya sudah berbeda. Pilih versi yang mau dipertahankan untuk tiap isian.</p>
  <div class="cfhelp"><span><b>📱 Perangkat ini</b> = isian yang ada di perangkat ini</span><span><b>☁ Akun</b> = isian yang tersimpan di akun / perangkat lain</span><span><b>🔗 Gabungkan</b> = teks disambung, centang yang sudah dicentang tetap, tulisan tangan & gambar disatukan, tugas/transaksi disimpan dua-duanya</span></div>
  ${left>1?`<div class="cfall">Untuk semua (${left}): <button data-cfall="local">📱 Perangkat ini</button><button data-cfall="server">☁ Akun</button><button data-cfall="both">🔗 Gabungkan semua</button></div>`:""}
  ${syncConf.map((c,i)=>`<div class="cfitem${c.done?" done":""}"><div class="cft">${esc(c.title)}</div>
    <table class="cftbl"><tr><th></th><th>📱 Perangkat ini</th><th>☁ Akun</th></tr>${c.rows.slice(0,8).map(r=>`<tr><td>${esc(r.nm)}</td><td>${syncShow(r.l)}</td><td>${syncShow(r.s)}</td></tr>`).join("")}${c.rows.length>8?`<tr><td colspan="3" class="mt">… dan ${c.rows.length-8} isian lain</td></tr>`:""}</table>
    ${c.done?`<div class="cfdone">✔ Dipilih: ${ch[c.done]}</div>`:`<div class="cfbtn"><button data-cf="${i}:local">📱 Pakai versi perangkat ini</button><button data-cf="${i}:server">☁ Pakai versi akun</button><button data-cf="${i}:both" class="pri">🔗 ${c.kind==="item"?"Simpan keduanya":"Gabungkan keduanya"}</button></div>`}</div>`).join("")}`}
/* rata tengah otomatis kolom angka & kelas di tabel planner */
(function(){const NUM=/^[\s\d.,%+\-\u2013\u2014\/:()]+$/,KLS=/^(VIII|VII|IX|XII|XI|X|[1-9])\s*[-.]?\s*[A-Z]?\d?$/i,GRD=/^[A-E][+-]?$/;
  const txt=c=>{const f=c.querySelector("input,select,textarea");return f&&c.children.length===1?String(f.value||f.placeholder||""):c.textContent||""};
  const mark=()=>{document.querySelectorAll("#page td,#page th").forEach(c=>{const t=txt(c).replace(/\s+/g," ").trim();
    const on=c.tagName==="TH"?(c.colSpan>1||t.length<=14):(t!==""&&t.length<=14&&!/Rp/.test(t)&&(NUM.test(t)||KLS.test(t)||GRD.test(t)));c.classList.toggle("al-c",on)})};
  let q=false;const sched=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;try{mark()}catch(e){}})};
  new MutationObserver(sched).observe(document.getElementById("page"),{childList:true,subtree:true});document.addEventListener("input",sched,true);
})();
/* =================== bolak-balik & lompat halaman =================== */
function flipLabels(){const L0=flipLabels0();if(sheetMode&&sheetBreaks.length>1){if(sheetIdx>0)L0[0]="Lembar sebelumnya";if(sheetIdx<sheetBreaks.length-1)L0[1]="Lembar berikutnya"}return L0}
function flipLabels0(){const P=cur.p,secs=Object.entries(PAGES).filter(([k,p])=>p.tab).map(([k])=>k),i=secs.indexOf(P);
  const prevSec=i>0?PAGES[secs[i-1]].title:"Daftar Isi",nextSec=i>=0&&i<secs.length-1?PAGES[secs[i+1]].title:"";
  if(cur.cv)return["Sebelumnya: "+prevSec,"Buka "+PAGES[P].title];
  if(cur.x)return["Sampul "+PAGES[P].title,nextSec?"Sampul "+nextSec:""];
  const m={daily:["Kemarin","Besok"],ibadah:["Kemarin","Besok"],weekly:["Minggu lalu","Minggu depan"],monthly:["Bulan lalu","Bulan depan"],yearly:["Tahun ajaran lalu","Tahun ajaran depan"],
    keuangan:finView==="hari"?["Kemarin","Besok"]:finView==="tahun"?["Tahun lalu","Tahun depan"]:["Bulan lalu","Bulan depan"],catatan:[(cur.n||1)>1?"Halaman "+((cur.n||1)-1):"Sampul Catatan","Halaman "+((cur.n||1)+1)]}[P];
  if(m)return m;if(P==="cover")return["","Daftar Isi"];if(P==="index")return["Sampul depan",nextSec||"Tahunan"];
  return["Sampul "+PAGES[P].title,nextSec?"Sampul "+nextSec:""]}
function updNav(){const app=document.body.classList.contains("appmode"),[a,b]=flipLabels();
  const L=$("#flipL"),R=$("#flipR"),J=$("#jumpBtn");if(!L)return;
  L.style.visibility=app||!a?"hidden":"";R.style.visibility=app||!b?"hidden":"";L.title=a;R.title=b;L.querySelector("small").textContent=a;R.querySelector("small").textContent=b;
  J.querySelector("span").textContent=(PNUM[cur.p]?"Hal. "+PNUM[cur.p]+(cur.cv?" · Sampul":"")+(sheetMode&&sheetBreaks.length>1?" · Lbr "+(sheetIdx+1)+"/"+sheetBreaks.length:"")+" · ":"")+"Lompat ke…"}
function jumpHTML(){const today=ymd(new Date()),dsel=cur.d||today;
  const secs=Object.entries(PAGES).filter(([k,p])=>p.tab);
  const J=o=>esc(JSON.stringify(o));
  const card=([k,p])=>{let chips="";
    const ex=extraList(k);if(ex.length)chips+=ex.map((e,i)=>{const n=notesCache[k+"~"+e.id];const t=(n&&n.f&&n.f.judul)||e.title||("Halaman "+(i+2));return `<button data-jgo="${J({p:k,x:e.id})}">${e.t==="blank"?"📝":"📄"} ${esc(t)}</button>`}).join("");
    if(k==="s2")chips+=MK.map(m=>`<button data-jgo="${J({p:"s2"})}" data-jmk="${m.k}"><i style="background:${m.c}"></i>${m.s}</button>`).join("");
    if(k==="catatan"){const n=Math.max(1,catMax());for(let i=1;i<=Math.min(n,30);i++)chips+=`<button data-jgo="${J({p:"catatan",n:i})}">Hal. ${i}</button>`}
    return `<div class="jcard" data-jtxt="${esc((p.title+" "+(SECKICK[k]||"")+" "+(k==="s2"?MK.map(m=>m.n+" "+m.s).join(" "):"")).toLowerCase())}" style="--c:${p.tab}">
      <div class="jh"><span class="jn">${String(PNUM[k]).padStart(2,"0")}</span><b>${p.icon||""} ${p.title}</b></div>
      <div class="jb"><button data-jgo="${J({p:k,cv:1})}">📘 Sampul</button><button class="pri" data-jgo="${J(p.app?{p:k}:{p:k})}">Isi ›</button></div>${chips?`<div class="jchips">${chips}</div>`:""}</div>`};
  const seen=new Set(),rec=[...navStack].reverse().filter(pg=>{const kk=pageKey(pg);if(seen.has(kk)||kk===pageKey(cur))return false;seen.add(kk);return true}).slice(0,6);
  const lab=pg=>{const t=PAGES[pg.p]?PAGES[pg.p].title:pg.p;if(pg.cv)return"📘 Sampul "+t;if(pg.x)return t+" · halaman tambahan";if(pg.d&&["daily","ibadah"].includes(pg.p))return t+" · "+fmtShort(parseD(pg.d));if(pg.p==="catatan")return"Catatan hal. "+(pg.n||1);return t};
  return `<h2>🔖 Pergi ke halaman</h2>
    <div class="jview"><b>Tampilan halaman:</b><button data-jview="1" class="${sheetMode?"on":""}">📄 Lembar (flip kiri–kanan)</button><button data-jview="0" class="${!sheetMode?"on":""}">📜 Gulir (memanjang ke bawah)</button></div>
    <input class="jsearch" id="jSearch" placeholder="Cari bagian… (mis. ibadah, MPK, keuangan)">
    <div class="jdate"><b>📅 Ke tanggal</b><input type="date" id="jDate" value="${dsel}"><button data-jd="daily">Harian</button><button data-jd="weekly">Mingguan</button><button data-jd="monthly">Bulanan</button><button data-jd="ibadah">Ibadah</button><button data-jd="keuangan">Keuangan</button><button data-jtoday>☀️ Hari ini</button></div>
    ${rec.length?`<div class="jrec"><b>🕘 Terakhir dibuka</b>${rec.map(pg=>`<button data-jgo="${J(pg)}">${esc(lab(pg))}</button>`).join("")}</div>`:""}
    <div class="jgrid"><div class="jcard" data-jtxt="sampul depan daftar isi cover" style="--c:#c9ad8c"><div class="jh"><span class="jn">01</span><b>📔 Sampul & Daftar Isi</b></div><div class="jb"><button data-jgo="${J({p:"cover"})}">Sampul depan</button><button class="pri" data-jgo="${J({p:"index"})}">Daftar Isi ›</button></div></div>${secs.map(card).join("")}</div>`}
function openJump(){let bg=$("#jumpBg");if(!bg){bg=document.createElement("div");bg.id="jumpBg";bg.className="modal-bg";bg.innerHTML=`<div class="modal jmodal" role="dialog" aria-modal="true"><button class="jclose" data-jclose>✕</button><div id="jumpBody"></div></div>`;document.body.appendChild(bg);
    bg.addEventListener("click",e=>{const t=e.target;if(t===bg||t.closest("[data-jclose]")){bg.classList.remove("on");return}
      const g=t.closest("[data-jgo]");if(g){bg.classList.remove("on");const pg=JSON.parse(g.dataset.jgo);if(g.dataset.jmk){s2Tab=g.dataset.jmk;try{localStorage.setItem(LSK+"s2tab",s2Tab)}catch(x){}}go(pg);return}
      const jd=t.closest("[data-jd]");if(jd){const d=$("#jDate").value||ymd(new Date());bg.classList.remove("on");go({p:jd.dataset.jd,d});return}
      const jv=t.closest("[data-jview]");if(jv){bg.classList.remove("on");setSheetMode(jv.dataset.jview==="1");return}
      if(t.closest("[data-jtoday]")){bg.classList.remove("on");go({p:"daily",d:ymd(new Date())});return}});
    bg.addEventListener("input",e=>{if(e.target.id!=="jSearch")return;const q=e.target.value.toLowerCase().trim();bg.querySelectorAll(".jcard").forEach(c=>c.style.display=!q||c.dataset.jtxt.includes(q)||c.textContent.toLowerCase().includes(q)?"":"none")});}
  $("#jumpBody").innerHTML=jumpHTML();bg.classList.add("on");setTimeout(()=>{const s=$("#jSearch");if(s&&!matchMedia("(pointer:coarse)").matches)s.focus()},50)}
document.getElementById("jumpRail").onclick=()=>openJump();
document.getElementById("sheetBtn").onclick=()=>setSheetMode(!sheetMode);
(()=>{const b=$("#sheetBtn");b.querySelector("i").textContent=sheetMode?"📄":"📜";b.querySelector("small").textContent=sheetMode?"Lembar":"Gulir";document.body.classList.toggle("sheetmode",sheetMode)})();
(function(){const mk=(id,cls,html,fn)=>{const b=document.createElement("button");b.id=id;b.className=cls;b.type="button";b.innerHTML=html;b.onclick=fn;document.body.appendChild(b);return b};
  const bar=document.createElement("div");bar.id="navBar";document.body.appendChild(bar);
  const add=(id,cls,html,fn)=>{const b=document.createElement("button");b.id=id;b.className=cls;b.type="button";b.innerHTML=html;b.onclick=fn;bar.appendChild(b);return b};
  add("flipL","flipbtn",`<i>‹</i><small></small>`,()=>turnPage(-1));add("jumpBtn","jumpbtn",`🔖 <span>Lompat ke…</span>`,openJump);add("flipR","flipbtn",`<small></small><i>›</i>`,()=>turnPage(1))})();
document.addEventListener("keydown",e=>{if(e.target.matches&&e.target.matches("input,textarea,select,[contenteditable]")||e.ctrlKey||e.metaKey||e.altKey)return;
  if(document.querySelector(".modal-bg.on"))return;if(document.body.classList.contains("appmode"))return;
  if(e.key==="ArrowRight"||e.key==="PageDown"){e.preventDefault();turnPage(1)}else if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();turnPage(-1)}
  else if(e.key==="g"||e.key==="G"){e.preventDefault();openJump()}});

/* =================== boot =================== */
async function connectDb(){
  for(let i=0;i<5;i++){
    try{if(window.claude&&claude.use){const d=await claude.use("db");await d.doc("notes/meta").get();return d}}catch(e){console.warn("db connect",i,e)}
    await new Promise(r=>setTimeout(r,800*(i+1)));
  }
  return null;
}
function showOffline(){
  if(document.getElementById("offBar"))return;
  const b=document.createElement("div");b.id="offBar";
  b.innerHTML=`<b>⚠️ Planner belum tersambung ke akun Claude Ibu</b><span>Data Ibu aman di akun, tapi belum bisa dimuat di perangkat ini. Pastikan sudah masuk (login) ke claude.ai dengan akun yang sama, buka lewat browser Chrome/Safari, lalu ketuk <i>Sambungkan lagi</i>. Isian yang dibuat sebelum tersambung hanya tersimpan di perangkat ini.</span><button id="offRetry">🔄 Sambungkan lagi</button>`;
  document.body.appendChild(b);
  b.querySelector("#offRetry").onclick=()=>location.reload();
}
(async()=>{
  applyBook();if(bookMode)showIntro();
  let last=null;try{last=JSON.parse(localStorage.getItem(LSK+"last")||"null")}catch(e){}
  db=await connectDb();
  try{assetsNS=window.claude&&claude.use?await claude.use("assets"):null}catch(e){assetsNS=null}
  await loadMySt();
  try{notesCache.meta=(await backend.get("notes/meta"))||{f:{}};notesCache.meta.f=notesCache.meta.f||{}}catch(e){notesCache.meta={f:{}}}
  if(!db){fin=(await local.get("fin"))||[];aset=(await local.get("aset"))||[];emas=(await local.get("emas"))||[];items=(await local.get("items"))||[];$("#status").textContent="⚠️ Belum tersambung ke akun";showOffline();await go(last||{p:"cover"},false);checkLive();return}
  await go(last||{p:"cover"},false);
  syncLocalToCloud().catch(()=>{});
  try{db.doc("notes/meta").onSnapshot(snap=>{if(!snap.exists||snap.metadata.hasPendingWrites||snap.metadata.fromCache||pendingSaves["notes/meta"]||writing["notes/meta"])return;const d=JSON.parse(JSON.stringify(snap.data()));if(JSON.stringify(d)!==JSON.stringify(notesCache.meta)){notesCache.meta=d;notesCache.meta.f=notesCache.meta.f||{};if(!document.activeElement||!document.activeElement.matches("[data-f]"))renderPage()}},()=>{})}catch(e){}
  const timer=setTimeout(()=>{$("#status").textContent="Data belum termuat…"},10000);
  db.collection("emas").onSnapshot(snap=>{emas=snap.docs.map(d=>({id:d.id,...JSON.parse(JSON.stringify(d.data()))}));if(["keuangan","daily"].includes(cur.p)&&(!document.activeElement||!document.activeElement.matches("[data-f]")))refreshAuto()},()=>{});
  db.collection("aset").onSnapshot(snap=>{aset=snap.docs.map(d=>({id:d.id,...JSON.parse(JSON.stringify(d.data()))}));if(cur.p==="keuangan"&&(!document.activeElement||!document.activeElement.matches("[data-f]")))refreshAuto()},()=>{});
  db.collection("fin").onSnapshot(snap=>{fin=snap.docs.map(d=>({id:d.id,...JSON.parse(JSON.stringify(d.data()))}));if(["keuangan","daily"].includes(cur.p)&&(!document.activeElement||!document.activeElement.matches("[data-f]")))refreshAuto()},()=>{});
  db.collection("planner").onSnapshot(snap=>{
    items=snap.docs.map(d=>({id:d.id,...JSON.parse(JSON.stringify(d.data()))}));
    if(!snap.metadata.fromCache){clearTimeout(timer);$("#status").textContent="☁ Tersimpan otomatis"}
    if(!document.activeElement||!document.activeElement.matches("[data-f]"))refreshAuto();
    checkLive();
  },e=>{clearTimeout(timer);$("#status").textContent="Penyimpanan tidak tersedia"});
})();
