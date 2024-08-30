<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types
import type { Filter } from '@/types/MainTypes';
import { useControllersStore } from '@/stores/controllers';

// Composables
const { t } = useI18n();
const storeControllers = useControllersStore();

// Variables
const perPage = 10;

const page = ref(1);
const isUpdate = ref(true);

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
  { text: t('Тип'), value: 'type' },
  { text: t('Протокол'), value: 'protocol' },
  { text: t('IP адрес устройства'), value: 'address' },
  { text: t('Статус'), value: 'state' },
]);

// Methods
const update = async () => {
  isUpdate.value = true;
  await storeControllers.getControllersApi();
  isUpdate.value = false;
};

const created = async () => {
  await storeControllers.getControllersApi();
  isUpdate.value = false;
};

</script>

<template>
  <BaseBreadcrumb title="Контроллеры" />
  <BaseCard>
    <BaseTreeTable
      @update="update"
      @created="created"
      v-model:page="page"
      v-model:filters="filters"
      :total="storeControllers.total"
      :items="storeControllers.list"
      :perPage="perPage"
      :headers="headers"
    />
  </BaseCard>
</template>
