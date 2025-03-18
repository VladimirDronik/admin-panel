<script lang="ts" setup>
const value = defineModel<boolean>();

const { title, tooltip } = defineProps<{
  title: string,
  tooltip?: string,
}>();
</script>

<template>
  <div class="tw-mb-4 tw-flex tw-items-center">
    <div class="tw-flex tw-min-w-32 tw-items-center">
      <Checkbox
        v-model="value"
        binary
        class="tw-mr-2"
        input-id="regulator"
        name="Регулировка"
      />
      <label
        class="tw-cursor-pointer tw-text-lg"
        for="regulator"
      >
        {{ title }}
      </label>
    </div>
    <i
      v-if="tooltip"
      v-tooltip.top="{
        value: tooltip,
        pt: {
          arrow: {
            style: {
              borderBottomColor: 'var(--p-primary-color)',
            },
          },
          text: '!bg-primary !text-primary-contrast !font-medium',
        },
      }"
      class="pi pi-question-circle tw-cursor-pointer"
      style="font-size: 1.2rem"
    />
  </div>
</template>
