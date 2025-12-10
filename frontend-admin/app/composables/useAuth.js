import { useKeycloak } from "@/composables/useKeycloak";

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
 * Fungsi untuk logout dari Keycloak
 */
export const logout = async () => {
  const keycloakComposable = useKeycloak();
  await keycloakComposable.logout();
};

export const useAuth = () => {
  const keycloakComposable = useKeycloak();

  // State untuk loading autentikasi
  const isLoading = ref(false);

  // Fungsi untuk login ke Keycloak
  const login = async () => {
    try {
      isLoading.value = true;
      await keycloakComposable.login();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Fungsi untuk logout dari Keycloak
  const logout = async () => {
    try {
      isLoading.value = true;
      await keycloakComposable.logout();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Fungsi untuk cek autentikasi
  // Note: Dengan mode check-sso, authentication sudah di-handle otomatis oleh plugin
  const checkAuth = () => {
    // Hanya jalankan di client-side
    if (import.meta.server) return isAuthenticated.value;

    // Authentication sudah di-handle oleh Keycloak plugin (check-sso mode)
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
