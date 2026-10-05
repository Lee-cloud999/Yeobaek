const CACHE='yeobaek-v7-10-filter-pager-20261005';
const APP=['./?v=7-10','./index.html?v=7-10','./privacy.html','./manifest.webmanifest','./icon.svg?v=4','./icon-180.png?v=4','./icon-192.png?v=4','./icon-512.png?v=4'];

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
    // 개인정보 처리방침 페이지는 앱 화면(index) 캐시를 덮어쓰지 않도록 따로 처리한다.
    if(new URL(event.request.url).pathname.endsWith('/privacy.html')){
      event.respondWith(
        fetch(event.request,{cache:'no-store'}).then(res=>{
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put('./privacy.html',copy));
          return res;
        }).catch(()=>caches.match('./privacy.html'))
      );
      return;
    }
    event.respondWith(
      fetch(event.request,{cache:'no-store'}).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put('./index.html?v=7-10',copy));
        return res;
      }).catch(()=>caches.match('./index.html?v=7-10'))
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
