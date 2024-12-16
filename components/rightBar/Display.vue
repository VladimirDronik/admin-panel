<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types and Schemes modules
import { type itemType, itemSchema } from '~/types/DisplayTypes';
import type { APIData } from '~/types/StoreTypes';

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
    'http://10.35.16.1:8081/private/item',
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
  <LayoutFullRightbar :isOpen="isOpen">
    <div class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-2xl tw-font-semibold">
          {{ title }}
        </h3>
        <Button
          text
          @click="isOpen = false"
          icon="pi"
          rounded
          size="small"
          variant="text"
        >
          <XIcon class="white" />
        </Button>
      </div>

      <SharedUILoader
        v-if="apiItem?.data?.response && variant === 'Edit Item'"
        :isUpdate="apiItem.pending"
      >
        <DisplayEditItemForm
          @update="emit('update')"
          v-model:isOpen="isOpen"
          v-model:form="apiItem.data.response"
          :devices="devices"
        />
      </SharedUILoader>
      <SharedUILoader
        v-if="apiItem?.data?.response && variant === 'Edit Scenario'"
        :isUpdate="apiItem.pending"
      >
        <DisplayEditScenarioForm
          @update="emit('update')"
          v-model:isOpen="isOpen"
          v-model:form="apiItem.data.response"
          :devices="devices"
        />
      </SharedUILoader>
      <DisplayCreateItemForm
        v-else
        @update="emit('update')"
        v-model:isOpen="isOpen"
        :zoneId="zoneId"
        :devices="devices"
      />
    </div>
  </LayoutFullRightbar>
</template>

<style>

</style>
