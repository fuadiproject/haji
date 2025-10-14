<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary", // primary , secondary, outline, text-only, primary-outline
  },
  size: {
    type: String,
    default: "md", // sm, md, lg
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const sizeClasses = computed(() => {
  return {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3.5 py-2.5 text-sm",
    lg: "px-4.5 py-3.5 text-base",
  };
});

const loadingClasses = computed(() => {
  return {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };
});
</script>

<template>
  <button
    class="flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-4 font-semibold disabled:opacity-50"
    :disabled="loading"
    :class="[
      sizeClasses[size],
      variant === 'outline'
        ? 'border-border-main text-body-3 border'
        : variant === 'primary-outline'
          ? 'border-primary-main text-primary-main border'
          : variant === 'text-only'
            ? '!text-body-8'
            : variant === 'secondary'
              ? 'bg-primary-2 text-white'
              : 'bg-primary-main text-white',
    ]"
  >
    <UIcon
      v-if="loading"
      name="lucide:loader-circle"
      class="animate-spin"
      :class="loadingClasses[size]"
    />
    <slot />
  </button>
</template>
