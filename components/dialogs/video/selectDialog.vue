<script lang="ts" setup>
// Declare Options
const visible = defineModel<boolean>({
  default: false,
});

// Variables
const types = [
  'Камера',
  'Видеорегистратор',
];

const selectType = ref();

</script>

<template>
  <div>
    <Button
      class="text-capitalize"
      icon="pi pi-plus"
      label="Добавить устройство"
      @click="visible = true"
    />

    <Dialog
      v-model:visible="visible"
      dismissable-mask
      header="Добавить новое устройство видеонаблюдения"
      modal
      :style="{ 'max-width': '800px', width: '100%', margin: '0 20px' }"
    >
      <SharedUILabel
        class="tw-mb-3"
        required
        title="Тип Устройства"
      >
        <Select
          v-model="selectType"
          class="tw-w-full"
          :options="types"
          required
        />
      </SharedUILabel>
      <DialogsVideoCreateDialog
        v-model:type="selectType"
        :disabled="!selectType"
      />
    </Dialog>
  </div>
</template>