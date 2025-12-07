export const useOneSignal = () => {
  const nuxtApp = useNuxtApp();
  const $OneSignal = nuxtApp.$OneSignal;

  const isOneSignalReady = () => {
    return $OneSignal && $OneSignal.User && $OneSignal.Notifications;
  };

  const subscribe = async () => {
    if (!isOneSignalReady()) return false;

    try {
      await $OneSignal.Slidedown.promptPush();
      await $OneSignal.User.PushSubscription.optIn();
      console.log("User subscribed to OneSignal");
      return true;
    } catch (error) {
      console.error("Failed to subscribe:", error);
      return false;
    }
  };

  const loginOneSignal = async (userId) => {
    if (!isOneSignalReady()) return;
    if (!userId) return;

    try {
      await $OneSignal.login(userId);
      console.log("OneSignal login with userId:", userId);
    } catch (error) {
      console.error("OneSignal login failed:", error);
    }
  };

  const logoutOneSignal = async () => {
    if (!isOneSignalReady()) return;

    try {
      await $OneSignal.User.PushSubscription.optOut();
      console.log("OneSignal logout");
    } catch (error) {
      console.error("OneSignal logout failed:", error);
    }
  };

  return {
    isOneSignalReady,
    subscribe,
    loginOneSignal,
    logoutOneSignal,
  };
};
