import { ref, computed, readonly } from "vue";

const isDark = ref(false);

const themes = [
  {
    name: "--ui-bg",
    value: "#ffffff",
    darkValue: "#0E0E14",
  },
  {
    name: "--ui-primary",
    value: "#71510b",
    darkValue: "#A67A20",
  },
  {
    name: "--ui-secondary",
    value: "#c3a61f",
    darkValue: "#c3a61f",
  },
  {
    name: "--ui-primary-3",
    value: "#EFDCC5",
    darkValue: "#0B0D0F",
  },
  {
    name: "--ui-primary-4",
    value: "#F8F5F0",
    darkValue: "#0B0D0F",
  },
  {
    name: "--ui-container-main",
    value: "#ffffff",
    darkValue: "#0E0E14",
  },
  {
    name: "--ui-container-secondary",
    value: "#ffffff",
    darkValue: "#15151D",
  },
  {
    name: "--ui-border-main",
    value: "#E9E9E9",
    darkValue: "#202123",
  },
  {
    name: "--ui-body-1",
    value: "#222222",
    darkValue: "#FFFFFF",
  },
  {
    name: "--ui-body-2",
    value: "#35405A",
    darkValue: "#FFFFFF",
  },
  {
    name: "--ui-body-3",
    value: "#838A9A",
    darkValue: "#838A9A",
  },
  {
    name: "--ui-body-4",
    value: "#666666",
    darkValue: "#838A9A",
  },
  {
    name: "--ui-body-5",
    value: "#888888",
    darkValue: "#A4AABA",
  },
  {
    name: "--ui-body-6",
    value: "#A4AABA",
    darkValue: "#A4AABA",
  },
  {
    name: "--ui-body-7",
    value: "#777777",
    darkValue: "#777777",
  },
  {
    name: "--ui-body-8",
    value: "#444444",
    darkValue: "#e4e4e4",
  },
  {
    name: "--ui-body-9",
    value: "#f3f5f6",
    darkValue: "#f3f5f6",
  },
  {
    name: "--ui-body-10",
    value: "#f6f6f6",
    darkValue: "#f6f6f6",
  },
  {
    name: "--ui-body-11",
    value: "#101828",
    darkValue: "#ffffff",
  },
];

export const useTheme = () => {
  // Initialize theme from localStorage or default to light
  const initializeTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        isDark.value = true;
        document.documentElement.classList.add("dark");
        themes.forEach((theme) => {
          document.documentElement.style.setProperty(
            theme.name,
            theme.darkValue,
          );
        });
      } else {
        isDark.value = false;
        document.documentElement.classList.remove("dark");
        themes.forEach((theme) => {
          document.documentElement.style.setProperty(theme.name, theme.value);
        });
      }
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value;

    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        themes.forEach((theme) => {
          document.documentElement.style.setProperty(
            theme.name,
            theme.darkValue,
          );
        });
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        themes.forEach((theme) => {
          document.documentElement.style.setProperty(theme.name, theme.value);
        });
      }
    }
  };

  // Set specific theme
  const setTheme = (theme) => {
    if (theme === "dark") {
      isDark.value = true;
      if (import.meta.client) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    } else {
      isDark.value = false;
      if (import.meta.client) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  // Computed properties
  const currentTheme = computed(() => (isDark.value ? "dark" : "light"));
  const isLight = computed(() => !isDark.value);

  // Initialize theme on mount
  if (import.meta.client) {
    initializeTheme();
  }

  return {
    isDark: readonly(isDark),
    isLight,
    currentTheme,
    toggleTheme,
    setTheme,
    initializeTheme,
  };
};
