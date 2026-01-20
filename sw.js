// Bell Audio PWA Service Worker
const CACHE_VERSION = '1.0.1';
const CACHE_NAME = 'bell-audio-v1';
const STATIC_CACHE = `bell-audio-static-v${CACHE_VERSION}`;
const AUDIO_CACHE = `bell-audio-audio-v${CACHE_VERSION}`;
const RUNTIME_CACHE = `bell-audio-runtime-v${CACHE_VERSION}`;

// Cache size limits
const CACHE_LIMITS = {
  AUDIO: 50, // MB
  RUNTIME: 20 // MB
};

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

      // Manage cache size
      manageCacheSize(AUDIO_CACHE, CACHE_LIMITS.AUDIO).catch(err =>
        console.error('Cache management error:', err)
      );
    }

    return networkResponse;
  } catch (error) {
    console.error('Audio request failed:', error);

    // Return user-friendly error
    return new Response(
      JSON.stringify({
        error: 'Audio resource unavailable offline',
        message: 'This audio file is not cached. Please connect to the internet to download it.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
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
    const cachedPage = await caches.match('/index.html');

    if (cachedPage) {
      return cachedPage;
    }

    // If no cache available, show offline page
    return createOfflinePage();
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

        // Manage cache size
        manageCacheSize(RUNTIME_CACHE, CACHE_LIMITS.RUNTIME).catch(err =>
          console.error('Runtime cache management error:', err)
        );
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

// Create offline error page with proper styling
function createOfflinePage() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Bell Audio</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          text-align: center;
        }
        .offline-container {
          max-width: 500px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .offline-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 32px;
          margin-bottom: 16px;
          font-weight: 700;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 24px;
          opacity: 0.9;
        }
        .features {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          text-align: left;
        }
        .features h2 {
          font-size: 18px;
          margin-bottom: 12px;
        }
        .features ul {
          list-style: none;
          padding: 0;
        }
        .features li {
          padding: 8px 0;
          padding-left: 24px;
          position: relative;
        }
        .features li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #4ade80;
          font-weight: bold;
        }
        button {
          background: white;
          color: #667eea;
          border: none;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }
        button:active {
          transform: translateY(0);
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📡</div>
        <h1>You're Offline</h1>
        <p>No internet connection detected, but don't worry!</p>

        <div class="features">
          <h2>Available Offline:</h2>
          <ul>
            <li>Full audio synthesis engine</li>
            <li>All frequency libraries</li>
            <li>Meditation sequences</li>
            <li>Binaural beat generation</li>
            <li>Visual spectrum analyzer</li>
          </ul>
        </div>

        <p>Bell Audio works completely offline. The core functionality is cached and ready to use.</p>

        <button onclick="location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

// Cache size management
async function manageCacheSize(cacheName, maxSizeMB) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  let totalSize = 0;
  const sizeMap = new Map();

  // Calculate total cache size
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      const size = blob.size;
      totalSize += size;
      sizeMap.set(request.url, size);
    }
  }

  const maxBytes = maxSizeMB * 1024 * 1024;

  // If over limit, remove oldest entries
  if (totalSize > maxBytes) {
    console.log(`Cache ${cacheName} over limit (${(totalSize / 1024 / 1024).toFixed(2)}MB), cleaning up...`);

    const sortedEntries = Array.from(sizeMap.entries())
      .sort((a, b) => b[1] - a[1]); // Sort by size descending

    let removedSize = 0;
    for (const [url, size] of sortedEntries) {
      if (totalSize - removedSize <= maxBytes) break;

      await cache.delete(url);
      removedSize += size;
      console.log(`Removed from cache: ${url}`);
    }
  }
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