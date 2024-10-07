export const useApiInstant = () => {
  const runtimeConfig = useRuntimeConfig();

  const router = useRouter();

  const api = async (path: string = runtimeConfig.public.backendApi, params: any) => {
    try {
      const data = await $fetch(path, params);
      return data;
    } catch (err: any) {
      if (err?.statusCode) {
        console.log(err?.statusCode);
        if (err?.statusCode === 401)router.push({ name: 'auth-Login' });
      }
      return err;
    }
  };

  return {
    api,
  };
};
