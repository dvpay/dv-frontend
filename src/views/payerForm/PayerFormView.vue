<template>
  <payer-form-wrapper
    :loading="loading"
    :type="stepType"
    :show-close="!!payer.store.siteUrl"
    @close="cancelHandler"
  >
    <template v-slot:header>
      <div v-if="step === 1" class="title">
        {{ $t('Choose your cryptocurrency') }}
      </div>
      <div v-else-if="step === 2" class="title">
        {{ $t('Send your cryptocurrency') }}
      </div>
      <div v-else-if="step === 3" class="title">
        {{ $t('Waiting for network confirmation') }}
      </div>
      <div v-else-if="step === 4" class="title">
        {{ $t('Payment successfully') }}!
      </div>
      <div v-else-if="payer.store.name" class="title">
        {{ payer.store.name }}
      </div>
    </template>

    <template v-slot:sub-header>
      <div class="flex items-center justify-between gap-24px px-24px py-18px h-md:py-16px h-98px h-md:h-auto text-white">
        <div class="flex flex-col overflow-hidden">
          <span class="text-20px leading-[120%] mb-4px truncate text-nowrap">{{ payerId }}</span>
          <a v-if="payer.store.siteUrl" class="flex items-center hover:underline w-max max-w-full" target="_blank" :href="payer.store.siteUrl">
            <span class="text-14px leading-[125%] lg:text-16px lg:leading-[125%] font-500 text-white opacity-[.8]">{{ payer.store.name }}</span>
            <feather-icon
              class="block text-white ml-1 opacity-[.8]"
              type="external-link"
              size="16"
            />
          </a>
          <span v-else class="text-14px leading-[125%] lg:text-16px lg:leading-[125%] font-500 text-white opacity-[.8]">{{ payer.store.name }}</span>
        </div>
        <div v-if="amount" class="flex flex-nowrap text-26px lg:text-28px gap-4px">
          <span class="font-400">$</span>
          <span class="font-700">{{ amount }}</span>
        </div>
      </div>

      <div
        v-if="step === 2 && transactionsCount"
        class="dropdown"
      >
        <div
          class="px-24px py-16px cursor-pointer"
          @click="toggleOpen"
          v-click-out="close"
        >
          <div class="flex items-center justify-between gap-5">
            <div class="text-gray-200 text-16px lg:text-18px leading-20px lg:text-20px lg:leading:24px font-400 tracking-[.01em]">
              {{ $t('Show your payments to this wallet') }} ({{ $t('Total Count').toLowerCase() }}: {{ transactionsCount }})
            </div>
            <div class="dropdown-btn bg-blue-50 rounded-5px w-24px h-24px">
              <feather-icon
                class="block text-white p-3px"
                :class="{'open': isOpen}"
                type="chevron-down"
                size="18"
              />
            </div>
          </div>
        </div>
        <ui-collapse>
          <div
            v-if="isOpen"
            class="dropdown-body"
          >
            <payer-form-transactions :transactions="getPayerTransactions" />
          </div>
        </ui-collapse>
      </div>
    </template>

    <template v-slot:body>
      <transition>
        <div
          v-if="step === 2 && isOpen"
          class="backdrop"
        />
      </transition>
      <payer-page/>
      <div v-if="payer.store.status === 0" class="disabled-store">
        {{ $t('payments_suspended_text') }}
      </div>
    </template>
  </payer-form-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import PayerPage from '@/components/payerForm/PayerPage.vue';
import PayerFormTransactions from '@/components/payerForm/PayerFormTransactions.vue';
import UiCollapse from '@/components/ui/UiCollapse.vue';
import PayerFormWrapper from '@/components/payerForm/PayerFormWrapper.vue';

