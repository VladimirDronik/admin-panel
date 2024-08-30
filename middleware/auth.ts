// Composable modules
import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const storeAuth = useAuthStore();

  if (!storeAuth.user) {
    return navigateTo('/login');
  }
});
