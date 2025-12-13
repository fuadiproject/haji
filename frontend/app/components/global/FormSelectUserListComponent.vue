<script setup>
import { TEXT } from "@/constants/text";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: TEXT.nikPenerima,
  },
  placeholder: {
    type: String,
    default: "Pilih penerima",
  },
  hasSelectAll: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const suratApiService = useServiceSuratapi();
const toast = useToast();

const isLoadingUsers = ref(false);
const usersList = ref([]);

const fetchUsers = async (searchTerm = "") => {
  isLoadingUsers.value = true;
  try {
    const response = await suratApiService.getAllUsers({
      search: searchTerm,
      limit: 50,
      all: props.hasSelectAll || undefined,
    });
    if (response.success) {
      usersList.value = response.data.map((user) => ({
        label: `${user.nama} (${user.nik})`,
        value: user.nik,
        nik: user.nik,
        nama: user.nama,
        nip: user.nip,
      }));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal mengambil daftar user",
      color: "error",
    });
  } finally {
    isLoadingUsers.value = false;
  }
};

let searchTimeout = null;

const handleSearch = (searchTerm) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    fetchUsers(searchTerm);
  }, 500);
};

onMounted(() => {
  fetchUsers();
});

watch(
  () => props.hasSelectAll,
  () => {
    fetchUsers();
  },
);

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<template>
  <UFormField :label="label" required>
    <USelectMenu
      :model-value="modelValue"
      size="lg"
      :items="usersList"
      :loading="isLoadingUsers"
      :search-input="{
        placeholder: TEXT.searchUserPlaceholder,
        icon: 'i-lucide-search',
      }"
      :placeholder="placeholder"
      class="w-full"
      @update:search-term="handleSearch"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </UFormField>
</template>
