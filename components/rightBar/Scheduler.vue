<script lang="ts" setup>
// Builtin modules
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes modules
import type { Event } from '@/types/ModelEventTypes';

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
const dialog = ref(false);
const visible = ref(false);

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
const edit = ref(false);

const modelType = ref('scheduler');
const targetType = ref('scheduler');

const resolver = ref(zodResolver(
  z.object({}),
));

const step = ref('1');
const events = ref<Event[]>();

const filterEvents = async (type: string) => {

};

const dates = [...Array(31)].map((_, i) => i + 1);

const minuteOptions = [
  '1 минута',
  '5 минут',
  '10 минут',
  '15 минут',
  '30 минут',
  '60 минут',
];

const selectedType = ref('minute');
const types = ref([
  { name: 'Ежеминутно', key: 'minute' },
  { name: 'Ежедневно', key: 'day' },
  { name: 'Ежемесячно', key: 'month' },
  { name: 'Ежегодно', key: 'year' },
]);

const selectedDay = ref([]);
const days = ref([
  { name: 'Пн', key: 'minute' },
  { name: 'Вт', key: 'day' },
  { name: 'Ср', key: 'month' },
  { name: 'Чт', key: 'year' },
  { name: 'Пт', key: 'year' },
  { name: 'Сб', key: 'year' },
  { name: 'Вс', key: 'year' },
]);

const templatedisplay = ref();

const updateEvents = () => {
  filterEvents(modelType.value);
};

const plans = ref([
  {
    title: 'Ежеминутно',
    description: 'Каждые 1 мин',
  },
]);

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
          {{ t('Расписание') }}
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
                :edit="edit"
                :model-type="modelType"
                :target-type="targetType"
                @update-actions="updateEvents"
              />
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
                  @click="visible = true"
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
          <Button
            class="text-capitalize"
            icon="pi pi-plus"
            :label="t('Добавить период')"
            @click="visible = true"
          />
          <Dialog
            v-model:visible="visible"
            dismissable-mask
            :header="t('devices.addTitleDevice')"
            modal
            :style="{ 'max-width': '1200px', width: '100%', margin: '0 20px' }"
          >
            <Form>
              <SharedUILabel
                colomn
                :title="'Тип'"
              >
                <div class="tw-flex tw-gap-2 tw-pt-2">
                  <div
                    v-for="type in types"
                    :key="type.key"
                    class="tw-flex tw-items-center tw-gap-2"
                  >
                    <RadioButton
                      v-model="selectedType"
                      :input-id="type.key"
                      name="dynamic"
                      :value="type.key"
                    />
                    <label :for="type.key">{{ type.name }}</label>
                  </div>
                </div>
              </SharedUILabel>

              <div class="tw-pt-4">
                <SharedUILabel v-if="selectedType === 'minute'">
                  <!-- <Select
                  class="tw-w-full"
                  :options="minuteOptions"
                  placeholder="Длительность"
                /> -->
                  <FloatLabel
                    class="w-full md:w-56"
                    variant="in"
                  >
                    <Select
                      class="tw-w-full"
                      :options="minuteOptions"
                    />
                    <label for="in_label">Длительность</label>
                  </FloatLabel>
                </SharedUILabel>
                <div v-if="selectedType === 'day'">
                  <p>
                    Время
                  </p>
                  <DatePicker
                    id="datepicker-timeonly"
                    fluid
                    time-only
                  />
                  <p class="tw-pt-4">
                    Дни Недели
                  </p>
                  <div class="tw-flex tw-gap-3">
                    <div
                      v-for="day of days"
                      :key="day.key"
                      class="tw-flex tw-items-center tw-gap-2"
                    >
                      <Checkbox
                        v-model="selectedDay"
                        :input-id="day.key"
                        name="day"
                        :value="day.key"
                      />
                      <label :for="day.key">{{ day.name }}</label>
                    </div>
                  </div>
                </div>
                <div v-if="selectedType === 'month'">
                  <p>
                    Даты Месяца
                  </p>
                  <MultiSelect
                    class="w-full md:w-80"
                    fluid
                    :max-selected-labels="3"
                    :options="dates"
                    placeholder="Даты"
                  />
                </div>
                <div v-if="selectedType === 'year'">
                  <p>
                    Даты
                  </p>
                  <DatePicker
                    class="tw-w-96"
                    :manual-input="false"
                    selection-mode="multiple"
                  />
                </div>
              </div>
            </Form>
            <div class="tw-flex tw-justify-end tw-pt-3">
              <Button :label="'Добавить Период'" />
            </div>
          </Dialog>
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
                :edit="edit"
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
                  @click="visible = true"
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
          <Button
            class="text-capitalize"
            icon="pi pi-plus"
            :label="t('Добавить период')"
            @click="visible = true"
          />
          <Dialog
            v-model:visible="visible"
            dismissable-mask
            :header="t('devices.addTitleDevice')"
            modal
            :style="{ 'max-width': '1200px', width: '100%', margin: '0 20px' }"
          >
            <Form>
              <SharedUILabel
                colomn
                :title="'Тип'"
              >
                <div class="tw-flex tw-gap-2 tw-pt-2">
                  <div
                    v-for="type in types"
                    :key="type.key"
                    class="tw-flex tw-items-center tw-gap-2"
                  >
                    <RadioButton
                      v-model="selectedType"
                      :input-id="type.key"
                      name="dynamic"
                      :value="type.key"
                    />
                    <label :for="type.key">{{ type.name }}</label>
                  </div>
                </div>
              </SharedUILabel>
              <div class="tw-pt-4">
                <SharedUILabel v-if="selectedType === 'minute'">
                  <!-- <Select
                  class="tw-w-full"
                  :options="minuteOptions"
                  placeholder="Длительность"
                /> -->
                  <FloatLabel
                    class="w-full md:w-56"
                    variant="in"
                  >
                    <Select
                      class="tw-w-full"
                      :options="minuteOptions"
                    />
                    <label for="in_label">Длительность</label>
                  </FloatLabel>
                </SharedUILabel>
                <div v-if="selectedType === 'day'">
                  <p>
                    Время
                  </p>
                  <DatePicker
                    id="datepicker-timeonly"
                    fluid
                    time-only
                  />
                  <p class="tw-pt-4">
                    Дни Недели
                  </p>
                  <div class="tw-flex tw-gap-3">
                    <div
                      v-for="day of days"
                      :key="day.key"
                      class="tw-flex tw-items-center tw-gap-2"
                    >
                      <Checkbox
                        v-model="selectedDay"
                        :input-id="day.key"
                        name="day"
                        :value="day.key"
                      />
                      <label :for="day.key">{{ day.name }}</label>
                    </div>
                  </div>
                </div>
                <div v-if="selectedType === 'month'">
                  <p>
                    Даты Месяца
                  </p>
                  <MultiSelect
                    class="w-full md:w-80"
                    fluid
                    :max-selected-labels="3"
                    :options="dates"
                    placeholder="Даты"
                  />
                </div>
                <div v-if="selectedType === 'year'">
                  <p>
                    Даты
                  </p>
                  <DatePicker
                    class="tw-w-96"
                    :manual-input="false"
                    selection-mode="multiple"
                  />
                </div>
              </div>
              <div class="tw-flex tw-justify-end tw-pt-3">
                <Button :label="'Добавить Период'" />
              </div>
            </Form>
          </Dialog>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </LayoutRightbar>
</template>
