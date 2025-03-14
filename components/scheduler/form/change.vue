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

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const resolver = ref(zodResolver(
  z.object({}),
));

const form = ref<any | null | undefined>({
  title: null,
});

const dialog = ref(false);
const dialogPeriod = ref(false);

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

const plans = ref([
  {
    title: 'Ежеминутно',
    description: 'Каждые 1 мин',
  },
]);

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
    body: computed(() => {
      if (form.value?.parent_id === null) {
        return [{
          ...form.value,
          parent_id: 0,
        }];
      }
      return [form.value];
    }),
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
    <span
      class="tw-text-base"
      style="color: var(--p-tabs-tab-color);"
    >
      {{ t('display.type') }}: -
    </span>
    <!-- Header -->
    <TabList>
      <Tab value="features">
        <p class="tw-font-normal">
          {{ t('devices.features') }}
        </p>
      </Tab>
      <Tab value="events">
        <p class="tw-font-normal">
          {{ t('Расписание') }}
        </p>
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
              :value="form.title"
            >
              <InputText
                v-model="form.title"
                class="tw-w-full"
              />
            </SharedUILabel>
            <div class="tw-mb-4 tw-flex tw-items-center">
              <div class="tw-flex tw-min-w-32 tw-items-center">
                <Checkbox
                  v-model="form.isActive"
                  binary
                  class="tw-mr-2"
                  input-id="regulator"
                  name="Регулировка"
                />
                <label
                  class="tw-cursor-pointer tw-text-lg"
                  for="regulator"
                >
                  Активность
                </label>
              </div>
              <i
                v-tooltip.top="{
                  value: 'Включить или выключить событие',
                  pt: {
                    arrow: {
                      style: {
                        borderBottomColor: 'var(--p-primary-color)',
                      },
                    },
                    text: '!bg-primary !text-primary-contrast !font-medium',
                  },
                }"
                class="pi pi-question-circle tw-cursor-pointer"
                style="font-size: 1.2rem"
              />
            </div>
            <div class="tw-mb-4 tw-flex tw-items-center">
              <div class="tw-flex tw-min-w-32 tw-items-center">
                <Checkbox
                  v-model="form.isSystem"
                  binary
                  class="tw-mr-2"
                  input-id="regulator"
                  name="Регулировка"
                />
                <label
                  class="tw-cursor-pointer tw-text-lg"
                  for="regulator"
                >
                  Системное
                </label>
              </div>
              <i
                v-tooltip.top="{
                  value: 'Доступно для редактирования только администратору',
                  pt: {
                    arrow: {
                      style: {
                        borderBottomColor: 'var(--p-primary-color)',
                      },
                    },
                    text: '!bg-primary !text-primary-contrast !font-medium',
                  },
                }"
                class="pi pi-question-circle tw-cursor-pointer"
                style="font-size: 1.2rem"
              />
            </div>
            <div class="tw-mb-2 tw-flex tw-items-center">
              <div class="tw-flex tw-min-w-32 tw-items-center">
                <Checkbox
                  v-model="form.isHide"
                  binary
                  class="tw-mr-2"
                  input-id="regulator"
                  name="Регулировка"
                />
                <label
                  class="tw-cursor-pointer tw-text-lg"
                  for="regulator"
                >
                  Скрытое
                </label>
              </div>
              <i
                v-tooltip.top="{
                  value: 'Доступно для просмотра только администратору',
                  pt: {
                    arrow: {
                      style: {
                        borderBottomColor: 'var(--p-primary-color)',
                      },
                    },
                    text: '!bg-primary !text-primary-contrast !font-medium',
                  },
                }"
                class="pi pi-question-circle tw-cursor-pointer"
                style="font-size: 1.2rem"
              />
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
        <DataTable
          class="tw-mb-3"
          :value="plans"
        >
          <Column
            field="title"
            header="Тип периода"
          />
          <Column
            field="description"
            header="Описание"
          /><Column
            field="actions"
            header="Действия"
            style="width: 150px;"
          >
            <template #body="{ data }">
              <Button
                aria-label="Cancel"
                class="tw-mr-2"
                icon="pi pi-pencil"
                rounded
                severity="info"
                @click="dialogPeriod = true"
              />
              <Button
                aria-label="Cancel"
                icon="pi pi-trash"
                rounded
                severity="danger"
              />
            </template>
          </Column>
        </DataTable>
        <SchedulerDialogPeriod v-model:dialog="dialogPeriod" />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
