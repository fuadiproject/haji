import { useAuth } from "@/composables/useAuth";

export const useServiceSuperappApi = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();

  const BASE_URL = `${config.public.apiSuperAppUrl}/api/front`;

  const handleError = (error) => {
    throw error;
  };

  const getBanner = async () => {
    return $fetch(`${BASE_URL}/banners`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getHyperlinks = async () => {
    return $fetch(`${BASE_URL}/hyperlinks`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  // Notifications
  const getNotifications = async (page = 1, limit = 10) => {
    return $fetch(`${BASE_URL}/notifications`, {
      params: {
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const getNotReadNotificationsCount = async () => {
    return $fetch(`${BASE_URL}/notifications/not-read-count`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const readNotification = async ({ notificationId }) => {
    return $fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  const markAllNotificationsRead = async () => {
    return $fetch(`${BASE_URL}/notifications/read-all`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).catch((error) => {
      handleError(error);
    });
  };

  return {
    getBanner,
    getHyperlinks,
    getNotifications,
    getNotReadNotificationsCount,
    readNotification,
    markAllNotificationsRead,
  };
};
