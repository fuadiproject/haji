<script setup>
import { ref, computed, watch } from "vue";
import { TEXT } from "@/constants/text";
import ModalBottomComponent from "@/components/global/ModalBottomComponent.vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";

const props = defineProps({
  suratId: {
    type: String,
    default: "",
  },
  nomorSurat: {
    type: String,
    default: "",
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "download", "disposisi"]);

// Dummy data - bisa diganti dengan data dari API
const suratData = ref({
  id: props.suratId || "cmfkx0y4c0003pznc428mljgq",
  file_id: null,
  nomor_surat: props.nomorSurat || "SM/DEBUG/1757928140183",
  created_by: "1234567890123456",
  updated_by: "1234567890123456",
  created_at: "2025-09-15T09:22:20.220Z",
  updated_at: "2025-09-15T09:22:20.220Z",
  version: 1,
  file: null,
  disposisi: [
    {
      id: "cmfkx0y9r0005pznc92rnuuds",
      nik_pengirim: "1234567890123456",
      sifat: {
        id: "cmfkvt7fm000vpznk4otxfoyh",
        sifat: "Terbatas",
      },
      urgensi: {
        id: "cmfkvt7iy0019pznkjhsq7ipv",
        urgensi: "Tinggi",
      },
      catatan: [
        {
          catatan: "Harap ditindaklanjuti segera",
          petunjuk_id: "PET-001",
          targets: [
            {
              nik_penerima: "1234567890123456",
            },
            {
              nik_penerima: "12345678901234562",
            },
          ],
        },
      ],
    },
    {
      id: "cmfkx0y9r0006pznc92rnuuds",
      nik_pengirim: "12345678901234562",
      sifat: {
        id: "cmfkvt7fm000vpznk4otxfoyh",
        sifat: "Biasa",
      },
      urgensi: {
        id: "cmfkvt7iy0019pznkjhsq7ipv",
        urgensi: "Sedang",
      },
      catatan: [
        {
          catatan: "Mohon koordinasi dengan tim terkait",
          petunjuk_id: "PET-002",
          targets: [
            {
              nik_penerima: "12345678901234563",
            },
          ],
        },
      ],
    },
  ],
  _count: {
    disposisi: 2,
  },
});

const fileUrl = computed(() => {
  return suratData.value.file?.url || "/files/pdf/sample.pdf";
});

// Methods
// const handleDownload = () => {
//   // Simulate download
//   const link = document.createElement("a");
//   link.href = fileUrl.value;
//   link.download = `surat-${suratData.value.nomor_surat}.${fileExtension.value}`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   emit("download", {
//     suratId: suratData.value.id,
//     fileUrl: fileUrl.value,
//   });
// };

const handleDisposisi = () => {
  emit("disposisi", {
    suratId: suratData.value.id,
    nomorSurat: suratData.value.nomor_surat,
  });
};

const handlePreview = () => {
  // Buka file di tab baru
  window.open(fileUrl.value, "_blank");
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Watch for prop changes
watch(
  () => props.suratId,
  (newId) => {
    if (newId) {
      suratData.value.id = newId;
    }
  },
);

watch(
  () => props.nomorSurat,
  (newNomor) => {
    if (newNomor) {
      suratData.value.nomor_surat = newNomor;
    }
  },
);
</script>

<template>
  <ModalBottomComponent
    :is-open="isOpen"
    :is-full-height="true"
    :title="`${TEXT.detailSurat} - ${nomorSurat}`"
    @close="emit('close')"
  >
    <div class="relative space-y-6 pb-12">
      <!-- Document Information Section -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Nomor Surat -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">{{
              TEXT.nomorSurat
            }}</label>
            <p class="rounded bg-gray-50 p-2 text-sm text-gray-900">
              {{ suratData.nomor_surat }}
            </p>
          </div>

          <!-- Tanggal Surat -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">{{
              TEXT.tanggalSurat
            }}</label>
            <p class="rounded bg-gray-50 p-2 text-sm text-gray-900">
              {{ formatDate(suratData.created_at) }}
            </p>
          </div>

          <!-- Created By -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">{{
              TEXT.dibuatOleh
            }}</label>
            <p class="rounded bg-gray-50 p-2 text-sm text-gray-900">
              {{ suratData.created_by }}
            </p>
          </div>

          <!-- Version -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">{{
              TEXT.versi
            }}</label>
            <p class="rounded bg-gray-50 p-2 text-sm text-gray-900">
              {{ suratData.version }}
            </p>
          </div>

          <!-- File Status -->
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-gray-700">{{
              TEXT.statusFile
            }}</label>
            <p class="rounded bg-gray-50 p-2 text-sm text-gray-900">
              {{ suratData.file ? "Tersedia" : "Tidak Tersedia" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Disposisi Information Section -->
      <div v-if="suratData._count?.disposisi > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ TEXT.informasiDisposisi }}
          </h3>
          <span
            class="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
          >
            {{ suratData._count?.disposisi || 0 }} {{ TEXT.disposisi }}
          </span>
        </div>

        <div class="space-y-4">
          <!-- Semua Disposisi -->
          <div
            v-for="(disposisi, disposisiIndex) in suratData.disposisi"
            :key="disposisi.id"
            class="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div class="mb-3 flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-900">
                {{ TEXT.disposisi }} #{{ disposisiIndex + 1 }}
              </h4>
              <span class="text-xs text-gray-500">ID: {{ disposisi.id }}</span>
            </div>

            <div class="space-y-3">
              <!-- Sifat dan Urgensi -->
              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div class="rounded bg-gray-50 p-2">
                  <span class="text-xs font-medium text-gray-600">Sifat:</span>
                  <p class="text-sm text-gray-900">
                    {{ disposisi.sifat?.sifat || "-" }}
                  </p>
                </div>
                <div class="rounded bg-gray-50 p-2">
                  <span class="text-xs font-medium text-gray-600"
                    >Urgensi:</span
                  >
                  <p class="text-sm text-gray-900">
                    {{ disposisi.urgensi?.urgensi || "-" }}
                  </p>
                </div>
              </div>

              <!-- NIK Pengirim -->
              <div class="rounded bg-gray-50 p-2">
                <span class="text-xs font-medium text-gray-600"
                  >NIK Pengirim:</span
                >
                <p class="text-sm text-gray-900">
                  {{ disposisi.nik_pengirim || "-" }}
                </p>
              </div>

              <!-- Catatan Disposisi -->
              <div
                v-if="disposisi.catatan && disposisi.catatan.length > 0"
                class="space-y-2"
              >
                <span class="text-xs font-medium text-gray-600">Catatan:</span>
                <div class="space-y-2">
                  <div
                    v-for="(catatan, catatanIndex) in disposisi.catatan"
                    :key="catatanIndex"
                    class="rounded bg-gray-50 p-3"
                  >
                    <p class="mb-2 text-sm text-gray-900">
                      {{ catatan.catatan }}
                    </p>
                    <div v-if="catatan.targets && catatan.targets.length > 0">
                      <span class="text-xs font-medium text-gray-600"
                        >Target:</span
                      >
                      <div class="mt-1 flex flex-wrap gap-1">
                        <span
                          v-for="(target, targetIndex) in catatan.targets"
                          :key="targetIndex"
                          class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                        >
                          {{ target.nik_penerima }}
                        </span>
                      </div>
                    </div>
                    <div v-if="catatan.petunjuk_id" class="mt-2">
                      <span class="text-xs font-medium text-gray-600"
                        >{{ TEXT.petunjukID }}:</span
                      >
                      <span class="ml-1 text-xs text-gray-700">{{
                        catatan.petunjuk_id
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="fixed right-0 bottom-0 left-0 flex w-full justify-end gap-2 border-t border-gray-200 bg-white p-4 pt-4 sm:flex-row"
      >
        <ButtonComponent
          variant="outline"
          class="min-w-fit flex-1 sm:flex-none"
          @click="handlePreview"
        >
          <UIcon name="ph:eye-bold" class="h-4 w-4" />
          {{ TEXT.lihatPreview }}
        </ButtonComponent>

        <ButtonComponent
          variant="primary"
          class="min-w-fit flex-1 sm:flex-none"
          @click="handleDisposisi"
        >
          {{ TEXT.disposisi }}
        </ButtonComponent>
      </div>
    </div>
  </ModalBottomComponent>
</template>
