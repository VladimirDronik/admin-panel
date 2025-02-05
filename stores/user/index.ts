import { defineStore } from 'pinia';

export const useUserStore = defineStore('UserStore', () => {
  // Variables
  const version = import.meta.env.VITE_VERSION ?? '2.0';
  // Composables
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'p-dark',
    valueLight: 'p-light',
    storageKey: 'touch-on-color',
  });
  // Methods
  const toggleDark = useToggle(isDark);
  return {
    version,
    isDark,
    toggleDark,
  };
});
