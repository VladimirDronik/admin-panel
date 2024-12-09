<script setup lang="ts">
import type { Devices } from '~/types/DevicesTypes';
// Types and Schemes modules
import { type itemType } from '~/types/DisplayTypes';
import type { Event, EventsObject } from '@/types/ModelEventTypes';

const props = defineProps<{
  eventTypes: EventsObject
  type: string
}>();

const form = ref();
const selectedEvent = ref<Event>();

const dialog = ref(false);
const edit = ref(false);

const events = ref<Event[]>([]);

const filterEvents = async (type: string) => {
  const eventsProps = props.eventTypes;
  const objectEvents = eventsProps[type];
  if (objectEvents) {
    events.value = objectEvents;

    // const requests = objectEvents.map((item) => $fetch('http://10.35.16.1:8083/events/actions', {
    //   params: {
    //     target_id: object.item_id,
    //     target_type: object.type,
    //   },
    // }));

    // const responce: any[] = await Promise.all(requests);

    // const filteredResponce = responce.map((item) => item.response);
    // console.log(filteredResponce);

    // const result = objectEvents.map((item, index) => ({
    //   ...item,
    //   actions: filteredResponce[index][item.code],
    //   actionTypes: actionsType(filteredResponce[index][item.code]),
    // }));

  // events.value = result;
  } else {
    events.value = [];
  }
};

watch(events, () => {
  form.value = events.value?.find((item: any) => item.code === selectedEvent.value?.code) ?? null;
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
  filterEvents(props.type);
};

updateEvents();

watch(() => props.type, updateEvents);

const createEvents = (event: Event) => {
  selectedEvent.value = event;
  form.value = event;
  dialog.value = true;
  edit.value = true;
};

const editEvents = (event: Event) => {
  selectedEvent.value = event;
  form.value = event;
  dialog.value = true;
  edit.value = false;
};

</script>

<template>
  <div>
    <div v-if="events.length">
      <div v-for="event in events" :key="event.code" class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-p-4">
        <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
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
              severity="secondary"
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
        <!-- <p :class="{ 'tw-opacity-0': !event.actions?.length }">
          <span class="tw-mr-2 tw-text-primary">
            Метод {{ event.actionTypes.method }}
          </span>
          <span class="tw-text-warn tw-mr-2">
            Пауза {{ event.actionTypes.delay }}
          </span>
          <span class="tw-text-info tw-mr-2">
            Скрипт {{ event.actionTypes.script }}
          </span>
          <span class="tw-text-danger">
            Уведомление {{ event.actionTypes.notification }}
          </span>
        </p> -->
      </div>

      <DialogsDeviceEvents
        @update-actions="updateEvents"
        v-model="dialog"
        v-model:object="selectedEvent"
        v-model:form="form"
        :edit="edit"
      />
    </div>
    <div v-else>
      <h5 class="tw--pt-3 tw-text-center tw-text-xl">
        События Отсутствуют
      </h5>
    </div>
  </div>
</template>
