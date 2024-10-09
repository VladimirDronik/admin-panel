<script lang="ts" setup>
// Builtin modules
import { useDisplay } from 'vuetify';

const { width } = useDisplay();

const storeUser = useAuthStore();
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
          <div v-if="form.is_group">
            <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
              Цвет категории <span class="text-primary">*</span>
            </p>
            <v-select v-model="form.style" />
          </div>
        </v-card-text>
        <div class="tw-flex tw-justify-end">
          <DialogsDeleteDialog
            :title="form.is_group ? 'Удалить категорию' : 'Удалить помещение'"
            :subtitle="`Вы уверены, что хотите удалить «${form.name}»`"
            class="tw-mr-2"
          />

          <v-btn color="success" variant="flat" class="tw-mr-2">
            Сохранить
          </v-btn>
        </div>
      </v-card>
    </BaseLoader>
  </v-navigation-drawer>
</template>

<style>

</style>
