<script setup lang="ts">
// Builtin modules
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Form } from '@primevue/forms';
// Static Data modules
import { auth } from '~/utils/endpoints';
// Types modules
import { loginSchema, type loginData } from '~/types/UserTypes';
import type { Request } from '~/types/StoreTypes';

definePageMeta({
  layout: 'blank',
});

// Composables
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const storeUser = useUserStore();

useHead({
  titleTemplate: computed(() => t('pages.login')),
});

const {
  params,
  statusLogin,
  executeLogin,
} = await useLogin();

async function useLogin() {
  const params = ref({
    login: import.meta.env.VITE_LOGIN_DEV ?? '',
    password: import.meta.env.VITE_PASSWORD_DEV ?? '',
  });

  // Methods
  const success = (response: Request<loginData>) => {
    if (response?.response.api_access_token) {
      storeUser.localState.token = response.response.api_access_token;
      router.push({ name: 'general' });
    } else {
      error();
    }
  };

  const error = () => {
    toast.add({
      severity: 'error',
      summary: 'Ошибка входа',
      life: 5000,
    });
  };

  const {
    data: dataLogin,
    status: statusLogin,
    execute: executeLogin,
  } = await useAPI <Request<loginData>>(
    auth,
    {
      params,
      immediate: false,
      success,
      error,
      headers: {
        'api-key': 'c041d36e381a835afce48c91686370c8',
      },
      watch: false,
    },
    loginSchema,
  );

  return {
    params,
    dataLogin,
    statusLogin,
    executeLogin,
  };
}

</script>
<template>
  <div class="auth-screen tw-h-screen">
    <Toast :base-z-index="99999" />
    <div
      class="tw-flex tw-items-center tw-justify-center"
      style="height: 85vh"
    >
      <div
        class="bg-base tw-rounded-lg tw-bg-white tw-p-5"
        style="width: 500px;"
      >
        <div class="tw-flex tw-justify-center tw-py-4">
          <Logo />
        </div>
        <div class="tw-mb-1 tw-text-center tw-text-lg">
          {{ t('auth.title') }}
        </div>
        <p class="tw-text-center tw-text-sm tw-text-gray-500">
          {{ storeUser.version }}
        </p>
        <Form @submit="executeLogin()">
          <SharedUILabel
            class="tw-mb-3"
            colomn
            :title="t('auth.login')"
          >
            <InputText
              v-model="params.login"
              class=" tw-w-full"
            />
          </SharedUILabel>
          <SharedUILabel
            class="tw-mb-3"
            colomn
            :title="t('auth.password')"
          >
            <InputText
              v-model="params.password"
              class="tw-w-full"
              type="password"
            />
          </SharedUILabel>
          <Button
            class="tw-w-full"
            :label="t('auth.signIn')"
            :loading="statusLogin === 'pending'"
            type="submit"
          />
        </Form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-screen {
  background-color: #EAF8F5;

  .p-dark & {
    background-color: var(--p-surface-950);
  }
}
</style>
