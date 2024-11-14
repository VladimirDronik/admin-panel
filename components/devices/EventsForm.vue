<script setup lang="ts">
import type { Devices } from '~/types/DevicesTypes';

const dialog = ref(false);
const edit = ref(false);

const object = defineModel<Devices>({
  required: true,
});

const form = ref();
const selectedEvent = ref('');

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

  const filteredResponce = responce.map((item) => item.data);

  const result = objectEvents.map((item, index) => ({
    ...item,
    actions: filteredResponce[index][item.code],
    actionTypes: actionsType(filteredResponce[index][item.code]),
  }));

  events.value = result;
};

watch(events, () => {
  form.value = events.value?.find((item: any) => item.code === selectedEvent.value) ?? null;
});

const actionsType = (actions: any[]) => {
  if (actions) {
    return {
      method: actions.filter((item) => item.target_type === 'method').length,
      delay: actions.filter((item) => item.target_type === 'delay').length,
      script: actions.filter((item) => item.target_type === 'script').length,
      notification: actions.filter((item) => item.target_type === 'notification').length,
    };
  }
  return {
    method: 0,
    delay: 0,
    script: 0,
    notification: 0,
  };
};

const updateEvents = () => {
  filterEvents(object.value);
};

updateEvents();

watch(() => object.value?.events, updateEvents);

const createEvents = (event: any) => {
  selectedEvent.value = event.code;
  form.value = event;
  dialog.value = true;
  edit.value = true;
};

const editEvents = (event: any) => {
  selectedEvent.value = event.code;
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
        <div v-if="event" class="tw-flex tw-items-center tw-justify-end">
          <Button
            v-if="event.actions?.length"
            @click="editEvents(event)"
            size="small"
            text
            label="Настройка"
            icon="pi pi-cog"
          />
          <Button
            v-else
            @click="createEvents(event)"
            color="primary"
            size="small"
            label="Добавить"
            icon="pi pi-plus"
          />
        </div>
      </div>
      <p class="tw-mb-2">
        {{ event.description }}
      </p>
      <!-- <div>
        <ProgressSpinner />
      </div> -->
      <p :class="{ 'tw-opacity-0': !event.actions?.length }">
        <span class="text-primary tw-mr-2">
          Метод {{ event.actionTypes.method }}
        </span>
        <span class="text-warning tw-mr-2">
          Пауза {{ event.actionTypes.delay }}
        </span>
        <span class="text-info tw-mr-2">
          Скрипт {{ event.actionTypes.script }}
        </span>
        <span class="text-error">
          Уведомление {{ event.actionTypes.notification }}
        </span>
      </p>
    </div>

    <DialogsDeviceEvents
      @update-actions="updateEvents"
      v-model="dialog"
      v-model:object="object"
      v-model:form="form"
      :edit="edit"
    />
  </div>
</template>
