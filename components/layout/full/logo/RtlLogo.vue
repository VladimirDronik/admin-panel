<script setup lang="ts">
import LogoLightRtl from './LogoLightRtl.vue';
import LogoDarkRtl from './LogoDarkRtl.vue';

const dark = ref(false);

</script>
<template>
  <LogoLightRtl v-if="dark" />
  <LogoDarkRtl v-else />
</template>
