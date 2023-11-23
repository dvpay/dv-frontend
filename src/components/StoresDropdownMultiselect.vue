<template>
  <div
    class="dropdown-select flex"
    tabindex="0"
    ref="dropdownSelect"
    @blur="selectBlurHandler"
  >
    <div
      class="flex items-center w-full"
      :class="[{ 'open': open, 'focus': focus }, 'selected' ]"
      aria-hidden="true"
      ref="innerSelect"
      @click="selectedClickHandler"
    >
      <div
        v-if="selected.length"
        class="relative"
      >
        <div
          class="flex gap-2"
          :class="{'absolute invisible': hideOverflowStores }"
        >
          <div
            v-for="(store, i) in selected"
            :key="i"
            class="flex items-center gap-2 text-primary-500 bg-primary-100 py-1 px-2 rounded flex-nowrap whitespace-nowrap"
          >
            {{ store.title }}
          </div>
        </div>
        <div
          v-if="hideOverflowStores"
          class="flex gap-2"
        >
          <div
            v-for="(store, i) in selectedArraySlice"
            :key="i"
            class="flex items-center gap-2 text-primary-500 bg-primary-100 py-1 px-2 rounded flex-nowrap whitespace-nowrap"
          >
            {{ store.title }}
          </div>
          <div
            v-if="overflowNumbersOfStores"
            class="flex items-center justify-center gap-2 text-primary-500 bg-primary-100 py-1 px-2 rounded w-40px"
          >
            +{{ overflowNumbersOfStores }}
          </div>
        </div>
      </div>
      <div v-else class="flex items-center gap-2 text-gray-600 bg-gray-200 py-1 px-2 rounded">
        <feather-icon type="sliders" size="18" class="text-gray-600" />
        <span>{{ $t('Projects Filter') }}</span>
      </div>
    </div>
    <div
      :class="[{ 'hidden': !open }, 'items']"
    >
      <div
        class="item flex items-center justify-between"
        v-if="extraOption"
        aria-hidden="true"
        @click="extraOptionClickHandler"
      >
        <label :class="{'text-primary-500': extraOption.checked}">
          {{ extraOption.title }}
        </label>
        <ui-simple-checkbox
          :checked="extraOption.checked"
        />
      </div>
      <div
        v-for="(option, i) of options"
        :key="i"
        class="item flex items-center justify-between"
        aria-hidden="true"
        @click="optionClickHandler(option?.value, i)"
      >
        <label :class="{'text-primary-500': option.checked}">
          {{ option?.title }}
        </label>
        <ui-simple-checkbox
          :checked="option.checked"
        />
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
import UiSimpleCheckbox from '@/components/ui/UiSimpleCheckbox.vue';
import { MultiSelectOptionType } from '@/components/types';

export default defineComponent({
  components: {
    UiSimpleCheckbox,
  },

  props: {
    options: {
      type: Array as PropType<MultiSelectOptionType[]>,
      required: true,
    },
    selected: {
      type: Array as PropType<MultiSelectOptionType[]>,
      required: false,
    },
    extraOption: {
      type: Object as PropType<MultiSelectOptionType>,
      required: false,
    },
  },

  emits: ['change', 'onClose'],

  data() {
    return {
      open: false,
      focus: false,
      dropdownSelectHeight: '',
      innerSelectWidth: 0,
      innerSelectChildWidth: 0,
      innerSelectArrayStoreWidths: [] as Array<number>,
      selectedArraySlice: [] as MultiSelectOptionType[],
      windowWidth: window.innerWidth,
    };
  },

  computed: {
    innerSelectWidthInner(): number {
      return this.innerSelectWidth - 45;
    },

    hideOverflowStores(): boolean {
      return this.innerSelectChildWidth > this.innerSelectArrayStoreWidthsSum;
    },

    innerSelectArrayStoreWidthsSum(): number {
      return this.innerSelectArrayStoreWidths
        .reduce((acc, number) => acc + number, 0) + ((this.innerSelectArrayStoreWidths.length - 1) * 8) + 48;
    },

    overflowNumbersOfStores(): number {
      return this.selected ? this.selected.length - this.selectedArraySlice.length : 0;
    },
  },

  watch: {
    windowWidth() {
      this.getInnerSelectWidth();
    },

    selected() {
      this.$nextTick(() => {
        this.storeCollectsWidth();
      });
    },
  },

  mounted() {
    this.dropdownSelectHeight = `${
      (this.$refs.dropdownSelect as HTMLElement).clientHeight
    }px`;

    this.getInnerSelectWidth();

    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });

    if (this.selected?.length) {
      this.storeCollectsWidth();
    }
  },

  methods: {
    selectBlurHandler() {
      this.open = false;
      this.focus = false;
      this.$emit('onClose');
    },

    selectedClickHandler() {
      this.open = !this.open;
      this.focus = true;
    },

    optionClickHandler(value: string, index: number) {
      this.$emit('change', value, index);
    },

    extraOptionClickHandler() {
      this.$emit('change', 'extra');
    },

    onResize() {
      this.windowWidth = window.innerWidth;
      this.storeCollectsWidth();
    },

    getInnerSelectWidth() {
      this.innerSelectWidth = (this.$refs.innerSelect as HTMLElement).clientWidth;
    },

    storeCollectsWidth() {
      const childElem = (this.$refs.innerSelect as HTMLElement).children[0].children[0];
      this.innerSelectChildWidth = childElem.clientWidth;
      const childElemChildren = childElem.children;
      this.innerSelectArrayStoreWidths = [...childElemChildren]
        .map((item) => item.clientWidth) as Array<number>;
      this.selectedArray();
    },

    selectedArray() {
      const array = this.selected ? [...this.selected] : this.selected;
      while (this.innerSelectArrayStoreWidthsSum >= this.innerSelectWidthInner) {
        this.innerSelectArrayStoreWidths = this.innerSelectArrayStoreWidths
          .slice(0, this.innerSelectArrayStoreWidths.length - 1);
      }
      this.selectedArraySlice = array?.slice(0, this.innerSelectArrayStoreWidths.length) as MultiSelectOptionType[];
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
    @apply py-1 px-2 pr-9 cursor-pointer select-none rounded border border-gray-200;
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
  @apply absolute pointer-events-none top-1/2 right-2;
  transform: translateY(-50%);
}

.dropdown-select {
  .items {
    @apply absolute bg-white border border-gray-400 rounded left-0 right-0 overflow-hidden z-1 py-2;
    top: calc(v-bind(dropdownSelectHeight));
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
  }
}

.dropdown-select {
  .items .item {
    @apply py-1 px-4 cursor-pointer select-none hover:bg-gray-300;
  }

  .items .line {
    @apply h-1px w-full p-0 bg-gray-300 my-2 hover:bg-gray-300;
  }
}
</style>
