<script lang="ts" setup>
// Builtin modules
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { useI18n } from 'vue-i18n';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Static modules
import { itemEventTypes } from '~/staticData/modelEvents';
// Types and Schemes modules
import type { Request } from '~/types/StoreTypes';
import { type itemType } from '~/types/DisplayTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeDevices = useDevicesStore();

// Declare Options
defineProps<{
  devices: string[]
  options: any[]
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

const {
  control_object,
  statusChange,
  resolver,
  changeItem,
} = await useChangeItem();

const {
  statusDelete,
  confirmDelete,
} = await useDeleteItem();

async function useChangeItem() {
  const control_object = ref();

  const resolver = ref(zodResolver(
    z.object({
      title: z.string().min(1),
      zone_id: z.number(),
    }),
  ));

  const {
    status: statusChange,
    execute: executeChangeItem,
  } = await useAPI<Request<any>>(paths.privateItem, {
    body: computed(() => ({
      ...form.value,
      control_object: control_object.value,
    })),
    method: 'PATCH',
    immediate: false,
    watch: false,
  });

  const changeItem = async () => {
    await updateData({
      update: async () => {
        await executeChangeItem();
        await emit('update');
      },
      success: () => {
      },
      successMessage: 'Кнопка была успешно изменена',
      errorMessage: 'Кнопка не была изменена',
    });
  };

  return {
    control_object,
    statusChange,
    resolver,
    changeItem,
  };
}

async function useDeleteItem() {
  const {
    status: statusDelete,
    execute: executeDeleteItem,
  } = await useAPI<Request<any>>(paths.privateItem, {
    query: computed(() => ({
      id: form.value.item_id,
    })),
    method: 'DELETE',
    immediate: false,
    watch: false,
  });

  const confirmDelete = async () => {
    await updateData({
      update: async () => {
        await executeDeleteItem();
        await emit('update');
      },
      success: () => {
        isOpen.value = false;
      },
      successMessage: 'Устройство удалено',
      errorMessage: 'Ошибка удаления устройства',
    });
  };

  return {
    statusDelete,
    confirmDelete,
  };
}

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
            class="tw-mb-2"
            name="title"
            required
            :title="'Название'"
            :value="form.title"
          >
            <InputText
              v-model="form.title"
              class="tw-w-full"
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            name="zone_id"
            required
            :title="'Помещение'"
            :value="form.zone_id"
          >
            <SharedUIRoomSelect v-model="form.zone_id" :options />
          </SharedUILabel>
          <SharedUILabel
            v-if="form.type === 'switch'"
            class="tw-mb-2"
            required
            title="Объект"
          >
            <Select
              v-model="control_object"
              class="tw-w-full"
              option-label="name"
              option-value="id"
              :options="storeDevices.filterByCategoryDevices"
              show-clear
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            :title="'Цвет'"
          >
            <SharedUIColorSelect v-model="form.color" />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            :title="'Иконка'"
          >
            <SharedUIIconSelect
              v-model:icon="form.icon"
              @change="changeItem"
            />
          </SharedUILabel>
          <div class="tw-flex tw-justify-end tw-pt-2">
            <DialogDelete
              :id="form.item_id ?? -1"
              class="tw-mr-2"
              :loading="statusDelete === 'pending'"
              :title="`Вы уверены, что хотите удалить «${form.title}»?`"
              @delete="confirmDelete"
            />

            <Button
              :label="t('save')"
              :loading="statusChange === 'pending'"
              type="submit"
            />
          </div>
        </Form>
      </TabPanel>
      <TabPanel value="events">
        <FormsEventForm
          :id="form.item_id"
          :event-types="itemEventTypes"
          :model-type="form.type"
          :object="form"
          target-type="item"
        />
      </TabPanel>
    </TabPanels>
    <!--  -->
  </Tabs>
</template>
