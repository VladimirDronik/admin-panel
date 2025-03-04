<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types modules
import type { Request } from '~/types/StoreTypes';
import { userListSchema, type UserType } from '~/stores/user/userTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();

useHead({
  titleTemplate: computed(() => t('pages.users')),
});

// const {
//   data: users,
//   refresh: refreshUsers,
//   status: statusUsers,
// } = await useAPI<Request<UserType[]>>(
//   paths.privateUsers,
//   {
//     watch: false,
//   },
//   userListSchema,
// );

const scheduler = [
  {
    title: 'Опрос кондиционера',
    schedule: 'Каждые 1 мин',
    method: 'Опрос кондиционера',
    isActive: true,
    script: '-',
  },
  {
    title: 'Опрос привода штор',
    schedule: 'Каждые 5 мин',
    method: 'Опрос привода штор',
    isActive: false,
    script: '-',
  },
  {
    title: 'Превью камер',
    schedule: 'Каждые 15 мин',
    method: '-',
    isActive: true,
    script: 'Превью камер',
  },
];

const isOpen = ref(false);
const variant = ref('create');

const selectedSchedule = ref();

interface ScheduleBar {
  schedule: any | null;
  edit: boolean;
}

const selectSchedule = ({ schedule, edit }: ScheduleBar = { schedule: null, edit: false }) => {
  isOpen.value = true;
  if (edit) variant.value = 'edit';
  else variant.value = 'create';
  selectedSchedule.value = schedule;
};

</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.scheduler">
      <Button
        icon="pi pi-plus"
        label="Добавить Задачу"
        @click="selectSchedule({ schedule: null, edit: false })"
      />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      is-clickable
      :items="scheduler"
      @click-row="(item: any) => selectSchedule({ schedule: item.data, edit: true })"
    >
      <Column
        field="title"
        header="Название"
      />
      <Column
        field="schedule"
        header="Расписание"
      />
      <Column
        field="method"
        header="Метод"
      />
      <Column
        field="isActive"
        header="Активность"
      >
        <template #body="{ data }">
          <div class="tw-flex tw-items-center">
            <div
              class="tw-mr-1 tw-size-3 tw-rounded-full"
              :class="{ 'tw-bg-success': data.isActive, 'tw-bg-danger': !data.isActive }"
            />
            {{ data.isActive ? 'Активен' : 'Выключен' }}
          </div>
        </template>
      </Column>
      <Column
        field="script"
        header="Скрипт"
      />
    </BaseTable>
    <template #rightbar>
      <RightBarScheduler
        v-model:form="selectedSchedule"
        v-model:is-show="isOpen"
        :variant
      />
    </template>
  </SharedUIPanel>
</template>
