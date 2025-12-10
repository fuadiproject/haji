<script setup>
import { TEXT } from "@/constants/text";

const props = defineProps({
  bookingId: {
    type: String,
    required: true,
  },
  generatedNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  keterangan: {
    type: String,
    required: false,
    default: null,
  },
  template: {
    type: Object,
    required: false,
    default: null,
  },
  createdAt: {
    type: String,
    required: false,
    default: null,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusColor = (status) => {
  switch (status) {
    case "BOOKED":
      return "bg-yellow-100 text-yellow-800";
    case "USED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "BOOKED":
      return "Dibooking";
    case "USED":
      return "Digunakan";
    default:
      return status;
  }
};
</script>

<template>
  <div
    class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="mb-2 flex items-center gap-2">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ generatedNumber }}
          </h3>
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              getStatusColor(status),
            ]"
          >
            {{ getStatusLabel(status) }}
          </span>
        </div>

        <div v-if="template" class="mb-2">
          <p class="text-sm text-gray-600">
            <span class="font-medium">Template:</span>
            {{ template.nama }} ({{ template.kode }})
          </p>
        </div>

        <div v-if="keterangan" class="mb-2">
          <p class="text-sm text-gray-600">
            <span class="font-medium">Keterangan:</span>
            {{ keterangan }}
          </p>
        </div>

        <div v-if="createdAt" class="text-xs text-gray-500">
          Dibuat: {{ formatDate(createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>
