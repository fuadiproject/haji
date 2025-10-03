<script setup>
import { ref, computed, watch } from "vue";
import { TEXT } from "@/constants/text";
import ModalComponent from "@/components/global/ModalComponent.vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";

const props = defineProps({
  suratId: {
    type: String,
    required: true,
  },
  suratType: {
    type: String,
    required: true,
    validator: (value) => ["suratMasuk", "suratKeluar"].includes(value),
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "update:isOpen", "submit"]);

const toast = useToast();
const suratApiService = useServiceSuratapi();

// Form data
const formData = reactive({
  sifat_id: undefined,
  urgensi_id: undefined,
  catatan: [
    {
      catatan: undefined,
      petunjuk_id: undefined,
      targets: [{ nik_penerima: undefined }],
    },
  ],
});

// Loading states
const loading = ref({
  sifat: false,
  urgensi: false,
  petunjuk: false,
  nik: false,
  submit: false,
});

// Mock data untuk dropdowns
const sifatOptions = ref([]);
const urgensiOptions = ref([]);
const petunjukOptions = ref([]);
const nikOptions = ref([]);

// Search terms untuk API calls
const searchTerms = ref({
  sifat: "",
  urgensi: "",
  petunjuk: "",
  nik: "",
});

// Computed untuk buttons
const buttons = computed(() => [
  { variant: "secondary", text: "Batal" },
  {
    variant: "primary",
    text: "Simpan",
    disabled: loading.value.submit,
    loading: loading.value.submit,
  },
]);

// API functions
const fetchSifat = async (search = "") => {
  try {
    loading.value.sifat = true;
    const response = await suratApiService.getAllSifat();

    const data = response?.data || [];
    const filteredData = data
      .map((item) => ({
        id: item.id,
        label: item.sifat,
      }))
      .filter(
        (item) =>
          search === "" ||
          item.label.toLowerCase().includes(search.toLowerCase()),
      );

    sifatOptions.value = filteredData;
  } catch (error) {
    console.error("Error fetching sifat:", error);
    toast.add({
      title: "Error",
      description: "Gagal memuat data sifat",
      color: "error",
    });
  } finally {
    loading.value.sifat = false;
  }
};

const fetchUrgensi = async (search = "") => {
  try {
    loading.value.urgensi = true;
    const response = await suratApiService.getAllUrgensi();

    const data = response?.data || [];
    const filteredData = data
      .map((item) => ({
        id: item.id,
        label: item.urgensi,
      }))
      .filter(
        (item) =>
          search === "" ||
          item.label.toLowerCase().includes(search.toLowerCase()),
      );

    urgensiOptions.value = filteredData;
  } catch (error) {
    console.error("Error fetching urgensi:", error);
    toast.add({
      title: "Error",
      description: "Gagal memuat data urgensi",
      color: "error",
    });
  } finally {
    loading.value.urgensi = false;
  }
};

const fetchPetunjuk = async (search = "") => {
  try {
    loading.value.petunjuk = true;
    const response = await suratApiService.getAllPetunjuk();

    const data = response?.data || [];
    const filteredData = data
      .map((item) => ({
        id: item.id,
        label: item.petunjuk,
      }))
      .filter(
        (item) =>
          search === "" ||
          item.label.toLowerCase().includes(search.toLowerCase()),
      );

    petunjukOptions.value = filteredData;
  } catch (error) {
    console.error("Error fetching petunjuk:", error);
    toast.add({
      title: "Error",
      description: "Gagal memuat data petunjuk",
      color: "error",
    });
  } finally {
    loading.value.petunjuk = false;
  }
};

const fetchNik = async (search = "") => {
  // NIK masih menggunakan mock data karena belum ada API khusus untuk NIK
  loading.value.nik = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockData = [
    { id: "1234567890", label: "1234567890" },
    { id: "0987654321", label: "0987654321" },
    { id: "1122334455", label: "1122334455" },
    { id: "5566778899", label: "5566778899" },
  ].filter(
    (item) =>
      search === "" || item.label.toLowerCase().includes(search.toLowerCase()),
  );

  nikOptions.value = mockData;
  loading.value.nik = false;
};

// Add new catatan
const addCatatan = () => {
  formData.catatan.push({
    catatan: undefined,
    petunjuk_id: undefined,
    targets: [{ nik_penerima: undefined }],
  });
};

// Remove catatan
const removeCatatan = (index) => {
  if (formData.catatan.length > 1) {
    formData.catatan.splice(index, 1);
  }
};

// Add target to catatan
const addTarget = (catatanIndex) => {
  formData.catatan[catatanIndex].targets.push({ nik_penerima: undefined });
};

// Remove target from catatan
const removeTarget = (catatanIndex, targetIndex) => {
  if (formData.catatan[catatanIndex].targets.length > 1) {
    formData.catatan[catatanIndex].targets.splice(targetIndex, 1);
  }
};

// Handle form submission
const handleSubmit = async () => {
  loading.value.submit = true;

  try {
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      loading.value.submit = false;
      return;
    }

    // Prepare data for API
    const submitData = {
      // TODO: hardcoded - get nik_pengirim from user
      nik_pengirim: "1234567890123456",
      sifat_id: formData.sifat_id,
      urgensi_id: formData.urgensi_id,
      catatan: formData.catatan
        .filter((catatan) => Boolean(catatan.catatan))
        .map((catatan) => ({
          catatan: catatan.catatan,
          petunjuk_id: catatan.petunjuk_id,
          targets: catatan.targets
            .filter((target) => Boolean(target.nik_penerima))
            .map((target) => ({ nik_penerima: target.nik_penerima })),
        })),
    };

    // Call appropriate API based on surat type
    const functionName =
      props.suratType === "suratMasuk"
        ? "disposisiSuratMasuk"
        : "disposisiSuratKeluar";

    await suratApiService[functionName]({
      id: props.suratId,
      data: submitData,
    });

    toast.add({
      title: "Success",
      description: "Disposisi berhasil dibuat",
      color: "success",
    });

    emit("submit", submitData);
    handleClose();
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.add({
      title: "Error",
      description: "Gagal membuat disposisi",
      color: "error",
    });
  } finally {
    loading.value.submit = false;
  }
};

