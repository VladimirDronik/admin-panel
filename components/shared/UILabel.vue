<script lang="ts" setup>
import { FormField } from '@primevue/forms';
import { useSlots, type Slots, type VNode } from 'vue';

const slots: Slots = useSlots();

const isToggleSwitch = computed(() => {
  const slotContent = slots.default?.();
  if (!slotContent || slotContent.length === 0) return false;

  const vnode = slotContent[0] as VNode;
  return typeof vnode.type === 'object' && 'name' in vnode.type && vnode.type.name === 'ToggleSwitch';
});

withDefaults(defineProps<{
  name?: string,
  width?: number,
  title?: string,
  colomn?: boolean,
  required?: boolean,
  value?: any,
  tooltip?: any,
  leftLabel?: boolean,
}
>(), {
  name: '',
  title: '',
  width: 100,
  colomn: false,
  required: false,
  value: {},
  tooltip: {},
  leftLabel: false,
});
</script>

<template>
  <FormField
    v-slot="$field"
    class="tw-w-full tw-items-center"
    :class="{ 'tw-flex': !colomn }"
    :initial-value="value"
    :name
  >
    <div class="tw-w-full">
      <!-- Label слева -->
      <template v-if="leftLabel || isToggleSwitch">
        <div class="tw-mb-2 tw-flex tw-items-center tw-gap-2">
          <label
            v-if="title"
            class="tw-text-[12px] tw-font-bold"
            :for="name"
            :style="{ width: `${width}px` }"
          >
            <span v-tooltip="tooltip">{{ title }}</span>
            <span
              v-if="required"
              class="tw-text-primary"
            > *</span>
          </label>
          <slot />
        </div>
      </template>

      <!-- Label сверху-->
      <template v-else-if="colomn">
        <label
          v-if="title"
          class="tw-mb-2 tw-text-lg tw-font-bold"
          :for="name"
          :style="{ width: `${width}px` }"
        >
          <span v-tooltip="tooltip">{{ title }}</span>
          <span
            v-if="required"
            class="tw-text-primary"
          > *</span>
        </label>
        <slot />
      </template>

      <!-- FloatLabel -->
      <template v-else>
        <FloatLabel
          v-tooltip="tooltip"
          class="tw-mr-4 tw-w-full"
          variant="in"
        >
          <slot />
          <label
            v-if="title"
            :for="name"
          >
            {{ title }}
            <span
              v-if="required"
              class="tw-text-primary"
            > *</span>
          </label>
        </FloatLabel>
      </template>

      <Message
        v-if="$field?.invalid"
        class="tw-text-danger tw-mt-1 tw-text-sm"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </div>
  </FormField>
</template>
