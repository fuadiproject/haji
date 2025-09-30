<script setup>
import { TEXT } from "@/constants/text";

defineProps({
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
  fileUrl: {
    type: String,
    required: false,
    default: null,
  },
});

const emit = defineEmits(["disposisi", "detail"]);
</script>

<template>
  <CardComponent>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-neutral-7 text-sm font-semibold">
          {{ TEXT.nomor }} : {{ nomorSurat }}
        </span>

        <!-- <div class="flex items-center gap-2">
          <div v-if="fileUrl">
            <a :href="fileUrl" target="_blank">
              <ButtonComponent size="sm" variant="primary-outline">
                <UIcon name="ph:download-bold" class="h-4 w-4" />
                <span>{{ TEXT.download }}</span>
              </ButtonComponent>
            </a>
          </div>

          <div>
            <ButtonComponent
              size="sm"
              variant="primary"
              @click="emit('disposisi')"
            >
              <span>{{ TEXT.disposisi }}</span>
            </ButtonComponent>
          </div>
        </div> -->
      </div>

      <div v-if="tanggalSurat" class="flex items-center gap-2">
        <NuxtTime
          class="text-neutral-6 text-xs"
          :datetime="tanggalSurat"
          day="numeric"
          month="short"
          year="numeric"
          hour="2-digit"
          minute="2-digit"
          locale="id"
        />
      </div>

      <div v-if="disposisiCount > 0" class="flex items-center gap-2">
        <UIcon name="ph:users-bold" class="text-primary h-4 w-4" />
        <span class="text-primary text-sm font-medium">
          {{ disposisiCount }} {{ TEXT.disposisi }}
        </span>
      </div>

      <div class="border-neutral-9 border-t pt-3">
        <div class="flex items-center gap-2">
          <ButtonComponent
            size="sm"
            variant="outline"
            class="w-fit"
            @click="emit('detail')"
          >
            <UIcon name="ph:eye-bold" class="h-4 w-4" />
            <span>{{ TEXT.lihatDetail }}</span>
          </ButtonComponent>
          <div v-if="fileUrl">
            <a :href="fileUrl" target="_blank">
              <ButtonComponent size="sm" variant="primary-outline">
                <UIcon name="ph:download-bold" class="h-4 w-4" />
                <span>{{ TEXT.download }}</span>
              </ButtonComponent>
            </a>
          </div>

          <div>
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
  </CardComponent>
</template>
