<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Static Data modules
import { paths } from '~/utils/endpoints';
// Types modules
import type { APIData } from '~/types/StoreTypes';
import { type Devices } from '~/types/DevicesTypes';
import { type FormTypes } from '~/components/devices/form.types';

// Composables
defineOptions({
  inheritAttrs: false,
});

const visible = defineModel<boolean>({
  default: false,
});

// Composables
const { t } = useI18n();
const storeDevices = useDevicesStore();

// Variables
const model = ref<Devices>();

const form = ref({
  name: '',
  type: null as unknown as FormTypes,
  zone_id: null,
  category: '',
  tags: [],
});

// Apis
const apiDeviceModel = ref<APIData<any>>();

// Computed Properties
const props = computed(() => {
  if (model.value?.props) {
    return model.value.props.map((item) => item.value);
  }
});

const childrenProps = computed(() => {
  if (model.value?.children) {
    return model.value?.children.map((item) => item?.props.map((item) => item.value))[0];
  }
});

// Methods
const getModel = async () => {
  if (form.value.type && form.value.category) {
    apiDeviceModel.value?.execute();
  }
};

const propsModel = (props: any[] | undefined) => {
  if (!props) return [];
  const result = props.map((item) => ({
    ...item,
    required: {
      func: item.required.func,
      funcText: String(item.required.func),
      value: item.required.func(storeDevices.userAccessLevel, props),
    },
    editable: {
      func: item.editable.func,
      funcText: String(item.editable.func),
      value: item.editable.func(storeDevices.userAccessLevel, props),
    },
    visible: {
      func: item.visible.func,
      funcText: String(item.visible.func),
      value: item.visible.func(storeDevices.userAccessLevel, props),
    },
  }));
  return result;
};

const updateFields = () => {
  if (model.value) {
    model.value = {
      ...model.value,
      props: propsModel(model.value.props),
      children: model.value.children?.map((item) => ({
        ...item,
        props: propsModel(item.props) ?? [],
      })),
    };
  }
};

// Watchers
watchEffect(() => {
  // const result = {
  //   ...apiDeviceModel.value?.data?.response,
  //   props: propsModel(apiDeviceModel.value?.data?.response.props),
  //   children: apiDeviceModel.value?.data?.response.children?.map((item: any) => ({
  //     ...item,
  //     props: propsModel(item.props) ?? [],
  //   })),
  // };

  // model.value = result;
  model.value = apiDeviceModel.value?.data?.response;
});

watch(() => form.value.type, getModel);

watch(() => form.value.category, () => {
  form.value.type = null as unknown as FormTypes;
  apiDeviceModel.value?.clear();
  getModel();
});

watch([props, childrenProps], (newValue, oldValue) => {
  if (!_.isEqual(newValue, oldValue)) {
    updateFields();
  }
}, {
  immediate: true,
});

// Hooks
// Get Device Model
const data: unknown = await useAPI(
  paths.objectModel,
  {
    body: computed(() => ({
      type: form.value.type,
      category: form.value.tags,
    })),
    immediate: false,
    watch: false,
  },
);

apiDeviceModel.value = data as APIData<any>;
//

const isOpen = inject<Ref<boolean>>('isOpen');

const handleButtonClick = () => {
  visible.value = true;
  if (isOpen) {
    isOpen.value = false;
  }
};

</script>

<template>
  <div>
    <Button
      class="text-capitalize"
      icon="pi pi-plus"
      :label="t('devices.addDevice')"
      @click="handleButtonClick"
    />

    <Dialog
      v-model:visible="visible"
      dismissable-mask
      :header="t('devices.addTitleDevice')"
      modal
      :style="{ 'max-width': '1200px', width: '100%', margin: '0 20px' }"
      @hide="form = {
        name: '', zone_id: null, type: null as unknown as FormTypes, tags: [], category: '',
      }"
    >
      <DevicesStepperForm
        v-model:dialog="visible"
        v-model:form="form"
        v-model:model="model"
        disable-room-select
        :loading-modal="apiDeviceModel?.pending && apiDeviceModel.status !== 'idle'"
      />
    </Dialog>
  </div>
</template>
