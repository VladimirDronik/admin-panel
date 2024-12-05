<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Static data modules
import { Form, FormField } from '@primevue/forms';
// Types and Schemes modules
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { APIData } from '~/types/StoreTypes';

const { t } = useI18n();

const storeRooms = useRoomsStore();

const id = defineModel<number>('id', {
  required: false,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

defineProps({
  edit: {
    type: Boolean,
    required: true,
  },
});

const Devices = [
  'switch',
  'button',
  'group',
  'conditioner',
  'light',
  'curtain',
  // Должен быть удален в будущем
  'sensor',
];

const form = ref({
  title: null,
  type: null,
  color: null,
  zone_id: null,
});
const editForm = ref();

const resolver = ref(zodResolver(
  z.object({
    title: z.string(),
    type: z.string(),
    zone_id: z.number(),
  }),
));

const apiItem = ref<APIData<any>>();

const loadingDelete = ref(false);

storeRooms.getRoomsApi();

watchEffect(() => {
  editForm.value = apiItem.value?.data?.response;
});

onBeforeMount(async () => {
  // Get Item
  const data: unknown = await useAPI('http://10.35.16.1:8081/private/item', {
    query: computed(() => ({
      id: id.value,
    })),
    immediate: false,
  });

  apiItem.value = data as APIData<any>;
  //
});
</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen">
    <div class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-2xl tw-font-semibold">
          {{ !edit ? 'Добавить Кнопку' : "Редактировать кнопку" }}
        </h3>
        <Button
          text
          @click="isOpen = false"
          icon="pi"
          rounded
          size="small"
          variant="text"
        >
          <XIcon class="white" />
        </Button>
      </div>

      <div v-if="editForm && edit" class="!tw-px-0 !tw-pt-1">
        <Tabs value="features">
          <!-- Header -->
          <TabList>
            <Tab value="features">
              <p class="tw-font-normal">
                {{ t('devices.features') }}
              </p>
            </Tab>
            <Tab value="events">
              <p class="tw-font-normal">
                {{ t('devices.events') }}
              </p>
            </Tab>
          </TabList>
          <!-- Container -->
          <TabPanels>
            <TabPanel value="features">
              <Form
                :resolver
                @submit="({ valid }) => { if (valid) return }"
              >
                <SharedUILabel
                  :title="'Название'"
                  :value="editForm.title"
                  name="title"
                  class="tw-mb-2"
                  required
                >
                  <InputText v-model="editForm.title" class="tw-w-full" />
                </SharedUILabel>
                <SharedUILabel
                  :title="'Тип'"
                  :value="editForm.type"
                  name="type"
                  class="tw-mb-2"
                  required
                >
                  <Select
                    v-model="editForm.type"
                    :options="Devices"
                    class="tw-w-full"
                    show-clear
                  />
                </SharedUILabel>
                <SharedUILabel
                  :title="'Помещение'"
                  :value="editForm.zone_id"
                  name="zone_id"
                  class="tw-mb-2"
                  required
                >
                  <Select
                    v-model="editForm.zone_id"
                    :options="storeRooms.getRoomsSelect"
                    optionLabel="name"
                    optionValue="code"
                    class="tw-w-full"
                    required
                    show-clear
                  />
                </SharedUILabel>
                <SharedUILabel
                  :title="'Цвет'"
                  class="tw-mb-2"
                >
                  <SharedUIColorSelect v-model="editForm.color" />
                </SharedUILabel>
                <div class="tw-flex tw-justify-end tw-pt-2">
                  <DialogsDeleteDialog
                    :loading="loadingDelete"
                    :title="`Вы уверены, что хотите удалить «${apiItem?.data?.response.title}»?`"
                    class="tw-mr-2"
                    :id="apiItem?.data?.response.item?.id ?? -1"
                  />

                  <Button
                    :label="t('save')"
                    type="submit"
                  />
                </div>
              </Form>
            </TabPanel>
            <TabPanel value="events">
              Скоро...
            </TabPanel>
          </TabPanels>
        </Tabs>
        <!--  -->
      </div>

      <div v-else>
        <Stepper value="1" linear>
          <StepList>
            <Step value="1">{{ t('devices.features') }}</Step>
            <Step value="2">{{ t('devices.events') }}</Step>
          </StepList>

          <StepPanels>
            <StepPanel v-slot="{ activateCallback }" value="1">
              <!-- Features Form -->
              <Form
                :resolver
                @submit="({ valid }) => { if (valid) activateCallback('2') }"
              >
                <SharedUILabel
                  :title="'Название'"
                  :value="form.title"
                  name="title"
                  class="tw-mb-2"
                  required
                >
                  <InputText
                    v-model="form.title"
                    class="tw-w-full"
                  />
                </SharedUILabel>
                <SharedUILabel
                  :title="'Тип'"
                  :value="form.type"
                  name="type"
                  class="tw-mb-2"
                  required
                >
                  <Select
                    v-model="form.type"
                    :options="Devices"
                    class="tw-w-full"
                    show-clear
                  />
                </SharedUILabel>
                <SharedUILabel
                  :title="'Помещение'"
                  :value="form.zone_id"
                  name="zone_id"
                  class="tw-mb-2"
                  required
                >
                  <Select
                    v-model="form.zone_id"
                    :options="storeRooms.getRoomsSelect"
                    optionLabel="name"
                    optionValue="code"
                    class="tw-w-full"
                    required
                    show-clear
                  />
                </SharedUILabel>
                <SharedUILabel
                  :title="'Цвет'"
                  class="tw-mb-2"
                >
                  <SharedUIColorSelect v-model="form.color" />
                </SharedUILabel>
                <!-- Actions -->
                <div class="tw-flex tw-justify-end tw-pt-2">
                  <Button type="submit">
                    {{ t('next') }}
                  </Button>
                </div>
                <!--  -->
              </Form>
              <!--  -->

            </StepPanel>

            <StepPanel v-slot="{ activateCallback }" value="2">
              <!-- Event Form -->
              <!--  -->
              <!-- Actions -->
              <div class="tw-flex tw-justify-between tw-pt-2">
                <Button
                  @click="activateCallback('1')"
                  :label="t('goBack')"
                />
                <Button :label="t('save')" />
              </div>
              <!--  -->
            </StepPanel>
          </StepPanels>
        </Stepper>
      </div>
    </div>
  </LayoutFullRightbar>
</template>

<style>

</style>
