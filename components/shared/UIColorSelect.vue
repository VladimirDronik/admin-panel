<script lang="ts" setup>
// Static data modules
import { colors } from '~/staticData/rooms';
// Helpers modules
import { getRoomColorByValue } from '~/helpers/rooms';

// Declare Options
const value = defineModel<string | null | undefined>({
  required: true,
});

withDefaults(defineProps<{
  options?: {
    name: string;
    code: string;
    color: string;
  }[]
}>(), {
  options: () => colors,
});

</script>

<template>
  <Select
    v-model="value"
    class="tw-w-full"
    option-label="name"
    option-value="code"
    :options
    show-clear
  >
    <template #value="slotProps">
      <div
        v-if="slotProps.value"
        class="tw-flex tw-items-center"
      >
        <div
          class="tw-mr-2 tw-size-4 tw-rounded-full"
          :style="{ backgroundColor: getRoomColorByValue(slotProps.value)?.color }"
        />
        <div class="tw-min-h-6">
          {{ getRoomColorByValue(slotProps.value)?.name }}
        </div>
      </div>
    </template>
    <template #option="slotProps">
      <div class="tw-flex tw-items-center">
        <div
          class="tw-mr-2 tw-size-4 tw-rounded-full"
          :style="{ backgroundColor: slotProps.option.color }"
        />
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Select>
</template>
