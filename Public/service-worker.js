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
});

self.addEventListener('fetch', (event) => {
    // Do not cache requests to the login page or any URL containing "/"
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
