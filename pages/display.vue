<script lang="ts" setup>

const page = ref(1);
const filters = ref([]);

</script>

<template>
  <div>
    <BaseBreadcrumb title="pages.display" />
    <BaseTable
      :total="0"
      :perPage="10"
      :headers="[]"
      :items="[]"
      v-model:filters="filters"
      v-model:page="page"
    />
  </div>
</template>

<style>

</style>
