export const useNotificationPermission = () => {
  const notificationPermission = ref(false);
  // const { isSubscribed, initializeOneSignal } = useOneSignal();
  // const config = useRuntimeConfig();

  const checkNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("Browser tidak mendukung notifikasi");
      return false;
    }

    // Check permission
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;

    console.debug("Notification permission:", notificationPermission.value);
  };

  onMounted(() => {
    checkNotificationPermission();

    // Set initial permission state
    if (Notification.permission === "granted") {
      notificationPermission.value = true;
    } else if (Notification.permission === "denied") {
      notificationPermission.value = false;
    } else if (Notification.permission === "default") {
      notificationPermission.value = false;
    }
  });

  return {
    notificationPermission,
  };
};
