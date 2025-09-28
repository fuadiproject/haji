import { useRouter, useRoute } from "vue-router";
import { useStorage } from "@vueuse/core";

import { useServiceBphapi } from "@/composables/useServiceBphapi";

export const jwtToken = useStorage("t", "", undefined, {
  initOnMounted: true,
  listenToStorageChanges: true,
});

/**
 * {
      "nama": "Test",
      "nip": "1",
      "iat": 1758102939,
      "exp": 1758106539
    }
 */
export const jwtInfo = computed(() => {
  return jwtToken.value ? JSON.parse(atob(jwtToken.value.split(".")[1])) : null;
});

export const isAuthenticated = computed(() => {
  return Boolean(jwtToken.value);
});

// Fungsi untuk logout
export const logout = () => {
  jwtToken.value = "";
  window.location.href = "/auth/login";
};

export const useAuth = () => {
  const route = useRoute();
  const toast = useToast();
  const bphapiService = useServiceBphapi();
  const router = useRouter();

  // State untuk loading autentikasi
  const isLoading = ref(true);

  // watch 'exp' in jwtInfo and if its current time is greater than exp, logout
  watch(jwtInfo, (newVal) => {
    if (newVal?.exp && newVal?.exp < Date.now() / 1000) {
      logout();
    }
  });

  // Set loading false setelah localStorage terbaca
  onMounted(() => {
    // Tunggu sebentar untuk memastikan localStorage sudah terbaca
    setTimeout(() => {
      checkAuth();
    }, 100);
  });

  // Fungsi untuk login
  const login = async () => {
    try {
      const data = await bphapiService.login({ nip: "1", password: "1" });
      jwtToken.value = data.token;
      router.push("/");
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error?.message ||
          error?.data?.message ||
          "Terjadi kesalahan, silahkan coba lagi",
        color: "error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  // Fungsi untuk cek autentikasi dan redirect
  const checkAuth = () => {
    // Hanya jalankan di client-side
    if (import.meta.server) return isAuthenticated.value;

    if (!import.meta.client || isLoading.value) return isAuthenticated.value;

    // Jika tidak ada autentikasi dan bukan di halaman login, redirect ke login
    if (!isAuthenticated.value && route.path !== "/auth/login") {
      router.push("/auth/login");
      return false;
    }

    // Jika sudah ada autentikasi dan di halaman login, redirect ke home
    if (isAuthenticated.value && route.path === "/auth/login") {
      router.push("/");
      return true;
    }

    return isAuthenticated.value;
  };

  // Fungsi untuk cek apakah user sudah login
  const isLoggedIn = () => {
    return isAuthenticated.value;
  };

  return {
    token: jwtToken,
    userInfo: jwtInfo,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    isLoggedIn,
  };
};
