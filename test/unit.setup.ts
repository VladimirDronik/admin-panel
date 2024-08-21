import { createI18n } from 'vue-i18n';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueDatePicker from '@vuepic/vue-datepicker';
import VueTablerIcons from 'vue-tabler-icons';
// @ts-ignore
import Vue3EasyDataTable from 'vue3-easy-data-table';
import messages from '@/locales/messages';

export const plugins = (language: string = 'en', plugins: any[] = []) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: language,
    messages,
  });

  return [i18n, ...plugins];
};

export const components = {
  VueEasyDatePicker: VueDatePicker,
  EasyDataTable: Vue3EasyDataTable,
  PerfectScrollbarPlugin,
  VueApexCharts,
  VueTablerIcons,
};
