// Import OneSignal SDK for push notifications
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Workbox precache manifest injection point (required for injectManifest strategy)
// eslint-disable-next-line no-unused-vars
const precacheManifest = self.__WB_MANIFEST || [];

// Service Worker - Enhanced for Testing
const CACHE_NAME = "haji-app-v1";
const urlsToCache = ["/", "/offline", "/testing-sw"];
