// Minimal service worker: makes the site installable and serves the landing shell offline.
// API calls go to script.google.com and are never cached.
const CACHE = 'hris-shell-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'logo-mark.png', 'favicon.png'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // Network first so deployments show up immediately; fall back to the cached shell.
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
