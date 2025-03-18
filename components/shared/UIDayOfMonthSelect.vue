<script lang="ts" setup>
const days = [...Array(31)].map((_, i) => i + 1);

const value = defineModel<number[]>({
  required: true,
});

const toggleDay = (day: number) => {
  if (value.value.includes(day)) value.value = value.value.filter((item) => item !== day);
  else value.value.push(day);
};
</script>

<template>
  <div class="tw-grid tw-grid-cols-10 tw-gap-3">
    <div
      v-for="day in days"
      :key="day"
      class="tw-flex tw-justify-center"
    >
      <button
        class="!tw-aspect-square tw-rounded-full tw-border tw-p-3 tw-text-gray-500"
        :class="{ 'tw-border-primary tw-bg-primary tw-text-white': value.includes(day) }"
        type="button"
        @click="toggleDay(day)"
      >
        <p class="tw-flex tw-size-5 tw-items-center tw-justify-center">
          {{ day }}
        </p>
      </button>
    </div>
  </div>
</template>
