const activeTab = ref(0);

export const useKepegawaian = () => {
  // State untuk menu aktif

  const menu = ref([
    {
      name: "Profil",
      to: "profil",
    },
    {
      name: "Riwayat Kepangkatan",
      to: "riwayat-kepangkatan",
    },
    {
      name: "Riwayat Jabatan",
      to: "riwayat-jabatan",
    },
    {
      name: "Riwayat Cuti",
      to: "riwayat-cuti",
    },
    {
      name: "Riwayat Pendidikan",
      to: "riwayat-pendidikan",
    },
    {
      name: "Data Tempat Tinggal",
      to: "data-tempat-tinggal",
    },
    {
      name: "Data Anggota Keluarga",
      to: "data-anggota-keluarga",
    },
    {
      name: "Data Kehadiran",
      to: "data-kehadiran",
    },
    {
      name: "Task / Penugasan",
      to: "task-penugasan",
    },
    {
      name: "Struktur Organisasi",
      to: "struktur-organisasi",
    },
    {
      name: "Work From Home/Anywhere (WFH/A)",
      to: "work-from-home-anywhere",
    },
  ]);

  const getMenuIcon = computed(() => (menuName) => {
    const iconMap = {
      Profil: "lucide:user",
      "Riwayat Kepangkatan": "lucide:award",
      "Riwayat Jabatan": "lucide:briefcase",
      "Riwayat Cuti": "lucide:calendar",
      "Riwayat Pendidikan": "lucide:graduation-cap",
      "Data Tempat Tinggal": "lucide:home",
      "Data Anggota Keluarga": "lucide:users",
      "Data Kehadiran": "lucide:clock",
      "Task / Penugasan": "lucide:check-square",
      "Struktur Organisasi": "fluent:organization-24-regular",
      "Work From Home/Anywhere (WFH/A)": "lucide:laptop",
    };

    return iconMap[menuName] || "lucide:file-text";
  });

  // Handle menu selection
  const handleMenuSelect = (index) => {
    console.log(index);
    activeTab.value = index;
    // Navigate ke halaman yang sesuai
    navigateTo(`/kepegawaian/${menu.value[index].to}`);
  };

  return {
    menu,
    getMenuIcon,
    activeTab,
    handleMenuSelect,
  };
};
