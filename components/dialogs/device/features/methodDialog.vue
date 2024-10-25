<script lang="ts" setup>

const storeDevices = useDevicesStore();

const dialog = defineModel({
  default: false,
});
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1000">
      <div class="tw-mb-1 tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-2xl tw-font-semibold">
          Выбор метода обьекта
        </p>
        <v-btn @click="dialog = false" icon size="small" variant="text">
          <XIcon class="white" />
        </v-btn>
      </div>
      <p class="tw-mb-7">
        Позволяет выбрать метод любого обьекта в системе
      </p>

      <div class="tw-flex">
        <div v-if="storeDevices.item" class="tw-mr-2 tw-w-6/12 tw-rounded tw-border tw-p-3">
          <div v-for="method in storeDevices.item.methods" :key="method.name">
            <p class="tw-text-lg tw-font-semibold">
              {{ method.name }}
            </p>
            <p>
              {{ method.description }}
            </p>
          </div>
        </div>
        <div class="tw-w-6/12">
          <div class="tw-mb-2 tw-rounded tw-border tw-p-3">
            Список с возможными методами
          </div>
          <div class="tw-rounded tw-border tw-p-3">
            Выбор параметра метода
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
