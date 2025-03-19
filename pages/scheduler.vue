<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
import { periodInText } from '@/helpers/scheduler';
// Types modules
import type { Request } from '~/types/StoreTypes';
import { requestSchedulerSchema, type SchedulerTypes, type RequestSchedulerTypes } from '~/types/SchedulerTypes';

// Composables
const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.users')),
});

const {
  data: dataScheduler,
  status: statusScheduler,
  refresh: refreshScheduler,
} = await useAPI<Request<RequestSchedulerTypes>>(
  paths.cronTasks,
  { watch: false },
  requestSchedulerSchema,
);

const isOpen = ref(false);
const variant = ref('create');

const selectedSchedule = ref();

interface SchedulerSelect {
  schedule: SchedulerTypes | null,
  edit: boolean
}

const selectSchedule = (
  {
    schedule,
    edit,
  }: SchedulerSelect =
  {
    schedule: null,
    edit: false,
  },
) => {
  isOpen.value = true;
  if (edit) variant.value = 'edit';
  else variant.value = 'create';
  selectedSchedule.value = schedule;
};

// Methods
const Periodfilter = (periods: string) => periods.split(';').map((item: string) => periodInText(item));

</script>

<template>
  <SharedUIPanel
    :is-error="statusScheduler === 'error'"
    :is-update="statusScheduler === 'pending'"
    @update="refreshScheduler"
  >
    <SharedUIBreadcrumb
      is-updated
      title="pages.scheduler"
      :total="dataScheduler?.response.total"
      @update="refreshScheduler"
    >
      <Button
        icon="pi pi-plus"
        label="Добавить Задачу"
        @click="selectSchedule({ schedule: null, edit: false })"
      />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      is-clickable
      :items="dataScheduler?.response.list"
      @click-row="(item: any) => selectSchedule({ schedule: item.data, edit: true })"
    >
      <Column
        field="name"
        header="Название"
      />
      <Column
        field="period"
        header="Расписание"
      >
        <template #body="{ data }">
          <div v-if="Periodfilter(data.period).length < 4">
            <p
              v-for="period in Periodfilter(data.period)"
              :key="period"
              class="tw-mb-1"
            >
              {{ period }}
            </p>
          </div>
          <div v-else>
            <p
              v-for="period in Periodfilter(data.period).slice(0, 2)"
              :key="period"
              class="tw-mb-1"
            >
              {{ period }}
            </p>
            <Chip
              class="tw-py-1 tw-text-base"
              :label="t(`+ Еще ${Periodfilter(data.period).length - 2}`)"
              size="small"
            />
          </div>
        </template>
      </Column>
      <Column
        field="description"
        header="Описание"
      />
      <Column
        field="enabled"
        header="Активность"
      >
        <template #body="{ data }">
          <div class="tw-flex tw-items-center">
            <div
              class="tw-mr-1 tw-size-3 tw-rounded-full"
              :class="{ 'tw-bg-success': data.enabled, 'tw-bg-danger': !data.enabled }"
            />
            {{ data.enabled ? 'Активен' : 'Выключен' }}
          </div>
        </template>
      </Column>
    </BaseTable>
    <template #rightbar>
      <RightBarScheduler
        v-model:form="selectedSchedule"
        v-model:is-show="isOpen"
        :variant
        @update="refreshScheduler"
      />
    </template>
  </SharedUIPanel>
</template>
