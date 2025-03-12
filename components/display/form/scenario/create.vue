<script lang="ts" setup>
// Builtin modules
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes
import type { Event } from '@/types/ModelEventTypes';
import type { Request } from '~/types/StoreTypes';
// Static modules
import { scenarioColors } from '~/staticData/rooms';
import { itemEventTypes } from '~/staticData/modelEvents';

// Composables
const { t } = useI18n();
const toast = useToast();

// Declare Options
const {
  zoneId,
  devices,
  options,
} = defineProps<{
  zoneId: number | undefined
  devices: { value: string, label: string }[],
  options: any[]
}>();

const emit = defineEmits<{
  (e: 'update'): void
}>();

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

// Variables
const step = ref('1');
const events = ref<Event[]>();

const {
  form,
  resolver,
  statusCreateItem,
  executeCreateItem,
} = await useCreateItem();

async function useCreateItem() {
  const {
    status: statusCreateItem,
    execute: executeCreateItem,
  } = await useAPI<Request<any>>(paths.privateWizard, {
    body: computed(() => ({
      item: {
        ...form.value,
        control_object: control_object.value,
      },
      events: events.value?.map((item) => ({
        actions: item.actions,
        name: item.code,
      }))
        .filter((item) => item.actions.length > 0),
    })),
    success() {
      toast.add({
        severity: 'success',
        summary: t('Кнопка была успешно создана'),
        life: 3000,
      });

      form.value = {
        enabled: true,
        title: null,
        type: null,
        color: null,
        icon: null,
        status: 'off',
        target_type: 'item',
      };
      control_object.value = undefined;
      isOpen.value = false;
      step.value = '1';
      emit('update');
    },
    error() {
      toast.add({
        severity: 'error',
        summary: t('Кнопка не была создана'),
        life: 3000,
      });
    },
    disabledSchema: true,
    method: 'POST',
    immediate: false,
    watch: false,
  });

  const control_object = ref();

  const form = ref<{
  enabled: boolean,
  title: string | null,
  type: string | null,
  color: string | null,
  icon: string | null,
  status: 'off',
  target_type: 'item',
}>({
  enabled: true,
  title: null,
  type: null,
  color: null,
  icon: null,
  status: 'off',
  target_type: 'item',
});

  const resolver = ref(zodResolver(
    z.object({
      title: z.string().min(1),
      type: z.string(),
      zone_id: z.number(),
    }),
  ));

  return {
    form,
    resolver,
    control_object,
    statusCreateItem,
    executeCreateItem,
  };
}

</script>

<template>
  <Stepper
    v-if="resolver"
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
        <!-- Features Form -->
        <Form
          :resolver
          @submit="({ valid }) => { if (valid) activateCallback('2') }"
        >
          <SharedUILabel
            class="tw-mb-2"
            name="title"
            required
            :title="'Название'"
            :value="form.title"
          >
            <InputText
              v-model="form.title"
              class="tw-w-full"
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            name="type"
            required
            :title="'Тип'"
            :value="form.type"
          >
            <Select
              v-model="form.type"
              class="tw-w-full"
              option-label="label"
              option-value="value"
              :options="devices"
              show-clear
            />
          </SharedUILabel>
          <!-- <SharedUILabel
            v-if="form.type === 'switch'"
            class="tw-mb-2"
            title="Объект"
          >
            <Select
              v-model="control_object"
              class="tw-w-full"
              option-label="name"
              option-value="id"
              :options="storeDevices.filterByCategoryDevices"
              show-clear
            />
          </SharedUILabel> -->
          <SharedUILabel
            class="tw-mb-2"
            :title="'Цвет'"
          >
            <SharedUIColorSelect
              v-model="form.color"
              :options="scenarioColors"
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            colomn
            :title="'Иконка'"
          >
            <SharedUIIconSelect
              v-model:icon="form.icon"
              type="scenario"
            />
          </SharedUILabel>
          <!-- Actions -->
          <div class="tw-flex tw-justify-end tw-pt-2">
            <Button type="submit">
              {{ t('next') }}
            </Button>
          </div>
          <!--  -->
        </Form>
        <!--  -->
      </StepPanel>

      <StepPanel
        v-slot="{ activateCallback }"
        value="2"
      >
        <!-- Event Form -->
        <FormsEventForm
          v-if="form.type"
          v-model="events"
          :event-types="itemEventTypes"
          :model-type="form.type"
          target-type="item"
        />
        <!-- Actions -->
        <div class="tw-flex tw-justify-between tw-pt-2">
          <Button
            :label="t('goBack')"
            @click="activateCallback('1')"
          />
          <Button
            :label="t('save')"
            :loading="statusCreateItem === 'pending'"
            @click="executeCreateItem()"
          />
        </div>
        <!--  -->
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>
