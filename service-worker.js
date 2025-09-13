
const CACHE_NAME = 'random-episode-finder-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: CDN scripts are fetched cross-origin and might not be cacheable
  // depending on CORS headers. This setup is for a typical deployment.
  // In a CDN-only setup, the browser's native caching is relied upon.
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/services/tvmazeService.ts',
  '/components/WaveBackground.tsx',
  '/components/SplashScreen.tsx',
  '/components/SearchInput.tsx',
  '/components/SeasonSelector.tsx',
  '/components/EpisodeCard.tsx',
  '/components/FavoritesSidebar.tsx',
  '/components/LoadingSpinner.tsx',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Never cache API requests
  if (event.request.url.includes('api.tvmaze.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Cache hit - return response
        }
        return fetch(event.request); // Not in cache, fetch from network
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
