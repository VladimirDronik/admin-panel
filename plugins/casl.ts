// import { abilitiesPlugin } from '@casl/vue';
// import { defineNuxtPlugin } from '#app';
// import { defineAbilitiesFor } from '~/utils/abilities';
// import { useUserStore } from '~/stores/user';

// export default defineNuxtPlugin((nuxtApp) => {
//   const storeUser = useUserStore();

//   const user = {
//     id: storeUser.userLocal?.id ?? 0, // Дефолтный ID
//     type: storeUser.userLocal?.type ?? 'user', // Дефолтная роль
//   };

//   // Создаём способности пользователя
//   const abilities = defineAbilitiesFor(user);

//   // Регистрируем CASL как плагин Vue
//   nuxtApp.vueApp.use(abilitiesPlugin, abilities);

//   // Делаем объект abilities доступным через useNuxtApp
//   nuxtApp.provide('abilities', abilities);
// });
