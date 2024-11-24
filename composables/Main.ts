import { useI18n } from 'vue-i18n';

// Types
interface Params {
  update: () => void,
  success?: ()=> void
  error?: ()=> void
  successMessage?: string
  errorMessage?: string
  disableSuccessMessage?: boolean
  disableErrorMessage?: boolean
}

export function useUtils() {
  // Composables
  const { t } = useI18n();
  const toast = useToast();

  // Methods
  const updateData = async (params: Params) => {
    try {
      await params.update();
      if (params.success) params.success();
      if (!params.disableSuccessMessage) {
        toast.add({
          severity: 'success',
          summary: t(params.successMessage ?? 'Успешно'),
          life: 5000,
        });
      }
    } catch (error) {
      if (params.error) params.error();
      if (!params.disableSuccessMessage) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка создания',
          detail: t(params.errorMessage ?? 'Ошибка'),
          life: 5000,
        });
      }
      console.error(error);
    }
  };

  return {
    updateData,
  };
}
