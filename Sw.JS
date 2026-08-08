const CACHE_NAME = 'diary-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // 새 워커를 대기 없이 바로 활성화
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // 지금 열려있는 페이지도 즉시 이 워커가 담당
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }) // 항상 네트워크에서 새로 요청 (HTTP 캐시 무시)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request)) // 오프라인일 때만 마지막으로 받아둔 걸로 대체
  );
});
