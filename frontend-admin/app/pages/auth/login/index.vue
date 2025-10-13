<script setup>
import { TEXT } from "@/constants/text";
const { login } = useAuth();

definePageMeta({
  layout: "auth",
});

const loginForm = ref({
  email: "",
  password: "",
});

const onLogin = () => {
  login(loginForm.value);
};
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

      <div class="mb-5 flex flex-col gap-3">
        <UInput
          v-model="loginForm.email"
          type="email"
          placeholder="Email"
          label="Email"
          error="Email wajib diisi"
          size="lg"
        />
        <UInput
          v-model="loginForm.password"
          class="mt-2"
          type="password"
          placeholder="Password"
          label="Password"
          error="Password wajib diisi"
          size="lg"
        />
      </div>

      <div class="space-y-4">
        <ButtonComponent
          class="w-full justify-center"
          @click="onLogin(loginForm)"
        >
          Login
        </ButtonComponent>
      </div>

      <div class="mt-6 text-center">
        <p class="text-gray-4 text-sm">
          Sistem Dashboard Kementerian Haji dan Umrah
        </p>
      </div>
    </div>
  </div>
</template>
