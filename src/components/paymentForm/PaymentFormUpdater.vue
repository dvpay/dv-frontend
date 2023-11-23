<template>
  <div class="wrapper px-20px py-16px">
    <div
      v-if="!showConfirmBtn"
      class="flex items-center justify-between"
    >
      <div class="flex flex-col gap-1">
        <div class="leading-22px text-base font-600">
          1 {{ invoiceAddresses[selectedIndex]?.currency.split('.')[0] }}
          =
          {{ invoiceAddresses[selectedIndex]?.rate }} USD
        </div>
        <div class="rate-description">
          {{ invoiceAddresses[selectedIndex]?.currency.split('.')[0] }}
          {{ $t('rate frozen for 10 min') }}
        </div>
      </div>
      <div>
        <payment-form-countdown />
      </div>
    </div>
    <div
      v-else
      class="flex items-center justify-between"
    >
      <div class="flex flex-col gap-1">
        <div class="leading-22px text-base font-600">
          {{ $t('Your payment has been received') }}
        </div>
        <div class="confirm-description">
          {{ $t('Please confirm payment') }}
        </div>
      </div>
      <ui-button-loading
        class="confirm-btn"
        :loading="confirmBtnLoading"
        spinner-color="#585961"
        @click="confirmInvoiceHandler"
      >
        {{ $t('Confirm payment') }}
      </ui-button-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import PaymentFormCountdown from '@/components/paymentForm/PaymentFormCountdown.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';

export default defineComponent({
  components: {
    PaymentFormCountdown,
    UiButtonLoading,
  },

  data() {
    return {
      confirmBtnLoading: false,
    };
  },

  computed: {
    ...mapState('invoice', {
      invoice: 'invoice',
      invoiceAddresses: 'invoiceAddresses',
      selectedCurrency: 'selectedCryptocurrencyAndNetwork',
    }),
    ...mapGetters('invoice', {
      selectedFindIndex: 'selectedCryptocurrencyIndex',
    }),

    invoiceId() {
      return this.$route.params.invoice_id;
    },

    selectedIndex(): number {
      return this.selectedFindIndex(this.selectedCurrency);
    },

    showConfirmBtn(): boolean {
      return this.invoice.status === 'partially_paid'
        || this.invoice.status === 'waiting_confirmations';
    },
  },

  methods: {
    ...mapActions('invoice', ['confirmInvoice']),

    async confirmInvoiceHandler() {
      try {
        this.confirmBtnLoading = true;
        await this.confirmInvoice(this.invoiceId);
        this.confirmBtnLoading = false;
        this.$toast.success(this.$t('Payment confirmed'));
      } catch (e) {
        this.confirmBtnLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  box-shadow: 0 5px 5px rgba(53, 55, 62, 0.25), 0 5px 40px 3px rgba(50, 53, 57, 0.2);
  background-color: #595A62;
  color: #fff;
}

.rate-description,
.confirm-description {
  color: #D8DAEA;
  font-size: 12px;
  line-height: 14px;
}

.confirm-btn {
  @apply font-600 bg-white h-40px py-10px px-20px rounded-20px;
  @apply whitespace-nowrap cursor-pointer hover:opacity-90;
  color: #585961;
}
</style>
