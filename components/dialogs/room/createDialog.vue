<script setup lang="ts">
import { useI18n } from 'vue-i18n';
// Static data modules
import { colors } from '~/staticData/rooms';
import { getRoomColorByValue } from '~/helpers/rooms';

const { t } = useI18n();

const dialog = defineModel({
  default: false,
});

// Methods
const createRoom = async () => {
};

const form = ref({
  name: '',
  color: '',
});
</script>

<template>
  <div>
    <Button
      icon="pi pi-plus"
      label="Добавить Помещение"
      @click="dialog = true"
    />
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
          <InputText v-model="form.name" class="tw-w-full" />
        </SharedUILabel>
        <SharedUILabel :title="'Цвет Категории'" required>
          <SharedUIColorSelect v-model="form.color" />
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
