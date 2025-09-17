export const useNotificationPermission = () => {
  const notificationPermission = ref(false);

  const checkNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("Browser tidak mendukung notifikasi");
      return false;
    }

    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
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
