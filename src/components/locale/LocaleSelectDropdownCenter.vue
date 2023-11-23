<template>
  <div
    class="dropdown-locale"
    @click.stop
  >
    <ul>
      <li
        v-for="(locale, i) in localeOptions" :key="i"
        aria-hidden="true"
        class="dropdown-locale-item"
        @click="clickHandler(locale.value)"
      >
        <i class="fi" :class="locale.flagIconClass"></i>
        <span class="text-sm">
          {{ locale.title }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

  props: {
    localeOptions: {
      type: Array,
    },
  },

  emits: ['changeLocale', 'closeLocaleSelectDropdown'],

  methods: {
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
.dropdown-locale {
  @apply shadow-medium px-1 py-2;
  min-width: 160px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;

  &::before {
    content: "";
    width: 14px;
    height: 14px;
    background: #fff;
    position: absolute;
    top: -7px;
    left: 50%;
    margin-left: -5px;
    transform: rotate(45deg);
    border-top: 1px solid theme('colors.gray.200');
    border-left: 1px solid theme('colors.gray.200');
  }
}

.dropdown-locale-item {
  @apply flex items-center gap-2 px-2 py-2 cursor-pointer;

  &:hover {
    @apply bg-primary-100;

    .dropdown-menu-icon {
      @apply text-primary-500;
    }
  }
}
</style>
