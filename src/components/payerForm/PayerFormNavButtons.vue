<template>
  <div
    class="grid items-center h-full"
    :class="[`buttons-container-${step}`]"
  >
    <template v-if="step === 1">
      <button
        class="cancel-btn"
        @click="cancelHandler"
      >
        <span class="flex items-center justify-center text-secondary-700 bg-gray-300 mr-2 rounded-8px border-1 border-gray-400 w-32px h-32px">
          <feather-icon
            class="margin-auto"
            type="x"
            size="15"
          />
        </span>
        <span class="hidden lg:inline text-gray-600 font-600 text-12px uppercase tracking-[.96px]">
          {{ $t('Cancel') }}
        </span>
      </button>
      <hr class="separator" />
      <div v-if="amount" class="amount flex flex-nowrap justify-end">
        <span class="text-24px leading-32px text-secondary-900 font-400 mr-8px">$</span>
        <span class="text-24px leading-32px text-secondary-900 font-600">{{ this.amount }}</span>
      </div>
      <button
        class="next-btn"
        :disabled="disabledNext"
        @click="nextStepHandler"
      >
        <span class="title">
          {{ $t('Next step') }}
        </span>
        <span class="arrow">
          <feather-icon
            type="arrow-right"
            size="24"
          />
        </span>
      </button>
    </template>
    <template v-if="step === 2">
      <button
        class="back-btn"
        @click="backHandler"
      >
        <span class="flex items-center justify-center text-secondary-700 bg-gray-300 mr-2 rounded-8px border-1 border-gray-400 w-32px h-32px">
          <feather-icon
            class="margin-auto"
            type="arrow-left"
            size="18"
          />
        </span>
        <span class="hidden lg:inline text-gray-600 font-600 text-12px uppercase tracking-[.9px]">
          {{ $t('Back') }}
        </span>
      </button>
      <hr class="separator" />
      <div v-if="amount" class="amount flex flex-nowrap justify-end">
        <span class="text-24px leading-32px text-secondary-900 font-400 mr-8px">$</span>
        <span class="text-28px leading-32px text-secondary-900 font-600">{{ this.amount }}</span>
      </div>
    </template>
    <template v-if="step === 3 || step === 4">
      <div
        v-if="payer.store.siteUrl"
        class="back-step"
        @click="cancelHandler"
      >
        <span class="flex items-center justify-center text-secondary-900 rounded-8px border-2 border-secondary-900 w-22px min-w-22px h-22px mr-2">
          <feather-icon
            type="chevron-left"
            size="16"
          />
        </span>
        <span class="text-12px leading-24px text-secondary-900 font-600 tracking-[.8px] truncate">
          {{ $t('Return to merchant page') }}
        </span>
      </div>
      <div v-if="amount" class="amount flex flex-nowrap justify-end">
        <span class="text-24px leading-32px text-secondary-900 font-400 mr-8px">$</span>
        <span class="text-28px leading-32px text-secondary-900 font-600">{{ this.amount }}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';

export default defineComponent({
  data() {
    return {
      isShowLocaleSelectDropdown: false,
    };
  },

  computed: {
    ...mapState('payer', {
      step: 'stepPayment',
      payer: 'payer',
      selectedCryptocurrency: 'selectedCryptocurrency',
      selectedNetwork: 'selectedNetwork',
    }),

    disabledNext(): boolean {
      if (this.step === 1) {
        return !this.selectedCryptocurrency.symbol;
      }
      return true;
    },

    amount() {
      const amount = this.$route.query.amount;
      if (Number(amount)
        && (Number(amount) > 0 && Number(amount) < 10 ** 6)
        && !amount?.includes('e')
      ) {
        return amount;
      }
      return '';
    },
  },

  methods: {
    ...mapMutations('payer', [
      'setStepPayment',
      'setSelectedCryptocurrencyAndNetwork',
    ]),

    nextStepHandler() {
      this.$router.push({ query: {
        ...this.$route.query,
        currency: `${this.selectedCryptocurrency.symbol}.${this.selectedNetwork.blockchain}`,
      } });
      this.setStepPayment(this.step + 1);
      this.setSelectedCryptocurrencyAndNetwork(`${this.selectedCryptocurrency.symbol}.${this.selectedNetwork.blockchain}`);
    },

    backHandler() {
      this.removeCurrencyQueryParam();
      this.setStepPayment(1);
    },

    cancelHandler() {
      if (this.payer.store.returnUrl) {
        window.location.replace(this.payer.store.returnUrl);
      } else if (this.payer.store.siteUrl) {
        window.location.replace(this.payer.store.siteUrl);
      }
    },

    removeCurrencyQueryParam() {
      const currentParams = { ...this.$route.query };

      if ('currency' in currentParams) {
        delete currentParams.currency;
      }

      const newUrl = {
        path: this.$route.path,
        query: currentParams,
      };

      this.$router.push(newUrl);
    },
  },
});
</script>

<style lang="scss" scoped>
.buttons-container-1 {
  @apply gap-8px lg:gap-16px;
  grid-template-areas: "cancel separator amount next";
  grid-template-columns: auto 1px 2fr 1fr;
  align-items: center;
}

.buttons-container-2 {
  @apply gap-8px lg:gap-16px;
  grid-template-areas: "back separator amount";
  grid-template-columns: auto 1px 1fr;
  align-items: center;
}

.buttons-container-3 {
  @apply gap-8px lg:gap-16px;
  grid-template-areas: "back amount";
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
}

.buttons-container-4 {
  @apply gap-8px lg:gap-16px;
  grid-template-areas: "back amount";
  grid-template-columns: auto 1fr;
  align-items: center;
}

.next-btn {
  grid-area: next;
}

.back-btn {
  grid-area: back;
}

.next-step {
  grid-area: next;
}

.cancel-btn {
  grid-area: cancel;
}

.separator {
  grid-area: separator;
}

.amount {
  grid-area: amount;
}

.back-step,
.next-step {
  @apply flex items-center justify-center overflow-auto bg-white hover:bg-gray-100 rounded-6px px-16px py-8px max-h-40px min-h-40px max-w-max;
  @apply uppercase text-12px text-secondary-900 font-600 tracking-wider whitespace-nowrap leading-24px gap-2 cursor-pointer;
  box-shadow: 0 4px 32px rgba(55, 70, 100, 0.2);
  transition: all .2s ease;

  &:hover {
    box-shadow: 0 6px 32px rgba(55, 70, 100, 0.3);
  }

  &:disabled {
    @apply opacity-25
  }
}

.cancel-btn,
.back-btn {
  @apply flex items-center cursor-pointer;
  transition: opacity .2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.next-btn {
  @apply inline-flex shadow-md rounded-8px ml-auto;
  width: fit-content;
  transition: all .2s ease;

  &:hover {
    opacity: 0.9;
  }

  .title {
    @apply bg-success-250 text-14px leading-20px tracking-[.1em] text-white leading-20px font-600 py-11px px-28px rounded-l-8px uppercase;
    @apply block whitespace-nowrap;
  }

  .arrow {
    @apply flex items-center justify-center bg-success-600 text-white font-bold py-9px rounded-r-8px nim-w-42px w-42px;
  }

  &:disabled {
    @apply opacity-25
  }
}

.separator {
  width: 1px;
  height: 100%;
  background-image: linear-gradient(to top, theme('colors.gray.600') 40%, transparent 40%);
  background-size: 1px 4px;
  background-repeat: repeat-y;
}
</style>
