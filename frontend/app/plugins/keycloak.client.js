import Keycloak from "keycloak-js";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const keycloakConfig = config.public.keycloak;

  const keycloak = new Keycloak({
    url: keycloakConfig.baseUrl,
    realm: keycloakConfig.realm,
    clientId: keycloakConfig.clientId,
  });

  await keycloak.init({
    onLoad: "check-sso",
    checkLoginIframe: false,
    pkceMethod: "S256",
    redirectUri:
      (keycloakConfig.redirectUrl || window.location.origin) +
      window.location.pathname,
  });

  nuxtApp.provide("keycloak", keycloak);
});
