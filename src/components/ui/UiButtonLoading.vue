<template>
  <button
    class="relative"
    :disabled="loading || disabled"
  >
    <span :class="{'opacity-0': loading }">
      <slot></slot>
    </span>
    <span
      v-if="loading"
      class="spinner"
    >
      <feather-icon
        class="animate-spin mt-1px"
        type="loader"
        size="18"
        :style="{ color: spinnerColor }"
      />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    spinnerColor: {
      type: String,
      default: '#fff',
    },
  },
});
</script>

<style lang="scss" scoped>
.spinner {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
</style>
