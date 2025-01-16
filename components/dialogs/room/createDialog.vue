<script setup lang="ts">
// Builtin modules
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { APIData } from '~/types/StoreTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeRooms = useRoomsStore()

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const dialog = defineModel<boolean>({
  default: false,
});

// Variables
const type = [
  {
    name: 'Помещение',
    code: false,
  },
  {
    name: 'Группа Помещений',
    code: true,
  },
]

const apiCreateRoom = ref<APIData<any>>()

const form = ref({
  name: null,
  style: null,
  is_group: true,
  sort: 0,
});

const parentId = ref()

const resolver = ref(zodResolver(
  z.object({
    name: z.string().min(1),
    style: z.string(),
    is_group: z.boolean(),
  }),
));

// Methods
const createRoom = async () => {
  await updateData({
    update: async () => {
      await apiCreateRoom.value?.execute();
      await emit('update');
    },
    success: () => {
      form.value = {
        name: null,
        style: null,
        is_group: true,
        sort: 0,
      };
      parentId.value = null;
      dialog.value = false;
    },
    successMessage: 'Помещение было успешно создана',
    errorMessage: 'Помещение не было создана',
  });
};

watch(() => form.value.is_group, (newValue) => {
  if (!newValue) parentId.value = null
})

// Hooks
onBeforeMount(async () => {
  // Create Device
  const data: unknown = await useAPI(paths.privateRoom, {
    body: computed(() => {
      if (parentId.value) {
        return {
          ...form.value,
          parent_id: parentId.value
        }
      }
      return form.value;
    })
      ,
    method: 'POST',
    immediate: false,
    watch: false,
  });

  apiCreateRoom.value = data as APIData<any>;
});

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
        @submit="({ valid }) => { if (valid) createRoom() }"
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
            :title="'Цвет Категории'"
            :value="form.style"
          >
            <SharedUIColorSelect v-model="form.style" />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            name="is_group"
            required
            :title="'Тип'"
            :value="form.is_group"
          >
            <Select
              v-model="form.is_group"
              class="tw-w-full"
              option-label="name"
              option-value="code"
              :options="type"
            />
          </SharedUILabel>
          <SharedUILabel
            v-if="!form.is_group"
            class="tw-mb-2"
            :title="'Группа'"
          >
            <Select
              v-model="parentId"
              class="tw-w-full"
              option-label="name"
              option-value="id"
              :options="storeRooms.getGroupRooms"
            />
          </SharedUILabel>
        </div>
        <div class="tw-flex">
          <Button
            class="tw-mr-2"
            :label="t('save')"
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
