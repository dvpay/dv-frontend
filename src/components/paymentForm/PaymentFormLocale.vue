<template>
  <div
    class="dropdown-menu"
    @click.stop
  >
    <ul>
      <li
        v-for="(locale, i) in localeOptions" :key="i"
        aria-hidden="true"
        class="dropdown-menu-item"
        :class="{ 'dropdown-menu-item-selected': locale.value === selectedLocale.value }"
        @click="clickHandler(locale.value)"
      >
        <img :src="icon(`${locale.value}.svg`)" :alt="locale.value">
        <span class="text-sm">
          {{ locale.title }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { icon } from '@/utils';

export default defineComponent({
  props: {
    localeOptions: {
      type: Array,
    },
    selectedLocale: {
      type: Object as PropType<{ value: string }>,
    },
  },

  emits: ['changeLocale', 'closeLocaleSelectDropdown'],

  methods: {
    icon,

    clickHandler(value: string) {
      this.chageHandler(value);
      this.closeHandler();
    },

    chageHandler(value: string) {
      this.$emit('changeLocale', value);
    },

    closeHandler() {
      this.$emit('closeLocaleSelectDropdown');
    },
  },
});
</script>

<style lang="scss" scoped>
.dropdown-menu {
  color: theme('colors.dark-gray');
  padding: 8px;
  position: absolute;
  right: 0;
  bottom: 55px;
  left: auto;
  background: #fff;
  box-shadow: 0 15px 30px rgba(88, 95, 107, 0.18);
  border-radius: 20px;
}

.dropdown-menu-item {
  @apply py-6px pl-6px pr-16px text-center font-600 box-border cursor-pointer;
  @apply grid items-center grid-cols-[24px,1fr] gap-2;

  &:hover {
    @apply bg-gray-200 rounded-48px;
  }
}

.dropdown-menu-item-selected {
  @apply rounded-48px text-white font-500;
  @apply bg-dark-gray #{!important};
}
</style>
