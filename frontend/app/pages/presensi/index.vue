<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { TEXT } from "@/constants/text";

const isEmpty = ref(false);
const maxJamDatangHariIni = ref("08:00");
const maxJamPulangHariIni = ref("17:00");
const jamDatangHariIni = ref("08:30");
const jamPulangHariIni = ref("17:00");
const persenPemotongan = ref("106.0");

const handleBack = () => {
  navigateTo("/");
};

// Real-time clock functionality
const currentTime = ref("");
const currentDate = ref("");
let timeInterval = null;

const updateTime = () => {
  const now = new Date();

  // Format time (HH:MM:SS)
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format date (Hari, DD MMM YYYY)
  const dateString = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  currentTime.value = timeString;
  currentDate.value = dateString;
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<template>
  <TemplateDetailComponent
    variant="not-default"
    :title="TEXT.presensi"
    @back="handleBack"
  >
    <div class="flex w-full flex-col items-center justify-center gap-3">
      <div class="text-neutral-7 text-base font-semibold">
        {{ TEXT.laporanKehadiran }}
      </div>

      <div class="text-primary-main text-[40px] leading-10 font-bold">
        {{ currentTime }}
      </div>

      <div class="text-neutral-6 text-base font-normal">
        {{ currentDate }}
      </div>
    </div>

    <div class="bg-neutral-8 mt-6 flex flex-col gap-4 rounded-xl p-4">
      <div class="flex flex-col items-center gap-2">
        <p class="text-neutral-6 text-sm leading-4 font-medium">
          {{ TEXT.jadwalKerja }}:
        </p>
        <p class="text-neutral-7 text-base font-semibold">
          {{ TEXT.stafKhusus }}: {{ TEXT.stafKhususDescription }}
        </p>
      </div>

      <div
        class="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2"
      >
        <ButtonComponent class="min-w-fit flex-1">
          <NuxtImg
            src="/images/icons/SignInWhite.svg"
            alt="Clock In"
            class="h-5 w-5"
          />
          {{ TEXT.clockIn }}
        </ButtonComponent>

        <ButtonComponent class="min-w-fit flex-1">
          {{ TEXT.clockOut }}
          <NuxtImg
            src="/images/icons/SignOutWhite.svg"
            alt="Clock Out"
            class="h-5 w-5"
          />
        </ButtonComponent>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <UIcon name="ph:info-bold" class="text-neutral-6 h-4 w-4" />
          <p class="text-neutral-6 text-xs leading-4">
            {{ TEXT.infoKehadiran }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="ph:percent-bold" class="text-primary-main h-4 w-4" />
          <p class="text-neutral-6 text-xs leading-4 font-medium">
            {{ TEXT.persenPemotongan }}:
          </p>
          <p class="text-primary-main text-xs font-semibold">
            {{ persenPemotongan }}%
          </p>
        </div>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-2.5">
      <div class="flex items-center justify-between gap-2 p-2">
        <div class="flex items-center gap-2">
          <UIcon
            name="ph:clock-counter-clockwise-bold"
            class="text-neutral-7 h-5 w-5"
          />
          <p class="text-neutral-7 text-base leading-4 font-semibold">
            {{ TEXT.riwayatKehadiran }}
          </p>
        </div>

        <button class="text-primary-main text-sm font-semibold">
          {{ TEXT.lihatSemua }}
        </button>
      </div>

      <div
        v-if="isEmpty"
        class="flex h-50 w-full flex-col items-center justify-center gap-4"
      >
        <NuxtImg
          src="/images/empty-image.svg"
          alt="Empty State"
          class="h-20 w-20"
        />
        <p class="text-neutral-6 text-sm leading-4">
          {{ TEXT.belumAdaDataKehadiranHariIni }}
        </p>
      </div>

      <div v-else>
        <div class="flex flex-col gap-4">
          <div
            class="border-neutral-9 flex items-center justify-between rounded-xl border bg-white p-4"
          >
            <div class="flex items-center gap-3">
              <NuxtImg
                src="/images/icons/SignIn.svg"
                alt="Clock In"
                class="h-6 w-6"
              />
              <p
                class="text-neutral-7 text-sm leading-4 font-semibold tracking-wide"
              >
                {{ TEXT.clockIn }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="bg-neutral-2 flex items-center gap-2 rounded-lg px-3 py-2"
              >
                <UIcon
                  name="ph:clock-bold"
                  class="h-5 w-5 text-gray-600"
                  :class="{
                    'text-red-500': jamDatangHariIni > maxJamDatangHariIni,
                  }"
                />
                <span
                  class="text-sm font-medium text-gray-600"
                  :class="{
                    'text-red-500': jamDatangHariIni > maxJamDatangHariIni,
                  }"
                  >{{ jamDatangHariIni }}</span
                >
              </div>
              <!-- <UIcon
                name="ph:caret-right-bold"
                class="text-neutral-5 h-4 w-4"
              /> -->
            </div>
          </div>

          <div
            class="border-neutral-9 flex items-center justify-between rounded-xl border bg-white p-4"
          >
            <div class="flex items-center gap-3">
              <NuxtImg
                src="/images/icons/SignOut.svg"
                alt="Clock Out"
                class="h-6 w-6"
              />
              <p
                class="text-neutral-7 text-sm leading-4 font-semibold tracking-wide"
              >
                {{ TEXT.clockOut }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="bg-neutral-2 flex items-center gap-2 rounded-lg px-3 py-2"
              >
                <UIcon
                  name="ph:clock-bold"
                  class="h-5 w-5 text-gray-600"
                  :class="{
                    'text-red-500': jamPulangHariIni < maxJamPulangHariIni,
                  }"
                />
                <span
                  class="text-sm font-medium text-gray-600"
                  :class="{
                    'text-red-500': jamPulangHariIni < maxJamPulangHariIni,
                  }"
                  >{{ jamPulangHariIni }}</span
                >
              </div>
              <!-- <UIcon
                name="ph:caret-right-bold"
                class="text-neutral-5 h-4 w-4"
              /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </TemplateDetailComponent>
</template>
