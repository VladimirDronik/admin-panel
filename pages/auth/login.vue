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

// Declare Options
definePageMeta({
  layout: 'blank',
});

useHead({
  titleTemplate: computed(() => t('pages.login')),
});

// Variables
const loading = ref(true);

const form = ref({
  login: 'web',
  password: '12345',
});

// Methods
const login = async () => {
  loading.value = true;
  await updateData({
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
  <div class="auth-screen tw-h-screen">
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
