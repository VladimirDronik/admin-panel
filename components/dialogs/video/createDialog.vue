<script lang="ts" setup>

const visible = defineModel({
  default: false,
});

const selectType = defineModel<string | null>('type', {
  required: true,
});

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

</script>

<template>
  <div>
    <Button @click="visible = true" label="Далее" :disabled="disabled" />

    <Dialog
      v-model:visible="visible"
      :header="`Добавление ${type}`"
      :style="{ 'max-width': '1200px', width: '100%', margin: '0 20px' }"
      modal
      dismissableMask
    >
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
          <Button label="Создать" :disabled="!selectType" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style>

</style>
