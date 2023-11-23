<template>
  <div
    class="chart"
    :class="{'chart-hide': progressBar === 'stop'}"
  >
    <div
      class="bar"
      :class="[progressBar === 'start' ? 'bar-start' : 'bar-stop']"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  computed: {
    ...mapState('app', {
      progressBar: 'progressBar',
    }),
  },
});
</script>

<style lang="scss" scoped>
.chart {
  background-color: theme('colors.gray.300');
  height: 2px;
  width: 100%;
  position: fixed;
  z-index: 9999;
}

.chart-hide {
  display: none;
}

.chart .bar {
  background-color: theme('colors.primary.500');
  height: 100%;
  -moz-animation: animate-bar 1.25s 1 linear;
  -webkit-animation: animate-bar 1.25s 1 linear;
  -o-animation: animate-bar 1.25s 1 linear;
  animation: animate-bar 1.25s 1 linear;
}

.bar-start {
  width: 60%;
}

.bar-stop {
  width: 100%;
}

.bar {
  position: relative;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
        90deg,
        rgba(#fff, 0) 0,
        rgba(#fff, 0.2) 20%,
        rgba(#fff, 0.5) 60%,
        rgba(#fff, 0)
    );
    animation: shimmer 1s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(15%);
    }
  }
}

@-moz-keyframes animate-bar {
  0%   { width: 0; }
}

@-webkit-keyframes animate-bar {
  0%   { width: 0; }
}

@-ms-keyframes animate-bar {
  0%   { width: 0; }
}

@-o-keyframes animate-bar {
  0%   { width: 0; }
}

@keyframes animate-bar {
  0%   { width: 0; }
}
</style>
