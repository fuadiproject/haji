import { useAuth } from "@/composables/useAuth";

export const useServiceBeritaApi = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();

  const BASE_URL = `${config.public.apiBeritaUrl}/api`;

  const handleError = (error) => {
    // if (error?.status === 403) {
    //   logout();
    //   return;
    // }
    throw error;
  };

  const getNews = async ({
    search = "",
    page = 1,
    limit = 10,
    // category = "", // Nasional, Internasional
  }) => {
    return $fetch(`${BASE_URL}/news`, {
      params: {
        search,
        page,
        limit,
        status: "published",
        lang: "id",
        // category,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    getNews,
  };
};
