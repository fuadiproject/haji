/**
 * Composable untuk mengelola Keycloak authentication
 */
export const useKeycloak = () => {
  const { $keycloak } = useNuxtApp();
  const config = useRuntimeConfig();

  // Computed properties untuk informasi user
  const isAuthenticated = computed(() => {
    return $keycloak?.authenticated || false;
  });

  const token = computed(() => {
    return $keycloak?.token || null;
  });

  const refreshToken = computed(() => {
    return $keycloak?.refreshToken || null;
  });

  const idToken = computed(() => {
    return $keycloak?.idToken || null;
  });

  const userInfo = computed(() => {
    if (!$keycloak?.tokenParsed) return null;

    return {
      sub: $keycloak.tokenParsed.sub,
      email: $keycloak.tokenParsed.email,
      emailVerified: $keycloak.tokenParsed.email_verified,
      name: $keycloak.tokenParsed.name,
      preferredUsername: $keycloak.tokenParsed.preferred_username,
      givenName: $keycloak.tokenParsed.given_name,
      familyName: $keycloak.tokenParsed.family_name,
      roles: $keycloak.tokenParsed.realm_access?.roles || [],
      // Custom attributes
      ...$keycloak.tokenParsed,
    };
  });

  // Fungsi untuk login
  const login = async (options = {}) => {
    try {
      await $keycloak.login({
        redirectUri:
          config.public.keycloak.redirectUrl || window.location.origin,
        ...options,
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Fungsi untuk logout
  const logout = async () => {
    try {
      const logoutUrl =
        config.public.keycloak.logoutUrl || window.location.origin;
      await $keycloak.logout({
        redirectUri: logoutUrl,
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Fungsi untuk update token
  const updateToken = async (minValidity = 60) => {
    try {
      const refreshed = await $keycloak.updateToken(minValidity);
      return refreshed;
    } catch (error) {
      console.error("Token update error:", error);
      // Jika gagal update token, redirect ke login
      await login();
      throw error;
    }
  };

  // Fungsi untuk cek apakah user memiliki role tertentu
  const hasRole = (role) => {
    if (!$keycloak?.tokenParsed) return false;
    return $keycloak.hasRealmRole(role);
  };

  // Fungsi untuk cek apakah user memiliki salah satu dari role yang diberikan
  const hasAnyRole = (roles = []) => {
    if (!$keycloak?.tokenParsed) return false;
    return roles.some((role) => $keycloak.hasRealmRole(role));
  };

  // Fungsi untuk cek apakah user memiliki semua role yang diberikan
  const hasAllRoles = (roles = []) => {
    if (!$keycloak?.tokenParsed) return false;
    return roles.every((role) => $keycloak.hasRealmRole(role));
  };

  // Fungsi untuk load user profile dari Keycloak server
  const loadUserProfile = async () => {
    try {
      const profile = await $keycloak.loadUserProfile();
      return profile;
    } catch (error) {
      console.error("Failed to load user profile:", error);
      throw error;
    }
  };

  // Fungsi untuk mendapatkan account management URL
  const getAccountUrl = () => {
    return $keycloak?.createAccountUrl();
  };

  return {
    // Instance
    keycloak: $keycloak,

    // State
    isAuthenticated,
    token,
    refreshToken,
    idToken,
    userInfo,

    // Methods
    login,
    logout,
    updateToken,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    loadUserProfile,
    getAccountUrl,
  };
};
