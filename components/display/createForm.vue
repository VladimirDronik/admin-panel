<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form } from '@primevue/forms';
// Static modules
import { itemEventTypes } from '~/staticData/modelEvents';

const { t } = useI18n();
const storeRooms = useRoomsStore();

defineProps<{
  devices: string[]
}>();

const resolver = ref(zodResolver(
  z.object({
    title: z.string().min(1),
    type: z.string(),
    zone_id: z.number(),
  }),
));

const form = ref({
  title: null,
  type: null,
  color: null,
  zone_id: null,
});

</script>

<template>
  <Stepper v-if="resolver" value="1" linear>
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
              :options="devices"
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
        <DisplayEventsForm
          v-if="form.type"
          :type="form.type"
          :eventTypes="itemEventTypes"
        />
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
</template>

<style>

</style>
