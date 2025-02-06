<script lang="ts" setup>
// Types
import type { APIData } from '~/types/StoreTypes';
import { type itemType, itemSchema } from '~/types/DisplayTypes';

// Composables
const storeRooms = useRoomsStore();

// Declare Options
const { variant, zoneId } = defineProps<{
  variant: string,
  zoneId: number,
}>();

const emit = defineEmits<{
  (e: 'update'): void
}>();

const id = defineModel<number>('id', {
  required: false,
});

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

// Apis
const apiItem = ref<APIData<itemType>>();

// Computed Properties
const title = computed(() => {
  if (variant === 'Edit Item') return 'Редактировать Кнопку';
  if (variant === 'Edit Scenario') return 'Редактировать Сценарий';
  return 'Добавить Кнопку';
});

// Hooks
onBeforeMount(async () => {
  // Get Rooms
  storeRooms.getRoomsApi();
  // Get Item
  const data: unknown = await useAPI(
    paths.privateItem,
    {
      query: computed(() => ({
        id: id.value,
      })),
      immediate: false,
    },
    itemSchema,
  );

  apiItem.value = data as APIData<itemType>;
  //
});
</script>

<template>
  <LayoutRightbar
    v-model:is-open="isOpen"
    :title
  >
    <SharedUILoader
      v-if="apiItem?.data?.response && variant === 'Edit Item'"
      :is-update="apiItem.pending"
    >
      <DisplayEditItemForm
        v-model:form="apiItem.data.response"
        v-model:is-open="isOpen"
        :devices="devices"
        @update="emit('update')"
      />
    </SharedUILoader>
    <SharedUILoader
      v-else-if="apiItem?.data?.response && variant === 'Edit Scenario'"
      :is-update="apiItem.pending"
    >
      <DisplayEditScenarioForm
        v-model:form="apiItem.data.response"
        v-model:is-open="isOpen"
        :devices="devices"
        @update="emit('update')"
      />
    </SharedUILoader>
    <DisplayCreateItemForm
      v-else
      :id="zoneId"
      v-model:is-open="isOpen"
      :devices="devices"
      :zone-id="zoneId"
      @update="emit('update')"
    />
  </LayoutRightbar>
</template>
