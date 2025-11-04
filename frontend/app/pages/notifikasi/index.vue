<script setup>
import NotificationListComponent from "@/components/notifikasi/NotificationListComponent.vue";
import { formatDate } from "@/utils/date";

const selectedNotification = ref({
  title: "",
  message: "",
  createdAt: "",
  origin: "",
  data: {},
});

const isModalDetailOpen = ref(false);

const { getNotifications, readNotification } = useServiceSuperappApi();

// Pagination state
const currentPage = ref(1);
const notifications = ref([]);
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPrevPage: false,
});
const isLoading = ref(false);
const isLoadingMore = ref(false);

// Initial load
const loadNotifications = async (page = 1, append = false) => {
  try {
    if (append) {
      isLoadingMore.value = true;
    } else {
      isLoading.value = true;
    }

    const response = await getNotifications(page, 10);

    if (response && response.data) {
      if (append) {
        // Append new notifications to existing list
        notifications.value = [...notifications.value, ...response.data];
      } else {
        // Replace notifications (initial load)
        notifications.value = response.data;
      }

      // Update pagination info
      if (response.pagination) {
        pagination.value = response.pagination;
        currentPage.value = response.pagination.currentPage;
      }
    }
  } catch (error) {
    console.error("Error loading notifications:", error);
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

// Load more notifications
const handleLoadMore = async () => {
  if (pagination.value.hasNextPage && !isLoadingMore.value) {
    const nextPage = currentPage.value + 1;
    await loadNotifications(nextPage, true);
  }
};

const handleNotificationClick = async (notification) => {
  selectedNotification.value = notification;
  isModalDetailOpen.value = true;
  await readNotification({
    notificationId: notification.id,
  });

  // Update the local notification's read status
  const notificationIndex = notifications.value.findIndex(
    (n) => n.id === notification.id,
  );

  if (notificationIndex !== -1) {
    notifications.value[notificationIndex].read = true;
  }
};

const handleCloseModal = () => {
  isModalDetailOpen.value = false;
  selectedNotification.value = null;
};

const handleBack = () => {
  navigateTo("/");
};

const handleMarkAllRead = () => {
  console.log("mark all read");
};

onMounted(() => {
  loadNotifications(1, false);
});
</script>

<template>
  <div>
    <TemplateDetailComponent
      variant="default"
      title="Notifikasi"
      @back="handleBack"
    >
      <NotificationListComponent
        :loading="isLoading"
        :has-more-pages="pagination.hasNextPage"
        :is-loading-more="isLoadingMore"
        :notifications="notifications"
        @notification-click="handleNotificationClick"
        @load-more="handleLoadMore"
        @mark-all-read="handleMarkAllRead"
      />
    </TemplateDetailComponent>

    <!-- Notification Detail Modal -->
    <ModalComponent
      :is-open="isModalDetailOpen"
      :title="`Detail Notifikasi`"
      size="lg"
      @close="handleCloseModal"
    >
      <div v-if="selectedNotification" class="flex flex-col gap-4">
        <div class="border-border-main border-b pb-2">
          <h4 class="text-body-2 text-lg font-semibold">
            {{ selectedNotification.title }}
          </h4>
          <p class="text-body-6 text-xs">
            Tanggal: {{ formatDate(selectedNotification.created_at) }}
          </p>
          <p class="text-body-6 mt-1 text-xs">
            Oleh: {{ selectedNotification.origin || "General Notification" }}
          </p>
        </div>
        <div class="text-body-3 text-md leading-relaxed whitespace-pre-wrap">
          {{ selectedNotification.message }}
        </div>
        <div v-if="selectedNotification.data" class="mt-2 flex justify-end">
          <ButtonComponent variant="primary" @click="handleCloseModal">
            Close
          </ButtonComponent>
        </div>
      </div>
    </ModalComponent>

    <BottomMenuComponent />
  </div>
</template>
