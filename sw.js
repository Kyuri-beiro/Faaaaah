// Service worker — permite que a app funcione offline no iPhone
const CACHE='financas-v1';
const ASSETS=[
  'index.html',
  'manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(cached=>
      cached || fetch(e.request).then(res=>{
        // guarda cópia no cache para uso offline
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
        return res;
      }).catch(()=>cached)
    )
  );
});
