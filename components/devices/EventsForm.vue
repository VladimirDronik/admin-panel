<script setup lang="ts">
import { request } from 'playwright-core';
import type { Devices, Event } from '~/types/DevicesTypes';

const storeDevice = useDevicesStore();

const dialog = ref(false);
const edit = ref(false);

const object = defineModel<Devices>({
  required: true,
});

const form = ref();

const events = ref<any | null>();

const filterEvents = async (object: Devices) => {
  if (!object.events) return [];
  const objectEvents = Object.values(object.events);

  const requests = objectEvents.map((item) => $fetch('http://10.35.16.1:8083/events/actions', {
    params: {
      target_id: object.id,
      target_type: item.target_type,
    },
  }));

  const responce: any[] = await Promise.all(requests);

  const result = objectEvents.map((item, index) => ({
    ...item,
    actions: Object.values(responce[index].data)[0],
  }));

  events.value = result;
};

const updateEvents = () => {
  filterEvents(object.value);
};

updateEvents();

watch(() => object.value?.events, updateEvents);

const createEvents = (event: any) => {
  form.value = event;
  dialog.value = true;
  edit.value = true;
};

const editEvents = (event: any) => {
  form.value = event;
  dialog.value = true;
  edit.value = false;
};

</script>

<template>
  <div v-if="events">
    <div v-for="event in events" :key="event.code" class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-p-4">
      <div class="tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-lg tw-font-semibold">
          {{ event.name }}
        </p>
        <div v-if="events" class="tw-flex tw-items-center tw-justify-end">
          <Button
            v-if="events.actions?.length"
            @click="editEvents(event)"
            severity="contrast"
            size="small"
            text
          >
            Настройка
          </Button>
          <Button
            v-else
            @click="createEvents(event)"
            color="primary"
            size="small"
            prepend-icon="mdi-plus"
          >
            Добавить
          </Button>
        </div>
      </div>
      <p class="tw-mb-2">
        {{ event.description }}
      </p>
      <!-- <div>
        <ProgressSpinner />
      </div> -->
      <p :class="{ 'tw-opacity-0': !events.actions?.length }">
        <span class="text-primary tw-mr-2">
          Метод 0
        </span>
        <span class="text-warning tw-mr-2">
          Пауза 0
        </span>
        <span class="text-info tw-mr-2">
          Скрипт 0
        </span>
        <span class="text-error">
          Уведомление 0
        </span>
      </p>
    </div>

    <DialogsDeviceEvents
      v-model="dialog"
      v-model:object="object"
      v-model:form="form"
      :edit="edit"
    />
  </div>
</template>
