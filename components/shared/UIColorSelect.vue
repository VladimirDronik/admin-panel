<script lang="ts" setup>
// Static data modules
import { colors } from '~/staticData/rooms';
// Helpers modules
import { getRoomColorByValue } from '~/helpers/rooms';

const value = defineModel<string | null>({
  default: null,
});
</script>

<template>
  <Select
    v-model="value"
    :options="colors"
    optionLabel="name"
    optionValue="code"
    class="tw-w-full"
    showClear
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="tw-flex tw-items-center">
        <div :style="{ backgroundColor: getRoomColorByValue(slotProps.value)?.color }" class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full" />
        <div>{{ getRoomColorByValue(slotProps.value)?.name }}</div>
      </div>
    </template>
    <template #option="slotProps">
      <div class="tw-flex tw-items-center">
        <div :style="{ backgroundColor: slotProps.option.color }" class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full" />
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Select>
</template>
