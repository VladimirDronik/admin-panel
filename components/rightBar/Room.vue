<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types and Schemes modules
import type { RoomItem } from '~/stores/rooms/roomsTypes';
import type { APIData } from '~/types/StoreTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const form = defineModel<RoomItem | null | undefined>('form', {
  required: true,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

// Variables
const dialog = ref(false);

const loading = ref(false);
const loadingDelete = ref(false);

// Apis
const apiDeleteRoom = ref<APIData<any>>();

const confirmDelete = async () => {
  await updateData({
    update: async () => {
      await apiDeleteRoom.value?.execute();
      await emit('update');
    },
    success: () => {
      isOpen.value = false;
    },
    successMessage: 'Помещение удалено',
    errorMessage: 'Ошибка удаления помещения',
  });
}

// Hooks
onBeforeMount(async () => {
  // Delete Device
  const dataDelete: unknown = await useAPI(paths.privateRoom, {
    query: computed(() => ({
      id: form.value?.id,
    })),
    method: 'DELETE',
    immediate: false,
    watch: false,
  });

  apiDeleteRoom.value = dataDelete as APIData<any>;
});
</script>

<template>
  <LayoutRightbar
    v-if="form"
    :is-open="isOpen"
    :title="form.is_group ? t('room.addCategory') : t('room.addRoom')"
  >
    <div class="!tw-px-0 !tw-pt-1">
      <SharedUILabel
        class="tw-mb-2"
        required
        :title="t('room.name')"
      >
        <InputText
          v-model="form.name"
          class="tw-w-full"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-mb-2"
        required
        :title="t('room.colorCategory')"
      >
        <SharedUIColorSelect v-model="form.style" />
      </SharedUILabel>
    </div>
    <div class="tw-flex tw-justify-end tw-pt-2">
      <DialogsDeleteDialog
        :id="form.id ?? -1"
        v-model="dialog"
        class="tw-mr-2"
        :loading="loadingDelete"
        :title="`Вы уверены, что хотите удалить «${form.name}»?`"
        @delete="confirmDelete"
      />

      <Button
        :loading="loading"
      >
        {{ t('save') }}
      </Button>
    </div>
  </LayoutRightbar>
</template>
