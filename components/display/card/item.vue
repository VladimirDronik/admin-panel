<script lang="ts" setup>
// Helpers modules
import { itemColor } from '~/helpers/rooms';

// Composables
const storeUser = useUserStore();

// Declare Options
const props = defineProps<{
  icon: string,
  status: string,
  title: string,
  color: string | undefined,
  style: string,
  groupElements: any[] | undefined,
}>();

const computedFilter = computed(() => {
  if (props.status === 'off' && storeUser.isDark) {
    return 'brightness(0) saturate(100%) invert(62%) sepia(33%) saturate(0%) hue-rotate(193deg) brightness(94%) contrast(86%)';
  }
  if (props.status !== 'on') {
    return 'brightness(0) saturate(100%) invert(66%) sepia(24%) saturate(260%) hue-rotate(115deg) brightness(91%) contrast(84%)';
  }

  const filters: Record<string, string> = {
    blue: 'brightness(0) saturate(100%) invert(66%) sepia(50%) saturate(5712%) hue-rotate(197deg) brightness(103%) contrast(102%)',
    green: 'brightness(0) saturate(100%) invert(52%) sepia(94%) saturate(3201%) hue-rotate(135deg) brightness(105%) contrast(80%)',
    yellow: 'brightness(0) saturate(100%) invert(81%) sepia(31%) saturate(844%) hue-rotate(345deg) brightness(103%) contrast(101%)',
    orange: 'brightness(0) saturate(100%) invert(78%) sepia(56%) saturate(1570%) hue-rotate(318deg) brightness(101%) contrast(101%)',
    red: 'brightness(0) saturate(100%) invert(46%) sepia(69%) saturate(1120%) hue-rotate(329deg) brightness(101%) contrast(101%)',
  };

  const selectedColor = props.color && filters[props.color] ? props.color : props.style;

  return filters[selectedColor as keyof typeof filters] || filters.green;
});
</script>

<template>
  <button
    class="tw-m-1.5"
    type="button"
  >
    <div
      class="border-base tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-p-3"
      :class="{
        shadow: status === 'on' && !storeUser.isDark,
        'border-dark': status === 'off' && storeUser.isDark,
      }"
      :style="{
        backgroundColor: !storeUser.isDark
          ? (status === 'off' ? '#EDF3F2' : 'transparent')
          : (status === 'on' ? '#484848' : 'transparent'),
        borderRadius: '15px',
      }"
    >
      <img
        alt="item"
        class="tw-w-20"
        :class="{
          '!tw-opacity-60': !(status === 'on'),
        }"
        :src="`items/${icon}.png`"
        :style="{ filter: computedFilter }"
      >
      <Badge
        v-if="groupElements"
        class="tw-absolute -tw-right-2.5 -tw-top-2.5 tw-rounded-full tw-text-white"
        :class="{ '!tw-bg-gray-400': !(status === 'on') }"
        rounded
        :style="{ backgroundColor: itemColor(style, color) }"
      >
        {{ groupElements.length }}
      </Badge>
    </div>
    <h5 class="tw-w-28 tw-truncate tw-text-center">
      {{ title }}
    </h5>
  </button>
</template>

<style lang="scss" scoped>
.shadow {
  box-shadow:
    0px 4px 20px rgba(18, 114, 90, 0.15),
    0px 2px 4px rgba(18, 114, 90, 0.08);
}

.border-dark {
  border: 2px solid #484848;
}

</style>