// Form validation
const validateForm = () => {
  // Basic validation - bisa diperluas sesuai kebutuhan
  if (!formData.sifat_id || !formData.urgensi_id) {
    toast.add({
      title: "Error",
      description: "Mohon lengkapi sifat dan urgensi",
      color: "error",
    });
    return false;
  }

  const hasValidCatatan = formData.catatan.some(
    (catatan) =>
      Boolean(catatan.catatan) &&
      Boolean(catatan.petunjuk_id) &&
      catatan.targets.some((target) => Boolean(target.nik_penerima)),
  );

  if (!hasValidCatatan) {
    toast.add({
      title: "Error",
      description: "Mohon isi minimal satu catatan yang lengkap",
      color: "error",
    });
    return false;
  }

  return true;
};

// Handle close
const handleClose = () => {
  emit("close");
  emit("update:isOpen", false);
};

// Handle button click
const handleButtonClick = (button, index) => {
  if (index === 0) {
    // Cancel button
    handleClose();
  } else if (index === 1) {
    // Submit button
    handleSubmit();
  }
};

// Load initial data when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      // Reset form when opening
      formData.sifat_id = undefined;
      formData.urgensi_id = undefined;
      formData.catatan = [
        {
          catatan: undefined,
          petunjuk_id: undefined,
          targets: [{ nik_penerima: undefined }],
        },
      ];

      // Load master data
      fetchSifat();
      fetchUrgensi();
      fetchPetunjuk();
      fetchNik();
    }
  },
  { immediate: true },
);
</script>

