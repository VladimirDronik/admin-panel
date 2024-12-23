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
const { api } = useApiInstant();
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
  const sensors = data.response.list.flatMap((item: any) => item.children.filter((child: any) => child.category === 'sensor'));
  sensorOptions.value = sensors.map((sensor: any) => ({
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
  const { data } = await api.get(endpoint, {
    params: { without_children: false },
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
  const { data } = await api.get(endpoint, {
    params: { without_children: false },
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
  min_sp: z.number().min(1),
  target_sp: z.number().min(1),
  max_sp: z.number().min(1),
  below_tolerance: z.number().min(1),
  above_tolerance: z.number().min(1),
  complex_tolerance: z.number().min(1),
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
  <Form :resolver="resolver" :validateOnValueUpdate="false" :validateOnBlur="true" :form="dynamicForm">
    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.title')" required name="title">
      <InputText
        v-model="dynamicForm.name"
        required
        class="tw-w-3/4" />
    </SharedUILabel>
    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.room')" name="room">
      <Select
        :showClear="true"
        v-model="dynamicForm.zone_id"
        :options="storeRooms.getRoomsSelect"
        optionLabel="name"
        optionValue="code"
        class="tw-w-3/4"
        :disabled="true"
      />
    </SharedUILabel>
    <Divider v-if="props.isEditing" class="tw-mt-0 tw-pb-3" />
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>
    <SharedUILabel :width="300" v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.mainSensor')" required name="">
      <Select
        :options="sensorOptions"
        optionLabel="label"
        optionValue="value"
        class="tw-w-3/4"
        @change="handleMainSensorSelection"
      />
    </SharedUILabel>
    <SharedUILabel :width="300" v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.indicator')" required :value="dynamicForm.parent_id" name="">
      <Select
        v-model="dynamicForm.parent_id"
        :options="mainSensorChildrenOptions"
        optionLabel="label"
        optionValue="value"
        class="tw-w-3/4"
      />
    </SharedUILabel>
    <SharedUILabel :width="300" class="tw-mb-2" :title="t('devices.sensorTTL')" required :value="dynamicForm.props.sensor_value_ttl" name="sensor_value_ttl">
      <InputNumber
        v-model="dynamicForm.props.sensor_value_ttl"
      />
    </SharedUILabel>
    <Divider class="tw-mt-0 tw-pb-3" />
    <SharedUILabel :width="300" class="tw-mb-2" :title="t('devices.additionalSensor')" name="">
      <Select
        :options="sensorOptions"
        optionLabel="label"
        optionValue="value"
        class="tw-w-3/4"
        @change="handleAdditionalSensorSelection"
      />
    </SharedUILabel>
    <SharedUILabel :width="300" class="tw-mb-2" :title="t('devices.indicator')" :value="dynamicForm.props.fallback_sensor_value_id" name="">
      <Select
        v-model="dynamicForm.props.fallback_sensor_value_id"
        :options="additionalSensorChildrenOptions"
        optionLabel="label"
        optionValue="value"
        class="tw-w-3/4"
      />
    </SharedUILabel>
    <Divider class="tw-mt-0 tw-pb-3" />
    <SharedUILabel :width="300" required :title="t('devices.regulation')">
      <ToggleSwitch v-model="dynamicForm.props.enable" />
    </SharedUILabel>
    <SharedUILabel :width="300" class="tw-mb-2" :title="t('devices.regulatorType')" required :value="dynamicForm.props.type" name="type">
      <Select
        v-model="dynamicForm.props.type"
        :options="typeOptions"
        class="tw-w-3/4"
      />
    </SharedUILabel>
    <Divider class="tw-mt-0 tw-pb-3" />
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.setpoint') }}</p>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[repeat(auto-fill,_150px)] tw-gap-1">
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        required
        :value="dynamicForm.props.min_sp"
        name=""
        :title="`${t('devices.minSP')}:`"
      >
        <InputNumber v-model="dynamicForm.props.min_sp" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="dynamicForm.props.target_sp" name="" :title="`${t('devices.targetSP')}:`">
        <InputNumber v-model="dynamicForm.props.target_sp" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="dynamicForm.props.max_sp" name="" :title="`${t('devices.maxSP')}:`">
        <InputNumber v-model="dynamicForm.props.max_sp" />
      </SharedUILabel>
    </div>
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.hysteresis') }}</p>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[repeat(auto-fill,_150px)] tw-gap-1">
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="dynamicForm.props.below_tolerance" name="" :title="`${t('devices.below')}:`">
        <InputNumber v-model="dynamicForm.props.below_tolerance" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="dynamicForm.props.above_tolerance" name="" :title="`${t('devices.above')}:`">
        <InputNumber v-model="dynamicForm.props.above_tolerance" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="dynamicForm.props.complex_tolerance" name="" :title="`${t('devices.complex')}:`">
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
