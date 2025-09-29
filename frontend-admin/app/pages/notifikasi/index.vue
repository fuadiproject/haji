<script setup>
definePageMeta({
  title: "Notifikasi",
  description: "Pusat notifikasi dan pengumuman sistem",
});

// Mock notification data
const notifications = ref([
  {
    id: 1,
    title: "Permohonan Cuti Disetujui",
    message:
      "Permohonan cuti Anda untuk tanggal 20-22 Maret 2024 telah disetujui oleh atasan.",
    type: "success",
    category: "Kepegawaian",
    isRead: false,
    timestamp: "2024-03-15T10:30:00Z",
    sender: "Sistem Kepegawaian",
  },
  {
    id: 2,
    title: "Surat Masuk Baru",
    message:
      "Terdapat surat masuk baru dari Inspektorat Jenderal yang memerlukan tindak lanjut.",
    type: "info",
    category: "Persuratan",
    isRead: false,
    timestamp: "2024-03-15T09:15:00Z",
    sender: "Sistem Persuratan",
  },
  {
    id: 3,
    title: "Reminder: Rapat Koordinasi",
    message:
      "Rapat koordinasi persiapan Haji 2024 akan dimulai dalam 1 jam di ruang rapat utama.",
    type: "warning",
    category: "Agenda",
    isRead: true,
    timestamp: "2024-03-15T08:00:00Z",
    sender: "Sistem Kalender",
  },
  {
    id: 4,
    title: "Update Sistem Presensi",
    message:
      "Sistem presensi akan mengalami maintenance pada hari Minggu, 17 Maret 2024.",
    type: "info",
    category: "Sistem",
    isRead: true,
    timestamp: "2024-03-14T16:45:00Z",
    sender: "Admin IT",
  },
  {
    id: 5,
    title: "Dokumen Perlu Approval",
    message: "Terdapat 3 dokumen yang menunggu approval dari Anda.",
    type: "urgent",
    category: "Approval",
    isRead: false,
    timestamp: "2024-03-14T14:20:00Z",
    sender: "Sistem Workflow",
  },
]);

const notificationStats = ref([
  {
    title: "Total Notifikasi",
    value: "47",
    change: "+12",
    changeType: "increase",
    icon: "ph:bell",
  },
  {
    title: "Belum Dibaca",
    value: "23",
    change: "+8",
    changeType: "increase",
    icon: "ph:envelope",
  },
  {
    title: "Urgent",
    value: "5",
    change: "+2",
    changeType: "increase",
    icon: "ph:warning",
  },
  {
    title: "Hari Ini",
    value: "15",
    change: "+15",
    changeType: "increase",
    icon: "ph:clock",
  },
]);

const getNotificationIcon = (type) => {
  const icons = {
    success: "ph:check-circle",
    info: "ph:info",
    warning: "ph:warning",
    urgent: "ph:warning-circle",
    error: "ph:x-circle",
  };
  return icons[type] || "ph:bell";
};

const getNotificationColor = (type) => {
  const colors = {
    success: "bg-green-100 text-green-600",
    info: "bg-blue-100 text-blue-600",
    warning: "bg-yellow-100 text-yellow-600",
    urgent: "bg-red-100 text-red-600",
    error: "bg-red-100 text-red-600",
  };
  return colors[type] || "bg-gray-100 text-gray-600";
};

const getTypeColor = (type) => {
  const colors = {
    success: "bg-green-100 text-green-800",
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    urgent: "bg-red-100 text-red-800",
    error: "bg-red-100 text-red-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    return `${diffInMinutes} menit lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  }
};

const markAsRead = (notificationId) => {
  const notification = notifications.value.find((n) => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.isRead = true));
};

