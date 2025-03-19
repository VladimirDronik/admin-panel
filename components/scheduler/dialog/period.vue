<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Form } from '@primevue/forms';
import { minuteOptions, types, days } from './dataForPeriods';

type PeriodType = 'periodicity' | 'day' | 'month' | 'year'

const { t } = useI18n();

const dialog = defineModel<boolean>('dialog', {
  required: true,
});

const period = defineModel<string[]>('period', {
  required: true,
});

const { edit = false } = defineProps<{
  edit?: boolean;
}>();

const selectedType = ref<PeriodType>('periodicity');

const selectedPeriod = ref<string>();
const selectedDay = ref([]);
const selectedDays = ref<number[]>([]);
const selectedDates = ref<Date[]>([]);

const addPeriod = () => {
  if (edit) {
    console.log('create');
  } else {
    switch (selectedType.value) {
      case 'periodicity':
        if (selectedPeriod.value) {
          period.value.push(selectedPeriod.value);
        }
        break;
      // case 'day':
      //   if (selectedPeriod.value) period.value.push(selectedDay.value);
      //   break;
      // case 'month':
      //   if (selectedPeriod.value) period.value.push(selectedDays.value);
      //   break;
      // case 'year':
      //   if (selectedPeriod.value) period.value.push(selectedDates.value);
      //   break;
      default:
        if (selectedPeriod.value) {
          period.value.push(selectedPeriod.value);
        }
        break;
    }
    dialog.value = false;
  }
};

</script>

<template>
  <div>
    <Button
      class="text-capitalize"
      icon="pi pi-plus"
      :label="t('Добавить период')"
      @click="dialog = true"
    />
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="t('devices.addTitleDevice')"
      modal
      :style="{ 'max-width': '900px', width: '100%', margin: '0 20px' }"
    >
      <Form @submit="({ valid }) => { if (valid) addPeriod() }">
        <SelectButton
          v-model="selectedType"
          :allow-empty="false"
          option-label="name"
          option-value="key"
          :options="types"
        />

        <div class="tw-pt-4">
          <!-- Period Select -->
          <SharedUILabel
            v-if="selectedType === 'periodicity'"
            :title="t('Длительность')"
          >
            <Select
              v-model="selectedPeriod"
              class="tw-w-full"
              option-label="name"
              option-value="key"
              :options="minuteOptions"
            />
          </SharedUILabel>
          <!--  -->

          <!-- Week Select -->
          <div v-if="selectedType === 'day'">
            <FloatLabel
              class="tw-mb-4"
              variant="in"
            >
              <DatePicker
                id="datepicker-timeonly"
                fluid
                time-only
              />
              <label for="in_label">{{ t('Длительность') }}</label>
            </FloatLabel>
            <SelectButton
              v-model="selectedDay"
              multiple
              option-label="name"
              option-value="key"
              :options="days"
            />
          </div>
          <!--  -->

          <!-- Day Select -->
          <SharedUIDayOfMonthSelect
            v-if="selectedType === 'month'"
            v-model="selectedDays"
          />
          <!--  -->

          <!-- Date Select -->
          <div v-if="selectedType === 'year'">
            <FloatLabel variant="in">
              <DatePicker
                v-model="selectedDates"
                fluid
                for="date"
                :manual-input="false"
                selection-mode="multiple"
                variant="filled"
              />
              <label for="date">{{ t('Даты') }}</label>
            </FloatLabel>
          </div>
          <!--  -->
        </div>
        <div class="tw-flex tw-justify-end tw-pt-3">
          <Button
            :label="'Добавить Период'"
            type="submit"
          />
        </div>
      </Form>
    </Dialog>
  </div>
</template>
