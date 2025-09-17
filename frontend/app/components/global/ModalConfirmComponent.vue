<script setup>
import { computed } from "vue";
import ModalComponent from "@/components/global/ModalComponent.vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Konfirmasi",
  },
  message: {
    type: String,
    default: "Apakah Anda yakin?",
  },
  buttons: {
    type: Array,
    required: true,
    validator: (buttons) => {
      // Validasi: minimal 1 button, maksimal 2 buttons
      if (!Array.isArray(buttons) || buttons.length < 1 || buttons.length > 2) {
        return false;
      }

      // Validasi: setiap button harus memiliki variant dan text
      return buttons.every(
        (button) =>
          button &&
          typeof button === "object" &&
          typeof button.variant === "string" &&
          typeof button.text === "string",
      );
    },
  },
});

const emit = defineEmits([
  "close",
  "update:isOpen",
  "buttonClick",
  "confirm",
  "cancel",
]);

// Computed untuk memastikan buttons selalu ada
const buttons = computed(() => {
  if (!props.buttons || props.buttons.length === 0) {
    return [{ variant: "primary", text: "OK" }];
  }
  return props.buttons;
});

const handleClose = () => {
  emit("close");
  emit("update:isOpen", false);
};

const handleButtonClick = (button, index) => {
  // Emit event umum
  emit("buttonClick", { button, index });

  // Emit event spesifik berdasarkan posisi button
  if (index === 0) {
    // Button pertama biasanya untuk konfirmasi/OK
    emit("confirm", button);
  } else if (index === 1) {
    // Button kedua biasanya untuk cancel/Batal
    emit("cancel", button);
  }

  // Auto close modal setelah button click (kecuali jika ada preventClose: true)
  if (!button.preventClose) {
    handleClose();
  }
};
</script>

<template>
  <ModalComponent
    :is-open="isOpen"
    :title="title"
    size="md"
    @close="handleClose"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <!-- Content area -->
    <div class="py-2">
      <slot>
        <p class="text-center text-gray-600">
          {{ message }}
        </p>
      </slot>
    </div>

    <!-- Footer dengan buttons -->
    <template #footer>
      <div class="flex justify-between gap-3">
        <ButtonComponent
          v-for="(button, index) in buttons"
          :key="index"
          :variant="button.variant"
          class="flex-1"
          @click="handleButtonClick(button, index)"
        >
          {{ button.text }}
        </ButtonComponent>
      </div>
    </template>
  </ModalComponent>
</template>
