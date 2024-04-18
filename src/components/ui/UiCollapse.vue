<template>
  <transition
    enter-active-class="enter-active"
    leave-active-class="leave-active"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    beforeEnter(element: HTMLElement) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = '0px';
        }

        element.style.display = null;
      });
    },

    enter(element: HTMLElement) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = `${element.scrollHeight}px`;
        });
      });
    },

    afterEnter(element: HTMLElement) {
      element.style.height = null;
    },

    beforeLeave(element: HTMLElement) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = `${element.offsetHeight}px`;
        }
      });
    },

    leave(element: HTMLElement) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = '0px';
        });
      });
    },

    afterLeave(element: HTMLElement) {
      element.style.height = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.enter-active,
.leave-active {
  overflow: hidden;
  transition: height .2s ease;
}
</style>
