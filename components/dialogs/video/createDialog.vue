<script lang="ts" setup>
// Declare Options
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const visible = defineModel<boolean>({
  default: false,
});

const selectType = defineModel<string | null>('type', {
  required: true,
});

</script>

<template>
  <div>
    <Button
      :disabled="disabled"
      label="Далее"
      @click="visible = true"
    />

    <Dialog
      v-model:visible="visible"
      dismissable-mask
      :header="`Добавление ${type}`"
      modal
      :style="{ 'max-width': '1200px', width: '100%', margin: '0 20px' }"
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
          <Button
            :disabled="!selectType"
            label="Создать"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>
