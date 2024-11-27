// Composable modules
import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware((_to, _from) => {
  // Composable
  const storeUser = useUserStore();

  if (!storeUser.userLocal) {
    if (!localStorage.getItem('touchOn')) {
      return navigateTo('/auth/login');
    }
  }
});
