<script setup>
import { ref, computed, watch, onMounted } from "vue";
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

const emit = defineEmits(["close", "download", "disposisi", "delete", "edit"]);

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

// PDF Viewer state
const pdfViewer = ref(null);
const showPdfFallback = ref(false);
const pdfLoadTimeout = ref(null);
const isMobile = ref(false);

// Deteksi mobile device
const checkMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768;
};

const handleDisposisi = () => {
  emit("disposisi", {
    suratId: suratData.value.id,
    nomorSurat: suratData.value.nomor_surat,
  });
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

// PDF handling methods
const handlePdfError = () => {
  console.log("PDF failed to load, showing fallback");
  showPdfFallback.value = true;
  if (pdfLoadTimeout.value) {
    clearTimeout(pdfLoadTimeout.value);
  }
};

const handlePdfLoad = () => {
  console.log("PDF loaded successfully");
  showPdfFallback.value = false;
  if (pdfLoadTimeout.value) {
    clearTimeout(pdfLoadTimeout.value);
  }
};

// Watch untuk perubahan ukuran layar
watch(
  () => window.innerWidth,
  () => {
    checkMobile();
    if (isMobile.value) {
      showPdfFallback.value = true;
    }
  },
);

// Inisialisasi deteksi mobile saat component mounted
onMounted(() => {
  checkMobile();
});
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
            <label class="text-body-4 mb-1 block text-sm font-medium">{{
              TEXT.nomorSurat
            }}</label>
            <p
              class="text-body-11 dark:bg-container-main rounded bg-gray-50 p-2 text-sm"
            >
              {{ suratData?.data?.nomor_surat }}
            </p>
          </div>

          <!-- Tanggal Surat -->
          <div>
            <label class="text-body-4 mb-1 block text-sm font-medium">{{
              TEXT.tanggalSurat
            }}</label>
            <p
              class="text-body-11 dark:bg-container-main rounded bg-gray-50 p-2 text-sm"
            >
              {{ formatDate(suratData?.data?.created_at) }}
            </p>
          </div>

          <!-- Created By -->
          <div>
            <label class="text-body-4 mb-1 block text-sm font-medium">{{
              TEXT.dibuatOleh
            }}</label>
            <p
              class="text-body-11 dark:bg-container-main rounded bg-gray-50 p-2 text-sm"
            >
              {{ suratData?.data?.created_by }}
            </p>
          </div>
        </div>
      </div>

      <!-- Disposisi Information Section -->
      <div v-if="suratData?.data?.disposisi?.length > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-body-11 text-lg font-semibold">
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
            class="bg-container-main dark:border-border-main rounded-lg border border-gray-200 p-4"
          >
            <div class="mb-3 flex items-center justify-between">
              <h4 class="text-body-11 text-sm font-medium">
                {{ TEXT.disposisi }} #{{ disposisiIndex + 1 }}
              </h4>
              <span class="text-xs text-gray-500">ID: {{ disposisi.id }}</span>
            </div>

            <div class="space-y-3">
              <!-- Sifat dan Urgensi -->
              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div class="dark:bg-container-main rounded bg-gray-50 p-2">
                  <span class="text-body-5 text-xs font-medium">Sifat:</span>
                  <p class="text-body-11 text-sm">
                    {{ disposisi.sifat?.sifat || "-" }}
                  </p>
                </div>
                <div class="dark:bg-container-main rounded bg-gray-50 p-2">
                  <span class="text-body-5 text-xs font-medium">Urgensi:</span>
                  <p class="text-body-11 text-sm">
                    {{ disposisi.urgensi?.urgensi || "-" }}
                  </p>
                </div>
              </div>

              <!-- Pengirim -->
              <div class="dark:bg-container-main rounded bg-gray-50 p-2">
                <span class="text-body-5 text-xs font-medium">Pengirim:</span>
                <p class="text-body-11 text-sm">
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
                <span class="text-body-5 text-xs font-medium">Catatan:</span>
                <div class="space-y-2">
                  <div
                    v-for="(catatan, catatanIndex) in disposisi.catatan"
                    :key="catatanIndex"
                    class="dark:bg-container-main rounded bg-gray-50 p-3"
                  >
                    <p class="text-body-11 mb-2 text-sm">
                      "{{ catatan.catatan }}"
                    </p>

                    <div v-if="catatan.petunjuk?.petunjuk" class="mt-2">
                      <span class="text-body-5 text-xs font-medium"
                        >{{ TEXT.petunjuk }}:</span
                      >
                      <span class="text-body-4 ml-1 text-xs">{{
                        catatan.petunjuk?.petunjuk
                      }}</span>
                    </div>

                    <div v-if="catatan.targets && catatan.targets.length > 0">
                      <span class="text-body-5 text-xs font-medium"
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

      <ClientOnly>
        <div class="md:col-span-2">
          <!-- PDF Viewer dengan fallback yang proper -->
          <div class="relative">
            <!-- Desktop PDF Viewer -->
            <iframe
              v-if="!isMobile"
              ref="pdfViewer"
              :src="
                '/files/pdf/sample.pdf#navpanes=0' ||
                suratData?.data?.file?.filepath
              "
              width="100%"
              height="700px"
              class="rounded-lg border border-gray-300"
              @error="handlePdfError"
              @load="handlePdfLoad"
            />

            <!-- Mobile/Tablet Fallback - Langsung tampilkan fallback -->
            <div
              v-if="
                suratData?.data?.file?.filepath && (isMobile || showPdfFallback)
              "
              class="dark:bg-container-main flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-8"
              :style="{ minHeight: isMobile ? '400px' : '700px' }"
            >
              <UIcon name="ph:file-pdf" class="mb-4 h-16 w-16 text-red-500" />
              <h3 class="text-body-11 mb-2 text-center text-lg font-semibold">
                {{
                  isMobile
                    ? "Preview PDF tidak tersedia di mobile"
                    : "Tidak dapat memuat PDF"
                }}
              </h3>
              <p class="text-body-5 mb-4 text-center text-sm">
                {{
                  isMobile
                    ? "Untuk melihat dokumen PDF, silakan download dan buka dengan aplikasi PDF reader."
                    : "Browser Anda tidak mendukung preview PDF atau file tidak tersedia."
                }}
              </p>
              <div class="flex flex-col gap-2 sm:flex-row">
                <UButton
                  variant="outline"
                  class="w-full sm:w-auto"
                  @click="
                    downloadPdf(
                      suratData?.data?.file?.filepath,
                      suratData?.data?.nomor_surat,
                    )
                  "
                >
                  <UIcon name="ph:download" class="mr-2 h-4 w-4" />
                  Download PDF
                </UButton>
              </div>

              <!-- Informasi tambahan untuk mobile -->
              <!-- <div v-if="isMobile" class="mt-4 rounded-lg bg-blue-50 p-4">
                <div class="flex items-start">
                  <UIcon
                    name="ph:info"
                    class="mt-0.5 mr-2 h-5 w-5 text-blue-500"
                  />
                  <div class="text-sm text-blue-700">
                    <p class="mb-1 font-medium">Tips untuk mobile:</p>
                    <ul class="list-inside list-disc space-y-1 text-xs">
                      <li>Download PDF dan buka dengan aplikasi PDF reader</li>
                      <li>Gunakan browser desktop untuk preview PDF</li>
                      <li>Pastikan koneksi internet stabil</li>
                    </ul>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </ClientOnly>

      <!-- Action Buttons -->
      <div
        class="bg-container-main dark:border-border-main fixed right-0 bottom-0 left-0 flex w-full justify-between gap-2 border-t border-gray-200 p-4 pt-4 sm:flex-row"
      >
        <div class="flex items-center gap-2">
          <UButton
            variant="outline"
            size="lg"
            class="mx-auto w-full justify-center"
            @click="emit('edit')"
          >
            <UIcon name="ph:pencil" class="h-4 w-4" />
            {{ TEXT.edit }}
          </UButton>
          <UButton
            variant="outline"
            color="error"
            size="lg"
            class="mx-auto w-full justify-center"
            @click="emit('delete')"
          >
            <UIcon name="ph:trash" class="h-4 w-4" />
            {{ TEXT.hapus }}
          </UButton>
        </div>

        <ButtonComponent
          v-if="type === 'suratMasuk'"
          variant="primary"
          class="max-w-fit flex-1 sm:flex-none"
          @click="handleDisposisi"
        >
          {{ TEXT.disposisi }}
        </ButtonComponent>
      </div>
    </div>
  </ModalBottomComponent>
</template>
