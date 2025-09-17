<script setup>
import { TEXT } from "@/constants/text";
import { jwtInfo, logout } from "@/composables/useAuth";

const infoAkunMenu = [
  {
    id: "info-personal",
    name: TEXT.infoPersonal,
    icon: "ph:user-circle",
  },
  {
    id: "info-kepegawaian",
    name: TEXT.infoKepegawaian,
    icon: "ph:briefcase",
  },
  {
    id: "info-lainnya",
    name: TEXT.infoLainnya,
    icon: "ph:info",
  },
];

const pengaturanMenu = [
  {
    id: "ubah-kata-sandi",
    name: TEXT.ubahKataSandi,
    icon: "ph:lock",
  },
  {
    id: "pengingat-presensi",
    name: TEXT.pengingatPresensi,
    icon: "ph:bell",
  },
  {
    id: "bahasa",
    name: TEXT.bahasa,
    icon: "ph:globe",
  },
];

const isModalLogoutOpen = ref(false);

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
            <div class="h-20 w-20 overflow-hidden rounded-full bg-gray-300">
              <img
                src="/images/default-avatar.svg"
                alt="Profile Picture"
                class="h-full w-full object-cover"
              />
            </div>

            <div
              class="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-none bg-white shadow-md"
            >
              <UIcon
                name="ph:pencil-simple-fill"
                class="h-3.5 w-3.5 text-gray-900"
              />
            </div>
          </div>

          <h1 class="text-neutral-7 mt-4 text-center text-xl font-semibold">
            {{ jwtInfo.nama }}
          </h1>

          <p class="text-neutral-6 mt-1 text-center text-base font-medium">
            Staff Kepegawaian
          </p>
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between gap-2.5">
            <CardComponent class="max-w-1/2 flex-1">
              <p class="text-neutral-6 text-sm leading-4">
                {{ TEXT.atasanLangsung }}
              </p>
              <p
                class="text-neutral-7 mt-2 truncate overflow-hidden text-base font-semibold text-wrap text-ellipsis whitespace-nowrap"
              >
                Ahmad Hidayat
              </p>
            </CardComponent>
            <CardComponent class="max-w-1/2 flex-1">
              <p class="text-neutral-6 text-sm leading-4">
                {{ TEXT.divisi }}
              </p>
              <p
                class="text-neutral-7 mt-2 truncate overflow-hidden text-base font-semibold text-wrap text-ellipsis whitespace-nowrap"
              >
                Kepegawaian
              </p>
            </CardComponent>
          </div>

          <CardComponent class="pb-0">
            <p class="text-neutral-7 text-base leading-8 font-semibold">
              {{ TEXT.infoAkun }}
            </p>
            <div>
              <div
                v-for="(menu, index) in infoAkunMenu"
                :key="menu.id"
                class="flex h-18 items-center justify-between"
                :class="{
                  'border-neutral-9 border-b':
                    index !== infoAkunMenu.length - 1,
                }"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="bg-neutral-2 flex h-10 w-10 items-center justify-center rounded-full"
                  >
                    <UIcon :name="menu.icon" class="h-6 w-6" />
                  </div>
                  <p class="text-neutral-7 text-sm leading-4">
                    {{ menu.name }}
                  </p>
                </div>
                <UIcon name="ph:caret-right" class="text-neutral-7 h-5 w-5" />
              </div>
            </div>
          </CardComponent>

          <CardComponent class="pb-0">
            <p class="text-neutral-7 text-base leading-8 font-semibold">
              {{ TEXT.pengaturan }}
            </p>
            <div>
              <div
                v-for="(menu, index) in pengaturanMenu"
                :key="menu.id"
                class="flex h-18 items-center justify-between"
                :class="{
                  'border-neutral-9 border-b':
                    index !== pengaturanMenu.length - 1,
                }"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="bg-neutral-2 flex h-10 w-10 items-center justify-center rounded-full"
                  >
                    <UIcon :name="menu.icon" class="h-6 w-6" />
                  </div>
                  <p class="text-neutral-7 text-sm leading-4">
                    {{ menu.name }}
                  </p>
                </div>
                <UIcon name="ph:caret-right" class="text-neutral-7 h-5 w-5" />
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
