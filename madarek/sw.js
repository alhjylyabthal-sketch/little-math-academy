const CACHE_NAME='madarek-offline-v24-values';
const FILES=['./','./index.html','./paper-tasks.js?v=1','./math-rtl.js?v=2','./math-rtl.css?v=1','./screenfree.js?v=8','./screenfree.css?v=2','./manifest.webmanifest','./brand.css?v=2','./students-approved.svg','./school-approved.svg','./icon.svg','./icon-192.png','./icon-512.png','./approved.css?v=1','./sections.css?v=8','./sections.js?v=8','./values.css?v=1','./values.js?v=1','./classroom.js?v=4','./classroom.css?v=3','./approved-main.webp','./approved-center.webp','./approved-boy.webp','./approved-girl.webp','./approved-tools.webp','./approved-tests.webp','./approved-games.webp','./approved-activities.webp','./approved-lessons.webp','./approved-wave.webp'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('madarek-offline-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)).catch(()=>{})}return r}).catch(()=>caches.match(e.request).then(cached=>cached||caches.match('./index.html'))));
  return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));
});