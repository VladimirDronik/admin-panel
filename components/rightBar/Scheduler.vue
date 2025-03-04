<script lang="ts" setup>
// Builtin modules
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes modules
import type { Event } from '@/types/ModelEventTypes';
import type { RoomItem } from '~/stores/rooms/roomsTypes';
import type { Request } from '~/types/StoreTypes';
// Static modules
import { itemEventTypes } from '~/staticData/modelEvents';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();

// Declare Options
// const emit = defineEmits<{
//   (e: 'update'): void
// }>();

const { variant } = defineProps<{
  variant: string
}>();

const schedule = defineModel<any>('form', {
  required: true,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

// Variables
const form = ref<any | null | undefined>();

const resolver = ref(zodResolver(
  z.object({}),
));

const step = ref('1');
const events = ref<Event[]>();

// Watchers
watch(schedule, () => {
  if (schedule.value) form.value = { ...schedule.value };
  else {
    form.value = {
      title: '',
      timer: null,
      isActive: true,
      isSystem: false,
      isHide: false,
      type: 'switch',
    };
  }
});

const {
  changeRoom,
  statusChangeRoom,
} = await useChangeRoom();

const {
  confirmDelete,
  statusDeleteRoom,
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
    method: 'PATCH',
    immediate: false,
    watch: false,
  });

  // Methods
  const changeRoom = async () => {
    await updateData({
      update: async () => {
        await executeChangeRoom();
        // await emit('update');
      },
      success: () => {
        isOpen.value = false;
      },
      successMessage: 'Помещение было успешно изменено',
      errorMessage: 'Помещение не было изменено',
    });
  };

  return {
    statusChangeRoom,
    changeRoom,
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
    method: 'DELETE',
    immediate: false,
    watch: false,
  });

  // Methods
  const confirmDelete = async () => {
    await updateData({
      update: async () => {
        await executeDeleteRoom();
        // await emit('update');
      },
      success: () => {
        isOpen.value = false;
      },
      successMessage: 'Помещение удалено',
      errorMessage: 'Ошибка удаления помещения',
    });
  };

  return {
    statusDeleteRoom,
    confirmDelete,
  };
}
</script>

<template>
  <LayoutRightbar
    v-if="form"
    :is-open="isOpen"
    :title="variant === 'edit' ? t('Изменить задачу') : t('Добавить задачу')"
  >
    <Stepper
      v-if="variant === 'create'"
      v-model:value="step"
      linear
    >
      <StepList>
        <Step value="1">
          {{ t('devices.features') }}
        </Step>
        <Step value="2">
          {{ t('devices.events') }}
        </Step>
      </StepList>

      <StepPanels>
        <StepPanel
          v-slot="{ activateCallback }"
          value="1"
        >
          <Form
            :resolver
            @submit="({ valid }) => { if (valid) activateCallback('2') }"
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
              <SharedUILabel
                class="tw-mb-4"
                name="name"
                required
                :title="t('Переодичность')"
                :value="form.timer"
              >
                <Select
                  v-model="form.timer"
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
              <div class="tw-flex tw-items-center">
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
            </div>
            <div class="tw-flex tw-justify-end tw-pt-2">
              <div class="tw-flex tw-justify-end">
                <Button type="submit">
                  {{ t('next') }}
                </Button>
              </div>
            </div>
          </Form>
        </StepPanel>
        <StepPanel
          v-slot="{ activateCallback }"
          value="2"
        >
          <FormsEventForm
            v-if="form.type"
            v-model="events"
            :event-types="itemEventTypes"
            :model-type="form.type"
            target-type="item"
          />
          <div class="tw-flex tw-justify-between tw-pt-2">
            <Button
              :label="t('goBack')"
              @click="activateCallback('1')"
            />
            <Button :label="t('save')" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
    <Tabs
      v-else-if="variant === 'edit'"
      value="features"
    >
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
            {{ t('devices.events') }}
          </p>
        </Tab>
      </TabList>
      <!--  -->

      <!-- Container -->
      <TabPanels>
        <TabPanel value="features">
          <Form
            :resolver
            @submit="({ valid }) => { if (valid) changeRoom() }"
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
              <SharedUILabel
                class="tw-mb-4"
                name="name"
                required
                :title="t('Переодичность')"
                :value="form.timer"
              >
                <Select
                  v-model="form.timer"
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
              <div class="tw-flex tw-items-center">
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
            </div>
            <div class="tw-flex tw-justify-end tw-pt-2">
              <DialogDelete
                :id="form.id ?? -1"
                class="tw-mr-2"
                :loading="statusDeleteRoom === 'pending'"
                :title="`Вы уверены, что хотите удалить «${form.name}»?`"
                @delete="confirmDelete"
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
          <FormsEventForm
            :id="form.item_id"
            :event-types="itemEventTypes"
            :model-type="form.type"
            :object="form"
            target-type="item"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </LayoutRightbar>
</template>
