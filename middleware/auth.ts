export default defineNuxtRouteMiddleware((_to, _from) => {
  // Composable
  const storeUser = useUserStore();

  if (!storeUser.localState.token) {
    return navigateTo('/auth/login');
  }
});
