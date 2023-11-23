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
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  @apply inline relative cursor-pointer transition-all duration-100 whitespace-normal text-left break-all;

  &:hover {
    &:after {
      @apply absolute bg-white border right-0 bottom-26px rounded shadow-basic p-5px;
      @apply z-99 min-w-240px max-w-240px text-xs;
      content: attr(data-tooltip);
    }
  }
}
</style>
