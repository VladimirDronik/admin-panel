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
  <div class="tw-align-center tw-h-100vh tw-flex tw-justify-center tw-text-center">
    <div>
      <img src="/images/background/errorimg.svg" width="500" alt="404" />
      <h1 class="tw-pt-3 tw-text-3xl tw-font-semibold">
        {{ t('error.oops') }}
      </h1>
      <h4 class="tw-my-8 tw-text-lg">
        {{ t('error.errorPageText') }}
      </h4>
      <NuxtLink to="/devices">
        <Button flat color="tw-primary" class="tw-mb-4" to="/">
          {{ t('error.goBack') }}
        </Button>
      </NuxtLink>
    </div>
  </div>
</template>
