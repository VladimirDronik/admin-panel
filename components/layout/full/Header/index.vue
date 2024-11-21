<script lang="ts" setup>

const open = defineModel<boolean>('open', {
  required: true,
});

</script>

<template>
  <div class="tw-pl-96" :class="{ '!tw-pl-20': !open }">
    <Card class="tw-sticky tw-top-0 tw-z-30 tw-h-full tw-max-h-28 !tw-rounded-none tw-border-b !tw-shadow-none">
      <template #content>
        <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
          <Button
            @click="open = !open"
            size="small"
            severity="secondary"
            icon="pi pi-align-justify"
            text
            rounded
          />
          <div class="tw-flex tw-items-center">
            <LayoutFullHeaderLanguage class="tw-mr-2" />

            <LayoutFullHeaderNotification class="tw-mr-2" />

            <LayoutFullHeaderProfile />
          </div>
        </div>
      </template>
    </Card>
    <slot />
  </div>
</template>

<style>

</style>
