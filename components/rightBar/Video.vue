<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

// Declare Options
defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const isUpdate = defineModel<boolean>('isUpdate', {
  default: false,
});

// Variables
const selectType = 'Камера';

</script>

<template>
  <LayoutRightbar
    v-model:is-open="isOpen"
    :is-update="isUpdate"
    :title="edit ? t('video.changeWidget') : t('video.changeWidget')"
  >
    <div v-if="selectType">
      <div v-if="selectType === 'Камера'">
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Название"
        >
          <InputText
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Производитель"
        >
          <Select
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Ссылка"
        >
          <InputText
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Активность"
        >
          <SharedUISwitchField
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <Button
          :disabled="!selectType"
          label="Создать"
        />
      </div>
      <div v-else-if="selectType === 'Видеорегистратор'">
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Название"
        >
          <InputText
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Производитель"
        >
          <Select
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          title="IP адрес"
        >
          <InputText
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Логин"
        >
          <InputText
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Пароль"
        >
          <InputText
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          title="Количество камер"
        >
          <InputText
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <Button label="Сохранить" />
      </div>
    </div>
  </LayoutRightbar>
</template>
