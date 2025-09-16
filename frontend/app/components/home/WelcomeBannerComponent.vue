<script setup>
import { TEXT } from "~/constants/text";
</script>

<template>
  <div class="relative flex h-full w-full flex-col items-center gap-3">
    <NuxtImg
      src="/images/bg-accent-1.svg"
      alt="Bg Accent 1"
      class="absolute top-0 left-0 w-2/5"
    />
    <NuxtImg
      src="/images/bg-accent-2.svg"
      alt="Bg Accent 2"
      class="absolute right-0 bottom-0 w-2/5"
    />
    <NuxtImg
      src="/images/bg-people-left.svg"
      alt="Bg People Left"
      class="absolute bottom-0 left-0 w-1/4"
    />
    <NuxtImg
      src="/images/bg-people-right.svg"
      alt="Bg People Right"
      class="absolute right-0 bottom-3 w-1/4"
    />
    <NuxtImg src="/images/logo.svg" alt="Logo" class="mt-10 h-10 w-12" />
    <div>
      <h1 class="text-gray-4 text-center text-2xl font-semibold">
        {{ TEXT.welcome }}
      </h1>
      <p class="text-gray-3 max-w-[250px] text-center text-base">
        {{ TEXT.welcomeDescription }}
      </p>
    </div>
  </div>
</template>
