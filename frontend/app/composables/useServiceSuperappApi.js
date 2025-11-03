import { useAuth } from "@/composables/useAuth";

export const useServiceSuperappApi = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();

  const BASE_URL = `${config.public.apiSuperAppUrl}/api/front`;

  const handleError = (error) => {
    throw error;
  };

  const getBanner = async () => {
    return $fetch(`${BASE_URL}/banners`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getHyperlinks = async () => {
    return $fetch(`${BASE_URL}/hyperlinks`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    getBanner,
    getHyperlinks,
  };
};
