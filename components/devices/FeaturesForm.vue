<script setup lang="ts">

const storeDevice = useDevicesStore();

const dialog = ref(false);
const edit = ref(false);

const form = ref({
  props: [],
});

const createEvents = (event: any) => {
  form.value = event;
  dialog.value = true;
  edit.value = true;
};

const editEvents = (event: any) => {
  form.value = event;
  dialog.value = true;
  edit.value = false;
};
</script>

<template>
  <div v-if="storeDevice.item">
    <div v-for="event in storeDevice.item.events" :key="event.code" class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-px-4 tw-py-2">
      <div class="tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-lg tw-font-semibold">
          OFF
        </p>
        <div class="tw-flex tw-items-center tw-justify-end">
          <v-btn
            @click="editEvents(event)"
            class="tw-mr-2"
            variant="text"
            size="small"
            prepend-icon="mdi-cog"
          >
            Настройка
          </v-btn>
          <v-switch hide-details color="primary" />
        </div>
      </div>
      <p class="tw-mb-2">
        {{ event.name }}
      </p>
      <p>
        <span class="text-primary tw-mr-2">
          Метод 0
        </span>
        <span class="text-warning tw-mr-2">
          Пауза 0
        </span>
        <span class="text-info tw-mr-2">
          Скрипт 0
        </span>
        <span class="text-error">
          Уведомление 0
        </span>
      </p>
    </div>
    <div class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-p-4">
      <div class="tw-mb-14 tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-lg tw-font-semibold">
          Toggle
        </p>
        <div class="tw-flex tw-items-center tw-justify-end">
          <v-btn
            @click="createEvents(event)"
            color="primary"
            size="small"
            prepend-icon="mdi-plus"
          >
            Добавить
          </v-btn>
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

    <DialogsDeviceFeatures
      v-model="dialog"
      v-model:form="form"
      :edit="edit"
    />
  </div>
</template>
