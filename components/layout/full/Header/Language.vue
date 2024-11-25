<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
import { useUserStore } from '~/stores/user';
// Images
import England from '@/assets/images/flag/icon-flag-en.svg';
import Russia from '@/assets/images/flag/icon-flag-ru.svg';

const authStore = useUserStore();

// Composables
const { locale } = useI18n({ useScope: 'global' });

const menu = ref();

// Variables
const languages = [
  {
    title: 'English', subtext: 'UK', value: 'en', avatar: England,
  },
  {
    title: 'Русский', subtext: 'Russia', value: 'ru', avatar: Russia,
  },
];

const toggle = (event: any) => {
  menu.value.toggle(event);
};

// Methods
const selectLanguage = (item: string) => {
  locale.value = item;
};

selectLanguage(authStore.userLocal?.language ?? 'ru');

watch(locale, (newValue) => authStore.changeLanguage(newValue));

</script>

<template>
  <div>
    <Button
      @click="toggle"
      text
      color="primary"
      icon="pi"
    >
      <div size="22">
        <div
          v-for="language in languages"
          :key="language.value"
        >
          <img
            v-if="$i18n.locale === language.value"
            :src="language.avatar"
            :alt="$i18n.locale"
            class="tw-h-6 tw-w-6 tw-rounded-full tw-object-cover"
          />
        </div>
      </div>
    </Button>

    <Popover ref="menu">
      <div class="theme-list">
        <button
          v-for="(item, index) in languages"
          @click="selectLanguage(item.value)"
          :key="index"
          :active="$i18n.locale === item.value"
          color="primary"
          class="tw-align-center tw-flex tw-min-w-44 tw-p-3"
          type="button"
        >
          <img
            :src="item.avatar"
            :alt="item.avatar"
            class="tw-mr-2 tw-h-6 tw-w-6 tw-rounded-full tw-object-cover"
          />
          <div class="text-subtitle-1 font-weight-regular">
            {{ item.title }}
          </div>
        </button>
      </div>
    </Popover>
  </div>
</template>
