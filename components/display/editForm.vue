<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form } from '@primevue/forms';
// Static modules
import { itemEventTypes } from '~/staticData/modelEvents';
// Types and Schemes modules
import type { APIData } from '~/types/StoreTypes';
import { type itemType } from '~/types/DisplayTypes';
import type { Event } from '@/types/ModelEventTypes';

// Composables
const { t } = useI18n();
const storeRooms = useRoomsStore();
const { updateData } = useUtils();

defineProps<{
  devices: string[]
}>();

const emit = defineEmits<{
  (e: 'update'): void
}>();

const form = defineModel<itemType>('form', {
  required: true,
});

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

// Variables
const loadingDelete = ref(false);

const events = ref<Event[]>();

const apiChangeItem = ref<APIData<any>>();
const apiDeleteItem = ref<APIData<any>>();

const resolver = ref(zodResolver(
  z.object({
    title: z.string().min(1),
    type: z.string(),
    zone_id: z.number(),
  }),
));

const changeItem = async () => {
  await updateData({
    update: async () => {
      await apiChangeItem.value?.execute();
      await emit('update');
    },
    success: () => {
    },
    successMessage: 'Кнопка была успешно создана',
    errorMessage: 'Кнопка не была создана',
  });
};

const confirmDelete = async () => {
  await updateData({
    update: async () => {
      await apiDeleteItem.value?.execute();
      await emit('update');
    },
    success: () => {
      isOpen.value = false;
    },
    successMessage: 'Устройство удалено',
    errorMessage: 'Ошибка удаления устройства',
  });
};

onBeforeMount(async () => {
  // Create Device
  const dataCreate: unknown = await useAPI(paths.privateItem, {
    body: computed(() => form.value),
    method: 'PATCH',
    immediate: false,
    watch: false,
  });

  apiChangeItem.value = dataCreate as APIData<any>;

  // Delete Device
  const dataDelete: unknown = await useAPI(paths.privateItem, {
    query: computed(() => ({
      id: form.value.item_id,
    })),
    method: 'DELETE',
    immediate: false,
    watch: false,
  });

  apiDeleteItem.value = dataDelete as APIData<any>;
});

</script>

<template>
  <Tabs value="features">
    <!-- Header -->
    <TabList>
      <Tab value="features">
        <p class="tw-font-normal">
          {{ t('devices.features') }}
        </p>
      </Tab>
      <Tab value="events">
        <p class="tw-font-normal">
          {{ t('devices.events') }}
        </p>
      </Tab>
    </TabList>
    <!--  -->

    <!-- Container -->
    <TabPanels>
      <TabPanel value="features">
        <Form
          :resolver
          @submit="({ valid }) => { if (valid) changeItem() }"
        >
          <SharedUILabel
            :title="'Название'"
            :value="form.title"
            name="title"
            class="tw-mb-2"
            required
          >
            <InputText v-model="form.title" class="tw-w-full" />
          </SharedUILabel>
          <SharedUILabel
            :title="'Тип'"
            :value="form.type"
            name="type"
            class="tw-mb-2"
            required
          >
            <Select
              v-model="form.type"
              :options="devices"
              class="tw-w-full"
              show-clear
            />
          </SharedUILabel>
          <SharedUILabel
            :title="'Помещение'"
            :value="form.zone_id"
            name="zone_id"
            class="tw-mb-2"
            required
          >
            <Select
              v-model="form.zone_id"
              :options="storeRooms.getRoomsSelect"
              optionLabel="name"
              optionValue="code"
              class="tw-w-full"
              required
              show-clear
            />
          </SharedUILabel>
          <SharedUILabel
            :title="'Цвет'"
            class="tw-mb-2"
          >
            <SharedUIColorSelect v-model="form.color" />
          </SharedUILabel>
          <div class="tw-flex tw-justify-end tw-pt-2">
            <DialogsDeleteDialog
              @delete="confirmDelete"
              :loading="loadingDelete"
              :title="`Вы уверены, что хотите удалить «${form.title}»?`"
              class="tw-mr-2"
              :id="form.item_id ?? -1"
            />

            <Button
              :label="t('save')"
              :loading="apiChangeItem?.pending && apiChangeItem.status !== 'idle'"
              type="submit"
            />
          </div>
        </Form>
      </TabPanel>
      <TabPanel value="events">
        <FormsEventForm
          v-model="events"
          targetType="item"
          :object="form"
          :id="form.item_id"
          :modelType="form.type"
          :eventTypes="itemEventTypes"
        />
      </TabPanel>
    </TabPanels>
    <!--  -->
  </Tabs>
</template>
