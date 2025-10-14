<script setup>
import { ref, computed } from "vue";

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  errors: {
    type: Array,
    default: () => [],
  },
});

// Emits
defineEmits(["update:modelValue"]);

// State
const showPassword = ref(false);

// Computed
const isPassword = computed(() => props.type === "password");

const inputType = computed(() => {
  if (isPassword.value) {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base",
  };
  return sizes[props.size];
});

const errorClasses = computed(() => {
  if (props.errors && props.errors.length > 0) {
    return "border-red-500 focus-within:border-red-500";
  }
  return "border-transparent";
});

const textColorClass = computed(() => {
  return "text-neutral-1";
});

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-body-2 text-sm font-semibold">
      {{ label }}
    </label>
    <div
      class="bg-body-10 flex items-center rounded-xl border"
      :class="[sizeClasses, errorClasses, 'gap-2 pt-2 pr-3 pb-2 pl-3']"
    >
      <!-- Left Slot -->
      <div v-if="$slots.left" class="text-neutral-5 flex flex-shrink-0">
        <slot name="left" />
      </div>

      <!-- Input Field -->
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        class="placeholder:text-neutral-5 flex-1 bg-transparent text-sm leading-4 focus:outline-none"
        :class="textColorClass"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <!-- Right Slot or Password Toggle -->
      <div
        v-if="$slots.right || isPassword"
        class="text-neutral-5 flex flex-shrink-0"
      >
        <button
          v-if="isPassword"
          type="button"
          class="focus:outline-none"
          @click="togglePasswordVisibility"
        >
          <component
            :is="showPassword ? 'EyeSlashIcon' : 'EyeIcon'"
            class="h-4 w-4"
          />
        </button>
        <slot v-else-if="$slots.right" name="right" />
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="errors && errors.length > 0" class="flex flex-col gap-1">
      <p
        v-for="(error, index) in errors"
        :key="index"
        class="text-xs text-red-500"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>
