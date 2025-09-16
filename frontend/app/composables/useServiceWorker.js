export const useServiceWorker = () => {
  const isSupported = ref(false);
  const isRegistered = ref(false);
  const registration = ref(null);
  const updateAvailable = ref(false);

  // Cek apakah service worker didukung dan auto-register
  onMounted(async () => {
    isSupported.value = "serviceWorker" in navigator;

    // Auto-register service worker jika didukung
    if (isSupported.value) {
      await registerServiceWorker();
    }
  });

  // Register service worker
  const registerServiceWorker = async () => {
    if (!isSupported.value) {
      console.warn("Service Worker tidak didukung di browser ini");
      return false;
    }

    try {
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      registration.value = reg;
      isRegistered.value = true;

      // console.log("Service Worker berhasil didaftarkan:", reg);

      // Listen for updates
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            updateAvailable.value = true;
            // console.log("Update service worker tersedia");
          }
        });
      });

      return true;
    } catch (error) {
      console.error("Gagal mendaftarkan Service Worker:", error);
      return false;
    }
  };

  // Unregister service worker
  const unregisterServiceWorker = async () => {
    if (registration.value) {
      const success = await registration.value.unregister();
      if (success) {
        isRegistered.value = false;
        registration.value = null;
        // console.log("Service Worker berhasil dihapus");
      }
      return success;
    }
    return false;
  };

  // Update service worker
  const updateServiceWorker = () => {
    if (registration.value && registration.value.waiting) {
      registration.value.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("Browser tidak mendukung notifikasi");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      console.warn("Izin notifikasi ditolak");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  // Send push notification
  const sendNotification = (title, options = {}) => {
    if (registration.value) {
      registration.value.showNotification(title, {
        body: options.body || "",
        icon: options.icon || "/icons/icon-192x192.svg",
        badge: options.badge || "/icons/icon-72x72.svg",
        vibrate: options.vibrate || [100, 50, 100],
        data: options.data || {},
        ...options,
      });
    }
  };

  // Background sync
  const registerBackgroundSync = (tag) => {
    if (
      registration.value &&
      "sync" in window.ServiceWorkerRegistration.prototype
    ) {
      return registration.value.sync.register(tag);
    }
    return Promise.reject("Background sync tidak didukung");
  };

  // Cek status koneksi
  const isOnline = ref(true);

  onMounted(() => {
    // Set initial value setelah component mounted
    isOnline.value = navigator.onLine;

    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine;
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    onUnmounted(() => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    });
  });

  return {
    // State
    isSupported: readonly(isSupported),
    isRegistered: readonly(isRegistered),
    registration: readonly(registration),
    updateAvailable: readonly(updateAvailable),
    isOnline: readonly(isOnline),

    // Methods
    registerServiceWorker,
    unregisterServiceWorker,
    updateServiceWorker,
    requestNotificationPermission,
    sendNotification,
    registerBackgroundSync,
  };
};
