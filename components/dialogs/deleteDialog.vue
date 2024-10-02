<script setup lang="ts">

const dialog = ref(false);
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="300">
      <template v-slot:button>
        <v-btn color="error" @click="dialog = true">
          Удалить
        </v-btn>
      </template>
      <p class="tw-mb-4  tw-text-center tw-text-2xl">
        Подтвердите удаление
      </p>
      <div class="tw-flex tw-justify-center">
        <v-btn color="error" class="tw-mr-2">
          Удалить
        </v-btn>
        <v-btn color="primary" variant="text" @click="dialog = false">
          Отмена
        </v-btn>
      </div>
    </BaseDialog>
  </div>
</template>
