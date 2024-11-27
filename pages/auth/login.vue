<script setup lang="ts">
// Builtin modules
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Composable modules
import { useI18n } from 'vue-i18n';
import { useUserStore } from '~/stores/user';
// Static Data
import { auth } from '~/staticData/endpoints';
// Types
import { loginSchema, type loginData } from '~/types/UserTypes';
import type { APIData } from '~/types/StoreTypes';

interface LocalData {
  token: string | null;
  openSidebar: boolean;
  language: string;
}

// Composables
const { t } = useI18n();
const router = useRouter();
const storeUser = useUserStore();
const toast = useToast();

// Declare Options
definePageMeta({
  layout: 'blank',
});

useHead({
  titleTemplate: computed(() => t('pages.login')),
});

// Variables
const loading = ref(true);

const user = ref<APIData<any> | null>();

const params = ref({
  login: 'web',
  password: '12345',
});

const success = (response: any) => {
  const localStorageData = localStorage.getItem(storeUser.localStorageName);
  const localData = (localStorageData ? JSON.parse(localStorageData) : null) as LocalData | null;
  if (localData) {
    localStorage.setItem(storeUser.localStorageName, JSON.stringify({
      ...localData,
      token: response.response.api_access_token,
    }));
    storeUser.userLocal = {
      ...localData,
      token: response.response.api_access_token,
    };
  } else {
    localStorage.setItem(storeUser.localStorageName, JSON.stringify({
      token: response.response.api_access_token,
      openSidebar: true,
      language: 'ru',
    }));
    storeUser.userLocal = {
      token: response.response.api_access_token,
      openSidebar: true,
      language: 'ru',
    };
  }
  router.push({ name: 'general' });
};

const data: unknown = await useAPI(
  auth,
  {
    params,
    immediate: false,
    success,
    error: () => {
      toast.add({
        severity: 'error',
        summary: 'Ошибка входа',
        life: 5000,
      });
    },
  },
  loginSchema,
);

user.value = data as APIData<loginData>;

</script>
<template>
  <div v-if="user" class="auth-screen tw-h-screen">
    <Toast :baseZIndex="99999" />
    <div style="height: 85vh" class="tw-flex tw-items-center tw-justify-center">
      <div style="width: 500px;" class="tw-rounded-lg tw-bg-white tw-p-5">
        <div class="tw-flex tw-justify-center tw-py-4">
          <Logo />
        </div>
        <div class="tw-mb-3 tw-text-center tw-text-lg">
          {{ t('auth.title') }}
        </div>
        <form>
          <SharedUILabel
            :title="t('auth.login')"
          >
            <InputText
              v-model="params.login"
              class="tw-mb-3 tw-w-full"
            />
          </SharedUILabel>
          <SharedUILabel
            :title="t('auth.password')"
          >
            <InputText
              v-model="params.password"
              class="tw-mb-3 tw-w-full"
            />
          </SharedUILabel>
          <Button
            @click="user.refresh()"
            :loading="!loading"
            class="tw-w-full"
          >
            {{ t('auth.signIn') }}
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.auth-screen {

  background-color: #EAF8F5;
}
</style>
