<script lang="ts" setup>
import { IconX } from '@tabler/icons-vue';
// Types and Schemes modules
import { type itemType, itemSchema } from '~/types/DisplayTypes';
import type { APIData } from '~/types/StoreTypes';
import { paths } from '~/utils/endpoints';

const storeRooms = useRoomsStore();

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

const apiItem = ref<APIData<itemType>>();

const title = computed(() => {
  if (variant === 'Edit Item') return 'Редактировать Кнопку';
  if (variant === 'Edit Scenario') return 'Редактировать Сценарий';
  return 'Добавить Кнопку';
});

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
  <LayoutFullRightbar :is-open="isOpen">
    <div class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-2xl tw-font-semibold">
          {{ title }}
        </h3>
        <Button
          icon="pi"
          rounded
          size="small"
          text
          variant="text"
          @click="isOpen = false"
        >
          <IconX class="white" />
        </Button>
      </div>

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
        v-model:is-open="isOpen"
        :devices="devices"
        :zone-id="zoneId"
        @update="emit('update')"
      />
    </div>
  </LayoutFullRightbar>
</template>

<style>

</style>
