<script setup>
import { TEXT } from "@/constants/text";
import * as z from "zod";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

const props = defineProps({
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
  fileSurat: z.instanceof(File, { message: "File surat is required" }),
});
const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});
const tanggalSurat = shallowRef(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
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

const isValidForm = computed(() => {
  if (state.type === "suratKeluar") {
    return Boolean(state.fileSurat && state.nomorSurat && modelValue.value);
  }
  return Boolean(state.fileSurat && state.nomorSurat);
});

async function onSubmit(event) {
  if (!event.data.fileSurat) {
    toast.add({
      title: "Error",
      description: "File surat harus diisi",
      color: "error",
    });
    return;
  }
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
    const formData = new FormData();
    formData.append("file", event.data.fileSurat);
    const file = await suratApiService.uploadFile({ data: formData });
    const fileId = file?.data?.id;

    const functionName =
      state.type === "suratMasuk" ? "createSuratMasuk" : "createSuratKeluar";

    const submitData = {
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
      description: `Surat ${state.type === "suratMasuk" ? "masuk" : "keluar"} berhasil dibuat`,
      color: "success",
    });
    emit("refresh");
    emit("close");
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal membuat surat",
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
    :title="TEXT.buatSurat"
    @close="emit('close')"
  >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField name="type">
        <USelect
          v-model="state.type"
          size="lg"
          :items="suratTypeOptions"
          class="w-full"
        />
      </UFormField>
      <UFormField name="nomorSurat" :label="TEXT.nomorSurat" required>
        <UInput
          v-model="state.nomorSurat"
          size="lg"
          :placeholder="TEXT.nomorSurat"
          class="w-full"
        />
      </UFormField>
      <UFormField
        v-if="state.type === 'suratKeluar'"
        name="tanggalSurat"
        :label="TEXT.tanggalSurat"
        :required="state.type === 'suratKeluar'"
      >
        <UPopover v-model:open="isPopoverOpen">
          <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
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
      <UFormField name="fileSurat" :label="TEXT.fileSurat" required>
        <UFileUpload
          v-model="state.fileSurat"
          :label="TEXT.fileSurat"
          :placeholder="TEXT.fileSurat"
          :description="TEXT.fileSuratDescription"
          layout="list"
          accept="application/pdf"
        />
      </UFormField>
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
