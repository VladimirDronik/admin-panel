// ===============================|| Blank Layout ||=============================== //
<script setup lang="ts">
useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'p-dark',
  valueLight: 'p-light',
  storageKey: 'touch-on-color',
})
</script>
<template>
  <div>
    <NuxtPage />
  </div>
</template>
