import { useOneSignal } from "@/composables/useOneSignal";

export const useNotificationPermission = () => {
  const notificationPermission = ref(false);
  const { isSubscribed, initializeOneSignal } = useOneSignal();
  const config = useRuntimeConfig();

  const checkNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("Browser tidak mendukung notifikasi");
      return false;
    }

    await initializeOneSignal();
    // Check permission
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;

    // Check OneSignal subscription
    const subscribed = await isSubscribed();
    if (config.public.environment === "development") {
      console.debug("OneSignal subscribed:", subscribed);
    }
  };

  onMounted(() => {
    checkNotificationPermission();

    if (Notification.permission === "granted") {
      notificationPermission.value = true;
    }

    if (Notification.permission === "denied") {
      notificationPermission.value = false;
    }

    if (Notification.permission === "default") {
      notificationPermission.value = false;
    }

    if (Notification.permission === "denied") {
      notificationPermission.value = false;
    }

    if (Notification.permission === "default") {
      notificationPermission.value = false;
    }
  });

  return {
    notificationPermission,
  };
};
