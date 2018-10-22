const staticAssests = [
  './',
  './styles.css',
  './app.js'
]
self.addEventListener('install', async event => {
  console.log("install");

  const cache = await caches.open('news-static')
  cache.addAll(staticAssests)
})

self.addEventListener('fetch', event => {
  console.log("fetch", event);
  const req = event.request;
  const url = new URL(req.url)

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
})

async function networkFirst(req) {
  const cache = await caches.open('news-dynamic')

  try {
    const res = await fetch(req)
    cache.put(req, res.clone())
    return res
  } catch (e) {
    return await cache.match(req)
  }
}

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req)
  return cachedResponse || fetch(req)
}
