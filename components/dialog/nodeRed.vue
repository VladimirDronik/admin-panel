<script lang="ts" setup>

const visible = ref(false);
</script>

<template>
  <div>
    <Button
      label="Сценарии"
      @click="visible = true"
    />
    <Dialog
      v-model:visible="visible"
      header="Node Red"
      maximizable
      modal
      pt:content:class="tw-px-4 tw-pb-4"
      pt:header:class="tw-p-4 tw-py-2"
      :style="{ width: '70rem' }"
    >
      <iframe
        class="node-red tw-size-full"
        frameborder="0"
        src="http://localhost:8000/red"
        title="Node Red"
      />
    </Dialog>
  </div>
</template>

<style>
.node-red {
  min-height: 550px;
}
</style>
