<script lang="ts" setup>
import _ from 'lodash';

const storeDevices = useDevicesStore();

</script>

<template>
  <div>
    <div v-for="item in storeDevices.ports" :key="item.id">
      <h3 class="tw-mb-2 tw-text-lg">
        {{ _.startCase(_.toLower(item.group)) }}
      </h3>
      <DataTable :value="item.ports" class="tw-mb-4 tw-overflow-hidden tw-rounded-md tw-border">
        <Column field="number" style="width: 50px; max-width: 50px">
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
        <Column field="mode" style="width: 70px; max-width: 70px">
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
        <Column field="objects" style=" width: 100px; max-width: 100px">
          <template #header>
            <p>
              Object
            </p>
          </template>
          <template #body="slotProps">
            <p v-for="object in slotProps.data.objects" :key="object" class=" tw-max-w-56 tw-truncate">
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
