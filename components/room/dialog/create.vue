<script setup lang="ts">
// Builtin modules
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Types and Schemes modules
import type { Request } from '~/types/StoreTypes';

// Composables
const { t } = useI18n();
const toast = useToast();

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const dialog = defineModel<boolean>({
  default: false,
});

defineProps<{
  groupRooms: Request<RoomItem[]> | null
}>();

const {
  form,
  parentId,
  resolver,
  statusCreateRoom,
  executeCreateRoom,
} = await useCreateRoom();

// Methods
async function useCreateRoom() {
  const form = ref({
    name: null,
    style: null,
    sort: 0,
    is_group: false,
  });

  const parentId = ref();

  const resolver = ref(zodResolver(
    z.object({
      name: z.string().min(1),
      style: z.string(),
    }),
  ));

  const {
    status: statusCreateRoom,
    execute: executeCreateRoom,
  } = await useAPI(paths.privateRoom, {
    body: computed(() => {
      if (parentId.value && !form.value.is_group) {
        return {
          ...form.value,
          parent_id: parentId.value,
        };
      }
      return {
        ...form.value,
        parent_id: null,
      };
    }),
    success() {
      toast.add({
        severity: 'success',
        summary: t('Помещение было успешно создана'),
        life: 3000,
      });
      form.value = {
        name: null,
        style: null,
        sort: 0,
        is_group: false,
      };
      parentId.value = null;
      dialog.value = false;
      emit('update');
    },
    error() {
      toast.add({
        severity: 'error',
        summary: t('Помещение не было создано'),
        life: 3000,
      });
    },
    disabledSchema: true,
    method: 'POST',
    immediate: false,
    watch: false,
  });

  return {
    form,
    parentId,
    resolver,
    statusCreateRoom,
    executeCreateRoom,
  };
}

</script>

<template>
  <div>
    <Button
      icon="pi pi-plus"
      label="Добавить Помещение"
      @click="dialog = true"
    />
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="'Добавить Помещение'"
      modal
      :style="{
        'max-width': '800px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <Form
        :resolver
        @submit="({ valid }) => { if (valid) executeCreateRoom() }"
      >
        <div class="tw-mb-5">
          <SharedUILabel
            class="tw-mb-2"
            name="name"
            required
            :title="'Название'"
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
            :title="'Цвет'"
            :value="form.style"
          >
            <SharedUIColorSelect v-model="form.style" />
          </SharedUILabel>
          <div class="tw-mb-2 tw-flex tw-items-center">
            <Checkbox
              v-model="form.is_group"
              binary
              class="tw-mr-1"
              input-id="regulator"
              name="Регулировка"
            />
            <label
              class="tw-cursor-pointer tw-text-lg"
              for="regulator"
            >
              Является группой
            </label>
          </div>
          <SharedUILabel
            v-if="!form.is_group"
            class="tw-mb-2"
            :title="'Выбор Группы'"
          >
            <Select
              v-model="parentId"
              class="tw-w-full"
              option-label="name"
              option-value="id"
              :options="groupRooms?.response"
              show-clear
            />
          </SharedUILabel>
        </div>
        <div class="tw-flex">
          <Button
            class="tw-mr-2"
            :label="t('save')"
            :loading="statusCreateRoom === 'pending'"
            type="submit"
          />
          <Button
            :label="t('cancel')"
            outlined
            variant="outlined"
            @click="dialog = false"
          />
        </div>
      </Form>
    </Dialog>
  </div>
</template>
