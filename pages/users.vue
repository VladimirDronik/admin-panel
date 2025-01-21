<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types modules
import type { APIData } from '~/types/StoreTypes';

// Composables
const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.users')),
});

// Variables
const headers = [
  {
    label: 'ID',
    code: 'Id',
  },
  {
    label: 'Имя',
    code: 'DeviceType',
  },
  {
    label: 'Статус',
    code: 'script',
  },
  {
    label: 'Доступ',
    code: 'count',
  },
  {
    label: 'Действия',
    code: 'actions',
  },
];

const isOpen = ref(false)

const form = ref({})

// Apis
const apiUsers = ref<APIData<any>>();

// Methods
const clickRow = () => {
  isOpen.value = true
}

// Hooks
onBeforeMount(async () => {
  // Get Buttons
  const dataUsers: unknown = await useAPI(
    paths.privateUsers,
    {
      watch: false,
    },
  );

  apiUsers.value = dataUsers as APIData<any>;
  //
});
</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.users">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить Пользователя"
      />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      :headers="headers"
      :items="apiUsers?.data?.response"
      @click-row="clickRow"
    />
    <template #rightbar>
      <RightBarUser
        v-model:form="form"
        v-model:is-show="isOpen"
        @update="apiUsers?.refresh()"
      />
    </template>
  </SharedUIPanel>
</template>
