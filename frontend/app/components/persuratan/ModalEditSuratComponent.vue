<script setup>
import { TEXT } from "@/constants/text";
import * as z from "zod";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

const props = defineProps({
  suratId: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  defaultType: {
    type: String,
    default: "suratMasuk",
  },
});

const emit = defineEmits(["close", "update:isOpen", "refresh"]);

const toast = useToast();
const suratApiService = useServiceSuratapi();

const suratTypeOptions = ref([
  {
    label: TEXT.suratMasuk,
    value: "suratMasuk",
  },
  {
    label: TEXT.suratKeluar,
    value: "suratKeluar",
  },
]);
const schema = z.object({
  type: z.string("Type is required"),
  nomorSurat: z.string("Nomor surat is required"),
  fileSurat: z.instanceof(File).optional(),
});
const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});
const tanggalSurat = shallowRef(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  ),
);
const modelValue = ref(tanggalSurat.value);
const isPopoverOpen = ref(false);
const isSubmitLoading = ref(false);

const state = reactive({
  type: props.defaultType,
  nomorSurat: undefined,
  fileSurat: undefined,
});

// Track original data for comparison
const originalData = ref(null);
const isFileChanged = ref(false);

const {
  data: suratData,
  status: statusSurat,
  error: _errorSurat,
  refresh: _refreshSurat,
} = await useAsyncData(
  computed(() => `surat-${state.type}-${props.suratId}`),
  async () => {
    const functionName =
      state.type === "suratMasuk" ? "getSuratMasukById" : "getSuratKeluarById";
    const response = await suratApiService[functionName]({
      id: props.suratId,
    });
    return response;
  },
  {
    watch: [props.suratId],
    server: false,
    lazy: true,
    immediate: !!props.suratId,
  },
);

// Watch for suratData changes to populate form
watch(
  suratData,
  (newData) => {
    if (newData?.data) {
      originalData.value = { ...newData.data };
      state.nomorSurat = newData.data.nomor_surat || "";

      // Set tanggal for surat keluar
      if (state.type === "suratKeluar" && newData.data.tanggal_surat) {
        const date = new Date(newData.data.tanggal_surat);
        modelValue.value = new CalendarDate(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
        );
      }
    }
  },
  { immediate: true },
);

// Reset form when modal closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      // Reset form state when modal closes
      state.nomorSurat = "";
      state.fileSurat = undefined;
      isFileChanged.value = false;
      originalData.value = null;
    }
  },
);
const isLoading = computed(() => statusSurat.value === "pending");

const isValidForm = computed(() => {
  if (state.type === "suratKeluar") {
    return Boolean(state.nomorSurat && modelValue.value);
  }
  return Boolean(state.nomorSurat);
});

// Watch for file changes
watch(
  () => state.fileSurat,
  (newFile) => {
    isFileChanged.value = !!newFile;
  },
);

async function onSubmit(event) {
  if (!event.data.nomorSurat) {
    toast.add({
      title: "Error",
      description: "Nomor surat harus diisi",
      color: "error",
    });
    return;
  }
  if (state.type === "suratKeluar") {
    if (!modelValue.value) {
      toast.add({
        title: "Error",
        description: "Tanggal surat harus diisi",
        color: "error",
      });
      return;
    }
  }

  try {
    isSubmitLoading.value = true;

    let fileId = originalData.value?.file_id;

    // Only upload new file if file has changed
    if (isFileChanged.value && event.data.fileSurat) {
      const formData = new FormData();
      formData.append("file", event.data.fileSurat);
      const file = await suratApiService.uploadFile({ data: formData });
      fileId = file?.data?.id;
    }

    const functionName =
      state.type === "suratMasuk" ? "updateSuratMasuk" : "updateSuratKeluar";

    const submitData = {
      id: props.suratId,
      fileId,
      nomorSurat: event.data.nomorSurat,
    };

    if (state.type === "suratKeluar") {
      submitData.tanggalSurat = new Date(
        modelValue.value.toDate(getLocalTimeZone()),
      ).toISOString();
    }

    await suratApiService[functionName](submitData);
    toast.add({
      title: "Success",
      description: `Surat ${state.type === "suratMasuk" ? "masuk" : "keluar"} berhasil diperbarui`,
      color: "success",
    });
    emit("refresh");
    emit("close");
  } catch (error) {
    console.error("Error updating surat:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal memperbarui surat",
      color: "error",
    });
  } finally {
    isSubmitLoading.value = false;
  }
}

const handleDateChange = (newDate) => {
  modelValue.value = newDate;
  isPopoverOpen.value = false;
};
</script>

<template>
  <ModalComponent
    :is-open="isOpen"
    :title="TEXT.editSurat"
    @close="emit('close')"
  >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField name="type">
        <USelect
          v-model="state.type"
          size="lg"
          :items="suratTypeOptions"
          class="w-full"
          disabled
        />
      </UFormField>
      <UFormField name="nomorSurat" :label="TEXT.nomorSurat">
        <UInput
          v-model="state.nomorSurat"
          size="lg"
          :placeholder="TEXT.nomorSurat"
          class="w-full"
          :loading="isLoading"
          :readonly="isLoading"
          :disabled="isLoading"
        />
      </UFormField>
      <UFormField
        v-if="state.type === 'suratKeluar'"
        name="tanggalSurat"
        :label="TEXT.tanggalSurat"
      >
        <UPopover v-model:open="isPopoverOpen">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-calendar"
            :loading="isLoading"
            :readonly="isLoading"
            :disabled="isLoading"
          >
            {{
              modelValue
                ? df.format(modelValue.toDate(getLocalTimeZone()))
                : "Pilih tanggal"
            }}
          </UButton>

          <template #content>
            <UCalendar
              v-model="modelValue"
              class="p-2"
              @update:model-value="handleDateChange"
            />
          </template>
        </UPopover>
      </UFormField>
      <UFileUpload
        v-model="state.fileSurat"
        :label="TEXT.fileSurat"
        :placeholder="TEXT.fileSurat"
        :description="
          isFileChanged
            ? 'File baru akan menggantikan file yang ada'
            : 'Pilih file baru untuk mengganti file yang ada (opsional)'
        "
        layout="list"
        accept="application/pdf"
      />
      <div class="flex w-full justify-end">
        <ButtonComponent
          :loading="isSubmitLoading"
          type="submit"
          variant="primary"
          :disabled="!isValidForm"
          >{{ TEXT.simpan }}</ButtonComponent
        >
      </div>
    </UForm>
  </ModalComponent>
</template>
