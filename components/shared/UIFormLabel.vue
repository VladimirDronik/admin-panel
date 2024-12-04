<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
  tooltip: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <span class="ui-form-label" v-tooltip="tooltip" :aria-label="tooltip || undefined">
    {{ label }}
  </span>
</template>
