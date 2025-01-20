<script setup lang="ts">
// Builtin modules
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core'
// Static Data modules
import { auth } from '~/utils/endpoints';
// Types modules
import { loginSchema, type loginData } from '~/types/UserTypes';
import type { APIData, Request } from '~/types/StoreTypes';

// Composables
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const storeUser = useUserStore();
const localState = useStorage('touch-on', {
  token: '',
  openSidebar: true,
  language: 'ru',
})

useHead({
  titleTemplate: computed(() => t('pages.login')),
});

// Declare Options
definePageMeta({
  layout: 'blank',
});

// Variables
const apiUser = ref<APIData<loginData> | null>();

const params = ref({
  login: import.meta.env.VITE_LOGIN_DEV ?? '',
  password: import.meta.env.VITE_PASSWORD_DEV ?? '',
});

console.log(import.meta.env)

// Methods
const success = (response: Request<loginData>) => {
  if (response?.response.api_access_token) {
    localState.value.token = response.response.api_access_token
    router.push({ name: 'general' });
  } else {
    error()
  }
};

const error = () => {
  toast.add({
    severity: 'error',
    summary: 'Ошибка входа',
    life: 5000,
  });
};

// Hooks
onBeforeMount(async () => {
  const data: unknown = await useAPI(
    auth,
    {
      params,
      immediate: false,
      success,
      error,
      headers: {
        'api-key': 'c041d36e381a835afce48c91686370c8',
      },
      watch: false
    },
    loginSchema,
  );

  apiUser.value = data as APIData<loginData>;
});

</script>
<template>
  <div
    v-if="apiUser"
    class="auth-screen tw-h-screen"
  >
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
        <form>
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
            />
          </SharedUILabel>
          <Button
            class="tw-w-full"
            :label="t('auth.signIn')"
            :loading="apiUser.pending && apiUser.status !== 'idle'"
            @click="apiUser.refresh()"
          />
        </form>
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