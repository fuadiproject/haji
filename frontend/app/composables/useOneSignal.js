export const useOneSignal = () => {
  const nuxtApp = useNuxtApp();
  const $OneSignal = nuxtApp.$OneSignal;

  const isOneSignalReady = () => {
    return $OneSignal && $OneSignal.User && $OneSignal.Notifications;
  };

  // Alias for isOneSignalReady - checks if OneSignal is available
  const isOneSignalAvailable = () => {
    return $OneSignal && $OneSignal.User && $OneSignal.Notifications;
  };

  // Wait for OneSignal to be fully ready with retry mechanism
  const waitForOneSignalReady = (maxAttempts = 10, interval = 500) => {
    return new Promise((resolve) => {
      let attempts = 0;

      const check = () => {
        if (isOneSignalAvailable()) {
          resolve(true);
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          resolve(false);
          return;
        }

        setTimeout(check, interval);
      };

      check();
    });
  };

  const subscribe = async () => {
    if (!isOneSignalReady()) return false;

    try {
      // await $OneSignal.Slidedown.promptPush();
      await $OneSignal.User.PushSubscription.optIn();
      console.log("User subscribed to Push Notification");
      return true;
    } catch (error) {
      console.error("Failed to subscribe:", error);
      return false;
    }
  };

  const promptPush = async () => {
    if (!isOneSignalReady()) return;

    try {
      await $OneSignal.Slidedown.promptPush();
    } catch (error) {
      console.error("OneSignal prompt push failed:", error);
    }
  };

  const loginOneSignal = async (userId) => {
    if (!isOneSignalReady()) return;
    if (!userId) return;

    try {
      await $OneSignal.login(userId);
    } catch (error) {
      console.error("OneSignal login failed:", error);
    }
  };

  const logoutOneSignal = async () => {
    if (!isOneSignalReady()) return;

    try {
      // await $OneSignal.User.PushSubscription.optOut();
      await $OneSignal.logout();
      console.log("OneSignal logout");
    } catch (error) {
      console.error("OneSignal logout failed:", error);
    }
  };

  const isUserHaveExternalId = async () => {
    if (!isOneSignalReady()) return false;

    try {
      const externalId = await $OneSignal.User.externalId;
      return externalId ? true : false;
    } catch (error) {
      console.error("Error checking if user has external ID:", error);
      return false;
    }
  };

  return {
    isOneSignalReady,
    isOneSignalAvailable,
    waitForOneSignalReady,
    subscribe,
    loginOneSignal,
    logoutOneSignal,
    promptPush,
    isUserHaveExternalId,
  };
};
