<script setup lang="ts">
// Builtin modules
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Composable modules
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';

// Composables
const router = useRouter();
const store = useAuthStore();
const { t } = useI18n();

// Variables
const loading = ref(true);

const form = ref({
  login: 'web',
  password: '12345',
});

const login = async () => {
  loading.value = true;
  try {
    await store.loginApi(form.value);
    router.push({ name: 'Devices' });
  } catch (error: any) {
    console.log(error);
  }
  loading.value = false;
};
</script>

<template>
  <v-row class="d-flex mb-3">
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">
        {{ t('auth.login') }}
      </v-label>
      <v-text-field v-model="form.login" variant="outlined" hide-details color="primary" />
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">
        {{ t('auth.password') }}
      </v-label>
      <v-text-field v-model="form.password" variant="outlined" type="password" hide-details color="primary" />
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-btn
        @click="login"
        :loading="!loading"
        color="primary"
        size="large"
        block
        flat
      >
        {{ t('auth.signIn') }}
      </v-btn>
    </v-col>
  </v-row>
</template>
