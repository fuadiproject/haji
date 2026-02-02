import { useAuth } from "@/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const publicPages = ["/auth/login"];
  const isPublicPage = publicPages.includes(to.path);

  const { isAuthenticated } = useAuth();

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
