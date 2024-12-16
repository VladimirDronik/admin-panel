<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types and Schemes modules
import { type itemType, itemSchema } from '~/types/DisplayTypes';
import type { APIData } from '~/types/StoreTypes';

const { t } = useI18n();
const storeRooms = useRoomsStore();

defineProps({
  edit: {
    type: Boolean,
    required: true,
  },
  zoneId: {
    type: Number,
    required: true,
  },
});

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

onBeforeMount(async () => {
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
          {{ !edit ? 'Добавить Кнопку' : "Редактировать кнопку" }}
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
        v-if="apiItem?.data?.response && edit"
        :isUpdate="apiItem.pending"
      >
        <DisplayEditForm
          @update="emit('update')"
          v-model:form="apiItem.data.response"
          :devices="devices"
        />
      </SharedUILoader>
      <DisplayCreateForm
        v-else
        v-model:isOpen="isOpen"
        @update="emit('update')"
        :zoneId="zoneId"
        :devices="devices"
      />
    </div>
  </LayoutFullRightbar>
</template>

<style>

</style>
