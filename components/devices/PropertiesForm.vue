<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { Devices } from '@/types/DevicesTypes';

// Composables
const { t } = useI18n();

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

const fieldOrder = ['id', 'address', 'password', 'protocol'];

const sortedPropsForMegaD = computed(() => {
  if (deviceObject.value?.category === 'controller' && deviceObject.value?.type === 'mega_d' && deviceObject.value?.props) {
    return [...deviceObject.value.props].sort((a, b) => fieldOrder.indexOf(a.code) - fieldOrder.indexOf(b.code));
  }
  return [];
});

const getFieldSettingsForMegaD = (code: string) => {
  switch (code) {
    case 'id':
    case 'address':
      return { maxLength: 15, inputWidth: '18ch' };
    case 'password':
      return { maxLength: 6, inputWidth: '12ch' };
    case 'protocol':
      return { maxLength: 4, inputWidth: '12ch' };
    default:
      return { maxLength: 255, inputWidth: '100%' };
  }
};

const getFormattedOptions = (values: Record<string, any>) => Object.keys(values).map((option) => option.toUpperCase());
</script>

<template>
  <div>
    <div v-if="deviceObject">
      <SharedUILabel v-if="!disableRoomSelect" :title="t('devices.room')" required>
        <Select
          v-model="deviceObject.zone_id"
          :options="storeRooms.getRoomsSelect"
          optionLabel="name"
          optionValue="code"
          class="tw-mb-3 tw-w-full"
          required
        />
      </SharedUILabel>

      <!-- MegaDForm -->
      <div v-if="deviceObject?.category === 'controller' && deviceObject?.type === 'mega_d'">
        <div v-for="item in sortedPropsForMegaD" :key="item.code">
          {{ item }}
          <SharedUIField v-if="item.visible.value">
            <template #label>
              <SharedUILabel :title="item.name" :required="item.required.value" />
            </template>

            <template #input>
              <template v-if="item.code === 'protocol'">
                <Select
                  v-model="item.value"
                  :options="getFormattedOptions(item.values)"
                  :style="{
                    width: getFieldSettingsForMegaD(item.code).inputWidth,
                  }"
                  :disabled="!item.editable.value"
                  class="tw-w-full"
                  required
                />
              </template>
              <template v-else>
                <InputText
                  v-model="item.value"
                  :maxlength="getFieldSettingsForMegaD(item.code).maxLength"
                  :style="{
                    width: getFieldSettingsForMegaD(item.code).inputWidth,
                  }"
                  :disabled="!item.editable.value"
                  class="tw-w-full tw-rounded tw-border tw-border-gray-300 tw-px-3"
                  required
                  :type="item.type === 'int' || item.type === 'float' ? 'number' : 'text'"
                />
              </template>
            </template>
          </SharedUIField>
        </div>
      </div>

      <div v-else>
        <div v-for="item in deviceObject.props" :key="item.code">
          <div v-if="item.visible.value">
            <SharedUILabel v-if="item.type === 'bool'" :title="item.name" :required="item.required.value">
              <SharedUISwitchField v-model="item.value" :disabled="!item.editable.value" />
            </SharedUILabel>
            <SharedUILabel v-else-if="item.type === 'enum'" :title="item.name" :required="item.required.value">
              <Select v-model="item.value" :options="Object.keys(item.values)" :disabled="!item.editable.value" class="tw-mb-3 tw-w-full" required />
            </SharedUILabel>
            <SharedUILabel v-else :title="item.name" :required="item.required.value">
              <InputText
                v-model="item.value"
                :disabled="!item.editable.value"
                :type="item.type === 'int' || item.type === 'float' ? 'number' : 'text'"
                class="tw-mb-3 tw-w-full"
                required
              />
            </SharedUILabel>
          </div>
        </div>
      </div>

      <div v-if="deviceObject?.category === 'sensor'">
        <div v-for="port in deviceObject?.children" :key="port.id">
          <p class="text-primary tw-mb-2 tw-pt-3 tw-text-2xl tw-font-semibold">
            {{ port.name }}
          </p>
          <div class="tw-mb-1" v-for="item in port.props" :key="item.code">
            <div v-if="item.visible.value">
              <SharedUILabel v-if="item.type === 'bool'" :title="item.name" :required="item.required.value">
                <SharedUISwitchField v-model="item.value" :disabled="!item.editable.value" />
              </SharedUILabel>
              <SharedUILabel v-else-if="item.type === 'enum'" :title="item.name" :required="item.required.value">
                <Select
                  v-model="item.value"
                  :disabled="!item.editable.value"
                  :options="Object.keys(item.values)"
                  class="tw-mb-3 tw-w-full"
                  required
                />
              </SharedUILabel>
              <SharedUILabel v-else :title="item.name" :required="item.required.value">
                <InputText
                  v-model="item.value"
                  :disabled="!item.editable.value"
                  :type="item.type === 'int' || item.type === 'float' ? 'number' : 'text'"
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
