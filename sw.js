// Bell Audio PWA Service Worker
const CACHE_NAME = 'bell-audio-v1';
const STATIC_CACHE = 'bell-audio-static-v1';
const AUDIO_CACHE = 'bell-audio-audio-v1';
const RUNTIME_CACHE = 'bell-audio-runtime-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Audio-specific assets
const AUDIO_ASSETS = [
  // Audio samples and impulse responses will be cached on-demand
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(AUDIO_CACHE).then(cache => {
        console.log('Audio cache ready');
        return cache.addAll(AUDIO_ASSETS);
      })
    ]).then(() => {
      console.log('Service Worker installed');
      return self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE &&
              cacheName !== AUDIO_CACHE &&
              cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method !== 'GET') {
    return;
  }

  // Audio files - cache first strategy
  if (isAudioRequest(request)) {
    event.respondWith(handleAudioRequest(request));
    return;
  }

  // Static assets - cache first strategy
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Navigation requests - network first with cache fallback
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Runtime caching for other requests
  event.respondWith(handleRuntimeRequest(request));
});

// Handle audio requests with cache-first strategy
async function handleAudioRequest(request) {
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('Serving audio from cache:', request.url);
      return cachedResponse;
    }

    console.log('Fetching audio from network:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache audio files for offline use
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Audio request failed:', error);
    return new Response('Audio unavailable offline', { status: 503 });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Static asset request failed:', error);
    return caches.match('/index.html'); // Fallback to main page
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('Navigation offline, serving cached page');
    return caches.match('/index.html');
  }
}

// Handle runtime requests with network-first strategy
async function handleRuntimeRequest(request) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (networkError) {
      console.log('Network failed, checking cache:', request.url);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw networkError;
    }
  } catch (error) {
    console.error('Runtime request failed:', error);
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

// Helper functions
function isAudioRequest(request) {
  return request.url.includes('/audio/') ||
         request.url.includes('.wav') ||
         request.url.includes('.mp3') ||
         request.url.includes('.ogg') ||
         request.url.includes('.flac');
}

function isStaticAsset(request) {
  return request.url.includes('/icons/') ||
         request.url.includes('/css/') ||
         request.url.includes('/js/') ||
         request.url.includes('.png') ||
         request.url.includes('.jpg') ||
         request.url.includes('.svg') ||
         request.url.includes('.css') ||
         request.url.includes('.js');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Background sync for audio session data
self.addEventListener('sync', event => {
  console.log('Background sync event:', event.tag);

  if (event.tag === 'audio-session-sync') {
    event.waitUntil(syncAudioSession());
  }
});

async function syncAudioSession() {
  try {
    // Sync audio session data when online
    console.log('Syncing audio session data');
    // Implementation would sync user preferences, session history, etc.
  } catch (error) {
    console.error('Audio session sync failed:', error);
  }
}

// Handle audio focus and media session updates
self.addEventListener('message', event => {
  const { type, data } = event.data;

  switch (type) {
    case 'AUDIO_SESSION_START':
      console.log('Audio session started in service worker');
      // Could implement background session management here
      break;

    case 'AUDIO_SESSION_END':
      console.log('Audio session ended in service worker');
      break;

    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    default:
      console.log('Unknown message type:', type);
  }
});

// Periodic background sync for long audio sessions
self.addEventListener('periodicsync', event => {
  if (event.tag === 'audio-session-check') {
    event.waitUntil(checkAudioSessionHealth());
  }
});

async function checkAudioSessionHealth() {
  try {
    // Monitor audio session health during background operation
    console.log('Checking audio session health');

    // Send message to client about session status
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'AUDIO_SESSION_HEALTH_CHECK',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Audio session health check failed:', error);
  }
}

console.log('Bell Audio Service Worker loaded');