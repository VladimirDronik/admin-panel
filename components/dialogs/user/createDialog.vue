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
  device_id: null,
  login: null,
  password: null,
  send_push: false,
});

const parentId = ref()

const resolver = ref(zodResolver(
  z.object({
    device_id: z.string().min(1),
    login: z.string().min(1),
    password: z.string().min(1),
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
        device_id: null,
        login: null,
        password: null,
        send_push: false,
      };
      parentId.value = null;
      dialog.value = false;
    },
    successMessage: 'Помещение было успешно создана',
    errorMessage: 'Помещение не было создана',
  });
};

// Hooks
onBeforeMount(async () => {
  // Create Device
  const data: unknown = await useAPI(paths.privateUsers, {
    body: form,
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
      label="Добавить Пользователя"
      @click="dialog = true"
    />
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="'Добавить Пользователя'"
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
            v-model:value.number="form.device_id"
            class="tw-mb-2"
            name="device_id"
            required
            :title="'Идентификатор'"
          >
            <InputText
              v-model.number="form.device_id"
              class="tw-w-full"
              type="number"
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            name="login"
            required
            :title="'Логин'"
            :value="form.login"
          >
            <InputText
              v-model="form.login"
              class="tw-w-full"
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            name="password"
            required
            :title="'Пароль'"
            :value="form.password"
          >
            <InputText
              v-model="form.password"
              class="tw-w-full"
            />
          </SharedUILabel>
        </div>
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
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
          <div class="tw-flex tw-items-center tw-gap-2">
            <Checkbox
              v-model="form.send_push"
              binary
              input-id="send_push"
              name="Push уведомления"
            />
            <label
              class="tw-cursor-pointer tw-text-lg"
              for="send_push"
            >
              Push уведомления
            </label>
          </div>
        </div>
      </Form>
    </Dialog>
  </div>
</template>
