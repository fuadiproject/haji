import { useOneSignal } from "@/composables/useOneSignal";

export const useNotificationPermission = () => {
  const notificationPermission = ref(false);
  const { isSubscribed } = useOneSignal();

  const checkNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("Browser tidak mendukung notifikasi");
      return false;
    }

    // Check permission
    const permission = Notification.permission;
    notificationPermission.value = permission === "granted";

    // Check OneSignal subscription
    const subscribed = await isSubscribed();
    console.log("OneSignal subscribed:", subscribed);
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
