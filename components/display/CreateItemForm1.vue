<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form } from '@primevue/forms';
// Types and Schemes
import type { APIData } from '~/types/StoreTypes';
// Static modules
import { itemEventTypes } from '~/staticData/modelEvents';
import type { Event } from '@/types/ModelEventTypes';

// Composables
const { t } = useI18n();
const storeRooms = useRoomsStore();
const { updateData } = useUtils();

const props = defineProps<{
  devices: string[],
  zoneId: number,
}>();

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const emit = defineEmits<{
  (e: 'update'): void
}>();

const form = ref({
  title: null,
  type: null,
  color: null,
  item_id: null,
});

const events = ref<Event[]>();

const step = ref('1');

const apiCreateItem = ref<APIData<any>>();

const resolver = ref(zodResolver(
  z.object({
    title: z.string().min(1),
    type: z.string(),
    zone_id: z.number(),
  }),
));

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
  <Stepper v-if="resolver" v-model:value="step" linear>
    <StepList>
      <Step value="1">{{ t('devices.features') }}</Step>
      <Step value="2">{{ t('devices.events') }}</Step>
    </StepList>

    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1">
        <!-- Features Form -->
        <Form
          :resolver
          @submit="({ valid }) => { if (valid) activateCallback('2') }"
        >
          <SharedUILabel
            :title="'Название'"
            :value="form.title"
            name="title"
            class="tw-mb-2"
            required
          >
            <InputText
              v-model="form.title"
              class="tw-w-full"
            />
          </SharedUILabel>
          <SharedUILabel
            :title="'Тип'"
            :value="form.type"
            name="type"
            class="tw-mb-2"
            required
          >
            <Select
              v-model="form.type"
              :options="devices"
              class="tw-w-full"
              show-clear
            />
          </SharedUILabel>
          <SharedUILabel
            :title="'Помещение'"
            :value="form.item_id"
            name="zone_id"
            class="tw-mb-2"
            required
          >
            <Select
              v-model="form.item_id"
              :options="storeRooms.getRoomsSelect"
              optionLabel="name"
              optionValue="code"
              class="tw-w-full"
              required
              show-clear
            />
          </SharedUILabel>
          <SharedUILabel
            :title="'Цвет'"
            class="tw-mb-2"
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

      <StepPanel v-slot="{ activateCallback }" value="2">
        <!-- Event Form -->
        <FormsEventForm
          v-if="form.type"
          v-model="events"
          targetType="item"
          :modelType="form.type"
          :eventTypes="itemEventTypes"
        />
        <!-- Actions -->
        <div class="tw-flex tw-justify-between tw-pt-2">
          <Button
            @click="activateCallback('1')"
            :label="t('goBack')"
          />
          <Button
            @click="createItem"
            :label="t('save')"
            :loading="apiCreateItem?.pending && apiCreateItem.status !== 'idle'"
          />
        </div>
        <!--  -->
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<style>

</style>
