<script setup>
import ModalComponent from "@/components/global/ModalComponent.vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "update:isOpen", "success"]);

const toast = useToast();
const suratApiService = useServiceSuratapi();

const state = reactive({
  template_id: undefined,
  keterangan: undefined,
});

const isLoadingTemplates = ref(false);
const templatesList = ref([]);
const isSubmitting = ref(false);

const fetchTemplates = async (searchTerm = "") => {
  isLoadingTemplates.value = true;
  try {
    const response = await suratApiService.getAllPenomoranTemplates({
      search: searchTerm,
      limit: 50,
    });
    if (response.success) {
      templatesList.value = response.data.map((template) => ({
        id: template.id,
        label: `${template.kode} (${template.nama})`,
        kode: template.kode,
        nama: template.nama,
      }));
    }
  } catch (error) {
    console.error("Error fetching templates:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal mengambil daftar template",
      color: "error",
    });
  } finally {
    isLoadingTemplates.value = false;
  }
};

let searchTimeout = null;

const handleSearch = (searchTerm) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    fetchTemplates(searchTerm);
  }, 500);
};

const handleSubmit = async () => {
  if (!state.template_id) {
    toast.add({
      title: "Error",
      description: "Template harus dipilih",
      color: "error",
    });
    return;
  }

  try {
    isSubmitting.value = true;
    const response = await suratApiService.createBookPenomoran({
      data: {
        template_id: state.template_id,
        keterangan: state.keterangan || "",
      },
    });

    if (response.success) {
      toast.add({
        title: "Success",
        description: "Nomor surat berhasil diajukan",
        color: "success",
      });
      emit("success", response.data);
      handleClose();
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal mengajukan nomor surat",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleClose = () => {
  state.template_id = undefined;
  state.keterangan = undefined;
  emit("close");
  emit("update:isOpen", false);
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fetchTemplates();
    }
  },
  { immediate: true },
);

onMounted(() => {
  fetchTemplates();
});

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<template>
  <ModalComponent
    :is-open="isOpen"
    title="Ajukan Nomor Surat"
    @close="handleClose"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <div class="space-y-4">
      <UFormField label="Template Penomoran" required>
        <USelectMenu
          v-model="state.template_id"
          :items="templatesList"
          value-key="id"
          :search-input="{
            placeholder: 'Cari template...',
            icon: 'i-lucide-search',
          }"
          placeholder="Pilih template penomoran"
          :loading="isLoadingTemplates"
          :disabled="isLoadingTemplates"
          class="w-full"
          @update:search-term="handleSearch"
        />
      </UFormField>

      <UFormField label="Keterangan">
        <UTextarea
          v-model="state.keterangan"
          placeholder="Masukkan keterangan (opsional)"
          rows="3"
          class="w-full"
        />
      </UFormField>

      <div class="flex w-full justify-end gap-3">
        <ButtonComponent variant="secondary" @click="handleClose">
          Batal
        </ButtonComponent>
        <ButtonComponent
          variant="primary"
          :loading="isSubmitting"
          :disabled="!state.template_id || isSubmitting"
          @click="handleSubmit"
        >
          Simpan
        </ButtonComponent>
      </div>
    </div>
  </ModalComponent>
</template>
