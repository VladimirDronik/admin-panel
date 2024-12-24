<script lang="ts" setup>
// Builtin modules
import { IconX } from '@tabler/icons-vue';
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

// Declare Options
const form = defineModel<any>('form', {
  required: false,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

// Variables
const dialog = ref(false);

const loading = ref(false);
const loadingDelete = ref(false);
</script>

<template>
  <LayoutFullRightbar :is-open="isOpen">
    <div
      v-if="form"
      class="tw-min-h-80 tw-p-7"
    >
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-2xl tw-font-semibold">
          {{ form.is_group ? t('room.addCategory') : t('room.addRoom') }}
        </h3>
        <Button
          icon="pi"
          rounded
          size="small"
          text
          variant="text"
          @click="isOpen = false"
        >
          <IconX class="white" />
        </Button>
      </div>

      <div class="!tw-px-0 !tw-pt-1">
        <SharedUILabel
          class="tw-mb-2"
          required
          :title="t('room.name')"
        >
          <InputText
            v-model="form.name"
            class="tw-w-full"
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-2"
          required
          :title="t('room.colorCategory')"
        >
          <SharedUIColorSelect v-model="form.color" />
        </SharedUILabel>
      </div>
      <div class="tw-flex tw-justify-end tw-pt-2">
        <DialogsDeleteDialog
          :id="form.item?.id ?? -1"
          v-model="dialog"
          class="tw-mr-2"
          :loading="loadingDelete"
          :title="`Вы уверены, что хотите удалить «${form.name}»?`"
        />

        <Button
          :loading="loading"
        >
          {{ t('save') }}
        </Button>
      </div>
    </div>
  </LayoutFullRightbar>
</template>
