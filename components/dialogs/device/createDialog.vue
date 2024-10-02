<script setup lang="ts">
import _ from 'lodash';

const dialog = defineModel({
  default: false,
});

const storeDevices = useDevicesStore();

const categories = computed(() => _.uniq(_.map(storeDevices.types, 'category')));
const types = computed(() => _.uniq(_.map(_.filter(storeDevices.types, ['category', category.value]), 'type')));

const category = ref('controller');

</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1200">
      <template v-slot:button>
        <v-btn color="primary" class="text-capitalize" @click="dialog = true">
          Добавить устройство
        </v-btn>
      </template>
      <p class="tw-mb-4  tw-text-center tw-text-2xl">
        Добавление нового устройства
      </p>

      <div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Название
          </p>
          <v-text-field />
        </div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Категория
          </p>
          <v-select :items="categories" v-model="category" />
        </div>
        <div class="tw-mb-2">
          <p class="tw-mb-1.5 tw-text-lg">
            Тип
          </p>
          <v-select :items="types" />
        </div>
        <v-divider class="border-opacity-100 tw-mb-3 !tw-border-black" />
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Протокол
          </p>
          <v-text-field />
        </div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Адрес
          </p>
          <v-text-field />
        </div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Пароль
          </p>
          <v-text-field />
        </div>
        <div class="tw-flex tw-justify-end">
          <v-btn color="error" variant="text" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="success" class="tw-mr-2">
            Сохранить
          </v-btn>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>
