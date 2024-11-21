<script lang="ts" setup>

interface header {
  label: string;
  code: string;
}

defineProps<{
  items: any[],
  headers: header[],
}>();

</script>

<template>
  <div>
    <DataTable :value="items">
      <Column
        v-for="item in headers"
        :field="item.code"
        :header="item.label"
        :key="item.code"
      />
      <slot />
      <template #empty>
        <div class="tw-flex tw-justify-center">
          Нет данных
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style>

</style>
