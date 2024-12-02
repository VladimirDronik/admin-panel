<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Static data modules
import { colors } from '~/staticData/rooms';
// Helpers modules
import { getRoomColorByValue } from '~/helpers/rooms';
// Types modules
import { type RoomBtnsData } from '~/types/DisplayTypes';

const { t } = useI18n();

const form = defineModel<RoomBtnsData>('form', {
  required: false,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

defineProps({
  edit: {
    type: Boolean,
    required: true,
  },
});

const dialog = ref(false);

const loading = ref(false);
const loadingDelete = ref(false);
</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen">
    <div v-if="form" class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-2xl tw-font-semibold">
          {{ !edit ? 'Добавить Кнопку' : "Редактировать кнопку" }}
        </h3>
        <Button text @click="isOpen = false" icon="pi" rounded size="small" variant="text">
          <XIcon class="white" />
        </Button>
      </div>

      <div class="!tw-px-0 !tw-pt-1">
        <SharedUILabel :title="'Название'" required class="tw-mb-2">
          <InputText v-model="form.title" class="tw-w-full" />
        </SharedUILabel>
        <SharedUILabel :title="'Тип'" required class="tw-mb-2">
          <InputText v-model="form.type" class="tw-w-full" />
        </SharedUILabel>
        <SharedUILabel :title="'Цвет'" required class="tw-mb-2">
          <Select
            v-model="form.color"
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
        <SharedUILabel :title="'Помещение'" required class="tw-mb-2">
          <Select
            v-model="form.scene"
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
          v-model="dialog"
          :loading="loadingDelete"
          :title="`Вы уверены, что хотите удалить «${form.name}»?`"
          class="tw-mr-2"
          :id="form.item?.id ?? -1"
        />

        <Button
          :loading="loading"
        >
          {{ t('save') }}
        </Button>
      </div>
    </div>
  </LayoutFullRightbar>
</template>

<style>

</style>