const deleteNotification = (notificationId) => {
  const index = notifications.value.findIndex((n) => n.id === notificationId);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.isRead).length;
});
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-gray-title mb-2 text-2xl font-bold">Notifikasi</h1>
          <p class="text-gray-subtitle">
            Pusat notifikasi dan pengumuman sistem
          </p>
        </div>
        <div class="flex items-center gap-3">
          <ButtonComponent
            variant="outline"
            @click="markAllAsRead"
            :disabled="unreadCount === 0"
          >
            <UIcon name="ph:checks" class="h-4 w-4" />
            Tandai Semua Dibaca
          </ButtonComponent>
          <ButtonComponent>
            <UIcon name="ph:gear" class="h-4 w-4" />
            Pengaturan
          </ButtonComponent>
        </div>
      </div>
    </div>

    <!-- Notification Statistics -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in notificationStats"
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
          <span class="text-gray-4 ml-2 text-sm">hari ini</span>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="border-neutral-9 rounded-lg border bg-white shadow-sm">
      <div class="border-neutral-9 border-b p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-gray-title text-lg font-semibold">
            Daftar Notifikasi
            <span
              v-if="unreadCount > 0"
              class="ml-2 rounded-full bg-red-100 px-2 py-1 text-sm text-red-800"
            >
              {{ unreadCount }} baru
            </span>
          </h2>
          <div class="flex items-center gap-3">
            <!-- Filter -->
            <select
              class="border-neutral-9 focus:ring-primary-main focus:border-primary-main rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              <option value="kepegawaian">Kepegawaian</option>
              <option value="persuratan">Persuratan</option>
              <option value="agenda">Agenda</option>
              <option value="sistem">Sistem</option>
              <option value="approval">Approval</option>
            </select>
            <!-- Status Filter -->
            <select
              class="border-neutral-9 focus:ring-primary-main focus:border-primary-main rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="unread">Belum Dibaca</option>
              <option value="read">Sudah Dibaca</option>
            </select>
          </div>
        </div>
      </div>

      <div class="divide-neutral-9 divide-y">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="{
            'bg-blue-50': !notification.isRead,
            'bg-white': notification.isRead,
          }"
          class="p-6 transition-colors hover:bg-gray-50"
        >
          <div class="flex items-start gap-4">
            <!-- Notification Icon -->
            <div
              :class="getNotificationColor(notification.type)"
              class="flex-shrink-0 rounded-lg p-2"
            >
              <UIcon
                :name="getNotificationIcon(notification.type)"
                class="h-5 w-5"
              />
            </div>

            <!-- Notification Content -->
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="mb-1 flex items-center gap-2">
                    <h3
                      :class="{
                        'font-bold': !notification.isRead,
                        'font-medium': notification.isRead,
                      }"
                      class="text-gray-title"
                    >
                      {{ notification.title }}
                    </h3>
                    <span
                      :class="getTypeColor(notification.type)"
                      class="rounded-full px-2 py-1 text-xs font-medium"
                    >
                      {{
                        notification.type.charAt(0).toUpperCase() +
                        notification.type.slice(1)
                      }}
                    </span>
                    <span
                      v-if="!notification.isRead"
                      class="bg-primary-main h-2 w-2 rounded-full"
                    ></span>
                  </div>
                  <p class="text-gray-4 mb-2 text-sm">
                    {{ notification.message }}
                  </p>
                  <div class="text-gray-4 flex items-center gap-4 text-xs">
                    <span class="flex items-center gap-1">
                      <UIcon name="ph:tag" class="h-3 w-3" />
                      {{ notification.category }}
                    </span>
                    <span class="flex items-center gap-1">
                      <UIcon name="ph:user" class="h-3 w-3" />
                      {{ notification.sender }}
                    </span>
                    <span class="flex items-center gap-1">
                      <UIcon name="ph:clock" class="h-3 w-3" />
                      {{ formatTimeAgo(notification.timestamp) }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="ml-4 flex items-center gap-2">
                  <button
                    v-if="!notification.isRead"
                    @click="markAsRead(notification.id)"
                    class="text-gray-4 hover:text-primary-main hover:bg-primary-main/10 rounded-lg p-2 transition-colors"
                    title="Tandai sebagai dibaca"
                  >
                    <UIcon name="ph:check" class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteNotification(notification.id)"
                    class="text-gray-4 rounded-lg p-2 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Hapus notifikasi"
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
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="notifications.length === 0" class="p-12 text-center">
        <NuxtImg
          src="/images/empty-image.svg"
          alt="No notifications"
          class="mx-auto mb-4 h-20 w-20 opacity-50"
        />
        <h3 class="text-gray-title mb-2 text-lg font-medium">
          Tidak Ada Notifikasi
        </h3>
        <p class="text-gray-4">Semua notifikasi Anda akan muncul di sini</p>
      </div>

      <!-- Load More -->
      <div
        v-if="notifications.length > 0"
        class="border-neutral-9 border-t p-6 text-center"
      >
        <ButtonComponent variant="outline" class="w-full">
          <UIcon name="ph:arrow-clockwise" class="h-4 w-4" />
          Muat Lebih Banyak
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>
