import { jwtToken, logout } from "@/composables/useAuth";

export const useServiceBphapi = () => {
  const config = useRuntimeConfig();

  const BASE_URL_MASTER = `${config.public.apiMasterDataUrl}/master`;
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

  // Petunjuk
  const getPetunjuk = async () => {
    return $fetch(`${BASE_URL_MASTER}/petunjuk`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const createPetunjuk = async (data) => {
    return $fetch(`${BASE_URL_MASTER}/petunjuk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
      body: {
        petunjuk: data,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const updatePetunjuk = async (id, data) => {
    return $fetch(`${BASE_URL_MASTER}/petunjuk/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
      body: data,
    }).catch((error) => {
      handleError(error);
    });
  };

  const deletePetunjuk = async (id) => {
    return $fetch(`${BASE_URL_MASTER}/petunjuk/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Sifat
  const getSifatSurat = async () => {
    return $fetch(`${BASE_URL_MASTER}/sifat`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const createSifatSurat = async (data) => {
    return $fetch(`${BASE_URL_MASTER}/sifat`, {
      method: "POST",
      headers: {
        Authorization: `${jwtToken.value}`,
      },
      body: data,
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateSifatSurat = async (id, data) => {
    return $fetch(`${BASE_URL_MASTER}/sifat/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
      body: data,
    }).catch((error) => {
      handleError(error);
    });
  };

  const deleteSifatSurat = async (id) => {
    return $fetch(`${BASE_URL_MASTER}/sifat/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Urgensi
  const getUrgensiSurat = async () => {
    return $fetch(`${BASE_URL_MASTER}/urgensi`, {
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const createUrgensiSurat = async (data) => {
    return $fetch(`${BASE_URL_MASTER}/urgensi`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
      body: data,
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateUrgensiSurat = async (id, data) => {
    return $fetch(`${BASE_URL_MASTER}/urgensi/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `${jwtToken.value}`,
      },
      body: data,
    }).catch((error) => {
      handleError(error);
    });
  };

  const deleteUrgensiSurat = async (id) => {
    return $fetch(`${BASE_URL_MASTER}/urgensi/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    login,
    getPetunjuk,
    createPetunjuk,
    updatePetunjuk,
    deletePetunjuk,
    getSifatSurat,
    createSifatSurat,
    updateSifatSurat,
    deleteSifatSurat,
    getUrgensiSurat,
    createUrgensiSurat,
    updateUrgensiSurat,
    deleteUrgensiSurat,
  };
};
