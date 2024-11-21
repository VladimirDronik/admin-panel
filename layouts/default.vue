<script setup lang="ts">
const open = ref(true);
</script>

<template>
  <div>
    <LayoutFullSidebar v-model:open="open" class="tw-z-40" />
    <div class="tw-pl-96" :class="{ '!tw-pl-20': !open }">
      <Card class="tw-sticky tw-top-0 tw-z-30 tw-h-full tw-max-h-28 !tw-rounded-none">
        <template #content>
          <div class="tw-align-center tw-flex tw-w-full tw-justify-between">
            <div>
              <Button
                @click="open = !open"
                size="small"
                severity="secondary"
                icon="pi pi-align-justify"
                text
                rounded
              />
            </div>
            <div class="tw-flex tw-items-center">
              <LayoutFullVerticalHeaderLanguageDD class="tw-mr-2" />
              <!-- Notification -->
              <LayoutFullVerticalHeaderNotificationDD class="tw-mr-2" />
              <!-- User Profile -->
              <!-- <LayoutFullVerticalHeaderProfileDD /> -->
            </div>
          </div>
        </template>
      </Card>
      <slot />
    </div>

    <Toast :baseZIndex="99999" />
  </div>
</template>
