<script setup>
import { TEXT } from "@/constants/text";
const { login } = useAuth();
</script>

<template>
  <div
    class="fixed inset-0 left-1/2 z-50 flex h-full w-full max-w-5xl -translate-x-1/2 flex-col items-center justify-center gap-8 bg-linear-to-br from-white via-[#fff5de] to-[#71510b] dark:from-black dark:via-[#0E0E14] dark:to-[#0E0E14]"
  >
    <!-- Background Accent Decorations -->
    <NuxtImg
      src="/images/bg-accent-1.svg"
      alt="Bg Accent 1"
      class="absolute top-0 left-0 w-2/5 opacity-60 dark:hidden"
    />
    <NuxtImg
      src="/images/bg-accent-2.svg"
      alt="Bg Accent 2"
      class="absolute right-0 bottom-0 w-2/5 opacity-60 dark:hidden"
    />
    <NuxtImg
      src="/images/bg-accent-1-dark.svg"
      alt="Bg Accent 1 Dark"
      class="absolute top-0 left-0 hidden w-2/5 opacity-40 dark:block"
    />
    <NuxtImg
      src="/images/bg-accent-2.svg"
      alt="Bg Accent 2 Dark"
      class="absolute right-0 bottom-0 hidden w-2/5 opacity-40 dark:block"
    />

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-center">
      <NuxtImg src="/images/logo.png" alt="Logo" class="mb-3 h-30 w-30" />
      <p class="text-body-4 text-center text-xl font-medium">
        {{ TEXT.title }}
      </p>
    </div>
    <ButtonComponent class="relative z-10" @click="login">
      {{ TEXT.loginSSO }}
    </ButtonComponent>
  </div>
</template>
