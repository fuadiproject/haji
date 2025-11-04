import { useAuth } from "@/composables/useAuth";

export const useServiceSuratapi = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();

  const BASE_URL = `${config.public.apiSuratUrl}/api`;

  const handleError = (error) => {
    // if (error?.status === 403) {
    //   logout();
    //   return;
    // }
    throw error;
  };

  // File Management
  const uploadFile = async ({ data }) => {
    return $fetch(`${BASE_URL}/files/upload`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getFileById = async ({ fileId }) => {
    return $fetch(`${BASE_URL}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const downloadFile = async ({ fileId }) => {
    return $fetch(`${BASE_URL}/files/${fileId}/download`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: "application/pdf",
      },
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const verifyFile = async ({ fileId }) => {
    // Menggunakan fetch API langsung untuk mendapatkan blob response
    const response = await fetch(`${BASE_URL}/verify/${fileId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw error;
    }

    // Mengembalikan blob
    return await response.blob();
  };

  const updateFileById = async ({ fileId, data }) => {
    return $fetch(`${BASE_URL}/files/upload/${fileId}`, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Surat Masuk
  const createSuratMasuk = async ({ fileId, nomorSurat, nama }) => {
    return $fetch(`${BASE_URL}/surat-masuk`, {
      method: "POST",
      body: { file_id: fileId, nomor_surat: nomorSurat, nama: nama },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllSuratMasuk = async ({ page, limit, search }) => {
    return $fetch(`${BASE_URL}/surat-masuk`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { page, limit, search },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getSuratMasukById = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateSuratMasuk = async ({ id, fileId, nomorSurat, nama }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}`, {
      method: "PUT",
      body: { file_id: fileId, nomor_surat: nomorSurat, nama: nama },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const deleteSuratMasuk = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getDisposisiSuratMasukById = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-masuk/${id}/disposisi`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
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
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Surat Keluar
  const createSuratKeluar = async ({
    fileId,
    nomorSurat,
    tanggalSurat,
    nama,
  }) => {
    return $fetch(`${BASE_URL}/surat-keluar`, {
      method: "POST",
      body: {
        file_id: fileId,
        nomor_surat: nomorSurat,
        tanggal_surat: tanggalSurat,
        nama: nama,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllSuratKeluar = async ({ page, limit, search }) => {
    return $fetch(`${BASE_URL}/surat-keluar`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { page, limit, search },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getSuratKeluarById = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
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
    nama,
  }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}`, {
      method: "PUT",
      body: {
        file_id: fileId,
        nomor_surat: nomorSurat,
        tanggal_surat: tanggalSurat,
        nama: nama,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const deleteSuratKeluar = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getDisposisiSuratKeluarById = async ({ id }) => {
    return $fetch(`${BASE_URL}/surat-keluar/${id}/disposisi`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
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
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Master Data
  const getAllSifat = async () => {
    return $fetch(`${BASE_URL}/master/sifat`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllUrgensi = async () => {
    return $fetch(`${BASE_URL}/master/urgensi`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllPetunjuk = async () => {
    return $fetch(`${BASE_URL}/master/petunjuk`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // TTE Management
  const getAllTTEInbox = async () => {
    return $fetch(`${BASE_URL}/tte/inbox`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllTTEToutbox = async () => {
    return $fetch(`${BASE_URL}/tte/outbox`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getTTEById = async ({ id }) => {
    return $fetch(`${BASE_URL}/tte/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  /**
   * data example:
   * {
      "surat_keluar_id": "cm1abc123def456",
      "penerima": [
        {
          "nik_penerima": "6543210987654321",
          "jenis": "PARAF" // PARAF | TTE
        }
      ]
    }
   */
  const createTTE = async ({ data }) => {
    return $fetch(`${BASE_URL}/tte`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateTTESign = async ({ id, data }) => {
    return $fetch(`${BASE_URL}/tte/${id}/sign`, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const updateTTEReject = async ({ id, data }) => {
    return $fetch(`${BASE_URL}/tte/${id}/reject`, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // User Management
  const getAllUsers = async ({ search = "", limit = 20 }) => {
    return $fetch(`${BASE_URL}/users/list`, {
      params: { search, limit },
      headers: {
        Authorization: `Bearer ${getToken()}`,
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
    verifyFile,
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
    getAllTTEInbox,
    getAllTTEToutbox,
    getTTEById,
    createTTE,
    updateTTESign,
    updateTTEReject,
    getAllUsers,
  };
};
