<template>

  <div class="bg-neutral-2 min-h-screen overflow-x-hidden">
     <!-- Dashboard Layout -->
    <div class="flex h-screen overflow-hidden">
       <!-- Sidebar --> <DashboardSidebar /> <!-- Main Content Area -->
      <div class="flex flex-1 flex-col overflow-hidden min-w-0">
         <!-- Top Bar --> <DashboardTopbar /> <!-- Page Content -->
        <main class="bg-neutral-2 flex-1 overflow-y-auto p-6"> <slot /> </main>
         <!-- Footer --> <DashboardFooter />
      </div>

    </div>

  </div>

</template>

