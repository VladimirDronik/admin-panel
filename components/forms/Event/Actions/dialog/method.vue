<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types Modules
import type { Request } from '~/types/StoreTypes';
import type { Event } from '@/types/ModelEventTypes';
import { EventObjectsSchema, type ActionObject } from '@/stores/devices/devicesTypes';

// Types
interface Method {
  name: string
  description: string;
}

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const { isDark } = useUserStore();

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

interface data {
  list: ActionObject[];
  total: number;
}

const {
  createAction,
  selectObject,
  selectMethod,
  statusAction,
} = await useCreateAction();

const {
  filteredObjects,
} = await useDevice();

async function useDevice() {
  const {
    data: dataDevices,
  } = await useAPI<Request<data>>(
    paths.objects,
    {
      params: {
        type_struct: 'easy',
        with_methods: true,
        limit: 9999,
      },
    },
    EventObjectsSchema,
  );

  const filteredObjects = computed(() => dataDevices.value?.response.list
    .filter((item) => item.name.toLowerCase().includes(search.value.toLowerCase())
      && item.type !== 'regulator'
      && item.methods));

  return {
    filteredObjects,
  };
}

async function useCreateAction() {
  const {
    execute: executeAction,
    status: statusAction,
  } = await useAPI<Request<any>>(
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
        target_id: selectedObject.value?.id,
        target_type: 'object',
        type: 'method',
        sort: 0,
        qos: 0,
      })),
      method: 'POST',
      watch: false,
      immediate: false,
    },
  );

  // Methods
  const createAction = async () => {
    if (props.id) {
      await updateData({
        update: async () => {
          await executeAction();
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
        target_id: selectedObject.value?.id,
        target_type: 'object',
        type: 'method',
        sort: 0,
        qos: 0,
      });
      emit('updateActions');
      dialog.value = false;
    }
  };

  const selectObject = (object: any) => {
    selectedObject.value = object;
    selectedMethod.value = null;
  };
  const selectMethod = (method: Method) => {
    selectedMethod.value = method;
  };

  // Watchers
  watch(search, () => {
    selectedObject.value = null;
  });

  return {
    createAction,
    selectObject,
    selectMethod,
    statusAction,
  };
}

watch(dialog, () => {
  if (dialog.value) {
    selectedObject.value = null;
    selectedMethod.value = null;
  }
});

</script>

<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="'Выбор метода обьекта'"
      modal
      :pt="{
        header: { class: 'tw-pb-0' },
      }"
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <p class="tw-mb-7">
        Позволяет выбрать метод любого обьекта в системе
      </p>

      <div class="tw-mb-2 tw-flex">
        <h3 class="tw-mr-2 tw-w-6/12 tw-text-lg">
          Список Обьектов
        </h3>
        <h3 class="tw-w-6/12 tw-text-lg">
          Список Методов
        </h3>
      </div>
      <div class="tw-flex">
        <div class="border-base tw-mr-2 tw-w-6/12 tw-rounded tw-border tw-p-3">
          <InputText
            v-model="search"
            class="tw-mb-2 tw-w-full"
          />
          <div v-if="filteredObjects?.length">
            <ScrollPanel style="height: 300px">
              <Button
                v-for="object in filteredObjects"
                :key="object.id"
                class="tw-block tw-w-full"
                text
                type="button"
                @click="selectObject(object)"
              >
                <div class="tw-flex tw-items-center tw-justify-between tw-text-xl">
                  <div
                    class="tw-flex tw-max-w-80 tw-truncate tw-text-lg"
                    :class="{
                      '!tw-text-green-500': selectedObject?.id === object.id,
                      'tw-text-white': selectedObject?.id !== object.id && isDark,
                      'tw-text-black': selectedObject?.id !== object.id && !isDark,
                    }"
                  >
                    <p class="tw-mr-1 tw-w-full tw-max-w-72 tw-truncate">
                      {{ object.name }}
                    </p>
                    <span class="tw-text-xs">
                      {{ object.methods?.length }}
                    </span>
                  </div>
                </div>
              </Button>
            </ScrollPanel>
          </div>
          <div
            v-else
            class="tw-pl-3 tw-pt-2"
            style="height: 300px"
          >
            Список Обьектов пуст
          </div>
        </div>
        <div class="tw-w-6/12">
          <div class="border-base tw-mb-2 tw-rounded tw-border tw-p-3">
            <div v-if="selectedObject?.methods?.length">
              <Button
                v-for="method in selectedObject.methods"
                :key="method.name"
                class="tw-flex tw-w-full tw-items-center tw-justify-between"
                text
                type="button"
                @click="selectMethod(method)"
              >
                <p
                  class="tw-text-lg"
                  :class="{
                    'tw-text-green-500': selectedMethod?.name === method.name,
                    'tw-text-white': selectedMethod?.name !== method.name && isDark,
                    'tw-text-black': selectedMethod?.name !== method.name && !isDark,
                  }"
                >
                  {{ method.description }}
                </p>
              </Button>
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
          :loading="statusAction === 'pending'"
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
