import { useAuth } from "@/composables/useAuth";

export const useServicePresensiapi = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();

  const BASE_URL = `${config.public.apiPresensiUrl}/api/v1`;

  const handleError = (error) => {
    // if (error?.status === 403) {
    //   logout();
    //   return;
    // }
    throw error;
  };

  const checkIn = async ({ latitude, longitude }) => {
    return $fetch(`${BASE_URL}/kehadiran/check-in`, {
      method: "POST",
      body: { latitude, longitude },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const checkOut = async ({ latitude, longitude }) => {
    return $fetch(`${BASE_URL}/kehadiran/check-out`, {
      method: "POST",
      body: { latitude, longitude },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const rekapKehadiran = async ({ bulan, tahun }) => {
    return $fetch(`${BASE_URL}/kehadiran/rekap`, {
      params: { bulan, tahun },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const historyToday = async () => {
    return $fetch(`${BASE_URL}/pengguna/history-today`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const createIzin = async ({
    kategori,
    tanggal_awal,
    tanggal_akhir,
    alasan,
    lampiran,
    nama_lampiran,
  }) => {
    return $fetch(`${BASE_URL}/pengguna/izin`, {
      method: "POST",
      body: {
        // enum KategoriIzin {
        //   dinas_luar
        //   cuti_tahunan
        //   cuti_besar
        //   cuti_sakit
        //   cuti_melahirkan
        //   cuti_alasan_penting
        //   cuti_luar_tanggungan_negara
        //   izin_tidak_masuk
        // }
        kategori, //: "cuti_sakit",
        tanggal_awal, //: "2025-11-7",
        tanggal_akhir, //: "2025-11-8",
        alasan, //: "Perlu istirahat karena demam tinggi, surat dokter terlampir.",
        lampiran, //: "{{file_lampiran}}",
        nama_lampiran, //: "testing-dokumen.pdf",
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getAllIzin = async () => {
    return $fetch(`${BASE_URL}/pengguna/my-izin`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getProfile = async () => {
    return $fetch(`${BASE_URL}/pengguna/profil`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    checkIn,
    checkOut,
    rekapKehadiran,
    historyToday,
    createIzin,
    getAllIzin,
    getProfile,
  };
};
