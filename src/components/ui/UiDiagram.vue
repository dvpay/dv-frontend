<template>
  <div class="diagram">
    <svg viewBox="0 0 32 32">
      <circle r="16" cx="16" cy="16" class="circle"></circle>
      <circle r="16" cx="16" cy="16" :stroke-dasharray="`${percent} 100`"
              :class="percent >= 90 ? 'circle-diagrams-danger' : ''"
              class="circle-diagrams"></circle>
    </svg>
    <div class="diagram-data">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    percent: {
      type: Number,
    },
  },
});
</script>

<style lang="scss" scoped>
.diagram {
  width: 150px;
  height: 150px;
  position: relative;
}

.diagram-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.circle {
  fill: transparent;
  stroke: theme('colors.gray.300');
  stroke-width: 8;
}

.circle-diagrams {
  fill: transparent;
  stroke: theme('colors.green.600');
  stroke-width: 8;
}

.circle-diagrams-danger {
  stroke: theme('colors.red.600');
}

svg {
  width: 150px;
  height: 150px;
  transform: rotate(-70deg);
  background: transparent;
  border-radius: 50%;
}
</style>
