import { useAuth } from "@/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  // Hanya jalankan di client-side
  if (import.meta.server) return;

  // Gunakan composable useAuth
  const { isAuthenticated } = useAuth();

  // Jika tidak ada autentikasi dan bukan di halaman login, redirect ke login
  if (!isAuthenticated.value && to.path !== "/auth/login") {
    return (window.location.href = "/auth/login");
  }

  // Jika sudah ada autentikasi dan di halaman login, redirect ke home
  if (isAuthenticated.value && to.path === "/auth/login") {
    return (window.location.href = "/");
  }
});
