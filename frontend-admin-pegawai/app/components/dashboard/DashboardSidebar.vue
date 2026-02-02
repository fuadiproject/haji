<script setup>
const route = useRoute();
const { user } = useAuth();
const { isMobileMenuOpen, isMobile, toggleMobileMenu, closeMobileMenu, checkMobile } = useSidebar();

const expandedItems = ref(new Set());
const isCollapsed = ref(false);

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Close mobile menu when navigating
watch(
  () => route.path,
  () => {
    closeMobileMenu();
  },
);

const adminPusatMenu = [
  { id: "dashboard", name: "Dashboard", icon: "ph:house", to: "/" },
  { id: "users", name: "Manajemen User", icon: "ph:users", to: "/users" },
  {
    id: "rekap-presensi",
    name: "Rekap Presensi",
    icon: "ph:calendar-check",
    to: "/rekap-presensi",
  },
];

const adminSatkerMenu = [
  { id: "dashboard", name: "Dashboard", icon: "ph:house", to: "/" },
  {
    id: "rekap-presensi",
    name: "Rekap Presensi",
    icon: "ph:calendar-check",
    to: "/rekap-presensi",
  },
  {
    id: "approval-izin",
    name: "Approval Izin",
    icon: "ph:check-circle",
    to: "/approval-izin",
  },
];

const menuItems = computed(() => {
  return user.value?.role === "admin_pusat" ? adminPusatMenu : adminSatkerMenu;
});

const isActive = (path) => {
  return route.path === path;
};

const isParentActive = (item) => {
  if (!item.children) return false;
  return item.children.some((child) => isActive(child.to));
};

const toggleExpanded = (itemId) => {
  if (isCollapsed.value) return;

  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId);
  } else {
    expandedItems.value.add(itemId);
  }
};

const isExpanded = (itemId) => {
  return !isCollapsed.value && expandedItems.value.has(itemId);
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  if (isCollapsed.value) {
    expandedItems.value.clear();
  }
};

onMounted(() => {
  menuItems.value.forEach((item) => {
    if (item.children && isParentActive(item)) {
      expandedItems.value.add(item.id);
    }
  });
});

watch(
  () => route.path,
  () => {
    if (!isCollapsed.value) {
      menuItems.value.forEach((item) => {
        if (item.children && isParentActive(item)) {
          expandedItems.value.add(item.id);
        }
      });
    }
  },
);

watch(isCollapsed, (newValue) => {
  if (!newValue) {
    menuItems.value.forEach((item) => {
      if (item.children && isParentActive(item)) {
        expandedItems.value.add(item.id);
      }
    });
  }
});
</script>

<template>
  <!-- Mobile Overlay -->
  <div
    v-if="isMobile && isMobileMenuOpen"
    class="fixed inset-0 z-40 bg-black/50 md:hidden"
    @click="toggleMobileMenu"
  />

  <!-- Sidebar -->
  <aside
    class="bg-white shadow-lg transition-all duration-300 ease-in-out"
    :class="[
      isCollapsed ? 'w-16' : 'w-64',
      isMobile
        ? 'fixed inset-y-0 left-0 z-50 transform ' +
          (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')
        : 'relative flex-shrink-0 overflow-visible',
    ]"
  >
    <div class="flex h-full flex-col">
      <!-- Logo Section -->
      <div
        class="border-neutral-9 relative flex items-center border-b transition-all duration-300"
        :class="isCollapsed ? 'justify-center p-4' : 'gap-3 p-6'"
      >
        <button
          class="bg-primary-main hover:bg-primary-dark absolute -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md transition-all duration-200"
          :class="[isCollapsed ? 'top-4 rotate-180' : 'top-6']"
          @click="toggleSidebar"
        >
          <UIcon name="ph:caret-left" class="h-4 w-4" />
        </button>
        <img
          src="/images/logo.png"
          alt="Logo"
          :class="[isCollapsed ? 'h-8 w-16' : 'h-10 w-12']"
        />
        <div v-show="!isCollapsed" class="transition-opacity duration-300">
          <h1 class="text-gray-title text-lg font-semibold">
            Presensi Admin BPHJ
          </h1>
        </div>
      </div>
      <!-- Navigation Menu -->
      <nav
        class="dashboard-sidebar flex-1 overflow-y-auto transition-all duration-300"
        :class="isCollapsed ? 'overflow-hidden p-2' : 'p-4'"
      >
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.id">
            <!-- Parent Menu Item -->
            <div v-if="item.children">
              <button
                class="group relative flex w-full items-center rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                :class="[
                  {
                    'bg-primary-main text-white shadow-md':
                      isParentActive(item) || isActive(item.to),
                    'text-gray-4 hover:bg-neutral-2 hover:text-primary-main':
                      !isParentActive(item) && !isActive(item.to),
                  },
                  isCollapsed
                    ? 'justify-center px-2 py-3'
                    : 'justify-between gap-3 px-4 py-3',
                ]"
                @click="toggleExpanded(item.id)"
              >
                <div
                  class="flex items-center"
                  :class="isCollapsed ? '' : 'gap-3'"
                >
                  <UIcon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
                  <span
                    v-show="!isCollapsed"
                    class="transition-opacity duration-300"
                    >{{ item.name }}</span
                  >
                </div>
                <UIcon
                  v-show="!isCollapsed"
                  name="ph:caret-down"
                  class="h-4 w-4 transition-all duration-300 ease-in-out"
                  :class="{ 'rotate-180': isExpanded(item.id) }"
                />
                <div
                  v-if="isCollapsed"
                  class="pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 transform rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style="max-width: calc(100vw - 5rem)"
                >
                  {{ item.name }}
                </div>
              </button>
              <!-- Child Menu Items -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0 transform -translate-y-2"
                enter-to-class="opacity-100 max-h-96 transform translate-y-0"
                leave-active-class="transition-all duration-250 ease-in"
                leave-from-class="opacity-100 max-h-96 transform translate-y-0"
                leave-to-class="opacity-0 max-h-0 transform -translate-y-2"
              >
                <ul
                  v-show="isExpanded(item.id)"
                  class="mt-2 ml-4 space-y-1 overflow-hidden"
                >
                  <li v-for="(child, index) in item.children" :key="child.id">
                    <NuxtLink
                      :to="child.to"
                      class="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                      :class="{
                        'bg-primary-main text-white shadow-md': isActive(
                          child.to,
                        ),
                        'text-gray-4 hover:bg-neutral-2 hover:text-primary-main':
                          !isActive(child.to),
                      }"
                      :style="{
                        transitionDelay: isExpanded(item.id)
                          ? `${index * 50}ms`
                          : '0ms',
                      }"
                    >
                      <div
                        class="h-2 w-2 rounded-full bg-current opacity-50 transition-all duration-200"
                      ></div>
                      {{ child.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </Transition>
            </div>
            <!-- Regular Menu Item (no children) -->
            <NuxtLink
              v-else
              :to="item.to"
              class="group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              :class="[
                {
                  'bg-primary-main text-white shadow-md': isActive(item.to),
                  'text-gray-4 hover:bg-neutral-2 hover:text-primary-main':
                    !isActive(item.to),
                },
                isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3',
              ]"
            >
              <UIcon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span
                v-show="!isCollapsed"
                class="transition-opacity duration-300"
                >{{ item.name }}</span
              >
              <div
                v-if="isCollapsed"
                class="pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 transform rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style="max-width: calc(100vw - 5rem)"
              >
                {{ item.name }}
              </div>
            </NuxtLink>
          </li>
        </ul>
      </nav>     
    </div>
  </aside>
</template>
