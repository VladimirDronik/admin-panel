// Composable modules
import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware((_to, _from) => {
  // Composable
  const storeAuth = useAuthStore();

  if (!storeAuth.user) {
    if (!localStorage.getItem('token')) {
      return navigateTo('/auth/login');
    }
  }
});
