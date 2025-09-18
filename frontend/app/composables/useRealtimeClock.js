export const useRealtimeClock = () => {
  // Real-time clock functionality
  const currentTime = ref("");
  const currentDate = ref("");
  let timeInterval = null;

  const updateTime = () => {
    const now = new Date();

    // Format time (HH:MM:SS)
    const timeString = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Format date (Hari, DD MMM YYYY)
    const dateString = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    currentTime.value = timeString;
    currentDate.value = dateString;
  };

  onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
  });

  onUnmounted(() => {
    if (timeInterval) {
      clearInterval(timeInterval);
    }
  });

  return {
    currentTime,
    currentDate,
  };
};
