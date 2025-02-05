<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { useUserStore } from '~/stores/user';
// Images
import England from '@/assets/images/flag/icon-flag-en.svg';
import Russia from '@/assets/images/flag/icon-flag-ru.svg';

// Composables
const userStore = useUserStore();
const { locale } = useI18n({ useScope: 'global' });
const localState = useStorage('touch-on', {
  token: '',
  openSidebar: true,
  language: 'ru',
});

// Variables
const languages = [
  {
    title: 'English', subtext: 'UK', value: 'en', avatar: England,
  },
  {
    title: 'Русский', subtext: 'Russia', value: 'ru', avatar: Russia,
  },
];

const menu = ref();

const toggle = (event: any) => {
  menu.value.toggle(event);
};

// Methods
const selectLanguage = (item: string) => {
  locale.value = item;
};

watch(locale, (newValue) => localState.value.language = newValue);

// Hooks
onBeforeMount(() => {
  selectLanguage(localState.value.language);
});

</script>

<template>
  <div>
    <Button
      color="primary"
      icon="pi"
      text
      @click="toggle"
    >
      <div size="22">
        <div
          v-for="language in languages"
          :key="language.value"
        >
          <img
            v-if="$i18n.locale === language.value"
            :alt="$i18n.locale"
            class="tw-size-6 tw-rounded-full tw-object-cover"
            :src="language.avatar"
          >
        </div>
      </div>
    </Button>

    <Popover ref="menu">
      <div class="theme-list">
        <button
          v-for="(item, index) in languages"
          :key="index"
          :active="$i18n.locale === item.value"
          class="tw-align-center tw-flex tw-min-w-44 tw-p-3"
          color="primary"
          type="button"
          @click="selectLanguage(item.value)"
        >
          <img
            :alt="item.avatar"
            class="tw-mr-2 tw-size-6 tw-rounded-full tw-object-cover"
            :src="item.avatar"
          >
          <div class="text-subtitle-1 font-weight-regular">
            {{ item.title }}
          </div>
        </button>
      </div>
    </Popover>
  </div>
</template>
