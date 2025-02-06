export function api(path: string, options: any) {
  return useNuxtApp().$api(path, options);
}
