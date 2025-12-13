import { useAuth } from "@/composables/useAuth";

export const useServiceSuratapi = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();

  const BASE_URL = `${config.public.apiSuratUrl}`;

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
    urgensiId,
  }) => {
    const body = {
      file_id: fileId,
      nomor_surat: nomorSurat,
      tanggal_surat: tanggalSurat,
      nama: nama,
    };
    if (urgensiId) {
      body.urgensi_id = urgensiId;
    }
    return $fetch(`${BASE_URL}/surat-keluar`, {
      method: "POST",
      body: body,
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
    urgensiId,
  }) => {
    const body = {
      file_id: fileId,
      nomor_surat: nomorSurat,
      tanggal_surat: tanggalSurat,
      nama: nama,
    };
    if (urgensiId) {
      body.urgensi_id = urgensiId;
    }
    return $fetch(`${BASE_URL}/surat-keluar/${id}`, {
      method: "PUT",
      body: body,
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
  const getAllUsers = async ({ search = "", limit = 20, all = undefined }) => {
    return $fetch(`${BASE_URL}/users/list`, {
      params: all ? { search, limit, all } : { search, limit },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // booking penomoran
  /**
   * contoh response dari (getAllPenomoranTemplates):
    {
      "success": true,
      "message": "Data template berhasil diambil",
      "data": [
        {
          "id": "cmizzqw780001k507hz21v52q",
          "kode": "SK",
          "nama": "Surat Keputusan",
          "format": "SK/{NO}/{SATKER}/{YEAR}",
          "uses_number": true,
          "uses_satker": true,
          "uses_year": true,
          "created_by": "3315100308960007",
          "updated_by": "3315100308960007",
          "created_at": "2025-12-10T12:34:09.668Z",
          "updated_at": "2025-12-10T12:34:09.668Z",
          "version": 1
        },
        {
          "id": "cmixklfhr0001pz5kydlp2alh",
          "kode": "ST",
          "nama": "Surat Tugas",
          "format": "{NO}/ST/{SATKER}/{YEAR}",
          "uses_number": true,
          "uses_satker": true,
          "uses_year": true,
          "created_by": "3315100308960007",
          "updated_by": "3315100308960007",
          "created_at": "2025-12-08T19:54:28.133Z",
          "updated_at": "2025-12-08T19:54:28.133Z",
          "version": 1
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 2,
        "totalPages": 1
      }
    }
   */
  const getAllPenomoranTemplates = async ({
    page = 1,
    limit = 10,
    search = "",
  }) => {
    return $fetch(`${BASE_URL}/penomoran/templates`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { page, limit, search },
    }).catch((error) => {
      handleError(error);
    });
  };

  // /api/penomoran/my-bookings

  /**
   * contoh response dari (getMyBookPenomoran):
   * {
      "success": true,
      "message": "Data booking berhasil diambil",
      "data": [
        {
          "id": "cmj04w028000fk5076b1gh6ui",
          "penomoran_id": "cmizzwsb10003k5079x6haysa",
          "number": 3,
          "generated_number": "SK/003/k003/2025",
          "status": "BOOKED",
          "keterangan": "Booking otomatis",
          "created_by": "3315100308960007",
          "updated_by": "3315100308960007",
          "created_at": "2025-12-10T14:58:06.032Z",
          "updated_at": "2025-12-10T14:58:06.032Z",
          "version": 1,
          "penomoran": {
            "id": "cmizzwsb10003k5079x6haysa",
            "template_id": "cmizzqw780001k507hz21v52q",
            "satker": "k003",
            "tahun": 2025,
            "last_number": 3,
            "created_by": "3315100308960007",
            "updated_by": "3315100308960007",
            "created_at": "2025-12-10T12:38:44.558Z",
            "updated_at": "2025-12-10T14:58:06.026Z",
            "version": 1,
            "template": {
              "id": "cmizzqw780001k507hz21v52q",
              "kode": "SK",
              "nama": "Surat Keputusan",
              "format": "SK/{NO}/{SATKER}/{YEAR}",
              "uses_number": true,
              "uses_satker": true,
              "uses_year": true,
              "created_by": "3315100308960007",
              "updated_by": "3315100308960007",
              "created_at": "2025-12-10T12:34:09.668Z",
              "updated_at": "2025-12-10T12:34:09.668Z",
              "version": 1
            }
          },
          "creator": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          },
          "updater": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          }
        },
        {
          "id": "cmj04vypm000bk507eiuq9rkh",
          "penomoran_id": "cmizzwsb10003k5079x6haysa",
          "number": 2,
          "generated_number": "SK/002/k003/2025",
          "status": "BOOKED",
          "keterangan": "Booking otomatis",
          "created_by": "3315100308960007",
          "updated_by": "3315100308960007",
          "created_at": "2025-12-10T14:58:04.282Z",
          "updated_at": "2025-12-10T14:58:04.282Z",
          "version": 1,
          "penomoran": {
            "id": "cmizzwsb10003k5079x6haysa",
            "template_id": "cmizzqw780001k507hz21v52q",
            "satker": "k003",
            "tahun": 2025,
            "last_number": 3,
            "created_by": "3315100308960007",
            "updated_by": "3315100308960007",
            "created_at": "2025-12-10T12:38:44.558Z",
            "updated_at": "2025-12-10T14:58:06.026Z",
            "version": 1,
            "template": {
              "id": "cmizzqw780001k507hz21v52q",
              "kode": "SK",
              "nama": "Surat Keputusan",
              "format": "SK/{NO}/{SATKER}/{YEAR}",
              "uses_number": true,
              "uses_satker": true,
              "uses_year": true,
              "created_by": "3315100308960007",
              "updated_by": "3315100308960007",
              "created_at": "2025-12-10T12:34:09.668Z",
              "updated_at": "2025-12-10T12:34:09.668Z",
              "version": 1
            }
          },
          "creator": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          },
          "updater": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          }
        },
        {
          "id": "cmixl76ld0007pzqstv2crzl3",
          "penomoran_id": "cmixl5ruy0001pzqshx3bdoky",
          "number": 2,
          "generated_number": "002/ST/k003/2025",
          "status": "BOOKED",
          "keterangan": "Untuk Surat Tugas B",
          "created_by": "3315100308960007",
          "updated_by": "3315100308960007",
          "created_at": "2025-12-08T20:11:23.040Z",
          "updated_at": "2025-12-08T20:11:23.040Z",
          "version": 1,
          "penomoran": {
            "id": "cmixl5ruy0001pzqshx3bdoky",
            "template_id": "cmixklfhr0001pz5kydlp2alh",
            "satker": "k003",
            "tahun": 2025,
            "last_number": 2,
            "created_by": "3315100308960007",
            "updated_by": "3315100308960007",
            "created_at": "2025-12-08T20:10:17.287Z",
            "updated_at": "2025-12-08T20:11:22.515Z",
            "version": 1,
            "template": {
              "id": "cmixklfhr0001pz5kydlp2alh",
              "kode": "ST",
              "nama": "Surat Tugas",
              "format": "{NO}/ST/{SATKER}/{YEAR}",
              "uses_number": true,
              "uses_satker": true,
              "uses_year": true,
              "created_by": "3315100308960007",
              "updated_by": "3315100308960007",
              "created_at": "2025-12-08T19:54:28.133Z",
              "updated_at": "2025-12-08T19:54:28.133Z",
              "version": 1
            }
          },
          "creator": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          },
          "updater": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          }
        },
        {
          "id": "cmixl5s670003pzqs3faxsj92",
          "penomoran_id": "cmixl5ruy0001pzqshx3bdoky",
          "number": 1,
          "generated_number": "001/ST/k003/2025",
          "status": "BOOKED",
          "keterangan": "Untuk Surat Tugas B",
          "created_by": "3315100308960007",
          "updated_by": "3315100308960007",
          "created_at": "2025-12-08T20:10:17.695Z",
          "updated_at": "2025-12-08T20:10:17.695Z",
          "version": 1,
          "penomoran": {
            "id": "cmixl5ruy0001pzqshx3bdoky",
            "template_id": "cmixklfhr0001pz5kydlp2alh",
            "satker": "k003",
            "tahun": 2025,
            "last_number": 2,
            "created_by": "3315100308960007",
            "updated_by": "3315100308960007",
            "created_at": "2025-12-08T20:10:17.287Z",
            "updated_at": "2025-12-08T20:11:22.515Z",
            "version": 1,
            "template": {
              "id": "cmixklfhr0001pz5kydlp2alh",
              "kode": "ST",
              "nama": "Surat Tugas",
              "format": "{NO}/ST/{SATKER}/{YEAR}",
              "uses_number": true,
              "uses_satker": true,
              "uses_year": true,
              "created_by": "3315100308960007",
              "updated_by": "3315100308960007",
              "created_at": "2025-12-08T19:54:28.133Z",
              "updated_at": "2025-12-08T19:54:28.133Z",
              "version": 1
            }
          },
          "creator": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          },
          "updater": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          }
        }
      ],
      "pagination": {
        "current_page": 1,
        "per_page": 10,
        "total": 4,
        "total_pages": 1,
        "has_next": false,
        "has_prev": false
      }
    }
   */

  /**
   * status example:
   * - BOOKED
   * - USED
   */
  const getMyBookPenomoran = async ({
    page = 1,
    limit = 10,
    status = undefined,
  }) => {
    return $fetch(`${BASE_URL}/penomoran/my-bookings`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { page, limit, status },
    }).catch((error) => {
      handleError(error);
    });
  };

  /**
   * data example:
   * {
   *  "template_id": "cm1abc123def456",
   *  "keterangan": "Keterangan",
   * }
   */

  /**
   * 
   * contoh response dari (createBookPenomoran):
   * {
        "success": true,
        "message": "Nomor berhasil dibooking",
        "data": {
          "id": "cmj04w028000fk5076b1gh6ui",
          "penomoran_id": "cmizzwsb10003k5079x6haysa",
          "number": 3,
          "generated_number": "SK/003/k003/2025",
          "status": "BOOKED",
          "keterangan": "Booking otomatis",
          "created_by": "3315100308960007",
          "updated_by": "3315100308960007",
          "created_at": "2025-12-10T14:58:06.032Z",
          "updated_at": "2025-12-10T14:58:06.032Z",
          "version": 1,
          "penomoran": {
            "id": "cmizzwsb10003k5079x6haysa",
            "template_id": "cmizzqw780001k507hz21v52q",
            "satker": "k003",
            "tahun": 2025,
            "last_number": 3,
            "created_by": "3315100308960007",
            "updated_by": "3315100308960007",
            "created_at": "2025-12-10T12:38:44.558Z",
            "updated_at": "2025-12-10T14:58:06.026Z",
            "version": 1,
            "template": {
              "id": "cmizzqw780001k507hz21v52q",
              "kode": "SK",
              "nama": "Surat Keputusan",
              "format": "SK/{NO}/{SATKER}/{YEAR}",
              "uses_number": true,
              "uses_satker": true,
              "uses_year": true,
              "created_by": "3315100308960007",
              "updated_by": "3315100308960007",
              "created_at": "2025-12-10T12:34:09.668Z",
              "updated_at": "2025-12-10T12:34:09.668Z",
              "version": 1
            }
          },
          "creator": {
            "nik": "3315100308960007",
            "nama": "Ali Sadikin",
            "nip": "199608032018121001"
          }
        }
      }
   */
  const createBookPenomoran = async ({ data }) => {
    return $fetch(`${BASE_URL}/penomoran/book`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // /api/penomoran/{id}/use
  /**
   * data example:
   * {
   * "surat_keluar_id": "cmj04ydzv000hk507ab72ydff"
   * }
   */
  const putUsePenomoran = async ({ bookingId, data }) => {
    return $fetch(`${BASE_URL}/penomoran/${bookingId}/use`, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // /api/template-files
  /**
   * data example:
   * {
   * "kategori": "ST" // Surat Tugas
   * "kategori": "KEPKA" // Keputusan Kepala
   * "kategori": "SK" // Surat Keputusan
   * "kategori": "UNDANGAN" // Surat Undangan
   * "kategori": "NOTA_DINAS" // Nota Dinas
   * }
   */

  /**
   * 
   * contoh response dari (getTemplateFiles):
   * {
      "success": true,
      "message": "Template files berhasil diambil",
      "data": [
        {
          "id": "cmj00ju6j0007k50719w0bh9q",
          "file_id": "cmivgde9a0006n107h76b2q5r",
          "nama": "Template Surat Tugas",
          "deskripsi": "Template untuk surat tugas dinas luar",
          "kategori": "ST",
          "is_active": true,
          "created_by": "3315100308960007",
          "updated_by": "3315100308960007",
          "created_at": "2025-12-10T12:56:40.076Z",
          "updated_at": "2025-12-10T12:56:40.076Z",
          "version": 1,
          "file": {
            "id": "cmivgde9a0006n107h76b2q5r",
            "filename": "Doc1.pdf",
            "filepath": "http://my-minio.minio.svc.cluster.local:9000/surat/uploads/2025/12/1765095642436-Doc1.pdf",
            "mimetype": "application/pdf",
            "size": 27380
          }
        }
      ]
    }
   */
  const getTemplateFiles = async ({ kategori = undefined }) => {
    return $fetch(`${BASE_URL}/template-files`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { kategori },
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
    getAllPenomoranTemplates,
    getMyBookPenomoran,
    createBookPenomoran,
    putUsePenomoran,
    getTemplateFiles,
  };
};
