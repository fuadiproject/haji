<script setup>
import { TEXT } from "@/constants/text";
import CardSuratComponent from "@/components/persuratan/CardSuratComponent.vue";
import ModalCreateSuratComponent from "@/components/persuratan/ModalCreateSuratComponent.vue";
import ModalCreateDisposisiComponent from "@/components/persuratan/ModalCreateDisposisiComponent.vue";
import ModalDetailSuratComponent from "@/components/persuratan/ModalDetailSuratComponent.vue";

const route = useRoute();

const activeTab = ref(route.query.tab || "suratMasuk");
const TABS = ref(["suratMasuk", "suratKeluar"]);
const isModalAddSuratOpen = ref(false);
const modalAddDisposisi = ref({
  isOpen: false,
  suratId: "",
});

const modalDetailSurat = ref({
  isOpen: false,
  suratId: "",
  nomorSurat: "",
});

const handleBack = () => {
  navigateTo("/");
};

const handleDownload = (data) => {
  console.log("Download surat:", data);
  // Implementasi download logic di sini
};

const handleDisposisi = (data) => {
  modalAddDisposisi.value.isOpen = true;
  modalAddDisposisi.value.suratId = data.suratId;
};
</script>

<template>
  <TemplateDetailComponent
    is-full-width
    variant="default"
    title="Persuratan"
    @back="handleBack"
  >
    <h1 class="text-neutral-7 text-xl font-semibold">
      {{ TEXT.listDisposisi }}
    </h1>
    <UInput
      size="lg"
      icon="ph:magnifying-glass"
      placeholder="Cari surat..."
      class="mt-5 w-full"
      :ui="{
        base: 'rounded-2xl focus-visible:ring-1',
      }"
    />

    <div class="mt-5 flex w-full items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink
          v-for="tab in TABS"
          :key="tab"
          :to="{ query: { ...route.query, tab } }"
        >
          <ButtonComponent
            variant="outline"
            :class="
              activeTab === tab ? 'border-primary-main text-primary-main' : ''
            "
            @click="activeTab = tab"
          >
            <UIcon
              name="ph:tray-arrow-down-bold"
              class="text-neutral-6 h-5 w-5"
              :class="activeTab === tab ? 'text-primary-main' : ''"
            />
            {{ tab === "suratMasuk" ? TEXT.suratMasuk : TEXT.suratKeluar }}
          </ButtonComponent>
        </NuxtLink>
      </div>
      <ButtonComponent
        class="hidden md:flex"
        variant="primary"
        @click="isModalAddSuratOpen = true"
      >
        <UIcon name="ph:plus-bold" class="h-5 w-5" />
        <span>{{ TEXT.buatSurat }}</span>
      </ButtonComponent>
    </div>

    <div class="mt-5 space-y-4">
      <CardSuratComponent
        :surat-id="'123'"
        nomor-surat="123/456/789"
        tanggal-surat="2025-09-15T09:22:20.220Z"
        :disposisi-count="2"
        file-url="https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf"
        @disposisi="
          modalAddDisposisi.isOpen = true;
          modalAddDisposisi.suratId = '456';
        "
        @detail="
          modalDetailSurat.isOpen = true;
          modalDetailSurat.suratId = '456';
          modalDetailSurat.nomorSurat = '123/456/789';
        "
      />
      <CardSuratComponent
        :surat-id="'456'"
        nomor-surat="123/456/789"
        tanggal-surat="2025-09-15T09:22:20.220Z"
        :disposisi-count="0"
        file-url="https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf"
        @disposisi="
          modalAddDisposisi.isOpen = true;
          modalAddDisposisi.suratId = '456';
        "
        @detail="
          modalDetailSurat.isOpen = true;
          modalDetailSurat.suratId = '456';
          modalDetailSurat.nomorSurat = '123/456/789';
        "
      />
    </div>

    <FloatingButtonComponent
      class="md:hidden"
      @click="isModalAddSuratOpen = true"
    />

    <ModalCreateSuratComponent
      :is-open="isModalAddSuratOpen"
      :default-type="activeTab"
      @close="isModalAddSuratOpen = false"
    />

    <ModalCreateDisposisiComponent
      :surat-id="modalAddDisposisi.suratId"
      :is-open="modalAddDisposisi.isOpen"
      @close="modalAddDisposisi.isOpen = false"
    />

    <ModalDetailSuratComponent
      :surat-id="modalDetailSurat.suratId"
      :nomor-surat="modalDetailSurat.nomorSurat"
      :is-open="modalDetailSurat.isOpen"
      @close="modalDetailSurat.isOpen = false"
      @download="handleDownload"
      @disposisi="handleDisposisi"
    />
  </TemplateDetailComponent>
</template>
