<script setup>
const emit = defineEmits(["click"]);
</script>

<template>
  <button
    class="bg-primary-main fixed right-5 bottom-5 flex items-center justify-center rounded-full p-3 text-white"
    @click="emit('click')"
  >
    <UIcon name="ph:plus" class="h-6 w-6 text-white" />
  </button>
</template>
