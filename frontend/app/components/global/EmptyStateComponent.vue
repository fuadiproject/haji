<script setup>
defineProps({
  text: {
    type: String,
    default: "",
  },
  imageClass: {
    type: String,
    default: "h-12 w-12",
  },
});
</script>

<template>
  <div class="flex h-32 items-center justify-center">
    <div class="flex flex-col items-center gap-2">
      <NuxtImg
        src="/images/empty-image.svg"
        alt="Empty State"
        :class="imageClass"
      />
      <p class="text-neutral-6 text-center text-sm">
        {{ text }}
      </p>
    </div>
  </div>
</template>
