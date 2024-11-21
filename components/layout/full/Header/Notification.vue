<script setup lang="ts">
import { BellRingingIcon } from 'vue-tabler-icons';
</script>
<template>
  <Button
    icon="pi"
    text
    class="custom-hover-primary text-muted tw-relative tw-top-0.5 !tw-text-black"
  >
    <BellRingingIcon stroke-width="1.5" size="22" />
    <Badge value="2" class="tw-absolute tw-right-1.5 tw-top-0" />
  </Button>
</template>
