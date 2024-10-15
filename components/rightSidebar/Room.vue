<script lang="ts" setup>
// Builtin modules
import { useDisplay } from 'vuetify';

const { width } = useDisplay();

const storeRoom = useRoomsStore();
const storeDevices = useDevicesStore();

const form = defineModel<any>('form', {
  required: false,
});

const isUpdate = defineModel<boolean>('isUpdate', {
  required: false,
});

const isActiveRightSidebar = defineModel<boolean>('isShow', {
  required: true,
});

const colors = [
  {
    title: 'Красный',
    props: {
      value: 'red',
    },
  },
  {
    title: 'Синий',
    props: {
      value: 'blue',
    },
  },
  {
    title: 'Желтый',
    props: {
      value: 'yellow',
    },
  },
  {
    title: 'Зеленый',
    props: {
      value: 'green',
    },
  },
];

const dialog = ref(false);

const loading = ref(false);
const loadingDelete = ref(false);

const confirmDelete = async () => {
  loadingDelete.value = true;
  if (storeDevices.item?.id) await storeDevices.deleteDeviceApi(storeDevices.item?.id);
  await storeDevices.getDevicesApi({
    limit: 10000,
    offset: 0,
  });
  dialog.value = false;
  isActiveRightSidebar.value = false;
  loadingDelete.value = false;
};

const changeDevice = () => {
  loading.value = true;
  storeRoom.changeRoomApi();
  loading.value = false;
};

</script>

<template>
  <v-navigation-drawer
    v-model="isActiveRightSidebar"
    location="right"
    app
    elevation="10"
    :width="width / 3"
  >
    <BaseLoader :isUpdate="isUpdate">
      <v-card v-if="form" elevation="0" class="tw-min-h-80 tw-p-7">
        <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
          <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
            {{ form.is_group ? 'Добавить категорию' : "Добавить помещение" }}
          </h3>
          <v-btn @click="isActiveRightSidebar = false" icon size="small" variant="text">
            <XIcon class="white" />
          </v-btn>
        </div>

        <v-card-text class="!tw-px-0 !tw-pt-1">
          <div>
            <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
              Наименование <span class="text-primary">*</span>
            </p>
            <v-text-field v-model="form.name" />
          </div>
          <div>
            <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
              Цвет категории <span class="text-primary">*</span>
            </p>
            <v-select v-model="form.style" :items="colors" />
          </div>
        </v-card-text>
        <div class="tw-flex tw-justify-end">
          <DialogsDeleteDialog
            @delete="confirmDelete"
            v-model="dialog"
            :loading="loadingDelete"
            :title="form.is_group ? 'Удалить категорию' : 'Удалить помещение'"
            :subtitle="`Вы уверены, что хотите удалить «${form.name}»`"
            class="tw-mr-2"
            :id="form.item?.id ?? -1"
          />

          <v-btn
            color="success"
            variant="flat"
            class="tw-mr-2"
            :loading="loading"
            @click="changeDevice"
          >
            Сохранить
          </v-btn>
        </div>
      </v-card>
    </BaseLoader>
  </v-navigation-drawer>
</template>

<style>

</style>
