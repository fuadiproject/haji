<script setup>
import { TEXT } from "@/constants/text";

const { login } = useAuth();

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = "";
  isLoading.value = true;

  const result = login(username.value, password.value);

  if (result.success) {
    await navigateTo("/");
  } else {
    error.value = result.error;
  }

  isLoading.value = false;
};

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="mx-auto w-full max-w-md">
    <div class="rounded-2xl bg-white p-8 shadow-lg">
      <div class="mb-8 flex flex-col items-center justify-center">
        <img src="/images/logo.png" alt="Logo" class="mb-4 h-20 w-20" />
        <h1 class="text-gray-title mb-2 text-2xl font-bold">
          Admin Dashboard Presensi
        </h1>

        <p class="text-gray-4 text-center text-lg font-medium">
          {{ TEXT.title }}
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ error }}
        </div>

        <div>
          <label class="text-gray-title mb-1 block text-sm font-medium">
            Username
          </label>
          <UInput
            v-model="username"
            placeholder="Masukkan username"
            size="lg"
            class="w-full"
          />
        </div>

        <div>
          <label class="text-gray-title mb-1 block text-sm font-medium">
            Password
          </label>
          <UInput
            v-model="password"
            type="password"
            placeholder="Masukkan password"
            size="lg"
            class="w-full"
          />
        </div>

        <UButton
          type="submit"
          class="w-full justify-center"
          size="lg"
          :loading="isLoading"
        >
          Login
        </UButton>
      </form>   
    </div>
  </div>
</template>
