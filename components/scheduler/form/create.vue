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
  description: '',
  enabled: true,
  name: '',
  period: [],
});

const dialog = ref(false);

const resolver = ref(zodResolver(
  z.object({
    name: z.string().min(1),
  }),
));

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

const updateEvents = () => {
  filterEvents(modelType.value);
};

const filterEvents = async (type: string) => {

};

const period = ref([]);
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
              :title="t('Название')"
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
        <SchedulerFormPeriod v-model="period" />
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
