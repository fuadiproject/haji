<script setup>
const props = defineProps({
  // Current page number
  currentPage: {
    type: Number,
    default: 1
  },
  // Items per page
  itemsPerPage: {
    type: Number,
    default: 10
  },
  // Total number of items
  totalItems: {
    type: Number,
    required: true
  },
  // Items per page options
  itemsPerPageOptions: {
    type: Array,
    default: () => [
      { label: '5 per halaman', value: 5 },
      { label: '10 per halaman', value: 10 },
      { label: '20 per halaman', value: 20 },
      { label: '50 per halaman', value: 50 }
    ]
  },
  // Show items per page selector
  showItemsPerPage: {
    type: Boolean,
    default: true
  },
  // Show pagination info text
  showPaginationInfo: {
    type: Boolean,
    default: true
  },
  // Maximum number of page buttons to show
  maxPages: {
    type: Number,
    default: 7
  },
  // Custom class for wrapper
  wrapperClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:current-page', 'update:items-per-page', 'page-change', 'items-per-page-change']);

// Local reactive values for v-model
const localCurrentPage = computed({
  get: () => props.currentPage,
  set: (value) => {
    emit('update:current-page', value);
    emit('page-change', value);
  }
});

const localItemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (value) => {
    emit('update:items-per-page', value);
    emit('items-per-page-change', value);
  }
});

// Computed properties for pagination info
const startItem = computed(() => {
  return ((props.currentPage - 1) * props.itemsPerPage) + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems);
});

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

</script>

<template>
  <div 
    v-if="totalItems > 0" 
    :class="[
      'border-neutral-9 rounded-lg border bg-white p-4 shadow-sm',
      wrapperClass
    ]"
  >
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Items per page selector -->
      <div v-if="showItemsPerPage" class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Tampilkan:</span>
        <USelect
          :model-value="localItemsPerPage"
          :items="itemsPerPageOptions"
          option-attribute="label"
          value-attribute="value"
          size="sm"
          class="w-32 cursor-pointer"
          @update:model-value="(value) => localItemsPerPage = value"
        />
      </div>

      <!-- Spacer when items per page is hidden -->
      <div v-else></div>

      <!-- Pagination info and controls -->
      <div class="flex items-center gap-4">
        <!-- Pagination info -->
        <div v-if="showPaginationInfo" class="text-sm text-gray-600">
          Menampilkan {{ startItem }} - {{ endItem }} dari {{ totalItems }} data
        </div>

        <!-- Pagination component -->
        <UPagination          
          v-if="totalPages > 1"
          :page="localCurrentPage"
          :total="totalItems"
          :page-count="itemsPerPage"
          @update:page="(page) => localCurrentPage = page"
        />
      </div>
    </div>
  </div>
</template>
