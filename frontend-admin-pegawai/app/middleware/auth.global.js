import { useAuth } from "@/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const publicPages = ["/auth/login"];
  const isPublicPage = publicPages.includes(to.path);

  const { isAuthenticated, checkTokenExpiration } = useAuth();

  // Check token expiration on every navigation (except public pages)
  if (!isPublicPage) {
    const isExpired = checkTokenExpiration();
    if (isExpired) {
      return navigateTo("/auth/login");
    }
  }

  if (isPublicPage) {
    if (isAuthenticated.value) {
      return navigateTo("/");
    }
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo("/auth/login");
  }
});
