<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const form = defineModel<any>('form', {
  required: false,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

const dialog = ref(false);

const loading = ref(false);
const loadingDelete = ref(false);
</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen">
    <div v-if="form" class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-2xl tw-font-semibold">
          {{ form.is_group ? t('room.addCategory') : t('room.addRoom') }}
        </h3>
        <Button
          @click="isOpen = false"
          icon="pi"
          size="small"
          variant="text"
          text
          rounded
        >
          <XIcon class="white" />
        </Button>
      </div>

      <div class="!tw-px-0 !tw-pt-1">
        <SharedUILabel
          :title="t('room.name')"
          class="tw-mb-2"
          required
        >
          <InputText v-model="form.name" class="tw-w-full" />
        </SharedUILabel>
        <SharedUILabel
          :title="t('room.colorCategory')"
          class="tw-mb-2"
          required
        >
          <SharedUIColorSelect v-model="form.color" />
        </SharedUILabel>
      </div>
      <div class="tw-flex tw-justify-end tw-pt-2">
        <DialogsDeleteDialog
          v-model="dialog"
          :loading="loadingDelete"
          :title="`Вы уверены, что хотите удалить «${form.name}»?`"
          class="tw-mr-2"
          :id="form.item?.id ?? -1"
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
