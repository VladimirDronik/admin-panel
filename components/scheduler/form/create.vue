<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes modules
import type { Event } from '@/types/ModelEventTypes';

const { t } = useI18n();
const toast = useToast();

const step = ref('1');

const form = ref<any | null | undefined>({
  title: null,
});

const dialog = ref(false);
const dialogPeriod = ref(false);

const resolver = ref(zodResolver(
  z.object({}),
));

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
</script>

<template>
  <Stepper
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
              :edit="false"
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
</template>
