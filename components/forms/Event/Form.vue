<script setup lang="ts">
// Types and Schemes modules
import type { Event, EventsObject, Action } from '@/types/ModelEventTypes';
import type { Request } from '~/types/StoreTypes';

const props = defineProps<{
  id?: number,
  modelType: string,
  targetType: string,
  eventTypes: EventsObject,
}>();

const form = ref();
const selectedEvent = ref<Event>();

const dialog = ref(false);
const edit = ref(false);

const events = defineModel<Event[]>({
  default: [],
});

const filterEvents = async (type: string) => {
  const objectEvents = props.eventTypes[type];
  if (objectEvents) {
    if (props.id) {
      const requests: Request<{
        [key: string]: Action[]
      }> = await $fetch('http://10.35.16.1:8083/events/actions', {
        params: {
          target_id: props.id,
          target_type: props.targetType,
        },
      });

      const result = objectEvents.map((item) => {
        if (requests.response[item.code]) {
          return {
            ...item,
            actions: requests.response[item.code],
            actionTypes: actionsType(requests.response[item.code]),
          };
        }
        return item;
      });

      events.value = result;
    } else {
      const result = props.eventTypes[type].map((item) => ({
        ...item,
        actionTypes: actionsType(item.actions),
      }));
      events.value = result;
    }
  } else {
    events.value = [];
  }
  if (selectedEvent.value) {
    const eventFind = events.value.find((item) => item.code === selectedEvent.value?.code);
    if (eventFind) selectedEvent.value = eventFind;
  }
};

watch(events, () => {
  form.value = events.value?.find((item: any) => item.code === selectedEvent.value?.code) ?? null;
});

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

updateEvents();

watch(() => [props.modelType, props.id], updateEvents);

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
        <p :class="{ 'tw-opacity-0': !event.actions?.length }">
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
        @update-actions="updateEvents"
        v-model="dialog"
        v-model:event="selectedEvent"
        v-model:form="form"
        :id="id"
        :edit="edit"
        :modelType="modelType"
        :targetType="targetType"
      />
    </div>
    <div v-else>
      <h5 class="tw--pt-3 tw-text-center tw-text-xl">
        События Отсутствуют
      </h5>
    </div>
  </div>
</template>
