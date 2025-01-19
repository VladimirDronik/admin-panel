<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Static Data modules
import { paths } from '~/utils/endpoints';
// Types Modules
import type { Event } from '@/types/ModelEventTypes';
import type { APIData } from '~/types/StoreTypes';
import { type ScriptType } from '~/stores/script/scriptTypes';

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

const event = defineModel<Event>('event', {
  required: true,
});

const dialog = defineModel<boolean>({
  default: false,
});

// Variables
const selectedCondition = ref();

// Apis
const apiCreateMethod = ref<APIData<any>>();

const chooseCondition = (type: string) => {
  if (type === 'if') {
    selectedCondition.value = {
      enabled: true,
      target_id: props.id,
      target_type: 'if',
      type: 'if',
      sort: 0,
      qos: 0,
      then: [],
      args: {
        isOpen: true
      }
    }
  } else {
    selectedCondition.value = {
      enabled: true,
      target_id: props.id,
      target_type: 'if-else',
      type: 'if-else',
      sort: 0,
      qos: 0,
      then: [],
      else: [],
      args: {
        isOpen: true
      }
    }
  }
}

// Methods
const createAction = async () => {
  // if (props.id) {
  //   updateData({
  //     update: async () => {
  //       await apiCreateMethod.value?.execute();
  //       emit('updateActions');
  //     },
  //     success: () => {
  //       dialog.value = false;
  //     },
  //     successMessage: 'Скрипт успешно добавлен',
  //     errorMessage: 'Ошибка добавления Скрипта',
  //   });
  // } else {
    event.value.actions.push(selectedCondition.value);
    // emit('updateActions');
    dialog.value = false;
  // }
};

// Hooks
// onBeforeMount(async () => {
//   // Create Action
//   const dataDevice: unknown = await useAPI(
//     () => paths.eventsActions,
//     {
//       params: computed(() => ({
//         target_type: props.targetType,
//         target_id: props.id,
//         event_name: event.value.code,
//       })),
//       body: computed(() => ({
//         args: selectedScript.value,
//         enabled: true,
//         name: selectedScript.value?.name,
//         target_id: props.id,
//         target_type: 'script',
//         type: 'script',
//         sort: 0,
//         qos: 0,
//       })),
//       method: 'POST',
//       watch: false,
//       immediate: false,
//     },
//   );
//   apiCreateMethod.value = dataDevice as APIData<any>;
//   //
// });
</script>

<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="'Выбор условия'"
      modal
      :style="{
        'max-width': '900px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <div class="tw-mb-3 tw-flex tw-items-start tw-gap-3">
        <button
          class="border-base tw-w-48 tw-rounded-md tw-border tw-p-3 tw-text-left"
          :class="{'tw-border-primary': selectedCondition?.type === 'if'}"
          @click="chooseCondition('if')"
        >
          <p
            class="tw-mb-2 tw-text-xl"
            :class="{'tw-text-primary': selectedCondition?.type === 'if'}"
          >
            Если
          </p>
          <div class="tw-flex tw-h-14 tw-items-center">
            <p 
              class="tw-mr-2 tw-text-sm"
              :class="{'tw-text-primary': selectedCondition?.type === 'if'}"
            >
              Тогда
            </p>
            <div 
              class="border-base tw-h-6 tw-w-full tw-rounded-sm tw-border"
              :class="{'tw-border-primary': selectedCondition?.type === 'if'}"
            />
          </div>
        </button>
        <button
          class="border-base tw-w-48 tw-rounded-md tw-border tw-p-3 tw-text-left "
          :class="{'tw-border-primary': selectedCondition?.type === 'if-else'}"
          @click="chooseCondition('if-else')"
        >
          <p
            class="tw-mb-2 tw-text-xl"
            :class="{'tw-text-primary': selectedCondition?.type === 'if-else'}"
          >
            Если
          </p>
          <div class="tw-mb-2 tw-flex tw-items-center">
            <p
              class="tw-mr-2 tw-block tw-w-14 tw-text-sm"
              :class="{'tw-text-primary': selectedCondition?.type === 'if-else'}"
            >
              Тогда
            </p>
            <div 
              class="border-base tw-h-6 tw-w-full tw-rounded-sm tw-border"
              :class="{'tw-border-primary': selectedCondition?.type === 'if-else'}"
            />
          </div>
          <div class="tw-flex tw-items-center">
            <p 
              class="tw-mr-2 tw-block tw-w-14 tw-text-sm"
              :class="{'tw-text-primary': selectedCondition?.type === 'if-else'}"
            >
              Если
            </p>
            <div 
              class="border-base tw-h-6 tw-w-full tw-rounded-sm tw-border"
              :class="{'tw-border-primary': selectedCondition?.type === 'if-else'}"
            />
          </div>
        </button>
      </div>

      <div class="tw-pt-4">
        <!-- :disabled="!selectedScript" -->
        <Button
          class="tw-mr-2"
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
