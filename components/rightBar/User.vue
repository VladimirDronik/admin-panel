<script lang="ts" setup>
// Builtin modules
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
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

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

// Variables
const form = ref<RoomItem | null | undefined>();

const dialog = ref(false);

const loading = ref(false);
const loadingDelete = ref(false);

const resolver = ref(zodResolver(
  z.object({
    name: z.string().min(1),
    style: z.string(),
    is_group: z.boolean(),
  }),
));

// Apis
const apiChangeRoom = ref<APIData<any>>();
const apiDeleteRoom = ref<APIData<any>>();

// Methods
const changeRoom = async () => {
  await updateData({
    update: async () => {
      await apiChangeRoom.value?.execute();
      await emit('update');
    },
    success: () => {
    },
    successMessage: 'Помещение было успешно изменено',
    errorMessage: 'Помещение не было изменено',
  });
};

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
};

// Hooks
onBeforeMount(async () => {
  // Change Device
  const dataChange: unknown = await useAPI(paths.privateRoomsList, {
    body: computed(() => [form.value]),
    method: 'PATCH',
    immediate: false,
    watch: false,
  });

  apiChangeRoom.value = dataChange as APIData<any>;

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
    <Form
      :resolver
      @submit="({ valid }) => { if (valid) changeRoom() }"
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
      </div>
      <div class="tw-flex tw-justify-end tw-pt-2">
        <DialogDelete
          :id="form.id ?? -1"
          v-model="dialog"
          class="tw-mr-2"
          :loading="loadingDelete"
          :title="`Вы уверены, что хотите удалить «${form.name}»?`"
          @delete="confirmDelete"
        />

        <Button
          :label="t('save')"
          :loading="loading"
          type="submit"
        />
      </div>
    </Form>
  </LayoutRightbar>
</template>
