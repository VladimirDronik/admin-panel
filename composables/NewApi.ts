/* eslint-disable no-underscore-dangle */
import { ZodObject } from 'zod';
import type { UseFetchOptions } from 'nuxt/app';

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
  Schema?: unknown | null,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
    onResponse({ response, request }) {
      // Обрабатывает данные ответа
      if (Schema instanceof ZodObject) {
        try {
          Schema.parse(response._data.data);
        } catch (err: any) {
          console.error('Zod Validation Error:\n', err?.issues);
          console.error('The received data:\n', response._data.data);
        }
      } else {
        console.warn('The Zod schema for data validation is not valid or missing.', request);
      }
    },
  });
}
