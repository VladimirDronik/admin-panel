import { defineStore } from 'pinia';

export const useUserStore = defineStore('UserStore', () => {

  // Composables
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'p-dark',
    valueLight: 'p-light',
    storageKey: 'touch-on-color',
  })

  // Methods
  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark
  }
});
