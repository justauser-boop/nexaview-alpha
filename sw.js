// Bump VERSION when you change files so old caches are removed.
var VERSION="nexaview-v1";
var FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==VERSION}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
// Open instantly from cache, refresh the cache in the background (updates show on next launch).
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.open(VERSION).then(function(c){
    return c.match(r,{ignoreSearch:true}).then(function(hit){
      var net=fetch(r).then(function(res){if(res&&res.ok)c.put(r,res.clone());return res}).catch(function(){return hit||(r.mode==="navigate"?c.match("index.html"):undefined)});
      return hit||net;
    });
  }));
});
