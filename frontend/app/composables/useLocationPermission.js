export const useLocationPermission = () => {
  const locationPermission = ref({
    permission: false,
    state: "",
  });

  const requestLocationPermission = async (cb) => {
    if (!("geolocation" in navigator)) {
      console.warn("Browser tidak mendukung geolocation");
      cb(false, null);
      return false;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      locationPermission.value.permission = permission.state === "granted";
      locationPermission.value.state = permission.state;

      let position = null;

      // Jika permission belum granted, coba request permission dengan getCurrentPosition
      if (permission.state !== "granted") {
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve(pos);
            },
            (error) => {
              reject(error);
            },
            { timeout: 5000 },
          );
        });
      } else {
        // Jika permission sudah granted, ambil position
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve(pos);
            },
            (error) => {
              reject(error);
            },
            { timeout: 5000 },
          );
        });
      }

      cb(true, position);
    } catch (error) {
      console.log("Location permission error:", error.message);
      locationPermission.value.permission = false;
      locationPermission.value.state = "denied";
      cb(false, null);
    }
  };

  return {
    locationPermission,
    requestLocationPermission,
  };
};
