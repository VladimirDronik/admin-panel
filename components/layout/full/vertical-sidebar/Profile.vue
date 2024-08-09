<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import UserImage from '/images/users/avatar-1.jpg';

const { t } = useI18n();
const router = useRouter();
const storeAuth = useAuthStore();

const logout = async () => {
  await storeAuth.logoutApi();
  router.push({ name: 'login' });
};
</script>

<template>
  <v-sheet rounded="md" color="lightsecondary" class="ExtraBox px-4 py-3">
    <div class="d-flex align-center hide-menu">
      <v-avatar size="40">
        <img :src="UserImage" alt="Avatar" height="40" />
      </v-avatar>
      <div class="ml-4">
        <h4 class="mb-n1 text-h6 textPrimary tw-max-w-24 tw-truncate">
          Name
        </h4>
        <span class="text-subtitle-2 textSecondary">
          Developer
        </span>
      </div>
      <div class="ml-auto">
        <v-btn variant="text" icon roudned="md" color="primary" @click="logout">
          <PowerIcon />
          <v-tooltip activator="parent" location="top">
            {{ t('logout')}}
          </v-tooltip>
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<style lang="scss">
.ExtraBox {
    position: relative;
    overflow: hidden;
}
.line-height-none {
    line-height: normal;
}
</style>
