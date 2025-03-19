<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes modules
import type { Event } from '@/types/ModelEventTypes';
import type { Request } from '~/types/StoreTypes';

const { t } = useI18n();
const toast = useToast();

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const form = defineModel<{
  id: number,
  name: string,
  description: string,
  enabled: boolean,
  period: string,
}>('form', {
  required: true,
});

const resolver = ref(zodResolver(
  z.object({}),
));

const dialog = ref(false);

const modelType = ref('scheduler');
const targetType = ref('scheduler');

const event = ref<Event>({
  code: '',
  name: 'Действия Задачи',
  description: '',
  actions: [],
  actionTypes: {
    method: 0,
    delay: 0,
    script: 0,
    notification: 0,
  },
});

const periods = ref<string[]>([]);

const {
  statusChangeScheduler,
  executeChangeScheduler,
} = await useChangeScheduler();

const {
  statusDeleteScheduler,
  executeDeleteScheduler,
} = await useDeleteScheduler();

const {
  data: dataSchedulerActions,
  status: statusSchedulerActions,
  refresh: refreshSchedulerActions,
} = await useAPI<Request<any[]>>(
  paths.cronActions,
  {
    query: computed(() => form.value.id),
  },
  { immediate: false },
);

watch(() => form.value.period, (newValue) => {
  periods.value = newValue.split(';');
}, { immediate: true });

watch(dataSchedulerActions, (newValue) => {
  if (newValue?.response) event.value.actions = newValue?.response;
}, { immediate: true });

async function useChangeScheduler() {
  // Api
  const {
    status: statusChangeScheduler,
    execute: executeChangeScheduler,
  } = await useAPI(paths.cronTask, {
    body: computed(() => ({
      ...form.value,
      actions: event.value.actions,
      period: periods.value.join(';'),
    })),
    success() {
      toast.add({
        severity: 'success',
        summary: t('Задача была успешно изменена'),
        life: 3000,
      });
      emit('update');
    },
    error() {
      toast.add({
        severity: 'error',
        summary: t('Задача не было изменена'),
        life: 3000,
      });
    },
    method: 'PUT',
    immediate: false,
    watch: false,
  });

  return {
    statusChangeScheduler,
    executeChangeScheduler,
  };
}

async function useDeleteScheduler() {
  // Api
  const {
    status: statusDeleteScheduler,
    execute: executeDeleteScheduler,
  } = await useAPI(paths.cronTask, {
    query: computed(() => ({
      id: form.value?.id,
    })),
    success() {
      toast.add({
        severity: 'success',
        summary: t('Задача была успешно удалена'),
        life: 3000,
      });
      emit('update');
      isOpen.value = false;
    },
    error() {
      toast.add({
        severity: 'error',
        summary: t('Задача не была удалена'),
        life: 3000,
      });
    },
    method: 'DELETE',
    immediate: false,
    watch: false,
  });

  // Methods

  return {
    statusDeleteScheduler,
    executeDeleteScheduler,
  };
}

</script>

<template>
  <Tabs value="features">
    <!-- Header -->
    <TabList>
      <Tab value="features">
        {{ t('devices.features') }}
      </Tab>
      <Tab value="events">
        {{ t('Расписание') }}
      </Tab>
    </TabList>
    <!--  -->

    <!-- Container -->
    <TabPanels>
      <TabPanel value="features">
        <Form
          :resolver
          @submit="({ valid }) => { if (valid) executeChangeScheduler() }"
        >
          <div class="!tw-px-0 !tw-pt-1">
            <SharedUILabel
              class="tw-mb-2"
              name="name"
              required
              :title="t('room.name')"
              :value="form.name"
            >
              <InputText
                v-model="form.name"
                class="tw-w-full"
              />
            </SharedUILabel>
            <SharedUILabel
              class="tw-mb-2"
              name="description"
              required
              :title="t('Описание')"
              :value="form.description"
            >
              <InputText
                v-model="form.description"
                class="tw-w-full"
              />
            </SharedUILabel>
            <div>
              <SchedulerCheckboxLabel
                v-model="form.enabled"
                title="Активность"
                tooltip="Включить или выключить событие"
              />
              <!-- <SchedulerCheckboxLabel
                v-model="form.isSystem"
                title="Системное"
                tooltip="Доступно для редактирования только администратору"
              />
              <SchedulerCheckboxLabel
                v-model="form.isHide"
                title="Активность"
                tooltip="Доступно для просмотра только администратору"
              /> -->
            </div>
            <Button
              label="Действия"
              @click="dialog = true"
            />
            <FormsEventActions
              :id="0"
              v-model="dialog"
              v-model:event="event"
              :edit="true"
              :model-type="modelType"
              :target-type="targetType"
            />
          </div>
          <div class="tw-flex tw-justify-end tw-pt-2">
            <DialogDelete
              :id="form.id ?? -1"
              class="tw-mr-2"
              :loading="statusDeleteScheduler === 'pending'"
              :title="`Вы уверены, что хотите удалить «${form.name}»?`"
              @delete="executeDeleteScheduler()"
            />

            <Button
              :label="t('save')"
              :loading="statusChangeScheduler === 'pending'"
              type="submit"
            />
          </div>
        </Form>
      </TabPanel>
      <TabPanel value="events">
        <SchedulerFormPeriod
          v-model="periods"
          @change="executeChangeScheduler"
        />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
