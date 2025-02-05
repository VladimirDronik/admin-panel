// Composable modules
import { useStorage } from '@vueuse/core';

export default defineNuxtRouteMiddleware((_to, _from) => {
  // Composable
  const localState = useStorage('touch-on', {
    token: '',
    openSidebar: true,
    language: 'ru',
  });

  if (!localState.value.token) {
    return navigateTo('/auth/login');
  }
});
