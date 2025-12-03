<script setup>
import { TEXT } from "@/constants/text";

const isLoading = ref(true);
const isVisible = ref(true);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = false;
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }, 500);
});
</script>

<template>
  <Transition
    name="fade"
    enter-active-class="transition-opacity duration-500 ease-out"
    leave-active-class="transition-opacity duration-500 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoading && isVisible"
      class="via-primary-3 to-primary-4 fixed inset-0 left-1/2 z-50 flex w-full max-w-5xl -translate-x-1/2 items-center justify-center bg-linear-to-br from-white dark:from-black"
    >
      <div class="flex flex-col items-center justify-center">
        <NuxtImg src="/images/logo.png" alt="Logo" class="mb-3 h-30 w-30" />
        <p class="text-body-4 text-center text-xl font-medium">
          {{ TEXT.title }}
        </p>
      </div>
    </div>
  </Transition>
</template>
