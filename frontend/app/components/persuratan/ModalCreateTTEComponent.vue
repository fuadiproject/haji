<script setup>
import { TEXT } from "@/constants/text";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  suratId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close", "update:isOpen", "refresh"]);

const toast = useToast();
const suratApiService = useServiceSuratapi();

const jenisTTEOptions = ref([
  {
    label: TEXT.paraf,
    value: "PARAF",
  },
  {
    label: TEXT.tte,
    value: "TTE",
  },
]);

const isSubmitLoading = ref(false);

// Array untuk menyimpan multiple penerima
const penerimaList = ref([
  {
    nik_penerima: undefined,
    jenis: "PARAF",
  },
]);

// Validasi form
const isValidForm = computed(() => {
  return (
    penerimaList.value.every(
      (penerima) => penerima.nik_penerima && penerima.jenis,
    ) && penerimaList.value.length > 0
  );
});
// Tambah penerima baru
const addPenerima = () => {
  penerimaList.value.push({
    nik_penerima: undefined,
    jenis: "PARAF",
  });
};

// Hapus penerima
const removePenerima = (index) => {
  if (penerimaList.value.length > 1) {
    penerimaList.value.splice(index, 1);
  }
};

async function onSubmit() {
  // Validasi minimal satu penerima
  if (penerimaList.value.length === 0) {
    toast.add({
      title: "Error",
      description: TEXT.minimalSatuPenerima,
      color: "error",
    });
    return;
  }

  // Validasi semua penerima harus lengkap
  const incompletePenerima = penerimaList.value.find(
    (penerima) => !penerima.nik_penerima || !penerima.jenis,
  );

  if (incompletePenerima) {
    toast.add({
      title: "Error",
      description: "Mohon lengkapi semua data penerima",
      color: "error",
    });
    return;
  }

  isSubmitLoading.value = true;

  try {
    const data = {
      surat_keluar_id: props.suratId,
      penerima: penerimaList.value,
    };

    await suratApiService.createTTE({ data });

    toast.add({
      title: TEXT.sukses,
      description: "TTE berhasil dibuat",
      color: "success",
    });

    // Reset form
    resetForm();

    // Close modal and refresh data
    emit("close");
    emit("update:isOpen", false);
    emit("refresh");
  } catch (error) {
    console.error("Error creating TTE:", error);
    toast.add({
      title: "Error",
      description:
        error?.data?.error || "Gagal membuat TTE. Silakan coba lagi.",
      color: "error",
    });
  } finally {
    isSubmitLoading.value = false;
  }
}

// Reset form
const resetForm = () => {
  penerimaList.value = [
    {
      nik_penerima: undefined,
      jenis: "PARAF",
    },
  ];
};

// Reset form when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  },
  { immediate: true },
);
</script>

<template>
  <ModalComponent
    :is-open="isOpen"
    :title="TEXT.createTTE"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <!-- List Penerima -->
      <div
        v-for="(penerima, index) in penerimaList"
        :key="index"
        class="space-y-3 rounded-lg border border-gray-200 p-4"
      >
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-gray-700">
            Penerima {{ index + 1 }}
          </h4>
          <UButton
            v-if="penerimaList.length > 1"
            color="red"
            variant="ghost"
            size="sm"
            icon="i-lucide-trash-2"
            @click="removePenerima(index)"
          >
            {{ TEXT.hapusPenerima }}
          </UButton>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormSelectUserListComponent
            :model-value="penerima.nik_penerima"
            :label="TEXT.nikPenerima"
            @update:model-value="
              (payload) => (penerima.nik_penerima = payload.value)
            "
          />

          <UFormField :label="TEXT.jenisTTE" required>
            <USelect
              v-model="penerima.jenis"
              size="lg"
              :items="jenisTTEOptions"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <!-- Tombol Tambah Penerima -->
      <div class="flex justify-center">
        <UButton
          color="primary"
          variant="outline"
          size="lg"
          icon="i-lucide-plus"
          @click="addPenerima"
        >
          {{ TEXT.tambahPenerima }}
        </UButton>
      </div>

      <!-- Tombol Submit -->
      <div class="flex w-full justify-end">
        <ButtonComponent
          :loading="isSubmitLoading"
          type="button"
          variant="primary"
          :disabled="!isValidForm"
          @click="onSubmit"
        >
          {{ TEXT.buat }}
        </ButtonComponent>
      </div>
    </div>
  </ModalComponent>
</template>
