<template>
  <div class="swither-wrapper">
    <div class="switcher">
      <input
        type="checkbox"
        :id="id"
        :checked="modelValue"
        :disabled="disabled"
        class="switcher-checkbox"
        :class="{'switcher-checkbox-checked': modelValue}"
        @input="checkboxHandler"
      />
      <span class="switcher-span"></span>
    </div>
    <label
      v-if="label"
      :for="id"
      class="ml-4"
    >
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: {
      type: String,
    },
    modelValue: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['switched', 'update:modelValue'],

  methods: {
    checkboxHandler(e: Event) {
      const check = (e.target as HTMLInputElement).checked;
      this.$emit('update:modelValue', check);
      this.$emit('switched');
    },
  },
});
</script>

<style lang="scss" scoped>
.swither-wrapper {
  position: relative;
  display: grid;
  grid-template-columns: 40px auto;
  align-items: center;
}

.switcher {
  display: flex;
  position: relative;
  width: 40px;
  height: 24px;
}
.switcher-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  position: relative;
  width: 40px;
  height: 24px;
  background-color: theme('colors.gray.500');
  border-radius: calc(24px/2);

  transition: background-color .2s;

  &+.switcher-span {
    left: 2px;
    right: 18px;
    transition: left .2s, right .2s
  }

  &:hover {
    background-color: theme('colors.gray.600');
  }
}

.switcher-checkbox:disabled {
  background-color: theme('colors.gray.300');
}

.switcher-checkbox-checked {
  background-color: theme('colors.primary.500') !important;
  transition: background-color .2s;

  &+.switcher-span {
    left: 18px;
    right: 2px;
    transition: left .2s, right .2s
  }
}

.switcher-span {
  z-index:1;
  position: absolute;
  background-color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  pointer-events: none;
}
</style>
