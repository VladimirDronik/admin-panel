<script lang="ts" setup>
import { periodInText } from '@/helpers/scheduler';

const emit = defineEmits<{
  (e: 'change'): void
}>();

const period = defineModel<string[]>({
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
      >
        <template #body="{ data }">
          Переодично
        </template>
      </Column>
      <Column
        field="value"
        header="Описание"
      >
        <template #body="{ data }">
          {{ periodInText(data) }}
        </template>
      </Column>
      <Column
        field="actions"
        header="Действия"
        style="width: 110px;"
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
      @change="emit('change')"
    />
  </div>
</template>

