<script lang="ts" setup>

const open = defineModel<boolean>('open', {
  required: true,
});

</script>

<template>
  <div class="tw-pl-96" :class="{ '!tw-pl-20': !open }">
    <Card class="tw-sticky tw-top-0 tw-z-30 tw-h-full tw-max-h-28 !tw-rounded-none tw-border-b !tw-shadow-none">
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
            <LayoutFullHeaderLanguage class="tw-mr-2" />
            <!-- Notification -->
            <LayoutFullHeaderNotification class="tw-mr-2" />
            <!-- User Profile -->
            <!-- <LayoutFullHeaderProfile /> -->
          </div>
        </div>
      </template>
    </Card>
    <slot />
  </div>
</template>

<style>

</style>
