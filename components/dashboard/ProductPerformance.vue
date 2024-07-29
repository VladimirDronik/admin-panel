<script setup lang="ts">
const productPerformance = [
  {
    id: 1,
    name: 'Sunil Joshi',
    post: 'Web Designer',
    pname: 'Elite Admin',
    status: 'Low',
    statuscolor: 'primary',
    budget: '$3.9',
  },
  {
    id: 2,
    name: 'Andrew McDownland',
    post: 'Project Manager',
    pname: 'Real Homes WP Theme',
    status: 'Medium',
    statuscolor: 'secondary',
    budget: '$24.5k',
  },
  {
    id: 3,
    name: 'Christopher Jamil',
    post: 'Project Manager',
    pname: 'MedicalPro WP Theme',
    status: 'High',
    statuscolor: 'error',
    budget: '$12.8k',
  },
  {
    id: 4,
    name: 'Nirav Joshi',
    post: 'Frontend Engineer',
    pname: 'Hosting Press HTML',
    status: 'Critical',
    statuscolor: 'success',
    budget: '$2.4k',
  },

];
</script>
<template>
  <v-card elevation="10" class="">
    <v-card-item class="pa-6">
      <v-card-title class="text-h5 pt-sm-2 pb-7">
        Recent Transactions
      </v-card-title>
      <v-table class="month-table">
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-bold">
              Id
            </th>
            <th class="text-subtitle-1 font-weight-bold">
              Assigned
            </th>
            <th class="text-subtitle-1 font-weight-bold">
              Name
            </th>
            <th class="text-subtitle-1 font-weight-bold">
              Priority
            </th>
            <th class="text-subtitle-1 font-weight-bold text-right">
              Budget
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in productPerformance" :key="item.name" class="month-item">
            <td>
              <p class="text-15 font-weight-medium">
                {{ item.id }}
              </p>
            </td>
            <td>
              <div class="">
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.name }}
                </h6>
                <div class="text-13 mt-1 text-muted">
                  {{ item.post }}
                </div>
              </div>
            </td>
            <td>
              <h6 class="text-body-1 text-muted">
                {{ item.pname }}
              </h6>
            </td>
            <td>
              <v-chip :class="`text-body-1 bg-${item.statuscolor}` " color="white" size="small">
                {{
                  item.status
                }}
              </v-chip>
            </td>
            <td>
              <h6 class="text-h6 text-right">
                {{ item.budget }}
              </h6>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-item>
  </v-card>
</template>
