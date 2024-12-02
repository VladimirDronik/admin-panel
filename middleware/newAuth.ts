import { defineNuxtRouteMiddleware, useNuxtApp } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  const nuxtApp = useNuxtApp();
  const abilities = nuxtApp.$abilities;

  if (to.meta.resource && !abilities.can('read', to.meta.resource)) {
    return navigateTo('/unauthorized');
  }
});
