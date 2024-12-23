<script setup lang="ts">
import { useI18n } from 'vue-i18n';
// Static data modules
import { colors } from '~/staticData/rooms';
import { getRoomColorByValue } from '~/helpers/rooms';

const { t } = useI18n();

const dialog = defineModel<boolean>({
  default: false,
});

// Methods
const createRoom = async () => {
};

const form = ref({
  name: '',
  color: null,
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
      dismissable-mask
      :header="'Добавить Помещение'"
      modal
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <div class="tw-mb-5">
        <SharedUILabel
          class="tw-mb-2"
          required
          :title="'Название'"
        >
          <InputText
            v-model="form.name"
            class="tw-w-full"
          />
        </SharedUILabel>
        <SharedUILabel
          required
          :title="'Цвет Категории'"
        >
          <SharedUIColorSelect v-model="form.color" />
        </SharedUILabel>
      </div>

      <div class="tw-flex">
        <Button
          class="tw-mr-2"
          @click="createRoom"
        >
          {{ t('save') }}
        </Button>
        <Button
          outlined
          variant="outlined"
          @click="dialog = false"
        >
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>
