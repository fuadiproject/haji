<script setup>
import { TEXT } from "@/constants/text";

const suratApiService = useServiceSuratapi();
const toast = useToast();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  suratId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "update:isOpen", "refresh"]);

const isLoadingReject = ref(false);

const { data: suratData } = await useAsyncData(
  computed(() => `surat-${props.type}-${props.suratId}`),
  async () => {
    const response = await suratApiService.getSuratKeluarById({
      id: props.suratId,
    });
    return response;
  },
  {
    watch: [props.suratId],
    server: false,
    lazy: true,
    immediate: !!props.suratId,
  },
);

const idSign = computed(() => {
  if (suratData.value?.data?.urutan_tte) {
    const urutanTte = suratData.value?.data?.urutan_tte - 1;
    return suratData.value?.data?.tteLogs[urutanTte]?.id;
  }
  return null;
});

const handleReject = async () => {
  try {
    isLoadingReject.value = true;
    await suratApiService.updateTTEReject({
      id: idSign.value,
    });
    toast.add({
      title: "Success",
      description: "Berhasil menolak TTE",
      color: "success",
    });
    emit("refresh");
    handleClose();
  } catch (error) {
    console.error("Error rejecting:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal menolak TTE",
      color: "error",
    });
  } finally {
    isLoadingReject.value = false;
  }
};

const handleClose = () => {
  emit("close");
  emit("update:isOpen", false);
};
</script>

<template>
  <ModalConfirmComponent
    :is-open="isOpen"
    :title="`${TEXT.rejectTTE}: ${suratData?.value?.data?.nomor_surat}`"
    :message="TEXT.rejectTTEMessage"
    :buttons="[
      { variant: 'error', text: TEXT.reject, loading: isLoadingReject },
      { variant: 'secondary', text: TEXT.batal },
    ]"
    @close="handleClose"
    @confirm="handleReject"
  />
</template>
