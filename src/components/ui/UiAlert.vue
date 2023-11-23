<template>
  <div
    v-if="modelValue"
    class="font-400 px-4 py-3 flex items-center justify-between gap-4 rounded"
  >
    <slot />
    <feather-icon
      type="x"
      size="18"
      stroke-width="2.5"
      class="cursor-pointer opacity-80 hover:opacity-100"
      @click="closeHandler"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
    },
  },

  emits: ['update:modelValue'],

  methods: {
    closeHandler() {
      this.$emit('update:modelValue', false);
    },
  },
});
</script>

<style lang="scss" scoped>

</style>
