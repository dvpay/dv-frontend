<template>
  <div class="relative flex flex-col gap-2">
    <label
      v-if="label"
      :for="id"
      :data-label-required-mark="labelRequiredMark"
      class="self-start"
    >
      {{ label }}
    </label>
    <input
      class="input w-full"
      :class="{ 'input-invalid': isValid }"
      :id="id"
      :type="type"
      :name="name"
      :step="step"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      :spellcheck="spellcheck"
      :value="modelValue"
      :pattern="pattern"
      v-regexp-validate="patternVatidateText"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div class="absolute -bottom-18px text-xs text-red-500">
      {{ vatidateMsg }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
    },
    type: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    id: {
      type: String,
    },
    label: {
      type: String,
    },
    isValid: {
      type: Boolean,
    },
    vatidateMsg: {
      type: String,
    },
    pattern: {
      type: String,
    },
    patternVatidateText: {
      type: String,
    },
    labelRequiredMark: {
      type: String as PropType<'on' | 'off'>,
      default: 'off',
    },
    step: {
      type: String,
    },
    spellcheck: {
      type: Boolean,
    },
  },

  emits: ['update:modelValue', 'onValidate'],

  methods: {
    onInput(e: Event) {
      const target = e.target as HTMLInputElement;
      this.$emit('update:modelValue', target.value);
      this.$emit('onValidate');
    },

    onFocus() {
      this.$emit('onValidate');
    },

    onBlur() {
      this.$emit('onValidate');
    },
  },
});
</script>

<style lang="scss" scoped>
[data-label-required-mark="on"]::after {
  content: " *";
  color: theme('colors.red.400');
}

.input {
  @apply py-2 px-3 rounded border border-gray-200 placeholder-gray-500;
  @apply focus:(border-gray-400 outline-none);
  @apply disabled:bg-gray-200;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  @apply appearance-none;
}

input[type='number'],
input[type="number"]:hover,
input[type="number"]:focus {
  @apply appearance-none;
  -moz-appearance: textfield;
}

.input-invalid {
  border: 1px solid theme('colors.red.400') !important;
}
</style>
