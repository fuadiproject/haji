<script setup>
import { TEXT } from "~/constants/text";

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
      class="fixed inset-0 left-1/2 z-50 flex w-full max-w-[440px] -translate-x-1/2 items-center justify-center bg-linear-to-br from-white via-[#eafffb] to-[#BCFBFF]"
    >
      <div class="flex flex-col items-center justify-center">
        <NuxtImg src="/images/logo.svg" alt="Logo" class="h-30 w-30" />
        <p class="text-gray-4 text-center text-xl font-medium">
          {{ TEXT.title }}
        </p>
      </div>
    </div>
  </Transition>
</template>
