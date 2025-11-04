<script setup>
import NotificationItemComponent from "./NotificationItemComponent.vue";
import { ref, onUnmounted, watch, nextTick } from "vue";

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasMorePages: {
    type: Boolean,
    default: true,
  },
  isLoadingMore: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["notificationClick", "markAllRead", "loadMore"]);

const loadMoreTrigger = ref(null);
let observer = null;

const handleNotificationClick = (notification) => {
  emit("notificationClick", notification);
};

const handleMarkAllRead = () => {
  emit("markAllRead");
};

const handleLoadMore = () => {
  if (props.hasMorePages && !props.isLoadingMore) {
    emit("loadMore");
  }
};

const setupObserver = async () => {
  // Wait for DOM to be fully updated
  await nextTick();

  console.log(
    "🔍 Attempting to setup observer, loadMoreTrigger:",
    loadMoreTrigger.value,
  );

  // Clean up existing observer if any
  if (observer) {
    if (loadMoreTrigger.value) {
      observer.unobserve(loadMoreTrigger.value);
    }
    observer.disconnect();
    observer = null;
  }

  // Set up observer only if the element exists
  if (loadMoreTrigger.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          props.hasMorePages &&
          !props.isLoadingMore
        ) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    observer.observe(loadMoreTrigger.value);
  }
};

// Watch for when hasMorePages becomes true and the element gets rendered
watch(
  () => props.hasMorePages,
  async (newValue) => {
    console.log("📊 hasMorePages changed to:", newValue);
    if (newValue) {
      setupObserver();
    }
  },
  { immediate: true }, // Run immediately on mount as well
);

onUnmounted(() => {
  if (observer) {
    if (loadMoreTrigger.value) {
      observer.unobserve(loadMoreTrigger.value);
    }
    observer.disconnect();
  }
});
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Recent header with Mark all read -->
    <div class="flex items-center justify-between px-4 py-4">
      <h2 class="text-body-2 text-base font-semibold">Recent</h2>
      <button
        class="text-primary-main hover:text-primary-2 text-sm font-medium transition-colors"
        @click="handleMarkAllRead"
      >
        Mark all read
      </button>
    </div>

    <!-- Notifications List -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-12"
      >
        <UIcon
          name="lucide:loader-circle"
          class="text-primary-main h-8 w-8 animate-spin"
        />
        <p class="text-body-4 mt-4 text-sm">Loading notifications...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="notifications.length === 0"
        class="flex flex-col items-center justify-center py-12"
      >
        <UIcon name="ph:bell-slash" class="text-body-6 h-16 w-16" />
        <p class="text-body-4 mt-4 text-sm">No notifications yet</p>
      </div>

      <!-- Notification Items -->
      <div v-else>
        <NotificationItemComponent
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @click="handleNotificationClick"
        />

        <!-- Load More Trigger (for Intersection Observer) -->
        <div
          v-if="hasMorePages"
          ref="loadMoreTrigger"
          class="flex items-center justify-center py-10"
        >
          <UIcon
            v-if="isLoadingMore"
            name="lucide:loader-circle"
            class="text-primary-main h-6 w-6 animate-spin"
          />
        </div>

        <!-- End of List Message -->
        <div
          v-if="!hasMorePages && notifications.length > 0"
          class="text-body-6 flex items-center justify-center py-6 text-sm"
        >
          No more notifications
        </div>
      </div>
    </div>
  </div>
</template>
