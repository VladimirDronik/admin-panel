<script setup lang="ts">
import { request } from 'playwright-core';
import type { Devices, Event } from '~/types/DevicesTypes';

const storeDevice = useDevicesStore();

const dialog = ref(false);
const edit = ref(false);

const object = defineModel<Devices>({
  required: true,
  default: null,
});

const form = ref({
  props: [],
});

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
    actions: Object.values(responce[index].data),
  }));
  console.log(result);

  events.value = result;
};

const events = ref<any | null>();

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
    <div v-for="event in events" :key="event.code" class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-px-4 tw-py-2">
      <div class="tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-lg tw-font-semibold">
          {{ event.name }}
        </p>
        <div v-if="events" class="tw-flex tw-items-center tw-justify-end">
          <v-btn
            v-if="events.actions?.length"
            @click="editEvents(event)"
            class="tw-mr-2"
            variant="text"
            size="small"
            prepend-icon="mdi-cog"
          >
            Настройка
          </v-btn>
          <v-btn
            v-else
            @click="createEvents(event)"
            color="primary"
            size="small"
            prepend-icon="mdi-plus"
          >
            Добавить
          </v-btn>
          <!-- <v-switch hide-details color="primary" /> -->
        </div>
      </div>
      <p class="tw-mb-2">
        {{ event.description }}
      </p>
      <!-- <div>
        <ProgressSpinner />
      </div> -->
      <p v-if="events.actions?.length">
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
    <!-- <div class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-p-4">
      <div class="tw-mb-14 tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-lg tw-font-semibold">
          Toggle
        </p>
        <div class="tw-flex tw-items-center tw-justify-end">
          <v-btn
            @click="createEvents(event)"
            color="primary"
            size="small"
            prepend-icon="mdi-plus"
          >
            Добавить
          </v-btn>
        </div>
      </div>
    </div> -->

    <!-- <div class="tw-pt-4">
      <v-btn class="tw-mr-4" color="primary">
        Сохранить
      </v-btn>
      <v-btn color="primary" variant="outlined">
        Отменить
      </v-btn>
    </div> -->

    <DialogsDeviceFeatures
      v-model="dialog"
      v-model:object="object"
      v-model:form="form"
      :edit="edit"
    />
  </div>
</template>
