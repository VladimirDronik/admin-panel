<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// import { useDisplay } from 'vuetify';
// Static data modules
import { colors } from '~/staticData/rooms';
import { getRoomColorByValue } from '~/helpers/rooms';

// const { width } = useDisplay();
const { t } = useI18n();

const storeRoom = useRoomsStore();
const storeDevices = useDevicesStore();

const form = defineModel<any>('form', {
  required: false,
});

const isUpdate = defineModel<boolean>('isUpdate', {
  required: false,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

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
  isOpen.value = false;
  loadingDelete.value = false;
};

const changeDevice = () => {
  loading.value = true;
  storeRoom.changeRoomApi();
  loading.value = false;
};

</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen">
    <div v-if="form" class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-2xl tw-font-semibold">
          {{ form.is_group ? 'Добавить категорию' : "Добавить помещение" }}
        </h3>
        <Button text @click="isOpen = false" icon="pi" rounded size="small" variant="text">
          <XIcon class="white" />
        </Button>
      </div>

      <div class="!tw-px-0 !tw-pt-1">
        <SharedUILabel :title="'Наименование'" required class="tw-mb-2">
          <InputText v-model="form.name" class="tw-w-full" />
        </SharedUILabel>
        <SharedUILabel :title="'Цвет категории'" required class="tw-mb-2">
          <Select
            v-model="form.style"
            :options="colors"
            optionLabel="name"
            optionValue="code"
            class="tw-w-full"
          >
            <template #value="slotProps">
              <div class="tw-flex tw-items-center">
                <div :style="{ backgroundColor: getRoomColorByValue(slotProps.value)?.color }" class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full" />
                <div>{{ getRoomColorByValue(slotProps.value)?.name }}</div>
              </div>
            </template>
            <template #option="slotProps">
              <div class="tw-flex tw-items-center">
                <div :style="{ backgroundColor: slotProps.option.color }" class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full" />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Select>
        </SharedUILabel>
      </div>
      <div class="tw-flex tw-justify-end tw-pt-2">
        <DialogsDeleteDialog
          @delete="confirmDelete"
          v-model="dialog"
          :loading="loadingDelete"
          :title="`Вы уверены, что хотите удалить «${form.name}»?`"
          class="tw-mr-2"
          :id="form.item?.id ?? -1"
        />

        <Button
          :loading="loading"
          @click="changeDevice"
        >
          {{ t('save') }}
        </Button>
      </div>
    </div>
  </LayoutFullRightbar>
</template>

<style>

</style>
