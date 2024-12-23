<script setup lang="ts">
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Types modules
import type { APIData } from '~/types/StoreTypes';
// Static Data modules
import { paths } from '~/utils/endpoints';
import { type Devices } from '~/types/DevicesTypes';

const visible = defineModel<boolean>({
  default: false,
});

defineOptions({
  inheritAttrs: false,
});

// Composables
const storeDevices = useDevicesStore();

const { t } = useI18n();

// Variables
const model = ref<Devices>();

const apiDeviceModel = ref<APIData<any>>();

const form = ref({
  name: '',
  type: '',
  zone_id: null,
  category: 'controller',
  tags: [],
});

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
watch(() => form.value.type, getModel);

watch(() => form.value.category, () => {
  form.value.type = '';
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

onBeforeMount(async () => {
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
});
</script>

<template>
  <div>
    <Button
      class="text-capitalize"
      icon="pi pi-plus"
      :label="t('devices.addDevice')"
      @click="visible = true"
    />

    <Dialog
      v-model:visible="visible"
      dismissable-mask
      :header="t('devices.addTitleDevice')"
      modal
      :style="{ 'max-width': '1200px', width: '100%', margin: '0 20px' }"
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
