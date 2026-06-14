self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Only intercept local requests for clean navigation pages
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        const path = url.pathname;
        
        // Intercept requests without file extensions (except root /)
        if (!path.includes('.') && path !== '/') {
            const acceptHeader = event.request.headers.get('Accept') || '';
            const isHtmlRequest = event.request.mode === 'navigate' || acceptHeader.includes('text/html');
            
            if (isHtmlRequest) {
                const newUrl = path + '.html';
                event.respondWith(
                    fetch(newUrl).then(response => {
                        if (response.ok) {
                            return response;
                        }
                        return fetch('/404.html');
                    }).catch(() => {
                        return fetch('/404.html');
                    })
                );
            }
        }
    }
});
