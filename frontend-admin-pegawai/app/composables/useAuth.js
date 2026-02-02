export const useAuth = () => {
  const config = useRuntimeConfig()

  // Cookies for authentication
  const user = useCookie('auth_user', {
    maxAge: 60 * 60 * 24,
    sameSite: 'lax'
  })

  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24,
    sameSite: 'lax'
  })

  const tokenCreatedAt = useCookie('auth_token_created_at', {
    maxAge: 60 * 60 * 24,
    sameSite: 'lax'
  })

  // Token expiration: 8 hours in milliseconds
  const TOKEN_EXPIRATION_MS = 8 * 60 * 60 * 1000

  // Check if token is expired based on creation timestamp
  const isTokenExpired = () => {
    if (!tokenCreatedAt.value) return true
    return Date.now() - tokenCreatedAt.value >= TOKEN_EXPIRATION_MS
  }

  // Check token expiration and logout if expired
  const checkTokenExpiration = () => {
    if (isTokenExpired()) {
      logout()
      return true
    }
    return false
  }

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value && !isTokenExpired()
  })

  // Decode JWT token payload
  const decodeToken = (jwtToken) => {
    try {
      const base64Payload = jwtToken.split('.')[1]
      const payload = atob(base64Payload)
      return JSON.parse(payload)
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }

  const login = async (username, password) => {
    try {
      const response = await $fetch(`${config.public.apiUserPresensiUrl}/presensi/v1/users/login`, {
        method: 'POST',
        body: { username, password }
      })

      token.value = response.token
      tokenCreatedAt.value = Date.now()

      // Decode the JWT token to get user info
      const decoded = decodeToken(response.token)
      if (!decoded) {
        return {
          success: false,
          error: 'Token tidak valid'
        }
      }

      user.value = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        kode_satker: decoded.kode_satker
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error?.data?.message || 'Username atau password salah'
      }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    tokenCreatedAt.value = null
    navigateTo('/auth/login')
  }

  const hasRole = (role) => {
    return user.value?.role === role
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    hasRole,
    checkTokenExpiration,
    isTokenExpired
  }
}
