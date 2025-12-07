import { useKeycloak } from "@/composables/useKeycloak";
import { useOneSignal } from "@/composables/useOneSignal";

/**
 * User Info dari Keycloak token
 */
export const jwtInfo = computed(() => {
  const keycloakComposable = useKeycloak();
  return keycloakComposable.userInfo.value;
});

/**
 * Status autentikasi dari Keycloak
 */
export const isAuthenticated = computed(() => {
  const keycloakComposable = useKeycloak();
  return keycloakComposable.isAuthenticated.value;
});

/**
 * Fungsi untuk logout dari Keycloak dan OneSignal
 */
export const logout = async () => {
  const keycloakComposable = useKeycloak();
  const { logoutOneSignal } = useOneSignal();
  // Logout from OneSignal first
  await logoutOneSignal();
  // Then logout from Keycloak
  await keycloakComposable.logout();
};

export const useAuth = () => {
  const keycloakComposable = useKeycloak();
  const { logoutOneSignal } = useOneSignal();

  // State untuk loading autentikasi
  const isLoading = ref(false);

  // Setup OneSignal external user ID saat authenticated
  // Use watcher to handle both initial mount and login after mount
  watch(
    () => [
      keycloakComposable.isAuthenticated.value,
      keycloakComposable.userInfo.value,
    ],
    async ([isAuth, userInfo]) => {
      if (isAuth && userInfo) {
        // Set external user ID untuk OneSignal notifications
        // Gunakan sub (user ID) atau preferred_username dari Keycloak
        const userId = userInfo.sub || userInfo.preferredUsername;
        if (userId) {
          // setExternalUserId(userId);
        }
      }
    },
    { immediate: true },
  );

  // Fungsi untuk login ke Keycloak
  const login = async () => {
    try {
      isLoading.value = true;
      await keycloakComposable.login();
      // OneSignal user ID will be set automatically by the watcher
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Fungsi untuk logout dari Keycloak dan OneSignal
  const logout = async () => {
    try {
      isLoading.value = true;
      // Logout from OneSignal first
      await logoutOneSignal();
      // Then logout from Keycloak
      await keycloakComposable.logout();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Fungsi untuk cek autentikasi
  // Note: Dengan mode login-required, authentication sudah di-handle otomatis oleh plugin
  const checkAuth = () => {
    // Hanya jalankan di client-side
    if (import.meta.server) return isAuthenticated.value;

    // Authentication sudah di-handle oleh Keycloak plugin (login-required mode)
    // Fungsi ini hanya untuk keperluan check status
    return keycloakComposable.isAuthenticated.value;
  };

  // Fungsi untuk cek apakah user sudah login
  const isLoggedIn = () => {
    return keycloakComposable.isAuthenticated.value;
  };

  // Fungsi untuk mendapatkan token untuk API calls
  const getToken = () => {
    return keycloakComposable.token.value;
  };

  // Fungsi untuk cek role
  const hasRole = (role) => {
    return keycloakComposable.hasRole(role);
  };

  // Fungsi untuk cek apakah user memiliki salah satu role
  const hasAnyRole = (roles) => {
    return keycloakComposable.hasAnyRole(roles);
  };

  // Fungsi untuk cek apakah user memiliki semua role
  const hasAllRoles = (roles) => {
    return keycloakComposable.hasAllRoles(roles);
  };

  return {
    // State
    token: keycloakComposable.token,
    userInfo: jwtInfo,
    isAuthenticated,
    isLoading,

    // Methods
    login,
    logout,
    checkAuth,
    isLoggedIn,
    getToken,
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Expose Keycloak composable untuk akses langsung jika diperlukan
    keycloak: keycloakComposable,
  };
};
