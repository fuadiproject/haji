import { useAuth } from "@/composables/useAuth";

export const useServiceHajiApi = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();

  const BASE_URL = `${config.public.apiHajiUrl}/api`;

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

  const getRegulasi = async ({
    search = "",
    page = 1,
    limit = 10,
    category, // Undang Undang, Peraturan Pemerintah, Peraturan Presiden, Keputusan Presiden, Peraturan Menteri, Keputusan Menteri, Keputusan Sekretaris Jenderal, Keputusan Direktur Jenderal, Keputusan Inspektur Jenderal, Peraturan Lainnya
  }) => {
    const params = {
      search,
      page,
      limit,
      lang: "id",
    };
    if (category) {
      params.category = category;
    }
    return $fetch(`${BASE_URL}/regulations`, {
      params,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    getNews,
    getRegulasi,
  };
};
