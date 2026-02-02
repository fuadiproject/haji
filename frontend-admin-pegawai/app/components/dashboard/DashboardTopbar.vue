<script setup>
const { user, logout } = useAuth();
const route = useRoute();
const { toggleMobileMenu, isMobile } = useSidebar();

const currentTime = useRealtimeClock();

const handleLogout = async () => {
  console.log("handleLogout");
  await logout();
  await navigateTo("/auth/login");
};

// Breadcrumb generation
const breadcrumbs = computed(() => {
  const pathSegments = route.path
    .split("/")
    .filter((segment) => segment !== "");
  const crumbs = [];

  // Always start with Dashboard
  crumbs.push({
    label: "Dashboard",
    to: "/",
    isActive: route.path === "/",
  });

  // If we're not on the home page, build breadcrumbs from path
  if (pathSegments.length > 0) {
    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Convert segment to readable label
      let label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Custom labels for specific routes
      const customLabels = {
        "master-data": "Master Data",
        petunjuk: "Petunjuk",
        "sifat-surat": "Sifat Surat",
        "urgensi-surat": "Urgensi Surat",
        kepegawaian: "Kepegawaian",
        presensi: "Presensi",
        persuratan: "Persuratan",
        berita: "Berita",
        sop: "SOP",
        notifikasi: "Notifikasi",
        akun: "Akun",
      };

      if (customLabels[segment]) {
        label = customLabels[segment];
      }

      crumbs.push({
        label,
        to: currentPath,
        isActive: isLast,
      });
    });
  }

  return crumbs;
});
</script>

<template>
  <header class="border-neutral-9 border-b bg-white px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Mobile Menu Button + Page Title / Breadcrumb -->
      <div class="flex items-center gap-4">
        <!-- Hamburger Menu Button (Mobile Only) -->
        <button
          v-if="isMobile"
          class="hover:bg-neutral-2 flex items-center justify-center rounded-lg p-2 md:hidden"
          @click="toggleMobileMenu"
        >
          <UIcon name="ph:list" class="text-gray-title h-6 w-6" />
        </button>
        <div>
        <h2 class="text-gray-title mb-1 text-xl font-semibold">
          {{
            $route.meta.title ||
            breadcrumbs[breadcrumbs.length - 1]?.label ||
            "Dashboard"
          }}
        </h2>
        <!-- Breadcrumb Navigation -->
        <nav
          class="flex items-center space-x-1 text-sm"
          aria-label="Breadcrumb"
        >
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.to">
            <!-- Breadcrumb Item -->
            <div class="flex items-center">
              <!-- Separator (not for first item) -->
              <UIcon
                v-if="index > 0"
                name="ph:caret-right"
                class="text-gray-4 mx-1 h-3 w-3"
              />
              <!-- Breadcrumb Link/Text -->
              <NuxtLink
                v-if="!crumb.isActive"
                :to="crumb.to"
                class="text-gray-4 hover:text-primary-main transition-colors duration-200 hover:underline"
              >
                {{ crumb.label }}
              </NuxtLink>
              <span v-else class="text-primary-main font-medium">
                {{ crumb.label }}
              </span>
            </div>
          </template>
        </nav>
      </div>
      </div>
      <!-- Right Section -->
      <div class="flex items-center gap-4">
        <!-- Current Time -->
        <div class="text-gray-4 hidden text-sm md:block">
          <span class="text-primary-main font-medium">{{
            currentTime.currentDate
          }}</span>
          <span class="text-primary-main mx-2 font-medium">•</span>
          <span class="text-primary-main font-medium">{{
            currentTime.currentTime
          }}</span>
        </div>
        <!-- User Menu -->
        <div class="flex items-center gap-3">
          <div class="hidden text-right md:block">
            <p class="text-gray-title text-sm font-medium">
              {{ user?.name || "Admin User" }}
            </p>

            <p class="text-gray-subtitle text-xs">
              {{ user?.role || "Administrator" }}
            </p>
          </div>
          <!-- User Avatar & Dropdown -->
          <UDropdownMenu
            :items="[              
              [
                {
                  label: 'Logout',
                  icon: 'ph:sign-out',
                  slot: 'logout',
                  onSelect() {
                    handleLogout();
                  },
                },
              ],
            ]"
          >
            <button
              class="hover:bg-neutral-2 flex items-center gap-2 rounded-lg p-2"
            >
              <NuxtImg
                src="/images/default-avatar.svg"
                alt="User Avatar"
                class="h-8 w-8 rounded-full"
              />
              <UIcon name="ph:caret-down" class="text-gray-4 h-4 w-4" />
            </button>
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>
