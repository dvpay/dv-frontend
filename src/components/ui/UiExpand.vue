<template>
  <transition name="expand">
    <div
      class="w-full"
      v-show="isExpanded"
    >
      <slot />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    isExpanded: {
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
.expand-leave-active,
.expand-enter-active {
  height: auto;
  transition: all 150ms ease-in-out;
  overflow: hidden;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 180px;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
