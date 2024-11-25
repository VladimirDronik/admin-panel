<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const isUpdate = defineModel<boolean>('isUpdate', {
  default: false,
});

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const selectType = 'Камера';

</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen" :isUpdate="isUpdate">
    <div elevation="0" class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
          {{ edit ? 'Изменить Виджет' : 'Добавить Виджет' }}
        </h3>
        <Button
          @click="isOpen = false"
          icon="pi pi-times"
          size="small"
          severity="secondary"
          rounded
          text
        />
      </div>
      <div v-if="selectType">
        <div v-if="selectType === 'Камера'">
          <SharedUILabel class="tw-mb-3" title="Название" required>
            <InputText
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel class="tw-mb-3" title="Производитель" required>
            <Select
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel class="tw-mb-3" title="Ссылка" required>
            <InputText
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel class="tw-mb-3" title="Активность" required>
            <SharedUISwitchField
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <Button label="Создать" :disabled="!selectType" />
        </div>
        <div v-else-if="selectType === 'Видеорегистратор'">
          <SharedUILabel class="tw-mb-3" title="Название" required>
            <InputText
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel class="tw-mb-3" title="Производитель" required>
            <Select
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel class="tw-mb-3" title="IP адрес" required>
            <InputText
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel class="tw-mb-3" title="Логин" required>
            <InputText
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel class="tw-mb-3" title="Пароль" required>
            <InputText
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel class="tw-mb-3" title="Количество камер" required>
            <InputText
              class="tw-w-full"
              required
            />
          </SharedUILabel>
          <Button label="Сохранить" />
        </div>
      </div>
    </div>
  </LayoutFullRightbar>
</template>
