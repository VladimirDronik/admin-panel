// Builtin modules
import { ZodArray, ZodObject, ZodRecord } from 'zod';
// Types modules
import type { UseFetchOptions } from 'nuxt/app';

// Types
interface MyOptions {
  success?: (response: any) => void
  error?: () => void
}

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T> & MyOptions,
  Schema?: unknown | null,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
    onResponse({ response, request }) {
      // Обрабатывает данные ответа
      if (response.status < 400) {
        if (Schema instanceof ZodObject || Schema instanceof ZodArray || Schema instanceof ZodRecord) {
          try {
            Schema.parse(response._data.response);
          } catch (err: any) {
            if (import.meta.env.VITE_ENV === 'development') {
              console.error(`Zod Validation Error (${request}):\n`, err?.issues);
              console.error('The received data:\n', response._data.response);
            }
          }
        } else {
          if (import.meta.env.VITE_ENV === 'development') console.warn('The Zod schema for data validation is not valid or missing.', request);
        }
        options?.success?.(response._data);
      } else {
        options?.error?.();
      }
    },
  });
}
