<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next';
import { IconGripVertical } from '@tabler/icons-vue';
import type { Event } from '@/types/ModelEventTypes';
// Helper modules
import { getActionsColor, getActionsTitle } from '~/helpers/devices';

// const event = defineModel<Event>({
//   required: true,
// })

const { event } = defineProps<{
  event: Event;
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>();

const deleteItem = (id: number) => {
  emit('delete', id);
};

</script>

<template>
  <VueDraggableNext
    :animation="300"
    class="tw-min-h-10 tw-w-full"
    :group="{ name: 'g1' }"
    handle=".handle-item"
    :list="event.actions"
  >
    <div
      v-for="eventItem in event.actions"
      :key="eventItem.id"
      class="border-base tw-rounded tw-border-x tw-border-t [&:last-child]:tw-border-b"
    >
      <div
        v-if="eventItem.type !== 'condition'"
        class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-2"
      >
        <div class="tw-mr-4 tw-flex tw-items-center tw-justify-between">
          <Tag
            class="tw-mr-3 !tw-w-32"
            :severity="getActionsColor(eventItem.type)"
          >
            <p class="tw-font-normal">
              {{ getActionsTitle(eventItem.type, eventItem.args) }}
            </p>
          </Tag>
          <p v-if="eventItem.type === 'delay'">
            {{ event?.name ? event.name : '-' }}
          </p>
          <p v-else-if="eventItem.type === 'script'">
            {{ eventItem?.args?.name ? eventItem.args.name : '-' }}
          </p>
          <p v-else-if="eventItem.type === 'method'">
            {{ eventItem?.args?.object ? eventItem.args.object : '-' }}
          </p>
          <p v-else>
            {{ eventItem?.args?.description ? eventItem.args.description : '-' }}
          </p>
        </div>
        <div class="tw-flex tw-items-center">
          <Button
            aria-label="Cancel"
            class="tw-mr-2"
            icon="pi pi-trash"
            rounded
            severity="secondary"
            text
            @click.stop="emit('delete', eventItem.id)"
          />
          <IconGripVertical class="handle-item tw-w-5 tw-cursor-pointer" />
        </div>
      </div>
      <div
        v-else
        class="tw-px-5 tw-py-2"
      >
        <div
          class="tw-flex tw-items-center tw-justify-between"
        >
          <div class="tw-relative tw-right-3 tw-flex tw-items-center">
            <Button
              class="tw-mr-2"
              :class="{'-tw-rotate-90': eventItem.args.isOpen}"
              icon="pi pi-angle-down"
              rounded
              severity="secondary"
              size="small"
              text
              @click.stop="eventItem.args.isOpen = !eventItem.args.isOpen"
            />
            <Tag
              class="tw-mr-3 !tw-w-32"
              severity="secondary"
            >
              <p class="tw-font-normal">
                Условие
              </p>
            </Tag>
          </div>
          <div class="tw-flex tw-items-center">
            <Button
              aria-label="Cancel"
              class="tw-mr-2"
              icon="pi pi-trash"
              rounded
              severity="secondary"
              text
              @click.stop="emit('delete', eventItem.id)"
            />
            <IconGripVertical class="handle-item tw-w-5 tw-cursor-pointer" />
          </div>
        </div>
        <div
          class="tw-pt-2"
          :class="{'tw-hidden': eventItem.args.isOpen}"
        >
          <div class="tw-mb-3 tw-flex tw-items-center tw-gap-2">
            <p class="tw-w-20">
              Если
            </p>
            <div class="border-base tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-border tw-p-2">
              <div class="tw-flex tw-w-full tw-flex-col tw-items-start tw-gap-2" />
              <Button
                icon="pi pi-pencil"
                rounded
                severity="secondary"
                text
              />
            </div>
          </div>
          <div class="tw-flex tw-items-center tw-gap-2">
            <p class="tw-w-20">
              Тогда
            </p>
            
            <div
              class="border-base tw-flex tw-min-h-14 tw-w-full tw-flex-col tw-items-start tw-gap-2 tw-rounded-md tw-border"
              :class="{'!tw-border-0': eventItem.actions.length}"
            >
              <FormsEventActionsListItem
                :event="eventItem"
                @delete="deleteItem"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </VueDraggableNext>
</template>
