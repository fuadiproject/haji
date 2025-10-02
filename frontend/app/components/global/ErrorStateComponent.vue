<script setup>
import { TEXT } from "@/constants/text";

defineProps({
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["refresh"]);
</script>

<template>
  <div class="flex h-32 items-center justify-center">
    <div class="flex flex-col items-center gap-2">
      <UIcon name="ph:warning-bold" class="h-6 w-6 text-red-500" />
      <p class="text-neutral-6 text-center text-sm">{{ error }}</p>
      <button
        class="text-primary-main text-sm font-semibold"
        @click="emit('refresh')"
      >
        {{ TEXT.cobaLagi }}
      </button>
    </div>
  </div>
</template>
