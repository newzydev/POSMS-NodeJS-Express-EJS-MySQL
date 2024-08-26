self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
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
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});