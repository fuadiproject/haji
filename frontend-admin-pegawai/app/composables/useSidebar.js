const isMobileMenuOpen = ref(false);
const isMobile = ref(false);

export const useSidebar = () => {
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
  };

  const checkMobile = () => {
    if (typeof window !== "undefined") {
      isMobile.value = window.innerWidth < 768;
      if (!isMobile.value) {
        isMobileMenuOpen.value = false;
      }
    }
  };

  return {
    isMobileMenuOpen,
    isMobile,
    toggleMobileMenu,
    closeMobileMenu,
    checkMobile,
  };
};
