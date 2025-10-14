<script setup>
import { TEXT } from "@/constants/text";

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
});

const emit = defineEmits(["disposisi", "detail", "delete", "edit"]);
</script>

<template>
  <CardComponent>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-body-2 text-sm font-semibold">
          {{ TEXT.nomor }} : {{ nomorSurat }}
        </span>

        <div class="flex items-center gap-2">
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
            <div v-if="fileUrl">
              <a :href="fileUrl" target="_blank">
                <ButtonComponent
                  size="sm"
                  variant="primary-outline"
                  @click="downloadPdf(fileUrl, nomorSurat)"
                >
                  <UIcon name="ph:download-bold" class="h-4 w-4" />
                  <span>{{ TEXT.download }}</span>
                </ButtonComponent>
              </a>
            </div>

            <div v-if="type === 'suratMasuk'">
              <ButtonComponent
                size="sm"
                variant="primary"
                @click="emit('disposisi')"
              >
                <span>{{ TEXT.disposisi }}</span>
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CardComponent>
</template>
