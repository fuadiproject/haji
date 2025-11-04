<script setup>
import { TEXT } from "@/constants/text";
import ModalSignTTEComponent from "@/components/persuratan/ModalSignTTEComponent.vue";
import ModalRejectTTEComponent from "@/components/persuratan/ModalRejectTTEComponent.vue";

defineProps({
  suratId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  nomorSurat: {
    type: String,
    required: true,
  },
  tanggalSurat: {
    type: String,
    required: false,
    default: null, // 2025-09-15T09:22:20.220Z
  },
  disposisiCount: {
    type: Number,
    required: false,
    default: 0,
  },
  fileId: {
    type: String,
    required: false,
    default: null,
  },
  fileName: {
    type: String,
    required: false,
    default: null,
  },
  fileUrl: {
    type: String,
    required: false,
    default: null,
  },
  tteLogs: {
    type: Number,
    required: false,
    default: 0,
  },
  urutanTte: {
    type: Number,
    required: false,
    default: undefined,
  },
  isInbox: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits([
  "disposisi",
  "detail",
  "delete",
  "edit",
  "create-tte",
  "refresh",
]);

const isModalViewFileOpen = ref(false);
const isModalSignOpen = ref(false);
const isModalRejectOpen = ref(false);
</script>

<template>
  <CardComponent :class="{ 'border! border-green-600!': isInbox }">
    <div class="relative space-y-3">
      <div
        v-if="type === 'suratKeluar' && (isInbox || tteLogs > 0)"
        class="flex items-center gap-2"
      >
        <UBadge v-if="isInbox" variant="solid" class="w-fit bg-green-600">
          {{ TEXT.inbox }}
        </UBadge>
        <UBadge
          v-if="tteLogs > 0 && urutanTte > 0 && urutanTte <= tteLogs"
          variant="solid"
          class="w-fit bg-green-800"
        >
          {{ TEXT.progress }} : {{ urutanTte - 1 }} / {{ tteLogs }}
        </UBadge>
        <UBadge
          v-if="tteLogs > 0 && urutanTte === 0"
          variant="solid"
          class="w-fit bg-red-600"
        >
          {{ TEXT.rejected }}
        </UBadge>
        <UBadge
          v-if="tteLogs > 0 && urutanTte > 0 && urutanTte > tteLogs"
          variant="outline"
          class="w-fit border-green-600! text-green-600! ring-green-600!"
        >
          <UIcon name="ph:check-bold" class="h-3 w-3" />
          {{ TEXT.signed }}
        </UBadge>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-body-2 text-sm font-semibold">
          {{ TEXT.nomor }} : {{ nomorSurat }}
        </span>

        <div
          v-if="!isInbox && urutanTte === null"
          class="absolute top-0 right-0 flex items-center gap-2"
        >
          <UButton
            variant="outline"
            size="xs"
            color="secondary"
            @click="emit('edit')"
          >
            <UIcon name="ph:pencil" class="h-4 w-4" />
          </UButton>
          <UButton
            variant="outline"
            color="error"
            size="xs"
            @click="emit('delete')"
          >
            <UIcon name="ph:trash" class="h-4 w-4" />
          </UButton>
        </div>
        <div
          v-if="
            isInbox && !(tteLogs > 0 && urutanTte === 0) && urutanTte <= tteLogs
          "
          class="absolute top-0 right-0 flex items-center gap-2"
        >
          <ButtonComponent
            size="sm"
            variant="primary-outline"
            class="border-green-500! text-green-500!"
            @click="isModalSignOpen = true"
          >
            <UIcon name="ph:signature-bold" class="h-4 w-4" />
            <span>{{ TEXT.tte }}</span>
          </ButtonComponent>
        </div>
      </div>

      <div v-if="tanggalSurat" class="flex items-center gap-2">
        <NuxtTime
          class="text-body-3 text-xs"
          :datetime="tanggalSurat"
          day="numeric"
          month="long"
          year="numeric"
          locale="id"
        />
      </div>

      <div v-if="disposisiCount > 0" class="flex items-center gap-2">
        <UIcon name="ph:users-bold" class="text-primary h-4 w-4" />
        <span class="text-primary text-sm font-medium">
          {{ disposisiCount }} {{ TEXT.disposisi }}
        </span>
      </div>

      <div class="border-border-main border-t pt-3">
        <div class="flex items-center justify-between gap-2">
          <ButtonComponent
            size="sm"
            variant="outline"
            class="w-fit"
            @click="emit('detail')"
          >
            <UIcon name="ph:eye-bold" class="h-4 w-4" />
            <span>{{ TEXT.lihatDetail }}</span>
          </ButtonComponent>
          <div class="flex items-center gap-2">
            <div
              v-if="
                isInbox &&
                !(tteLogs > 0 && urutanTte === 0) &&
                urutanTte <= tteLogs
              "
            >
              <ButtonComponent
                size="sm"
                variant="primary-outline"
                class="border-red-600! text-red-600!"
                @click="isModalRejectOpen = true"
              >
                <UIcon name="ph:x-bold" class="h-4 w-4" />
                <span>{{ TEXT.rejectTTE }}</span>
              </ButtonComponent>
            </div>

            <div v-if="fileUrl">
              <ButtonComponent
                size="sm"
                variant="primary-outline"
                @click="isModalViewFileOpen = true"
              >
                <UIcon name="ph:eye-bold" class="h-4 w-4" />
                <span>{{ TEXT.lihatPreview }}</span>
              </ButtonComponent>
            </div>

            <div v-if="type === 'suratMasuk'">
              <ButtonComponent
                size="sm"
                variant="primary"
                @click="emit('disposisi')"
              >
                <UIcon name="ph:hand-pointing" class="h-4 w-4" />
                <span>{{ TEXT.disposisi }}</span>
              </ButtonComponent>
            </div>

            <div v-if="type === 'suratKeluar' && tteLogs === 0">
              <ButtonComponent
                size="sm"
                variant="primary"
                @click="emit('create-tte')"
              >
                <UIcon name="ph:plus-bold" class="h-4 w-4" />
                <span>{{ TEXT.createTTE }}</span>
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CardComponent>

  <ModalViewFileComponent
    v-if="isModalViewFileOpen"
    :is-open="isModalViewFileOpen"
    :file-id="fileId"
    :title="`${TEXT.nomorSurat}: ${nomorSurat}`"
    @close="isModalViewFileOpen = false"
  />

  <ModalSignTTEComponent
    v-if="isModalSignOpen"
    :is-open="isModalSignOpen"
    :title="`${TEXT.tte}: ${nomorSurat}`"
    :surat-id="suratId"
    :file-id="fileId"
    @close="isModalSignOpen = false"
    @refresh="emit('refresh')"
  />

  <ModalRejectTTEComponent
    v-if="isModalRejectOpen"
    :is-open="isModalRejectOpen"
    :surat-id="suratId"
    @close="isModalRejectOpen = false"
    @refresh="emit('refresh')"
  />
</template>
