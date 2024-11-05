<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

const { width } = useDisplay();

const storeDevices = useDevicesStore();
const { t } = useI18n();

const dialog = ref(false);

const loading = ref(false);
const loadingDelete = ref(false);

const isUpdate = defineModel<boolean>('isUpdate', {
  required: true,
});

const isActiveRightSidebar = defineModel<boolean>('isOpen', {
  required: true,
});

const tab = ref(true);

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
  storeDevices.changeDeviceApi();
  loading.value = false;
};

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
      <v-card elevation="0" class="tw-min-h-80 tw-p-7">
        <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
          <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
            {{ storeDevices.item?.name }}
          </h3>
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
          :color="checkStatusColor(storeDevices.item?.status)"
          :class="checkStatusColor(storeDevices.item?.status, false, true)"
        >

          <div class="tw-flex tw-items-center">
            <div
              class="tw-mr-3 tw-h-2.5 tw-w-2.5 tw-rounded-full"
              :class="checkStatusColor(storeDevices.item?.status, true, false)"
            />
            <p class="tw-text-black">
              {{ checkStatusText(storeDevices.item?.status) }}
            </p>
          </div>
        </v-chip>

        <v-card-text class="!tw-px-0 !tw-pt-1">

          <Tabs value="features">
            <TabList>
              <Tab value="features">{{ t('devices.features') }}</Tab>
              <Tab value="events">{{ t('devices.events') }}</Tab>
              <!-- <v-tab value="events" v-if="storeDevices.item?.category === 'controller'">{{ t('devices.events') }}</v-tab> -->
              <Tab value="ports">Порты</Tab>
              <Tab value="four">{{ t('devices.management') }}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="features">

                <DevicesPropertiesForm v-model="storeDevices.item" />

                <div class="tw-flex tw-justify-end">
                  <DialogsDeleteDialog
                    @delete="confirmDelete"
                    v-model="dialog"
                    :id="storeDevices.item?.id ?? -1"
                    :loading="loadingDelete"
                    :subtitle="`Вы уверены, что хотите удалить «${storeDevices.item?.name}»`"
                    class="tw-mr-2"
                    title="Удалить категорию"
                  />

                  <Button
                    :loading="loading"
                    class="tw-mr-2"
                    @click="changeDevice"
                  >
                    {{ t('save') }}
                  </Button>
                </div>
              </TabPanel>
              <TabPanel value="events">
                <div v-if="storeDevices.item">
                  <DevicesEventsForm v-model="storeDevices.item" />
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </v-card-text>
      </v-card>
    </BaseLoader>
  </v-navigation-drawer>
</template>

<style>

</style>
