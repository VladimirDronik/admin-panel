<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
import { items } from '~/utils/icons';

// Composables
const { t } = useI18n();

const icon = defineModel<string | null>('icon', {
  default: '',
});

// Declare Options
const dialog = defineModel<boolean>({
  default: false,
});

// Methods
const createRoom = () => {

};
</script>

<template>
  <div>
    <button
      type="button"
      @click="dialog = true"
    >
      <div
        class="border-base tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3"
      >
        <img
          alt=""
          class="tw-w-20"
          :src="`items/${icon}.png`"
        >
      </div>
    </button>
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="'Выбрать Иконку'"
      modal
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <div class="tw-mb-3 tw-grid tw-grid-cols-6 tw-gap-3">
        <button
          v-for="item in items"
          :key="item"
          class="tw-aspect-square"
          type="button"
          @click="icon = item"
        >
          <div
            class="tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3"
            :class="{ 'border-primary': item === icon }"
          >
            <img
              alt=""
              class="tw-w-20"
              :src="`items/${item}.png`"
            >
          </div>
        </button>
      </div>

      <div class="tw-flex tw-justify-end">
        <Button
          class="tw-mr-2"
          @click="createRoom"
        >
          {{ t('save') }}
        </Button>
        <Button
          outlined
          variant="outlined"
          @click="dialog = false"
        >
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.border-primary {
  border-color: #19B58F;
}
</style>
