<template>
  <div class="pages relative">
    <choose-cryptocurrency v-if="step === 1" />
    <invoice-data v-if="step === 2" />
    <invoice-confirmation v-if="step === 3" />
    <invoice-success v-if="step === 4" />
    <div
      v-if="!payer.store.staticAddress"
      class="absolute w-full h-full bottom-0 left-0 bg-s-gray rounded-20px"
    >
      <div class="flex items-center justify-center h-full w-full text-dark-gray text-22px font-600">
        {{ $t('Static Addresses Disabled') }}
      </div>
    </div>
    <!-- <div class="h-60px min-h-60px w-full" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import ChooseCryptocurrency from '@/components/payerForm/steps/ChooseCryptocurrency.vue';
import InvoiceData from '@/components/payerForm/steps/InvoiceData.vue';
import InvoiceConfirmation from '@/components/payerForm/steps/InvoiceConfirmation.vue';
import InvoiceSuccess from '@/components/payerForm/steps/InvoiceSuccess.vue';

export default defineComponent({
  components: {
    InvoiceSuccess,
    InvoiceConfirmation,
    InvoiceData,
    ChooseCryptocurrency,
  },

  computed: {
    ...mapState('payer', {
      step: 'stepPayment',
      payer: 'payer',
    }),
  },
});
</script>

<style lang="scss" scoped>
.pages {
  @apply flex flex-col flex-grow p-18px lg:p-24px rounded-16px border-1 border-secondary-100;
  background: linear-gradient(90deg, rgba(52, 74, 119, 0.1) 0%, rgba(52, 74, 119, 0.05) 50%, rgba(52, 74, 119, 0.1) 100%);
}
</style>
