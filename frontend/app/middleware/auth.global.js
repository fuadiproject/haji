import { useAuth } from "@/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Hanya jalankan di client-side
  if (import.meta.server) return;

  // Jangan redirect jika dari path / ke /
  if (from.path === "/" && to.path === "/") {
    return;
  }

  // Gunakan composable useAuth
  const { isAuthenticated, login } = useAuth();

  // Jangan redirect jika masih di halaman login
  if (to.path === "/auth/login") {
    // Tunggu sedikit untuk Keycloak finish check session
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Jika sudah authenticated dan di halaman login, redirect ke home
    if (isAuthenticated.value) {
      return navigateTo("/");
    }
    return;
  }

  console.log(`Middleware check: from=${from.path}, to=${to.path}`);

  // Tunggu Keycloak selesai initialize
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log(
    `Middleware result: path=${to.path}, authenticated=${isAuthenticated.value}`,
  );

  // Cek ulang autentikasi
  if (!isAuthenticated.value) {
    console.log(
      "User not authenticated, redirecting to Keycloak login from path:",
      to.path,
    );
    await login();
  }

  // IMPORTANT: Force stay di current path
  console.log(`Middleware finished for path: ${to.path}`);
});
