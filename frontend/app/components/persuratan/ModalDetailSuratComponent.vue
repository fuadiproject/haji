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
// const pdfViewer = ref(null);
const showPdfFallback = ref(false);
// const pdfLoadTimeout = ref(null);
const isMobile = ref(false);
const isModalViewFileOpen = ref(false);
// Deteksi mobile device
const checkMobile = () => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768;
};

const handleDisposisi = () => {
  emit("disposisi", {
    suratId: suratData.value?.data?.id,
    nomorSurat: suratData.value?.data?.nomor_surat,
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
      <div v-if="type === 'suratMasuk'" class="flex justify-end">
        <ButtonComponent variant="primary" @click="handleDisposisi">
          <UIcon name="ph:hand-pointing" class="h-4 w-4" />
          {{ TEXT.disposisi }}
        </ButtonComponent>
      </div>
      <!-- Document Information Section -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Nama Surat -->
          <div>
            <label class="text-body-4 mb-1 block text-sm font-medium">{{
              TEXT.namaSurat
            }}</label>
            <p
              class="text-body-11 dark:bg-container-main rounded bg-gray-50 p-2 text-sm"
            >
              {{ suratData?.data?.nama }}
            </p>
          </div>

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

      <!-- TTE Logs Information Section (for suratKeluar) -->
      <div
        v-if="type === 'suratKeluar' && suratData?.data?.tteLogs?.length > 0"
        class="space-y-4"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-body-11 text-lg font-semibold">Informasi TTE</h3>
          <span
            class="bg-primary-4 text-primary-main rounded px-2 py-1 text-xs font-medium"
          >
            {{ suratData?.data?.tteLogs?.length || 0 }} TTE Log
          </span>
        </div>

        <div class="space-y-4">
          <!-- Semua TTE Logs -->
          <div
            v-for="(tteLog, tteIndex) in suratData?.data?.tteLogs"
            :key="tteLog.id"
            class="bg-container-main border-border-main rounded-lg border p-4"
          >
            <div class="mb-3 flex items-center justify-between">
              <h4 class="text-body-11 text-sm font-medium">
                TTE Log #{{ tteIndex + 1 }}
              </h4>
              <div class="flex items-center gap-2">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800':
                      tteLog.status === 'REQUESTED',
                    'bg-red-100 text-red-800': tteLog.status === 'REJECTED',
                    'bg-green-100 text-green-800': tteLog.status === 'SIGNED',
                  }"
                  class="rounded px-2 py-1 text-xs font-medium"
                >
                  {{ tteLog.status }}
                </span>
              </div>
            </div>

            <div class="space-y-3">
              <!-- Jenis TTE -->
              <div class="bg-body-9 rounded p-2 dark:bg-transparent">
                <span class="text-body-5 text-xs font-medium">Jenis:</span>
                <p class="text-body-11 text-sm">{{ tteLog.jenis }}</p>
              </div>

              <!-- Pengirim -->
              <div class="bg-body-9 rounded p-2 dark:bg-transparent">
                <span class="text-body-5 text-xs font-medium">Pengirim:</span>
                <p class="text-body-11 text-sm">
                  {{ tteLog.pengirim?.nama || "-" }}
                  <span v-if="tteLog.pengirim?.nik" class="text-body-5">
                    ({{ tteLog.pengirim.nik }})
                  </span>
                </p>
                <p v-if="tteLog.pengirim?.nip" class="text-body-5 text-xs">
                  NIP: {{ tteLog.pengirim.nip }}
                </p>
              </div>

              <!-- Penerima -->
              <div class="bg-body-9 rounded p-2 dark:bg-transparent">
                <span class="text-body-5 text-xs font-medium">Penerima:</span>
                <p class="text-body-11 text-sm">
                  {{ tteLog.penerima?.nama || "-" }}
                  <span v-if="tteLog.penerima?.nik" class="text-body-5">
                    ({{ tteLog.penerima.nik }})
                  </span>
                </p>
                <p v-if="tteLog.penerima?.nip" class="text-body-5 text-xs">
                  NIP: {{ tteLog.penerima.nip }}
                </p>
              </div>

              <!-- Tanggal Dibuat -->
              <div class="bg-body-9 rounded p-2 dark:bg-transparent">
                <span class="text-body-5 text-xs font-medium"
                  >Tanggal Dibuat:</span
                >
                <p class="text-body-11 text-sm">
                  {{ formatDate(tteLog.created_at) }}
                </p>
              </div>

              <!-- Tanggal Ditandatangani (jika sudah SIGNED) -->
              <div
                v-if="tteLog.status === 'SIGNED' && tteLog.signed_at"
                class="bg-body-9 rounded p-2 dark:bg-transparent"
              >
                <span class="text-body-5 text-xs font-medium"
                  >Tanggal Ditandatangani:</span
                >
                <p class="text-body-11 text-sm">
                  {{ formatDate(tteLog.signed_at) }}
                </p>
              </div>
            </div>
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

      <!-- Action Buttons -->
      <div
        class="bg-container-main dark:border-border-main fixed right-0 bottom-0 left-0 flex w-full justify-between gap-2 border-t border-gray-200 p-4 pt-4 sm:flex-row"
      >
        <div
          v-if="
            suratData?.data?.type !== 'inbox' &&
            suratData?.data?.urutan_tte === null
          "
          class="flex items-center gap-2"
        >
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
        <div v-else />

        <div class="flex items-center gap-2">
          <ButtonComponent
            variant="primary-outline"
            @click="isModalViewFileOpen = true"
          >
            <UIcon name="ph:file-pdf" class="h-4 w-4" />
            {{ TEXT.lihatPreview }}
          </ButtonComponent>
        </div>
      </div>
    </div>
  </ModalBottomComponent>

  <ModalViewFileComponent
    v-if="isModalViewFileOpen"
    :is-open="isModalViewFileOpen"
    :file-id="suratData?.data?.file?.id"
    :title="`${TEXT.nomorSurat}: ${suratData?.data?.nomor_surat}`"
    @close="isModalViewFileOpen = false"
  />
</template>
