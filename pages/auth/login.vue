<script setup lang="ts">
// Builtin modules
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
// Static Data modules
import { auth } from '~/utils/endpoints';
// Types modules
import { loginSchema, type loginData } from '~/types/UserTypes';
import type { APIData } from '~/types/StoreTypes';

// Types
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

useHead({
  titleTemplate: computed(() => t('pages.login')),
});

// Declare Options
definePageMeta({
  layout: 'blank',
});

// Variables
const user = ref<APIData<any> | null>();

const params = ref({
  login: 'web',
  password: '12345',
});

// Methods
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
    },
    loginSchema,
  );
  
  user.value = data as APIData<loginData>;
})

</script>
<template>
  <div
    v-if="user"
    class="auth-screen tw-h-screen"
  >
    <Toast :base-z-index="99999" />
    <div
      class="tw-flex tw-items-center tw-justify-center"
      style="height: 85vh"
    >
      <div
        class="tw-rounded-lg tw-bg-white tw-p-5"
        style="width: 500px;"
      >
        <div class="tw-flex tw-justify-center tw-py-4">
          <Logo />
        </div>
        <div class="tw-mb-3 tw-text-center tw-text-lg">
          {{ t('auth.title') }}
        </div>
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
            :loading="!user.pending"
            @click="user.refresh()"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-screen {
  background-color: #EAF8F5;
}
</style>
