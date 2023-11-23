<template>
  <div
    class="wrapper"
    :data-tooltip="text"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    text: {
      type: String,
    },
    textWidth: {
      type: String,
      default: '240px',
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  @apply inline relative cursor-pointer transition-all duration-100;

  &:hover {
    &:after {
      @apply absolute bg-white border bottom-24px left-1/5 rounded shadow-basic p-5px;
      @apply z-99 text-xs;
      content: attr(data-tooltip);
      min-width: v-bind(textWidth);
    }
  }
}
</style>
