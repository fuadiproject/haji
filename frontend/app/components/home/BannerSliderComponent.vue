<script setup>
const props = defineProps({
  banners: {
    type: Array,
    default: () => [],
  },
  autoPlay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 5000,
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:currentIndex"]);

const sliderRef = ref(null);
let autoPlayTimer = null;

// Touch/Swipe variables
const touchStartX = ref(0);
const touchEndX = ref(0);
const isDragging = ref(false);
const hasDragged = ref(false);

const nextSlide = () => {
  const nextIndex = (props.currentIndex + 1) % props.banners.length;
  emit("update:currentIndex", nextIndex);
};

const prevSlide = () => {
  const prevIndex =
    props.currentIndex === 0
      ? props.banners.length - 1
      : props.currentIndex - 1;
  emit("update:currentIndex", prevIndex);
};

// Touch/Swipe handlers
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  isDragging.value = true;
  hasDragged.value = false;
  stopAutoPlay();
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;
  e.preventDefault(); // Prevent scrolling
  touchEndX.value = e.touches[0].clientX;
  if (Math.abs(touchStartX.value - touchEndX.value) > 5) {
    hasDragged.value = true;
  }
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;

  const swipeThreshold = 50; // Minimum distance for swipe
  const swipeDistance = touchStartX.value - touchEndX.value;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      // Swipe left - next slide
      nextSlide();
    } else {
      // Swipe right - previous slide
      prevSlide();
    }
  }

  // Reset after a short delay to allow click handler to check hasDragged
  setTimeout(() => {
    isDragging.value = false;
    hasDragged.value = false;
  }, 100);
  startAutoPlay();
};

// Mouse drag handlers for desktop
const handleMouseDown = (e) => {
  touchStartX.value = e.clientX;
  isDragging.value = true;
  hasDragged.value = false;
  stopAutoPlay();
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  touchEndX.value = e.clientX;
  if (Math.abs(touchStartX.value - touchEndX.value) > 5) {
    hasDragged.value = true;
  }
};

const handleMouseUp = () => {
  if (!isDragging.value) return;

  const swipeThreshold = 50;
  const swipeDistance = touchStartX.value - touchEndX.value;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  // Reset after a short delay to allow click handler to check hasDragged
  setTimeout(() => {
    isDragging.value = false;
    hasDragged.value = false;
  }, 100);
  startAutoPlay();
};

const handleLinkClick = (e, banner) => {
  // Prevent link click if user was dragging
  if (hasDragged.value) {
    e.preventDefault();
    return;
  }

  // If it's an external link, open in new tab
  if (
    banner.url &&
    (banner.url.startsWith("http://") || banner.url.startsWith("https://"))
  ) {
    window.open(banner.url, "_blank", "noopener,noreferrer");
    e.preventDefault();
  }
};

const hasLink = (banner) => {
  return banner && banner.url;
};

const currentBannerHasLink = computed(() => {
  const currentBanner = props.banners[props.currentIndex];
  return hasLink(currentBanner);
});

const startAutoPlay = () => {
  if (props.autoPlay && props.banners.length > 1) {
    autoPlayTimer = setInterval(nextSlide, props.interval);
  }
};

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<template>
  <div
    class="relative h-full w-full overflow-hidden select-none"
    :class="{
      'cursor-grab active:cursor-grabbing': !currentBannerHasLink || isDragging,
      'cursor-pointer': currentBannerHasLink && !isDragging,
    }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <!-- Banner Container -->
    <div ref="sliderRef" class="relative h-full w-full">
      <div
        v-for="(banner, index) in banners"
        :key="banner.id"
        class="absolute inset-0 h-full w-full transition-opacity duration-500 select-none"
        :class="{
          'opacity-100': index === props.currentIndex,
          'opacity-0': index !== props.currentIndex,
        }"
      >
        <component :is="banner.component" v-if="banner.component" />
        <NuxtLink
          v-if="banner.url"
          :to="banner.url"
          class="relative block h-full w-full"
          @click="handleLinkClick($event, banner)"
        >
          <NuxtImg
            v-if="banner.src"
            :src="banner.src"
            alt="Banner"
            class="h-full w-full object-cover"
          />
          <!-- Description Overlay -->
          <div
            v-if="banner.description"
            class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-16 pb-16"
          >
            <p
              class="text-center text-sm leading-relaxed font-medium text-white"
            >
              {{ banner.description }}
            </p>
          </div>
        </NuxtLink>
        <div v-else class="relative h-full w-full">
          <NuxtImg
            v-if="banner.src"
            :src="banner.src"
            alt="Banner"
            class="h-full w-full object-cover"
          />
          <!-- Description Overlay -->
          <div
            v-if="banner.description"
            class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-16 pb-16"
          >
            <p
              class="text-center text-sm leading-relaxed font-medium text-white"
            >
              {{ banner.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
