const CACHE='yeobaek-v7-36-cream-20261008';
// 외부 자원(Firebase 코드, 서체)은 버전이 올라도 지우지 않고 따로 보관한다.
const EXT='yeobaek-ext-v1';
const APP=['./?v=7-36','./index.html?v=7-36','./privacy.html','./manifest.webmanifest','./icon.svg?v=4','./icon-180.png?v=4','./icon-192.png?v=4','./icon-512.png?v=4'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!==EXT).map(k=>caches.delete(k))))
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
        caches.open(CACHE).then(c=>c.put('./index.html?v=7-36',copy));
        return res;
      }).catch(()=>caches.match('./index.html?v=7-36'))
    );
    return;
  }
  {
    const host=new URL(event.request.url).hostname;
    if(host==='www.gstatic.com'||host==='hangeul.pstatic.net'){
      event.respondWith(caches.open(EXT).then(c=>c.match(event.request).then(hit=>{
        const net=fetch(event.request).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(event.request,res.clone());return res}).catch(()=>hit);
        return hit||net;
      })));
      return;
    }
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
