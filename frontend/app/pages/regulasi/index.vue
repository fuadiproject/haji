<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useServiceHajiApi } from "@/composables/useServiceHajiApi";

const { getRegulasi } = useServiceHajiApi();

const regulasiList = ref([]);
const page = ref(1);
const limit = ref(10);
const hasNextPage = ref(true);
const isLoading = ref(false);
const sentinel = ref(null);
const search = ref("");
const selectedCategory = ref("Semua Kategori");
let debounceTimer;

const isModalOpen = ref(false);
const selectedRegulasi = ref(null);

const categoryOptions = [
  { label: "Semua Kategori", value: "Semua Kategori" },
  { label: "Undang Undang", value: "Undang Undang" },
  { label: "Peraturan Pemerintah", value: "Peraturan Pemerintah" },
  { label: "Peraturan Presiden", value: "Peraturan Presiden" },
  { label: "Keputusan Presiden", value: "Keputusan Presiden" },
  { label: "Peraturan Menteri", value: "Peraturan Menteri" },
  { label: "Keputusan Menteri", value: "Keputusan Menteri" },
  {
    label: "Keputusan Sekretaris Jenderal",
    value: "Keputusan Sekretaris Jenderal",
  },
  {
    label: "Keputusan Direktur Jenderal",
    value: "Keputusan Direktur Jenderal",
  },
  {
    label: "Keputusan Inspektur Jenderal",
    value: "Keputusan Inspektur Jenderal",
  },
  { label: "Peraturan Lainnya", value: "Peraturan Lainnya" },
];

const handleBack = () => {
  navigateTo("/");
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const fetchRegulasi = async () => {
  if (isLoading.value || !hasNextPage.value) return;

  isLoading.value = true;
  try {
    const response = await getRegulasi({
      page: page.value,
      limit: limit.value,
      search: search.value,
      category:
        selectedCategory.value === "Semua Kategori"
          ? undefined
          : selectedCategory.value,
    });
    if (response.data && response.data.regulations.length > 0) {
      regulasiList.value.push(...response.data.regulations);
      page.value++;
      hasNextPage.value = response.data.pagination.hasNext;
    } else {
      hasNextPage.value = false;
    }
  } catch (error) {
    console.error("Gagal memuat regulasi:", error);
    hasNextPage.value = false;
  } finally {
    isLoading.value = false;
  }
};

const resetAndFetch = () => {
  regulasiList.value = [];
  page.value = 1;
  hasNextPage.value = true;
  fetchRegulasi();
};

const handleSearch = (value) => {
  search.value = value;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    resetAndFetch();
  }, 500);
};

watch(selectedCategory, () => {
  resetAndFetch();
});

const openModal = (regulasi) => {
  selectedRegulasi.value = regulasi;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedRegulasi.value = null;
};

let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        fetchRegulasi();
      }
    },
    {
      rootMargin: "200px",
    },
  );

  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});

onUnmounted(() => {
  if (sentinel.value && observer) {
    observer.unobserve(sentinel.value);
  }
});
</script>

<template>
  <div>
    <TemplateDetailComponent
      variant="default"
      title="Regulasi"
      @back="handleBack"
    >
      <div class="space-y-6 pb-16">
        <div class="grid grid-cols-1 gap-4">
          <UInput
            size="lg"
            icon="ph:magnifying-glass"
            placeholder="Cari regulasi..."
            class="w-full"
            :ui="{
              base: 'rounded-2xl focus-visible:ring-1',
            }"
            :model-value="search"
            @update:model-value="handleSearch"
          />
          <USelect
            v-model="selectedCategory"
            :items="categoryOptions"
            size="lg"
            class="w-full"
            :ui="{
              base: 'rounded-2xl focus-visible:ring-1',
            }"
          />
        </div>

        <!-- Skeleton Loader -->
        <div
          v-if="isLoading && regulasiList.length === 0"
          class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div
              class="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700"
            ></div>
            <div
              class="h-6 w-40 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700"
            ></div>
            <div class="space-y-2">
              <div
                class="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-700"
              ></div>
              <div
                class="h-5 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-slate-700"
              ></div>
            </div>
            <div
              class="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"
            ></div>
            <div
              class="h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700"
            ></div>
          </div>
        </div>

        <!-- Regulasi Grid -->
        <div
          v-else-if="regulasiList.length > 0"
          class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="regulasi in regulasiList"
            :key="regulasi._id"
            class="flex cursor-pointer flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
            @click="openModal(regulasi)"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700"
            >
              <UIcon
                name="ph:file-pdf"
                class="h-6 w-6 text-gray-500 dark:text-gray-400"
              />
            </div>
            <div class="flex-grow">
              <UBadge color="primary" variant="soft">{{
                regulasi.category
              }}</UBadge>
              <h3 class="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                {{ regulasi.name.id }}
              </h3>
              <p class="mt-1 flex items-center text-sm text-gray-500">
                <UIcon name="ph:calendar" class="mr-2" />
                {{ formatDate(regulasi.createdAt) }}
              </p>
            </div>
            <UButton
              block
              size="lg"
              icon="ph:download-simple"
              :to="regulasi.file"
              target="_blank"
              @click.stop
              >Download</UButton
            >
          </div>
        </div>

        <!-- No Regulasi Message -->
        <div
          v-else-if="!isLoading && regulasiList.length === 0"
          class="flex justify-center py-10"
        >
          <p class="text-gray-600 dark:text-gray-400">
            Tidak ada regulasi yang tersedia saat ini.
          </p>
        </div>

        <div ref="sentinel" />

        <!-- Loading More Indicator -->
        <div
          v-if="isLoading && regulasiList.length > 0"
          class="flex justify-center py-4"
        >
          <p class="text-gray-600 dark:text-gray-400">
            Memuat regulasi selanjutnya...
          </p>
        </div>

        <!-- End of List Message -->
        <div
          v-if="!hasNextPage && !isLoading && regulasiList.length > 0"
          class="flex justify-center py-4"
        >
          <p class="text-gray-600 dark:text-gray-400">
            Anda telah mencapai akhir daftar regulasi.
          </p>
        </div>
      </div>
    </TemplateDetailComponent>

    <!-- PDF Viewer Modal -->
    <ModalComponent
      v-if="selectedRegulasi"
      content-class-name="h-[calc(100vh)]"
      :title="
        selectedRegulasi.name.id.slice(0, 50) +
        '...' +
        selectedRegulasi.name.id.slice(-50)
      "
      title-class-name="h-22"
      :is-open="isModalOpen"
      size="xl"
      @close="closeModal"
      @update:is-open="isModalOpen = $event"
    >
      <div class="relative">
        <div class="h-full max-h-[calc(100vh-220px)] w-full overflow-auto">
          <PdfViewerComponent :src="selectedRegulasi.file" />
        </div>
        <div class="mt-4 flex justify-center">
          <UButton
            color="primary"
            variant="solid"
            size="md"
            icon="i-heroicons-arrow-down-tray"
            :to="selectedRegulasi.file"
            target="_blank"
          >
            Download File
          </UButton>
        </div>
      </div>
    </ModalComponent>
  </div>
</template>
