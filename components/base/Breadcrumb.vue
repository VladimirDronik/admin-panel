<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types
import type { PropType } from 'vue';

// Composables
const { t } = useI18n();

interface Breadcrumb {
  text: string,
  disabled: boolean,
  href: string,
}

// Declare Options
defineProps({
  title: {
    type: String,
    default: 'pages.page',
  },
  breadcrumbs: {
    type: Object as PropType<Breadcrumb[]>,
    default() {
      return [];
    },
  },
});

</script>

<template>
  <v-card elevation="10" class="bg-lightprimary tw-mb-6 tw-rounded-md">
    <div class="py-lg-0 tw-py-4">
      <div class="d-flex justify-space-between tw-pl-3 md:tw-pl-5">
        <div class="tw-flex tw-items-center tw-py-0">
          <div>
            <!-- Title -->
            <h3
              v-if="title"
              class="text-h3 tw-py-8"
            >
              {{ t(title) }}
            </h3>
            <!--  -->

            <!-- Breadcrumbs -->
            <v-breadcrumbs
              :items="breadcrumbs"
              class="text-h6 font-weight-medium ml-n1 "
            >
              <template v-slot:divider>
                <div class="d-flex align-center text-h3 mt-n4">
                  .
                </div>
              </template>

              <template v-slot:title="{ item }">
                <h6 class="text-subtitle-1 tw-font-semibold">
                  {{
                    //@ts-ignore
                    t(item.text) }}
                </h6>
              </template>
            </v-breadcrumbs>
            <!--  -->
          </div>
        </div>
        <div class="d-none d-lg-block overflow-hidden py-0">
          <div class="mb-0 mt-3">
            <!-- <img
              src="@/assets/images/breadcrumb/Frame.png"
              alt="breadcrumb"
            /> -->
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style lang="scss">
.page-breadcrumb {
    .v-toolbar {
        background: transparent;
    }
}
</style>
