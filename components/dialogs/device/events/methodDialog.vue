<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
// Types Modules
import type { APIData } from '~/types/StoreTypes';
// Static Data modules
import { paths } from '~/utils/endpoints';

const { t } = useI18n();
const { updateData } = useUtils();
const storeDevices = useDevicesStore();

const dialog = defineModel({
  default: false,
});

const object = defineModel<any>('object', {
  default: false,
});

const event = defineModel<any>('event', {
  default: false,
});

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'updateActions'): void
}>();

const apiCreateMethod = ref<APIData<any>>();
const apiDevicesList = ref<APIData<any>>();

const selectedObject = ref<any>();
const selectedMethod = ref<any>();

const search = ref('');

watch(search, () => {
  selectedObject.value = null;
});

const selectObject = (object: any) => {
  selectedObject.value = object;
  selectedMethod.value = null;
};
const selectMethod = (method: any) => {
  selectedMethod.value = method;
};

const filteredObjects = computed(() => apiDevicesList.value?.data?.response.list.filter((item: any) => item.name.includes(search.value)));

const createAction = async () => {
  await updateData({
    update: async () => {
      await apiCreateMethod.value?.execute();
      emit('updateActions');
    },
    success: () => {
      dialog.value = false;
    },
    successMessage: 'Метод успешно сохранен',
    errorMessage: 'Ошибка добавления Метода',
  });
};

watch(dialog, () => {
  if (dialog.value) {
    selectedObject.value = null;
    selectedMethod.value = null;
  }
});

// storeDevices.getDevicesApi({
//   type_struct: 'easy',
//   with_methods: true,
//   limit: 9999,
// }, false)
//   .then((response) => {
//     objects.value = response.response.list;
//   });

onBeforeMount(async () => {
  // Get Device List
  const data: unknown = await useAPI(
    paths.objects,
    {
      params: {
        type_struct: 'easy',
        with_methods: true,
        limit: 9999,
      },
    },
  );

  apiDevicesList.value = data as APIData<any>;
  //

  // Create Action
  const dataDevice: unknown = await useAPI(
    () => paths.eventsActions,
    {
      params: computed(() => ({
        target_type: event.value.target_type,
        target_id: object.value.id,
        event_name: event.value.code,
      })),
      body: computed(() => ({
        args: {
          ...selectedMethod.value,
          object: selectedObject.value.name,
        },
        enabled: true,
        name: object.value.name,
        target_id: object.value.id,
        target_type: 'method',
        type: 'method',
        sort: 0,
        qos: 0,
      })),
      method: 'POST',
      watch: false,
      immediate: false,
    },
  );
  apiCreateMethod.value = dataDevice as APIData<any>;
  //
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

      <div class="tw-flex">
        <h3 class="tw-mr-2 tw-w-6/12 tw-text-lg">
          Список Обьектов
        </h3>
        <h3 class="tw-w-6/12 tw-text-lg">
          Список Методов
        </h3>
      </div>
      <div v-if="filteredObjects?.length" class="tw-flex">
        <div class="tw-mr-2 tw-w-6/12 tw-rounded tw-border tw-p-3">
          <div v-if="filteredObjects?.length">
            <InputText v-model="search" class="tw-mb-2 tw-w-full" />
            <ScrollPanel style="height: 300px">
              <button
                v-for="object in filteredObjects"
                :key="object.id"
                @click="selectObject(object)"
                type="button"
                class="tw-block"
              >
                <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between tw-text-xl">
                  <p :class="{ 'tw-text-green-500': selectedObject?.id === object.id }" class="tw-max-w-80 tw-truncate tw-text-lg ">
                    {{ object.name }}
                  </p>
                </div>
              </button>
            </ScrollPanel>
          </div>
          <div v-else>
            Список Обьектов пуст
          </div>
        </div>
        <div class="tw-w-6/12">
          <div class="tw-mb-2 tw-rounded tw-border tw-p-3">
            <div v-if="selectedObject?.methods?.length">
              <button
                v-for="method in selectedObject.methods"
                :key="method.name"
                @click="selectMethod(method)"
                type="button"
                class="tw-flex tw-items-center tw-justify-between"
              >
                <p
                  :class="{ 'tw-text-green-500': selectedMethod?.name === method.name }"
                  class="tw-text-lg"
                >
                  {{ method.name }}
                </p>
              </button>
            </div>
            <div v-else>
              Список Методов пуст
            </div>
          </div>
        </div>
      </div>

      <div class="tw-pt-4">
        <Button
          @click="createAction"
          :loading="apiCreateMethod?.pending && apiCreateMethod.status !== 'idle'"
          class="tw-mr-2"
          :disabled="!selectedMethod"
        >
          {{ t('save') }}
        </Button>
        <Button
          variant="outlined"
          @click="dialog = false"
          outlined
        >
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>
