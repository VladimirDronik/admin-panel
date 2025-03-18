<script lang="ts" setup>
type PeriodType = 'minute' | 'day' | 'month' | 'year'
const period = defineModel<{value: string, type: PeriodType}[]>({
  required: true,
});

const { edit = false } = defineProps<{
  edit?: boolean;
}>();

const dialogPeriod = ref(false);
</script>

<template>
  <div>
    <BaseTable
      class="tw-mb-3"
      :items="period"
    >
      <Column
        field="type"
        header="Тип"
      />
      <Column
        field="value"
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
    <SchedulerDialogPeriod
      v-model:dialog="dialogPeriod"
      v-model:period="period"
      :edit
    />
  </div>
</template>

