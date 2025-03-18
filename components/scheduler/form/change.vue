<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes modules
import type { Event } from '@/types/ModelEventTypes';

const { t } = useI18n();
const toast = useToast();

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});
const form = defineModel<{
  id: number,
  name: string,
  enabled: boolean,
}>('form', {
  required: true,
});

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const resolver = ref(zodResolver(
  z.object({}),
));

const dialog = ref(false);

const modelType = ref('scheduler');
const targetType = ref('scheduler');

const event = ref<Event>({
  code: '',
  name: '',
  description: '',
  actions: [],
  actionTypes: {
    method: 0,
    delay: 0,
    script: 0,
    notification: 0,
  },
});

const updateEvents = () => {
  filterEvents(modelType.value);
};

const filterEvents = async (type: string) => {

};

const plans = ref([]);

const {
  statusChangeRoom,
  executeChangeRoom,
} = await useChangeRoom();

const {
  statusDeleteRoom,
  executeDeleteRoom,
} = await useDeleteRoom();

async function useChangeRoom() {
  // Api
  const {
    status: statusChangeRoom,
    execute: executeChangeRoom,
  } = await useAPI(paths.privateRoomsList, {
    body: computed(() => form.value),
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
    method: 'PATCH',
    immediate: false,
    watch: false,
  });

  return {
    statusChangeRoom,
    executeChangeRoom,
  };
}

async function useDeleteRoom() {
  // Api
  const {
    status: statusDeleteRoom,
    execute: executeDeleteRoom,
  } = await useAPI(paths.privateRoom, {
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
    statusDeleteRoom,
    executeDeleteRoom,
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
          @submit="({ valid }) => { if (valid) executeChangeRoom() }"
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
              @update-actions="updateEvents"
            />
          </div>
          <div class="tw-flex tw-justify-end tw-pt-2">
            <DialogDelete
              :id="form.id ?? -1"
              class="tw-mr-2"
              :loading="statusDeleteRoom === 'pending'"
              :title="`Вы уверены, что хотите удалить «${form.name}»?`"
              @delete="executeDeleteRoom()"
            />

            <Button
              :label="t('save')"
              :loading="statusChangeRoom === 'pending'"
              type="submit"
            />
          </div>
        </Form>
      </TabPanel>
      <TabPanel value="events">
        <SchedulerFormPeriod v-model="plans" />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
