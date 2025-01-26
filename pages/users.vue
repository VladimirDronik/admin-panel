<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types modules
import type { APIData } from '~/types/StoreTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();

useHead({
  titleTemplate: computed(() => t('pages.users')),
});

// Variables
const headers = [
  {
    label: 'ID',
    code: 'DevId',
  },
];

const isOpen = ref(false)

const form = ref({})

const deleteForm = ref({
  id: 0,
  login: null
})

const dialogDelete = ref(false);

// Apis
const apiUsers = ref<APIData<any>>();
const apiDeleteUser = ref<APIData<any>>();

// Methods
const clickRow = () => {
  isOpen.value = true
}

const deleteItem = (item: any) => {
  deleteForm.value = {
    id: item.Id,
    login: item.login,
  }
  dialogDelete.value = true;
}

const confirmDelete = async () => {
  await updateData({
    update: async () => {
      await apiDeleteUser.value?.execute();
      await apiUsers.value?.refresh();
    },
    success: () => {
      dialogDelete.value = false;
    },
    successMessage: 'Пользователь удален',
    errorMessage: 'Ошибка удаления пользователя',
  });
};

// Hooks
onBeforeMount(async () => {
  // Get Buttons
  const dataUsers: unknown = await useAPI(
    paths.privateUsers,
    {
      watch: false,
    },
  );

  apiUsers.value = dataUsers as APIData<any>;
  //

  // Delete Device
  const dataUserDevice: unknown = await useAPI(
    () => paths.privateUsers,
    {
      query: computed(() => ({
        id: deleteForm.value.id
      })),
      immediate: false,
      watch: false,
      method: 'DELETE',
    },
  );

  apiDeleteUser.value = dataUserDevice as APIData<any>;
});
</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.users">
      <DialogsUserCreateDialog @update="apiUsers?.refresh" />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      :headers="headers"
      :items="apiUsers?.data?.response"
      @click-row="clickRow"
    >
      <Column
        field="login"
        header="Логин"
      >
        <template #body="{ data }">
          {{ data.login || '-' }}
        </template>
      </Column>
      <Column
        field="send_push"
        header="Уведомления"
      >
        <template #body="{ data }">
          <div class="tw-flex tw-items-center">
            <div
              class="tw-mr-1.5 tw-h-2.5 tw-w-2.5 tw-rounded-full"
              :class="data.send_push ? 'tw-bg-primary' : 'tw-bg-danger'"
            />
            {{ data.send_push ? 'Вкл' : 'Выкл' }}
          </div>
        </template>
      </Column>
      <Column
        field="actions"
        header="Действия"
        style="width: 150px;"
      >
        <template #body="{ data }">
          <Button
            aria-label="Cancel"
            icon="pi pi-trash"
            rounded
            severity="danger"
            @click.stop="deleteItem(data)"
          />
        </template>
      </Column>
    </BaseTable>
    <DialogsDeleteDialog
      :id="deleteForm?.id ?? -1"
      v-model="dialogDelete"
      class="tw-mr-2"
      :loading="apiDeleteUser?.pending && apiDeleteUser.status !== 'idle'"
      :show-btn="false"
      :subtitle="`Вы уверены, что хотите удалить «${deleteForm?.login}»?`"
      title="Удалить устройство"
      @delete="confirmDelete"
    />
    <template #rightbar>
      <RightBarUser
        v-model:form="form"
        v-model:is-show="isOpen"
        @update="apiUsers?.refresh()"
      />
    </template>
  </SharedUIPanel>
</template>
