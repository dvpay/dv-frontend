<template>
  <div>
    <div
      v-if="skeletonLoading"
      class="grid gap-6 grid-cols-[1fr,1fr] mb-6"
    >
      <ui-skeleton-box
        v-for="i in 2" :key="i"
        width="100%"
        height="346px"
      />
    </div>
    <div v-else class="wallet-card-wrapper">
      <wallet-card
        v-for="(item, i) in walletsData"
        :key="i"
        :index="i"
        :title="item.blockchain"
        :exchange-direction="item.exchangeCurrenciesUserList"
        v-model:enabled-withdrawal="item.enabledWithdrawal"
        v-model:enabled-exchange="item.enabledExchange"
        v-model:deposit-wallets-selected="item.depositWalletsSelected"
        v-model:min-balance="item.minBalance"
        v-model:withdrawal-wallets-selected="item.withdrawalWalletsSelected"
        :deposit-wallets-options="depositWalletsOptions(item.chain)"
        :withdrawal-wallets-options="withdrawalWalletsOptions(item.withdrawalWallets, item.exchangeCurrenciesUserList)"
        :withdrawal-wallets="item.withdrawalWallets"
        :check-withdrawal-addresses="item.checkWithdrawalAddresses"
        :check-exchange-direction="item.checkExchangeDirection"
        @deleteWithdrawalWallet="deleteWithdrawalWallet"
        @addWithdrawalWallet="addWithdrawalWallet"
      />
    </div>
    <div class="flex items-center gap-4 justify-between">
      <router-link
        class="button button-primary px-4 py-2"
        :to="{
            name: 'withdrawals-exchange-2',
            params: {
              exchange_name: exchangeName,
            }
          }"
      >
        {{ $t('Return') }}
      </router-link>

      <ui-button-loading
        class="button button-primary px-4 py-2"
        :loading="buttonLoading"
        :disabled="skeletonLoading"
        @click="finishHandler"
      >
        {{ $t('Finish') }}
      </ui-button-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import WalletCard from '@/components/exchanges/WalletCard.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import { SelectOptionType } from '@/components/types';
import {
  WalletsResponse,
  IColdWalletAddresses,
  ExchangeCurrenciesUserList,
} from '@/services/WalletsService/types';

interface IWalletsData {
  id: string;
  chain: string;
  blockchain: string;
  enabledWithdrawal: boolean;
  enabledExchange: boolean;
  depositWalletsSelected: string;
  minBalance: string | number;
  exchange: string;
  exchangeCurrenciesFrom: string;
  exchangeCurrenciesTo: string;
  withdrawalWallets: IColdWalletAddresses[];
  withdrawalWalletsSelected: string;
  exchangeCurrenciesUserList: ExchangeCurrenciesUserList[];
  checkWithdrawalAddresses: boolean;
  checkExchangeDirection: boolean;
}

interface IWalletsOption {
  currency: string;
  address: string;
  chain: string;
}

