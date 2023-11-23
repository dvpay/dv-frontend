<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Rates & Fees') }}
    </div>
    <div class="flex flex-col gap-8">
      <rates-source-and-scale />
      <currency-rates />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RatesSourceAndScale from '@/components/ratesAndFees/RatesSourceAndScale.vue';
import CurrencyRates from '@/components/ratesAndFees/CurrencyRates.vue';

export default defineComponent({
  components: {
    RatesSourceAndScale,
    CurrencyRates,
  },
});
</script>

<style lang="scss" scoped>
.form {
  @apply flex flex-col gap-10;
}
.form-group {
  @apply flex flex-col gap-2;
}
</style>
