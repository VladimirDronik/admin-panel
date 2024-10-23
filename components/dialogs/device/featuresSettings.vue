<script lang="ts" setup>

const dialog = defineModel({
  default: false,
});
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1000">
      <div class="tw-mb-1 tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-2xl tw-font-semibold">
          Выключатель в гостиной
        </p>
        <v-btn @click="dialog = false" icon size="small" variant="text">
          <XIcon class="white" />
        </v-btn>
      </div>
      <p class="tw-mb-7">
        Событие при включении
      </p>

      <div class="tw-mb-6">
        <v-btn prepend-icon="mdi-plus" color="success" variant="outlined" class="tw-mr-4">
          Метод
        </v-btn>
        <v-btn prepend-icon="mdi-plus" color="warning" variant="outlined" class="tw-mr-4">
          Пауза
        </v-btn>
        <v-btn prepend-icon="mdi-plus" color="info" variant="outlined" class="tw-mr-4">
          Скрипт
        </v-btn>
        <v-btn prepend-icon="mdi-plus" color="error" variant="outlined">
          Уведомление
        </v-btn>
      </div>

      <div class="tw-rounded tw-border">
        <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-3">
          <div class="tw-mr-4 tw-flex tw-items-center tw-justify-between">
            <v-chip class="tw-mr-3" color="success" variant="flat">
              Метод On
            </v-chip>
            <p>
              Объект Lamp «люстра над столом»
            </p>
          </div>
          <div class="tw-flex tw-items-center">
            <v-btn class="tw-mr-2" icon variant="text" size="x-small">
              <TrashIcon class="handle-item tw-w-5" />
            </v-btn>
            <GripVerticalIcon class="handle-item tw-w-5" />
          </div>
        </div>
      </div>

      <div class="tw-pt-4">
        <v-btn class="tw-mr-4" color="primary">
          Сохранить
        </v-btn>
        <v-btn color="primary" variant="outlined">
          Отменить
        </v-btn>
      </div>
    </BaseDialog>
  </div>
</template>
