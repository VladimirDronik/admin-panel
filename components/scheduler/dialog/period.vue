<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const dialog = defineModel<boolean>('dialog', {
  required: true,
});

const selectedType = ref('minute');

const selectedDay = ref([]);

const dates = [...Array(31)].map((_, i) => i + 1);

const minuteOptions = [
  '1 минута',
  '5 минут',
  '10 минут',
  '15 минут',
  '30 минут',
  '60 минут',
];

const types = [
  { name: 'Ежеминутно', key: 'minute' },
  { name: 'Ежедневно', key: 'day' },
  { name: 'Ежемесячно', key: 'month' },
  { name: 'Ежегодно', key: 'year' },
];

const days = [
  { name: 'Пн', key: 'minute' },
  { name: 'Вт', key: 'day' },
  { name: 'Ср', key: 'month' },
  { name: 'Чт', key: 'year' },
  { name: 'Пт', key: 'year' },
  { name: 'Сб', key: 'year' },
  { name: 'Вс', key: 'year' },
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
      :style="{ 'max-width': '1200px', width: '100%', margin: '0 20px' }"
    >
      <Form>
        <SharedUILabel
          colomn
          :title="'Тип'"
        >
          <div class="tw-flex tw-gap-2 tw-pt-2">
            <div
              v-for="type in types"
              :key="type.key"
              class="tw-flex tw-items-center tw-gap-2"
            >
              <RadioButton
                v-model="selectedType"
                :input-id="type.key"
                name="dynamic"
                :value="type.key"
              />
              <label :for="type.key">{{ type.name }}</label>
            </div>
          </div>
        </SharedUILabel>
        <div class="tw-pt-4">
          <SharedUILabel v-if="selectedType === 'minute'">
            <FloatLabel
              class="w-full md:w-56"
              variant="in"
            >
              <Select
                class="tw-w-full"
                :options="minuteOptions"
              />
              <label for="in_label">Длительность</label>
            </FloatLabel>
          </SharedUILabel>
          <div v-if="selectedType === 'day'">
            <p>
              Время
            </p>
            <DatePicker
              id="datepicker-timeonly"
              fluid
              time-only
            />
            <p class="tw-pt-4">
              Дни Недели
            </p>
            <div class="tw-flex tw-gap-3">
              <div
                v-for="day of days"
                :key="day.key"
                class="tw-flex tw-items-center tw-gap-2"
              >
                <Checkbox
                  v-model="selectedDay"
                  :input-id="day.key"
                  name="day"
                  :value="day.key"
                />
                <label :for="day.key">{{ day.name }}</label>
              </div>
            </div>
          </div>
          <div v-if="selectedType === 'month'">
            <p>
              Даты Месяца
            </p>
            <MultiSelect
              class="w-full md:w-80"
              fluid
              :max-selected-labels="3"
              :options="dates"
              placeholder="Даты"
            />
          </div>
          <div v-if="selectedType === 'year'">
            <p>
              Даты
            </p>
            <DatePicker
              class="tw-w-96"
              :manual-input="false"
              selection-mode="multiple"
            />
          </div>
        </div>
        <div class="tw-flex tw-justify-end tw-pt-3">
          <Button :label="'Добавить Период'" />
        </div>
      </Form>
    </Dialog>
  </div>
</template>
