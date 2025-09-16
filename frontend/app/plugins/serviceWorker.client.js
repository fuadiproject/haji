export default defineNuxtPlugin(async () => {
  const { registerServiceWorker, requestNotificationPermission } =
    useServiceWorker();

  // Register service worker saat aplikasi dimuat
  if (import.meta.client) {
    try {
      const registered = await registerServiceWorker();

      if (registered) {
        console.log("Service Worker berhasil diinisialisasi");

        // Request notification permission secara otomatis
        await requestNotificationPermission();
      }
    } catch (error) {
      console.error("Error inisialisasi Service Worker:", error);
    }
  }
});
