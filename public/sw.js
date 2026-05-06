const CACHE_NAME = 'budget-pwa-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/placeholder.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Logica Notifiche Mattutine
const scheduleNextNotification = () => {
  const now = new Date();
  const nextNine = new Date();
  nextNine.setHours(9, 0, 0, 0);
  
  if (now > nextNine) {
    nextNine.setDate(nextNine.getDate() + 1);
  }
  
  const delay = nextNine.getTime() - now.getTime();
  
  setTimeout(() => {
    self.registration.showNotification('Il tuo budget di oggi', {
      body: 'Controlla quanto puoi spendere oggi per restare nei tuoi obiettivi!',
      icon: '/placeholder.svg',
      badge: '/placeholder.svg',
      tag: 'daily-budget-reminder'
    });
    scheduleNextNotification();
  }, delay);
};

self.addEventListener('activate', (event) => {
  scheduleNextNotification();
});