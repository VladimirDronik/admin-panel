<script lang="ts" setup>
// Builtin modules
import { useDisplay } from 'vuetify';

const { width } = useDisplay();

const storeUser = useAuthStore();
const storeDevices = useDevicesStore();

const isUpdate = defineModel<boolean>('isUpdate', {
  required: true,
});

const tab = ref(true);

const checkStatusText = (item: string | undefined) => {
  if (!item) return;
  if (item === 'ON') return 'Вкл';
  if (item === 'OFF') return 'Выкл';
  return 'Неоп';
};

const checkStatusColor = (item: string | undefined, background: boolean = false, light: boolean = false) => {
  if (!item) return;

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

</script>

<template>
  <v-navigation-drawer
    v-model="storeUser.isActiveRightSidebar"
    location="right"
    app
    elevation="10"
    :width="width / 3"
  >
    <BaseLoader :isUpdate="isUpdate">
      <v-card elevation="0" class="tw-min-h-80 tw-p-7">
        <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
          <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
            {{ storeDevices.item?.name }}
          </h3>
          <v-btn @click="storeUser.isActiveRightSidebar = false" icon size="small" variant="text">
            <XIcon class="white" />
          </v-btn>
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

          <v-tabs
            v-model="tab"
            color="primary"
          >
            <v-tab value="one">Свойства</v-tab>
            <v-tab value="two" v-if="storeDevices.item?.category === 'controller'">События</v-tab>
            <v-tab value="ports" v-if="storeDevices.item?.category === 'controller'">Порты</v-tab>
            <v-tab value="four" v-if="storeDevices.item?.category === 'controller'">Статистика</v-tab>
          </v-tabs>
          <v-tabs-window v-model="tab">
            <div class="tw-pt-4">
              <v-tabs-window-item value="one">
                <div v-for="item in storeDevices.item?.props" :key="item.code">
                  <div v-if="item.data_type === 'bool'">
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }}
                    </p>
                    <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-rounded tw-border tw-border-black tw-px-4">
                      <p class="tw-py-3 tw-text-base">
                        {{ item.value ? 'Включено' : 'Выключено'}}
                      </p>
                      <!-- <ToggleSwitch v-model="item.value" /> -->
                      <v-switch v-model="item.value" color="primary" hide-details />
                    </div>
                  </div>
                  <div v-else-if="item.data_type === 'enum'">
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }}
                    </p>
                    <v-select v-model="item.value" :items="Object.keys(item.values)" />
                  </div>
                  <div v-else>
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }}
                    </p>
                    <v-text-field v-model="item.value" />
                  </div>
                </div>
                <div v-if="storeDevices.item?.category === 'sensor'">
                  <div class="tw-mb-4" v-for="port in storeDevices.item?.children" :key="port.id">
                    <p class="text-primary tw-mb-2 tw-pt-3 tw-text-2xl tw-font-semibold">
                      {{port.name}}
                    </p>
                    <div class="tw-mb-1" v-for="item in port.props" :key="item.code">
                      <div v-if="item.data_type === 'bool'">
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }}
                        </p>
                        <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-rounded tw-border tw-border-black tw-px-4">
                          <p class="tw-py-3 tw-text-base">
                            {{ item.value ? 'Включено' : 'Выключено'}}
                          </p>
                          <!-- <ToggleSwitch v-model="item.value" /> -->
                          <v-switch v-model="item.value" color="primary" hide-details />
                        </div>
                      </div>
                      <div v-else-if="item.data_type === 'enum'">
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }}
                        </p>
                        <v-select v-model="item.value" :items="Object.keys(item.values)" />
                      </div>
                      <div v-else>
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }}
                        </p>
                        <v-text-field v-model="item.value" :type="item.data_type === 'int' || item.data_type === 'float' ? 'number' : 'text'" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tw-flex tw-justify-end">
                  <!-- <v-btn color="error" variant="flat" class="tw-mr-2">
                    Удалить
                  </v-btn> -->
                  <DialogsDeleteDialog class="tw-mr-2" />
                  <v-btn color="success" variant="flat" class="tw-mr-2">
                    Сохранить
                  </v-btn>
                </div>
              </v-tabs-window-item>

              <!-- <v-tabs-window-item value="two">
                <div>
                  <p class="tw-text-lg tw-font-semibold">
                    Изменение статуса объекта
                  </p>
                  <v-checkbox label="вызов метода объекта 2" />
                </div>
                <div>
                  <p class="tw-text-lg tw-font-semibold">
                    Изменение конфига устройства
                  </p>
                  <v-checkbox label="вызов метода объекта 2" />
                </div>
                <div>
                  <p class="tw-text-lg tw-font-semibold">
                    Загрузка устройства после включения
                  </p>
                  <v-checkbox label="вызов метода объекта 2" />
                </div>
              </v-tabs-window-item> -->
            </div>
          </v-tabs-window>

        </v-card-text>
      </v-card>
    </BaseLoader>
  </v-navigation-drawer>
</template>

<style>

</style>
