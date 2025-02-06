<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type {
  DynamicFormData,
} from '~/components/devices/form.types';

const storeDevices = useDevicesStore();
const storeRooms = useRoomsStore();
const { t } = useI18n();
const sensorOptions = ref<{ label: string; value: number, zone_id: number }[]>([]);
const mainSensorChildrenOptions = ref<{ label: string; value: number }[]>([]);
const additionalSensorChildrenOptions = ref<{ label: string; value: number }[]>([]);
const props = defineProps<{
  isEditing: boolean;
}>();
const dynamicForm = defineModel<DynamicFormData>('dynamic-form', { required: true });
const emit = defineEmits(['update:valid']);
const fetchSensors = async () => {
  const params = {
    filter_by_category: 'sensor',
    offset: 0,
    children: 1,
    type_struct: 'full',
    with_methods: false,
  };
  const data = await storeDevices.getDevicesApi(params, false);
  // const sensors = data.response.list.flatMap((item: any) => item.children.filter((child: any) => child.category === 'sensor'));
  sensorOptions.value = data.response.list.map((sensor: any) => ({
    label: sensor.type,
    value: sensor.id,
    zone_id: sensor.zone_id,
  }));
};
const handleMainSensorSelection = async (event: { value: number }) => {
  const sensorId = event.value;
  const selectedSensor = sensorOptions.value.find((sensor) => sensor.value === sensorId);
  const endpoint = `${objectManager}/objects/${sensorId}`;
  if (selectedSensor) {
    dynamicForm.value.zone_id = selectedSensor.zone_id;
  }
  const data: any = await api(endpoint, {
    query: { without_children: false },
  });
  if (data?.response?.children) {
    mainSensorChildrenOptions.value = data.response.children.map((child: any) => ({
      label: child.name,
      value: child.id,
    }));
  } else {
    mainSensorChildrenOptions.value = [];
  }
};

const handleAdditionalSensorSelection = async (event: { value: number }) => {
  const sensorId = event.value;
  const endpoint = `${objectManager}/objects/${sensorId}`;
  const data: any = await api(endpoint, {
    query: { without_children: false },
  });
  if (data?.response?.children) {
    additionalSensorChildrenOptions.value = data.response.children.map((child: any) => ({
      label: child.name,
      value: child.id,
    }));
  } else {
    additionalSensorChildrenOptions.value = [];
  }
};
onMounted(fetchSensors);

