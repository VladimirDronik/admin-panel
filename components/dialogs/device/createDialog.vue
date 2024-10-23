<script setup lang="ts">
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const dialog = defineModel({
  default: false,
});

// Composables
const storeDevices = useDevicesStore();

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'created'): void
}>();

// Variables
const loadingModel = ref(false);

const form = ref({
  name: '',
  type: '',
  zone_id: null,
  category: 'controller',
});

const props = computed(() => {
  if (storeDevices.model?.props) {
    return storeDevices.model.props.map((item) => item.value);
  }
});
const childrenProps = computed(() => {
  if (storeDevices.model?.children) {
    return storeDevices.model?.children.map((item) => item?.props.map((item) => item.value))[0];
  }
});

// Methods
const getModel = async () => {
  loadingModel.value = true;
  if (form.value.type && form.value.category) {
    await storeDevices.getModelApi({
      type: form.value.type,
      category: form.value.category,
    });
  }
  loadingModel.value = false;
};

const showError = (text: string) => {
  toast.add({
    severity: 'error',
    summary: 'Ошибка создания',
    detail: 'Устройство не было создано',
    life: 5000,
  });
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
  if (storeDevices.model) {
    storeDevices.model = {
      ...storeDevices.model,
      props: propsModel(storeDevices.model.props),
      children: storeDevices.model.children?.map((item) => ({
        ...item,
        props: propsModel(item.props) ?? [],
      })),
    };
  }
};

// Watchers
watch(() => form.value.type, getModel);

watch(() => form.value.category, async () => {
  form.value.type = '';
  storeDevices.model = null;
  getModel();
});

watch([props, childrenProps], (newValue, oldValue) => {
  if (!_.isEqual(newValue, oldValue)) {
    updateFields();
  }
}, {
  immediate: true,
});
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1200">
      <template v-slot:button>
        <v-btn color="primary" class="text-capitalize" @click="dialog = true">
          {{ t('devices.addDevice') }}
        </v-btn>
      </template>

      <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between">
        <p class="tw-pl-2 tw-text-2xl tw-font-semibold">
          {{ t('devices.addTitleDevice') }}
        </p>
        <v-btn @click="dialog = false" icon size="small" variant="text">
          <XIcon class="white" />
        </v-btn>
      </div>

      <DevicesStepperForm
        v-model:form="form"
        v-model:dialog="dialog"
        :loadingModal="loadingModel"
      />

    </BaseDialog>
  </div>
</template>
