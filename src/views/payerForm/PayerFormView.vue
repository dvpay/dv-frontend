<template>
  <div class="payer relative">
    <payer-form-header />
    <div class="body relative">
      <div class="flex flex-col gap-4px">
        <span
          v-if="amount"
          class="text-2xl font-600"
        >
          {{ this.amount }} USD
        </span>
        <span class="text-xs leading-14px font-600 text-md-gray">
          {{ payerId }}
        </span>
      </div>
      <div class="body-content">
        <div
          v-if="loading"
          class="w-full h-full left-0 top-0 border-x-gray rounded-20px overflow-hidden"
        >
          <ui-skeleton-box
            height="560px"
            width="100%"
          />
        </div>
        <payer-page v-else />
      </div>
      <payer-form-nav-buttons />
      <div v-if="payer.store.status === 0" class="disabled-store">
        {{ $t('payments_suspended_text') }}
      </div>
    </div>
    <payer-form-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import PayerFormHeader from '@/components/payerForm/PayerFormHeader.vue';
import PayerPage from '@/components/payerForm/PayerPage.vue';
import PayerFormNavButtons from '@/components/payerForm/PayerFormNavButtons.vue';
import PayerFormFooter from '@/components/payerForm/PayerFormFooter.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    PayerFormHeader,
    PayerPage,
    PayerFormNavButtons,
    PayerFormFooter,
    UiSkeletonBox,
  },

  data() {
    return {
      payerUpdateTimer: 0 as unknown as ReturnType<typeof setTimeout>,
      count: 1,
    };
  },

  computed: {
    ...mapState('payer', {
      loading: 'loading',
      payer: 'payer',
    }),

    payerId() {
      return this.$route.params.payer_id;
    },

    paymentMethod() {
      return this.$route.query.currency;
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

  watch: {
    payer() {
      this.pollingData();
      this.setActiveCurrency();
    },
  },

  beforeMount() {
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

    pollingData() {
      this.payerUpdateTimer = setTimeout(() => {
        clearTimeout(this.payerUpdateTimer);
        this.loadPayer(this.payerId);
      }, import.meta.env.VITE_INVOICE_POLLING_TIMEOUT * 1000);
    },

    setActiveCurrency() {
      if (this.paymentMethod && this.payer.currency.length) {
        const isPaymentMethodExist = this.payer.currency
          .some((item: string) => item === this.paymentMethod);

        if (isPaymentMethodExist) {
          const currency = this.paymentMethod.toString().split('.')[0];
          const blockchain = this.paymentMethod.toString().split('.')[1];
          this.setSelectedCryptocurrency({ symbol: currency, value: this.paymentMethod });
          this.setSelectedNetwork({ blockchain, value: this.paymentMethod });
          this.setSelectedCryptocurrencyAndNetwork(this.paymentMethod);
          this.setStepPayment(3);
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.payer {
  @apply rounded-8px overflow-hidden text-dark-gray;
  box-shadow: 0 25px 70px rgba(97, 103, 112, 0.2);
}

.body {
  @apply p-20px bg-white flex flex-col gap-15px;
}

.payment-details-backdrop {
  @apply w-full absolute top-70px h-full;
  transition: all .2s ease-in-out;
  transform: translateY(1000px);
}

.payment-details-wrapper {
  @apply w-full absolute bottom-0;
  transition: all .2s ease-in-out;
  transform: translateY(500px);
}

.payment-details-show {
  transform: translateY(0);
}

.disabled-store {
  @apply absolute top-0 left-0 w-full h-full bg-white z-10 overflow-hidden;
  @apply flex items-center justify-center text-center p-20px text-lg;
}
</style>
