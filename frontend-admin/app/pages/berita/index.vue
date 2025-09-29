<script setup>
definePageMeta({
  title: "Berita",
  description: "Kelola berita dan pengumuman sistem",
});

// Mock data for news
const newsItems = ref([
  {
    id: 1,
    title: "Pengumuman Libur Nasional Hari Raya Idul Fitri 2024",
    excerpt:
      "Informasi mengenai jadwal libur nasional dan operasional kantor selama periode Hari Raya Idul Fitri 2024.",
    category: "Pengumuman",
    author: "Admin Humas",
    publishedAt: "2024-03-15",
    status: "published",
    views: 1234,
  },
  {
    id: 2,
    title: "Update Sistem Presensi Online - Fitur Baru",
    excerpt:
      "Sistem presensi online telah diperbarui dengan fitur-fitur baru untuk meningkatkan efisiensi absensi pegawai.",
    category: "Update Sistem",
    author: "Tim IT",
    publishedAt: "2024-03-10",
    status: "published",
    views: 856,
  },
  {
    id: 3,
    title: "Sosialisasi Peraturan Baru Terkait Cuti Pegawai",
    excerpt:
      "Akan diadakan sosialisasi mengenai peraturan terbaru terkait pengajuan dan approval cuti pegawai.",
    category: "Sosialisasi",
    author: "Bagian Kepegawaian",
    publishedAt: "2024-03-08",
    status: "draft",
    views: 0,
  },
]);

const stats = ref([
  {
    title: "Total Berita",
    value: "156",
    change: "+12",
    changeType: "increase",
    icon: "ph:newspaper",
  },
  {
    title: "Berita Aktif",
    value: "134",
    change: "+8",
    changeType: "increase",
    icon: "ph:check-circle",
  },
  {
    title: "Draft",
    value: "22",
    change: "+4",
    changeType: "increase",
    icon: "ph:note-pencil",
  },
  {
    title: "Total Views",
    value: "45.2K",
    change: "+15.3%",
    changeType: "increase",
    icon: "ph:eye",
  },
]);

const getStatusColor = (status) => {
  return status === "published"
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";
};

const getStatusText = (status) => {
  return status === "published" ? "Published" : "Draft";
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title mb-2 text-2xl font-bold">
            Berita & Pengumuman
          </h1>
          <p class="text-gray-subtitle">
            Kelola berita dan pengumuman untuk seluruh pegawai
          </p>
        </div>
        <ButtonComponent class="flex items-center gap-2">
          <UIcon name="ph:plus" class="h-4 w-4" />
          Tambah Berita
        </ButtonComponent>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">
              {{ stat.title }}
            </p>
            <p class="text-gray-title text-2xl font-bold">{{ stat.value }}</p>
          </div>
          <div class="bg-primary-main/10 rounded-lg p-3">
            <UIcon :name="stat.icon" class="text-primary-main h-6 w-6" />
          </div>
        </div>
        <div class="mt-4">
          <span
            :class="{
              'text-green-600': stat.changeType === 'increase',
              'text-red-600': stat.changeType === 'decrease',
            }"
            class="text-sm font-medium"
          >
            {{ stat.change }}
          </span>
          <span class="text-gray-4 ml-2 text-sm">bulan ini</span>
        </div>
      </div>
    </div>

    <!-- News Management -->
    <div class="border-neutral-9 rounded-lg border bg-white shadow-sm">
      <div class="border-neutral-9 border-b p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-gray-title text-lg font-semibold">Daftar Berita</h2>
          <div class="flex items-center gap-3">
            <!-- Search -->
            <div class="relative">
              <UIcon
                name="ph:magnifying-glass"
                class="text-gray-4 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform"
              />
              <input
                type="text"
                placeholder="Cari berita..."
                class="border-neutral-9 focus:ring-primary-main focus:border-primary-main rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <!-- Filter -->
            <select
              class="border-neutral-9 focus:ring-primary-main focus:border-primary-main rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="news in newsItems"
            :key="news.id"
            class="border-neutral-9 hover:border-primary-main rounded-lg border p-4 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-3">
                  <h3 class="text-gray-title text-lg font-semibold">
                    {{ news.title }}
                  </h3>
                  <span
                    :class="getStatusColor(news.status)"
                    class="rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {{ getStatusText(news.status) }}
                  </span>
                </div>
                <p class="text-gray-4 mb-3 line-clamp-2">{{ news.excerpt }}</p>
                <div class="text-gray-4 flex items-center gap-4 text-sm">
                  <span class="flex items-center gap-1">
                    <UIcon name="ph:tag" class="h-4 w-4" />
                    {{ news.category }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="ph:user" class="h-4 w-4" />
                    {{ news.author }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="ph:calendar" class="h-4 w-4" />
                    {{ new Date(news.publishedAt).toLocaleDateString("id-ID") }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="ph:eye" class="h-4 w-4" />
                    {{ news.views.toLocaleString() }} views
                  </span>
                </div>
              </div>
              <div class="ml-4 flex items-center gap-2">
                <button
                  class="text-gray-4 hover:text-primary-main hover:bg-primary-main/10 rounded-lg p-2 transition-colors"
                >
                  <UIcon name="ph:pencil-simple" class="h-4 w-4" />
                </button>
                <button
                  class="text-gray-4 rounded-lg p-2 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <UIcon name="ph:trash" class="h-4 w-4" />
                </button>
                <button
                  class="text-gray-4 hover:text-primary-main hover:bg-primary-main/10 rounded-lg p-2 transition-colors"
                >
                  <UIcon name="ph:dots-three-vertical" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          class="border-neutral-9 mt-6 flex items-center justify-between border-t pt-4"
        >
          <p class="text-gray-4 text-sm">Menampilkan 1-3 dari 156 berita</p>
          <div class="flex items-center gap-2">
            <button
              class="border-neutral-9 hover:bg-neutral-2 rounded border px-3 py-1 text-sm transition-colors"
            >
              Previous
            </button>
            <button
              class="bg-primary-main rounded px-3 py-1 text-sm text-white"
            >
              1
            </button>
            <button
              class="border-neutral-9 hover:bg-neutral-2 rounded border px-3 py-1 text-sm transition-colors"
            >
              2
            </button>
            <button
              class="border-neutral-9 hover:bg-neutral-2 rounded border px-3 py-1 text-sm transition-colors"
            >
              3
            </button>
            <button
              class="border-neutral-9 hover:bg-neutral-2 rounded border px-3 py-1 text-sm transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
