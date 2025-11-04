<script setup>
import { TEXT } from "@/constants/text";
import { logout } from "@/composables/useAuth";
import { useTheme } from "@/composables/useTheme";

const { isDark, toggleTheme } = useTheme();
const presensiapiService = useServicePresensiapi();

const pengaturanMenu = computed(() => [
  {
    id: "ubah-kata-sandi",
    name: TEXT.ubahKataSandi,
    icon: "ph:lock",
  },
  // {
  //   id: "pengingat-presensi",
  //   name: TEXT.pengingatPresensi,
  //   icon: "ph:bell",
  // },
  // {
  //   id: "bahasa",
  //   name: TEXT.bahasa,
  //   icon: "ph:globe",
  // },
  {
    id: "tema",
    name: "Tema",
    icon: isDark.value ? "ph:moon" : "ph:sun",
    isToggle: true,
  },
]);

const isModalLogoutOpen = ref(false);

const { data: profileData } = await useAsyncData(
  computed(() => "profile"),
  async () => {
    const response = await presensiapiService.getProfile();
    return response?.data || {};
  },
  {
    default: () => ({}),
    transform: (data) => data || {},
    server: false,
    lazy: true,
  },
);

const infoAkunMenu = computed(() => [
  {
    id: "golongan",
    name: "Golongan",
    value: profileData.value?.golongan,
  },
  {
    id: "nama_kantor",
    name: "Nama Kantor",
    value: profileData.value?.kantor?.nama,
  },
  {
    id: "timezone",
    name: "Timezone",
    value: profileData.value?.kantor?.timezone,
  },
  {
    id: "kelas_jabatan",
    name: "Kelas Jabatan",
    value: profileData.value?.kelasJabatan?.kelas_jabatan,
  },
  {
    id: "tunkin",
    name: "Tunjangan Kinerja",
    value: profileData.value?.kelasJabatan?.tunkin
      ? `Rp. ${new Intl.NumberFormat("id-ID").format(profileData.value?.kelasJabatan?.tunkin)}`
      : "-",
  },
]);

const handleBack = () => {
  navigateTo("/");
};
</script>

<template>
  <div>
    <TemplateDetailTwoComponent title="Akun" @back="handleBack">
      <template #header>
        <div class="relative flex flex-col items-center">
          <div class="relative">
            <!-- <div
              class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-300"
            >
            <img
            src="/images/default-avatar.svg"
            alt="Profile Picture"
            class="h-full w-full object-cover"
            />
          </div> -->
            <UIcon name="ph:user-circle-fill" class="h-20 w-20" />

            <!-- <div
              class="bg-container-main absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-none shadow-md"
            >
              <UIcon
                name="ph:pencil-simple-fill"
                class="text-body-11 h-3.5 w-3.5"
              />
            </div> -->
          </div>

          <h1 class="text-body-2 mt-2 text-center text-xl font-semibold">
            {{ profileData?.gelar_depan }} {{ profileData?.nama }}
            {{ profileData?.gelar_belakang }}
          </h1>

          <p class="text-body-3 mt-1 text-center text-base font-medium">
            {{ profileData?.nip }}
          </p>
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between gap-2.5">
            <CardComponent class="max-w-1/2 flex-1">
              <p class="text-body-3 text-sm leading-4">Pangkat</p>
              <p
                class="text-body-2 mt-2 truncate overflow-hidden text-base font-semibold text-wrap text-ellipsis whitespace-nowrap"
              >
                {{ profileData?.pangkat }}
              </p>
            </CardComponent>
            <CardComponent class="max-w-1/2 flex-1">
              <p class="text-body-3 text-sm leading-4">Jabatan</p>
              <p
                class="text-body-2 mt-2 truncate overflow-hidden text-base font-semibold text-wrap text-ellipsis whitespace-nowrap"
              >
                {{ profileData?.jabatan }}
              </p>
            </CardComponent>
          </div>

          <CardComponent class="pb-0">
            <p class="text-body-2 text-base leading-8 font-semibold">
              {{ TEXT.infoAkun }}
            </p>
            <div>
              <div
                v-for="(menu, index) in infoAkunMenu"
                :key="menu.id"
                class="flex h-18 items-center justify-between"
                :class="{
                  'border-border-main border-b':
                    index !== infoAkunMenu.length - 1,
                }"
              >
                <div class="flex items-center gap-2">
                  <p class="text-body-2 min-w-35 text-sm leading-4">
                    {{ menu.name }}
                  </p>
                  <p class="text-body-2 text-sm leading-4">
                    : {{ menu.value }}
                  </p>
                  <!-- <div
                    class="bg-body-9 dark:bg-container-main flex h-10 w-10 items-center justify-center rounded-full"
                  >
                    <UIcon :name="menu.icon" class="h-6 w-6" />
                  </div>
                  <p class="text-body-2 text-sm leading-4">
                    {{ menu.name }}
                  </p> -->
                </div>
                <!-- <UIcon name="ph:caret-right" class="text-body-2 h-5 w-5" /> -->
              </div>
            </div>
          </CardComponent>

          <CardComponent class="pb-0">
            <p class="text-body-2 text-base leading-8 font-semibold">
              {{ TEXT.pengaturan }}
            </p>
            <div>
              <div
                v-for="(menu, index) in pengaturanMenu"
                :key="menu.id"
                class="flex h-18 items-center justify-between"
                :class="{
                  'border-border-main border-b':
                    index !== pengaturanMenu.length - 1,
                }"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="bg-body-9 dark:bg-container-main flex h-10 w-10 items-center justify-center rounded-full"
                  >
                    <UIcon :name="menu.icon" class="h-6 w-6" />
                  </div>
                  <p class="text-body-2 text-sm leading-4">
                    {{ menu.name }}
                  </p>
                </div>
                <div v-if="menu.isToggle" class="flex items-center">
                  <button
                    class="dark:bg-primary-main relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none"
                    @click="toggleTheme"
                  >
                    <span
                      class="bg-container-main inline-block h-4 w-4 transform rounded-full transition-transform"
                      :class="isDark ? 'translate-x-6' : 'translate-x-1'"
                    />
                  </button>
                </div>
                <UIcon
                  v-else
                  name="ph:caret-right"
                  class="h-5 w-5 text-[var(--text-primary)]"
                />
              </div>
            </div>
          </CardComponent>

          <button
            class="flex h-18 w-full items-center justify-center gap-3"
            @click="isModalLogoutOpen = true"
          >
            <div
              class="bg-red-7/10 flex h-10 w-10 items-center justify-center rounded-full"
            >
              <UIcon name="ph:sign-out" class="text-red-7 h-6 w-6" />
            </div>
            <p class="text-red-7 text-sm leading-4 font-medium">
              {{ TEXT.keluarDariAkun }}
            </p>
          </button>
        </div>
      </template>
    </TemplateDetailTwoComponent>
    <BottomMenuComponent />
    <ModalConfirmComponent
      :is-open="isModalLogoutOpen"
      :title="TEXT.keluarDariAkun"
      :message="TEXT.apakahAndaYakinInginKeluarDariAkun"
      :buttons="[
        {
          variant: 'primary',
          text: TEXT.ya,
        },
        {
          variant: 'secondary',
          text: TEXT.batal,
        },
      ]"
      @confirm="logout"
      @cancel="isModalLogoutOpen = false"
      @close="isModalLogoutOpen = false"
    />
  </div>
</template>
