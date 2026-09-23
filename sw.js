const CACHE='yeobaek-v5-3-exact-config-20260923';
const APP=['./?v=5-3','./index.html?v=5-3','./manifest.webmanifest','./icon.svg?v=4','./icon-180.png?v=4','./icon-192.png?v=4','./icon-512.png?v=4'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request,{cache:'no-store'}).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put('./index.html?v=5-3',copy));
        return res;
      }).catch(()=>caches.match('./index.html?v=5-3'))
    );
    return;
  }
  event.respondWith(
    fetch(event.request).then(res=>{
      if(event.request.url.startsWith(self.location.origin)){
        const copy=res.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy));
      }
      return res;
    }).catch(()=>caches.match(event.request))
  );
});
