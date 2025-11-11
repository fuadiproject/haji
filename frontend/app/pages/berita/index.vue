<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useServiceBeritaApi } from "@/composables/useServiceBeritaApi";

const { getNews } = useServiceBeritaApi();

const newsList = ref([]);
const page = ref(1);
const limit = ref(10);
const hasNextPage = ref(true);
const isLoading = ref(false);
const sentinel = ref(null);
const search = ref("");
let debounceTimer;

const handleBack = () => {
  navigateTo("/");
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const truncate = (text, length = 100) => {
  if (!text) return "";
  const cleanText = text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/(\*\*|__|\*|_|`|#+\s)/g, "")
    .replace(/<[^>]*>/g, "") // remove html tags
    .replace(/\s\s+/g, " ")
    .trim();

  if (cleanText.length <= length) {
    return cleanText;
  }
  return cleanText.substring(0, length) + "...";
};

const fetchNews = async () => {
  if (isLoading.value || !hasNextPage.value) return;

  isLoading.value = true;
  try {
    const response = await getNews({
      page: page.value,
      limit: limit.value,
      search: search.value,
    });
    if (response.data && response.data.news.length > 0) {
      newsList.value.push(...response.data.news);
      page.value++;
      hasNextPage.value = response.data.pagination.hasNext;
    } else {
      hasNextPage.value = false;
    }
  } catch (error) {
    console.error("Gagal memuat berita:", error);
    hasNextPage.value = false; // Stop trying on error
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = (value) => {
  search.value = value;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    newsList.value = [];
    page.value = 1;
    hasNextPage.value = true;
    fetchNews();
  }, 500);
};

let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        fetchNews();
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
  if (sentinel.value) {
    observer.unobserve(sentinel.value);
  }
});
</script>

<template>
  <div>
    <TemplateDetailComponent
      variant="default"
      title="Berita"
      @back="handleBack"
    >
      <div class="space-y-6 pb-16">
        <UInput
          size="xl"
          icon="ph:magnifying-glass"
          placeholder="Cari berita..."
          class="w-full"
          :ui="{
            base: 'rounded-2xl focus-visible:ring-1',
          }"
          :model-value="search"
          @update:model-value="handleSearch"
        />

        <!-- Skeleton Loader -->
        <div
          v-if="isLoading && newsList.length === 0"
          class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div
              class="h-48 w-full animate-pulse bg-gray-200 dark:bg-slate-700"
            ></div>
            <div class="flex flex-grow flex-col p-6">
              <div class="mb-2 flex items-center justify-between">
                <div
                  class="h-5 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700"
                ></div>
                <div
                  class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700"
                ></div>
              </div>
              <div class="mt-2 space-y-2">
                <div
                  class="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-700"
                ></div>
                <div
                  class="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-slate-700"
                ></div>
              </div>
              <div class="mt-4 space-y-2">
                <div
                  class="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-700"
                ></div>
                <div
                  class="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-slate-700"
                ></div>
              </div>
              <div class="mt-auto pt-4">
                <div
                  class="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- News Grid -->
        <div
          v-else-if="newsList.length > 0"
          class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="newsItem in newsList"
            :key="newsItem._id"
            class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <img
              class="h-48 w-full object-cover"
              :src="newsItem.thumbnail"
              alt="News thumbnail"
            />
            <div class="flex flex-grow flex-col p-6">
              <div
                class="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
              >
                <span
                  class="me-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                >
                  {{ newsItem.category }}
                </span>
                <span>{{ formatDate(newsItem.publishDate) }}</span>
              </div>
              <h3
                class="mb-2 flex-grow text-lg font-bold text-gray-900 dark:text-white"
              >
                {{ newsItem.title }}
              </h3>
              <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
                {{ truncate(newsItem.content) }}
              </p>
              <div class="mb-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in newsItem.tags"
                  :key="tag"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  #{{ tag }}
                </span>
              </div>
              <NuxtLink
                :to="newsItem.referenceUrl"
                class="mt-auto text-sm font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
              >
                Baca Selengkapnya →
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- No News Message -->
        <div
          v-else-if="!isLoading && newsList.length === 0"
          class="flex justify-center py-10"
        >
          <p class="text-gray-600 dark:text-gray-400">
            Tidak ada berita yang tersedia saat ini.
          </p>
        </div>

        <div ref="sentinel" />

        <!-- Loading More Indicator -->
        <div
          v-if="isLoading && newsList.length > 0"
          class="flex justify-center py-4"
        >
          <p class="text-gray-600 dark:text-gray-400">
            Memuat berita selanjutnya...
          </p>
        </div>

        <!-- End of List Message -->
        <div
          v-if="!hasNextPage && !isLoading && newsList.length > 0"
          class="flex justify-center py-4"
        >
          <p class="text-gray-600 dark:text-gray-400">
            Anda telah mencapai akhir daftar berita.
          </p>
        </div>
      </div>
    </TemplateDetailComponent>
    <BottomMenuComponent />
  </div>
</template>
