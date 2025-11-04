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
});

const emit = defineEmits(["close", "update:isOpen", "refresh"]);

const toast = useToast();
const presensiapiService = useServicePresensiapi();

const kategoriIzinOptions = ref([
  {
    label: TEXT.dinasLuar,
    value: "dinas_luar",
  },
  {
    label: TEXT.cutiTahunan,
    value: "cuti_tahunan",
  },
  {
    label: TEXT.cutiBesar,
    value: "cuti_besar",
  },
  {
    label: TEXT.cutiSakit,
    value: "cuti_sakit",
  },
  {
    label: TEXT.cutiMelahirkan,
    value: "cuti_melahirkan",
  },
  {
    label: TEXT.cutiAlasanPenting,
    value: "cuti_alasan_penting",
  },
  {
    label: TEXT.cutiLuarTanggunganNegara,
    value: "cuti_luar_tanggungan_negara",
  },
  {
    label: TEXT.izinTidakMasuk,
    value: "izin_tidak_masuk",
  },
]);

const schema = z.object({
  kategori: z.string().min(1, "Kategori izin harus diisi"),
  alasan: z.string().min(1, "Alasan harus diisi"),
  lampiran: z.instanceof(File, { message: "Lampiran harus diisi" }),
});

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const tanggalAwal = shallowRef(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
);
const tanggalAkhir = shallowRef(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
);

const modelValueAwal = ref(tanggalAwal.value);
const modelValueAkhir = ref(tanggalAkhir.value);
const isPopoverOpenAwal = ref(false);
const isPopoverOpenAkhir = ref(false);
const isSubmitLoading = ref(false);

const state = reactive({
  kategori: undefined,
  alasan: undefined,
  lampiran: undefined,
});

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const isValidForm = computed(() => {
  return Boolean(
    state.kategori &&
      modelValueAwal.value &&
      modelValueAkhir.value &&
      state.alasan &&
      state.lampiran,
  );
});

async function onSubmit(event) {
  if (!event.data.kategori) {
    toast.add({
      title: "Error",
      description: "Kategori izin harus diisi",
      color: "error",
    });
    return;
  }
  if (!event.data.alasan) {
    toast.add({
      title: "Error",
      description: "Alasan harus diisi",
      color: "error",
    });
    return;
  }
  if (!modelValueAwal.value) {
    toast.add({
      title: "Error",
      description: "Tanggal awal harus diisi",
      color: "error",
    });
    return;
  }
  if (!modelValueAkhir.value) {
    toast.add({
      title: "Error",
      description: "Tanggal akhir harus diisi",
      color: "error",
    });
    return;
  }

  // Validate tanggal akhir >= tanggal awal
  const tanggalAwalDate = modelValueAwal.value.toDate(getLocalTimeZone());
  const tanggalAkhirDate = modelValueAkhir.value.toDate(getLocalTimeZone());
  if (tanggalAkhirDate < tanggalAwalDate) {
    toast.add({
      title: "Error",
      description: "Tanggal akhir tidak boleh lebih kecil dari tanggal awal",
      color: "error",
    });
    return;
  }

  if (!state.lampiran) {
    toast.add({
      title: "Error",
      description: "Lampiran harus diisi",
      color: "error",
    });
    return;
  }

  // Validate file type is PDF
  if (state.lampiran.type !== "application/pdf") {
    toast.add({
      title: "Error",
      description: "Lampiran harus berupa file PDF",
      color: "error",
    });
    return;
  }

  try {
    isSubmitLoading.value = true;

    const base64String = await fileToBase64(state.lampiran);
    const lampiranBase64 = base64String.includes(",")
      ? base64String.split(",")[1]
      : base64String;
    const namaLampiran = state.lampiran.name;

    const formatDateToISO = (calendarDate) => {
      const year = calendarDate.year;
      const month = String(calendarDate.month).padStart(2, "0");
      const day = String(calendarDate.day).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const submitData = {
      kategori: event.data.kategori,
      tanggal_awal: formatDateToISO(modelValueAwal.value),
      tanggal_akhir: formatDateToISO(modelValueAkhir.value),
      alasan: event.data.alasan,
      lampiran: lampiranBase64,
      nama_lampiran: namaLampiran,
    };

    await presensiapiService.createIzin(submitData);
    toast.add({
      title: "Success",
      description: TEXT.izinBerhasilDibuat,
      color: "success",
    });
    emit("refresh");
    emit("close");
    // Reset form
    state.kategori = undefined;
    state.alasan = undefined;
    state.lampiran = undefined;
    const today = new Date();
    modelValueAwal.value = new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    );
    modelValueAkhir.value = new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    );
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.add({
      title: "Error",
      description: error?.response?._data?.message || TEXT.gagalMembuatIzin,
      color: "error",
    });
  } finally {
    isSubmitLoading.value = false;
  }
}

const handleDateChangeAwal = (newDate) => {
  modelValueAwal.value = newDate;
  isPopoverOpenAwal.value = false;
};

const handleDateChangeAkhir = (newDate) => {
  modelValueAkhir.value = newDate;
  isPopoverOpenAkhir.value = false;
};

// Reset form when modal closes and initialize when opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      // Reset form when closing
      state.kategori = undefined;
      state.alasan = undefined;
      state.lampiran = undefined;
    } else {
      // Initialize dates when opening
      const today = new Date();
      modelValueAwal.value = new CalendarDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
      );
      modelValueAkhir.value = new CalendarDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
      );
    }
  },
);
</script>

<template>
  <ModalComponent
    :is-open="isOpen"
    :title="TEXT.buatIzin"
    @close="emit('close')"
  >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField name="kategori" :label="TEXT.kategoriIzin" required>
        <USelect
          v-model="state.kategori"
          size="lg"
          :items="kategoriIzinOptions"
          :placeholder="TEXT.pilihKategoriIzin"
          class="w-full"
        />
      </UFormField>

      <UFormField name="tanggalAwal" :label="TEXT.tanggalAwal" required>
        <UPopover v-model:open="isPopoverOpenAwal">
          <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
            {{
              modelValueAwal
                ? df.format(modelValueAwal.toDate(getLocalTimeZone()))
                : "Pilih tanggal"
            }}
          </UButton>

          <template #content>
            <UCalendar
              v-model="modelValueAwal"
              class="p-2"
              @update:model-value="handleDateChangeAwal"
            />
          </template>
        </UPopover>
      </UFormField>

      <UFormField name="tanggalAkhir" :label="TEXT.tanggalAkhir" required>
        <UPopover v-model:open="isPopoverOpenAkhir">
          <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
            {{
              modelValueAkhir
                ? df.format(modelValueAkhir.toDate(getLocalTimeZone()))
                : "Pilih tanggal"
            }}
          </UButton>

          <template #content>
            <UCalendar
              v-model="modelValueAkhir"
              class="p-2"
              :min-value="modelValueAwal"
              @update:model-value="handleDateChangeAkhir"
            />
          </template>
        </UPopover>
      </UFormField>

      <UFormField name="alasan" :label="TEXT.alasan" required>
        <UTextarea
          v-model="state.alasan"
          size="lg"
          :placeholder="TEXT.masukkanAlasan"
          class="w-full"
          :rows="4"
        />
      </UFormField>

      <UFormField name="lampiran" :label="TEXT.lampiran" required>
        <UFileUpload
          v-model="state.lampiran"
          :label="TEXT.lampiran"
          :placeholder="TEXT.lampiran"
          :description="TEXT.fileLampiranDescription"
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
