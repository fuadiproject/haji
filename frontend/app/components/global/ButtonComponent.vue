<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary",
  },
});
</script>

<template>
  <button
    class="flex items-center justify-center gap-2 rounded-md px-3.5 py-2.5 text-sm leading-4 font-semibold text-white disabled:opacity-50"
    :class="
      variant === 'gray'
        ? 'bg-gray-200'
        : variant === 'secondary'
          ? 'bg-secondary-main-2'
          : 'bg-primary-main'
    "
  >
    <slot />
  </button>
</template>
