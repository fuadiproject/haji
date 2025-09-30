<template>

  <footer class="border-neutral-9 border-t bg-white px-6 py-4">

    <div class="text-gray-4 flex items-center justify-between text-sm">

      <div>
         © {{ new Date().getFullYear() }} Kementerian Haji dan Umrah. All
        rights reserved.
      </div>

      <div class="flex items-center gap-4">
         <span>Version 1.0.0</span> <span>•</span> <NuxtLink
          to="/help"
          class="hover:text-primary-main"
          > Help </NuxtLink
        > <span>•</span> <NuxtLink to="/privacy" class="hover:text-primary-main"
          > Privacy </NuxtLink
        >
      </div>

    </div>

  </footer>

</template>

