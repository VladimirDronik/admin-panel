
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
// @ts-ignore
import Vue3EasyDataTable from 'vue3-easy-data-table';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PerfectScrollbarPlugin);
  nuxtApp.vueApp.use(VueApexCharts);
  nuxtApp.vueApp.use(VueTablerIcons);
  nuxtApp.vueApp.component('EasyDataTable', Vue3EasyDataTable);
});