const flatForm = computed(() => ({
  type: dynamicForm.value.props.type,
  sensor_value_ttl: dynamicForm.value.props.sensor_value_ttl,
  min_sp: dynamicForm.value.props.min_sp,
  target_sp: dynamicForm.value.props.target_sp,
  max_sp: dynamicForm.value.props.max_sp,
  below_tolerance: dynamicForm.value.props.below_tolerance,
  above_tolerance: dynamicForm.value.props.above_tolerance,
  complex_tolerance: dynamicForm.value.props.complex_tolerance,
}));
const schema = z.object({
  type: z.enum(['complex', 'pid', 'simple']),
  sensor_value_ttl: z.number().default(30),
  min_sp: z.number().default(0),
  target_sp: z.number().default(0),
  max_sp: z.number().default(0),
  below_tolerance: z.number().default(0),
  above_tolerance: z.number().default(0),
  complex_tolerance: z.number().default(0),
});
const resolver = ref(zodResolver(schema));
watch(
  () => dynamicForm.value,
  () => {
    const flatFormData = flatForm.value;
    const validationResult = schema.safeParse(flatFormData);
    const isValid = validationResult.success;
    emit('update:valid', isValid);
  },
  { deep: true },
);
const typeOptions = schema.shape.type.options;
</script>
<template>
  <div />
  <Form
    :form="dynamicForm"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
  >
    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      name="title"
      required
      :title="t('devices.title')"
    >
      <InputText
        v-model="dynamicForm.name"
        class="tw-w-3/4"
        required
      />
    </SharedUILabel>
    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      name="room"
      :title="t('devices.room')"
    >
      <Select
        v-model="dynamicForm.zone_id"
        class="tw-w-3/4"
        :disabled="true"
        option-label="name"
        option-value="code"
        :options="storeRooms.getRoomsSelect"
        :show-clear="true"
      />
    </SharedUILabel>
    <Divider
      v-if="props.isEditing"
      class="tw-mt-0 tw-pb-3"
    />
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.placement') }}
    </p>
    <SharedUILabel
      v-if="!props.isEditing"
      class="tw-mb-2"
      name=""
      required
      :title="t('devices.mainSensor')"
      :width="300"
    >
      <Select
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="sensorOptions"
        @change="handleMainSensorSelection"
      />
    </SharedUILabel>
    <SharedUILabel
      v-if="!props.isEditing"
      class="tw-mb-2"
      name=""
      required
      :title="t('devices.indicator')"
      :value="dynamicForm.parent_id"
      :width="300"
    >
      <Select
        v-model="dynamicForm.parent_id"
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="mainSensorChildrenOptions"
      />
    </SharedUILabel>
    <SharedUILabel
      class="tw-mb-2"
      name="sensor_value_ttl"
      required
      :title="t('devices.sensorTTL')"
      :value="dynamicForm.props.sensor_value_ttl"
      :width="300"
    >
      <InputNumber
        v-model="dynamicForm.props.sensor_value_ttl"
      />
    </SharedUILabel>
    <Divider class="tw-mt-0 tw-pb-3" />
    <SharedUILabel
      class="tw-mb-2"
      name=""
      :title="t('devices.additionalSensor')"
      :width="300"
    >
      <Select
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="sensorOptions"
        @change="handleAdditionalSensorSelection"
      />
    </SharedUILabel>
    <SharedUILabel
      class="tw-mb-2"
      name=""
      :title="t('devices.indicator')"
      :value="dynamicForm.props.fallback_sensor_value_id"
      :width="300"
    >
      <Select
        v-model="dynamicForm.props.fallback_sensor_value_id"
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="additionalSensorChildrenOptions"
      />
    </SharedUILabel>
    <Divider class="tw-mt-0 tw-pb-3" />
    <SharedUILabel
      required
      :title="t('devices.regulation')"
      :width="300"
    >
      <ToggleSwitch v-model="dynamicForm.props.enable" />
    </SharedUILabel>
    <SharedUILabel
      class="tw-mb-2"
      name="type"
      required
      :title="t('devices.regulatorType')"
      :value="dynamicForm.props.type"
      :width="300"
    >
      <Select
        v-model="dynamicForm.props.type"
        class="tw-w-3/4"
        :options="typeOptions"
      />
    </SharedUILabel>
    <Divider class="tw-mt-0 tw-pb-3" />
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.setpoint') }}
    </p>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[repeat(auto-fill,_150px)] tw-gap-1">
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name=""
        required
        :title="`${t('devices.minSP')}:`"
        :value="dynamicForm.props.min_sp"
      >
        <InputNumber v-model="dynamicForm.props.min_sp" />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name=""
        required
        :title="`${t('devices.targetSP')}:`"
        :value="dynamicForm.props.target_sp"
      >
        <InputNumber v-model="dynamicForm.props.target_sp" />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name=""
        required
        :title="`${t('devices.maxSP')}:`"
        :value="dynamicForm.props.max_sp"
      >
        <InputNumber v-model="dynamicForm.props.max_sp" />
      </SharedUILabel>
    </div>
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.hysteresis') }}
    </p>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[repeat(auto-fill,_150px)] tw-gap-1">
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name=""
        required
        :title="`${t('devices.below')}:`"
        :value="dynamicForm.props.below_tolerance"
      >
        <InputNumber v-model="dynamicForm.props.below_tolerance" />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name=""
        required
        :title="`${t('devices.above')}:`"
        :value="dynamicForm.props.above_tolerance"
      >
        <InputNumber v-model="dynamicForm.props.above_tolerance" />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name=""
        required
        :title="`${t('devices.complex')}:`"
        :value="dynamicForm.props.complex_tolerance"
      >
        <InputNumber v-model="dynamicForm.props.complex_tolerance" />
      </SharedUILabel>
    </div>
  </Form>
</template>
<style scoped>
::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}

</style>
