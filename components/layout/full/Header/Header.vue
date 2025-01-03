<script lang="ts" setup>
// Declare Options
const open = defineModel<boolean>('open', {
  required: true,
});

const darkTheme = ref(false)

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('p-dark');
  darkTheme.value = !darkTheme.value
}
</script>

<template>
  <div
    class="border-base bg-base tw-sticky tw-top-0 tw-z-30 tw-flex tw-h-20 tw-items-center !tw-rounded-none tw-border-b tw-bg-white tw-px-6 !tw-shadow-none"
  >
    <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
      <Button
        class="tw-aspect-square tw-h-9 tw-w-9"
        icon="pi pi-align-justify"
        size="small"
        text
        @click="open = !open"
      />
      <div class="tw-flex tw-items-center">
        <Button
          class="tw-mr-2 tw-aspect-square"
          :icon="darkTheme ? 'pi pi-moon' : 'pi pi-sun'"
          size="small"
          text
          @click="toggleDarkMode()"
        />
        <LayoutFullHeaderLanguage class="tw-mr-2" />

        <LayoutFullHeaderNotification class="tw-mr-2" />

        <LayoutFullHeaderProfile />
      </div>
    </div>
  </div>
</template>
