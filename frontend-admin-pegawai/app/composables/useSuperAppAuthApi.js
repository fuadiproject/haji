export const useSuperAppAuthApi = () => {
  const config = useRuntimeConfig();

  const BASE_URL = `${config.public.apiSuperAppUrl}/api/auth`;

  const login = async (data) => {
    return $fetch(`${BASE_URL}/login`, {
      method: "POST",
      body: data,
    }).catch((error) => {
      throw error;
    });
  };

  return {
    login,
  };
};
