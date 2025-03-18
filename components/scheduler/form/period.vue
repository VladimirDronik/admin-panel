<script lang="ts" setup>
const items = defineModel<any[]>();

const dialogPeriod = ref(false);
</script>

<template>
  <div>
    <BaseTable
      class="tw-mb-3"
      :value="items"
    >
      <Column
        field="title"
        header="Тип периода"
      />
      <Column
        field="description"
        header="Описание"
      />
      <Column
        field="actions"
        header="Действия"
        style="width: 150px;"
      >
        <template #body="{ data }">
          <Button
            aria-label="Cancel"
            class="tw-mr-2"
            icon="pi pi-pencil"
            rounded
            severity="info"
            @click="dialogPeriod = true"
          />
          <Button
            aria-label="Cancel"
            icon="pi pi-trash"
            rounded
            severity="danger"
          />
        </template>
      </Column>
    </BaseTable>
    <SchedulerDialogPeriod v-model:dialog="dialogPeriod" />
  </div>
</template>

