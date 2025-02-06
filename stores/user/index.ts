import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

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
  const localState = useStorage('touch-on', {
    token: '',
    openSidebar: true,
    language: 'ru',
  });

  // Methods
  const toggleDark = useToggle(isDark);
  return {
    version,
    isDark,
    localState,
    toggleDark,
  };
});
