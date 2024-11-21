<script setup>
import LogoLight from './LogoLight.vue';
import LogoDark from './LogoDark.vue';

const dark = ref(true);

</script>
<template>
  <LogoLight v-if="dark" />
  <LogoDark v-else />
</template>
