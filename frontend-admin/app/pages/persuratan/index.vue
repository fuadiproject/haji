<script setup>
definePageMeta({
  title: "Persuratan",
  description: "Kelola surat masuk dan surat keluar",
});

// Mock data
const mailStats = ref([
  {
    title: "Surat Masuk",
    value: "156",
    change: "+12",
    changeType: "increase",
    icon: "ph:envelope",
    color: "blue",
  },
  {
    title: "Surat Keluar",
    value: "89",
    change: "+8",
    changeType: "increase",
    icon: "ph:paper-plane-tilt",
    color: "green",
  },
  {
    title: "Menunggu Approval",
    value: "23",
    change: "-5",
    changeType: "decrease",
    icon: "ph:clock",
    color: "yellow",
  },
  {
    title: "Disposisi",
    value: "67",
    change: "+15",
    changeType: "increase",
    icon: "ph:share",
    color: "purple",
  },
]);

const recentMails = ref([
  {
    id: 1,
    type: "incoming",
    subject: "Permohonan Data Pegawai untuk Audit Internal",
    sender: "Inspektorat Jenderal",
    recipient: "Bagian Kepegawaian",
    date: "2024-03-15",
    priority: "high",
    status: "unread",
  },
  {
    id: 2,
    type: "outgoing",
    subject: "Laporan Bulanan Kegiatan Haji Februari 2024",
    sender: "Bagian Program",
    recipient: "Direktur Jenderal",
    date: "2024-03-14",
    priority: "normal",
    status: "sent",
  },
  {
    id: 3,
    type: "incoming",
    subject: "Undangan Rapat Koordinasi Persiapan Haji 2024",
    sender: "Sekretariat Jenderal",
    recipient: "Seluruh Direktorat",
    date: "2024-03-13",
    priority: "urgent",
    status: "read",
  },
]);

const getStatusColor = (status) => {
  switch (status) {
    case "unread":
      return "bg-blue-100 text-blue-800";
    case "read":
      return "bg-gray-100 text-gray-800";
    case "sent":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "normal":
      return "bg-blue-100 text-blue-800";
    case "low":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type) => {
  return type === "incoming" ? "ph:envelope" : "ph:paper-plane-tilt";
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title mb-2 text-2xl font-bold">Persuratan</h1>
          <p class="text-gray-subtitle">
            Kelola surat masuk dan surat keluar secara digital
          </p>
        </div>
        <div class="flex items-center gap-3">
          <ButtonComponent variant="outline">
            <UIcon name="ph:upload" class="h-4 w-4" />
            Upload Surat
          </ButtonComponent>
          <ButtonComponent>
            <UIcon name="ph:plus" class="h-4 w-4" />
            Buat Surat Baru
          </ButtonComponent>
        </div>
      </div>
    </div>

    <!-- Mail Statistics -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in mailStats"
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
          <div
            :class="{
              'bg-blue-100': stat.color === 'blue',
              'bg-green-100': stat.color === 'green',
              'bg-yellow-100': stat.color === 'yellow',
              'bg-purple-100': stat.color === 'purple',
            }"
            class="rounded-lg p-3"
          >
            <UIcon
              :name="stat.icon"
              :class="{
                'text-blue-600': stat.color === 'blue',
                'text-green-600': stat.color === 'green',
                'text-yellow-600': stat.color === 'yellow',
                'text-purple-600': stat.color === 'purple',
              }"
              class="h-6 w-6"
            />
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

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <h3 class="text-gray-title mb-4 text-lg font-semibold">Aksi Cepat</h3>
        <div class="space-y-3">
          <button
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex w-full items-center gap-3 rounded-lg border p-3 transition-all"
          >
            <div class="rounded-lg bg-blue-100 p-2">
              <UIcon name="ph:envelope" class="h-4 w-4 text-blue-600" />
            </div>
            <span class="text-gray-title text-sm font-medium"
              >Surat Masuk Baru</span
            >
          </button>

          <button
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex w-full items-center gap-3 rounded-lg border p-3 transition-all"
          >
            <div class="rounded-lg bg-green-100 p-2">
              <UIcon
                name="ph:paper-plane-tilt"
                class="h-4 w-4 text-green-600"
              />
            </div>
            <span class="text-gray-title text-sm font-medium">Kirim Surat</span>
          </button>

          <button
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex w-full items-center gap-3 rounded-lg border p-3 transition-all"
          >
            <div class="rounded-lg bg-yellow-100 p-2">
              <UIcon name="ph:share" class="h-4 w-4 text-yellow-600" />
            </div>
            <span class="text-gray-title text-sm font-medium">Disposisi</span>
          </button>

          <button
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex w-full items-center gap-3 rounded-lg border p-3 transition-all"
          >
            <div class="rounded-lg bg-purple-100 p-2">
              <UIcon name="ph:file-text" class="h-4 w-4 text-purple-600" />
            </div>
            <span class="text-gray-title text-sm font-medium"
              >Template Surat</span
            >
          </button>
        </div>
      </div>

      <!-- Recent Mail Activity -->
      <div
        class="border-neutral-9 rounded-lg border bg-white shadow-sm lg:col-span-2"
      >
        <div class="border-neutral-9 border-b p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-gray-title text-lg font-semibold">
              Aktivitas Surat Terbaru
            </h3>
            <NuxtLink
              to="/persuratan/all"
              class="text-primary-main hover:text-primary-main/80 text-sm"
            >
              Lihat Semua
            </NuxtLink>
          </div>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="mail in recentMails"
              :key="mail.id"
              class="border-neutral-9 hover:border-primary-main rounded-lg border p-4 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex flex-1 items-start gap-3">
                  <div
                    :class="{
                      'bg-blue-100': mail.type === 'incoming',
                      'bg-green-100': mail.type === 'outgoing',
                    }"
                    class="mt-1 rounded-lg p-2"
                  >
                    <UIcon
                      :name="getTypeIcon(mail.type)"
                      :class="{
                        'text-blue-600': mail.type === 'incoming',
                        'text-green-600': mail.type === 'outgoing',
                      }"
                      class="h-4 w-4"
                    />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-gray-title mb-1 font-medium">
                      {{ mail.subject }}
                    </h4>
                    <div
                      class="text-gray-4 mb-2 flex items-center gap-4 text-sm"
                    >
                      <span
                        >{{ mail.type === "incoming" ? "Dari" : "Kepada" }}:
                        {{
                          mail.type === "incoming"
                            ? mail.sender
                            : mail.recipient
                        }}</span
                      >
                      <span>{{
                        new Date(mail.date).toLocaleDateString("id-ID")
                      }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span
                        :class="getStatusColor(mail.status)"
                        class="rounded-full px-2 py-1 text-xs font-medium"
                      >
                        {{
                          mail.status.charAt(0).toUpperCase() +
                          mail.status.slice(1)
                        }}
                      </span>
                      <span
                        :class="getPriorityColor(mail.priority)"
                        class="rounded-full px-2 py-1 text-xs font-medium"
                      >
                        {{
                          mail.priority.charAt(0).toUpperCase() +
                          mail.priority.slice(1)
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    class="text-gray-4 hover:text-primary-main hover:bg-primary-main/10 rounded-lg p-2 transition-colors"
                  >
                    <UIcon name="ph:eye" class="h-4 w-4" />
                  </button>
                  <button
                    class="text-gray-4 hover:text-primary-main hover:bg-primary-main/10 rounded-lg p-2 transition-colors"
                  >
                    <UIcon name="ph:download" class="h-4 w-4" />
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
        </div>
      </div>
    </div>
  </div>
</template>
