import { useStorage } from "@vueuse/core";
import { useRouter, useRoute } from "vue-router";

export const useAuth = () => {
  const router = useRouter();
  const route = useRoute();

  // State untuk loading autentikasi
  const isLoading = ref(true);

  // Menggunakan useStorage dengan opsi untuk menghindari SSR issues
  const isAuthenticated = useStorage("auth-status", false, undefined, {
    // Hanya jalankan di client-side
    initOnMounted: true,
    // Listen perubahan storage
    listenToStorageChanges: true,
  });

  // Set loading false setelah localStorage terbaca
  onMounted(() => {
    // Tunggu sebentar untuk memastikan localStorage sudah terbaca
    setTimeout(() => {
      isLoading.value = false;
    }, 100);
  });

  // Fungsi untuk login
  const login = () => {
    isAuthenticated.value = true;
  };

  // Fungsi untuk logout
  const logout = () => {
    isAuthenticated.value = false;
    router.push("/auth/login");
  };

  // Fungsi untuk cek autentikasi dan redirect
  const checkAuth = () => {
    // Hanya jalankan di client-side
    if (import.meta.server) return isAuthenticated.value;

    // Tunggu sampai localStorage terbaca
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
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    isLoggedIn,
  };
};
