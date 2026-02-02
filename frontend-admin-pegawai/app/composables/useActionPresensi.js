import { ref } from "vue";
import { TEXT } from "@/constants/text";
import { useLocationPermission } from "@/composables/useLocationPermission";
import { useServiceBphapi } from "@/composables/useServiceBphapi";

export const useActionPresensi = () => {
  const { requestLocationPermission } = useLocationPermission();
  const { logout } = useAuth();
  const toast = useToast();
  const bphapiService = useServiceBphapi();

  const isModalAbsenConfirm = ref(false);
  const isModalAbsenConfirmType = ref("absenMasuk");
  const latitude = ref(null);
  const longitude = ref(null);
  const isLoading = ref(false);

  const handleAbsen = (type) => {
    requestLocationPermission((permission, position) => {
      if (permission) {
        if (type === "absenMasuk") {
          isModalAbsenConfirm.value = true;
          isModalAbsenConfirmType.value = "absenMasuk";
          latitude.value = position?.coords?.latitude;
          longitude.value = position?.coords?.longitude;
        } else {
          isModalAbsenConfirm.value = true;
          isModalAbsenConfirmType.value = "absenKeluar";
          latitude.value = position?.coords?.latitude;
          longitude.value = position?.coords?.longitude;
        }
      } else {
        toast.add({
          title: TEXT.peringatan,
          description: TEXT.harapIzinkanAksesLokasiUntukMelakukanAbsen,
          color: "warning",
        });
      }
    });
  };

  const handleCloseModalAbsenConfirm = () => {
    isModalAbsenConfirm.value = false;
    isModalAbsenConfirmType.value = "";
  };

  const handleConfirmAbsen = async (type) => {
    isLoading.value = true;
    try {
      const funcName = type === "absenMasuk" ? "checkIn" : "checkOut";
      const response = await bphapiService[funcName]({
        latitude: latitude.value,
        longitude: longitude.value,
      });
      toast.add({
        title:
          type === "absenMasuk"
            ? TEXT.absenMasukBerhasil
            : TEXT.absenKeluarBerhasil,
        description: response.message,
        color: "success",
      });
      handleCloseModalAbsenConfirm();
    } catch (error) {
      if (error?.status === 403) {
        logout();
        return;
      }
      toast.add({
        title: TEXT.peringatan,
        description: error.message || TEXT.terjadiKesalahan,
        color: "error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isModalAbsenConfirm,
    isModalAbsenConfirmType,
    handleAbsen,
    handleCloseModalAbsenConfirm,
    handleConfirmAbsen,
  };
};
