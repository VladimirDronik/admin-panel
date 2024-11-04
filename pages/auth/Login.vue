<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Declare Options
definePageMeta({
  layout: 'blank',
});

// Composables
const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.login')),
});

</script>
<template>
  <div class="authentication">
    <v-container fluid class="pa-3">
      <v-row class="h-100vh d-flex justify-center align-center">
        <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
          <v-card rounded="md" elevation="10" class="px-sm-1 px-0 withbg mx-auto" max-width="500">
            <v-card-item class="pa-sm-8">
              <div class="d-flex justify-center py-4">
                <LayoutFullLogo />
              </div>
              <div class="text-body-1 text-muted text-center mb-3">
                {{ t('auth.title') }}
              </div>
              <AuthLoginForm />
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
