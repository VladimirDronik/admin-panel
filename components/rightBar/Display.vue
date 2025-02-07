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
const devices = [
  'switch',
  'button',
  'group',
  'conditioner',
  'light',
  'curtain',
  // Должен быть удален в будущем
  'sensor',
];

// Computed Properties
const title = computed(() => {
  if (variant === 'Edit Item') return 'Редактировать Кнопку';
  if (variant === 'Edit Scenario') return 'Редактировать Сценарий';
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
    <SharedUILoader
      :is-update="statusItem === 'pending' || statusScenario === 'pending'"
    >
      <DisplayFormEditItem
        v-if="dataItem?.response && variant === 'Edit Item'"
        v-model:form="dataItem.response"
        v-model:is-open="isOpen"
        :devices="devices"
        :options
        @update="emit('update')"
      />
      <DisplayFormEditScenario
        v-else-if="dataScenario?.response && variant === 'Edit Scenario'"
        v-model:form="dataScenario.response"
        v-model:is-open="isOpen"
        :devices="devices"
        @update="emit('update')"
      />
    </SharedUILoader>
    <DisplayFormCreateItem
      v-if="variant !== 'Edit Scenario' && variant !== 'Edit Item'"
      :id="zoneId"
      v-model:is-open="isOpen"
      :devices="devices"
      :options
      @update="emit('update')"
    />
  </LayoutRightbar>
</template>
