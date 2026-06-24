const CACHE="boonwave-workspace-v5-1";
const ASSETS=[
  "styles.css?v=5.1",
  "app.js?v=5.1",
  "manifest.webmanifest?v=5.1",
  "boonwave-logo.png",
  "boonwave-mark.png",
  "boonwave-full.png"
];

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  const url=new URL(request.url);

  if(request.mode==="navigate"){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(request,{cache:"no-store"});
        const cache=await caches.open(CACHE);
        cache.put("index.html",fresh.clone());
        return fresh;
      }catch{
        return (await caches.match("index.html")) || Response.error();
      }
    })());
    return;
  }

  if(url.origin===self.location.origin){
    event.respondWith((async()=>{
      const cached=await caches.match(request);
      const network=fetch(request,{cache:"no-cache"}).then(async response=>{
        if(response && response.ok){
          const cache=await caches.open(CACHE);
          cache.put(request,response.clone());
        }
        return response;
      }).catch(()=>null);
      return cached || await network || Response.error();
    })());
  }
});
