<script setup>
import { ref, computed } from "vue";
import { TEXT } from "@/constants/text";
import ModalBottomComponent from "@/components/global/ModalBottomComponent.vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";

const props = defineProps({
  type: {
    type: String,
    default: "suratMasuk",
  },
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

const emit = defineEmits(["close", "download", "disposisi", "delete"]);

const suratApiService = useServiceSuratapi();

const {
  data: suratData,
  status: statusSurat,
  error: errorSurat,
  refresh: refreshSurat,
} = await useAsyncData(
  computed(() => `surat-${props.type}-${props.suratId}`),
  async () => {
    const functionName =
      props.type === "suratMasuk" ? "getSuratMasukById" : "getSuratKeluarById";
    const response = await suratApiService[functionName]({
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
const isLoading = computed(() => statusSurat.value === "pending");

const isDeleteModalOpen = ref(false);

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
  // window.open(fileUrl.value, "_blank");
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
// watch(
//   () => props.suratId,
//   (newId) => {
//     if (newId) {
//       suratData.value.id = newId;
//     }
//   },
// );

// watch(
//   () => props.nomorSurat,
//   (newNomor) => {
//     if (newNomor) {
//       suratData.value.nomor_surat = newNomor;
//     }
//   },
// );

const handleDelete = () => {
  emit("close");
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <ModalBottomComponent
    :is-open="isOpen"
    :is-full-height="true"
    :title="`${TEXT.detailSurat}`"
    @close="emit('close')"
  >
    <LoadingStateComponent v-if="isLoading" />

    <ErrorStateComponent
      v-else-if="errorSurat"
      :error="errorSurat"
      @refresh="refreshSurat()"
    />

    <div v-else class="relative space-y-6 pb-12">
      <!-- Document Information Section -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Nomor Surat -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">{{
              TEXT.nomorSurat
            }}</label>
            <p class="rounded bg-gray-50 p-2 text-sm text-gray-900">
              {{ suratData?.data?.nomor_surat }}
            </p>
          </div>

          <!-- Tanggal Surat -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">{{
              TEXT.tanggalSurat
            }}</label>
            <p class="rounded bg-gray-50 p-2 text-sm text-gray-900">
              {{ formatDate(suratData?.data?.created_at) }}
            </p>
          </div>

          <!-- Created By -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">{{
              TEXT.dibuatOleh
            }}</label>
            <p class="rounded bg-gray-50 p-2 text-sm text-gray-900">
              {{ suratData?.data?.created_by }}
            </p>
          </div>
        </div>
      </div>

      <!-- Disposisi Information Section -->
      <div v-if="suratData?.data?.disposisi?.length > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ TEXT.informasiDisposisi }}
          </h3>
          <span
            class="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
          >
            {{ suratData?.data?.disposisi?.length || 0 }} {{ TEXT.disposisi }}
          </span>
        </div>

        <div class="space-y-4">
          <!-- Semua Disposisi -->
          <div
            v-for="(disposisi, disposisiIndex) in suratData?.data?.disposisi"
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

              <!-- Pengirim -->
              <div class="rounded bg-gray-50 p-2">
                <span class="text-xs font-medium text-gray-600">Pengirim:</span>
                <p class="text-sm text-gray-900">
                  {{
                    disposisi.pengirim?.nik
                      ? `${disposisi.pengirim?.nama} (${disposisi.pengirim?.nik})`
                      : "-"
                  }}
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
                      "{{ catatan.catatan }}"
                    </p>

                    <div v-if="catatan.petunjuk?.petunjuk" class="mt-2">
                      <span class="text-xs font-medium text-gray-600"
                        >{{ TEXT.petunjuk }}:</span
                      >
                      <span class="ml-1 text-xs text-gray-700">{{
                        catatan.petunjuk?.petunjuk
                      }}</span>
                    </div>

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
                          {{
                            target?.penerima?.nik
                              ? `${target.penerima?.nama} (${target.penerima?.nik})`
                              : "-"
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          variant="outline"
          size="lg"
          class="mx-auto w-full justify-center"
        >
          <UIcon name="ph:pencil" class="h-4 w-4" />
          {{ TEXT.editSurat }}
        </UButton>
        <UButton
          variant="outline"
          color="error"
          size="lg"
          class="mx-auto w-full justify-center"
          @click="isDeleteModalOpen = true"
        >
          <UIcon name="ph:trash" class="h-4 w-4" />
          {{ TEXT.hapusSurat }}
        </UButton>
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

  <ModalConfirmComponent
    :is-open="isDeleteModalOpen"
    :title="TEXT.hapusSurat"
    :message="TEXT.hapusSuratMessage"
    :buttons="[
      { variant: 'primary', text: TEXT.hapus },
      { variant: 'secondary', text: TEXT.batal },
    ]"
    @close="isDeleteModalOpen = false"
    @confirm="handleDelete"
  />
</template>
