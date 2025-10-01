<script setup>
import { TEXT } from "@/constants/text";
import CardSuratComponent from "@/components/persuratan/CardSuratComponent.vue";
import ModalCreateSuratComponent from "@/components/persuratan/ModalCreateSuratComponent.vue";
import ModalCreateDisposisiComponent from "@/components/persuratan/ModalCreateDisposisiComponent.vue";
import ModalDetailSuratComponent from "@/components/persuratan/ModalDetailSuratComponent.vue";

const route = useRoute();
const suratapiService = useServiceSuratapi();

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

const search = ref(route.query.search || "");
const page = ref(route.query.page ? parseInt(route.query.page) : 1);
const limit = ref(10);

const {
  data: suratData,
  status: statusSurat,
  error: errorSurat,
  refresh: refreshSurat,
} = await useAsyncData(
  computed(() => `surat-${activeTab.value}`),
  async () => {
    const functionName =
      activeTab.value === "suratMasuk"
        ? "getAllSuratMasuk"
        : "getAllSuratKeluar";
    const response = await suratapiService[functionName]({
      page: page.value,
      limit: limit.value,
      search: search.value,
    });
    return response;
  },
  {
    server: false,
    lazy: false,
    immediate: true,
  },
);

const isLoading = computed(() => statusSurat.value === "pending");

const handleChangeTab = (tab) => {
  search.value = "";
  page.value = 1;
  activeTab.value = tab;

  navigateTo({
    query: {
      ...route.query,
      page: 1,
      search: "",
      tab,
    },
    replace: true,
  });

  refreshSurat();
};

let timeout = null;
const handleSearch = (value) => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    search.value = value;
    page.value = 1;

    navigateTo({
      query: {
        ...route.query,
        page: 1,
        search: value,
      },
      replace: true,
    });

    refreshSurat();
  }, 500);
};

const handleChangePage = (p) => {
  page.value = p;
  navigateTo({
    query: {
      ...route.query,
      page: p,
    },
    replace: true,
  });
  refreshSurat();
};

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
      :model-value="search"
      @update:model-value="handleSearch"
    />

    <div class="mt-5 flex w-full items-center justify-between">
      <div class="flex items-center gap-4">
        <ButtonComponent
          v-for="tab in TABS"
          :key="tab"
          variant="outline"
          :class="
            activeTab === tab ? 'border-primary-main text-primary-main' : ''
          "
          @click="handleChangeTab(tab)"
        >
          <UIcon
            name="ph:tray-arrow-down-bold"
            class="text-neutral-6 h-5 w-5"
            :class="activeTab === tab ? 'text-primary-main' : ''"
          />
          {{ tab === "suratMasuk" ? TEXT.suratMasuk : TEXT.suratKeluar }}
        </ButtonComponent>
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

    <div class="mt-5">
      <LoadingStateComponent v-if="isLoading" />

      <ErrorStateComponent
        v-else-if="errorSurat"
        :error="errorSurat"
        @refresh="refreshSurat()"
      />

      <EmptyStateComponent
        v-else-if="suratData?.data?.[activeTab]?.length === 0"
        image-class="h-20 w-20"
        :text="TEXT.tidakAdaDataSuratMasuk"
      />

      <div v-else>
        <div class="min-h-[calc(100vh-390px)] space-y-4">
          <CardSuratComponent
            v-for="surat in suratData?.data?.[activeTab]"
            :key="surat.id"
            :surat-id="surat.id"
            :nomor-surat="surat.nomor_surat"
            :tanggal-surat="surat.tanggal_surat"
            :disposisi-count="surat.disposisi?.length || 0"
            :file-id="surat.file?.id"
            :file-name="surat.file?.filename"
            :file-url="surat.file?.filepath"
            @disposisi="
              modalAddDisposisi.isOpen = true;
              modalAddDisposisi.suratId = surat.id;
            "
            @detail="
              modalDetailSurat.isOpen = true;
              modalDetailSurat.suratId = surat.id;
              modalDetailSurat.nomorSurat = surat.nomor_surat;
            "
          />
        </div>
        <UPagination
          v-if="suratData?.data?.pagination?.total_pages > 1"
          :page="page"
          class="mt-5 flex w-full justify-center"
          variant="soft"
          color="primary"
          :items-per-page="limit"
          :total="suratData?.data?.pagination?.total_pages || 0"
          @update:page="handleChangePage"
        />
      </div>
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
