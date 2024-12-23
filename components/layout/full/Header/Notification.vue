<script setup lang="ts">
import { BellRingingIcon } from 'vue-tabler-icons';
</script>
<template>
  <Button
    class="custom-hover-primary text-muted tw-relative tw-top-0.5 !tw-text-black"
    icon="pi"
    text
  >
    <BellRingingIcon
      size="22"
      stroke-width="1.5"
    />
    <Badge
      class="tw-absolute tw-right-1.5 tw-top-0"
      value="2"
    />
  </Button>
</template>
