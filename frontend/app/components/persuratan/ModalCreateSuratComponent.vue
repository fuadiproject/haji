<script setup>
import { TEXT } from "@/constants/text";
import * as z from "zod";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import ModalAjukanNomorSurat from "./ModalAjukanNomorSurat.vue";
import ModalTemplateFiles from "./ModalTemplateFiles.vue";

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
  nama: z.string("Nama surat is required"),
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
  nama: undefined,
  nomorSurat: undefined,
  fileSurat: undefined,
  urgensi: undefined,
  bookingId: undefined,
});

const urgensiOptions = ref([]);
const isLoadingUrgensi = ref(false);
const nomorSuratOptions = ref([]);
const isLoadingNomorSurat = ref(false);
const isModalAjukanNomorOpen = ref(false);
const isModalTemplateFilesOpen = ref(false);

const isValidForm = computed(() => {
  if (state.type === "suratKeluar") {
    return Boolean(
      state.fileSurat &&
        state.nomorSurat &&
        modelValue.value &&
        state.nama &&
        state.urgensi,
    );
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
  if (!event.data.nama) {
    toast.add({
      title: "Error",
      description: "Nama surat harus diisi",
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
    if (!event.data.urgensi) {
      toast.add({
        title: "Error",
        description: "Urgensi harus diisi",
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
      nama: event.data.nama,
    };
    if (state.type === "suratKeluar") {
      submitData.tanggalSurat = new Date(
        modelValue.value.toDate(getLocalTimeZone()),
      ).toISOString();
      if (event.data.urgensi) {
        submitData.urgensiId = event.data.urgensi;
      }
    }

    const response = await suratApiService[functionName](submitData);

    // Jika surat keluar dan ada bookingId, update status booking menjadi USED
    if (state.type === "suratKeluar" && state.bookingId && response?.data?.id) {
      try {
        await suratApiService.putUsePenomoran({
          bookingId: state.bookingId,
          data: {
            surat_keluar_id: response.data.id,
          },
        });
      } catch (error) {
        console.error("Error updating booking status:", error);
        // Tidak perlu throw error, karena surat sudah berhasil dibuat
      }
    }

    toast.add({
      title: "Success",
      description: `Surat ${state.type === "suratMasuk" ? "masuk" : "keluar"} berhasil dibuat`,
      color: "success",
    });
    // Reset form
    state.nama = undefined;
    state.nomorSurat = undefined;
    state.fileSurat = undefined;
    state.urgensi = undefined;
    state.bookingId = undefined;
    modelValue.value = tanggalSurat.value;
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

const fetchUrgensi = async () => {
  try {
    isLoadingUrgensi.value = true;
    const response = await suratApiService.getAllUrgensi();
    const data = response?.data || [];
    urgensiOptions.value = data.map((item) => ({
      id: item.id,
      label: item.urgensi,
    }));
  } catch (error) {
    console.error("Error fetching urgensi:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal memuat data urgensi",
      color: "error",
    });
  } finally {
    isLoadingUrgensi.value = false;
  }
};

const fetchNomorSuratBookings = async () => {
  try {
    isLoadingNomorSurat.value = true;
    const response = await suratApiService.getMyBookPenomoran({
      status: "BOOKED",
      limit: 100,
    });
    if (response.success && response.data) {
      nomorSuratOptions.value = response.data.map((booking) => ({
        id: booking.id,
        label: booking.generated_number,
        value: booking.generated_number,
        bookingId: booking.id,
        generated_number: booking.generated_number,
      }));

      // Set default value ke item pertama jika ada dan belum ada nilai yang dipilih
      if (nomorSuratOptions.value.length > 0 && !state.nomorSurat) {
        const firstOption = nomorSuratOptions.value[0];
        state.nomorSurat = firstOption.value;
        state.bookingId = firstOption.bookingId;
      } else if (state.nomorSurat) {
        // Jika sudah ada nilai, pastikan bookingId sesuai
        const selected = nomorSuratOptions.value.find(
          (item) => item.value === state.nomorSurat,
        );
        if (selected) {
          state.bookingId = selected.bookingId;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching nomor surat bookings:", error);
    toast.add({
      title: "Error",
      description: error?.data?.error || "Gagal memuat data nomor surat",
      color: "error",
    });
  } finally {
    isLoadingNomorSurat.value = false;
  }
};

watch(
  () => state.type,
  (newType) => {
    if (newType === "suratKeluar") {
      if (urgensiOptions.value.length === 0) {
        fetchUrgensi();
      }
      fetchNomorSuratBookings();
    } else {
      // Reset nomor surat saat type bukan suratKeluar
      state.nomorSurat = undefined;
      state.bookingId = undefined;
    }
  },
  { immediate: true },
);

const handleBookingSuccess = async (bookingData) => {
  // Set nomor surat dari response booking
  if (bookingData?.generated_number) {
    const newGeneratedNumber = bookingData.generated_number;
    const newBookingId = bookingData.id;

    // Refresh list nomor surat
    await fetchNomorSuratBookings();

    // Set nomor surat setelah refresh selesai
    state.nomorSurat = newGeneratedNumber;
    state.bookingId = newBookingId;
  }
};

watch(
  () => state.nomorSurat,
  (newValue) => {
    // Update bookingId saat nomor surat berubah
    const selected = nomorSuratOptions.value.find(
      (item) => item.value === newValue,
    );
    if (selected) {
      state.bookingId = selected.bookingId;
    }
  },
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && state.type === "suratKeluar") {
      fetchNomorSuratBookings();
    }
  },
);

onMounted(() => {
  if (state.type === "suratKeluar") {
    fetchUrgensi();
    fetchNomorSuratBookings();
  }
});

const handleAjukanNomorSurat = () => {
  isModalAjukanNomorOpen.value = true;
};

const handleOpenTemplateFiles = () => {
  isModalTemplateFilesOpen.value = true;
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
      <UFormField
        v-if="state.type === 'suratKeluar'"
        name="nomorSurat"
        :label="TEXT.nomorSurat"
        required
      >
        <div class="space-y-2">
          <div class="flex gap-2">
            <USelectMenu
              v-model="state.nomorSurat"
              :items="nomorSuratOptions"
              value-key="value"
              :placeholder="'Pilih nomor surat'"
              :loading="isLoadingNomorSurat"
              :disabled="isLoadingNomorSurat || nomorSuratOptions.length === 0"
              class="min-h-8 flex-1"
            />
            <UButton type="button" size="sm" @click="handleAjukanNomorSurat">
              Ajukan No. Surat
            </UButton>
          </div>
          <UButton
            type="button"
            variant="subtle"
            size="sm"
            icon="i-heroicons-document-text"
            class="w-full text-center"
            @click="handleOpenTemplateFiles"
          >
            Lihat Template Files
          </UButton>
        </div>
      </UFormField>
      <UFormField v-else name="nomorSurat" :label="TEXT.nomorSurat" required>
        <UInput
          v-model="state.nomorSurat"
          size="lg"
          :placeholder="TEXT.nomorSurat"
          class="w-full"
        />
      </UFormField>
      <UFormField name="nama" :label="TEXT.namaSurat" required>
        <UInput
          v-model="state.nama"
          size="lg"
          :placeholder="TEXT.namaSurat"
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
      <UFormField
        v-if="state.type === 'suratKeluar'"
        name="urgensi"
        label="Urgensi"
        :required="state.type === 'suratKeluar'"
      >
        <USelectMenu
          v-model="state.urgensi"
          :items="urgensiOptions"
          value-key="id"
          :placeholder="'Pilih urgensi'"
          :loading="isLoadingUrgensi"
          :disabled="isLoadingUrgensi"
          class="min-h-8 w-full"
        />
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
    <ModalAjukanNomorSurat
      :is-open="isModalAjukanNomorOpen"
      @close="isModalAjukanNomorOpen = false"
      @update:is-open="isModalAjukanNomorOpen = $event"
      @success="handleBookingSuccess"
    />
    <ModalTemplateFiles
      :is-open="isModalTemplateFilesOpen"
      @close="isModalTemplateFilesOpen = false"
      @update:is-open="isModalTemplateFilesOpen = $event"
    />
  </ModalComponent>
</template>
