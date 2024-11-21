import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueDatePicker from '@vuepic/vue-datepicker';
import VueTablerIcons from 'vue-tabler-icons';
// @ts-ignore
import Vue3EasyDataTable from 'vue3-easy-data-table';
import GridLayout from 'vue-grid-layout3';
import 'vue-grid-layout3/dist/style.css';
import '@/scss/style.scss';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PerfectScrollbarPlugin);
  nuxtApp.vueApp.use(VueApexCharts);
  nuxtApp.vueApp.use(VueTablerIcons);
  nuxtApp.vueApp.use(GridLayout);
  nuxtApp.vueApp.component('EasyDataTable', Vue3EasyDataTable);
  nuxtApp.vueApp.component('VueEasyDatePicker', VueDatePicker);
});
