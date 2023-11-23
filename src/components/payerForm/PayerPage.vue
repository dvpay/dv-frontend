<template>
  <div
    class="pages relative min-h-560px"
  >
    <choose-cryptocurrency v-if="step === 1" />
    <select-network v-if="step === 2" />
    <invoice-data v-if="step === 3" />

    <div
      v-if="!payer.store.staticAddress"
      class="absolute w-full h-full bottom-0 left-0 bg-s-gray rounded-20px"
    >
      <div class="flex items-center justify-center h-full w-full text-dark-gray text-22px font-600">
        {{ $t('Static Addresses Disabled') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import ChooseCryptocurrency from '@/components/payerForm/steps/ChooseCryptocurrency.vue';
import SelectNetwork from '@/components/payerForm/steps/SelectNetwork.vue';
import InvoiceData from '@/components/payerForm/steps/InvoiceData.vue';

export default defineComponent({
  components: {
    ChooseCryptocurrency,
    SelectNetwork,
    InvoiceData,
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
  @apply p-20px bg-s-gray;
  @apply border-2 border-x-gray rounded-20px;
}
</style>
