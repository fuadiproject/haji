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
  stopAutoPlay();
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;
  e.preventDefault(); // Prevent scrolling
  touchEndX.value = e.touches[0].clientX;
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

  isDragging.value = false;
  startAutoPlay();
};

// Mouse drag handlers for desktop
const handleMouseDown = (e) => {
  touchStartX.value = e.clientX;
  isDragging.value = true;
  stopAutoPlay();
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  touchEndX.value = e.clientX;
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

  isDragging.value = false;
  startAutoPlay();
};

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
    class="relative h-full w-full cursor-grab overflow-hidden select-none active:cursor-grabbing"
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
        <NuxtImg
          v-if="banner.src"
          :src="banner.src"
          alt="Banner"
          class="h-full w-full object-cover"
        />
      </div>
    </div>
  </div>
</template>
