<script setup>
definePageMeta({
  title: "SOP",
  description: "Standar Operasional Prosedur sistem",
});

// Mock SOP data
const sopCategories = ref([
  {
    id: 1,
    name: "Kepegawaian",
    description: "SOP terkait pengelolaan kepegawaian",
    icon: "ph:users",
    count: 15,
    color: "blue",
  },
  {
    id: 2,
    name: "Persuratan",
    description: "SOP pengelolaan surat masuk dan keluar",
    icon: "ph:envelope",
    count: 12,
    color: "green",
  },
  {
    id: 3,
    name: "Keuangan",
    description: "SOP pengelolaan keuangan dan anggaran",
    icon: "ph:currency-circle-dollar",
    count: 8,
    color: "yellow",
  },
  {
    id: 4,
    name: "IT & Sistem",
    description: "SOP pengelolaan teknologi informasi",
    icon: "ph:desktop",
    count: 10,
    color: "purple",
  },
]);

const recentSOPs = ref([
  {
    id: 1,
    title: "SOP Pengajuan Cuti Pegawai",
    category: "Kepegawaian",
    version: "2.1",
    lastUpdated: "2024-03-10",
    status: "active",
    downloads: 234,
  },
  {
    id: 2,
    title: "SOP Pengelolaan Surat Masuk",
    category: "Persuratan",
    version: "1.5",
    lastUpdated: "2024-03-05",
    status: "active",
    downloads: 189,
  },
  {
    id: 3,
    title: "SOP Backup Data Sistem",
    category: "IT & Sistem",
    version: "3.0",
    lastUpdated: "2024-02-28",
    status: "draft",
    downloads: 67,
  },
]);

const sopStats = ref([
  {
    title: "Total SOP",
    value: "45",
    change: "+3",
    changeType: "increase",
    icon: "ph:file-text",
  },
  {
    title: "SOP Aktif",
    value: "42",
    change: "+2",
    changeType: "increase",
    icon: "ph:check-circle",
  },
  {
    title: "Draft",
    value: "3",
    change: "+1",
    changeType: "increase",
    icon: "ph:note-pencil",
  },
  {
    title: "Total Download",
    value: "1.2K",
    change: "+45",
    changeType: "increase",
    icon: "ph:download",
  },
]);

const getStatusColor = (status) => {
  return status === "active"
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";
};

const getCategoryColor = (color) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return colors[color] || "bg-gray-100 text-gray-600";
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title mb-2 text-2xl font-bold">
            Standar Operasional Prosedur
          </h1>
          <p class="text-gray-subtitle">
            Kelola dan akses SOP untuk semua proses bisnis
          </p>
        </div>
        <ButtonComponent>
          <UIcon name="ph:plus" class="h-4 w-4" />
          Tambah SOP Baru
        </ButtonComponent>
      </div>
    </div>

    <!-- SOP Statistics -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in sopStats"
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

    <!-- SOP Categories -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <h2 class="text-gray-title mb-4 text-lg font-semibold">Kategori SOP</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="category in sopCategories"
          :key="category.id"
          class="border-neutral-9 hover:border-primary-main cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md"
        >
          <div class="mb-3 flex items-center justify-between">
            <div
              :class="getCategoryColor(category.color)"
              class="rounded-lg p-2"
            >
              <UIcon :name="category.icon" class="h-6 w-6" />
            </div>
            <span class="text-gray-title text-sm font-semibold"
              >{{ category.count }} SOP</span
            >
          </div>
          <h3 class="text-gray-title mb-1 font-semibold">
            {{ category.name }}
          </h3>
          <p class="text-gray-4 text-sm">{{ category.description }}</p>
        </div>
      </div>
    </div>

    <!-- Recent SOPs -->
    <div class="border-neutral-9 rounded-lg border bg-white shadow-sm">
      <div class="border-neutral-9 border-b p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-gray-title text-lg font-semibold">SOP Terbaru</h2>
          <div class="flex items-center gap-3">
            <!-- Search -->
            <div class="relative">
              <UIcon
                name="ph:magnifying-glass"
                class="text-gray-4 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform"
              />
              <input
                type="text"
                placeholder="Cari SOP..."
                class="border-neutral-9 focus:ring-primary-main focus:border-primary-main rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <!-- Filter -->
            <select
              class="border-neutral-9 focus:ring-primary-main focus:border-primary-main rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              <option value="kepegawaian">Kepegawaian</option>
              <option value="persuratan">Persuratan</option>
              <option value="keuangan">Keuangan</option>
              <option value="it">IT & Sistem</option>
            </select>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="sop in recentSOPs"
            :key="sop.id"
            class="border-neutral-9 hover:border-primary-main rounded-lg border p-4 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-3">
                  <h3 class="text-gray-title text-lg font-semibold">
                    {{ sop.title }}
                  </h3>
                  <span
                    :class="getStatusColor(sop.status)"
                    class="rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {{ sop.status === "active" ? "Aktif" : "Draft" }}
                  </span>
                </div>
                <div class="text-gray-4 mb-3 flex items-center gap-4 text-sm">
                  <span class="flex items-center gap-1">
                    <UIcon name="ph:tag" class="h-4 w-4" />
                    {{ sop.category }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="ph:code" class="h-4 w-4" />
                    v{{ sop.version }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="ph:calendar" class="h-4 w-4" />
                    {{ new Date(sop.lastUpdated).toLocaleDateString("id-ID") }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="ph:download" class="h-4 w-4" />
                    {{ sop.downloads }} downloads
                  </span>
                </div>
              </div>
              <div class="ml-4 flex items-center gap-2">
                <button
                  class="text-gray-4 hover:text-primary-main hover:bg-primary-main/10 rounded-lg p-2 transition-colors"
                >
                  <UIcon name="ph:eye" class="h-4 w-4" />
                </button>
                <button
                  class="text-gray-4 hover:text-primary-main hover:bg-primary-main/10 rounded-lg p-2 transition-colors"
                >
                  <UIcon name="ph:download-simple" class="h-4 w-4" />
                </button>
                <button
                  class="text-gray-4 hover:text-primary-main hover:bg-primary-main/10 rounded-lg p-2 transition-colors"
                >
                  <UIcon name="ph:pencil-simple" class="h-4 w-4" />
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
          <p class="text-gray-4 text-sm">Menampilkan 1-3 dari 45 SOP</p>
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
