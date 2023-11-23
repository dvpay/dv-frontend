<template>
  <div
    v-if="loading"
    class="loading"
    :class="bgColor"
  >
    <feather-icon
      class="animate-spin"
      type="loader"
      :size="size"
      :class="color"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
    },
    size: {
      type: String,
      default: '32',
    },
    color: {
      type: String,
      default: 'text-gray-500',
    },
    bgColor: {
      type: String,
      default: 'loading-bg-blur',
    },
  },
});
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 100%;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-bg-blur {
  background: rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(1px);
}
</style>
