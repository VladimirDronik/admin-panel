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
    router.push({ name: 'devices' });
  } catch (error: any) {
    console.log(error);
  }
  loading.value = false;
};
</script>

<template>
  <div>
    <SharedUILabel
      :title="t('auth.login')"
    >
      <InputText
        v-model="form.login"
        class="tw-mb-3 tw-w-full"
      />
    </SharedUILabel>
    <SharedUILabel
      :title="t('auth.password')"
    >
      <InputText
        v-model="form.password"
        class="tw-mb-3 tw-w-full"
      />
    </SharedUILabel>
    <Button
      @click="login"
      :loading="!loading"
      class="tw-w-full"
    >
      {{ t('auth.signIn') }}
    </Button>
  </div>
</template>
