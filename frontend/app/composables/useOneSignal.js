/**
 * @typedef {import('@onesignal/onesignal-vue3').IOneSignalOneSignal} OneSignalInstance
 */

export const useOneSignal = () => {
  const nuxtApp = useNuxtApp();
  // const config = useRuntimeConfig();

  /** @type {OneSignalInstance} */
  const $OneSignal = nuxtApp.$OneSignal;

  // Helper function to check if OneSignal is available
  const isOneSignalAvailable = () => {
    return $OneSignal && typeof $OneSignal === "object";
  };

  // Helper function to wait for OneSignal to be fully ready
  const waitForOneSignalReady = async (maxWaitTime = 5000) => {
    if (!isOneSignalAvailable()) {
      return false;
    }

    const startTime = Date.now();
    const checkInterval = 100; // Check every 100ms

    return new Promise((resolve) => {
      const checkReady = () => {
        try {
          // Check if OneSignal has essential properties/methods that indicate it's ready
          // Also verify that the login method exists and is callable
          if (
            $OneSignal &&
            $OneSignal.User &&
            $OneSignal.User.PushSubscription &&
            typeof $OneSignal.login === "function" &&
            // Additional check: verify OneSignal's internal state is initialized
            // by checking if we can access the Notifications property
            $OneSignal.Notifications
          ) {
            // Try to verify the login method is actually ready by checking
            // if it's bound properly (not just a property that exists)
            try {
              // This will throw if OneSignal isn't fully initialized
              const loginFunc = $OneSignal.login;
              if (typeof loginFunc === "function") {
                resolve(true);
                return;
              }
            } catch {
              // If we can't access login, it's not ready yet
            }
          }

          // Check if we've exceeded max wait time
          if (Date.now() - startTime >= maxWaitTime) {
            console.warn(
              "OneSignal did not become ready within the timeout period",
            );
            resolve(false);
            return;
          }

          // Check again after interval
          setTimeout(checkReady, checkInterval);
        } catch (error) {
          console.warn("Error checking OneSignal readiness:", error);
          resolve(false);
        }
      };

      checkReady();
    });
  };

  const initializeOneSignal = async () => {
    if (!isOneSignalAvailable()) {
      console.warn("OneSignal is not available yet");
      return false;
    }

    try {
      await $OneSignal.Slidedown.promptPush();
      await $OneSignal.User.PushSubscription.optIn();

      return true;
    } catch (error) {
      console.error("OneSignal initialization failed", error);
      return false;
    }
  };

  const isSubscribed = async () => {
    if (!isOneSignalAvailable()) {
      console.warn("OneSignal is not available yet");
      return false;
    }

    try {
      const isSubscribed = await $OneSignal.User.PushSubscription.optedIn;
      return isSubscribed;
    } catch (error) {
      console.error("Error checking subscription status", error);
      return false;
    }
  };

  // Set user ID (for identifying users)
  const setExternalUserId = async (userId) => {
    if (!isOneSignalAvailable()) {
      console.warn("OneSignal is not available yet, skipping user ID setting");
      return;
    }

    // Add this check to ensure userId is a valid string
    if (typeof userId !== "string" || userId.trim() === "") {
      console.warn(
        "Invalid userId provided to OneSignal.login(). userId must be a non-empty string.",
      );
      return;
    }

    // Wait for OneSignal to be fully ready before calling login
    const isReady = await waitForOneSignalReady();
    if (!isReady) {
      console.warn(
        "OneSignal is not ready yet, retrying user ID setting in a moment...",
      );
      // Retry after a short delay
      setTimeout(() => {
        setExternalUserId(userId);
      }, 1000);
      return;
    }

    try {
      await $OneSignal.login(userId);
    } catch (error) {
      console.error("Error setting user ID:", error);
      // If error occurs, it might be because OneSignal wasn't ready
      // Retry once after a delay
      setTimeout(async () => {
        try {
          const retryReady = await waitForOneSignalReady(3000);
          if (retryReady) {
            await $OneSignal.login(userId);
          }
        } catch (retryError) {
          console.error("Error setting user ID on retry:", retryError);
        }
      }, 2000);
    }
  };

  const logoutUser = async () => {
    if (!isOneSignalAvailable()) {
      console.warn("OneSignal is not available yet, skipping logout");
      return;
    }

    try {
      await $OneSignal.logout();
      console.log("User logged out from OneSignal");
    } catch (error) {
      console.error("Error logging out from OneSignal:", error);
    }
  };

  // Listen for permission changes
  const onPermissionChange = (callback) => {
    if (!isOneSignalAvailable()) {
      console.warn("OneSignal is not available yet, cannot add event listener");
      return;
    }

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
