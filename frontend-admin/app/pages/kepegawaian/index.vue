<script setup>
definePageMeta({
  title: "Kepegawaian",
  description: "Kelola data pegawai dan informasi kepegawaian",
});
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <h1 class="text-gray-title mb-2 text-2xl font-bold">Kepegawaian</h1>
      <p class="text-gray-subtitle">
        Kelola data pegawai dan informasi kepegawaian dalam sistem
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">Total Pegawai</p>
            <p class="text-gray-title text-2xl font-bold">1,234</p>
          </div>
          <div class="bg-primary-main/10 rounded-lg p-3">
            <UIcon name="ph:users" class="text-primary-main h-6 w-6" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm font-medium text-green-600">+5.2%</span>
          <span class="text-gray-4 ml-2 text-sm">dari bulan lalu</span>
        </div>
      </div>

      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">Pegawai Aktif</p>
            <p class="text-gray-title text-2xl font-bold">1,187</p>
          </div>
          <div class="rounded-lg bg-green-100 p-3">
            <UIcon name="ph:check-circle" class="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm font-medium text-green-600">+2.1%</span>
          <span class="text-gray-4 ml-2 text-sm">dari bulan lalu</span>
        </div>
      </div>

      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">Cuti Pending</p>
            <p class="text-gray-title text-2xl font-bold">47</p>
          </div>
          <div class="rounded-lg bg-yellow-100 p-3">
            <UIcon name="ph:clock" class="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm font-medium text-red-600">+8.3%</span>
          <span class="text-gray-4 ml-2 text-sm">dari bulan lalu</span>
        </div>
      </div>

      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">
              Mutasi Bulan Ini
            </p>
            <p class="text-gray-title text-2xl font-bold">12</p>
          </div>
          <div class="rounded-lg bg-blue-100 p-3">
            <UIcon name="ph:arrows-clockwise" class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm font-medium text-green-600">-12.5%</span>
          <span class="text-gray-4 ml-2 text-sm">dari bulan lalu</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent Activities -->
      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <h2 class="text-gray-title mb-4 text-lg font-semibold">
          Aktivitas Terbaru
        </h2>
        <div class="space-y-4">
          <div class="bg-neutral-8 flex items-center gap-4 rounded-lg p-3">
            <div class="bg-primary-main/10 rounded-full p-2">
              <UIcon name="ph:user-plus" class="text-primary-main h-4 w-4" />
            </div>
            <div class="flex-1">
              <p class="text-gray-title text-sm font-medium">
                Pegawai Baru Ditambahkan
              </p>
              <p class="text-gray-4 text-xs">Ahmad Fadli - Staf Administrasi</p>
            </div>
            <span class="text-gray-4 text-xs">2 jam lalu</span>
          </div>

          <div class="bg-neutral-8 flex items-center gap-4 rounded-lg p-3">
            <div class="rounded-full bg-yellow-100 p-2">
              <UIcon name="ph:calendar-check" class="h-4 w-4 text-yellow-600" />
            </div>
            <div class="flex-1">
              <p class="text-gray-title text-sm font-medium">
                Permohonan Cuti Disetujui
              </p>
              <p class="text-gray-4 text-xs">Siti Nurhaliza - Cuti Tahunan</p>
            </div>
            <span class="text-gray-4 text-xs">4 jam lalu</span>
          </div>

          <div class="bg-neutral-8 flex items-center gap-4 rounded-lg p-3">
            <div class="rounded-full bg-blue-100 p-2">
              <UIcon name="ph:arrows-clockwise" class="h-4 w-4 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="text-gray-title text-sm font-medium">Mutasi Pegawai</p>
              <p class="text-gray-4 text-xs">
                Budi Santoso - Pindah ke Divisi IT
              </p>
            </div>
            <span class="text-gray-4 text-xs">1 hari lalu</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <h2 class="text-gray-title mb-4 text-lg font-semibold">Aksi Cepat</h2>
        <div class="grid grid-cols-1 gap-3">
          <button
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex items-center gap-3 rounded-lg border p-3 transition-all"
          >
            <div class="bg-primary-main/10 rounded-lg p-2">
              <UIcon name="ph:user-plus" class="text-primary-main h-5 w-5" />
            </div>
            <div class="text-left">
              <p class="text-gray-title text-sm font-medium">
                Tambah Pegawai Baru
              </p>
              <p class="text-gray-4 text-xs">
                Daftarkan pegawai baru ke sistem
              </p>
            </div>
          </button>

          <button
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex items-center gap-3 rounded-lg border p-3 transition-all"
          >
            <div class="rounded-lg bg-yellow-100 p-2">
              <UIcon name="ph:calendar-check" class="h-5 w-5 text-yellow-600" />
            </div>
            <div class="text-left">
              <p class="text-gray-title text-sm font-medium">Kelola Cuti</p>
              <p class="text-gray-4 text-xs">Proses permohonan cuti pegawai</p>
            </div>
          </button>

          <button
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex items-center gap-3 rounded-lg border p-3 transition-all"
          >
            <div class="rounded-lg bg-blue-100 p-2">
              <UIcon name="ph:file-text" class="h-5 w-5 text-blue-600" />
            </div>
            <div class="text-left">
              <p class="text-gray-title text-sm font-medium">
                Laporan Kepegawaian
              </p>
              <p class="text-gray-4 text-xs">Generate laporan data pegawai</p>
            </div>
          </button>

          <button
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex items-center gap-3 rounded-lg border p-3 transition-all"
          >
            <div class="rounded-lg bg-green-100 p-2">
              <UIcon
                name="ph:arrows-clockwise"
                class="h-5 w-5 text-green-600"
              />
            </div>
            <div class="text-left">
              <p class="text-gray-title text-sm font-medium">Proses Mutasi</p>
              <p class="text-gray-4 text-xs">Kelola perpindahan pegawai</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
