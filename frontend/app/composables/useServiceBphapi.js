import { jwtToken } from "@/composables/useAuth";

export const useServiceBphapi = () => {
  const config = useRuntimeConfig();

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
        Authorization: `${jwtToken.value}`,
      },
    });
  };

  const checkOut = async ({ latitude, longitude }) => {
    return $fetch(`${BASE_URL}/attendance/presensi/check-out`, {
      method: "POST",
      body: { latitude, longitude },
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    });
  };

  return {
    login,
    checkIn,
    checkOut,
  };
};
