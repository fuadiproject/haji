<script setup>
const props = defineProps({
  // Table data
  data: {
    type: Array,
    required: true,
  },
  // Table columns configuration
  columns: {
    type: Array,
    required: true,
  },
  // Loading state
  loading: {
    type: Boolean,
    default: false,
  },
  // Empty state configuration
  emptyState: {
    type: Object,
    default: () => ({
      icon: "ph:file-text",
      title: "Tidak ada data",
      description: "Belum ada data yang ditambahkan.",
    }),
  },
  // Pagination configuration
  pagination: {
    type: Object,
    default: () => ({
      enabled: true,
      currentPage: 1,
      itemsPerPage: 10,
      showItemsPerPage: true,
      showPaginationInfo: true,
      itemsPerPageOptions: [
        { label: "5 per halaman", value: 5 },
        { label: "10 per halaman", value: 10 },
        { label: "20 per halaman", value: 20 },
        { label: "50 per halaman", value: 50 },
      ],
    }),
  },
  // Table styling
  tableClass: {
    type: String,
    default: "",
  },
  // Wrapper styling
  wrapperClass: {
    type: String,
    default: "",
  },
  // Enable row hover effect
  hoverable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "update:pagination",
  "page-change",
  "items-per-page-change",
  "row-click",
]);

// Local pagination state
const localPagination = ref({ ...props.pagination });

// Watch for pagination prop changes
watch(
  () => props.pagination,
  (newPagination) => {
    localPagination.value = { ...newPagination };
  },
  { deep: true },
);

const stickyRightStyles = computed(() => {
  const styles = {};
  let currentRight = "0px";
  [...props.columns].reverse().forEach((col) => {
    if (col.sticky) {
      styles[col.key] = { right: currentRight };
      if (col.width) {
        currentRight = `calc(${currentRight} + ${col.width})`;
      } else {
        console.warn(
          `[DataTableComponent] Sticky column with key "${col.key}" has no width defined. This might cause layout issues.`,
        );
      }
    }
  });
  return styles;
});

// Computed properties for pagination
const totalItems = computed(() => props.data.length);

const paginatedData = computed(() => {
  if (!localPagination.value.enabled) {
    return props.data;
  }

  const start =
    (localPagination.value.currentPage - 1) *
    localPagination.value.itemsPerPage;
  const end = start + localPagination.value.itemsPerPage;
  return props.data.slice(start, end);
});

// Pagination event handlers
const handlePageChange = (page) => {
  localPagination.value.currentPage = page;
  emit("update:pagination", localPagination.value);
  emit("page-change", page);
};

const handleItemsPerPageChange = (itemsPerPage) => {
  localPagination.value.itemsPerPage = itemsPerPage;
  localPagination.value.currentPage = 1; // Reset to first page
  emit("update:pagination", localPagination.value);
  emit("items-per-page-change", itemsPerPage);
};

// Row click handler
const handleRowClick = (row, index) => {
  emit("row-click", { row, index });
};

// Get column value from row
const getColumnValue = (row, column) => {
  if (column.key) {
    return row[column.key];
  }
  return "";
};

// Get slots
const slots = useSlots();

// Check if column has custom slot
const hasCustomSlot = (column) => {
  return !!slots[`${column.key}-data`] || !!slots[column.key];
};
</script>

<template>
  <div :class="['space-y-4', wrapperClass]">
    <!-- Data Table -->
    <div
      class="border-neutral-9 overflow-hidden rounded-lg border bg-white shadow-sm"
    >
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-3">
          <div
            class="border-primary-600 h-6 w-6 animate-spin rounded-full border-b-2"
          ></div>
          <span class="text-sm text-gray-600">Memuat data...</span>
        </div>
      </div>
      <!-- Table Content -->
      <div v-else-if="data.length > 0" class="overflow-x-auto">
        <table :class="['w-full table-fixed', tableClass]">
          <!-- Table Header -->
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase',
                  column.headerClass || '',
                  { 'sticky z-20 bg-gray-50': column.sticky },
                ]"
                :style="[
                  column.width ? { width: column.width } : {},
                  column.sticky ? stickyRightStyles[column.key] : {},
                ]"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="(row, rowIndex) in paginatedData"
              :key="row.id || rowIndex"
              :class="[
                'group isolate',
                hoverable ? 'transition-colors hover:bg-gray-50' : '',
                row.rowClass || '',
              ]"
              @click="handleRowClick(row, rowIndex)"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-6 py-4 whitespace-nowrap',
                  column.cellClass || '',
                  {
                    'sticky z-10 bg-white': column.sticky,
                    'group-hover:bg-gray-50': column.sticky && hoverable,
                  },
                ]"
                :style="column.sticky ? stickyRightStyles[column.key] : {}"
              >
                <!-- Custom slot for column -->
                <slot
                  v-if="hasCustomSlot(column)"
                  :name="`${column.key}-data`"
                  :row="row"
                  :value="getColumnValue(row, column)"
                  :index="rowIndex"
                >
                  <slot
                    :name="column.key"
                    :row="row"
                    :value="getColumnValue(row, column)"
                    :index="rowIndex"
                  >
                    {{ getColumnValue(row, column) }}
                  </slot>
                </slot>
                <!-- Default column content -->
                <span v-else :class="column.valueClass || ''">
                  {{ getColumnValue(row, column) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <UIcon
          :name="emptyState.icon"
          class="mx-auto mb-4 h-12 w-12 text-gray-400"
        />
        <h3 class="mb-1 text-sm font-medium text-gray-900">
          {{ emptyState.title }}
        </h3>

        <p class="text-sm text-gray-500">{{ emptyState.description }}</p>
        <!-- Custom empty state slot -->
        <slot name="empty-state" :empty-state="emptyState"></slot>
      </div>
    </div>
    <!-- Pagination -->
    <PaginationComponent
      v-if="pagination.enabled && data.length > 0"
      :current-page="localPagination.currentPage"
      :items-per-page="localPagination.itemsPerPage"
      :total-items="totalItems"
      :show-items-per-page="pagination.showItemsPerPage"
      :show-pagination-info="pagination.showPaginationInfo"
      @update:current-page="handlePageChange"
      @update:items-per-page="handleItemsPerPageChange"
    />
  </div>
</template>
