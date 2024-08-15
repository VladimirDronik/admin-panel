<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types
import type { Filter } from '@/types/MainTypes';

// Composables
const { t } = useI18n();

// Variables
const perPage = 10;

const page = ref(1);

const filters = ref<Filter[]>([
  {
    label: 'Название',
    key: 'name',
    value: null,
  },
]);

// Computed Properties
const headers = computed(() => [
  { text: t('Название'), value: 'name' },
  { text: t('Тип'), value: 'tags' },
  { text: t('Протокол'), value: 'phone' },
  { text: t('Акт'), value: 'act' },
  { text: t('Доп. модуль'), value: 'module' },
  { text: t('Действия'), value: 'Actions' },
]);

// Methods
const update = () => {};
const created = () => {};

</script>
<template>
  <BaseBreadcrumb title="Контроллеры" />
  <BaseCard>
    <BaseTable
      @update="update"
      @created="created"
      v-model:page="page"
      v-model:filters="filters"
      :total="22"
      :items="[]"
      :perPage="perPage"
      :headers="headers"
    />
  </BaseCard>
</template>
