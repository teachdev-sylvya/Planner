/* =====================================================================
   Planner Devy — penyimpanan terenkripsi + sinkron GitHub Gist
   Menggantikan penyimpanan Claude (window.claude.use) agar aplikasi bisa
   dibuka langsung dari GitHub Pages. Semua data dienkripsi AES-GCM 256
   dengan kunci dari kata sandi (PBKDF2-SHA256).
   ===================================================================== */
(function(){
"use strict";
window.__plannerDevy=true;
const APPNAME="planner-devy", GIST_DESC="Planner Devy — data terenkripsi (jangan dihapus)", META_FILE="pdv-meta.json";
const ITER=250000, CHUNK=700000, BATCH=5, ASSET_SYNC_MAX=30*1024*1024, ASSET_DESC="Planner Devy — file terenkripsi ";
const enc=new TextEncoder(), dec=new TextDecoder();
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));

/* ---------------- IndexedDB ---------------- */
let IDB=null;
function idb(){if(IDB)return Promise.resolve(IDB);return new Promise((res,rej)=>{const r=indexedDB.open("planner-devy",1);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains("kv"))d.createObjectStore("kv");if(!d.objectStoreNames.contains("aset"))d.createObjectStore("aset")};r.onsuccess=()=>{IDB=r.result;res(IDB)};r.onerror=()=>rej(r.error)})}
async function kvGet(k,st="kv"){const d=await idb();return new Promise((res,rej)=>{const q=d.transaction(st).objectStore(st).get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
async function kvSet(k,v,st="kv"){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction(st,"readwrite");t.objectStore(st).put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
async function kvDel(k,st="kv"){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction(st,"readwrite");t.objectStore(st).delete(k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
async function kvClear(){const d=await idb();for(const st of ["kv","aset"])await new Promise(res=>{const t=d.transaction(st,"readwrite");t.objectStore(st).clear();t.oncomplete=res;t.onerror=res})}
async function kvKeys(st){const d=await idb();return new Promise((res,rej)=>{const q=d.transaction(st).objectStore(st).getAllKeys();q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}

/* ---------------- kripto ---------------- */
const b64e=buf=>{const u=buf instanceof Uint8Array?buf:new Uint8Array(buf);let s="";for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
const b64d=s=>{const b=atob(s);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u};
const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
async function kek(pw,salt,iter){const base=await crypto.subtle.importKey("raw",enc.encode(pw),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:iter,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"])}
async function aesEnc(key,bytes){const iv=rnd(12);const ct=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},key,bytes));const o=new Uint8Array(12+ct.length);o.set(iv);o.set(ct,12);return o}
async function aesDec(key,bytes){const u=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);return new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM",iv:u.subarray(0,12)},key,u.subarray(12)))}
const GZ=typeof CompressionStream!=="undefined"&&typeof DecompressionStream!=="undefined";
async function gz(u){if(!GZ)return u;return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer())}
async function gunz(u){return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer())}
/* data dikemas: 1 byte flag (1=gzip) + isi */
async function pack(obj){const raw=enc.encode(JSON.stringify(obj));const z=GZ?await gz(raw):raw;const o=new Uint8Array(z.length+1);o[0]=GZ?1:0;o.set(z,1);return aesEnc(DK,o)}
async function unpack(bytes){const p=await aesDec(DK,bytes);const body=p.subarray(1);const raw=p[0]===1?await gunz(body):body;return JSON.parse(dec.decode(raw))}

/* ---------------- status kunci ---------------- */
let DK=null, DKRAW=null, META=null; // META lokal: {salt,iter,wdk}
let DOCS={};      // path -> {t, d}  (d=null => dihapus)
let ASSETS={};    // id -> {type,size,t,del}
const URLS={};    // id -> objectURL
let REV=0; const DREV={};
let UNLOCKED=false; const waiters=[];
function whenUnlocked(){return UNLOCKED?Promise.resolve():new Promise(r=>waiters.push(r))}

/* ---------------- penyimpanan lokal ---------------- */
let saveTimer=null,saving=false,saveAgain=false;
function snapshot(){const docs={};for(const p in DOCS)docs[p]=[DOCS[p].t,DOCS[p].d];return {v:1,docs,assets:ASSETS}}
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(saveLocal,1200)}
async function saveLocal(){if(!DK)return;if(saving){saveAgain=true;return}saving=true;try{do{saveAgain=false;const b=await pack(snapshot());await kvSet("snap",b)}while(saveAgain)}catch(e){console.warn("simpan lokal",e);status("⚠️ Gagal simpan lokal")}saving=false}
function loadSnap(o){DOCS={};ASSETS=(o&&o.assets)||{};for(const p in (o&&o.docs)||{}){const [t,d]=o.docs[p];DOCS[p]={t,d}}}

/* ---------------- shim penyimpanan (API seperti claude db) ---------------- */
const docL={}, colL={}; let emitQ=new Set(), emitT=null;
const colOf=p=>p.slice(0,p.indexOf("/")), idOf=p=>p.slice(p.lastIndexOf("/")+1);
function dsnap(p){const e=DOCS[p];const ex=!!(e&&e.d!=null);return {exists:ex,id:idOf(p),ref:docRef(p),data:()=>ex?clone(e.d):undefined,get:k=>ex&&e.d?clone(e.d[k]):undefined,metadata:{fromCache:false,hasPendingWrites:false}}}
function touch(p){REV++;DREV[p]=REV;emitQ.add(p);if(!emitT)emitT=setTimeout(flushEmit,0)}
function flushEmit(){emitT=null;const ps=[...emitQ];emitQ=new Set();const cols=new Set();
  ps.forEach(p=>{(docL[p]||[]).slice().forEach(l=>{try{l.cb(dsnap(p))}catch(e){console.error(e)}});cols.add(colOf(p))});
  cols.forEach(c=>(colL[c]||[]).slice().forEach(l=>emitCol(c,l)))}
function colDocs(c,lim){const pre=c+"/";const out=[];for(const p in DOCS){if(p.startsWith(pre)&&DOCS[p].d!=null&&p.indexOf("/",pre.length)<0)out.push(p)}out.sort();return lim?out.slice(0,lim):out}
function qsnap(c,lim,changes){const ds=colDocs(c,lim).map(dsnap);return {docs:ds,size:ds.length,empty:!ds.length,forEach:f=>ds.forEach(f),docChanges:()=>changes||ds.map(d=>({type:"added",doc:d})),metadata:{fromCache:false,hasPendingWrites:false}}}
function emitCol(c,l){const cur=new Set(colDocs(c,l.lim));const ch=[];
  cur.forEach(p=>{if(!l.known.has(p))ch.push({type:"added",doc:dsnap(p)});else if((DREV[p]||0)>l.rev)ch.push({type:"modified",doc:dsnap(p)})});
  l.known.forEach(p=>{if(!cur.has(p))ch.push({type:"removed",doc:dsnap(p)})});
  l.known=cur;l.rev=REV;if(!ch.length&&!l.first)return;l.first=false;try{l.cb(qsnap(c,l.lim,ch))}catch(e){console.error(e)}}
function put(p,d,t){DOCS[p]={t:t||Date.now(),d:d==null?null:clone(d)};touch(p);changed(colOf(p))}
function docRef(p){return {id:idOf(p),path:p,
  get:async()=>{await whenUnlocked();return dsnap(p)},
  set:async(d,o)=>{await whenUnlocked();if(o&&o.merge&&DOCS[p]&&DOCS[p].d)d=Object.assign(clone(DOCS[p].d),clone(d));put(p,d)},
  update:async d=>{await whenUnlocked();const base=DOCS[p]&&DOCS[p].d?clone(DOCS[p].d):{};put(p,Object.assign(base,clone(d)))},
  delete:async()=>{await whenUnlocked();if(DOCS[p])put(p,null)},
  onSnapshot:(cb,err)=>{const l={cb};(docL[p]=docL[p]||[]).push(l);whenUnlocked().then(()=>setTimeout(()=>{try{cb(dsnap(p))}catch(e){console.error(e)}},0));return ()=>{docL[p]=(docL[p]||[]).filter(x=>x!==l)}}}}
function colRef(c,lim){return {id:c,path:c,doc:id=>docRef(c+"/"+(id||Math.random().toString(36).slice(2,12))),limit:n=>colRef(c,n),
  get:async()=>{await whenUnlocked();return qsnap(c,lim)},
  add:async d=>{await whenUnlocked();const id=Math.random().toString(36).slice(2,12);put(c+"/"+id,d);return docRef(c+"/"+id)},
  onSnapshot:(cb,err)=>{const l={cb,lim,known:new Set(),rev:0,first:true};(colL[c]=colL[c]||[]).push(l);whenUnlocked().then(()=>setTimeout(()=>emitCol(c,l),0));return ()=>{colL[c]=(colL[c]||[]).filter(x=>x!==l)}}}}
const dbApi={doc:docRef,collection:c=>colRef(c)};

/* ---------------- file / aset ---------------- */
async function putAsset(id,blob,opt){const b=new Uint8Array(await blob.arrayBuffer());const e=await aesEnc(DK,b);await kvSet(id,e,"aset");
  ASSETS[id]={type:blob.type||(opt&&opt.type)||"application/octet-stream",size:b.length,t:Date.now()};try{if(URLS[id])URL.revokeObjectURL(URLS[id])}catch(e){}URLS[id]=URL.createObjectURL(new Blob([b],{type:ASSETS[id].type}));scheduleSave();changed("~aset")}
async function loadAssetURL(id){if(URLS[id])return URLS[id];const e=await kvGet(id,"aset");if(!e)return null;const b=await aesDec(DK,e);URLS[id]=URL.createObjectURL(new Blob([b],{type:(ASSETS[id]&&ASSETS[id].type)||""}));return URLS[id]}
async function loadAllAssetURLs(){for(const id in ASSETS){if(ASSETS[id].del)continue;try{await loadAssetURL(id)}catch(e){}}}
window.__pdvBlob=id=>URLS[id]||("data:text/plain,"+encodeURIComponent("File belum tersedia di perangkat ini"));
const assetsApi={
  upload:async(blob,opt)=>{await whenUnlocked();const id=[...rnd(16)].map(x=>x.toString(16).padStart(2,"0")).join("");await putAsset(id,blob,opt);return {id,url:URLS[id],contentType:ASSETS[id].type,sizeBytes:ASSETS[id].size}},
  delete:async id=>{await whenUnlocked();if(ASSETS[id]){ASSETS[id]={...ASSETS[id],del:true,t:Date.now()};await kvDel(id,"aset");try{URL.revokeObjectURL(URLS[id])}catch(e){}delete URLS[id];scheduleSave();changed("~aset")}},
  url:id=>URLS[id]||null};

/* ---------------- unduhan ---------------- */
const dlApi={save:async o=>{let d=o.data;let blob=d instanceof Blob?d:new Blob([d],{type:o.mimeType||o.type||(/\.json$/i.test(o.filename)?"application/json":/\.pdf$/i.test(o.filename)?"application/pdf":"application/octet-stream")});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=o.filename||"unduhan";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);return true}};
const userApi={can:async()=>true,id:async()=>"devy",name:async()=>"Devy Sylvya",me:async()=>({id:"devy",name:"Devy Sylvya"})};

/* window.claude pengganti — dipakai planner & aplikasi di dalamnya */
const api={use:async n=>{await whenUnlocked();if(n==="db")return dbApi;if(n==="assets")return assetsApi;if(n==="downloads")return dlApi;if(n==="user")return userApi;return null}};
try{Object.defineProperty(window,"claude",{value:api,writable:true,configurable:true})}catch(e){window.claude=api}

/* ================== sinkron GitHub Gist ================== */
let CFG={};           // {token,gistId,login,lastT,cols:{name:t},sentCols:{name:t},sentAssets:{id:1}}
const DIRTY=new Set(); let pushT=null,syncing=false,syncAgain=false,lastErr="";
async function saveCfg(){await kvSet("cfg",CFG)}
function changed(col){DIRTY.add(col);scheduleSave();schedulePush()}
function schedulePush(ms){if(!CFG.token)return;clearTimeout(pushT);pushT=setTimeout(()=>sync(),ms==null?8000:ms);status()}
async function gh(path,opt){const r=await fetch("https://api.github.com"+path,Object.assign({},opt,{headers:Object.assign({"Accept":"application/vnd.github+json","Authorization":"Bearer "+CFG.token},opt&&opt.body?{"Content-Type":"application/json"}:{})}));
  if(!r.ok){const t=await r.text().catch(()=>"");const e=new Error(r.status===401?"Token GitHub tidak valid / kedaluwarsa":r.status===404?"Gist tidak ditemukan":"GitHub "+r.status+" "+t.slice(0,120));e.status=r.status;throw e}return r.status===204?null:r.json()}
async function findGist(){let page=1;while(page<6){const l=await gh("/gists?per_page=100&page="+page);if(!l.length)break;const g=l.find(x=>x.description===GIST_DESC||(x.files&&x.files[META_FILE]));if(g)return g.id;page++}return null}
async function gistFile(g,name){const f=g.files&&g.files[name];if(!f)return null;if(!f.truncated&&f.content!=null)return f.content;const r=await fetch(f.raw_url);if(!r.ok)throw new Error("Gagal mengambil "+name);return r.text()}
const colFiles=(name,n)=>Array.from({length:n},(_,k)=>"c~"+name.replace(/[^A-Za-z0-9_-]/g,"_")+"~"+k+".txt");
const astFiles=(id,n)=>Array.from({length:n},(_,k)=>"a~"+id+"~"+k+".txt");
function splitStr(s){const out=[];for(let i=0;i<s.length;i+=CHUNK)out.push(s.slice(i,i+CHUNK));return out.length?out:[""]}
function colGroup(c){return c.startsWith("~")?c:c} // nama koleksi = nama grup
function docsOfCol(c){const o={};const pre=c+"/";for(const p in DOCS)if(p.startsWith(pre))o[p]=[DOCS[p].t,DOCS[p].d];return o}
async function remoteMeta(g){const t=await gistFile(g,META_FILE);return t?JSON.parse(t):null}

async function sync(){
  if(!CFG.token||!DK)return;if(syncing){syncAgain=true;return}syncing=true;clearTimeout(pushT);status("🔄 Menyinkronkan…");
  try{do{syncAgain=false;await syncOnce()}while(syncAgain);lastErr="";CFG.lastOk=Date.now();await saveCfg();status()}
  catch(e){console.warn("sinkron",e);lastErr=String(e&&e.message||e);status("⚠️ "+lastErr)}
  syncing=false}
async function syncOnce(){
  if(!CFG.login){const u=await gh("/user");CFG.login=u.login;await saveCfg()}
  if(!CFG.gistId){CFG.gistId=await findGist();await saveCfg()}
  let g=null,rm=null;
  if(CFG.gistId){g=await gh("/gists/"+CFG.gistId);rm=await remoteMeta(g)}
  if(rm&&rm.app===APPNAME){
    if(rm.wdk!==META.wdk)throw new Error("Data di GitHub memakai kata sandi lain. Buka Pengaturan sinkron → sambungkan ulang.");
    /* tarik koleksi yang lebih baru di GitHub */
    let got=0;
    for(const name in (rm.cols||{})){const rc=rm.cols[name];if((CFG.cols||{})[name]===rc.t)continue;
      const parts=[];for(const f of colFiles(name,rc.n)){const s=await gistFile(g,f);if(s==null)throw new Error("File data "+f+" hilang");parts.push(s)}
      const obj=await unpack(b64d(parts.join("")));
      if(name==="~aset"){for(const id in obj){const r=obj[id],l=ASSETS[id];if(!l||r.t>l.t){ASSETS[id]=r;if(r.del){await kvDel(id,"aset");delete URLS[id]}}}}
      else for(const p in obj){const [t,d]=obj[p];const l=DOCS[p];if(!l||t>l.t){DOCS[p]={t,d};touch(p);got++}}
      CFG.cols=CFG.cols||{};CFG.cols[name]=rc.t}
    /* ambil file yang belum ada di perangkat ini */
    for(const id in (rm.assets||{})){if(ASSETS[id]&&ASSETS[id].del)continue;if(await kvGet(id,"aset"))continue;const ra=rm.assets[id];
      try{const ag=ra.g?await gh("/gists/"+ra.g):g;const parts=[];for(const f of astFiles(id,ra.n)){const x=await gistFile(ag,f);if(x==null)throw new Error("potongan file hilang");parts.push(x)}const e=b64d(parts.join(""));await kvSet(id,e,"aset");if(!ASSETS[id])ASSETS[id]={type:ra.type,size:ra.size,t:ra.t||1};await loadAssetURL(id)}catch(e){console.warn("aset",id,e)}}
    if(got){scheduleSave();status("⬇️ "+got+" perubahan dari perangkat lain")}
  }
  /* kirim koleksi yang berubah di perangkat ini */
  const meta=rm&&rm.app===APPNAME?rm:{app:APPNAME,v:1,salt:META.salt,iter:META.iter,wdk:META.wdk,cols:{},assets:{}};
  const files={};let any=false;
  const allCols=new Set(Object.keys(DOCS).map(colOf));allCols.add("~aset");
  for(const name of allCols){
    const need=DIRTY.has(name)||!meta.cols[name]||!(CFG.cols&&CFG.cols[name]);if(!need)continue;
    let obj;if(name==="~aset")obj=ASSETS;else{obj=docsOfCol(name);
      /* gabung dengan versi GitHub yang sudah ditarik: ambil yang terbaru per dokumen (sudah di DOCS) */}
    const s=b64e(await pack(obj));const parts=splitStr(s);const old=meta.cols[name]?meta.cols[name].n:0;
    colFiles(name,parts.length).forEach((f,k)=>files[f]={content:parts[k]});for(let k=parts.length;k<old;k++)files[colFiles(name,old)[k]]=null;
    const t=Date.now();meta.cols[name]={n:parts.length,t};CFG.cols=CFG.cols||{};CFG.cols[name]=t;any=true}
  /* file/aset baru */
  const astUploads=[];
  for(const id in ASSETS){const a=ASSETS[id];
    if(a.del){if(meta.assets[id]){const ma=meta.assets[id];if(ma.g){try{await gh("/gists/"+ma.g,{method:"DELETE"})}catch(e){}}else astFiles(id,ma.n).forEach(f=>files[f]=null);delete meta.assets[id];any=true}continue}
    if(meta.assets[id]||a.size>ASSET_SYNC_MAX)continue;const e=await kvGet(id,"aset");if(!e)continue;astUploads.push([id,e])}
  if(any||astUploads.length||!rm){
    if(any||!rm){meta.t=Date.now();files[META_FILE]={content:JSON.stringify(meta)};await writeGist(files)}
    /* aset dikirim satu per satu supaya permintaan tidak terlalu besar */
    /* tiap file disimpan di gist tersendiri supaya sinkron data harian tetap ringan */
    let ui=0;for(const [id,e] of astUploads){ui++;const parts=splitStr(b64e(e));const names=astFiles(id,parts.length);let gid=null;
      for(let k=0;k<parts.length;k+=BATCH){status("⬆️ Mengirim file "+ui+"/"+astUploads.length+(parts.length>BATCH?" ("+Math.round(k/parts.length*100)+"%)":"")+"…");
        const f={};for(let m=k;m<Math.min(k+BATCH,parts.length);m++)f[names[m]]={content:parts[m]};
        if(!gid){const r=await gh("/gists",{method:"POST",body:JSON.stringify({description:ASSET_DESC+id.slice(0,8),public:false,files:f})});gid=r.id}
        else await gh("/gists/"+gid,{method:"PATCH",body:JSON.stringify({files:f})})}
      meta.assets[id]={g:gid,n:parts.length,type:ASSETS[id].type,size:ASSETS[id].size,t:ASSETS[id].t};meta.t=Date.now();await writeGist({[META_FILE]:{content:JSON.stringify(meta)}})}
  }
  DIRTY.clear();await saveCfg()}
async function writeGist(files){
  if(!CFG.gistId){const g=await gh("/gists",{method:"POST",body:JSON.stringify({description:GIST_DESC,public:false,files:Object.fromEntries(Object.entries(files).filter(([k,v])=>v))})});CFG.gistId=g.id;await saveCfg()}
  else await gh("/gists/"+CFG.gistId,{method:"PATCH",body:JSON.stringify({description:GIST_DESC,files})})}

/* ================== tampilan ================== */
const CSS=`
#pdvLock{position:fixed;inset:0;z-index:100000;background:#f8f3ea;background-image:radial-gradient(rgba(125,156,200,.18) 1px,transparent 1px);background-size:12px 12px;display:flex;align-items:center;justify-content:center;padding:18px;font-family:Nunito,system-ui,sans-serif;color:#24395f}
#pdvLock .bx{background:#fffdf8;border:2px solid #d6e1ef;border-radius:22px;box-shadow:0 10px 30px rgba(36,57,95,.15);padding:26px 24px;width:min(420px,100%);text-align:center}
#pdvLock img{width:86px;height:86px;border-radius:50%;object-fit:cover;object-position:top;background:#f4ead9;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.18)}
#pdvLock h1{font-family:Kalam,cursive;font-size:30px;margin:8px 0 2px}
#pdvLock p{margin:6px 0;font-size:14px;color:#4a5a75;line-height:1.5}
#pdvLock input{width:100%;box-sizing:border-box;margin:6px 0;padding:12px 14px;border:1.5px solid #c7d4e7;border-radius:12px;font-size:16px;background:#fff;color:#24395f}
#pdvLock .row{display:flex;align-items:center;gap:8px;justify-content:center;font-size:13.5px;margin:6px 0;color:#4a5a75}
#pdvLock .row input{width:auto;margin:0}
.pdvB{display:block;width:100%;margin:8px 0 0;padding:12px;border-radius:12px;border:1.5px solid #3f5f8f;background:#3f5f8f;color:#fff;font:700 15px Nunito,system-ui,sans-serif;cursor:pointer}
.pdvB.l{background:#fff;color:#24395f}.pdvB.r{background:#fff;color:#b42318;border-color:#e6b4ae}
#pdvLock .err{color:#b42318;font-weight:700;min-height:20px;font-size:13.5px}
#pdvLock a{color:#3f5f8f;cursor:pointer;font-size:13.5px;text-decoration:underline}
#pdvCloud{position:fixed;left:86px;bottom:10px;z-index:9990;background:#fffdf8;border:1.5px solid #c7d4e7;border-radius:999px;padding:6px 12px;font:700 12.5px Nunito,system-ui,sans-serif;color:#24395f;box-shadow:0 2px 8px rgba(36,57,95,.15);cursor:pointer;max-width:70vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.appmode #pdvCloud{bottom:auto;top:10px;left:auto;right:10px;opacity:.85}
#pdvPanel{position:fixed;inset:0;z-index:99990;background:rgba(36,57,95,.35);display:none;align-items:center;justify-content:center;padding:14px;font-family:Nunito,system-ui,sans-serif;color:#24395f}
#pdvPanel .bx{background:#fffdf8;border-radius:20px;padding:20px;width:min(520px,100%);max-height:92vh;overflow:auto;box-shadow:0 10px 40px rgba(0,0,0,.25)}
#pdvPanel h2{font-family:Kalam,cursive;margin:0 0 6px;font-size:26px}
#pdvPanel h3{margin:16px 0 4px;font-size:15px}
#pdvPanel p,#pdvPanel li{font-size:13.5px;line-height:1.5;color:#4a5a75}
#pdvPanel input[type=text],#pdvPanel input[type=password]{width:100%;box-sizing:border-box;padding:10px 12px;border:1.5px solid #c7d4e7;border-radius:10px;font-size:14px;margin:4px 0}
#pdvPanel .st{background:#eef3fa;border-radius:12px;padding:10px 12px;font-size:13.5px}
#pdvPanel .x{float:right;border:none;background:none;font-size:22px;cursor:pointer;color:#7a8496}
`;
function el(h){const d=document.createElement("div");d.innerHTML=h.trim();return d.firstChild}
let stMsg="";
function status(m){if(m!=null)stMsg=m;const b=$("#pdvCloud");if(!b)return;let t;
  if(syncing)t=stMsg&&stMsg.startsWith("⬆️")?stMsg:"🔄 Menyinkronkan…";else if(stMsg&&stMsg.startsWith("⚠️"))t=stMsg;else if(!CFG.token)t="🔒 Tersimpan di perangkat · sinkron belum aktif";
  else if(pushT||DIRTY.size)t="⏳ Menunggu sinkron…";else t="☁ Tersinkron"+(CFG.lastOk?" "+new Date(CFG.lastOk).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):"");
  b.textContent=t}
function lockUI(mode,msg){
  let w=$("#pdvLock");if(!w){w=el('<div id="pdvLock"></div>');document.body.appendChild(w)}
  const head=`<img src="devy.png" alt=""><h1>Planner Devy</h1>`;
  if(mode==="unlock")w.innerHTML=`<div class="bx">${head}<p>Masukkan kata sandi untuk membuka planner.</p><input id="pw" type="password" autocomplete="current-password" placeholder="Kata sandi"><label class="row"><input id="rem" type="checkbox" checked> Ingat di perangkat ini</label><div class="err">${esc(msg||"")}</div><button class="pdvB" id="go">Buka</button><p style="margin-top:14px"><a id="forgot">Lupa kata sandi?</a></p></div>`;
  else if(mode==="new")w.innerHTML=`<div class="bx">${head}<p>Selamat datang! Pilih cara memulai:</p><button class="pdvB" id="mNew">Mulai baru di perangkat ini</button><button class="pdvB l" id="mJoin">Sambungkan ke data yang sudah ada (dari HP/laptop lain)</button><p style="margin-top:12px;font-size:12.5px">Semua data dienkripsi dengan kata sandi Ibu. Tanpa kata sandi, isinya tidak bisa dibaca siapa pun.</p></div>`;
  else if(mode==="create")w.innerHTML=`<div class="bx">${head}<p><b>Buat kata sandi</b><br>Kata sandi ini dipakai untuk membuka planner di semua perangkat. <b>Simpan baik-baik</b>: kalau lupa, data tidak bisa dibuka.</p><input id="pw1" type="password" autocomplete="new-password" placeholder="Kata sandi (min. 8 karakter)"><input id="pw2" type="password" autocomplete="new-password" placeholder="Ulangi kata sandi"><label class="row"><input id="rem" type="checkbox" checked> Ingat di perangkat ini</label><div class="err">${esc(msg||"")}</div><button class="pdvB" id="go">Simpan & buka planner</button><button class="pdvB l" id="back">Kembali</button></div>`;
  else if(mode==="join")w.innerHTML=`<div class="bx">${head}<p><b>Sambungkan ke data yang sudah ada</b><br>Isi token GitHub (yang sama dengan di perangkat lain) dan kata sandi planner.</p><input id="tk" type="password" placeholder="Token GitHub (ghp_… / github_pat_…)"><input id="pw" type="password" placeholder="Kata sandi planner"><label class="row"><input id="rem" type="checkbox" checked> Ingat di perangkat ini</label><div class="err">${esc(msg||"")}</div><button class="pdvB" id="go">Sambungkan</button><button class="pdvB l" id="back">Kembali</button></div>`;
  else if(mode==="busy")w.innerHTML=`<div class="bx">${head}<p>${esc(msg||"Membuka…")}</p></div>`;
  else if(mode==="forgot")w.innerHTML=`<div class="bx">${head}<p><b>Lupa kata sandi</b><br>Karena data dienkripsi, kata sandi tidak bisa dipulihkan. Pilihan yang ada:</p><p style="text-align:left">• Coba lagi kata sandi lain yang mungkin dipakai.<br>• Kalau di perangkat lain planner masih terbuka (tersimpan "ingat di perangkat ini"), buka di sana lalu ganti kata sandi.<br>• Atau hapus data di perangkat ini dan mulai dari awal (data di GitHub tidak ikut terhapus).</p><button class="pdvB l" id="back">Kembali</button><button class="pdvB r" id="wipe">Hapus data di perangkat ini</button></div>`;
  const on=(id,f)=>{const x=w.querySelector("#"+id);if(x)x.onclick=f};
  w.querySelectorAll("input").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter"){const g=w.querySelector("#go");g&&g.click()}}));
  const f=w.querySelector("input[type=password]");if(f)setTimeout(()=>f.focus(),60);
  on("mNew",()=>lockUI("create"));on("mJoin",()=>lockUI("join"));on("back",()=>lockUI(META?"unlock":"new"));on("forgot",()=>lockUI("forgot"));
  on("wipe",async()=>{if(!confirm("Hapus SEMUA data planner di perangkat ini? Data di GitHub (kalau sinkron aktif) tetap aman."))return;await kvClear();location.reload()});
  if(mode==="unlock")on("go",async()=>{const pw=$("#pw").value;if(!pw)return;lockUI("busy","Membuka…");try{await openWith(pw,$("#rem")?true:true)}catch(e){lockUI("unlock",e.message||"Kata sandi salah")}});
  if(mode==="create")on("go",async()=>{const a=$("#pw1").value,b=$("#pw2").value,rem=$("#rem").checked;if(a.length<8)return lockUI("create","Kata sandi minimal 8 karakter.");if(a!==b)return lockUI("create","Kedua kata sandi tidak sama.");lockUI("busy","Menyiapkan penyimpanan terenkripsi…");await createNew(a,rem);done()});
  if(mode==="join")on("go",async()=>{const tk=$("#tk").value.trim(),pw=$("#pw").value,rem=$("#rem").checked;if(!tk||!pw)return lockUI("join","Token dan kata sandi wajib diisi.");lockUI("busy","Menghubungi GitHub…");try{await joinExisting(tk,pw,rem);done()}catch(e){lockUI("join",e.message||String(e))}});
  if(mode==="unlock"){const r=w.querySelector("#rem");REMEMBER_BOX=r}
}
let REMEMBER_BOX=null;
function done(){const w=$("#pdvLock");if(w)w.remove();afterUnlock()}

/* ---------------- alur buka/buat/sambung ---------------- */
async function setDK(raw,remember){DKRAW=raw;DK=await crypto.subtle.importKey("raw",raw,{name:"AES-GCM"},false,["encrypt","decrypt"]);if(remember)await kvSet("rk",DK);else await kvDel("rk")}
async function createNew(pw,remember){const salt=rnd(16);const k=await kek(pw,salt,ITER);const raw=rnd(32);const wdk=b64e(await aesEnc(k,raw));META={salt:b64e(salt),iter:ITER,wdk};await kvSet("meta",META);await setDK(raw,remember);DOCS={};ASSETS={};await saveLocal()}
async function unwrap(pw,meta){const k=await kek(pw,b64d(meta.salt),meta.iter);try{return await aesDec(k,b64d(meta.wdk))}catch(e){throw new Error("Kata sandi salah.")}}
async function openWith(pw){const raw=await unwrap(pw,META);const rem=REMEMBER_BOX?REMEMBER_BOX.checked:true;await setDK(raw,rem);await loadLocal();done()}
async function loadLocal(){const s=await kvGet("snap");if(s){try{loadSnap(await unpack(s))}catch(e){throw new Error("Data lokal tidak bisa dibuka: "+e.message)}}}
async function joinExisting(token,pw,remember){CFG={token};const u=await gh("/user");CFG.login=u.login;const id=await findGist();if(!id)throw new Error("Belum ada data planner di akun GitHub ini. Pilih \"Mulai baru\" di perangkat yang datanya paling lengkap.");
  CFG.gistId=id;const g=await gh("/gists/"+id);const rm=await remoteMeta(g);if(!rm||rm.app!==APPNAME)throw new Error("Gist planner tidak valid.");
  const raw=await unwrap(pw,rm);META={salt:rm.salt,iter:rm.iter,wdk:rm.wdk};await kvSet("meta",META);await setDK(raw,remember);DOCS={};ASSETS={};CFG.cols={};await saveCfg();
  lockUI("busy","Mengunduh data dari GitHub…");await syncOnce();await saveLocal()}

/* ---------------- setelah terbuka ---------------- */
async function afterUnlock(){
  UNLOCKED=true;waiters.splice(0).forEach(r=>r());
  if(!$("#pdvCloud")){const b=el('<button id="pdvCloud" title="Sinkron & keamanan"></button>');b.onclick=openPanel;document.body.appendChild(b)}
  status();
  loadAllAssetURLs().then(()=>{if(window.renderPage)try{window.renderPage()}catch(e){}});
  /* muat planner */
  const s=document.createElement("script");s.src="js/planner.js?v="+(window.PDV_V||1);document.body.appendChild(s);
  setTimeout(()=>{const x=document.createElement("script");x.src="js/stiker-ekstra.js?v=1";document.body.appendChild(x)},600);
  if(CFG.token){setTimeout(()=>sync(),1500);setInterval(()=>{if(!document.hidden)sync()},120000)}
  document.addEventListener("visibilitychange",()=>{if(!CFG.token||!DK)return;if(document.hidden){if(DIRTY.size)sync()}else sync()});
  window.addEventListener("online",()=>{if(CFG.token)sync()});
}

/* ---------------- panel pengaturan ---------------- */
function openPanel(){let p=$("#pdvPanel");if(!p){p=el('<div id="pdvPanel"></div>');document.body.appendChild(p);p.addEventListener("click",e=>{if(e.target===p)p.style.display="none"})}
  const nDocs=Object.values(DOCS).filter(x=>x.d!=null).length,nAst=Object.values(ASSETS).filter(a=>!a.del).length;
  p.innerHTML=`<div class="bx"><button class="x" id="cx">✕</button><h2>☁ Sinkron & keamanan</h2>
  <div class="st">${esc($("#pdvCloud").textContent)}<br>${nDocs} data · ${nAst} file · terenkripsi AES-256${lastErr?'<br><b style="color:#b42318">'+esc(lastErr)+'</b>':""}</div>
  <h3>Sinkron antar-perangkat (GitHub)</h3>
  ${CFG.token?`<p>Tersambung sebagai <b>${esc(CFG.login||"?")}</b>${CFG.gistId?` · gist <code>${esc(CFG.gistId.slice(0,8))}…</code>`:""}</p><button class="pdvB" id="sNow">Sinkron sekarang</button><button class="pdvB l" id="sOff">Putuskan sinkron di perangkat ini</button>`
  :`<p>Isi token GitHub (izin <b>gist</b>) supaya data tersimpan aman di akun GitHub dan sama di HP, tablet, dan laptop. Boleh pakai token yang sama dengan Jejak Hijrah Dev kalau izinnya sudah mencakup gist.</p><input type="password" id="tk" placeholder="Token GitHub"><button class="pdvB" id="sOn">Aktifkan sinkron</button>`}
  <h3>Pindahkan data dari aplikasi Claude</h3>
  <p>Pilih file <b>pindah-planner…</b>, <b>pindah-wakasek…</b>, dan <b>pindah-teacher…</b> (boleh sekaligus, termasuk file besar <b>…-file1…</b> dst.).</p>
  <input type="file" id="imp" multiple accept=".json,application/json"><div id="impMsg" class="st" style="display:none;margin-top:8px"></div>
  <h3>Cadangan</h3><p>Unduh salinan terenkripsi semua data (hanya bisa dibuka dengan kata sandi ini).</p><button class="pdvB l" id="bak">Unduh cadangan terenkripsi</button><label class="pdvB l" style="text-align:center;box-sizing:border-box">Pulihkan dari cadangan terenkripsi<input type="file" id="res" accept=".pdv,.json" hidden></label>
  <h3>Kata sandi</h3><input type="password" id="op" placeholder="Kata sandi sekarang"><input type="password" id="np1" placeholder="Kata sandi baru (min. 8)"><input type="password" id="np2" placeholder="Ulangi kata sandi baru"><button class="pdvB l" id="chg">Ganti kata sandi</button>
  <button class="pdvB r" id="lock" style="margin-top:16px">🔒 Kunci sekarang (lupakan di perangkat ini)</button></div>`;
  p.style.display="flex";const on=(id,f)=>{const x=p.querySelector("#"+id);if(x)x.onclick=f};
  on("cx",()=>p.style.display="none");
  on("sNow",()=>{sync().then(openPanel)});
  on("sOff",async()=>{if(!confirm("Putuskan sinkron di perangkat ini? Data di perangkat dan di GitHub tetap ada."))return;CFG={};await saveCfg();status();openPanel()});
  on("sOn",async()=>{const tk=p.querySelector("#tk").value.trim();if(!tk)return;CFG={token:tk,cols:{}};try{status("🔄 Menghubungi GitHub…");const u=await gh("/user");CFG.login=u.login;const id=await findGist();
      if(id){const g=await gh("/gists/"+id);const rm=await remoteMeta(g);if(rm&&rm.wdk!==META.wdk){alert("Di akun GitHub ini sudah ada data planner dengan kata sandi lain. Untuk memakai data itu: Kunci sekarang → Sambungkan ke data yang sudah ada.");CFG={};await saveCfg();openPanel();return}CFG.gistId=id}
      await saveCfg();for(const p2 in DOCS)DIRTY.add(colOf(p2));DIRTY.add("~aset");await sync();setInterval(()=>{if(!document.hidden)sync()},120000);openPanel()}catch(e){CFG={};await saveCfg();alert(e.message||e);openPanel()}});
  p.querySelector("#imp").onchange=e=>importFiles([...e.target.files]);
  on("bak",async()=>{const b=await pack(snapshot());const assets={};for(const id in ASSETS){if(ASSETS[id].del)continue;const e=await kvGet(id,"aset");if(e)assets[id]=b64e(e)}
    const o={app:APPNAME,jenis:"cadangan-terenkripsi",dibuat:new Date().toISOString(),salt:META.salt,iter:META.iter,wdk:META.wdk,snap:b64e(b),assets};
    const d=new Date();await dlApi.save({filename:`planner-devy-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}.pdv`,data:JSON.stringify(o)})});
  p.querySelector("#res").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const o=JSON.parse(await f.text());if(o.jenis!=="cadangan-terenkripsi")throw new Error("Bukan file cadangan terenkripsi.");if(o.wdk!==META.wdk)throw new Error("Cadangan ini dibuat dengan kata sandi lain.");
      const s=await unpack(b64d(o.snap));if(!confirm("Pulihkan cadangan tanggal "+(o.dibuat||"").slice(0,10)+"? Data yang lebih baru di perangkat ini tetap dipertahankan."))return;
      for(const pth in s.docs){const [t,d]=s.docs[pth];const l=DOCS[pth];if(!l||t>l.t){DOCS[pth]={t,d};touch(pth);DIRTY.add(colOf(pth))}}
      for(const id in (o.assets||{})){if(!(await kvGet(id,"aset"))){await kvSet(id,b64d(o.assets[id]),"aset");ASSETS[id]=(s.assets||{})[id]||{type:"",size:0,t:Date.now()}}}
      DIRTY.add("~aset");await saveLocal();schedulePush(1000);alert("Cadangan dipulihkan. Halaman akan dimuat ulang.");location.reload()}catch(err){alert(err.message||err)}};
  on("chg",async()=>{const o=p.querySelector("#op").value,a=p.querySelector("#np1").value,b=p.querySelector("#np2").value;if(a.length<8)return alert("Kata sandi baru minimal 8 karakter.");if(a!==b)return alert("Kata sandi baru tidak sama.");
    try{await unwrap(o,META)}catch(e){return alert("Kata sandi sekarang salah.")}const salt=rnd(16);const k=await kek(a,salt,ITER);META={salt:b64e(salt),iter:ITER,wdk:b64e(await aesEnc(k,DKRAW))};await kvSet("meta",META);
    if(CFG.token&&CFG.gistId){try{const g=await gh("/gists/"+CFG.gistId);const rm=await remoteMeta(g);if(rm){rm.salt=META.salt;rm.iter=META.iter;rm.wdk=META.wdk;rm.t=Date.now();await writeGist({[META_FILE]:{content:JSON.stringify(rm)}})}}catch(e){alert("Kata sandi diganti di perangkat ini, tapi gagal memperbarui GitHub: "+e.message)}}
    alert("Kata sandi berhasil diganti. Di perangkat lain, buka dengan kata sandi baru.");openPanel()});
  on("lock",async()=>{await kvDel("rk");location.reload()});
}

/* ---------------- impor dari aplikasi Claude ---------------- */
async function importFiles(files){const box=$("#impMsg");box.style.display="block";const say=t=>box.innerHTML=t;let nD=0,nA=0;const apps=new Set();
  try{for(const f of files){say("Membaca "+esc(f.name)+"…");let o;try{o=JSON.parse(await f.text())}catch(e){throw new Error(f.name+" bukan file data yang valid")}
      const t=Date.now();
      if(o.format==="pdv-export"){const pre=o.app==="teacher"?"td_":o.app==="wakasek"?"wk_":"";apps.add(o.app);
        for(const p in (o.docs||{})){put(pre+p,o.docs[p],t);nD++}
        for(const id in (o.assets||{})){const a=o.assets[id];await putAsset(id,new Blob([b64d(a.b64)],{type:a.type||""}));nA++;say("Menyimpan file "+nA+"…")}}
      else if(o.versi&&o.data&&o.cfg){apps.add("wakasek");put("wk_pengaturan/sekolah",o.cfg,t);nD++;for(const c in o.data){for(const id in o.data[c]){put("wk_"+c+"/"+id,o.data[c][id],t);nD++}}}
      else if(o.data&&typeof o.data==="object"){apps.add("teacher");for(const p in o.data){if(p.indexOf("/")>0){put("td_"+p,o.data[p],t);nD++}}}
      else throw new Error(f.name+": format tidak dikenali")}
    await saveLocal();schedulePush(1500);
    say("✅ Berhasil: "+nD+" data dan "+nA+" file dari "+[...apps].map(a=>({planner:"Planner",wakasek:"Sistem Wakasek",teacher:"Teacher Dev"}[a]||a)).join(", ")+".<br>Halaman dimuat ulang dalam 3 detik…");
    setTimeout(()=>location.reload(),3000)}
  catch(e){say("⚠️ "+esc(e.message||e))}}

/* ---------------- mulai ---------------- */
async function boot(){
  const st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
  if(!window.crypto||!crypto.subtle){document.body.innerHTML='<p style="padding:30px;font:16px sans-serif">Browser ini tidak mendukung enkripsi. Buka lewat Chrome/Safari terbaru dengan alamat https.</p>';return}
  try{META=await kvGet("meta");CFG=(await kvGet("cfg"))||{}}catch(e){lockUI("busy","Penyimpanan browser tidak bisa dipakai (mode penyamaran?).");return}
  if(!META){lockUI("new");return}
  const rk=await kvGet("rk").catch(()=>null);
  if(rk){try{DK=rk;await loadLocal();done();return}catch(e){DK=null}}
  lockUI("unlock")}
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
window.__pdv={sync,openPanel,status,_docs:()=>DOCS};
})();
