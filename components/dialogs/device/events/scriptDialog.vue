<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const storeDevices = useDevicesStore();

const dialog = defineModel({
  default: false,
});

const loading = ref(false);
const deleteDialog = ref(false);

const selectedScript = ref(0);

const created = async () => {
  loading.value = true;
  await storeDevices.getScriptsApi();
  loading.value = false;
};

const deleteScript = (id: number) => {
  selectedScript.value = id;
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
          <button type="button" class="tw-text-left" @click="selectedScript = script.id">
            <p :class="{ 'tw-text-green-500': selectedScript === script.id }" class="tw-text-lg tw-font-semibold">
              {{ script.name }}
            </p>
            <p :class="{ 'tw-text-green-500': selectedScript === script.id }">
              {{ script.description }}
            </p>
          </button>
          <div>
            <Button icon="pi pi-pencil" severity="info" rounded aria-label="Search" class="tw-mr-2" />
            <Button @click="deleteScript(script.id)" icon="pi pi-trash" severity="danger" rounded aria-label="Cancel" />
          </div>
        </div>
      </div>

      <div class="tw-pt-4">
        <Button class="tw-mr-2" :disabled="!selectedScript">
          {{ t('save') }}
        </Button>
        <Button variant="outlined" @click="dialog = false" outlined>
          {{ t('cancel') }}
        </Button>
      </div>

      <DialogsDeleteDialog :id="selectedScript" :showBtn="false" v-model="deleteDialog" />
    </Dialog>
  </div>
</template>
