<template>
  <choose-cryptocurrency v-if="step === 1" />
  <select-network v-if="step === 2" />
  <invoice-data v-if="step === 3" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import ChooseCryptocurrency from '@/components/paymentForm/steps/ChooseCryptocurrency.vue';
import SelectNetwork from '@/components/paymentForm/steps/SelectNetwork.vue';
import InvoiceData from '@/components/paymentForm/steps/InvoiceData.vue';

export default defineComponent({
  components: {
    ChooseCryptocurrency,
    SelectNetwork,
    InvoiceData,
  },

  computed: {
    ...mapState('invoice', {
      step: 'stepPayment',
    }),
  },
});
</script>

<style lang="scss" scoped>
</style>
