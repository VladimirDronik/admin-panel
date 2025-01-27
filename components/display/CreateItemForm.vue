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
  id: number | undefined
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

const isUpdateForm = ref(false)

const form = ref<{
  enabled: boolean,
  title: string | null,
  type: string | null,
  color: string | null,
  zone_id: number | null,
  icon: string | null,
}>({
  enabled: true,
  title: null,
  type: null,
  color: null,
  zone_id: null,
  icon: null,
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
        enabled: true,
        title: null,
        type: null,
        color: null,
        zone_id: null,
        icon: null,
      };
      isOpen.value = false;
      step.value = '1';
    },
    successMessage: 'Кнопка была успешно создана',
    errorMessage: 'Кнопка не была создана',
  });
};

const quickSelectRoom = (id: number | undefined) => storeRooms.getRoomsSelect.find((item) => item.code === id || item.inGroup?.code === id)

// Watchers
watch(() => props.id, (newValue) => {
  isUpdateForm.value = true
  const room = quickSelectRoom(newValue)?.code
  if (room) form.value.zone_id = room
  setTimeout(() => isUpdateForm.value = false, 0)
})

// Hooks
onBeforeMount(async () => {
  // Create Device
  const data: unknown = await useAPI(paths.privateWizard, {
    body: computed(() => ({
      item: {
        ...form.value
      },
      events: events.value?.map((item) => ({
        actions: item.actions,
        name: item.code,
      }))
        .filter((item) => item.actions.length > 0),
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
          v-if="!isUpdateForm"
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
            :value="form.zone_id"
          >
            <SharedUIRoomSelect v-model="form.zone_id" />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            :title="'Цвет'"
          >
            <SharedUIColorSelect v-model="form.color" />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            :title="'Иконка'"
          >
            <SharedUIIconSelect v-model:icon="form.icon" />
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
