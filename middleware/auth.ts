// Composable modules
import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const storeAuth = useAuthStore();

  if (!storeAuth.user) {
    if (!localStorage.getItem('token')) {
      return navigateTo('/auth/login');
    }
  }
});
