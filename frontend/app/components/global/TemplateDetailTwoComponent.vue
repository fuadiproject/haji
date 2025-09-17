<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  isFullWidth: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["back"]);
</script>

<template>
  <Transition name="fade" mode="out-in" appear>
    <div
      class="mx-auto"
      :class="isFullWidth ? 'w-full max-w-5xl' : 'w-full max-w-[1027px]'"
    >
      <div
        class="relative h-[260px] w-full bg-gradient-to-l from-[#FDFFFF42] to-[#C6F0F395]"
      >
        <div class="relative flex h-full w-full flex-col items-center gap-3">
          <NuxtImg
            src="/images/bg-accent-1.svg"
            alt="Bg Accent 1"
            class="absolute top-0 left-0 w-2/5"
          />
          <NuxtImg
            src="/images/bg-accent-2.svg"
            alt="Bg Accent 2"
            class="absolute right-0 bottom-0 w-2/5"
          />

          <div class="mt-6 flex w-full items-center justify-between pr-4 pl-6">
            <div class="flex items-center gap-3">
              <UIcon
                name="ph:arrow-left-bold"
                class="h-4 w-4"
                @click="emit('back')"
              />
              <h1 class="text-gray-title text-xl font-semibold">{{ title }}</h1>
            </div>
          </div>

          <slot name="header" />
        </div>
      </div>

      <main
        class="relative -mt-6 min-h-[calc(100vh-77px)] w-full rounded-t-3xl bg-white px-4 py-6 pb-20 shadow-[0px_3px_14px_0px_#070D311A]"
      >
        <slot name="content" />
      </main>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
