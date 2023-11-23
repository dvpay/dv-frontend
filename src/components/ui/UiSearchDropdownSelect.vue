<template>
  <div
    class="dropdown-select"
    tabindex="0"
    ref="dropdownSelect"
  >
    <input
      ref="inputSearchSelect"
      class="input w-full !pr-10"
      v-model="inputValue"
      :placeholder="placeholder"
      @input="searchHandler"
      @focus="selectedFocusHandler"
      @blur="selectBlurHandler"
    />
    <div
      v-if="options.length"
      :class="[{ 'hidden': !open }, 'items']"
      @mousedown.prevent
    >
      <div
        v-for="(option, i) in options"
        :key="i"
        :class="{'selected-in-items': option?.value === selectedOption?.value}"
        aria-hidden="true"
        @click="optionClickHandler(option?.value)"
      >
        <span>{{ option?.title }}</span>
        <feather-icon
          v-if="option?.value === selectedOption?.value"
          type="check"
          class="w-18px"
        />
      </div>
    </div>
    <div
      v-else
      :class="[{ 'hidden': !open }, 'items']"
      @mousedown.prevent
    >
      <div>
        {{ $t('Not Found') }}
      </div>
    </div>
    <feather-icon
      type="chevron-down"
      class="angle-down w-18px"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SelectOptionType } from '@/components/types';

export default defineComponent({
  components: {},

  props: {
    options: {
      type: Array as PropType<SelectOptionType[]>,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
  },

  emits: ['change', 'search', 'focusSelect'],

  data() {
    return {
      open: false,
      focus: false,
      dropdownSelectHeight: '',
      inputValue: '',
    };
  },

  computed: {
    selectedOption(): SelectOptionType {
      return this.selected
        ? this.options.filter((item) => item.value === this.selected)[0]
        : { title: '', value: '' };
    },

    dropdownMenuHeight(): string {
      return `-${(this.options.length * 29) + 62}px`;
    },

    placeholder() {
      return this.selected ? this.selected : this.$t('Please Select');
    },
  },

  watch: {
    selected() {
      this.inputValue = this.selected;
    },
  },

  mounted() {
    this.dropdownSelectHeight = `${
      (this.$refs.dropdownSelect as HTMLElement).clientHeight
    }px`;

    this.inputValue = this.selected;
  },

  methods: {
    selectBlurHandler() {
      this.open = false;
      this.focus = false;
      this.inputValue = this.selected;
    },

    selectedFocusHandler() {
      this.open = true;
      this.focus = true;
      this.inputValue = '';
      this.$emit('focusSelect');
    },

    optionClickHandler(value: string) {
      this.open = false;
      this.focus = false;
      (this.$refs.inputSearchSelect as HTMLInputElement).blur();
      this.$emit('change', value);
    },

    searchHandler(e: Event) {
      const value = (e.target as HTMLSelectElement).value;
      this.$emit('search', value);
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
    @apply py-1 px-4 pr-9 cursor-pointer select-none rounded border border-gray-200;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .selected.focus {
    @apply border-gray-400;
  }
  .selected.open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.angle-down {
  @apply absolute pointer-events-none top-1/2 right-4;
  transform: translateY(-50%);
}

.dropdown-select {
  .items {
    @apply absolute bg-body-bg border rounded left-0 right-0 overflow-hidden z-1 py-2 shadow-basic;
    top: calc(v-bind(dropdownSelectHeight) + 1px);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
    max-height: 250px;
    overflow-y: scroll;
  }
}

.dropdown-select {
  .items div {
    @apply py-2 px-4 cursor-pointer select-none hover:bg-gray-300;
    @apply flex justify-between items-center;
  }

  .items .line {
    @apply h-1px w-full p-0 bg-gray-300 my-2 hover:bg-gray-300;
  }
}

.selected-in-items {
  @apply text-primary-500 pointer-events-none;
}
</style>
