// Service Worker — migvan-installations
// גרסה: שנה את המספר הזה בכל פעם שמעלים עדכון ל-GitHub
const VERSION = 'v1.7';
const CACHE_NAME = 'migvan-install-' + VERSION;

// בעת התקנה — שמור את הקבצים הקריטיים
self.addEventListener('install', event => {
  self.skipWaiting();
});

// בעת הפעלה — מחק caches ישנים
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// בכל fetch — תמיד תשלוף מהרשת (Network First)
// כך תמיד תקבל את הגרסה העדכנית
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// הודע לכל הלקוחות כשיש גרסה חדשה
self.addEventListener('message', event => {
  if(event.data === 'SKIP_WAITING') self.skipWaiting();
});
