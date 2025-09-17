import { useStorage } from "@vueuse/core";

export const useServiceBphapi = () => {
  const config = useRuntimeConfig();
  const token = useStorage("t", "", undefined, {
    initOnMounted: true,
    listenToStorageChanges: true,
  });

  const BASE_URL = `${config.public.apiBphUrl}/bphapi`;

  const login = async ({ nip, password }) => {
    return $fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: { nip, password },
    });
  };

  const checkIn = async ({ latitude, longitude }) => {
    return $fetch(`${BASE_URL}/attendance/presensi/check-in`, {
      method: "POST",
      body: { latitude, longitude },
      headers: {
        Authorization: `${token.value}`,
      },
    });
  };

  const checkOut = async ({ latitude, longitude }) => {
    return $fetch(`${BASE_URL}/attendance/presensi/check-out`, {
      method: "POST",
      body: { latitude, longitude },
      headers: {
        Authorization: `${token.value}`,
      },
    });
  };

  return {
    login,
    checkIn,
    checkOut,
  };
};
