<template>
  <div class="card common-wrapper">
    <div class="page-title font-600 mb-6">
      {{ $t('Withdrawals Settings') }}
    </div>
    <form
      class="form"
      @submit.prevent="updateWithdrawalsHandler"
    >
      <div class="form-group">
        <label
          for="address"
          class="self-start"
        >
          {{ $t('Address') }}
          <span
            v-if="withdrawalsSettings.blockchain"
            class="font-600"
          >
            ({{ withdrawalsSettings.blockchain }})
          </span>
        </label>
        <ui-input
          required
          v-model="address"
          type="text"
          id="address"
        />
      </div>

      <div class="flex flex-col gap-8">
        <div class="form-group">
          <label
            for="withdrawalsSwitcher"
            class="self-start"
          >
            {{ $t('Enable automatic withdrawals') }}
          </label>
          <ui-switcher
            id="withdrawalsSwitcher"
            :checked="enabledWithdrawals"
            @switched="switchHandler"
          />
        </div>
        <ui-expand
          class="flex flex-col gap-6"
          :is-expanded="enabledWithdrawals"
        >
          <ui-input
            v-model="minBalance"
            class="max-w-200px"
            type="number"
            id="minBalance"
            :label="$t('Balance (USD) more than')"
          />
  
        </ui-expand>
      </div>

      <div
        v-if="showExchangeSettings && enabledWithdrawals && showIfBitcoin"
        class="flex flex-col gap-8"
      >
        <div class="form-group">
          <label
            for="exchangeSwitcher"
            class="self-start"
          >
            {{ $t('Enable automatic exchange') }}
          </label>
          <ui-switcher
            id="exchangeSwitcher"
            :checked="enabledExchange"
            @switched="switchEnabledExchange"
          />
        </div>
        <ui-expand
          class="flex flex-col gap-6"
          :is-expanded="enabledExchange"
        >
          <div class="form-group">
            <label
              for="exchangeSelect"
              class="self-start"
            >
              {{ $t('Exchange') }}
            </label>
            <ui-select
              v-if="exchangesOptions.length"
              id="exchangeSelect"
              class="max-w-200px h-42px"
              v-model="exchangeSelected"
              :options="exchangesOptions"
            />
          </div>
          <div class="flex flex-col gap-3">
            <div class="font-600">
              {{ $t('Exchange Direction') }}
            </div>
            <div class="flex gap-2 items-end">
              <div class="form-group">
                <label
                  for="exchangeSelect"
                  class="self-start"
                >
                  {{ $t('From') }}
                </label>
                <ui-select
                  v-if="cryptoCurrencies.length"
                  id="exchangeSelect"
                  class="max-w-200px h-42px"
                  v-model="currencyFromSelectedComp"
                  :options="currenciesFromOptions"
                />
              </div>
              <feather-icon
                type="arrow-right"
                size="18"
                class="mb-12px"
              />
              <div class="form-group">
                <label
                  for="exchangeSelect"
                  class="self-start"
                >
                  {{ $t('To') }}
                </label>
                <ui-select
                  v-if="cryptoCurrencies.length"
                  id="exchangeSelect"
                  class="max-w-200px h-42px"
                  v-model="currencyToSelectedComp"
                  :options="currenciesToOptions"
                />
              </div>
              <button
                v-if="!addCurrencyPairValidator"
                class="button button-success px-4 h-42px flex items-center ml-2"
                @click="addCurrencyPairHandler"
              >
                <feather-icon type="plus" size="24" />
              </button>
            </div>
          </div>
          <div
            v-if="exchangeCurrenciesPair[exchangeSelected]?.length"
            class="flex flex-col gap-2"
          >
            <div
              v-for="(item, i) in exchangeCurrenciesPair[exchangeSelected]" :key="i"
              class="flex items-center gap-2"
            >
              <span>
                {{ $t('Currency Pair') }}:
              </span>
              <span class="border bg-gray-200 flex w-180px h-32px items-center pl-2">
                {{ item.fromCurrencyId.split('.')[0].toUpperCase() }} / {{ item.toCurrencyId.split('.')[0].toUpperCase() }}
              </span>
              <button
                class="button button-error flex items-center px-2 h-32px"
                @click="deleteCurrencyPairHandler($event, i)"
              >
                <feather-icon type="trash-2" size="18" />
              </button>
            </div>
          </div>
        </ui-expand>

        <div class="form-group">
          <label
            for="exchangeColdWalletSwitcher"
            class="self-start"
          >
            {{ $t('Enable withdrawal to cold wallet') }}
          </label>
          <ui-switcher
            id="exchangeColdWalletSwitcher"
            :checked="exchangeColdWalletIsEnabled"
            @switched="switchExchangeColdWalletIsEnabled"
          />
        </div>
        <ui-expand
          class="flex flex-col gap-6"
          :is-expanded="exchangeColdWalletIsEnabled"
        >
          <ui-table
            v-if="coldWalletAddresses?.length"
            :columns="tableColumns"
            :data="coldWalletAddresses"
          >
            <template v-slot:cell-address="{row: item}">
              <div class="flex items-center gap-2">
                <span>{{ `${item.address.slice(0, 7)}...${item.address.slice(-5)}` }}</span>
                <ui-copy-to-clipboard :text-to-copy="item.address" />
              </div>
            </template>
            <template v-slot:cell-chain="{row: item}">
              {{ item.chain.toUpperCase() }}
            </template>
            <template v-slot:cell-withdrawalMinBalance="{row: item}">
              {{ item.withdrawalMinBalance }} $
            </template>
          </ui-table>
        </ui-expand>
      </div>

      <ui-button-loading
        class="button button-primary py-2 px-4 self-start"
        type="submit"
        :loading="buttonLoading"
        :disabled="saveBtnValidator || coldAddressWalletValidator"
      >
        {{ $t('Save') }}
      </ui-button-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import UiSwitcher from '@/components/ui/UiSwitcher.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiExpand from '@/components/ui/UiExpand.vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiTable from '@/components/ui/UiTable.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import { ExchangeCurrencies } from '@/store/dictionaries';
