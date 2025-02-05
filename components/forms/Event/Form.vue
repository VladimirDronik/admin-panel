<script setup lang="ts">
// Types and Schemes modules
import type { Request } from '~/types/StoreTypes';
import type { Event, EventsObject, Action } from '@/types/ModelEventTypes';

// Declare Options
const props = defineProps<{
  id?: number,
  modelType: string,
  targetType: string,
  eventTypes: EventsObject,
}>();

const events = defineModel<Event[]>({
  default: [],
});

// Variables
const form = ref();
const selectedEvent = ref<Event>();

const dialog = ref(false);
const edit = ref(false);

// Methods
const filterEvents = async (type: string) => {
  const objectEvents = props.eventTypes[type];
  if (objectEvents) {
    if (props.id) {
      const requests: Request<{
        [key: string]: Action[]
      }> = await $fetch(paths.eventsActions, {
        params: {
          target_id: props.id,
          target_type: props.targetType,
        },
      });

      events.value = objectEvents.map((item) => {
        if (requests.response[item.code]) {
          return {
            ...item,
            actions: requests.response[item.code],
            actionTypes: actionsType(requests.response[item.code]),
          };
        }
        return item;
      });
    } else {
      events.value = props.eventTypes[type].map((item) => ({
        ...item,
        actionTypes: actionsType(item.actions),
      }));
    }
  } else {
    events.value = [];
  }

  if (selectedEvent.value) {
    const eventFind = events.value.find((item) => item.code === selectedEvent.value?.code);
    if (eventFind) selectedEvent.value = eventFind;
  }
};

const actionsType = (actions: any[]) => {
  if (actions) {
    return {
      method: actions.filter((item) => item.type === 'method').length,
      delay: actions.filter((item) => item.type === 'delay').length,
      script: actions.filter((item) => item.type === 'script').length,
      notification: actions.filter((item) => item.type === 'notification').length,
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
  filterEvents(props.modelType);
};

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

// Watchers
watch(events, () => {
  form.value = events.value?.find((item: any) => item.code === selectedEvent.value?.code) ?? null;
});

watch(() => [props.modelType, props.id], updateEvents);

// Created
updateEvents();
</script>

<template>
  <div>
    <div v-if="events.length">
      <div
        v-for="event in events"
        :key="event.code"
        class="border-base tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-p-4"
      >
        <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
          <p class="tw-text-lg tw-font-semibold">
            {{ event.name }}
          </p>
          <div
            v-if="event"
            class="tw-flex tw-items-center tw-justify-end"
          >
            <Button
              v-if="event.actions?.length"
              icon="pi pi-cog"
              label="Настройка"
              severity="secondary"
              size="small"
              text
              @click="editEvents(event)"
            />
            <Button
              v-else
              color="primary"
              icon="pi pi-plus"
              label="Добавить"
              size="small"
              @click="createEvents(event)"
            />
          </div>
        </div>
        <p class="tw-mb-2">
          {{ event.description }}
        </p>
        <p :class="{ 'tw-opacity-0': !event?.actions?.length }">
          <span class="tw-mr-2 tw-text-primary">
            Метод {{ event.actionTypes?.method }}
          </span>
          <span class="tw-text-warn tw-mr-2">
            Пауза {{ event.actionTypes?.delay }}
          </span>
          <span class="tw-text-info tw-mr-2">
            Скрипт {{ event.actionTypes?.script }}
          </span>
          <span class="tw-text-danger">
            Уведомление {{ event.actionTypes?.notification }}
          </span>
        </p>
      </div>

      <FormsEventActions
        v-if="selectedEvent"
        :id="id"
        v-model="dialog"
        v-model:event="selectedEvent"
        :edit="edit"
        :model-type="modelType"
        :target-type="targetType"
        @update-actions="updateEvents"
      />
    </div>
    <div v-else>
      <h5 class="tw--pt-3 tw-text-center tw-text-xl">
        События Отсутствуют
      </h5>
    </div>
  </div>
</template>
