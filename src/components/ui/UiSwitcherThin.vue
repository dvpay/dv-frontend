<template>
  <div class="switcher">
    <input
      type="checkbox"
      class="switcher-checkbox"
      :class="{'switcher-checkbox-checked': checked}"
      :id="id"
      @change="changeHandler"
    />
    <span
      class="switcher-span"
      :class="{'switcher-span-border-active': checked}"
    >
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: {
      type: String,
    },
    checked: {
      type: Boolean,
    },
  },

  emits: ['switched'],

  methods: {
    changeHandler() {
      this.$emit('switched');
    },
  },
});
</script>

<style lang="scss" scoped>
.switcher {
  display: flex;
  position: relative;
  width: 36px;
  height: 16px;
}
.switcher-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  position: relative;
  width: 36px;
  height: 16px;
  background-color: theme('colors.gray.500');
  border-radius: calc(16px/2);
  transition: background-color .1s , border .1s;

  &+.switcher-span {
    left: 0;
    right: 16px;
    transition: left .2s, right .2s;
  }

  &:hover {
    background-color: theme('colors.gray.600');

    &+.switcher-span {
      border: 2px solid theme('colors.gray.600');
    }
  }
}

.switcher-checkbox-checked {
  background-color: theme('colors.primary.500') !important;
  transition: background-color .2s;

  &+.switcher-span {
    left: 16px;
    right: 0;
    transition: left .2s, right .2s;
  }
}

.switcher-span {
  z-index: 1;
  position: absolute;
  background-color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid theme('colors.gray.500');
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  pointer-events: none;
}

.switcher-span-border-active {
  border: 2px solid theme('colors.primary.500') !important;
}
</style>
