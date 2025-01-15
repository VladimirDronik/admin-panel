<script lang="ts" setup>
// Static data modules
import { colors } from '~/staticData/rooms';
// Helpers modules
import { getRoomColorByValue } from '~/helpers/rooms';

// Declare Options
const value = defineModel<string | null | undefined>({
  required: true,
});

</script>

<template>
  <Select
    v-model="value"
    class="tw-w-full"
    option-label="name"
    option-value="code"
    :options="colors"
    show-clear
  >
    <template #value="slotProps">
      <div
        v-if="slotProps.value"
        class="tw-flex tw-items-center"
      >
        <div
          class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full"
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
          class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full"
          :style="{ backgroundColor: slotProps.option.color }"
        />
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Select>
</template>
