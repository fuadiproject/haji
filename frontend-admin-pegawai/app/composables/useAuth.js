const USERS = [
  { id: 1, username: 'admin_pusat', password: 'password123', role: 'admin_pusat', nama_satker: 'Pusat' },
  { id: 2, username: 'admin_satker', password: 'password123', role: 'admin_satker', nama_satker: 'Sekretariat Jenderal', kode_satker: '01000000' }
]

export const useAuth = () => {
  const user = useCookie('auth_user', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })

  const isAuthenticated = computed(() => !!user.value)

  const login = (username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password)
    if (!found) {
      return { success: false, error: 'Username atau password salah' }
    }
    const { password: _pwd, ...userData } = found
    void _pwd
    user.value = userData
    return { success: true }
  }

  const logout = () => {
    user.value = null
    navigateTo('/auth/login')
  }

  const hasRole = (role) => {
    return user.value?.role === role
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole
  }
}
