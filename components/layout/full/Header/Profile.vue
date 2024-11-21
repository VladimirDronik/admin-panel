<script setup lang="ts">
import { MailIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/stores/auth';
import proUser1 from '~/assets/images/icon-account.svg';
import proUser3 from '~/assets/images/icon-tasks.svg';

// Composables
const authStore = useAuthStore();

// Variables
const profileDD = [
  {
    avatar: proUser1,
    title: 'Мой Аккаунт',
    subtitle: 'Настройка личных данных',
    href: '/apps/user/profile',
  },
  {
    avatar: proUser3,
    title: 'Настройки',
    subtitle: 'Сеть, пользователи, MRTT, VPN',
    href: '/',
  },
];

const menu = ref();

// Methods
const toggle = (event: any) => {
  menu.value.toggle(event);
};

</script>

<template>
  <div>
    <Button
      @click="toggle"
      text
      rounded
      icon="pi"
    >
      <img
        class="tw-rounded-full"
        src="~/assets/images/user-1.jpg"
        width="35"
        alt="Profile"
      />
    </Button>

    <Popover ref="menu" class="profile">
      <Card class="tw-w-96 !tw-shadow-none">
        <template #content>
          <div class="tw-px-2">
            <h6 class="tw-text-xl">Профиль пользователя</h6>
            <div class="tw-mt-4 tw-flex tw-items-center tw-pb-4">
              <img
                src="~/assets/images/user-1.jpg"
                width="80"
                alt="Profile"
                class="tw-rounded-full"
              />
              <div class="tw-ml-3">
                <h6 class="tw-text-xl tw-font-semibold">Никита Гурьянов</h6>
                <span>
                  ул. Гоголя, 09
                </span>
                <div class="tw-mt-1 tw-flex tw-items-center">
                  <MailIcon size="18" stroke-width="1.5" />
                  <span class=" tw-ml-2">
                    ID: 00000000
                  </span>
                </div>
              </div>
            </div>
            <Divider />
          </div>
          <ScrollPanel style="height: calc(100vh - 240px); max-height: 160px">
            <div class="tw-px-6">
              <div
                v-for="item in profileDD"
                :key="item.title"
                class="tw-flex tw-py-4"
                :to="item.href"
              >
                <img
                  :src="item.avatar"
                  width="24"
                  height="24"
                  :alt="item.avatar"
                  class="tw-mr-3 tw-max-w-6"
                />
                <div>
                  <h6 class="tw-mb-1 tw-font-bold">
                    {{ item.title }}
                  </h6>
                  <p class="font-weight-regular">
                    {{ item.subtitle }}
                  </p>
                </div>
              </div>
            </div>
          </ScrollPanel>
          <div class="tw-px-2 tw-py-4 tw-text-center">
            <Button
              @click="authStore.logoutApi()"
              class="tw-w-full"
              color="primary"
              size="small"
              outlined
            >
              Logout
            </Button>
          </div>
        </template>
      </Card>
    </Popover>
  </div>
</template>

<style>
.profile .p-popover-content {
  background: none !important;
}
</style>
