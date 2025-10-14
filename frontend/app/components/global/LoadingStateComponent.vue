<script setup>
import { TEXT } from "@/constants/text";
</script>

<template>
  <div class="flex h-32 items-center justify-center">
    <div class="flex flex-col items-center gap-2">
      <UIcon
        name="ph:spinner-bold"
        class="text-primary-main h-6 w-6 animate-spin"
      />
      <p class="text-body-3 text-sm">{{ TEXT.memuatData }}</p>
    </div>
  </div>
</template>
