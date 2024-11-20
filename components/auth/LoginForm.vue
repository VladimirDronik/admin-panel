<script setup lang="ts">
// Builtin modules
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Composable modules
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';

// Composables
const { t } = useI18n();
const router = useRouter();
const store = useAuthStore();
const { updateData } = useUtils();

// Variables
const loading = ref(true);

const form = ref({
  login: 'web',
  password: '12345',
});

const login = async () => {
  loading.value = true;
  updateData({
    update: async () => {
      await store.loginApi(form.value);
    },
    success: () => {
      router.push({ name: 'general' });
    },
    errorMessage: 'Ошибка входа',
    disableSuccessMessage: true,
  });
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
