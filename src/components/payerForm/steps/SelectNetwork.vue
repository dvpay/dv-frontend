<template>
  <div>
    <div class="title mb-15px flex items-center gap-2 justify-center">
      <span>{{ $t('Select a network of') }}</span>
      <img
        v-if="selectedCryptocurrency.symbol"
        class="w-24px"
        :src="image(`${selectedCryptocurrency.symbol}.svg`)"
        :alt="selectedCryptocurrency.symbol"
      >
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
        :placeholder="$t('Search network')"
      />
    </div>
    <div class="flex flex-col gap-15px">
      <div
        v-for="(item, i) in searchedNetwork"
        :key="i"
        aria-hidden="true"
        class="network-item"
        :class="{'network-item-selected': selectedNetwork.blockchain === item.blockchain}"
        @click="selectHandler(item.blockchain, item.value)"
      >
        <img
          class="w-36px"
          :src="image(`${selectedCryptocurrency.symbol}.svg`)"
          :alt="item.symbol"
        >
        <span class="text-base">
          {{ item.title }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import { image } from '@/utils';

interface INetworkOption {
  title: string;
  value: string;
  blockchain: symbol;
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
      selectedNetwork: 'selectedNetwork',
    }),

    networkOptions(): INetworkOption[] {
      return this.payerCurrencies
        .filter((item: string) => {
          return item.split('.')[0] === 'USDT';
        })
        .map((item: string) => ({
          title: item.split('.')[1] === 'Tron'
            ? `TRC20 (${item.split('.')[0]})`
            : item.split('.')[1] === 'Eth'
              ? `ERC20 (${item.split('.')[0]})`
              : '?',
          value: item,
          blockchain: item.split('.')[1],
        }));
    },

    searchedNetwork(): INetworkOption[] {
      return this.networkOptions
        .filter((item) => item.title.toLowerCase().includes(this.searchValue.toLowerCase()));
    },
  },

  created() {
    this.setSelectedNetwork({ symbol: '', value: '' });
  },

  methods: {
    ...mapMutations('payer', ['setSelectedNetwork']),
    image,

    selectHandler(blockchain: string, value: string) {
      this.setSelectedNetwork({ blockchain, value });
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

.network-item {
  @apply flex items-center gap-2 py-10px px-16px cursor-pointer font-600;
  background: #fff;
  box-shadow: 0 12px 20px rgba(68, 75, 85, 0.05);
  border-radius: 48px;
  transition: all .1s ease;

  &:hover {
    @apply text-white;
    @apply bg-dark-gray #{!important};
  }
}

.network-item-selected {
  @apply text-white;
  @apply bg-dark-gray #{!important};
}
</style>
