<script setup lang="ts">
import LogoLightRtl from './LogoLightRtl.vue';
import LogoDarkRtl from './LogoDarkRtl.vue';

const dark = ref(false);

</script>
<template>
  <div class="tw-flex tw-justify-center">
    <LogoLightRtl v-if="dark" />
    <LogoDarkRtl v-else />
  </div>
</template>
