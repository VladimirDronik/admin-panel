import type { AnyAbility } from '@casl/ability';

declare module '#app' {
  interface NuxtApp {
    $abilities: AnyAbility;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $abilities: AnyAbility;
  }
}
