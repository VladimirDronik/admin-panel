<script lang="ts" setup>
import _ from 'lodash';

const storeDevices = useDevicesStore();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const data = ref({
  in: {
    id: 1,
    title: 'Входы (in)',
    items: [
      {
        number: 1, type: 'IN', mode: 'P&R', object: 'Геркон на окне', colorType: 'success', colorMode: 'warn',
      },
      {
        number: 2, type: 'DSEN', mode: '1W', object: 'Датчик температуры', colorType: 'warn', colorMode: 'warn',
      },
      {
        number: 3, type: 'I2C', mode: 'SDA', object: 'Датчик влажности', colorType: 'warn', colorMode: 'warn',
      },
    ],
  },
  out: {
    id: 2,
    title: 'Выходы (out)',
    items: [
      {
        number: 4, type: 'OUT', mode: 'SW', object: 'Светильник над столом', colorType: 'danger', colorMode: 'contrast',
      },
      {
        number: 5, type: 'OUT', mode: 'SWLINK', object: 'Насос', colorType: 'danger', colorMode: 'contrast',
      },
    ],
  },
  other: {
    id: 3,
    title: 'Цифровые (other)',
    items: [
      {
        number: 6, type: 'ADC', mode: 'NORM', object: 'Уличный датчик', colorType: 'info', colorMode: 'danger',
      },
    ],
  },
});

watch(() => props.id, () => {
  storeDevices.getPortsApi(props.id);
});

</script>

<template>
  <div>
    <div v-for="item in storeDevices.ports" :key="item.id">
      <h3 class="tw-mb-2 tw-text-lg">
        {{ _.startCase(_.toLower(item.group)) }}
      </h3>
      <DataTable :value="item.ports" class="tw-mb-4 tw-overflow-hidden tw-rounded-md tw-border">
        <Column field="number" style="width: 50px">
          <template #header>
            <p>
              №
            </p>
          </template>
        </Column>
        <Column field="type" style="width: 70px">
          <template #header>
            <p>
              Type
            </p>
          </template>
          <template #body="slotProps">
            <Tag severity="info">
              <p class="tw-font-normal">{{ slotProps.data.type }}</p>
            </Tag>
          </template>
        </Column>
        <Column field="mode" style="width: 70px">
          <template #header>
            <p>
              Mode
            </p>
          </template>
          <template #body="slotProps">
            <Tag severity="warn">
              <p class="tw-font-normal">{{ slotProps.data.mode || '-' }}</p>
            </Tag>
          </template>
        </Column>
        <Column field="objects" style=" width: 100px">
          <template #header>
            <p>
              Object
            </p>
          </template>
          <template #body="slotProps">
            <p v-for="object in slotProps.data.objects" :key="object" class="tw-truncate">
              {{ object }}
            </p>
            <p v-if="!slotProps.data.objects">
              -
            </p>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style>

</style>
