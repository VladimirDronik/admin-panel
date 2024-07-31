<script setup lang="ts">
import { ref } from 'vue';

const checkbox = ref(true);
</script>

<template>
  <v-row class="d-flex mb-3">
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">
        Username
      </v-label>
      <v-text-field variant="outlined" hide-details color="primary" />
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">
        Password
      </v-label>
      <v-text-field variant="outlined" type="password" hide-details color="primary" />
    </v-col>
    <v-col cols="12" class="pt-0">
      <div class="tw-flex align-center ml-n2 flex-wrap">
        <v-checkbox v-model="checkbox" color="primary" hide-details>
          <template #label>
            Remeber this Device
          </template>
        </v-checkbox>
        <div class="ml-sm-auto">
          <NuxtLink
            to="/"
            class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
          >
            Forgot
            Password ?
          </NuxtLink>
        </div>
      </div>
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-btn to="/dashboard" color="primary" size="large" block flat>
        Sign in
      </v-btn>
    </v-col>
  </v-row>
</template>
