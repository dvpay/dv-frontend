<template>
  <div class="select-wrapper">
    <select
      class="select"
      :class="[innerClass, !modelValue && placeholder ? 'bg-gray-100 text-gray-500' : '']"
      :id="id"
      :value="modelValue"
      @input="selectHandler"
    >
      <option
        v-if="!modelValue && placeholder"
        value=""
        disabled
        selected
        hidden
      >{{ placeholder }}</option>
      <option
        v-for="(option, i) in options"
        :disabled="option.disabled ?? false"
        :key="i"
        :value="option.value"
      >
        {{ option.title }}
      </option>
    </select>
    <feather-icon
      type="chevron-down"
      size="18"
      class="angle-down"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SelectOptionType } from '@/components/types';

export default defineComponent({
  props: {
    options: {
      type: Array as PropType<SelectOptionType[]>,
      required: true,
    },
    id: {
      type: [String, Number],
      required: false,
    },
    innerClass: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
    },
    placeholder: {
      type: String,
    },
  },

  emits: ['update:modelValue', 'change'],

  methods: {
    selectHandler(e: Event) {
      const value = (e.target as HTMLSelectElement).value;
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.select-wrapper {
  @apply relative;
}
.select {
  @apply w-full text-sm leading-relaxed border rounded h-full px-3 pr-9 outline-none appearance-none;
  @apply focus:border-gray-400 hover:border-gray-400;
}

.angle-down {
  @apply absolute pointer-events-none top-1/2 right-10px z-1;
  transform: translateY(-50%);
}
</style>
