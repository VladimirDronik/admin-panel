<script lang="ts" setup>

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

</script>

<template>
  <div>
    <div v-for="item in data" :key="item.id">
      <h3 class="tw-mb-2 tw-text-lg">
        {{ item.title }}
      </h3>
      <DataTable :value="item.items" tableStyle="min-width: 50rem" class="tw-mb-4 tw-overflow-hidden tw-rounded-md tw-border">
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
            <Tag :value="slotProps.data.type" :severity="slotProps.data.colorType">
              <p class="text-base tw-font-normal">{{ slotProps.data.mode }}</p>
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
            <Tag :severity="slotProps.data.colorMode">
              <p class="text-base tw-font-normal">{{ slotProps.data.mode }}</p>
            </Tag>
          </template>
        </Column>
        <Column field="object" style=" width: 100px">
          <template #header>
            <p>
              Object
            </p>
          </template>
          <template #body="slotProps">
            <p class="tw-truncate">{{ slotProps.data.object }}</p>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style>

</style>
