<script lang="ts" setup>
import { filterInListRoom } from '~/helpers/rooms';
// Types
import type { Request } from '~/types/StoreTypes';
import { type itemType, itemSchema } from '~/types/DisplayTypes';

// Declare Options
const {
  variant,
  zoneId,
  itemId,
  rooms,
  scenarioId,
} = defineProps<{
  variant: string,
  zoneId: number,
  itemId: number,
  rooms: RoomItem[] | undefined,
  scenarioId: number,
}>();

const {
  dataItem,
  statusItem,
  dataScenario,
  statusScenario,
} = await useCreatedApi();

const emit = defineEmits<{
  (e: 'update'): void
}>();

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

// Variables
const deviceOptions = [
  { value: 'switch', label: 'Кнопка с фиксацией' },
  { value: 'button', label: 'Кнопка без фиксации' },
  { value: 'group', label: 'Группа кнопок' },
  { value: 'conditioner', label: 'Кондиционер' },
  { value: 'light', label: 'Освещение' },
  { value: 'curtain', label: 'Штора' },
  { value: 'link', label: 'Котёл' },
  // Должен быть удален в будущем
  { value: 'sensor', label: 'Сенсор' },
];

const deviceScenarioOptions = [
  { value: 'switch', label: 'Кнопка с фиксацией' },
  { value: 'button', label: 'Кнопка без фиксации' },
];

const devices = computed(() => deviceOptions.map((device) => device.value));

// Computed Properties
const title = computed(() => {
  if (variant === 'Edit Scenario') return 'Редактировать Сценарий';
  if (variant === 'Create Scenario') return 'Добавить Сценарий';
  if (variant === 'Edit Item') return 'Редактировать Кнопку';
  return 'Добавить Кнопку';
});

const options = computed(() => filterInListRoom(rooms ?? []));

async function useCreatedApi() {
  const {
    data: dataItem,
    status: statusItem,
  } = await useAPI<Request<itemType>>(
    paths.privateItem,
    {
      query: computed(() => ({
        id: itemId,
      })),
      immediate: false,
    },
    itemSchema,
  );

  const {
    data: dataScenario,
    status: statusScenario,
  } = await useAPI<Request<any>>(
    paths.privateItem,
    {
      query: computed(() => ({
        id: scenarioId,
      })),
      immediate: false,
    },
    itemSchema,
  );

  return {
    dataItem,
    statusItem,
    dataScenario,
    statusScenario,
  };
}
</script>

<template>
  <LayoutRightbar
    v-model:is-open="isOpen"
    :title
  >
    <SharedUILoader :is-update="statusItem === 'pending' || statusScenario === 'pending'">
      <DisplayFormItemChange
        v-if="dataItem?.response && variant === 'Edit Item'"
        v-model:form="dataItem.response"
        v-model:is-open="isOpen"
        :devices="deviceOptions"
        :options
        @update="emit('update')"
      />
      <DisplayFormScenarioChange
        v-else-if="dataScenario?.response && variant === 'Edit Scenario'"
        v-model:form="dataScenario.response"
        v-model:is-open="isOpen"
        :devices="devices"
        @update="emit('update')"
      />
    </SharedUILoader>
    <DisplayFormItemCreate
      v-if="variant === 'Create Item'"
      v-model:is-open="isOpen"
      :devices="deviceOptions"
      :options
      :zone-id="zoneId"
      @update="emit('update')"
    />
    <DisplayFormScenarioCreate
      v-else-if="variant === 'Create Scenario'"
      v-model:is-open="isOpen"
      :devices="deviceScenarioOptions"
      :options
      :zone-id="zoneId"
      @update="emit('update')"
    />
  </LayoutRightbar>
</template>
