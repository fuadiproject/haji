/**
 * Composable for setting up global OneSignal listeners
 * This ensures listeners are only set up after OneSignal is initialized
 */
export const useOneSignalListener = () => {
  const { isOneSignalAvailable, waitForOneSignalReady } = useOneSignal();
  const route = useRoute();

  // Track if listener has been set up to avoid duplicates
  const isListenerSetup = ref(false);

  /**
   * Check and log subscription status
   */
  const checkAndLogSubscriptionStatus = async () => {
    if (!isOneSignalAvailable()) {
      console.log("OneSignal not available, cannot check subscription status");
      return false;
    }

    try {
      const nuxtApp = useNuxtApp();
      const $OneSignal = nuxtApp.$OneSignal;

      if (!$OneSignal) {
        console.log("OneSignal instance not found");
        return false;
      }

      const subscriptionId = await $OneSignal.User.PushSubscription.id;
      return subscriptionId;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  };

  /**
   * Setup OneSignal listeners once it's available
   */
  const setupOneSignalListeners = async () => {
    // Check if OneSignal is available
    if (!isOneSignalAvailable()) {
      console.debug("OneSignal not available yet, skipping listener setup");
      return;
    }

    // Wait for OneSignal to be fully ready
    const isReady = await waitForOneSignalReady();
    if (!isReady) {
      console.warn("OneSignal did not become ready, retrying listener setup");
      // Retry after a delay
      setTimeout(() => {
        setupOneSignalListeners();
      }, 1000);
      return;
    }

    // Prevent duplicate listener setup
    if (isListenerSetup.value) {
      return;
    }

    try {
      const nuxtApp = useNuxtApp();
      const $OneSignal = nuxtApp.$OneSignal;

      if (!$OneSignal) {
        console.warn("OneSignal instance not found");
        return;
      }

      // Example: Listen for notification clicks
      $OneSignal.Notifications.addEventListener("click", (event) => {
        console.log("OneSignal notification clicked:", event);
        // Handle notification click here
        // You can navigate to a specific page, show a modal, etc.
      });

      // Listen for permission changes and set external user ID when granted
      // $OneSignal.Notifications.addEventListener(
      //   "permissionChange",
      //   async (permission) => {
      //     console.log("OneSignal permission changed:", permission);

      //     // If permission granted and user is authenticated, set external user ID
      //     if (permission && isAuthenticated.value) {
      //       const userId = jwtInfo.value?.sub;
      //       if (userId) {
      //         await loginOneSignal(userId);
      //         console.log(
      //           "External User ID set after permission grant:",
      //           userId,
      //         );
      //       }
      //     }
      //   },
      // );

      // Check and log initial subscription status
      await checkAndLogSubscriptionStatus();

      // Listen for subscription changes and set external user ID
      // $OneSignal.User.PushSubscription.addEventListener(
      //   "change",
      //   async (event) => {
      //     console.log("OneSignal subscription changed:", event);
      //     // Check and log the new subscription status
      //     const subscriptionId = await checkAndLogSubscriptionStatus();
      //     console.log("User subscription status after change:", subscriptionId);

      //     // If user is subscribed and authenticated, set external user ID
      //     if (subscriptionId && isAuthenticated.value) {
      //       const userId = jwtInfo.value?.sub;
      //       if (userId) {
      //         await loginOneSignal(userId);
      //         console.log("External User ID set after subscription:", userId);
      //       }
      //     }
      //   },
      // );

      isListenerSetup.value = true;
      console.log("OneSignal listeners set up successfully");
    } catch (error) {
      console.error("Error setting up OneSignal listeners:", error);
    }
  };

  /**
   * Setup listeners when route changes (runs on every page)
   */
  const setupListenersOnRouteChange = () => {
    // Watch for route changes
    watch(
      () => route.path,
      async () => {
        // Only setup if OneSignal is available
        if (isOneSignalAvailable()) {
          await setupOneSignalListeners();
        }
      },
      { immediate: false },
    );
  };

  /**
   * Initialize listeners on mount
   */
  onMounted(async () => {
    // Try to setup immediately
    await setupOneSignalListeners();

    // Also setup on route changes
    setupListenersOnRouteChange();
  });

  return {
    setupOneSignalListeners,
    isListenerSetup: readonly(isListenerSetup),
  };
};