export default defineComponent({
  components: {
    PayerFormWrapper,
    UiCollapse,
    PayerFormTransactions,
    PayerPage,
  },

  data() {
    return {
      isOpen: false,
      payerUpdateTimer: 0 as unknown as ReturnType<typeof setTimeout>,
      count: 1,
      currentTime: 0,
      requestInProgress: false,
    };
  },

  computed: {
    ...mapState('payer', {
      loading: 'loading',
      payer: 'payer',
      step: 'stepPayment',
    }),
    ...mapGetters('payer', {
      getPayerTransactions: 'getTransactions',
    }),

    stepType() {
      switch (this.step) {
        case 3:
          return 'confirmation';
        case 4:
          return 'success';
        default:
          return 'default';
      }
    },

    paymentMethod() {
      return this.$route.query.currency;
    },

    payerId() {
      return this.$route.params.payer_id;
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

    transactionsCount() {
      return this.getPayerTransactions?.length ?? 0;
    },
  },

  watch: {
    payer() {
      this.pollingData();
      this.setActiveCurrency();
    },
  },

  beforeMount() {
    this.currentTime = new Date().getTime();
    this.loadPayer(this.payerId);
    this.setLoading(true);
    this.setAmountUsd(this.amount);
  },

  beforeUnmount() {
    clearTimeout(this.payerUpdateTimer);
  },

  methods: {
    ...mapMutations('payer', [
      'setLoading',
      'setSelectedCryptocurrency',
      'setSelectedNetwork',
      'setSelectedCryptocurrencyAndNetwork',
      'setStepPayment',
      'setAmountUsd',
    ]),
    ...mapActions('payer', [
      'loadPayer',
    ]),

    toggleOpen() {
      this.isOpen = !this.isOpen;
    },

    pollingData() {
      const polling = new Date().getTime() - this.currentTime;
      const tenMinutes = 10 * 60 * 1000;
      const oneHour = 60 * 60 * 1000;
      if (!this.requestInProgress) {
        if (polling < tenMinutes) {
          this.sendRequestTimeOut(3000);
        } else if (polling < oneHour) {
          this.sendRequestTimeOut(10000);
        } else {
          this.sendRequestTimeOut(60000);
        }
      }
    },

    async sendRequestTimeOut(timeout: number) {
      this.requestInProgress = true; // Set flag to true indicating request in progress
      this.payerUpdateTimer = setTimeout(() => {
        clearTimeout(this.payerUpdateTimer);
        this.loadPayer(this.payerId);
        this.pollingData();
        this.requestInProgress = false; // Reset flag when request is completed
      }, timeout);
    },

    setActiveCurrency() {
      if (this.paymentMethod && this.payer.currency.length) {
        const isPaymentMethodExist = this.payer.currency
          .some((item: string) => item === this.paymentMethod);

        if (isPaymentMethodExist) {
          const currency = this.paymentMethod.toString()
            .split('.')[0];
          const blockchain = this.paymentMethod.toString()
            .split('.')[1];
          this.setSelectedCryptocurrency({
            symbol: currency,
            value: this.paymentMethod
          });
          this.setSelectedNetwork({
            blockchain,
            value: this.paymentMethod
          });
          this.setSelectedCryptocurrencyAndNetwork(this.paymentMethod);
          if (this.step === 1) this.setStepPayment(2);
        }
      }
    },

    cancelHandler() {
      if (this.payer.store.returnUrl) {
        window.location.replace(this.payer.store.returnUrl);
      } else if (this.payer.store.siteUrl) {
        window.location.replace(this.payer.store.siteUrl);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.dropdown {
  border-top: 1px solid theme('colors.secondary.600');

  .dropdown-btn {
    .vue-feather {
      transition: all .2s ease;
    }

    .vue-feather.open {
      transform: rotate(180deg);
    }
  }

  .dropdown-body {
    z-index: 99;
    position: absolute;
    width: 100%;
  }
}

.title {
  @apply md:truncate font-500 text-22px lg:text-24px h-md:text-20px leading-32px text-white;
}

.body {
  .backdrop {
    background-color: rgba(0, 0, 0, var(--tw-bg-opacity));
    --tw-bg-opacity: 0.5;
    overflow-y: auto;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 98;
    transition: all .2s ease;
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity .2s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}

.disabled-store {
  @apply absolute top-0 left-0 w-full h-full bg-white z-10 overflow-hidden;
  @apply flex items-center justify-center text-center p-20px text-lg;
}
</style>
