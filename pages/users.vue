<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types modules
import type { Request } from '~/types/StoreTypes';
import { userListSchema, type UserType } from '~/stores/user/userTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();

useHead({
  titleTemplate: computed(() => t('pages.users')),
});

const {
  deleteForm,
  dialogDelete,
  statusDeleteUser,
  deleteItem,
  confirmDelete,
} = await useDeleteUser();

const {
  data: users,
  refresh: refreshUsers,
  status: statusUsers,
} = await useAPI<Request<UserType[]>>(
  paths.privateUsers,
  {
    watch: false,
  },
  userListSchema,
);

const headers = [
  {
    label: 'ID',
    code: 'DevId',
  },
];

// const form = ref({});
// const isOpen = ref(false);

async function useDeleteUser() {
  const dialogDelete = ref(false);

  const deleteForm = ref({
    id: 0,
    login: null,
  });

  const {
    status: statusDeleteUser,
    execute: executeDeleteUser,
  } = await useAPI(
    () => paths.privateUsers,
    {
      query: computed(() => ({
        id: deleteForm.value.id,
      })),
      immediate: false,
      watch: false,
      method: 'DELETE',
    },
  );

  const deleteItem = (item: any) => {
    deleteForm.value = {
      id: item.Id,
      login: item.login,
    };
    dialogDelete.value = true;
  };

  const confirmDelete = async () => {
    await updateData({
      update: async () => {
        await executeDeleteUser();
        await refreshUsers();
      },
      success: () => {
        dialogDelete.value = false;
      },
      successMessage: 'Пользователь удален',
      errorMessage: 'Ошибка удаления пользователя',
    });
  };

  return {
    deleteForm,
    statusDeleteUser,
    dialogDelete,
    deleteItem,
    confirmDelete,
  };
}

</script>

<template>
  <SharedUIPanel :is-update="statusUsers === 'pending'">
    <SharedUIBreadcrumb title="pages.users">
      <DialogsUserCreateDialog @update="refreshUsers" />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      :headers="headers"
      :items="users?.response"
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
              class="tw-mr-1.5 tw-size-2.5 tw-rounded-full"
              :class="data.send_push ? 'tw-bg-primary' : 'tw-bg-danger'"
            />
            {{ data.send_push ? t('on') : t('off') }}
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
      :loading="statusDeleteUser === 'pending'"
      :show-btn="false"
      :subtitle="`Вы уверены, что хотите удалить «${deleteForm?.login}»?`"
      title="Удалить устройство"
      @delete="confirmDelete"
    />
    <!-- <template #rightbar>
      <RightBarUser
        v-model:form="form"
        v-model:is-show="isOpen"
        @update="apiUsers?.refresh()"
      />
    </template> -->
  </SharedUIPanel>
</template>
