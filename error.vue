<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Page title
const { t } = useI18n();

const title = ref('404 Page Not Found');
useHead({
  meta: [{ content: title }],
  title: '404 Page Not Found',
});
</script>
<template>
  <div class="d-flex justify-center align-center text-center h-100vh">
    <div>
      <img src="/images/background/errorimg.svg" width="500" alt="404" />
      <h1 class="text-h1 pt-3">
        {{ t('error.oops') }}
      </h1>
      <h4 class="text-h4 my-8">
        {{ t('error.errorPageText') }}
      </h4>
      <NuxtLink to="/devices">
        <Button flat color="primary" class="mb-4" to="/">
          {{ t('error.goBack') }}
        </Button>
      </NuxtLink>
    </div>
  </div>
</template>
