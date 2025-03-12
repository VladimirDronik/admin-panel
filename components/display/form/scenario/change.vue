<script lang="ts" setup>
// Builtin modules
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { useI18n } from 'vue-i18n';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Static modules
import { scenarioColors } from '~/staticData/rooms';
import { itemEventTypes } from '~/staticData/modelEvents';
// Types and Schemes modules
import type { Event } from '@/types/ModelEventTypes';
import type { Request } from '~/types/StoreTypes';
import type { itemType } from '~/types/DisplayTypes';

// Composables
const { t } = useI18n();
const toast = useToast();

// Declare Options
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
const events = ref<Event[]>();

const resolver = ref(zodResolver(
  z.object({
    title: z.string().min(1),
    zone_id: z.number(),
  }),
));

const {
  status: statusChangeItem,
  execute: executeChangeItem,
} = await useAPI<Request<any>>(paths.privateItem, {
  body: computed(() => form.value),
  success() {
    toast.add({
      severity: 'success',
      summary: t('Сценарий был успешно изменен'),
      life: 3000,
    });
    emit('update');
  },
  error() {
    toast.add({
      severity: 'error',
      summary: t('Сценарий не был изменен'),
      life: 3000,
    });
  },
  disabledSchema: true,
  method: 'PATCH',
  immediate: false,
  watch: false,
});

// Delete Device
const {
  status: statusDeleteItem,
  execute: executeDeleteItem,
} = await useAPI<Request<any>>(paths.privateItem, {
  query: computed(() => ({
    id: form.value.item_id,
  })),
  success() {
    toast.add({
      severity: 'success',
      summary: t('Сценарий удален'),
      life: 3000,
    });
    emit('update');
    isOpen.value = false;
  },
  error() {
    toast.add({
      severity: 'error',
      summary: t('Ошибка удаления сценария'),
      life: 3000,
    });
  },
  disabledSchema: true,
  method: 'DELETE',
  immediate: false,
  watch: false,
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
          @submit="({ valid }) => { if (valid) executeChangeItem() }"
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
            :title="'Цвет'"
          >
            <SharedUIColorSelect
              v-model="form.color"
              :options="scenarioColors"
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-2"
            colomn
            :title="'Иконка'"
          >
            <SharedUIIconSelect
              v-model:icon="form.icon"
              type="scenario"
              @change="executeChangeItem()"
            />
          </SharedUILabel>
          <div class="tw-flex tw-justify-end tw-pt-2">
            <DialogDelete
              :id="form.item_id ?? -1"
              class="tw-mr-2"
              :loading="statusDeleteItem === 'pending'"
              :title="`Вы уверены, что хотите удалить «${form.title}»?`"
              @delete="executeDeleteItem()"
            />

            <Button
              :label="t('save')"
              :loading="statusChangeItem === 'pending'"
              type="submit"
            />
          </div>
        </Form>
      </TabPanel>
      <TabPanel value="events">
        <FormsEventForm
          :id="form.item_id"
          v-model="events"
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
