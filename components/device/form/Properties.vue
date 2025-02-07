<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { Devices } from '@/types/DevicesTypes';

// Composables
const { t } = useI18n();

const storeRooms = useRoomsStore();

const deviceObject = defineModel<Devices | undefined>({
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
      <SharedUILabel
        v-if="!disableRoomSelect"
        required
        :title="t('devices.room')"
      >
        <Select
          v-model="deviceObject.zone_id"
          class="tw-mb-3 tw-w-full"
          option-label="name"
          option-value="code"
          :options="storeRooms.getRoomsSelect"
          required
        />
      </SharedUILabel>

      <div v-else>
        <div
          v-for="item in deviceObject.props"
          :key="item.code"
        >
          <div v-if="item.visible.value">
            <SharedUILabel
              v-if="item.type === 'bool'"
              :required="item.required.value"
              :title="item.name"
            >
              <SharedUISwitchField
                v-model="item.value"
                :disabled="!item.editable.value"
              />
            </SharedUILabel>
            <SharedUILabel
              v-else-if="item.type === 'enum'"
              :required="item.required.value"
              :title="item.name"
            >
              <Select
                v-model="item.value"
                class="tw-mb-3 tw-w-full"
                :disabled="!item.editable.value"
                :options="Object.keys(item.values)"
                required
              />
            </SharedUILabel>
            <SharedUILabel
              v-else
              :required="item.required.value"
              :title="item.name"
            >
              <InputText
                v-model="item.value"
                class="tw-mb-3 tw-w-full"
                :disabled="!item.editable.value"
                required
                :type="item.type === 'int' || item.type === 'float' ? 'number' : 'text'"
              />
            </SharedUILabel>
          </div>
        </div>
      </div>

      <div v-if="deviceObject?.category === 'sensor'">
        <div
          v-for="port in deviceObject?.children"
          :key="port.id"
        >
          <p class="text-primary tw-mb-2 tw-pt-3 tw-text-2xl tw-font-semibold">
            {{ port.name }}
          </p>
          <div
            v-for="item in port.props"
            :key="item.code"
            class="tw-mb-1"
          >
            <div v-if="item.visible.value">
              <SharedUILabel
                v-if="item.type === 'bool'"
                :required="item.required.value"
                :title="item.name"
              >
                <SharedUISwitchField
                  v-model="item.value"
                  :disabled="!item.editable.value"
                />
              </SharedUILabel>
              <SharedUILabel
                v-else-if="item.type === 'enum'"
                :required="item.required.value"
                :title="item.name"
              >
                <Select
                  v-model="item.value"
                  class="tw-mb-3 tw-w-full"
                  :disabled="!item.editable.value"
                  :options="Object.keys(item.values)"
                  required
                />
              </SharedUILabel>
              <SharedUILabel
                v-else
                :required="item.required.value"
                :title="item.name"
              >
                <InputText
                  v-model="item.value"
                  class="tw-mb-3 tw-w-full"
                  :disabled="!item.editable.value"
                  required
                  :type="item.type === 'int' || item.type === 'float' ? 'number' : 'text'"
                />
              </SharedUILabel>
            </div>
          </div>
        </div>
      </div>
      <slot name="footer" />
    </div>

    <div v-else>
      <p
        v-if="!loadingModal"
        class="tw-text-center tw-text-xl"
      >
        {{ t('devices.preloadTitle') }}
      </p>
      <div
        v-else
        class="tw-flex tw-justify-center"
      >
        <ProgressSpinner
          fill="#19B58F"
          stroke-width="3"
          style="width: 30px; height: 30px"
        />
      </div>
    </div>
  </div>
</template>
