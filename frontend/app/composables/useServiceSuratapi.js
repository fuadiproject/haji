import { logout } from "@/composables/useAuth";
const jwtToken = {
  value:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2x4MTIzNDU2Nzg5MGFiY2RlZiIsIm5payI6IjEyMzQ1Njc4OTAxMjM0NTYiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NDUxNTIwMCwiZXhwIjoxNjk0NjAxNjAwfQ.user1_signature",
};

export const useServiceSuratapi = () => {
  const config = useRuntimeConfig();

  const BASE_URL = `${config.public.apiSuratUrl}/api`;

  const handleError = (error) => {
    if (error?.status === 403) {
      logout();
      return;
    }
    throw error;
  };

  // File Management
  const uploadFile = async ({ data }) => {
    return $fetch(`${BASE_URL}/files/upload`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getFileById = async ({ fileId }) => {
    return $fetch(`${BASE_URL}/files/${fileId}`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const downloadFile = async ({ fileId }) => {
    return $fetch(`${BASE_URL}/files/${fileId}/download`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateFileById = async ({ fileId, data }) => {
    return $fetch(`${BASE_URL}/files/upload/${fileId}`, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Surat Masuk
  const createSuratMasuk = async ({ fileId, nomorSurat }) => {
    return $fetch(`${BASE_URL}/surat-masuk`, {
      method: "POST",
      body: { file_id: fileId, nomor_surat: nomorSurat },
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllSuratMasuk = async ({ page, limit, search }) => {
    return $fetch(`${BASE_URL}/surat-masuk`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
      params: { page, limit, search },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getSuratMasukById = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateSuratMasuk = async ({ id, fileId, nomorSurat }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}`, {
      method: "PUT",
      body: { file_id: fileId, nomor_surat: nomorSurat },
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const deleteSuratMasuk = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getDisposisiSuratMasukById = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}/disposisi`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const disposisiSuratMasuk = async ({ id, data }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}/disposisi`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Surat Keluar
  const createSuratKeluar = async ({ fileId, nomorSurat, tanggalSurat }) => {
    return $fetch(`${BASE_URL}/surat-keluar`, {
      method: "POST",
      body: {
        file_id: fileId,
        nomor_surat: nomorSurat,
        tanggal_surat: tanggalSurat,
      },
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllSuratKeluar = async ({ page, limit, search }) => {
    return $fetch(`${BASE_URL}/surat-keluar`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
      params: { page, limit, search },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getSuratKeluarById = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateSuratKeluar = async ({
    id,
    fileId,
    nomorSurat,
    tanggalSurat,
  }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}`, {
      method: "PUT",
      body: {
        file_id: fileId,
        nomor_surat: nomorSurat,
        tanggal_surat: tanggalSurat,
      },
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const deleteSuratKeluar = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getDisposisiSuratKeluarById = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}/disposisi`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const disposisiSuratKeluar = async ({ id, data }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}/disposisi`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Master Data
  const getAllSifat = async () => {
    return $fetch(`${BASE_URL}/master/sifat`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllUrgensi = async () => {
    return $fetch(`${BASE_URL}/master/urgensi`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllPetunjuk = async () => {
    return $fetch(`${BASE_URL}/master/petunjuk`, {
      headers: {
        Authorization: `${jwtToken.value}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    uploadFile,
    updateFileById,
    getFileById,
    downloadFile,
    createSuratMasuk,
    getAllSuratMasuk,
    getSuratMasukById,
    updateSuratMasuk,
    deleteSuratMasuk,
    disposisiSuratMasuk,
    getDisposisiSuratMasukById,
    createSuratKeluar,
    getAllSuratKeluar,
    getSuratKeluarById,
    updateSuratKeluar,
    deleteSuratKeluar,
    disposisiSuratKeluar,
    getDisposisiSuratKeluarById,
    getAllSifat,
    getAllUrgensi,
    getAllPetunjuk,
  };
};
