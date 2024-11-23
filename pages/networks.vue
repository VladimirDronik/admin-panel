<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.networkSettings')),
});

</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.networkSettings" />
  </SharedUIPanel>
</template>

<style>

</style>
