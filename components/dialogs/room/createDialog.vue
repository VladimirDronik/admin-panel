<script setup lang="ts">

const dialog = defineModel({
  default: false,
});

const loading = ref(false);

// Methods
const createRoom = async () => {
  loading.value = true;
  // await storeDevices.createDeviceApi(form.value);
  loading.value = false;
};
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1200">
      <template v-slot:button>
        <v-btn color="primary" class="text-capitalize" @click="dialog = true">
          Добавить Помещение
        </v-btn>
      </template>
      <p class="tw-mb-4 tw-text-2xl tw-font-semibold">
        Добавить Помещение
      </p>

      <div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
            Название
          </p>
          <v-text-field />
        </div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
            Цвет Категории
          </p>
          <v-select />
        </div>
      </div>

      <div class="tw-flex">
        <v-btn color="primary" class="tw-mr-2" @click="createRoom">
          Создать
        </v-btn>
        <v-btn color="primary" variant="outlined" @click="dialog = false">
          Отмена
        </v-btn>
      </div>
    </BaseDialog>
  </div>
</template>
