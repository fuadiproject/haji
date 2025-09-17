<script setup>
import { TEXT } from "@/constants/text";
const { login } = useAuth();
</script>

<template>
  <div
    class="fixed inset-0 left-1/2 z-50 flex h-full w-full max-w-5xl -translate-x-1/2 flex-col items-center justify-center gap-8 bg-linear-to-br from-white via-[#eafffb] to-[#BCFBFF]"
  >
    <div class="flex flex-col items-center justify-center">
      <NuxtImg src="/images/logo.svg" alt="Logo" class="h-30 w-30" />
      <p class="text-gray-4 text-center text-xl font-medium">
        {{ TEXT.title }}
      </p>
    </div>
    <ButtonComponent @click="login"> {{ TEXT.loginSSO }} </ButtonComponent>
  </div>
</template>