import { IColdWalletAddresses } from '@/services/WalletsService/types';

export default defineComponent({
  components: {
    UiSwitcher,
    UiSelect,
    UiButtonLoading,
    UiExpand,
    UiInput,
    UiTable,
    UiCopyToClipboard,
  },

  data() {
    return {
      address: '',
      enabledWithdrawals: false,
      minBalance: '',
      intervalSelected: 0,
      buttonLoading: false,
      enabledExchange: false,
      exchangeSelected: '',
      currencyFromSelected: '',
      currencyToSelected: '',
      exchangeCurrenciesPair: {} as Record<string, Record<string, string>[]>,
      exchangeColdWalletIsEnabled: false,
      coldWalletAddresses: [] as IColdWalletAddresses[],
      exchangeColdWalletMinBalance: '',
      selectedChain: '',
      tableColumns: [
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
        {
          label: 'Chain',
          field: 'chain',
          textAlign: 'text-center',
        },
        {
          label: 'Min Balance',
          field: 'withdrawalMinBalance',
          textAlign: 'text-center',
        },
      ],
    };
  },

  computed: {
    walletId() {
      return this.$route.params.wallet_id;
    },

    showExchangeSettings(): boolean {
      return !(this.withdrawalsSettings.enableAutomaticExchange === null
        || this.withdrawalsSettings.enableAutomaticExchange === undefined);
    },

    // TODO переделать для множества валют
    showIfBitcoin(): boolean {
      return this.withdrawalsSettings.blockchain === 'Bitcoin';
    },

    exchangeSelectedCurrencies(): ExchangeCurrencies[] {
      return this.getExchangeCurrencies
        .filter((item: ExchangeCurrencies) => item.slug === this.exchangeSelected);
    },

    currenciesFromOptions(): Array<{ title: string, value: string }> {
      return Object.keys(this.exchangeSelectedCurrencies[0].currencies)
        .map((item) => ({
          title: item.split('.')[0],
          value: item,
        }));
    },

    currencyFromSelectedComp: {
      get(): string {
        return this.currenciesFromOptions.find((item) => item.value === this.currencyFromSelected)
          ? this.currencyFromSelected
          : this.currenciesFromOptions[0].value;
      },
      set(value) {
        this.currencyFromSelected = value;
      },
    },

    currenciesToOptions(): Array<{ title: string, value: string }> {
      if (this.exchangeSelectedCurrencies[0].currencies[this.currencyFromSelectedComp]) {
        return this.exchangeSelectedCurrencies[0].currencies[this.currencyFromSelectedComp]
          .map((item) => ({
            title: item.split('.')[0],
            value: item,
          }));
      }
      return this.exchangeSelectedCurrencies[0].currencies[this.currenciesFromOptions[0].value]
        .map((item) => ({
          title: `${item.split('.')[0]} (${item.split('.')[1]})`,
          value: item,
        }));
    },

    currencyToSelectedComp: {
      get(): string {
        return this.currenciesToOptions.find((item) => item.value === this.currencyToSelected)
          ? this.currencyToSelected
          : this.currenciesToOptions[0].value;
      },
      set(value) {
        this.currencyToSelected = value;
      },
    },

    addCurrencyPairValidator(): boolean {
      return this.exchangeCurrenciesPair[this.exchangeSelected]
        ? !!this.exchangeCurrenciesPair[this.exchangeSelected]
          .find((item) => item.fromCurrencyId === this.currencyFromSelectedComp.split('.')[0].toLowerCase())
        : false;
    },

    saveBtnValidator(): boolean {
      if (this.enabledExchange) {
        if (this.exchangeCurrenciesPair[this.exchangeSelected]) {
          return !(this.exchangeCurrenciesPair[this.exchangeSelected].length);
        }
        return true;
      }
      return false;
    },

    coldAddressWalletValidator(): boolean {
      if (this.exchangeColdWalletIsEnabled) {
        return !this.coldWalletAddresses;
      }
      return false;
    },

    selectedChainComp: {
      get(): string {
        return this.selectedChain
          ? this.selectedChain
          : this.withdrawalsSettings.exchangeChain
            ? this.withdrawalsSettings.exchangeChain
            : this.chainOptions[0].value;
      },
      set(value) {
        this.selectedChain = value;
      },
    },

    chainOptions(): Array<{ title: string, value: string }> {
      return this.chain.map((item: string) => ({
        title: item === 'erc20usdt'
          ? 'USDT (ERC20)'
          : item === 'trc20usdt'
            ? 'USDT (TRC20)'
            : item,
        value: item,
      }));
    },

    withdrawalIntervals(): Record<string, string>[] {
      return this.withdrawalIntervalsValue.map((item: Record<string, string>) => ({
        title: this.$t(item.value),
        value: item.value,
      }));
    },

    ...mapState('wallets', {
      withdrawalsSettings: 'withdrawalsSettings',
    }),
    ...mapGetters('dictionaries', {
      exchangesOptions: 'exchangesOptions',
      cryptoCurrencies: 'cryptoCurrencies',
      getExchangeCurrencies: 'getExchangeCurrencies',
    }),
    ...mapState('dictionaries', {
      exchangeCurrencies: 'exchangeCurrencies',
      withdrawalIntervalsValue: 'withdrawalIntervals',
      chain: 'chain',
    }),
  },

  watch: {
    withdrawalsSettings() {
      this.syncDataFromVuex();
    },
  },

  created() {
    this.loadWithdrawalsSettings(this.walletId);
    if (Object.keys(this.withdrawalsSettings).length) {
      this.syncDataFromVuex();
    }
  },

  unmounted() {
    this.clearWithdrawalsSettings();
  },

  methods: {
    async updateWithdrawalsHandler() {
      this.buttonLoading = true;
      
      try {
        await this.updateExchangeSettings({
          walletId: this.walletId,
          payload: {
            address: this.address,
            withdrawalEnabled: this.enabledWithdrawals,
            enableAutomaticExchange: (this.enabledWithdrawals && this.showIfBitcoin) ? this.enabledExchange : false,
            withdrawalMinBalance: Number(this.minBalance),
            withdrawalIntervalCron: this.intervalSelected,
            exchange: this.exchangeSelected,
            exchangeCurrenciesFrom: this.exchangeCurrenciesPair.length ? this.exchangeCurrenciesPair[this.exchangeSelected][0]?.fromCurrencyId: null,
            exchangeCurrenciesTo: this.exchangeCurrenciesPair.length ? this.exchangeCurrenciesPair[this.exchangeSelected][0]?.toCurrencyId : null,
            exchangeColdWalletAddress: this.coldWalletAddresses.map((item) => ({
              ...item,
              isWithdrawalEnabled: this.exchangeColdWalletIsEnabled,
            })),
            exchangeColdWalletMinBalance: this.coldWalletAddresses?.length
              ? this.coldWalletAddresses[0].withdrawalMinBalance
              : 0,
          },
        });
        await this.loadWithdrawalsSettings(this.walletId);
        this.buttonLoading = false;
        this.$toast.success(this.$t('Withdrawals settings successfully updated'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    switchHandler() {
      this.enabledWithdrawals = !this.enabledWithdrawals;
    },

    switchEnabledExchange() {
      this.enabledExchange = !this.enabledExchange;
    },

    switchExchangeColdWalletIsEnabled() {
      this.exchangeColdWalletIsEnabled = !this.exchangeColdWalletIsEnabled;
    },

    addCurrencyPairHandler(e: Event) {
      e.preventDefault();
      if (this.exchangeCurrenciesPair[this.exchangeSelected]) {
        this.exchangeCurrenciesPair[this.exchangeSelected].push({
          fromCurrencyId: this.currencyFromSelectedComp.split('.')[0].toLowerCase(),
          toCurrencyId: this.currencyToSelectedComp.split('.')[0].toLowerCase(),
        });
      } else {
        this.exchangeCurrenciesPair[this.exchangeSelected] = [
          {
            fromCurrencyId: this.currencyFromSelectedComp.split('.')[0].toLowerCase(),
            toCurrencyId: this.currencyToSelectedComp.split('.')[0].toLowerCase(),
          },
        ];
      }
    },

    deleteCurrencyPairHandler(e: Event, i: number) {
      e.preventDefault();
      this.exchangeCurrenciesPair[this.exchangeSelected] = this.exchangeCurrenciesPair[this.exchangeSelected]
        .filter((item, index) => index !== i);
    },

    syncDataFromVuex() {
      this.address = this.withdrawalsSettings.address;
      this.enabledWithdrawals = this.withdrawalsSettings.enabled;
      this.minBalance = this.withdrawalsSettings.minBalance;

      this.intervalSelected = this.withdrawalsSettings.withdrawalIntervalCron
        ? this.withdrawalsSettings.withdrawalIntervalCron
        : this.withdrawalIntervals[0]?.value;

      this.enabledExchange = this.withdrawalsSettings.enableAutomaticExchange;
      this.exchangeSelected = this.withdrawalsSettings.exchange
        ? this.withdrawalsSettings.exchange.toLowerCase()
        : this.exchangesOptions[0]?.value;

      if (this.withdrawalsSettings.exchange) {
        this.exchangeCurrenciesPair = {
          [this.withdrawalsSettings.exchange.toLowerCase()]: [...this.withdrawalsSettings.exchangeCurrencies],
        };
      }

      this.exchangeColdWalletIsEnabled = this.withdrawalsSettings.exchangeColdWalletAddresses?.length
        ? this.withdrawalsSettings.exchangeColdWalletAddresses.every((item: IColdWalletAddresses) => item.isWithdrawalEnabled)
        : false;
      this.coldWalletAddresses = this.withdrawalsSettings.exchangeColdWalletAddresses;
      this.exchangeColdWalletMinBalance = this.withdrawalsSettings.exchangeColdWalletMinBalance;
    },

    ...mapMutations('wallets', ['clearWithdrawalsSettings']),
    ...mapActions('wallets', ['loadWithdrawalsSettings', 'updateWithdrawalsSettings']),
    ...mapActions('exchanges', ['updateExchangeSettings']),
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

.button-success {
  @apply bg-success-400 hover:bg-success-500 text-white;
}
</style>
