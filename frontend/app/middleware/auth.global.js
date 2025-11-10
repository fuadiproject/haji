import { useAuth } from "@/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Hanya jalankan di client-side
  if (import.meta.server) return;

  // Halaman yang bisa diakses tanpa autentikasi
  const publicPages = ["/auth/login"];
  const isPublicPage = publicPages.includes(to.path);

  // Jika halaman public, skip pengecekan autentikasi
  if (isPublicPage) {
    console.log(`Public page accessed: ${to.path}, skipping auth check`);

    // Tunggu sedikit untuk Keycloak finish check session
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Gunakan composable useAuth
    const { isAuthenticated } = useAuth();

    // Jika sudah authenticated dan di halaman login, redirect ke home
    if (to.path === "/auth/login" && isAuthenticated.value) {
      console.log("Already authenticated, redirecting to home");
      return navigateTo("/");
    }

    // Biarkan akses ke halaman public
    return;
  }

  // Untuk halaman yang memerlukan autentikasi
  console.log(`Protected page: from=${from.path}, to=${to.path}`);

  // Gunakan composable useAuth
  const { isAuthenticated } = useAuth();

  // Tunggu Keycloak selesai initialize
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log(
    `Auth check result: path=${to.path}, authenticated=${isAuthenticated.value}`,
  );

  // Cek autentikasi
  if (!isAuthenticated.value) {
    console.log(
      "User not authenticated, redirecting to login page from:",
      to.path,
    );
    // Redirect ke halaman login lokal, bukan langsung ke SSO
    return navigateTo("/auth/login");
  }

  // User authenticated, lanjutkan ke halaman yang dituju
  console.log(`User authenticated, proceeding to: ${to.path}`);
});
