<script setup lang="ts">
import { ref } from 'vue';
import { CircleIcon } from 'vue-tabler-icons';

const recentTransaction = [
  {
    title: '09:30 am',
    subtitle: 'Payment received from John Doe of $385.90',
    textcolor: 'primary',
    boldtext: false,
    line: true,
    link: '',
    url: '',
  },
  {
    title: '10:00 am',
    subtitle: 'New sale recorded',
    textcolor: 'secondary',
    boldtext: true,
    line: true,
    link: '#ML-3467',
    url: '',
  },
  {
    title: '12:00 am',
    subtitle: 'Payment was made of $64.95 to Michael',
    textcolor: 'success',
    boldtext: false,
    line: true,
    link: '',
    url: '',
  },
  {
    title: '09:30 am',
    subtitle: 'New sale recorded',
    textcolor: 'warning',
    boldtext: true,
    line: true,
    link: '#ML-3467',
    url: '',
  },
  {
    title: '09:30 am',
    subtitle: 'New arrival recorded',
    textcolor: 'error',
    boldtext: true,
    line: true,
    link: '',
    url: '',
  },
  {
    title: '12:00 am',
    subtitle: 'Payment Received',
    textcolor: 'success',
    boldtext: false,
    line: false,
    link: '',
    url: '',
  },
];
</script>
<template>
  <v-card elevation="10" class="withbg">
    <v-card-item class="pb-0">
      <v-card-title class="text-h5 pt-sm-2">
        Recent Transactions
      </v-card-title>
      <div class="recent-transaction mt-10 px-3">
        <div v-for="list in recentTransaction" :key="list.title">
          <v-row class="d-flex mb-4">
            <v-col cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 d-flex align-start">
              <h6 class="text-body-1 textSecondary text-no-wrap">
                {{ list.title }}
              </h6>
            </v-col>
            <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
              <CircleIcon size="13" :class="`text-${list.textcolor}`" />
              <div v-if="list.line" class="line mx-auto bg-grey100" />
            </v-col>
            <v-col cols="7" sm="8" class="pt-0">
              <h6 v-if="list.boldtext" class="text-body-1 font-weight-bold">
                {{ list.subtitle }}
              </h6>
              <h6 v-else class="text-body-1 textSecondary">
                {{ list.subtitle }}
              </h6>
              <div class="mt-n1">
                <RouterLink v-if="list.link" :to="list.url" class="text-body-1 text-primary text-decoration-none">
                  {{
                    list.link
                  }}
                </RouterLink>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>
<style lang="scss">
.recent-transaction {
    .line {
        width: 2px;
        height: 35px;
    }
}
</style>