<template>
  <ModalComponent
    :is-open="isOpen"
    :title="TEXT.buatDisposisi"
    size="lg"
    class="space-y-6"
    @close="handleClose"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <!-- Content area -->
    <!-- Sifat dan Urgensi -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Sifat -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Sifat <span class="text-red-500">*</span>
        </label>
        <USelectMenu
          v-model="formData.sifat_id"
          :items="sifatOptions"
          value-key="id"
          :placeholder="TEXT.pilihSifat"
          :loading="loading.sifat"
          :disabled="loading.sifat"
          class="min-h-8 w-full"
          @search="
            (term) => {
              searchTerms.sifat = term;
              fetchSifat(term);
            }
          "
        />
      </div>

      <!-- Urgensi -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Urgensi <span class="text-red-500">*</span>
        </label>
        <USelectMenu
          v-model="formData.urgensi_id"
          :items="urgensiOptions"
          value-key="id"
          :placeholder="TEXT.pilihUrgensi"
          :loading="loading.urgensi"
          :disabled="loading.urgensi"
          class="min-h-8 w-full"
          @search="
            (term) => {
              searchTerms.urgensi = term;
              fetchUrgensi(term);
            }
          "
        />
      </div>
    </div>

    <!-- Catatan Section -->
    <div class="mt-4">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-base font-medium text-gray-900">Catatan</h3>
        <ButtonComponent variant="outline" size="sm" @click="addCatatan">
          + {{ TEXT.tambahCatatan }}
        </ButtonComponent>
      </div>

      <div
        v-for="(catatan, catatanIndex) in formData.catatan"
        :key="catatanIndex"
        class="mb-4 rounded-lg border border-gray-200 p-4"
      >
        <!-- Catatan Header -->
        <div class="mb-3 flex items-center justify-between">
          <h4 class="font-medium text-gray-700">
            Catatan {{ catatanIndex + 1 }}
          </h4>
          <ButtonComponent
            v-if="formData.catatan.length > 1"
            variant="ghost"
            size="sm"
            @click="removeCatatan(catatanIndex)"
          >
            {{ TEXT.hapus }}
          </ButtonComponent>
        </div>

        <!-- Catatan Text -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            {{ TEXT.isiCatatan }}
            <span v-if="catatanIndex === 0" class="text-red-500">*</span>
          </label>
          <UTextarea
            v-model="catatan.catatan"
            :placeholder="TEXT.masukkanCatatan"
            size="lg"
            rows="3"
            class="w-full"
          />
        </div>

        <!-- Petunjuk -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            {{ TEXT.petunjuk }}
            <span v-if="catatanIndex === 0" class="text-red-500">*</span>
          </label>
          <USelectMenu
            v-model="catatan.petunjuk_id"
            :items="petunjukOptions"
            value-key="id"
            :placeholder="TEXT.pilihPetunjuk"
            :search-input="{ placeholder: TEXT.cariPetunjuk }"
            :loading="loading.petunjuk"
            :disabled="loading.petunjuk"
            class="min-h-8 w-full"
            @search="
              (term) => {
                searchTerms.petunjuk = term;
                fetchPetunjuk(term);
              }
            "
          />
        </div>

        <!-- Targets -->
        <div>
          <div class="mb-2 flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">
              {{ TEXT.penerima }}
              <span v-if="catatanIndex === 0" class="text-red-500">*</span>
            </label>
            <ButtonComponent
              variant="outline"
              size="sm"
              @click="addTarget(catatanIndex)"
            >
              + {{ TEXT.tambahPenerima }}
            </ButtonComponent>
          </div>

          <div
            v-for="(target, targetIndex) in catatan.targets"
            :key="targetIndex"
            class="mb-2 flex gap-2"
          >
            <div class="flex-1">
              <UInput
                v-model="target.nik_penerima"
                :placeholder="TEXT.masukkanNIKpenerima"
                class="w-full"
              />
              <!-- 
               <USelectMenu
                 v-model="target.nik_penerima"
                 :items="nikOptions"
                 value-key="id"
                 :placeholder="TEXT.pilihPenerima"
                 :search-input="{ placeholder: TEXT.cariPenerima }"
                 :loading="loading.nik"
                 :disabled="loading.nik"
                 class="min-h-8 w-full"
                 @search="
                   (term) => {
                     searchTerms.nik = term;
                     fetchNik(term);
                   }
                 "
               />
               -->
            </div>
            <ButtonComponent
              v-if="catatan.targets.length > 1"
              variant="ghost"
              size="sm"
              @click="removeTarget(catatanIndex, targetIndex)"
            >
              {{ TEXT.hapus }}
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer dengan buttons -->
    <template #footer>
      <div class="flex justify-between gap-3">
        <ButtonComponent
          v-for="(button, index) in buttons"
          :key="index"
          :variant="button.variant"
          :disabled="button.disabled"
          :loading="button.loading"
          class="flex-1"
          @click="handleButtonClick(button, index)"
        >
          {{ button.text }}
        </ButtonComponent>
      </div>
    </template>
  </ModalComponent>
</template>
