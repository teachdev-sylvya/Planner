/* Planner Devy — service worker: utamakan jaringan, pakai cache kalau offline */
const C="pdv-v39";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","jadwal.html","js/jadwal-host.js","jadwal.webmanifest","jadwal-192.png","app.css","js/store.js","js/planner.js","js/stiker-ekstra.js","teacher.html","wakasek.html","jspdf.js","devy.png","home.png","rp_logo_kota.jpg","rp_logo_smp.jpg","favicon.png","kop.png"]).catch(()=>{})))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
