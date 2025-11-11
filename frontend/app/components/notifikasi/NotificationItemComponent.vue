<script setup>
import { formatDate } from "@/utils/date";

const { isDark } = useTheme();

defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["click"]);

// Get initials from sender name
const getInitials = (name) => {
  if (!name) return "NA";
  const words = name.split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Get avatar color based on name
const getAvatarColor = (name) => {
  if (!name) return "bg-body-6";
  const colors = [
    "bg-blue-100 dark:bg-blue-900",
    "bg-green-100 dark:bg-green-900",
    "bg-yellow-100 dark:bg-yellow-900",
    "bg-purple-100 dark:bg-purple-900",
    "bg-pink-100 dark:bg-pink-900",
    "bg-indigo-100 dark:bg-indigo-900",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
</script>

<template>
  <div
    class="border-border-main hover:bg-body-11 mt-2 flex cursor-pointer items-center gap-3 rounded-xl border-b px-4 py-4 transition-colors"
    :class="{
      'bg-primary-5': isDark && !notification.read,
      'bg-primary-2': !isDark && !notification.read,
    }"
    @click="emit('click', notification)"
  >
    <!-- Avatar -->
    <div
      class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
      :class="getAvatarColor(notification.origin)"
    >
      <span class="text-body-2 text-sm font-semibold">
        {{ getInitials(notification.origin) }}
      </span>
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col gap-1">
      <div class="flex items-center justify-between align-middle">
        <h3
          class="max-w-[180px] truncate text-base leading-tight font-semibold"
          :title="notification.title"
          :class="{
            'text-body-6': notification.read,
            'text-body-1': !notification.read,
          }"
        >
          {{ notification.title }}
        </h3>

        <p
          class="mt-1 text-xs"
          :class="{
            'text-body-6': notification.read,
            'text-amber-50': !notification.read,
          }"
        >
          {{ formatDate(notification.created_at) }}
        </p>
      </div>

      <p
        class="line-clamp-2 text-sm leading-tight"
        :class="{
          'text-body-4': notification.read,
          'text-amber-50': !notification.read,
        }"
      >
        {{ notification.message }}
      </p>
      <p
        class="mt-1 text-sm capitalize"
        :class="{
          'text-body-6': notification.read,
          'text-body-1': !notification.read,
        }"
      >
        {{ notification.origin || "Notification" }}
      </p>
    </div>

    <!-- Arrow Icon -->
    <UIcon name="ph:caret-right" class="text-body-4 h-5 w-5 flex-shrink-0" />
  </div>
</template>
