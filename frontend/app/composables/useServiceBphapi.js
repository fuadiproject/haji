import { jwtToken, logout } from "@/composables/useAuth";

export const useServiceBphapi = () => {
  const config = useRuntimeConfig();

  const BASE_URL = `${config.public.apiBphUrl}/bphapi`;

  const handleError = (error) => {
    if (error?.status === 403) {
      logout();
      return;
    }
    throw error;
  };

  const login = async ({ nip, password }) => {
    return $fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: { nip, password },
    }).catch((error) => {
      handleError(error);
    });
  };

  const checkIn = async ({ latitude, longitude }) => {
    return $fetch(`${BASE_URL}/attendance/presensi/check-in`, {
      method: "POST",
      body: { latitude, longitude },
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const checkOut = async ({ latitude, longitude }) => {
    return $fetch(`${BASE_URL}/attendance/presensi/check-out`, {
      method: "POST",
      body: { latitude, longitude },
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const history = async ({ startDate, endDate }) => {
    return $fetch(`${BASE_URL}/attendance/history`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    login,
    checkIn,
    checkOut,
    history,
  };
};
