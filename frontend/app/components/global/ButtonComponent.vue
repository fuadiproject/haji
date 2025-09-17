<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary", // primary , secondary, outline, text-only
  },
});
</script>

<template>
  <button
    class="flex items-center justify-center gap-2 rounded-md px-3.5 py-2.5 text-sm leading-4 font-semibold text-white disabled:opacity-50"
    :class="
      variant === 'outline'
        ? 'border-neutral-6 text-gray-5 border'
        : variant === 'text-only'
          ? '!text-gray-5'
          : variant === 'secondary'
            ? 'bg-secondary-main-2'
            : 'bg-primary-main'
    "
  >
    <slot />
  </button>
</template>
