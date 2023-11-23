<template>
  <div class="invoice relative">
    <payment-form-header />
    <div class="body relative">
      <payment-form-invoice-id v-if="!invoiceMsgStatus.formHide" />
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
        <payment-form-pages v-else />
      </div>
      <payment-form-nav-buttons-hide
        v-if="invoiceMsgStatus.formHide && page === 1"
      />
      <payment-form-nav-buttons v-else />
      <div v-if="invoice.storeStatus === 0" class="disabled-store">
        {{ $t('payments_suspended_text') }}
      </div>
    </div>
    <payment-form-footer />
    <div
      aria-hidden="true"
      class="payment-details-backdrop z-100"
      :class="{'payment-details-show': isShowPaymentDetails}"
      @click="closePaymentDetailsHandler"
    >
    </div>
    <div
      aria-hidden="true"
      ref="paymentDetails"
      class="payment-details-wrapper z-101"
      :class="{'payment-details-show': isShowPaymentDetails}"
      @click.stop
    >
      <payment-details />
      <payment-form-footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import PaymentFormHeader from '@/components/paymentForm/PaymentFormHeader.vue';
import PaymentFormInvoiceId from '@/components/paymentForm/PaymentFormInvoiceId.vue';
import PaymentFormPages from '@/components/paymentForm/PaymentFormPages.vue';
import PaymentFormNavButtons from '@/components/paymentForm/PaymentFormNavButtons.vue';
import PaymentFormNavButtonsHide from '@/components/paymentForm/PaymentFormNavButtonsHide.vue';
import PaymentFormFooter from '@/components/paymentForm/PaymentFormFooter.vue';
import PaymentDetails from '@/components/paymentForm/PaymentDetails.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    PaymentFormHeader,
    PaymentFormInvoiceId,
    PaymentFormPages,
    PaymentFormNavButtons,
    PaymentFormNavButtonsHide,
    PaymentFormFooter,
    PaymentDetails,
    UiSkeletonBox,
  },

  data() {
    return {
      invoiceUpdateTimer: 0 as unknown as ReturnType<typeof setTimeout>,
      isInvoiceWatch: false,
      count: 1,
    };
  },

  computed: {
    ...mapState('invoice', {
      invoice: 'invoice',
      invoiceMsgStatus: 'invoiceMsgStatus',
      invoiceAddresses: 'invoiceAddresses',
      loading: 'loading',
      isShowPaymentDetails: 'isShowPaymentDetails',
      page: 'currentPage',
    }),

    invoiceId() {
      return this.$route.params.invoice_id;
    },
  },

  watch: {
    invoice() {
      this.pollingInvoiceData();
      this.setActiveCurrency();
      this.redirectToSuccessUrl();
      this.isInvoiceWatch = true;
    },
  },

  beforeMount() {
    this.loadInvoiceData(this.invoiceId);
    this.setLoading(true);
  },

  beforeUnmount() {
    clearTimeout(this.invoiceUpdateTimer);
    this.clearInvoiceData();
  },

  methods: {
    ...mapMutations('invoice', [
      'clearInvoiceData',
      'setLoading',
      'setIsShowPaymentDetails',
      'setSelectedCryptocurrency',
      'setSelectedNetwork',
      'setSelectedCryptocurrencyAndNetwork',
      'setStepPayment',
    ]),
    ...mapActions('invoice', [
      'loadInvoice',
      'loadInvoiceData',
    ]),

    redirectToSuccessUrl() {
      if (
        (
          this.invoice.status === 'paid'
          || this.invoice.status === 'overpaid'
          || this.invoice.status === 'success'
        )
        && this.count !== 1
        && this.invoice.successUrl
      ) {
        const link = document.createElement('a');
        link.href = this.invoice.successUrl;
        link.click();
      }
      this.count += 1;
    },

    pollingInvoiceData() {
      this.invoiceUpdateTimer = setTimeout(() => {
        if (
          this.invoice.status === 'waiting'
          || this.invoice.status === 'partially_paid'
          || this.invoice.status === 'waiting_confirmations'
        ) {
          clearTimeout(this.invoiceUpdateTimer);
          this.loadInvoice(this.invoiceId);
        } else {
          clearTimeout(this.invoiceUpdateTimer);
        }
      }, import.meta.env.VITE_INVOICE_POLLING_TIMEOUT * 1000);
    },

    closePaymentDetailsHandler() {
      this.setIsShowPaymentDetails(false);
    },

    setActiveCurrency() {
      if (!this.isInvoiceWatch && this.invoice.paymentMethod) {
        const currency = this.invoice.paymentMethod.split('.')[0];
        const blockchain = this.invoice.paymentMethod.split('.')[1];
        this.setSelectedCryptocurrency({ symbol: currency, value: this.invoice.paymentMethod });
        this.setSelectedNetwork({ blockchain, value: this.invoice.paymentMethod });
        this.setSelectedCryptocurrencyAndNetwork(this.invoice.paymentMethod);
        this.setStepPayment(3);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.invoice {
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
