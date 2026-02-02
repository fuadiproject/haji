export const usePresensiApi = () => {
  const config = useRuntimeConfig()
  const { token, logout } = useAuth()

  const BASE_URL = `${config.public.apiUserPresensiUrl}/presensi/v1`

  const handleError = (error) => {
    if (error?.status === 401 || error?.status === 403) {
      logout()
      return
    }
    throw error
  }

  // User Management
  const getAllUsers = async () => {
    return $fetch(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    }).catch((error) => {
      handleError(error)
    })
  }

  const getUserById = async (id) => {
    return $fetch(`${BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    }).catch((error) => {
      handleError(error)
    })
  }

  const createUser = async (data) => {
    return $fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: data
    }).catch((error) => {
      handleError(error)
    })
  }

  const updateUser = async (id, data) => {
    return $fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: data
    }).catch((error) => {
      handleError(error)
    })
  }

  const deleteUser = async (id) => {
    return $fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    }).catch((error) => {
      handleError(error)
    })
  }

  // Kantor (Satker)
  const getAllKantor = async () => {
    return $fetch(`${BASE_URL}/kantor`).catch((error) => {
      handleError(error)
    })
  }

  const getSatkerByKode = async (kode) => {
    return $fetch(`${BASE_URL}/kantor/${kode}`).catch((error) => {
      handleError(error)
    })
  }

  // Rekap Kehadiran
  const getRekapSatker = async (kode_satker, bulan, tahun) => {
    return $fetch(`${BASE_URL}/kehadiran/rekap-satker`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      query: { kode_satker, bulan, tahun }
    }).catch((error) => {
      handleError(error)
    })
  }

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAllKantor,
    getSatkerByKode,
    getRekapSatker
  }
}
