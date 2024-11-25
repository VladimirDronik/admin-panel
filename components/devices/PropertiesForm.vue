<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import type { Devices } from "@/types/DevicesTypes";
import { watch, ref } from "vue";

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

const sortedProps = ref([]);
watch(
  () => deviceObject.value?.props,
  (newProps) => {
    if (newProps) {
      const fieldOrder = ["id", "address", "password", "protocol"];
      sortedProps.value = [...newProps].sort(
        (a, b) => fieldOrder.indexOf(a.code) - fieldOrder.indexOf(b.code)
      );
    }
  },
  { immediate: true }
);

const getFieldSettings = (code: string) => {
  switch (code) {
    case "id":
    case "address":
      return { maxLength: 15, inputWidth: "18ch" };
    case "password":
      return { maxLength: 6, inputWidth: "12ch" };
    case "protocol":
      return { maxLength: 4, inputWidth: "12ch" };
    default:
      return { maxLength: 255, inputWidth: "100%" };
  }
};

const getFormattedOptions = (values: Record<string, any>) => {
  return Object.keys(values).map((option) => option.toUpperCase());
};
</script>

<template>
  <div>
    <div v-if="deviceObject">
      <SharedUILabel
        v-if="!disableRoomSelect"
        :title="t('devices.room')"
        required
      >
        <Select
          v-model="deviceObject.zone_id"
          :options="storeRooms.getRoomsSelect"
          optionLabel="name"
          optionValue="code"
          class="tw-mb-3 tw-w-full"
          required
        />
      </SharedUILabel>

      <div
        class="tw-flex tw-flex-col tw-gap-4 tw-w-full"
        v-for="item in sortedProps"
        :key="item.code"
      >
        <div
          class="tw-flex tw-items-center tw-w-full tw-mb-4"
          v-if="item.visible.value"
        >
          <!-- Лейбл -->
          <div class="tw-flex-1 tw-text-right tw-pr-4">
            <SharedUILabel
              :title="t(`devices.${item.code}`)"
              :required="item.required.value"
            />
          </div>

          <div class="tw-flex-1 tw-text-left">
            <template v-if="item.type === 'bool'">
              <SharedUISwitchField
                v-model="item.value"
                :disabled="!item.editable.value"
              />
            </template>
            <template v-else-if="item.type === 'enum'">
              <Select
                v-model="item.value"
                :options="getFormattedOptions(item.values)"
                :style="{ width: getFieldSettings(item.code).inputWidth }"
                :disabled="!item.editable.value"
                class="tw-w-full"
                required
              />
            </template>
            <template v-else>
              <InputText
                v-model="item.value"
                class="tw-w-full tw-border tw-border-gray-300 tw-rounded tw-px-3"
                required
                :disabled="!item.editable.value"
                :maxlength="getFieldSettings(item.code).maxLength"
                :style="{ width: getFieldSettings(item.code).inputWidth }"
                :type="
                  item.type === 'int' || item.type === 'float'
                    ? 'number'
                    : 'text'
                "
              />
            </template>
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
              <SharedUILabel
                v-if="item.type === 'bool'"
                :title="item.name"
                :required="item.required.value"
              >
                <SharedUISwitchField
                  v-model="item.value"
                  :disabled="!item.editable.value"
                />
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
                  :type="
                    item.type === 'int' || item.type === 'float'
                      ? 'number'
                      : 'text'
                  "
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
        {{ t("devices.preloadTitle") }}
      </p>
      <div v-else class="tw-flex tw-justify-center">
        <ProgressSpinner
          strokeWidth="3"
          style="width: 30px; height: 30px"
          fill="#19B58F"
        />
      </div>
    </div>
  </div>
</template>
