const CACHE_NAME='madarek-offline-v6-approved-school';
const FILES=['./','./index.html','./screenfree.js?v=1','./screenfree.css?v=1','./manifest.webmanifest','./brand.css?v=2','./students-approved.svg','./school-approved.svg','./icon.svg','./icon-192.png','./icon-512.png'];
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