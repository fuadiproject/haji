import { logout } from "@/composables/useAuth";

export const useServicePersuratanApi = () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const BASE_URL = `${config.public.apiPersuratanUrl}/api`;
  const BASE_URL_PENOMORAN_TEMPLATE = `${BASE_URL}/admin-penomoran/templates`;

  const handleError = (error) => {
    if (error?.status === 403) {
      logout();
      return;
    }
    throw error;
  };

  const createTemplatePenomoran = async (data) => {
    return $fetch(`${BASE_URL_PENOMORAN_TEMPLATE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: data,
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllTemplatePenomoran = async () => {
    return $fetch(`${BASE_URL}/penomoran/templates`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getTemplatePenomoranById = async (id) => {
    return $fetch(`${BASE_URL_PENOMORAN_TEMPLATE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateTemplatePenomoran = async (id, data) => {
    return $fetch(`${BASE_URL_PENOMORAN_TEMPLATE}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: data,
    }).catch((error) => {
      handleError(error);
    });
  };

  const deleteTemplatePenomoran = async (id) => {
    return $fetch(`${BASE_URL_PENOMORAN_TEMPLATE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    createTemplatePenomoran,
    getAllTemplatePenomoran,
    updateTemplatePenomoran,
    deleteTemplatePenomoran,
    getTemplatePenomoranById,
  };
};
