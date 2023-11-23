<template>
  <div class="checkbox-wrapper">
    <span
      class="checkbox"
      :class="{'checkbox-checked': checked }"
    ></span>
    <feather-icon
      v-if="checked"
      type="check"
      size="16"
      class="check-icon"
      stroke-width="3"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    checked: {
      type: Boolean,
    },
  },

  emits: ['checked'],
});
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  @apply relative items-center;
}
.checkbox {
  @apply flex m-0 w-20px h-20px border-1 border-gray-400 rounded-sm appearance-none;
}
.checkbox-checked {
  @apply bg-primary-500 border-primary-500;
}
.check-icon {
  @apply absolute pointer-events-none text-white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
