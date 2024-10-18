import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export function useValidation() {
  // Composables
  const { t } = useI18n();

  // Methods
  const emptyRules = ref([
    (v: string | boolean) => !!v || t('validation.empty'),
  ]);

  const nameRules = ref([
    (v: string) => !!v || t('validation.name'),
  ]);

  const codeRules = ref([
    (v: string) => !!v || t('validation.code'),
  ]);

  const emailRules = ref([
    (v: string) => !!v || t('validation.emailEmpty'),
    (v: string) => /.+@.+\..+/.test(v) || t('validation.email'),
  ]);
  const ipRules = ref([
    (v: string) => !!v || t('validation.emailEmpty'),
    (v: string) => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v) || t('validation.ip'),
  ]);

  const passwordRules = ref([
    (v: string) => !!v || t('validation.passwordEmpty'),
    (v: string) => (v && v.length >= 8) || t('validation.password'),
  ]);

  return {
    codeRules,
    nameRules,
    emptyRules,
    emailRules,
    passwordRules,
  };
}
