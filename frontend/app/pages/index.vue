<script setup>
import { TEXT } from "~/constants/text";
import WelcomeBannerComponent from "@/components/home/WelcomeBannerComponent.vue";
import BannerSliderComponent from "@/components/home/BannerSliderComponent.vue";

const mainMenu = [
  {
    id: "Kepegawaian",
    name: TEXT.kepegawaian,
    icon: "Users",
    to: "/kepegawaian",
  },
  {
    id: "Presensi",
    name: TEXT.presensi,
    icon: "ClockUser",
    to: "/presensi",
  },
  {
    id: "Persuratan",
    name: TEXT.persuratan,
    icon: "EnvelopeSimple",
    to: "/persuratan",
  },
  {
    id: "SOP",
    name: TEXT.sop,
    icon: "Files",
    to: "/sop",
  },
  {
    id: "Laporan",
    name: "Laporan",
    icon: "ChartBar",
    to: "https://www.google.com",
  },
  {
    id: "Laporan",
    name: "Laporan",
    icon: "ChartBar",
    to: "https://www.google.com",
  },
  {
    id: "Laporan",
    name: "Laporan",
    icon: "ChartBar",
    to: "https://www.google.com",
  },
  {
    id: "Laporan",
    name: "Laporan",
    icon: "ChartBar",
    to: "https://www.google.com",
  },
];

const currentBannerIndex = ref(0);

const bannerList = [
  {
    id: "welcome-banner",
    component: WelcomeBannerComponent,
  },
  {
    id: "banner-2",
    component: WelcomeBannerComponent,
  },
  {
    id: "banner-3",
    component: WelcomeBannerComponent,
  },
];

const goToBanner = (index) => {
  currentBannerIndex.value = index;
};

const isModalOpen = ref(false);
</script>

<template>
  <ClientOnly>
    <div
      class="mx-auto h-screen max-w-[440px] overflow-y-auto bg-gradient-to-l from-[#FDFFFF42] to-[#C6F0F395]"
    >
      <!-- Banner Slider -->
      <div class="relative h-[260px] w-full">
        <BannerSliderComponent
          v-model:current-index="currentBannerIndex"
          :banners="bannerList"
          :auto-play="true"
          :interval="5000"
        />

        <!-- Indicator Dots -->
        <div
          v-if="bannerList.length > 1"
          class="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2"
        >
          <button
            v-for="(banner, index) in bannerList"
            :key="`indicator-${banner.id}`"
            class="transition-all duration-300"
            :class="{
              'bg-primary-main h-2 w-8 rounded-full':
                index === currentBannerIndex,
              'bg-primary-main/50 h-2 w-2 rounded-full':
                index !== currentBannerIndex,
            }"
            @click="goToBanner(index)"
          />
        </div>
      </div>

      <!-- Reminder (Presensi) -->
      <div
        class="relative -mt-7.5 h-[calc(100vh-230px)] w-full rounded-t-3xl bg-white px-4 py-6"
      >
        <div class="relative rounded-2xl bg-[#F6F6F6] px-4 py-6">
          <NuxtImg
            src="/images/reminder-image.svg"
            alt="Reminder Image"
            class="absolute -top-4 right-1 h-[75px] w-[78px]"
          />
          <p class="text-gray-5 text-base leading-4 font-medium">
            Halo, Abdurrahman!
          </p>
          <p class="text-gray-4 mt-2.5 text-sm leading-4">
            {{ TEXT.reminderDescription }}
          </p>
          <div class="mt-4 flex w-full items-center justify-between gap-4">
            <ButtonComponent class="flex-1">
              <NuxtImg
                src="/images/icons/SignInWhite.svg"
                alt="Clock In"
                class="h-5 w-5"
              />
              {{ TEXT.clockIn }}
            </ButtonComponent>

            <ButtonComponent class="flex-1">
              {{ TEXT.clockOut }}
              <NuxtImg
                src="/images/icons/SignOutWhite.svg"
                alt="Clock Out"
                class="h-5 w-5"
              />
            </ButtonComponent>
          </div>
        </div>

        <!-- Main Menu -->
        <div class="mt-4.5 grid grid-cols-3 gap-4">
          <NuxtLink
            v-for="menu in mainMenu.slice(0, 5)"
            :key="menu.id"
            class="flex h-20 w-full flex-col items-center justify-center gap-2 rounded-xl border border-[#E9E9E9] bg-white"
            :to="menu.to"
          >
            <NuxtImg
              :src="`/images/icons/${menu.icon}.svg`"
              alt="Menu Icon"
              class="h-7 w-7"
            />
            <span class="text-gray-4 text-center text-xs">{{ menu.name }}</span>
          </NuxtLink>
          <div
            class="flex h-20 w-full flex-col items-center justify-center gap-2 rounded-xl border border-[#E9E9E9] bg-white"
            @click="isModalOpen = true"
          >
            <NuxtImg
              src="/images/icons/SquaresFour.svg"
              alt="Lainnya"
              class="h-7 w-7"
            />
            <span class="text-gray-4 text-center text-xs">{{
              TEXT.lainnya
            }}</span>
          </div>
        </div>
      </div>

      <ModalBottomComponent
        :title="TEXT.semuaMenu"
        :is-open="isModalOpen"
        @close="isModalOpen = false"
      >
        <div class="mt-4.5 grid grid-cols-3 gap-4">
          <NuxtLink
            v-for="menu in mainMenu"
            :key="menu.id"
            class="flex h-20 w-full flex-col items-center justify-center gap-2 rounded-xl border border-[#E9E9E9] bg-white"
            :to="menu.to"
          >
            <NuxtImg
              :src="`/images/icons/${menu.icon}.svg`"
              alt="Menu Icon"
              class="h-7 w-7"
            />
            <span class="text-gray-4 text-center text-xs">{{ menu.name }}</span>
          </NuxtLink>
        </div>
      </ModalBottomComponent>

      <!-- Bottom Menu -->
      <BottomMenuComponent />
    </div>
  </ClientOnly>
</template>
