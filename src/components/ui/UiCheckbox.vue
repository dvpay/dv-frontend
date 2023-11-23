<template>
  <div class="checkbox-wrapper">
    <input
      :id="id"
      :checked="modelValue"
      class="checkbox"
      type="checkbox"
      @input="checkboxHandler"
      :disabled="disabled"
    >
    <label
      v-if="label"
      :for="id"
      class="ml-4"
    >
      {{ label }}
    </label>
    <feather-icon
      v-if="modelValue"
      type="check"
      size="16"
      stroke-width="3"
      class="check-icon"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: {
      type: String,
    },
    label: {
      type: String,
    },
    modelValue: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['checked', 'update:modelValue'],

  methods: {
    checkboxHandler(e: Event) {
      const check = (e.target as HTMLInputElement).checked;
      this.$emit('update:modelValue', check);
      this.$emit('checked');
    },
  },
});
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  @apply relative items-center;
  display: grid;
  grid-template-columns: 20px auto;
}
.checkbox {
  @apply flex m-0 w-20px h-20px border-1 border-gray-400 rounded-sm appearance-none;
}
.checkbox:checked {
  @apply bg-primary-500 border-primary-500;
}
.check-icon {
  @apply absolute left-2px pointer-events-none text-white;
}
</style>
