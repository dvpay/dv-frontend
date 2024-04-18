<template>
  <div class="payer w-full min-h-screen bg-gray-light flex items-center flex-col">
    <div class="header w-full flex items-center justify-between flex-nowrap gap-4 py-4 px-4 lg:px-0 max-w-480px lg:max-w-646px">
      <logo-payer/>
      <div class="flex items-center gap-2">
        <div
          aria-hidden="true"
          class="relative z-99"
          @click="showDropdownMenu"
          v-click-out="closeLocaleSelectDropdown"
        >
          <div class="language">
            <ui-flag
              :iso-code="selectedLocaleOption?.value"
            />
            <feather-icon
              class="ml-1 text-blue-400"
              type="chevron-down"
              size="16"
            />
          </div>
          <payment-form-locale
            v-if="isShowLocaleSelectDropdown"
            :selected-locale="selectedLocaleOption"
            :locale-options="localeOptions"
            @change-locale="changeLocaleHandler"
            @close-locale-select-dropdown="closeLocaleSelectDropdown"
          />
        </div>
        <a href="https://dv.net/" class="sign-in z-99" target="_blank" ref="noopener noreferrer">
          <span class="hidden lg:inline">{{ $t('Sign in') }} / {{ $t('Sign up')}}</span>
          <img
            class="lg:ml-4px text-blue-400"
            :src="image(`icons/signin.svg`)"
            alt="sign-in"
          />
        </a>
      </div>
    </div>
    <div class="w-full flex flex-col flex-grow mt-2 px-16px lg:px-0 max-w-480px lg:max-w-646px">
      <slot />
    </div>
    <div class="footer-bg relative w-full -mt-20px z-99">
      <div class="m-auto flex w-full min-h-82px max-h-82px max-w-480px lg:max-w-646px">
        <payer-form-footer/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LogoPayer from '@/components/payerForm/LogoPayer.vue';
import PaymentFormLocale from '@/components/paymentForm/PaymentFormLocale.vue';
import PayerFormFooter from '@/components/payerForm/PayerFormFooter.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';
import { icon, image } from '@/utils';
import UiFlag from '@/components/ui/UiFlag.vue';

export default defineComponent({
  components: { UiFlag, PayerFormFooter, PaymentFormLocale, LogoPayer },

  data() {
    return {
      isShowLocaleSelectDropdown: false,
    };
  },

  computed: {
    ...mapState('app', {
      localeOptions: 'localeOptions',
    }),
    ...mapGetters('app', {
      selectedLocaleOption: 'selectedLocaleOption',
    }),
  },

  methods: {
    image,
    ...mapMutations('app', ['setLocale']),

    icon,

    showDropdownMenu() {
      this.isShowLocaleSelectDropdown = !this.isShowLocaleSelectDropdown;
    },

    closeLocaleSelectDropdown() {
      this.isShowLocaleSelectDropdown = false;
    },

    changeLocaleHandler(value: string) {
      this.setLocale(value);
      this.$i18n.locale = value;
    },
  },
});
</script>

<style lang="scss" scoped>
.payer {
  font-family: 'Inter', sans-serif;
}
.header {
  .language {
    @apply max-h-40px min-h-40px bg-white hover:bg-gray-100 rounded-6px px-10px pl-12px pr-4px shadow-md hover:shadow-lg;
    @apply flex items-center cursor-pointer text-sm text-secondary-900 min-w-56px;
    transition: all .2s ease;
  }

  .sign-in {
    @apply max-h-40px min-h-40px bg-white hover:bg-gray-100 rounded-6px py-10px px-8px lg:px-18px shadow-md hover:shadow-lg;
    @apply flex items-center uppercase text-12px text-secondary-900 font-600 tracking-[.1em] whitespace-nowrap;
    transition: all .2s ease;
  }
}

.footer-bg {
  position: fixed;
  position: sticky;
  bottom: 0;
  box-shadow: 0 -4px 70px rgba(55, 70, 100, 0.1);
  background: rgba(255, 255, 255, 1);
  background: linear-gradient(0deg,rgba(232, 240, 247, 1), rgba(255, 255, 255, 1) 100%);
}
</style>
