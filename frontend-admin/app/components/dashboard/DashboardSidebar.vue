<script setup>
const route = useRoute();

// State for managing expanded menu items
const expandedItems = ref(new Set());

const menuItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: "ph:house",
    to: "/",
  },
  {
    id: "master-data",
    name: "Master Data",
    icon: "ph:users",    
    children: [
      {
        id: "petunjuk",
        name: "Petunjuk",
        to: "/master-data/petunjuk",
      },
      {
        id: "sifat-surat",
        name: "Sifat Surat",
        to: "/master-data/sifat-surat",
      },
      {
        id: "urgensi-surat",
        name: "Urgensi Surat",
        to: "/master-data/urgensi-surat",
      }      
    ],
  } 
];

const isActive = (path) => {
  return route.path === path;
};

const isParentActive = (item) => {
  if (!item.children) return false;
  return item.children.some(child => isActive(child.to));
};

const toggleExpanded = (itemId) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId);
  } else {
    expandedItems.value.add(itemId);
  }
};

const isExpanded = (itemId) => {
  return expandedItems.value.has(itemId);
};

// Auto-expand parent menu if child is active
onMounted(() => {
  menuItems.forEach(item => {
    if (item.children && isParentActive(item)) {
      expandedItems.value.add(item.id);
    }
  });
});

// Watch route changes to auto-expand parent menus
watch(() => route.path, () => {
  menuItems.forEach(item => {
    if (item.children && isParentActive(item)) {
      expandedItems.value.add(item.id);
    }
  });
});
</script>

<template>
  <aside class="w-64 bg-white shadow-lg">
    <div class="flex h-full flex-col">
      <!-- Logo Section -->
      <div class="border-neutral-9 flex items-center gap-3 border-b p-6">
        <NuxtImg src="/images/logo.svg" alt="Logo" class="h-10 w-10" />
        <div>
          <h1 class="text-gray-title text-lg font-semibold">Haji Admin</h1>
          <p class="text-gray-subtitle text-sm">Dashboard</p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="dashboard-sidebar flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.id">
            <!-- Parent Menu Item -->
            <div v-if="item.children">
              <!-- Parent Menu Button -->
              <button
                class="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                :class="{
                  'bg-primary-main text-white shadow-md': isParentActive(item) || isActive(item.to),
                  'text-gray-4 hover:bg-neutral-2 hover:text-primary-main':
                    !isParentActive(item) && !isActive(item.to),
                }"
                @click="toggleExpanded(item.id)"
              >
                <div class="flex items-center gap-3">
                  <UIcon :name="item.icon" class="h-5 w-5" />
                  {{ item.name }}
                </div>
                <UIcon
                  name="ph:caret-down"
                  class="h-4 w-4 transition-transform duration-300 ease-in-out"
                  :class="{ 'rotate-180': isExpanded(item.id) }"
                />
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
                <ul v-show="isExpanded(item.id)" class="ml-4 mt-2 space-y-1 overflow-hidden">
                  <li v-for="(child, index) in item.children" :key="child.id">
                    <NuxtLink
                      :to="child.to"
                      class="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                      :class="{
                        'bg-primary-main text-white shadow-md': isActive(child.to),
                        'text-gray-4 hover:bg-neutral-2 hover:text-primary-main':
                          !isActive(child.to),
                      }"
                      :style="{
                        transitionDelay: isExpanded(item.id) ? `${index * 50}ms` : '0ms'
                      }"
                    >
                      <div class="h-2 w-2 rounded-full bg-current opacity-50 transition-all duration-200"></div>
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
              class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              :class="{
                'bg-primary-main text-white shadow-md': isActive(item.to),
                'text-gray-4 hover:bg-neutral-2 hover:text-primary-main':
                  !isActive(item.to),
              }"
            >
              <UIcon :name="item.icon" class="h-5 w-5" />
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- User Profile Section -->
      <div class="border-neutral-9 border-t p-4">
        <NuxtLink
          to="/akun"
          class="hover:bg-neutral-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
          :class="{
            'bg-primary-main text-white shadow-md': isActive('/akun'),
            'text-gray-4': !isActive('/akun'),
          }"
        >
          <UIcon name="ph:user-circle" class="h-5 w-5" />
          Akun
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
