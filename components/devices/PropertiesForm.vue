<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { Devices } from '@/types/DevicesTypes';

// Composables
const { t } = useI18n();
const {
  emptyRules,
} = useValidation();

const storeRooms = useRoomsStore();

const deviceObject = defineModel<Devices | null | undefined>({
  required: true,
});

defineProps({
  loadingModal: {
    type: Boolean,
    default: false,
  },
  disableRoomSelect: {
    type: Boolean,
    default: false,
  },
});

</script>

<template>
  <div>
    <div v-if="deviceObject">
      <SharedUILabel v-if="!disableRoomSelect" :title="t('devices.room')" required>
        <Select
          v-model="deviceObject.zone_id"
          :rules="emptyRules"
          :options="storeRooms.getRoomsSelect"
          optionLabel="name"
          optionValue="code"
          class="tw-mb-3 tw-w-full"
          required
        />
      </SharedUILabel>
      <div v-for="item in deviceObject?.props" :key="item.code">
        <div v-if="item.visible.value">
          <SharedUILabel
            v-if="item.type === 'bool'"
            :title="item.name"
            :required="item.required.value"
          >
            <SharedUISwitchField v-model="item.value" :disabled="!item.editable.value" />
          </SharedUILabel>
          <SharedUILabel
            v-else-if="item.type === 'enum'"
            :title="item.name"
            :required="item.required.value"
          >
            <Select
              v-model="item.value"
              :options="Object.keys(item.values)"
              :disabled="!item.editable.value"
              :rules="item.required ? emptyRules : undefined"
              class="tw-mb-3 tw-w-full"
              required
            />
          </SharedUILabel>
          <SharedUILabel
            v-else
            :title="item.name"
            :required="item.required.value"
          >
            <InputText
              v-model="item.value"
              :disabled="!item.editable.value"
              :rules="!item.required ? emptyRules : undefined"
              class="tw-mb-3 tw-w-full"
              required
            />
          </SharedUILabel>
        </div>
      </div>
      <div v-if="deviceObject?.category === 'sensor'">
        <div v-for="port in deviceObject?.children" :key="port.id">
          <p class="text-primary tw-mb-2 tw-pt-3 tw-text-2xl tw-font-semibold">
            {{port.name}}
          </p>
          <div class="tw-mb-1" v-for="item in port.props" :key="item.code">
            <div v-if="item.visible.value">
              <SharedUILabel
                v-if="item.type === 'bool'"
                :title="item.name"
                :required="item.required.value"
              >
                <SharedUISwitchField v-model="item.value" :disabled="!item.editable.value" />
              </SharedUILabel>
              <SharedUILabel
                v-else-if="item.type === 'enum'"
                :title="item.name"
                :required="item.required.value"
              >
                <Select
                  v-model="item.value"
                  :disabled="!item.editable.value"
                  :options="Object.keys(item.values)"
                  :rules="!item.required ? emptyRules : undefined"
                  class="tw-mb-3 tw-w-full"
                  required
                />
              </SharedUILabel>
              <SharedUILabel
                v-else
                :title="item.name"
                :required="item.required.value"
              >
                <InputText
                  v-model="item.value"
                  :disabled="!item.editable.value"
                  :type="item.type === 'int' || item.type === 'float' ? 'number' : 'text'"
                  :rules="!item.required ? emptyRules : undefined"
                  class="tw-mb-3 tw-w-full"
                  required
                />
              </SharedUILabel>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p v-if="!loadingModal" class="tw-text-center tw-text-xl">
        {{ t('devices.preloadTitle') }}
      </p>
      <div v-else class="tw-flex tw-justify-center">
        <ProgressSpinner strokeWidth="3" style="width: 30px; height: 30px" fill="#19B58F" />
      </div>
    </div>
  </div>
</template>
