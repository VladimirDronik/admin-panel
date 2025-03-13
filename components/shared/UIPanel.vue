<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'update'): void
}>();

// Builtin modules
const isUpdate = defineModel<boolean>('isUpdate', {
  default: false,
});

const { isError } = withDefaults(defineProps<{
  isError?: boolean
}>(), {
  isError: false,
});
</script>

<template>
  <div>
    <SharedUILoader
      v-if="!isError"
      :is-update="isUpdate"
    >
      <div class="panel-wrapper tw-relative tw-flex">
        <PerfectScrollbar class="tw-w-full tw-px-6 tw-pt-4">
          <div class="tw-pb-10">
            <slot />
          </div>
        </PerfectScrollbar>
        <slot name="rightbar" />
      </div>
    </SharedUILoader>
    <div
      v-else
      class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-8"
    >
      <img
        alt="404"
        class="tw-mb-5"
        src="/images/background/errorrequest.svg"
        width="400"
      >
      <h2 class="tw-mb-4 tw-text-3xl">
        Ошибка соединения
      </h2>
      <Button
        class="tw-mb-4"
        color="tw-primary"
        flat
        @click="emit('update')"
      >
        {{ t('Повторить соединение') }}
      </Button>
    </div>
  </div>
</template>

<style lang="scss">
.panel-wrapper {
  min-height: calc(100vh - 56px);
  max-height: calc(100vh - 56px);
  padding-bottom: 0;
  overflow: hidden;

  & .ps__rail-x {
    display: none;
  }
}
</style>
