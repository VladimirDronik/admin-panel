<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
import { icons } from '~/utils/icons';

// Composables
const storeUser = useUserStore();

const icon = defineModel<string | null>('icon', {
  default: '',
});

// Declare Options
const emit = defineEmits<{
  (e: 'change'): void
}>();

const props = withDefaults(defineProps<{
  type?: 'items' | 'sensors' | 'scenario'
}>(), {
  type: 'items',
});

const dialog = defineModel<boolean>({
  default: false,
});

// Methods
const selectIcon = (item: string) => {
  icon.value = item;
  emit('change');
  dialog.value = false;
};
</script>

<template>
  <div>
    <button
      type="button"
      @click="dialog = true"
    >
      <div class="border-base tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3">
        <div class="tw-w-20">
          <img
            v-if="icon"
            alt=""
            class="tw-w-20"
            :class="{ 'tw-invert': storeUser.isDark }"
            :src="`items/${icon}.png`"
          >
        </div>
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
          v-for="item in icons[type]"
          :key="item"
          class="tw-aspect-square"
          type="button"
          @click="selectIcon(item)"
        >
          <div
            class="border-base tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3"
            :class="{ 'border-primary': item === icon }"
          >
            <img
              alt=""
              class="tw-w-20"
              :class="{ 'tw-invert': storeUser.isDark }"
              :src="`items/${item}.png`"
            >
          </div>
        </button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.border-primary {
  border-color: #19B58F;
}
</style>
