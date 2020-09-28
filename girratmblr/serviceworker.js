//I somehow made this work after reading through a bunch of documentation. I should probably delve a bit deeper into Promises.

const assetsCacheName = 'v2a3-assets';
self.addEventListener('install', function (event) {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating.');
});
self.addEventListener('fetch', (event) => {
  // Ignore crossdomain requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  // Ignore non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  // Ignore browser-sync
  if (event.request.url.indexOf('browser-sync') > -1) {
    return;
  }
  // Prevent index route being cached
  if (event.request.url === (self.location.origin + '/')) {
    return;
  }

  // Tell the fetch to respond with this chain
  event.respondWith(
    // Open the cache
    caches.open(assetsCacheName)
    .then((cache) => {
      // Look for matching request in the cache
      return cache.match(event.request)
        .then((matched) => {
          // If a match is found return the cached version first
          if (matched) {
            return matched;
          }
          // Otherwise continue to the network
          return fetch(event.request)
            .then((response) => {
              // Cache the response
              cache.put(event.request, response.clone());
              // Return the original response to the page
              return response;
            });
        });
    })
  );
});
self.addEventListener('fetch', (event) => {
  caches.delete("v1-assets");
  caches.delete("v1.1-assets");
  caches.delete("v3-assets");
  // Ignore non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  // Ignore browser-sync
  if (event.request.url.indexOf('browser-sync') > -1) {
    return;
  }
  let allow = false;

  // Allow index route to be cached
  if (event.request.url === (self.location.origin + '/')) {
    allow = true;
  }
  // Allow index.html to be cached
  if (event.request.url.endsWith('index.html')) {
    allow = true;
  }
  // Allow API requests to be cached
  if (event.request.url.startsWith("https://girratmblr.firebaseio.com")) {
    allow = true;
  }
  if (allow) {
    if (event.request.url.startsWith('https://girratmblr.firebaseio.com')) {
      // Network first
      event.respondWith(
        // Open the dynamic cache
        caches.open(dynamicCacheName).then((cache) => {
          // Make the request to the network
          return fetch(event.request)
            .then((response) => {
              // Cache the response
              cache.put(event.request, response.clone());
              // Return the original response
              return response;
            }).catch(() => {
              // On failure look for a match in the cache
              return caches.match(event.request);
            });
        })
      );
    }
  }
});