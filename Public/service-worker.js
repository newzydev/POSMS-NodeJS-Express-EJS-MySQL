// ส่วนนี้คือการติดตั้ง (install) Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            // ทำการแคชไฟล์ที่ระบุในอาร์เรย์ เพื่อให้แอปสามารถทำงานออฟไลน์ได้
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
    self.skipWaiting(); // บังคับให้ Service Worker ที่ติดตั้งเสร็จแล้วเข้าสู่สถานะใช้งานทันที
});

// ส่วนนี้คือการเปิดใช้งาน (activate) Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            // ลบแคชเก่าที่ยังเก็บไว้ เพื่อให้แคชที่ใช้เป็นเวอร์ชันล่าสุด
            return Promise.all(
                keyList.map((key) => {
                    if (key !== 'v1') { // ลบแคชที่ไม่ใช่ 'v1'
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            return clients.claim(); // รับการควบคุมจากทุกแท็บที่เปิดแอปอยู่ทันที
        }).then(() => {
            return clients.matchAll({ type: 'window' }).then((windowClients) => {
                // รีโหลดทุกแท็บเพื่อให้ Service Worker ใหม่ทำงานได้ทันที
                windowClients.forEach((client) => {
                    client.navigate(client.url);
                });
            });
        })
    );
});

// ส่วนนี้คือการจัดการการร้องขอ (fetch) ข้อมูล
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/')) {
        // หาก URL ที่ร้องขอมี '/' (เช่น หน้า login) จะไม่แคช แต่ดึงข้อมูลจากเซิร์ฟเวอร์โดยตรง
        event.respondWith(fetch(event.request));
    } else {
        // แคชข้อมูลที่ร้องขอ ถ้าไม่พบในแคชก็จะดึงจากเซิร์ฟเวอร์แล้วเก็บไว้ในแคช
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open('v1').then((cache) => {
                        cache.put(event.request, fetchResponse.clone()); // เก็บไฟล์ที่ดึงมาล่าสุดลงแคช
                        return fetchResponse;
                    });
                });
            })
        );
    }
});