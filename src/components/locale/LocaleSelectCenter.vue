<template>
  <div
    aria-hidden="true"
    class="locale-dropdown"
    @click="showLocaleSelectDropdown"
    v-click-out="closeLocaleSelectDropdown"
  >
    <div class="flex items-center gap-3">
      <i class="fi" :class="selectedLocaleOption.flagIconClass"></i>
      <span class="text-sm">
        {{ selectedLocaleOption.title }}
      </span>
      <feather-icon
        type="chevron-down"
        size="18"
        class="angle-down"
      />
    </div>
    <locale-select-dropdown-center
      v-if="isShowLocaleSelectDropdown"
      class="top-42px right-10px"
      :locale-options="localeOptions"
      @change-locale="changeLocaleHandler"
      @close-locale-select-dropdown="closeLocaleSelectDropdown"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LocaleSelectDropdownCenter from '@/components/locale/LocaleSelectDropdownCenter.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default defineComponent({
  components: {
    LocaleSelectDropdownCenter,
  },

  data() {
    return {
      isShowLocaleSelectDropdown: false,
    };
  },

  computed: {
    ...mapGetters('app', {
      selectedLocaleOption: 'selectedLocaleOption',
    }),
    ...mapState('app', {
      localeOptions: 'localeOptions',
    }),
  },

  methods: {
    showLocaleSelectDropdown() {
      this.isShowLocaleSelectDropdown = !this.isShowLocaleSelectDropdown;
    },

    closeLocaleSelectDropdown() {
      this.isShowLocaleSelectDropdown = false;
    },

    changeLocaleHandler(value: string) {
      this.setLocale(value);
      this.$i18n.locale = value;
    },

    ...mapMutations('app', ['setLocale']),
  },
});
</script>

<style lang="scss" scoped>
.locale-dropdown {
  @apply absolute cursor-pointer px-2 py-1 rounded border border-gray-200;
  @apply focus:border-gray-400 hover:border-gray-400;
  left: 50%;
  transform: translateX(-50%)
}
</style>
