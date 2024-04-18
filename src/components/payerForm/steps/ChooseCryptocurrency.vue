<template>
  <div class="flex flex-col gap-16px py-8px">
    <div
      v-for="(item, i) in searchedCryptocurrency"
      :key="i"
      aria-hidden="true"
      class="cryptocurrency-item"
      :class="{'cryptocurrency-item-selected': selectedCryptocurrency.symbol === item.symbol}"
      @click="selectHandler(item.symbol, item.value)"
    >
      <div class="flex items-center gap-2">
        <img
          class="w-32px"
          :src="image(`${item.symbol}.svg`)"
          :alt="item.symbol"
        >
        <div class="flex flex-col">
          <span class="text-18px leading-24px lg:text-xl font-500">{{ item.currency }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span
          v-if="currencyAmount[item.value]"
          class="cryptocurrency-item-amount"
        >
          {{ `~ ${currencyAmount[item.value]} ${item.symbol}` }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import { image } from '@/utils';

interface ICryptocurrencyOption {
  currency: string;
  value: string;
  amount: string;
  rate: string | number;
  symbol: string;
}

export default defineComponent({
  data() {
    return {
      searchValue: '',
    };
  },

  computed: {
    ...mapState('payer', {
      payerCurrencies: 'payerCurrencies',
      selectedCryptocurrency: 'selectedCryptocurrency',
      currencyRate: 'rateUsd',
      currencyAmount: 'amount',
    }),

    cryptocurrencyOptions(): ICryptocurrencyOption[] {
      return this.payerCurrencies.map((item: string) => {
        const symbol = item.split('.')[0];
        return {
          currency: symbol === 'USDT'
            ? `Tether (${symbol})`
            : `${item.split('.')[1]} (${symbol})`,
          value: item,
          symbol,
        };
      });
    },

    searchedCryptocurrency(): ICryptocurrencyOption[] {
      return this.cryptocurrencyOptions
        .filter((item) => item.currency.toLowerCase().includes(this.searchValue.toLowerCase()));
    },
  },

  created() {
    this.setSelectedCryptocurrency({ symbol: '', value: '' });
  },

  methods: {
    ...mapMutations('payer', ['setSelectedCryptocurrency', 'setSelectedNetwork']),
    image,

    selectHandler(symbol: string, value: string) {
      this.setSelectedCryptocurrency({ symbol, value });
      this.setSelectedNetwork({ blockchain: value.split('.')[1], value });
    },
  },
});
</script>

<style lang="scss" scoped>
.cryptocurrency-item {
  @apply flex flex-col lg:flex-row lg:justify-between gap-6px p-16px lg:py-21px lg:px-20px cursor-pointer min-h-80px;
  @apply bg-white border-2 border-gray-400 rounded-12px;
  transition: all .2s ease;

  &:hover {
    @apply border-2 border-blue-300 #{!important}
  }
}

.cryptocurrency-item-selected {
  @apply border-2 border-blue-300 #{!important}
}

.cryptocurrency-item-amount {
  @apply text-14px leading-20px lg:text-16px font-500 text-secondary-900;
  opacity: 0.9;
}
</style>
