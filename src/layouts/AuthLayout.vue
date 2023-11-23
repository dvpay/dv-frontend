<template>
  <div>
    <div class="bg-body-bg">
      <div
        aria-hidden="true"
        class="locale-dropdown"
        @click="showLocaleSelectDropdown"
        v-click-out="closeLocaleSelectDropdown"
      >
        <div class="flex items-center gap-2">
          <i class="fi" :class="selectedLocaleOption.flagIconClass"></i>
          <span class="text-sm">
            {{ selectedLocaleOption.title }}
          </span>
        </div>
        <locale-select-dropdown
          v-if="isShowLocaleSelectDropdown"
          class="top-50px right-10px"
          :locale-options="localeOptions"
          @change-locale="changeLocaleHandler"
          @close-locale-select-dropdown="closeLocaleSelectDropdown"
        />
      </div>
    </div>
    <div class="bg-body-bg w-full min-h-100vh flex">
      <div class="m-auto w-full max-w-md text-center px-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import LocaleSelectDropdown from '@/components/LocaleSelectDropdown.vue';

export default defineComponent({
  components: {
    LocaleSelectDropdown,
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
  @apply absolute cursor-pointer right-0 p-4;
}
</style>
