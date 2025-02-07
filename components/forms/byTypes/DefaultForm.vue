<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const dynamicForm = defineModel('dynamic-form');
</script>

<template>
  <div class="fallback">
    {{ t('devices.formNotFound') }}
  </div>
</template>

<style scoped>
.fallback {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}
</style>
