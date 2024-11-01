<script setup lang="ts">
import { useI18n } from 'vue-i18n';
// Static data modules
import { colors } from '~/staticData/rooms';

const { t } = useI18n();

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
    <Button @click="dialog = true">
      Добавить Помещение
    </Button>
    <Dialog
      v-model:visible="dialog"
      :header="'Добавить Помещение'"
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissableMask
    >

      <div class="tw-mb-5">
        <SharedUILabel :title="'Название'" required class="tw-mb-2">
          <InputText class="tw-w-full" />
        </SharedUILabel>
        <SharedUILabel :title="'Цвет Категории'" required>
          <Select
            :options="colors"
            class="tw-w-full"
          >
            <template #option="slotProps">
              <div class="tw-flex tw-items-center">
                <div :style="{ backgroundColor: slotProps.option.color }" class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full" />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Select>
        </SharedUILabel>
      </div>

      <div class="tw-flex">
        <Button class="tw-mr-2" @click="createRoom">
          {{ t('save') }}
        </Button>
        <Button variant="outlined" @click="dialog = false" outlined>
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>
