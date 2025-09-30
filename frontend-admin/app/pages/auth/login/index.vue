<script setup>
import { TEXT } from "@/constants/text";
const { login } = useAuth();

definePageMeta({
  layout: "auth",
});
</script>

<template>

  <div class="mx-auto w-full max-w-md">

    <div class="rounded-2xl bg-white p-8 shadow-lg">

      <div class="mb-8 flex flex-col items-center justify-center">
         <NuxtImg src="/images/logo.svg" alt="Logo" class="mb-4 h-20 w-20" />
        <h1 class="text-gray-title mb-2 text-2xl font-bold">Admin Dashboard</h1>

        <p class="text-gray-4 text-center text-lg font-medium">
           {{ TEXT.title }}
        </p>

      </div>

      <div class="space-y-4">
         <ButtonComponent class="w-full justify-center" @click="login"
          > {{ TEXT.loginSSO }} </ButtonComponent
        >
      </div>

      <div class="mt-6 text-center">

        <p class="text-gray-4 text-sm">
           Sistem Dashboard Kementerian Haji dan Umrah
        </p>

      </div>

    </div>

  </div>

</template>

