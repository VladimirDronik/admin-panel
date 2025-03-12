<script lang="ts" setup>
// Builtin modules
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes modules
import type { RoomItem } from '~/stores/rooms/roomsTypes';
import type { Request } from '~/types/StoreTypes';

// Composables
const { t } = useI18n();
const toast = useToast();

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

defineProps<{
  rooms: Request<RoomItem[]> | null
}>();

const room = defineModel<RoomItem | null | undefined>('form', {
  required: true,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

// Variables
const form = ref<RoomItem | null | undefined>();

const resolver = ref(zodResolver(
  z.object({
    name: z.string().min(1),
    style: z.string(),
    is_group: z.boolean(),
  }),
));

// Watchers
watch(room, () => {
  if (room.value) form.value = { ...room.value };
});

const {
  executeChangeRoom,
  statusChangeRoom,
} = await useChangeRoom();

const {
  confirmDelete,
  statusDeleteRoom,
} = await useDeleteRoom();

async function useChangeRoom() {
  // Api
  const {
    status: statusChangeRoom,
    execute: executeChangeRoom,
  } = await useAPI(paths.privateRoomsList, {
    body: computed(() => {
      if (form.value?.parent_id === null) {
        return [{
          ...form.value,
          parent_id: null,
        }];
      }
      return [form.value];
    }),
    success() {
      toast.add({
        severity: 'success',
        summary: t('Помещение было успешно изменено'),
        life: 3000,
      });
      emit('update');
    },
    error() {
      toast.add({
        severity: 'error',
        summary: t('Помещение не было изменено'),
        life: 3000,
      });
    },
    disabledSchema: true,
    method: 'PATCH',
    immediate: false,
    watch: false,
  });

  // Methods

  return {
    statusChangeRoom,
    executeChangeRoom,
  };
}

async function useDeleteRoom() {
  // Api
  const {
    status: statusDeleteRoom,
    execute: executeDeleteRoom,
  } = await useAPI(paths.privateRoom, {
    query: computed(() => ({
      id: form.value?.id,
    })),
    success() {
      toast.add({
        severity: 'success',
        summary: t('Помещение удалено'),
        life: 3000,
      });
      isOpen.value = false;
    },
    error() {
      toast.add({
        severity: 'error',
        summary: t('Ошибка удаления помещения'),
        life: 3000,
      });
    },
    disabledSchema: true,
    method: 'DELETE',
    immediate: false,
    watch: false,
  });

  // Methods
  const confirmDelete = async () => {
    await executeDeleteRoom();
    await emit('update');
  };

  return {
    statusDeleteRoom,
    confirmDelete,
  };
}
</script>

<template>
  <LayoutRightbar
    v-if="form"
    v-model:is-open="isOpen"
    :title="form.is_group ? t('room.addCategory') : t('room.addRoom')"
  >
    <Form
      :resolver
      @submit="({ valid }) => { if (valid) executeChangeRoom() }"
    >
      <div class="!tw-px-0 !tw-pt-1">
        <SharedUILabel
          class="tw-mb-2"
          name="name"
          required
          :title="t('room.name')"
          :value="form.name"
        >
          <InputText
            v-model="form.name"
            class="tw-w-full"
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-2"
          name="style"
          required
          :title="form.is_group ? t('room.colorCategory') : t('Цвет помещения')"
          :value="form.style"
        >
          <SharedUIColorSelect v-model="form.style" />
        </SharedUILabel>
        <SharedUILabel
          v-if="!form.is_group"
          class="tw-mb-2"
          :title="'Группа'"
        >
          <Select
            v-model="form.parent_id"
            class="tw-w-full"
            option-label="name"
            option-value="id"
            :options="rooms?.response.filter((room) => room.id !== form?.id)"
            show-clear
          />
        </SharedUILabel>
      </div>
      <div class="tw-flex tw-justify-end tw-pt-2">
        <DialogDelete
          :id="form.id ?? -1"
          class="tw-mr-2"
          :loading="statusDeleteRoom === 'pending'"
          :title="`Вы уверены, что хотите удалить «${form.name}»?`"
          @delete="confirmDelete"
        />

        <Button
          :label="t('save')"
          :loading="statusChangeRoom === 'pending'"
          type="submit"
        />
      </div>
    </Form>
  </LayoutRightbar>
</template>
