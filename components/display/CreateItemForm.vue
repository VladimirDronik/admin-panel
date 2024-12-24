<script lang="ts" setup>
// Builtin modules
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes
import type { Event } from '@/types/ModelEventTypes';
import type { APIData } from '~/types/StoreTypes';
// Static modules
import { itemEventTypes } from '~/staticData/modelEvents';

// Composables
const { t } = useI18n();
const storeRooms = useRoomsStore();
const { updateData } = useUtils();

// Declare Options
const props = defineProps<{
  devices: string[],
  zoneId: number,
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

const form = ref({
  title: null,
  type: null,
  color: null,
  item_id: null,
});

const resolver = ref(zodResolver(
  z.object({
    title: z.string().min(1),
    type: z.string(),
    zone_id: z.number(),
  }),
));

// Apis
const apiCreateItem = ref<APIData<any>>();

// Methods
const createItem = async () => {
  await updateData({
    update: async () => {
      await apiCreateItem.value?.execute();
      await emit('update');
    },
    success: () => {
      form.value = {
        title: null,
        type: null,
        color: null,
        item_id: null,
      };
      isOpen.value = false;
      step.value = '1';
    },
    successMessage: 'Кнопка была успешно создана',
    errorMessage: 'Кнопка не была создана',
  });
};

// Hooks
onBeforeMount(async () => {
  // Create Device
  const data: unknown = await useAPI(paths.privateWizard, {
    body: computed(() => ({
      item: form.value,
      events: events.value?.map((item) => ({
        actions: item.actions,
        name: item.code,
      }))
        .filter((item) => item.actions.length > 0),
      zone_id: props.zoneId,
    })),
    method: 'POST',
    immediate: false,
    watch: false,
  });

  apiCreateItem.value = data as APIData<any>;
});

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
              :options="devices"
              show-clear
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            name="zone_id"
            required
            :title="'Помещение'"
            :value="form.item_id"
          >
            <Select
              v-model="form.item_id"
              class="tw-w-full"
              option-label="name"
              option-value="code"
              :options="storeRooms.getRoomsSelect"
              required
              show-clear
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            :title="'Цвет'"
          >
            <SharedUIColorSelect v-model="form.color" />
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
            :loading="apiCreateItem?.pending && apiCreateItem.status !== 'idle'"
            @click="createItem"
          />
        </div>
        <!--  -->
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>
