<script setup lang="ts">
// Builtin modules
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Composable modules
import { useAuthStore } from '@/stores/auth';

// Composables
const router = useRouter();
const store = useAuthStore();

// const checkbox = ref(true);
const loading = ref(true);

const form = ref({
  login: '',
  password: '',
});

const login = async () => {
  loading.value = true;
  try {
    await store.loginApi(form.value)
      .then((data) => {
        // store.isAuthenticated = true;
        // store.user = data;

        router.push({ name: 'Dashboard' });
      });
    loading.value = false;
  } catch {
    loading.value = false;
  }
};
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
    <!-- <v-col cols="12" class="pt-0">
      <div class="tw-flex align-center ml-n2 flex-wrap">
        <v-checkbox v-model="checkbox" color="primary" hide-details>
          <template #label>
            Remeber this Device
          </template>
        </v-checkbox>
      </div>
    </v-col> -->
    <v-col cols="12" class="pt-0">
      <v-btn
        :loading="!loading"
        to="/dashboard"
        color="primary"
        size="large"
        block
        flat
      >
        Sign in
      </v-btn>
    </v-col>
  </v-row>
</template>
