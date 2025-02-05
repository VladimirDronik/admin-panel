<script lang="ts" setup>
// Composables
const storeRooms = useRoomsStore();

// Declare Options
const value = defineModel<number | null>({
  default: null,
});

// Methods
const selectedRoom = (id: number) => storeRooms.getRoomsSelect.find((item) => item.code === id);
</script>

<template>
  <Select
    v-model="value"
    class="tw-w-full"
    option-label="name"
    option-value="code"
    :options="storeRooms.getRoomsSelect"
    required
    show-clear
  >
    <template #value="slotProps">
      <div
        v-if="selectedRoom(slotProps.value)"
        class="tw-flex tw-flex-col"
      >
        <p
          :class="{
            '-tw-mb-1': selectedRoom(slotProps.value)?.inGroup,
            'tw-text-sm': selectedRoom(slotProps.value)?.inGroup,
          }"
        >
          {{ selectedRoom(slotProps.value)?.name }}
        </p>
        <span
          v-if="selectedRoom(slotProps.value)?.inGroup"
          class="tw-text-xs tw-text-gray-400"
        >
          {{ selectedRoom(slotProps.value)?.inGroup?.name }}
        </span>
      </div>
    </template>
    <template #option="slotProps">
      <div class="tw-flex tw-flex-col">
        <p class="-tw-mb-1 tw-text-sm ">
          {{ slotProps.option.name }}
        </p>
        <span
          v-if="slotProps.option.inGroup"
          class="tw-text-xs tw-text-gray-400"
        >
          {{ slotProps.option.inGroup.name }}
        </span>
      </div>
    </template>
  </Select>
</template>
