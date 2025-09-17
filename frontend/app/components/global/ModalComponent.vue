<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md", // sm, md, lg, xl
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
});

const emit = defineEmits(["close", "update:isOpen"]);

const modalRef = ref(null);
const isClosing = ref(false);

const closeModal = () => {
  isClosing.value = true;
  emit("close");
  emit("update:isOpen", false);

  // Reset state setelah animasi selesai
  setTimeout(() => {
    isClosing.value = false;
  }, 300);
};

// Handle escape key
const handleKeydown = (event) => {
  if (event.key === "Escape" && props.isOpen) {
    closeModal();
  }
};

// Add/remove event listener
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.addEventListener("keydown", handleKeydown);
      document.body.style.overflow = "hidden"; // Prevent body scroll
    } else {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    }
  },
);

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});

// Size classes
const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      appear
    >
      <div
        v-if="isOpen"
        class="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
        @click="closeModal"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-300 ease-in"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            ref="modalRef"
            class="relative w-full transform rounded-lg bg-white shadow-xl"
            :class="[
              sizeClasses[props.size],
              { 'scale-95 opacity-0': isClosing },
            ]"
            @click.stop
          >
            <!-- Header dengan tombol close -->
            <div
              class="flex items-center justify-between border-b border-gray-200 px-4 py-3"
            >
              <h3 v-if="title" class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
              <div v-else class="flex-1"></div>
              <button
                class="flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 active:scale-95"
                aria-label="Tutup modal"
                @click="closeModal"
              >
                <svg
                  width="20"
                  height="20"
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
            <div class="p-4">
              <slot></slot>
            </div>

            <!-- Footer (optional) -->
            <div
              v-if="$slots.footer"
              class="border-t border-gray-200 px-4 py-3"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Custom scrollbar untuk content yang overflow */
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
