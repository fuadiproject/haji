<script setup>
const route = useRoute();

// State for managing expanded menu items
const expandedItems = ref(new Set());
// State for sidebar collapse
const isCollapsed = ref(false);

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
  },
  {
    id: "banner",
    name: "Banner",
    icon: "ph:image",
    to: "/banner",
  },
  {
    id: "hyperlink",
    name: "Hyperlink",
    icon: "ph:link",
    to: "/hyperlink",
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
  if (isCollapsed.value) return; // Don't expand when collapsed
  
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
  // Close all expanded items when collapsing
  if (isCollapsed.value) {
    expandedItems.value.clear();
  }
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
  if (!isCollapsed.value) {
    menuItems.forEach(item => {
      if (item.children && isParentActive(item)) {
        expandedItems.value.add(item.id);
      }
    });
  }
});

// Watch collapsed state to auto-expand when opening
watch(isCollapsed, (newValue) => {
  if (!newValue) {
    // Re-expand parent menus when sidebar is opened
    menuItems.forEach(item => {
      if (item.children && isParentActive(item)) {
        expandedItems.value.add(item.id);
      }
    });
  }
});
</script>

<template>
  <aside 
    class="bg-white shadow-lg transition-all duration-300 ease-in-out flex-shrink-0 relative overflow-visible"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex h-full flex-col">
      <!-- Logo Section -->
      <div 
        class="border-neutral-9 flex items-center border-b relative transition-all duration-300"
        :class="isCollapsed ? 'justify-center p-4' : 'gap-3 p-6'"
      >
        <!-- Toggle Button -->
        <button
          class="absolute -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary-main text-white shadow-md transition-all duration-200 hover:bg-primary-dark"
          :class="[
            isCollapsed ? 'rotate-180 top-4' : 'top-6'
          ]"
          @click="toggleSidebar"
        >
          <UIcon name="ph:caret-left" class="h-4 w-4" />
        </button>

        <NuxtImg src="/images/logo.svg" alt="Logo" class="h-10 w-10 flex-shrink-0" />
        <div v-show="!isCollapsed" class="transition-opacity duration-300">
          <h1 class="text-gray-title text-lg font-semibold">BPHJ Admin Panel</h1>          
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav 
        class="dashboard-sidebar flex-1 overflow-y-auto transition-all duration-300"
        :class="isCollapsed ? 'p-2 overflow-hidden' : 'p-4'"
      >
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.id">
            <!-- Parent Menu Item -->
            <div v-if="item.children">
              <!-- Parent Menu Button -->
              <button
                class="flex w-full items-center rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm group relative"
                :class="[
                  {
                    'bg-primary-main text-white shadow-md': isParentActive(item) || isActive(item.to),
                    'text-gray-4 hover:bg-neutral-2 hover:text-primary-main':
                      !isParentActive(item) && !isActive(item.to),
                  },
                  isCollapsed ? 'justify-center px-2 py-3' : 'justify-between gap-3 px-4 py-3'
                ]"
                @click="toggleExpanded(item.id)"
              >
                <div class="flex items-center" :class="isCollapsed ? '' : 'gap-3'">
                  <UIcon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
                  <span v-show="!isCollapsed" class="transition-opacity duration-300">{{ item.name }}</span>
                </div>
                <UIcon
                  v-show="!isCollapsed"
                  name="ph:caret-down"
                  class="h-4 w-4 transition-all duration-300 ease-in-out"
                  :class="{ 'rotate-180': isExpanded(item.id) }"
                />
                
                <!-- Tooltip for collapsed state -->
                <div
                  v-if="isCollapsed"
                  class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2"
                  style="max-width: calc(100vw - 5rem);"
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
              class="flex items-center rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm group relative"
              :class="[
                {
                  'bg-primary-main text-white shadow-md': isActive(item.to),
                  'text-gray-4 hover:bg-neutral-2 hover:text-primary-main':
                    !isActive(item.to),
                },
                isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
              ]"
            >
              <UIcon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span v-show="!isCollapsed" class="transition-opacity duration-300">{{ item.name }}</span>
              
              <!-- Tooltip for collapsed state -->
              <div
                v-if="isCollapsed"
                class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2"
                style="max-width: calc(100vw - 5rem);"
              >
                {{ item.name }}
              </div>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- User Profile Section -->
      <div 
        class="border-neutral-9 border-t transition-all duration-300"
        :class="isCollapsed ? 'p-2' : 'p-4'"
      >
        <NuxtLink
          to="/akun"
          class="hover:bg-neutral-2 flex items-center rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm group relative"
          :class="[
            {
              'bg-primary-main text-white shadow-md': isActive('/akun'),
              'text-gray-4': !isActive('/akun'),
            },
            isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
          ]"
        >
          <UIcon name="ph:user-circle" class="h-5 w-5 flex-shrink-0" />
          <span v-show="!isCollapsed" class="transition-opacity duration-300">Akun</span>
          
          <!-- Tooltip for collapsed state -->
          <div
            v-if="isCollapsed"
            class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2"
            style="max-width: calc(100vw - 5rem);"
          >
            Akun
          </div>
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
