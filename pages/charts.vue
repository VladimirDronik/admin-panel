<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Chart from 'primevue/chart';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.charts')),
});

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        tension: 0.4,
      },
      {
        label: 'Second Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
        tension: 0.4,
      },
    ],
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};
</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.charts" />
    <div class="chart-panel">
      <div class="tw-mb-5 tw-flex tw-h-full tw-flex-col tw-gap-2 tw-rounded-lg tw-border tw-p-3">
        <Select placeholder="Выберите Категорию" />
        <InputText placeholder="Поиск" />
        <div class="tw-flex tw-flex-col tw-gap-2">
          <div class="tw-h-20 tw-w-full tw-rounded tw-bg-slate-300" />
          <div class="tw-h-20 tw-w-full tw-rounded tw-bg-slate-300" />
          <div class="tw-h-20 tw-w-full tw-rounded tw-bg-slate-300" />
        </div>
      </div>
      <div class="tw-h-full tw-rounded-lg tw-border tw-p-3">
        <Chart
          class="tw-h-full"
          :data="chartData"
          :options="chartOptions"
          type="line"
        />
      </div>
    </div>
  </SharedUIPanel>
</template>

<style>
.chart-panel {
  gap: 30px;
  display: grid;
  min-height: 500px;
  grid-template-columns: 300px 1fr;
}
</style>
