<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
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
