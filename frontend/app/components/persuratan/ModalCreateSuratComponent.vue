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

const emit = defineEmits(["close", "update:isOpen"]);

const toast = useToast();

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
    new Date().getMonth(),
    new Date().getDate(),
  ),
);
const modelValue = ref(tanggalSurat.value);
const isPopoverOpen = ref(false);

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
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
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
      <UFormField name="nomorSurat" :label="TEXT.nomorSurat">
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
      >
        <UPopover v-model:open="isPopoverOpen">
          <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
            {{
              modelValue
                ? df.format(modelValue.toDate(getLocalTimeZone()))
                : "Select a date"
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
        :description="TEXT.fileSuratDescription"
        layout="list"
        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      <div class="flex w-full justify-end">
        <ButtonComponent
          type="submit"
          variant="primary"
          :disabled="!isValidForm"
          >{{ TEXT.simpan }}</ButtonComponent
        >
      </div>
    </UForm>
  </ModalComponent>
</template>
