<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { Menu2Icon } from 'vue-tabler-icons';
import { useDisplay } from 'vuetify';
import sidebarItems from '@/components/layout/full/vertical-sidebar/sidebarItem';

const { mdAndUp } = useDisplay();

const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
</script>

<template>
  <!------Sidebar-------->
  <v-navigation-drawer
    v-model="sDrawer"
    :mobile-breakpoint="960"
    width="270"
    class="leftSidebar mini-sidebar"
    elevation="0"
    rail-width="75"
    app
    :rail="mdAndUp"
    expand-on-hover
  >
    <!---Logo part -->
    <div class="pa-5" v-if="!mdAndUp">
      <LayoutFullLogo />
    </div>
    <div class="pa-5" v-else>
      <LayoutFullLogoRtlLogo />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <div>
      <perfect-scrollbar class="scrollnavbar">
        <v-list class="pa-6">
          <!---Menu Loop -->
          <template v-for="(item, i) in sidebarMenu">
              <!---Item Sub Header -->
              <LayoutFullVerticalSidebarNavGroup :item="item" v-if="item.header" :key="item.title" />
              <!---If Has Child -->
              <LayoutFullVerticalSidebarNavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
              <!---Single Item-->
              <LayoutFullVerticalSidebarNavItem :item="item" v-else class="leftPadding" />
              <!---End Single Item-->
          </template>
        </v-list>
      </perfect-scrollbar>
    </div>
  </v-navigation-drawer>
  <!------Header-------->
  <v-app-bar
    height="70"
    elevation="10"
  >
    <div class="d-flex align-center justify-space-between w-100">
      <div>
        <v-btn
          v-if="!mdAndUp"
          size="small"
          class=" ms-md-3 ms-sm-5 text-muted ms-3"
          variant="flat"
          icon
          @click="sDrawer = !sDrawer"
        >
          <Menu2Icon
            size="20"
            stroke-width="1.5"
          />
        </v-btn>
      </div>
      <div>
        <LayoutFullVerticalHeaderLanguageDD/>
        <!-- Notification -->
        <LayoutFullVerticalHeaderNotificationDD />
        <!-- User Profile -->
        <LayoutFullVerticalHeaderProfileDD />
      </div>
    </div>
  </v-app-bar>
</template>
