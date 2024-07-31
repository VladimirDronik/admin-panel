<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { Menu2Icon } from 'vue-tabler-icons';
import sidebarItems from '@/components/layout/full/vertical-sidebar/sidebarItem';

const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
</script>

<template>
  <!------Sidebar-------->
  <v-navigation-drawer
    v-model="sDrawer"
    class="leftSidebar"
    elevation="0"
    app
    left
  >
    <!---Logo part -->
    <div class="pa-5">
      <LayoutFullLogo />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <div>
      <perfect-scrollbar class="scrollnavbar">
        <v-list class="pa-6">
          <!---Menu Loop -->
          <template v-for="item in sidebarMenu">
            <!---Item Sub Header -->
            <LayoutFullVerticalSidebarNavGroup
              v-if="item.header"
              :key="item.title"
              :item="item"
            />

            <!---Single Item-->
            <LayoutFullVerticalSidebarNavItem
              v-else
              :key="item.to"
              :item="item"
              class="leftPadding"
            />
            <!---End Single Item-->
          </template>
        </v-list>
        <div class="pa-6 userbottom">
          <LayoutFullVerticalSidebarProfile/>
        </div>
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
          size="small"
          class="hidden-lg-and-up ms-md-3 ms-sm-5 text-muted ms-3"
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
