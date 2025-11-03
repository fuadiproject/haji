import Keycloak from "keycloak-js";

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const keycloakConfig = config.public.keycloak;

  // Validasi konfigurasi Keycloak
  if (
    !keycloakConfig.baseUrl ||
    !keycloakConfig.realm ||
    !keycloakConfig.clientId
  ) {
    console.error("Keycloak configuration is incomplete:", keycloakConfig);
    throw new Error("Keycloak configuration is missing required fields");
  }

  // Inisialisasi Keycloak instance
  const keycloak = new Keycloak({
    url: keycloakConfig.baseUrl,
    realm: keycloakConfig.realm,
    clientId: keycloakConfig.clientId,
  });

  let refreshInterval = null;

  // Function untuk membersihkan hash fragment dari URL
  const cleanHashFragment = () => {
    const hash = window.location.hash;
    if (
      hash.includes("state=") ||
      hash.includes("code=") ||
      hash.includes("session_state=")
    ) {
      // console.log("Cleaning hash fragment:", hash);
      const url = new URL(window.location.href);
      const cleanPath = url.pathname + url.search;
      if (window.location.href !== cleanPath) {
        window.history.replaceState({}, "", cleanPath);
      }
    }
  };

  // Setup hash change listener untuk membersihkan hash fragment secara real-time
  const handleHashChange = () => {
    // Delay sedikit untuk memberi waktu Keycloak memproses
    setTimeout(cleanHashFragment, 50);
  };

  window.addEventListener("hashchange", handleHashChange);

  // Prevent unwanted redirect to root
  let currentPath = window.location.pathname;
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  // Override history methods to detect and prevent unwanted redirects
  window.history.pushState = function (...args) {
    console.log("pushState called with:", args[2]);
    if (
      args[2] === "/" &&
      currentPath !== "/" &&
      !currentPath.includes("state=")
    ) {
      console.warn("Preventing redirect to root from:", currentPath);
      args[2] = currentPath;
    }
    currentPath = args[2];
    return originalPushState.apply(this, args);
  };

  window.history.replaceState = function (...args) {
    // console.log("replaceState called with:", args[2]);
    if (
      args[2] === "/" &&
      currentPath !== "/" &&
      !currentPath.includes("state=")
    ) {
      console.warn("Preventing redirect to root from:", currentPath);
      args[2] = currentPath;
    }
    currentPath = args[2];
    return originalReplaceState.apply(this, args);
  };

  // Track location changes
  let lastHref = window.location.href;
  setInterval(() => {
    if (window.location.href !== lastHref) {
      // console.log(
      //   "Location changed from:",
      //   lastHref,
      //   "to:",
      //   window.location.href,
      // );
      if (window.location.pathname === "/" && currentPath !== "/") {
        console.warn("Redirect detected to root, preventing...");
        window.history.replaceState({}, "", currentPath);
      }
      lastHref = window.location.href;
      currentPath = window.location.pathname;
    }
  }, 50);

  try {
    // Check apakah ini adalah callback dari Keycloak (ada hash fragment dengan state/code)
    const isKeycloakCallback =
      window.location.hash.includes("state=") ||
      window.location.hash.includes("code=") ||
      window.location.hash.includes("session_state=");

    let authenticated = false;

    if (isKeycloakCallback) {
      // Ini adalah callback dari Keycloak, gunakan login-required untuk memproses callback
      console.log("Detected Keycloak callback, processing with login-required");
      authenticated = await keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false,
        pkceMethod: "S256",
        redirectUri: keycloakConfig.redirectUrl || window.location.origin,
      });

      // console.log("Keycloak callback processed, authenticated:", authenticated);

      // Clean hash fragment setelah callback diproses
      if (authenticated) {
        setTimeout(cleanHashFragment, 200);
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } else {
      // Gunakan init dengan check-sso, tapi prevent redirect
      console.log("Normal Keycloak check without redirect");

      try {
        // Initialize dengan mode check-sso
        authenticated = await keycloak.init({
          onLoad: "check-sso",
          checkLoginIframe: false,
          // pkceMethod: undefined,
        });

        console.log("Keycloak checked, authenticated:", authenticated);

        // Prevent any redirect that might have been triggered
        if (window.location.pathname !== window.location.pathname) {
          console.log("Preventing redirect to root");
          // Force stay at current path
          const currentPath = window.location.pathname + window.location.search;
          if (currentPath && currentPath !== "/") {
            window.history.replaceState({}, "", currentPath);
          }
        }
      } catch (error) {
        console.warn("Keycloak init error:", error);
        authenticated = false;
      }

      // Clean hash fragment juga setelah check
      cleanHashFragment();
    }

    // Setup event listeners
    keycloak.onAuthSuccess = () => {
      console.log("Auth success event fired");
      setTimeout(cleanHashFragment, 150);
    };

    // Setup token refresh hanya jika sudah authenticated
    if (authenticated) {
      refreshInterval = setInterval(() => {
        keycloak
          .updateToken(60)
          .then((refreshed) => {
            if (refreshed) {
              console.log("Token was successfully refreshed");
            }
          })
          .catch(() => {
            console.error("Failed to refresh token");
            if (refreshInterval) clearInterval(refreshInterval);
          });
      }, 60000);
    }

    keycloak.onTokenExpired = () => {
      console.log("Token expired, refreshing...");
      keycloak.updateToken(60).catch(() => {
        console.error("Failed to refresh expired token");
        if (refreshInterval) clearInterval(refreshInterval);
        // Jangan auto-login, biarkan middleware yang handle
      });
    };

    keycloak.onAuthError = () => {
      console.error("Authentication error - not redirecting");
      if (refreshInterval) clearInterval(refreshInterval);
      cleanHashFragment();
      // Jangan redirect, biarkan middleware yang handle
    };

    keycloak.onAuthLogout = () => {
      console.log("User logged out - not redirecting");
      if (refreshInterval) clearInterval(refreshInterval);
      cleanHashFragment();
      // Jangan redirect, biarkan user akses halaman public
    };
  } catch (error) {
    console.error("Failed to initialize Keycloak", error);
    cleanHashFragment();
  }

  // Provide Keycloak instance ke aplikasi
  return {
    provide: {
      keycloak,
      keycloakReady: true, // Flag untuk menandakan Keycloak sudah siap
    },
  };
});
