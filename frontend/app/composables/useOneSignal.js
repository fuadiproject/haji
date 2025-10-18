/**
 * @typedef {import('@onesignal/onesignal-vue3').IOneSignalOneSignal} OneSignalInstance
 */

export const useOneSignal = () => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();

  /** @type {OneSignalInstance} */
  const $OneSignal = nuxtApp.$OneSignal;

  const initializeOneSignal = async () => {
    try {
      await $OneSignal.init({
        appId: config.public.onesignalAppId,
        allowLocalhostAsSecureOrigin: true,
      });
      await $OneSignal.Slidedown.promptPush();

      return true;
    } catch (error) {
      console.error("OneSignal initialization failed", error);
      return false;
    }
  };

  const isSubscribed = async () => {
    try {
      return await $OneSignal.User.PushSubscription.optedIn;
    } catch (error) {
      console.error("Error checking subscription status", error);
      return false;
    }
  };

  // Set user ID (for identifying users)
  const setExternalUserId = async (userId) => {
    try {
      await $OneSignal.login(userId);
    } catch (error) {
      console.error("Error setting user ID:", error);
    }
  };

  const logoutUser = async () => {
    try {
      await $OneSignal.logout();
      console.log("User logged out from OneSignal");
    } catch (error) {
      console.error("Error logging out from OneSignal:", error);
    }
  };

  // Listen for permission changes
  const onPermissionChange = (callback) => {
    $OneSignal.Notifications.addEventListener("permissionChange", callback);
  };

  return {
    initializeOneSignal,
    isSubscribed,
    setExternalUserId,
    onPermissionChange,
    logoutUser,
  };
};
