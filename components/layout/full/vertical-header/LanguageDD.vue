<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
// Images
import England from '@/assets/images/flag/icon-flag-en.svg';
import Russia from '@/assets/images/flag/icon-flag-ru.svg';

// Composables
const { locale } = useI18n({ useScope: 'global' });

// Variables
const languages = [
  {
    title: 'English', subtext: 'UK', value: 'en', avatar: England,
  },
  {
    title: 'Русский', subtext: 'Russia', value: 'ru', avatar: Russia,
  },
];

// Methods
const selectLanguage = (item: string) => {
  locale.value = item;
};

</script>
<template>
  <v-menu
    :close-on-content-click="false"
    location="bottom"
  >
    <!-- Selected Language -->
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        color="primary"
        icon
      >
        <v-avatar size="22">
          <div
            v-for="language in languages"
            :key="language.value"
          >
            <img
              v-if="$i18n.locale === language.value"
              :src="language.avatar"
              :alt="$i18n.locale"
              class="obj-cover tw-h-6 tw-w-6"
            />
          </div>
        </v-avatar>
      </v-btn>
    </template>
    <!--  -->

    <!-- Menu -->
    <v-sheet
      rounded="md"
      width="200"
      elevation="10"
    >
      <v-list class="theme-list">
        <v-list-item
          v-for="(item, index) in languages"
          @click="selectLanguage(item.value)"
          :key="index"
          :active="$i18n.locale === item.value"
          color="primary"
          class="d-flex align-center"
        >
          <template v-slot:prepend>
            <v-avatar size="22">
              <img
                :src="item.avatar"
                :alt="item.avatar"
                class="obj-cover tw-h-6 tw-w-6"
              />
            </v-avatar>
          </template>
          <v-list-item-title class="text-subtitle-1 font-weight-regular">
            {{ item.title }}
            <span class="text-disabled text-subtitle-1 pl-2">
              ({{ item.subtext }})
            </span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-sheet>
    <!--  -->
  </v-menu>
</template>
