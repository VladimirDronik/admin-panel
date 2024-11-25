<script lang="ts" setup>

const visible = defineModel({
  default: false,
});

const types = [
  'Камера',
  'Видеорегистратор',
];

const selectType = ref();

</script>

<template>
  <div>
    <Button
      @click="visible = true"
      class="text-capitalize"
      icon="pi pi-plus"
      label="Добавить устройство"
    />

    <Dialog
      v-model:visible="visible"
      header="Добавить новое устройство видеонаблюдения"
      :style="{ 'max-width': '800px', width: '100%', margin: '0 20px' }"
      modal
      dismissableMask
    >
      <SharedUILabel class="tw-mb-3" title="Тип Устройства" required>
        <Select
          v-model="selectType"
          :options="types"
          class="tw-w-full"
          required
        />
      </SharedUILabel>
      <DialogsVideoCreateDialog :disabled="!selectType" v-model:type="selectType" />
    </Dialog>
  </div>
</template>

<style>

</style>
