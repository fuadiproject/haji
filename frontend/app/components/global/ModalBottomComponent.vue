<script setup>
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  isFullHeight: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "update:isOpen"]);

const modalRef = ref(null);
const isClosing = ref(false);
const touchStartY = ref(0);
const touchCurrentY = ref(0);
const isDragging = ref(false);

const closeModal = () => {
  isClosing.value = true;
  emit("close");
  emit("update:isOpen", false);

  // Reset state setelah animasi selesai
  setTimeout(() => {
    isClosing.value = false;
  }, 300);
};

const handleTouchStart = (e) => {
  if (e.target.closest(".modal-content")) return;

  touchStartY.value = e.touches[0].clientY;
  isDragging.value = true;
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;

  touchCurrentY.value = e.touches[0].clientY;
  const deltaY = touchCurrentY.value - touchStartY.value;

  // Hanya izinkan drag ke bawah
  if (deltaY > 0) {
    const translateY = Math.min(deltaY, 400); // Batasi maksimal 100px
    modalRef.value.style.transform = `translateY(${translateY}px)`;
    modalRef.value.style.transition = "none";
  }
};

const handleTouchEnd = (_e) => {
  if (!isDragging.value) return;

  const deltaY = touchCurrentY.value - touchStartY.value;
  const threshold = 50; // Minimum drag distance untuk close

  if (deltaY > threshold) {
    closeModal();
  } else {
    // Reset position
    modalRef.value.style.transform = "translateY(0)";
    modalRef.value.style.transition = "transform 0.3s ease-out";
  }

  isDragging.value = false;
  touchStartY.value = 0;
  touchCurrentY.value = 0;
};

// Reset transform saat modal dibuka
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && modalRef.value) {
      nextTick(() => {
        modalRef.value.style.transform = "translateY(0)";
        modalRef.value.style.transition = "transform 0.3s ease-out";
      });
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      appear
    >
      <div
        v-if="isOpen"
        class="bg-opacity-50 fixed inset-0 z-50 flex items-end justify-center"
        @click="closeModal"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div
          ref="modalRef"
          class="relative flex h-[75vh] max-h-[75vh] w-full max-w-[1027px] transform flex-col rounded-t-2xl bg-white shadow-2xl transition-transform duration-150 ease-out sm:h-[75vh] sm:max-h-[75vh] md:h-[85vh] md:max-h-[85vh]"
          :class="{
            'translate-y-full': isClosing,
            '!h-[95vh] !max-h-[95vh]': isFullHeight,
          }"
          @click.stop
        >
          <!-- Handle bar untuk indikator drag -->
          <div
            class="flex cursor-grab justify-center py-3 pb-2 select-none active:cursor-grabbing"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <div class="h-1 w-10 rounded-full bg-gray-300"></div>
          </div>

          <!-- Header dengan tombol close -->
          <div
            class="flex items-center justify-between border-b border-gray-100 px-4 pb-2 sm:px-5 sm:pb-2.5"
          >
            <p class="text-gray-5 text-base font-medium">{{ title }}</p>
            <button
              class="flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95"
              aria-label="Tutup modal"
              @click="closeModal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <!-- Content area -->
          <div
            class="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 flex-1 overflow-y-auto p-4 sm:p-5"
          >
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Custom scrollbar untuk browser yang tidak support Tailwind scrollbar utilities */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 2px;
}

.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
}
</style>
