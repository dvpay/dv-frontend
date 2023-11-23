<template>
  <div>
    <div class="title mb-15px">
      {{ $t('Choose your cryptocurrency') }}
    </div>
    <div class="input-wrapper mb-20px">
      <label for="search">
        <feather-icon type="search" size="18" class="search-icon" />
      </label>
      <input
        id="search"
        class="outline-none h-24px w-full text-center"
        v-model="searchValue"
        type="text"
        :placeholder="$t('Search cryptocurrency')"
      />
    </div>
    <div class="flex flex-col gap-15px">
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
            class="w-36px"
            :src="image(`${item.symbol}.svg`)"
            :alt="item.symbol"
          >
          <div class="flex flex-col">
            <span class="font-600 text-base">{{ item.currency }}</span>
            <span
              class="cryptocurrency-item-rate"
              v-if="currencyRate[item.value]"
            >
              {{ `${currencyRate[item.value]} USD` }}
            </span>
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
      if (symbol === 'USDT') {
        this.setSelectedCryptocurrency({ symbol, value });
      } else {
        this.setSelectedCryptocurrency({ symbol, value });
        this.setSelectedNetwork({ blockchain: value.split('.')[1], value });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  @apply text-center font-600 text-22px;
}

.input-wrapper {
  @apply relative py-10px px-16px;
  background: #fff;
  box-shadow: 0 12px 20px rgba(68, 75, 85, 0.05);
  border-radius: 100px;
}

.search-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: theme('colors.l-gray');
}

.cryptocurrency-item {
  @apply flex items-center justify-between gap-2 py-10px px-16px cursor-pointer;
  background: #fff;
  box-shadow: 0 12px 20px rgba(68, 75, 85, 0.05);
  border-radius: 48px;
  transition: all .1s ease;

  &:hover {
    @apply text-white;
    @apply bg-dark-gray #{!important};

    .cryptocurrency-item-rate,
    .cryptocurrency-item-amount {
      @apply text-white #{!important};
      @apply font-500;
    }
  }
}

.cryptocurrency-item-selected {
  @apply text-white;
  @apply bg-dark-gray #{!important};

  .cryptocurrency-item-rate,
  .cryptocurrency-item-amount {
    @apply text-white #{!important};
    @apply font-500;
  }
}

.cryptocurrency-item-rate {
  @apply text-l-gray text-xs font-600;
}

.cryptocurrency-item-amount {
  @apply font-600 text-l-gray;
}
</style>
