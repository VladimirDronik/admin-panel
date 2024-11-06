<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const storeDevices = useDevicesStore();

const dialog = defineModel({
  default: false,
});

const object = defineModel<any>('object', {
  default: false,
});

const loading = ref(false);
const deleteDialog = ref(false);

const selectedScript = ref();

const createEvent = () => {
  loading.value = true;
  console.log({
    args: selectedScript.value,
    enabled: true,
    name: '',
    target_id: object.value.id,
    target_type: 'script',
    type: 'script',
    sort: 0,
    qos: 0,
  });
  storeDevices.createEventApi({
    args: selectedScript.value,
    enabled: true,
    name: '',
    target_id: object.value.id,
    target_type: 'script',
    type: 'script',
    sort: 0,
    qos: 0,
  });
  loading.value = false;
};

const created = async () => {
  loading.value = true;
  await storeDevices.getScriptsApi();
  loading.value = false;
};

const deleteScript = (script: any) => {
  selectedScript.value = script;
  deleteDialog.value = true;
};

created();
</script>

<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      :header="'Выбор скрипта'"
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissableMask
    >
      <p class="tw-mb-3">
        Позволяет выбрать скрипт для выполнения
      </p>

      <div class="tw-min-h-60 tw-rounded tw-border tw-p-3">
        <div v-for="script in storeDevices.scripts" :key="script.id" class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
          <button type="button" class="tw-text-left" @click="selectedScript = script">
            <p :class="{ 'tw-text-green-500': selectedScript?.id === script.id }" class="tw-text-lg tw-font-semibold">
              {{ script.name }}
            </p>
            <p :class="{ 'tw-text-green-500': selectedScript?.id === script.id }">
              {{ script.description }}
            </p>
          </button>
          <div>
            <Button icon="pi pi-pencil" severity="info" rounded aria-label="Search" class="tw-mr-2" />
            <Button @click="deleteScript(script)" icon="pi pi-trash" severity="danger" rounded aria-label="Cancel" />
          </div>
        </div>
      </div>

      <div class="tw-pt-4">
        <Button
          @click="createEvent"
          :disabled="!selectedScript"
          :loading="loading"
          class="tw-mr-2"
        >
          {{ t('save') }}
        </Button>
        <Button
          variant="outlined"
          @click="dialog = false"
          outlined
        >
          {{ t('cancel') }}
        </Button>
      </div>

      <DialogsDeleteDialog
        :id="selectedScript?.id"
        :showBtn="false"
        v-model="deleteDialog"
      />
    </Dialog>
  </div>
</template>
