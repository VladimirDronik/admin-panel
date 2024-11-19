<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import { useToast } from 'primevue/usetoast';
import type { Devices } from '~/types/DevicesTypes';

const toast = useToast();

const { width } = useDisplay();

const storeDevices = useDevicesStore();
const { t } = useI18n();

const dialog = ref(false);

const name = ref('');

const loading = ref(false);
const loadingDelete = ref(false);

const isUpdate = defineModel<boolean>('isUpdate', {
  required: true,
});

const isActiveRightSidebar = defineModel<boolean>('isOpen', {
  required: true,
});

const form = defineModel<Devices | undefined>('form', {
  required: true,
});

const checkStatusText = (item: string | undefined) => {
  if (!item) return 'Неоп';
  if (item === 'ON') return 'Вкл';
  if (item === 'OFF') return 'Выкл';
  return 'Неоп';
};

const checkStatusColor = (item: string | undefined, background: boolean = false, light: boolean = false) => {
  if (background) {
    if (item === 'ON') return 'bg-success';
    if (item === 'OFF') return 'bg-error';
    return 'bg-warning';
  }
  if (light) {
    if (item === 'ON') return 'bg-lightsuccess';
    if (item === 'OFF') return 'bg-lighterror';
    return 'bg-lightwarning';
  }
  if (item === 'ON') return 'success';
  if (item === 'OFF') return 'error';
  return 'warning';
};

const confirmDelete = async () => {
  loadingDelete.value = true;
  try {
    if (storeDevices.item?.id) await storeDevices.deleteDeviceApi(storeDevices.item?.id);
    await storeDevices.getDevicesApi({
      limit: 10000,
      offset: 0,
    });
    toast.add({
      severity: 'success',
      summary: 'Устройство удалено',
      life: 5000,
    });
    dialog.value = false;
    isActiveRightSidebar.value = false;
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка удаления устройства',
      life: 5000,
    });
  }
  loadingDelete.value = false;
};

const changeDevice = async () => {
  loading.value = true;
  try {
    if (form.value) {
      await storeDevices.changeDeviceApi({
        ...form.value,
        name: name.value,
      });
    }
    toast.add({
      severity: 'success',
      summary: 'Устройство обновленно',
      life: 5000,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка обновления устройства',
      life: 5000,
    });
  }
  loading.value = false;
};

const updateName = () => {
  if (form.value) name.value = form.value?.name;
};

watch(() => form.value?.name, updateName);

</script>

<template>
  <v-navigation-drawer
    v-model="isActiveRightSidebar"
    location="right"
    elevation="10"
    :width="width / 3"
    app
  >
    <BaseLoader :isUpdate="isUpdate">
      <div elevation="0" class="tw-min-h-80 tw-p-7">
        <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">

          <Inplace v-if="form" class="tw-w-full" @open="updateName">
            <template #display>
              <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
                {{ form?.name }}
              </h3>
            </template>
            <template #content="{ closeCallback }">
              <span class=" tw-flex tw-w-full tw-items-center tw-gap-2">
                <InputText
                  v-model="name"
                  autofocus
                  class="tw-min-w-60"
                />
                <Button icon="pi pi-times" text severity="danger" @click="closeCallback" />
                <Button icon="pi pi-save" text severity="success" @click="changeDevice" />
              </span>
            </template>
          </Inplace>
          <Button
            @click="isActiveRightSidebar = false"
            icon="pi pi-times"
            size="small"
            rounded
            text
          />
        </div>
        <v-chip
          class="!tw-rounded-lg !tw-px-2 !tw-py-1"
          label
          variant="outlined"
          :color="checkStatusColor(form?.status)"
          :class="checkStatusColor(form?.status, false, true)"
        >

          <div class="tw-flex tw-items-center">
            <div
              class="tw-mr-3 tw-h-2.5 tw-w-2.5 tw-rounded-full"
              :class="checkStatusColor(form?.status, true, false)"
            />
            <p class="tw-text-black">
              {{ checkStatusText(form?.status) }}
            </p>
          </div>
        </v-chip>

        <div class="!tw-px-0 !tw-pt-1">

          <Tabs value="features">
            <TabList>
              <Tab value="features">
                <p class="tw-font-normal">
                  {{ t('devices.features') }}
                </p>
              </Tab>
              <Tab value="events">
                <p class="tw-font-normal">
                  {{ t('devices.events') }}
                </p>
              </Tab>
              <Tab value="ports" v-if="form?.category === 'controller'">
                <p class="tw-font-normal">
                  Порты
                </p>
              </Tab>
              <Tab value="four">
                <p class="tw-font-normal">
                  {{ t('devices.management') }}
                </p>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="features">

                <DevicesPropertiesForm v-model="form" />

                <div class="tw-flex tw-justify-end">
                  <DialogsDeleteDialog
                    @delete="confirmDelete"
                    v-model="dialog"
                    :id="form?.id ?? -1"
                    :loading="loadingDelete"
                    :subtitle="`Вы уверены, что хотите удалить «${form?.name}»`"
                    class="tw-mr-2"
                    title="Удалить категорию"
                  />

                  <Button
                    :disabled="false"
                    :loading="loading"
                    class="tw-mr-2"
                    @click="changeDevice"
                    :label="t('save')"
                  />
                </div>
              </TabPanel>
              <TabPanel value="events">
                <div v-if="form">
                  <DevicesEventsForm v-model="form" />
                </div>
              </TabPanel>
              <TabPanel value="ports">
                <div v-if="form">
                  <DevicesPortsForm v-model="form" />
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </div>
      </div>
    </BaseLoader>
  </v-navigation-drawer>
</template>

<style>

</style>
