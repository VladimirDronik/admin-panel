<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Static Data modules
import { paths } from '~/utils/endpoints';
// Types Modules
import type { APIData } from '~/types/StoreTypes';
import type { Event } from '@/types/ModelEventTypes';

// Types
interface Method {
  name: string
  description: string;
}

// Composables
const { t } = useI18n();
const { updateData } = useUtils();

// Declare Options
const props = defineProps<{
  id?: number;
  edit: boolean;
  targetType: string;
}>();

const emit = defineEmits<{
  (e: 'updateActions'): void
}>();

const dialog = defineModel<boolean>({
  default: false,
});

const event = defineModel<Event>('event', {
  required: true,
});

// Variables
const selectedObject = ref<any>();
const selectedMethod = ref<Method | null>();

const search = ref('');

// Apis
const apiDevicesList = ref<APIData<any>>();
const apiCreateMethod = ref<APIData<any>>();

// Computed Properties
const filteredObjects = computed(() => apiDevicesList.value?.data?.response.list.filter((item: any) => item.name.toLowerCase().includes(search.value.toLowerCase())));

// Methods
const selectObject = (object: any) => {
  selectedObject.value = object;
  selectedMethod.value = null;
};
const selectMethod = (method: Method) => {
  selectedMethod.value = method;
};

const createAction = async () => {
  if (props.id) {
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
  } else {
    event.value.actions.push({
      args: {
        ...selectedMethod.value,
        object: selectedObject.value.name,
      },
      enabled: true,
      name: selectedMethod.value?.name,
      target_id: props.id,
      target_type: 'method',
      type: 'method',
      sort: 0,
      qos: 0,
    });
    emit('updateActions');
    dialog.value = false;
  }
};

// Watchers
watch(search, () => {
  selectedObject.value = null;
});

watch(dialog, () => {
  if (dialog.value) {
    selectedObject.value = null;
    selectedMethod.value = null;
  }
});

// Hooks
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
        target_type: props.targetType,
        target_id: props.id,
        event_name: event.value.code,
      })),
      body: computed(() => ({
        args: {
          ...selectedMethod.value,
          object: selectedObject.value.name,
        },
        enabled: true,
        name: selectedMethod.value?.name,
        target_id: props.id,
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
      dismissable-mask
      :header="'Выбор метода обьекта'"
      modal
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
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
      <div
        class="tw-flex"
      >
        <div class="border-base tw-mr-2 tw-w-6/12 tw-rounded tw-border tw-p-3">
          <InputText
            v-model="search"
            class="tw-mb-2 tw-w-full"
          />
          <div v-if="filteredObjects?.length">
            <ScrollPanel style="height: 300px">
              <button
                v-for="object in filteredObjects"
                :key="object.id"
                class="tw-block"
                type="button"
                @click="selectObject(object)"
              >
                <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between tw-text-xl">
                  <p
                    class="tw-max-w-80 tw-truncate tw-text-lg "
                    :class="{ 'tw-text-green-500': selectedObject?.id === object.id }"
                  >
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
          <div class="border-base tw-mb-2 tw-rounded tw-border tw-p-3">
            <div v-if="selectedObject?.methods?.length">
              <button
                v-for="method in selectedObject.methods"
                :key="method.name"
                class="tw-flex tw-items-center tw-justify-between"
                type="button"
                @click="selectMethod(method)"
              >
                <p
                  class="tw-text-lg"
                  :class="{ 'tw-text-green-500': selectedMethod?.name === method.name }"
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
          class="tw-mr-2"
          :disabled="!selectedMethod"
          :loading="apiCreateMethod?.pending && apiCreateMethod.status !== 'idle'"
          @click="createAction"
        >
          {{ t('save') }}
        </Button>
        <Button
          outlined
          variant="outlined"
          @click="dialog = false"
        >
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>
