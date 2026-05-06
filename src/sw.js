const CACHE_NAME = 'budget-pwa-v1';
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

// Handle notification registration and schedulingself.addEventListener('message', (event) => {
  const data = event.data;
  if (data.type === 'REGISTER_NOTIFICATION') {
    const time = data.time; // e.g., '09:00'
    
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
    
    // If time already passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const millisecondsUntil = nextRun.getTime() - now.getTime();
    
    setTimeout(() => {
      self.registration.showNotification({
        title: 'Il tuo budget di oggi',
        body: 'Hai ' + (self.registration?.showNotification?.toString() || '0') + ' disponibili per oggi. ' + 
              (new Date().getDay() === 0 ? 'Domani' : 'oggi') + '.',
        icon: '/placeholder.svg',
        tag: 'daily-budget-notification'
      });
    }, millisecondsUntil);
  }
});