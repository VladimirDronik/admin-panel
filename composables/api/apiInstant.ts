export const useApiInstant = () => {
  const runtimeConfig = useRuntimeConfig();

  const router = useRouter();

  const api = async (path: string = runtimeConfig.public.backendApi, params: any) => {
    try {
      const data = await $fetch(path, params);
      return data;
    } catch (error: any) {
      if (error?.statusCode) {
        if (error?.statusCode === 401)router.push({ name: 'auth-Login' });
      }
      throw new Error(error.data);
    }
  };

  return {
    api,
  };
};
