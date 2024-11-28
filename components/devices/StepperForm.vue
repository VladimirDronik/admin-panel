<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import MultiSelect from 'primevue/multiselect';
import { updateParamsForApi } from '~/helpers/devices';

// Types
interface DeviceCreateForm {
  name: string;
  type: string;
  zone_id: number | null;
  category: string;
  tags: string[];
}

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeRooms = useRoomsStore();
const storeDevices = useDevicesStore();

const form = defineModel<DeviceCreateForm>('form', {
  required: true,
});
const dialog = defineModel<boolean>('dialog', {
  required: true,
});

defineProps({
  loadingModal: {
    type: Boolean,
    default: false,
  },
});

// Variables
const loading = ref(false);

// Computed Properties
const types = computed(() => _.uniq(_.map(storeDevices.types?.data?.response, 'type')));
const categories = computed(() => _.uniq(_.map(storeDevices.types?.data?.response, 'category')));
const tags = computed(() => (storeDevices.tags?.data?.response ? _.uniq(Object.keys(storeDevices.tags?.data?.response)) : []));

const toggleTag = (tag: string) => {
  if (!form.value.tags) {
    form.value.tags = [];
  }
  const index = form.value.tags.indexOf(tag);
  if (index === -1) {
    form.value.tags.push(tag);
  } else {
    form.value.tags.splice(index, 1);
  }
};

watch(
  () => form.value.tags,
  (updatedTags) => {
    storeDevices.getTypesApi({ tags: updatedTags.join(';') }, false);
  },
  { deep: true },
);

const isSelected = (tagName: string): boolean => Boolean((form.value.tags ?? []).find((tag) => tag === tagName));

const valid = computed(() => {
  const main =
    checkValidInput(form.value.zone_id) &&
    checkValidInput(form.value.tags) &&
    checkValidInput(form.value.category) &&
    checkValidInput(form.value.type) &&
    checkValidInput(form.value.name);

  let props = true;
  let children = true;

  if (storeDevices.model?.props.length) {
    props = storeDevices.model.props.every((item) => {
      if (item.required) return true;
      return checkValidInput(item.value);
    });
  }

  if (storeDevices.model?.children?.length) {
    children = storeDevices.model.children.every((child) => {
      if (child.props.length) return true;
      return child.props.every((item) => checkValidInput(item.value));
    });
  }

  return main && props && children;
});

// Methods
const checkValidInput = (value: any) => value || value === false;

const createDevice = async () => {
  loading.value = true;
  if (storeDevices.model) {
    const params = updateParamsForApi({
      ...storeDevices.model,
      ...form.value,
    });

    await updateData({
      update: async () => {
        await storeDevices.createDeviceApi(params);
        await storeDevices.getDevicesApi({
          limit: 10000,
          offset: 0,
        });
      },
      success: () => {
        dialog.value = false;
        storeDevices.model = null;
        form.value = {
          name: '',
          zone_id: null,
          type: '',
          tags: [],
          category: 'controller',
        };
      },
      successMessage: 'Устройство успешно создано',
      errorMessage: 'Устройство не было создано',
    });
  }
  loading.value = false;
};
</script>

<template>
  <Stepper value="1" class="basis-[50rem]" linear>
    <StepList>
      <Step value="1">{{ t('devices.features') }}</Step>
      <Step value="2">{{ t('devices.events') }}</Step>
      <Step value="3">{{ t('devices.management') }}</Step>
    </StepList>

    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1">
        <form>
          <div class="tw-mb-4 tw-flex tw-flex-wrap tw-justify-center tw-gap-2">
            <Tag
              v-for="tag in tags"
              :key="tag"
              @click="toggleTag(tag)"
              :value="tag"
              :severity="isSelected(tag) ? 'success' : undefined"
              class="tw-cursor-pointer tw-rounded-md tw-px-3 tw-py-1 tw-text-sm"
            >
              <p class="tw-font-normal">{{ tag }}</p>
            </Tag>
          </div>
          <div class="-tw-ml-[50%] tw-pr-[5%]">
            <SharedUIField :required="true">
              <template #label>
                {{ t('devices.category') }}
              </template>
              <template #input>
                <MultiSelect v-model="form.tags" :options="tags" filter display="chip" :maxSelectedLabels="5" class="tw-w-full" required />
              </template>
            </SharedUIField>

            <SharedUIField :required="true">
              <template #label>
                {{ t('devices.type') }}
              </template>
              <template #input>
                <Select v-model="form.type" :options="types" required class="tw-w-2/4" />
              </template>
            </SharedUIField>
          </div>

          <Divider class="tw-mt-0 tw-pb-3" />

          <div class="-tw-ml-[50%] tw-pr-[5%]">
            <SharedUIField :required="true">
              <template #label>
                {{ t('devices.title') }}
              </template>
              <template #input>
                <InputText v-model="form.name" required class="tw-w-3/4" />
              </template>
            </SharedUIField>

            <SharedUIField :required="true">
              <template #label>
                {{ t('devices.room') }}
              </template>
              <template #input>
                <Select v-model="form.zone_id" :options="storeRooms.getRoomsSelect" optionLabel="name" optionValue="code" class="tw-w-2/4" required />
              </template>
            </SharedUIField>
          </div>

          <Divider class="tw-pb-3" />

          <DevicesPropertiesForm disableRoomSelect v-model="storeDevices.model" :loadingModal="loadingModal" />
        </form>

        <div class="tw-flex tw-justify-end">
          <Button :disabled="!valid" @click="activateCallback('2')">
            {{ t('next') }}
          </Button>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <DevicesEventsForm v-if="storeDevices.model" v-model="storeDevices.model" />
        <div class="tw-flex tw-justify-between">
          <Button @click="activateCallback('1')">
            {{ t('goBack') }}
          </Button>
          <Button @click="activateCallback('3')">
            {{ t('next') }}
          </Button>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="3">
        Пока пусто
        <div class="tw-flex tw-justify-between">
          <Button @click="activateCallback('2')">
            {{ t('goBack') }}
          </Button>
          <Button color="primary" @click="createDevice" :loading="loading" :label="t('save')" />
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>
