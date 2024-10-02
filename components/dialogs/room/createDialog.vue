<script setup lang="ts">

const dialog = defineModel({
  default: false,
});
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1200">
      <template v-slot:button>
        <v-btn color="primary" class="text-capitalize" @click="dialog = true">
          Добавить Помещение
        </v-btn>
      </template>
      <p class="tw-mb-4  tw-text-center tw-text-2xl">
        Добавить Помещение
      </p>

      <div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Название
          </p>
          <v-text-field />
        </div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Цвет Категории
          </p>
          <v-select />
        </div>
      </div>
    </BaseDialog>
  </div>
</template>
