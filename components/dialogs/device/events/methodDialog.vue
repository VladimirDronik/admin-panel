<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const storeDevices = useDevicesStore();

const dialog = defineModel({
  default: false,
});

const object = defineModel<any>('object', {
  default: false,
});

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const objects = ref<any[]>([]);

const selectedObject = ref<any>();
const selectedMethod = ref<any>();

const loading = ref(false);

const selectObject = (object: any) => {
  selectedObject.value = object;
  selectedMethod.value = null;
};
const selectMethod = (method: any) => {
  selectedMethod.value = method;
};

const createAction = async () => {
  loading.value = true;
  await storeDevices.createEventApi({
    args: selectedMethod.value,
    enabled: true,
    name: '',
    target_id: object.value.id,
    target_type: object.value.type,
    type: 'method',
    sort: 0,
    qos: 0,
  });
  loading.value = false;
};

watch(dialog, () => {
  if (dialog.value) {
    selectedObject.value = null;
    selectedMethod.value = null;
  }
});

storeDevices.getDevicesApi({
  type_struct: 'easy',
  with_methods: true,
  limit: 9999,
}, false)
  .then((response) => {
    objects.value = response.data.list;
  });
</script>

<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      :header="'Выбор метода обьекта'"
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissableMask
    >
      <p class="tw-mb-7">
        Позволяет выбрать метод любого обьекта в системе
      </p>

      <div v-if="objects?.length" class="tw-flex">
        <div class="tw-mr-2 tw-w-6/12 tw-rounded tw-border tw-p-3">
          <div v-if="objects?.length">
            <div v-for="object in objects" :key="object.id">
              <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
                <p :class="{ 'tw-text-green-500': selectedObject?.id === object.id }" class="tw-max-w-80 tw-truncate tw-text-lg tw-font-semibold">
                  {{ object.name }}
                </p>
                <Button size="small" @click="selectObject(object)">
                  Выбрать
                </Button>
              </div>
            </div>
          </div>
          <div v-else>
            Список Обьектов пуст
          </div>
        </div>
        <div class="tw-w-6/12">
          <div class="tw-mb-2 tw-rounded tw-border tw-p-3">
            <div v-if="selectedObject?.methods?.length">
              <div v-for="method in selectedObject.methods" :key="method.name" class="tw-flex tw-items-center tw-justify-between">
                <p :class="{ 'tw-text-green-500': selectedMethod?.name === method.name }" class="tw-text-lg tw-font-semibold">
                  {{ method.name }}
                </p>
                <Button size="small" @click="selectMethod(method)">
                  Выбрать
                </Button>
              </div>
            </div>
            <div v-else>
              Список Методов пуст
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="tw-rounded tw-border tw-p-3">
        Выбор параметра метода
      </div> -->

      <div class="tw-pt-4">
        <Button @click="createAction" :loading="loading" class="tw-mr-2" :disabled="!selectedMethod">
          {{ t('save') }}
        </Button>
        <Button variant="outlined" @click="dialog = false" outlined>
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>
