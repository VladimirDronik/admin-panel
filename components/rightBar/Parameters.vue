<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const selectedParameter = defineModel<any>('selectedParameter', {
  default: false,
});

</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen">
    <div elevation="0" class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
          Изменить Параметр
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
      <div>
        <SharedUILabel class="tw-mb-3" title="Название" required>
          <InputText
            class="tw-w-full"
            v-model="selectedParameter.name"
            required
          />
        </SharedUILabel>
        <SharedUILabel class="tw-mb-3" title="Значение" required>
          <InputText
            class="tw-w-full"
            v-model="selectedParameter.value"
            required
          />
        </SharedUILabel>
        <SharedUILabel class="tw-mb-3" title="Описание" required>
          <InputText
            class="tw-w-full"
            v-model="selectedParameter.description"
            required
          />
        </SharedUILabel>
      </div>
      <Button label="Сохранить" />
    </div>
  </LayoutFullRightbar>
</template>
