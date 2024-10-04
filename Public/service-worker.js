// Service Worker: ติดตั้ง (install) Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v5').then((cache) => {
            return cache.addAll([
                '/',
                '/manifest.json',
                '/icons/icon-192x192-latest-1.png',
                '/icons/icon-512x512-latest-1.png',
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
    self.skipWaiting(); // บังคับให้ Service Worker ที่ติดตั้งเสร็จแล้วใช้งานทันที
});

// Service Worker: เปิดใช้งาน (activate) Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== 'v5') {
                        return caches.delete(key); // ลบแคชเก่าที่ไม่ใช่ 'v2'
                    }
                })
            );
        }).then(() => {
            return clients.claim(); // รับการควบคุมจากทุกแท็บที่เปิดแอปอยู่
        }).then(() => {
            return clients.matchAll({ type: 'window' }).then((windowClients) => {
                windowClients.forEach((client) => {
                    client.navigate(client.url); // รีโหลดทุกแท็บ
                });
            });
        })
    );
});

// Service Worker: จัดการการร้องขอ (fetch) ข้อมูล
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/')) {
        event.respondWith(fetch(event.request)); // ดึงข้อมูลจากเซิร์ฟเวอร์โดยตรง
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open('v5').then((cache) => {
                        cache.put(event.request, fetchResponse.clone()); // เก็บไฟล์ที่ดึงมาล่าสุดลงแคช
                        return fetchResponse;
                    });
                });
            })
        );
    }
});

// รับข้อความจาก client
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting(); // ใช้งาน Service Worker ใหม่ทันที
    }
});
