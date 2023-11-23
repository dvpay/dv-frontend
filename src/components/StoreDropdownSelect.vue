<template>
  <div
    class="dropdown-select"
    tabindex="0"
    ref="dropdownSelect"
    @blur="selectBlurHandler"
  >
    <div
      class="flex items-center"
      :class="[{ 'open': open, 'focus': focus }, 'selected' ]"
      aria-hidden="true"
      @click="selectedClickHandler"
    >
      <feather-icon
        type="shopping-bag"
        class="w-18px mr-4"
      />
      <span>{{ selectedOption?.title }}</span>
    </div>
    <div
      :class="[{ 'hidden': !open }, 'items']"
    >
      <div
        v-if="extraOption"
        aria-hidden="true"
        @click="extraOptionClickHandler"
      >
        {{ extraOption }}
      </div>
      <div class="line"></div>
      <div
        v-for="(option, i) of options.slice().reverse()"
        :key="i"
        :class="{'selected-in-items': option?.value === selectedOption?.value}"
        aria-hidden="true"
        @click="optionClickHandler(option?.value)"
      >
        {{ option?.title }}
      </div>
    </div>
    <feather-icon
      type="chevron-up"
      class="angle-down w-18px"
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
    selected: {
      type: String,
      required: true,
    },
    extraOption: {
      type: String,
      required: false,
    },
  },

  emits: ['change'],

  data() {
    return {
      open: false,
      focus: false,
      dropdownSelectHeight: '',
    };
  },

  computed: {
    selectedOption(): SelectOptionType {
      return this.options.filter((item) => item.value === this.selected)[0];
    },

    dropdownMenuHeight(): string {
      return `-${(this.options.length * 29) + 62}px`;
    },
  },

  mounted() {
    this.dropdownSelectHeight = `${
      (this.$refs.dropdownSelect as HTMLElement).clientHeight
    }px`;
  },

  methods: {
    selectBlurHandler() {
      this.open = false;
      this.focus = false;
    },

    selectedClickHandler() {
      this.open = !this.open;
      this.focus = true;
    },

    optionClickHandler(value: string) {
      this.open = false;
      this.focus = false;
      this.$emit('change', value);
    },

    extraOptionClickHandler() {
      this.open = false;
      this.focus = false;
      this.$emit('change', 'extra');
    },
  },
});
</script>

<style lang="scss" scoped>
.dropdown-select {
  @apply relative;
}

.dropdown-select {
  .selected {
    @apply py-2 px-4 pr-9 cursor-pointer select-none;
    @apply hover:(text-primary-500);
  }
  .selected:hover ~ .angle-down {
    @apply text-primary-500;
  }
}

.angle-down {
  @apply absolute pointer-events-none top-1/2 right-4;
  transform: translateY(-50%);
}

.dropdown-select {
  .items {
    @apply absolute bg-body-bg border rounded left-0 right-0 overflow-hidden z-1 py-2;
    top: calc(v-bind(dropdownMenuHeight) - 2px);
  }
}

.dropdown-select {
  .items div {
    @apply py-1 px-4 pr-10 cursor-pointer select-none hover:bg-white;
  }

  .items .line {
    @apply h-1px w-full p-0 bg-gray-300 my-2 hover:bg-gray-300;
  }
}

.selected-in-items {
  @apply bg-primary-500 text-white pointer-events-none;
}
</style>
