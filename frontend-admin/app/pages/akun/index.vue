<script setup>
import { TEXT } from "@/constants/text";

definePageMeta({
  title: "Akun",
  description: "Kelola profil dan pengaturan akun Anda",
});

const { user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
  await navigateTo("/auth/login");
};

// Mock user data
const userProfile = ref({
  name: "Ahmad Fadli",
  email: "ahmad.fadli@kemenag.go.id",
  nip: "198501012010011001",
  position: "Staf Administrasi",
  department: "Bagian Kepegawaian",
  phone: "+62 812 3456 7890",
  joinDate: "2010-01-01",
  lastLogin: "2024-03-15 14:30:00",
});

const menuItems = [
  {
    icon: "ph:user",
    title: "Edit Profil",
    description: "Ubah informasi profil Anda",
    action: () => {},
  },
  {
    icon: "ph:lock",
    title: "Ubah Password",
    description: "Ganti password akun Anda",
    action: () => {},
  },
  {
    icon: "ph:bell",
    title: "Notifikasi",
    description: "Atur preferensi notifikasi",
    action: () => {},
  },
  {
    icon: "ph:shield-check",
    title: "Keamanan",
    description: "Pengaturan keamanan akun",
    action: () => {},
  },
  {
    icon: "ph:question",
    title: "Bantuan",
    description: "FAQ dan panduan penggunaan",
    action: () => {},
  },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Profile Card -->
    <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center gap-6">
        <div class="relative">
          <NuxtImg
            src="/images/default-avatar.svg"
            alt="Profile Picture"
            class="h-20 w-20 rounded-full"
          />
          <button
            class="bg-primary-main hover:bg-primary-main/80 absolute -right-1 -bottom-1 rounded-full p-1.5 text-white"
          >
            <UIcon name="ph:camera" class="h-3 w-3" />
          </button>
        </div>

        <div class="flex-1">
          <h1 class="text-gray-title text-2xl font-bold">
            {{ userProfile.name }}
          </h1>
          <p class="text-gray-subtitle mb-2">
            {{ userProfile.position }} - {{ userProfile.department }}
          </p>
          <div class="text-gray-4 flex items-center gap-4 text-sm">
            <span class="flex items-center gap-1">
              <UIcon name="ph:identification-card" class="h-4 w-4" />
              NIP: {{ userProfile.nip }}
            </span>
            <span class="flex items-center gap-1">
              <UIcon name="ph:envelope" class="h-4 w-4" />
              {{ userProfile.email }}
            </span>
          </div>
        </div>

        <div class="text-right">
          <ButtonComponent variant="outline" class="mb-2">
            Edit Profil
          </ButtonComponent>
          <p class="text-gray-4 text-xs">
            Bergabung
            {{ new Date(userProfile.joinDate).toLocaleDateString("id-ID") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Account Stats -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">Login Terakhir</p>
            <p class="text-gray-title text-lg font-bold">
              {{ new Date(userProfile.lastLogin).toLocaleDateString("id-ID") }}
            </p>
            <p class="text-gray-4 text-xs">
              {{ new Date(userProfile.lastLogin).toLocaleTimeString("id-ID") }}
            </p>
          </div>
          <div class="bg-primary-main/10 rounded-lg p-3">
            <UIcon name="ph:clock" class="text-primary-main h-6 w-6" />
          </div>
        </div>
      </div>

      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">Masa Kerja</p>
            <p class="text-gray-title text-lg font-bold">
              {{
                Math.floor(
                  (new Date() - new Date(userProfile.joinDate)) /
                    (365 * 24 * 60 * 60 * 1000),
                )
              }}
              Tahun
            </p>
            <p class="text-gray-4 text-xs">Sejak bergabung</p>
          </div>
          <div class="rounded-lg bg-green-100 p-3">
            <UIcon name="ph:calendar-check" class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="border-neutral-9 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-subtitle text-sm font-medium">Status Akun</p>
            <p class="text-lg font-bold text-green-600">Aktif</p>
            <p class="text-gray-4 text-xs">Terverifikasi</p>
          </div>
          <div class="rounded-lg bg-green-100 p-3">
            <UIcon name="ph:shield-check" class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Account Settings -->
    <div class="border-neutral-9 rounded-lg border bg-white shadow-sm">
      <div class="border-neutral-9 border-b p-6">
        <h2 class="text-gray-title text-lg font-semibold">Pengaturan Akun</h2>
      </div>

      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="item in menuItems"
            :key="item.title"
            class="border-neutral-9 hover:border-primary-main hover:bg-primary-main/5 flex cursor-pointer items-center gap-4 rounded-lg border p-3 transition-all"
            @click="item.action"
          >
            <div class="bg-primary-main/10 rounded-lg p-2">
              <UIcon :name="item.icon" class="text-primary-main h-5 w-5" />
            </div>
            <div class="flex-1">
              <h3 class="text-gray-title font-medium">{{ item.title }}</h3>
              <p class="text-gray-4 text-sm">{{ item.description }}</p>
            </div>
            <UIcon name="ph:caret-right" class="text-gray-4 h-4 w-4" />
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="rounded-lg border border-red-200 bg-white shadow-sm">
      <div class="border-b border-red-200 p-6">
        <h2 class="text-lg font-semibold text-red-600">Zona Bahaya</h2>
        <p class="text-gray-4 text-sm">
          Tindakan yang memerlukan perhatian khusus
        </p>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-gray-title font-medium">Logout dari Akun</h3>
            <p class="text-gray-4 text-sm">Keluar dari sesi login saat ini</p>
          </div>
          <ButtonComponent
            variant="outline"
            class="border-red-200 text-red-600 hover:bg-red-50"
            @click="handleLogout"
          >
            <UIcon name="ph:sign-out" class="h-4 w-4" />
            Logout
          </ButtonComponent>
        </div>
      </div>
    </div>
  </div>
</template>
