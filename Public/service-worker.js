self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/manifest.json',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png',
                '/assets/images/logo/logo_icon.png',
                '/assets/images/background/form-login.jpg',
                '/assets/plugins/fontawesome-free/css/all.min.css',
                '/assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
                '/assets/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
                '/assets/dist/css/adminlte.min.css',
                '/assets/css/style.css',
                '/assets/plugins/jquery/jquery.min.js',
                '/assets/plugins/jquery-ui/jquery-ui.min.js',
                '/assets/plugins/bootstrap/js/bootstrap.bundle.min.js',
                '/assets/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js',
                '/assets/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js',
                '/assets/dist/js/adminlte.min.js',
                '/assets/js/Javascript.js'
            ]);
        })
    );
    self.skipWaiting(); // บังคับให้ service worker ที่กำลังรอเปลี่ยนมาใช้งานทันที
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== 'v1') {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // รับการควบคุมของ client ทันที
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        clients.claim().then(() => {
            return clients.matchAll({ type: 'window' });
        }).then((windowClients) => {
            for (let client of windowClients) {
                client.navigate(client.url); // รีโหลดหน้าเพื่อให้ service worker ใหม่ใช้งานได้ทันที
            }
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/')) {
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
