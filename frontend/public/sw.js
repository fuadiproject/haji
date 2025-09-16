// Service Worker - Enhanced for Testing
const CACHE_NAME = "haji-app-v1";
const urlsToCache = ["/", "/offline", "/testing-sw"];

// // Install event - cache resources
// self.addEventListener("install", (event) => {
//   console.log("Service Worker: Installing...");

//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then((cache) => {
//         console.log("Service Worker: Caching files", urlsToCache);
//         return cache.addAll(urlsToCache);
//       })
//       .then(() => {
//         console.log("Service Worker: Installation completed");
//         // Skip waiting to activate immediately
//         return self.skipWaiting();
//       })
//       .catch((error) => {
//         console.error("Service Worker: Cache failed", error);
//       }),
//   );
// });

// // Activate event - clean up old caches
// self.addEventListener("activate", (event) => {
//   console.log("Service Worker: Activating...");

//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((cacheName) => {
//             if (cacheName !== CACHE_NAME) {
//               console.log("Service Worker: Deleting old cache", cacheName);
//               return caches.delete(cacheName);
//             }
//           }),
//         );
//       })
//       .then(() => {
//         console.log("Service Worker: Activation completed");
//         // Take control of all clients immediately
//         return self.clients.claim();
//       }),
//   );
// });

// // Fetch event - serve from cache, fallback to network
// self.addEventListener("fetch", (event) => {
//   // Skip non-GET requests
//   if (event.request.method !== "GET") {
//     return;
//   }

//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Return cached version or fetch from network
//       if (response) {
//         console.log("Service Worker: Serving from cache", event.request.url);
//         return response;
//       }

//       console.log("Service Worker: Fetching from network", event.request.url);
//       return fetch(event.request)
//         .then((response) => {
//           // Don't cache non-successful responses
//           if (
//             !response ||
//             response.status !== 200 ||
//             response.type !== "basic"
//           ) {
//             return response;
//           }

//           // Cache successful responses
//           const responseToCache = response.clone();
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, responseToCache);
//           });

//           return response;
//         })
//         .catch(() => {
//           // If both cache and network fail, show offline page
//           if (event.request.destination === "document") {
//             console.log("Service Worker: Showing offline page");
//             return caches.match("/offline");
//           }
//         });
//     }),
//   );
// });

// // Background sync (optional)
// self.addEventListener("sync", (event) => {
//   console.log("Service Worker: Background sync triggered", event.tag);

//   if (event.tag === "background-sync") {
//     event.waitUntil(
//       // Handle background sync tasks here
//       new Promise((resolve) => {
//         console.log("Service Worker: Processing background sync");
//         // Simulate background task
//         setTimeout(() => {
//           console.log("Service Worker: Background sync completed");
//           resolve();
//         }, 1000);
//       }),
//     );
//   }

//   if (event.tag === "test-sync") {
//     event.waitUntil(
//       new Promise((resolve) => {
//         console.log("Service Worker: Test sync triggered");
//         // Send message to client about sync completion
//         self.clients.matchAll().then((clients) => {
//           clients.forEach((client) => {
//             client.postMessage({
//               type: "SYNC_COMPLETED",
//               tag: event.tag,
//               timestamp: Date.now(),
//             });
//           });
//         });
//         resolve();
//       }),
//     );
//   }
// });

// Push notification
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push event received", event);

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Push Notification", body: event.data.text() };
    }
  } else {
    data = { title: "Push Notification", body: "You have a new notification" };
  }

  const options = {
    body: data.body || "You have a new notification",
    icon: data.icon || "/icons/icon-192x192.svg",
    badge: data.badge || "/icons/icon-72x72.svg",
    vibrate: data.vibrate || [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 1,
      url: data.url || "/",
      ...data.data,
    },
    actions: data.actions || [
      {
        action: "open",
        title: "Buka",
        icon: "/icons/icon-72x72.svg",
      },
      {
        action: "close",
        title: "Tutup",
      },
    ],
  };

  console.log("Service Worker: Showing notification", data.title, options);
  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", options),
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }

      // If no existing window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }),
  );
});

// // Message handler for communication with main thread
// self.addEventListener("message", (event) => {
//   console.log("Service Worker: Message received", event.data);

//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }

//   if (event.data && event.data.type === "GET_VERSION") {
//     event.ports[0].postMessage({
//       type: "VERSION_INFO",
//       version: CACHE_NAME,
//       timestamp: Date.now(),
//     });
//   }
// });

// // Periodic background sync (if supported)
// self.addEventListener("periodicsync", (event) => {
//   console.log("Service Worker: Periodic sync triggered", event.tag);

//   if (event.tag === "content-sync") {
//     event.waitUntil(
//       new Promise((resolve) => {
//         console.log("Service Worker: Processing periodic sync");
//         // Handle periodic sync tasks here
//         setTimeout(() => {
//           console.log("Service Worker: Periodic sync completed");
//           resolve();
//         }, 2000);
//       }),
//     );
//   }
// });