export default defineComponent({
  components: {
    WalletCard,
    UiButtonLoading,
    UiSkeletonBox,
  },

  data() {
    return {
      walletsData: [] as Array<IWalletsData>,
      buttonLoading: false,
      skeletonLoading: true,
    };
  },

  computed: {
    ...mapState('wallets', {
      wallets: 'wallets',
    }),
    ...mapState('exchanges', {
      depositWallets: 'depositWallets',
      withdrawalWallets: 'withdrawalWallets',
    }),

    exchangeName(): string {
      return this.$route.params.exchange_name as string;
    },

    depositWalletsOptions() {
      return (chain: string): SelectOptionType[] => {
        return this.depositWallets.reduce((acc: SelectOptionType[], curr: IWalletsOption) => {
          if (curr.chain === chain) {
            acc.push({
              title: `${curr.address} (${curr.chain.toUpperCase()})`,
              value: curr.address,
            });
          }
          return acc;
        }, []);
      };
    },

    withdrawalWalletsOptions() {
      return (array: IColdWalletAddresses[], exchangeCurrencies: ExchangeCurrenciesUserList[]): SelectOptionType[] => {
        return this.withdrawalWallets
          .filter((item: IWalletsOption) => item.currency === exchangeCurrencies[0]?.currencyTo)
          .reduce((acc: SelectOptionType[], curr: IWalletsOption) => {
            if (!array.find((item) => item.address === curr.address)) {
              acc.push({
                title: `${curr.address} (${curr.chain.toUpperCase()})`,
                value: curr.address,
              });
            }
            return acc;
          }, []);
      };
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    ...mapActions('wallets', ['loadAndCreateWallets']),
    ...mapActions('exchanges', ['loadWallets', 'updateExchangeSettings']),

    async loadData() {
      try {
        await Promise.all([
          this.loadAndCreateWallets(),
          this.loadWallets({
            exchange: this.exchangeName,
          }),
        ]);
        this.setData();
        this.skeletonLoading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      } catch (e) {
        this.$store.commit('app/setProgressBar', 'stop');
        this.skeletonLoading = false;
      }
    },

    setData() {
      this.walletsData = this.wallets.map((item: WalletsResponse) => {
        const checkWithdrawal = this.checkWithdrawalAddresses(item.exchangeCurrenciesUserList);
        return {
          id: item.id,
          chain: item.chain,
          blockchain: item.blockchain,
          enabledWithdrawal: item.exchangeColdWalletAddresses?.length
            ? item.exchangeColdWalletAddresses.every((item) => item.isWithdrawalEnabled)
            : false,
          enabledExchange: item.exchangeCurrenciesUserList?.length
            ? item.enableAutomaticExchange === 1
            : false,
          depositWalletsSelected: this.checkDepositWallets(item.address)
            ? item.address : '',
          minBalance: item.exchangeColdWalletAddresses?.length
            ? item.exchangeColdWalletAddresses[0].withdrawalMinBalance
            : 0,
          exchange: this.exchangeName,
          exchangeCurrenciesFrom: item.exchangeCurrencies?.fromCurrencyId
            ? item.exchangeCurrencies.fromCurrencyId
            : '',
          exchangeCurrenciesTo: item.exchangeCurrencies?.toCurrencyId
            ? item.exchangeCurrencies.toCurrencyId
            : '',
          withdrawalWallets: item.exchangeColdWalletAddresses,
          exchangeCurrenciesUserList: item.exchangeCurrenciesUserList,
          checkWithdrawalAddresses: checkWithdrawal,
          checkExchangeDirection: !!item.exchangeCurrenciesUserList?.length,
        };
      });
    },

    checkDepositWallets(address: string | null) {
      return this.depositWallets.find((item: IWalletsOption) => item.address === address);
    },

    checkWithdrawalAddresses(array: ExchangeCurrenciesUserList[] | null) {
      if (array?.length) {
        const wallets = this.withdrawalWallets
          .filter((item: IWalletsOption) => item.currency === array[0].currencyTo);
        if (wallets.length) {
          return true;
        }
      }
      return false;
    },

    addWithdrawalWallet(value: { address: string; index: number }) {
      const wallet = this.withdrawalWallets
        .find((item: IWalletsOption) => item.address === value.address);

      this.walletsData[value.index].withdrawalWallets.push({
        address: wallet.address,
        isWithdrawalEnabled: false,
        chain: wallet.chain,
        withdrawalMinBalance: '',
      });

      this.walletsData[value.index].withdrawalWalletsSelected = '';
    },

    deleteWithdrawalWallet(value: { address: string; index: number }) {
      this.walletsData[value.index].withdrawalWallets = this.walletsData[value.index].withdrawalWallets
        .filter((item) => item.address !== value.address);
    },

    async finishHandler() {
      try {
        this.buttonLoading = true;

        await Promise.all(this.walletsData.map((item) => {
          if (item.depositWalletsSelected) {
            return this.updateExchangeSettings({
              walletId: item.id,
              payload: {
                withdrawalEnabled: true,
                address: item.depositWalletsSelected,
                enableAutomaticExchange: item.enabledExchange,
                exchange: this.exchangeName,
                exchangeCurrenciesFrom: (item.exchangeCurrenciesUserList?.length)
                  ? item.exchangeCurrenciesUserList[0].currencyFrom
                  : null,
                exchangeCurrenciesTo: item.exchangeCurrenciesUserList?.length
                  ? item.exchangeCurrenciesUserList[0].currencyTo
                  : null,
                exchangeColdWalletAddress: this.withdrawalWalletsOptions(
                  item.withdrawalWallets,
                  item.exchangeCurrenciesUserList,
                ).length ? item.withdrawalWallets.map((el) => ({
                    ...el,
                    withdrawalMinBalance: Number(item.minBalance),
                    isWithdrawalEnabled: item.enabledWithdrawal,
                  })) : [],
              },
            });
          }
          return Promise.resolve();
        }));
        await this.loadData();
        this.buttonLoading = false;
        this.$toast.success(this.$t('Settings successfully updated'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.wallet-card-wrapper {
  @apply grid gap-6 grid-cols-[1fr,1fr] items-start mb-6;

  @include desktop {
    @apply grid-cols-[1fr];
  }
}
</style>
