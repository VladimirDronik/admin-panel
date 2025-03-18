<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const dialog = defineModel<boolean>('dialog', {
  required: true,
});

const selectedType = ref('minute');

const selectedDay = ref([]);

const dates = [...Array(31)].map((_, i) => i + 1);

const selectedDays = ref<number[]>([]);

const minuteOptions = [
  {
    name: '1 секунда',
    key: '1s',
  },
  {
    name: '5 секунд',
    key: '5s',
  },
  {
    name: '10 секунд',
    key: '10s',
  },
  {
    name: '15 секунд',
    key: '15s',
  },
  {
    name: '30 секунд',
    key: '30s',
  },
  {
    name: '60 секунд',
    key: '60s',
  },
  {
    name: '1 минута',
    key: '1m',
  },
  {
    name: '5 минута',
    key: '5m',
  },
  {
    name: '10 минута',
    key: '10m',
  },
  {
    name: '15 минута',
    key: '15m',
  },
  {
    name: '30 минута',
    key: '30m',
  },
  {
    name: '60 минута',
    key: '60m',
  },
];

const types = [
  { name: 'Ежеминутно', key: 'minute' },
  { name: 'Ежедневно', key: 'day' },
  { name: 'Ежемесячно', key: 'month' },
  { name: 'Ежегодно', key: 'year' },
];

const days = [
  { name: 'Пн', key: 'mon' },
  { name: 'Вт', key: 'tue' },
  { name: 'Ср', key: 'wed' },
  { name: 'Чт', key: 'thu' },
  { name: 'Пт', key: 'fri' },
  { name: 'Сб', key: 'sut' },
  { name: 'Вс', key: 'sun' },
];
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
      <Form>
        <!-- Period Select -->
        <SelectButton
          v-model="selectedType"
          option-label="name"
          option-value="key"
          :options="types"
        />
        <!--  -->

        <div class="tw-pt-4">
          <!-- Period Select -->
          <SharedUILabel
            v-if="selectedType === 'minute'"
            :title="t('Длительность')"
          >
            <FloatLabel
              class="w-full md:w-56"
              variant="in"
            >
              <Select
                class="tw-w-full"
                option-label="name"
                option-value="code"
                :options="minuteOptions"
              />
            </FloatLabel>
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
          <div v-if="selectedType === 'month'">
            <!-- <FloatLabel variant="in">
              <MultiSelect
                class="w-full md:w-80"
                fluid
                :options="dates"
              />
              <label for="in_label">{{ t('Дни') }}</label>
            </FloatLabel> -->
            <SharedUIDayOfMonthSelect v-model="selectedDays" />
          </div>
          <!--  -->

          <!-- Date Select -->
          <div v-if="selectedType === 'year'">
            <FloatLabel variant="in">
              <DatePicker
                fluid
                :manual-input="false"
                selection-mode="multiple"
              />
              <label for="in_label">{{ t('Даты') }}</label>
            </FloatLabel>
          </div>
          <!--  -->
        </div>
        <div class="tw-flex tw-justify-end tw-pt-3">
          <Button :label="'Добавить Период'" />
        </div>
      </Form>
    </Dialog>
  </div>
</template>
