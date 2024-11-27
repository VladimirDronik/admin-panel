/* eslint-disable no-underscore-dangle */
import { ZodArray, ZodObject } from 'zod';
import type { UseFetchOptions } from 'nuxt/app';

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
  Schema?: unknown | null,
) {
  return useFetch(url, {
    watch: false,
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
    onResponse({ response, request, error }) {
      if (error) return;
      // Обрабатывает данные ответа
      if (Schema instanceof ZodObject || Schema instanceof ZodArray) {
        try {
          Schema.parse(response._data.data);
        } catch (err: any) {
          try {
            Schema.parse(response._data.response);
          } catch (err: any) {
            console.error('Zod Validation Error:\n', err?.issues);
            console.error('The received data:\n', response._data.response);
          }
        }
      } else {
        console.warn('The Zod schema for data validation is not valid or missing.', request);
      }
    },
  });
}
