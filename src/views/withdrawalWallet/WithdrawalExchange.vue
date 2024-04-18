<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-2">
        <div class="page-title">
          {{ $t('Withdrawal Rules from hot wallets') }}
        </div>
      </div>
    </div>
    <div class="mb-8 relative">
      <withdrawal-tab/>
    </div>
    <ui-loading :loading="loading"/>
    <div class="card">
      <div class="card-title mb-4">
        {{ $t('withdrawal_exchange_text_1') }}
        <br/> {{ $t('withdrawal_exchange_text_2') }}
      </div>
      <div class="flex gap-2 flex-wrap">
        <div v-if="allExchangeDirectionsSymbols.length">
          <label for="slected_direction" class="self-start">{{
              $t('Choose pairs to exchange')
            }}</label>
          <ui-autocompleate class="w-400px mt-2" :options="allExchangeDirectionsSymbols"
                            labelKey="label"
                            @selected="onAutocompleteSelected">
            <template #result-item="{ result }">
              <div class="text-">
                <span class="uppercase">{{ result.label }}</span> ({{
                  result.symbol
                }})
              </div>
            </template>
          </ui-autocompleate>
        </div>
        <div>
          <label for="slected_direction" class="self-start">{{
              $t('Selected exchange directions')
            }}</label>
          <ul class="flex max-w-100 gap-2 flex-wrap mt-2" id="slected_direction"
              v-if="selectedDirection.length">
            <li v-for="direction in selectedDirection">
                            <span
                              class="inline-flex items-center py-1.5 pl-4 pr-2 rounded-full text-xm font-medium bg-indigo-100 text-indigo-700 uppercase">
                                {{ direction.label }}
                                <button @click="removeFromList(direction)" type="button"
                                        class="flex-shrink-0 ml-2 h-6 w-6 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white">
                                    <svg class="h-2 w-2" stroke="currentColor" fill="none"
                                         viewBox="0 0 8 8">
                                        <path stroke-linecap="round" stroke-width="1.5"
                                              d="M1 1l6 6m0-6L1 7"/>
                                    </svg>
                                </button>
                            </span>

            </li>
          </ul>
          <div v-else class="text-sm mt-4">
            {{ $t('No exchange direction selected') }}
          </div>
        </div>
      </div>
      <div class="form-group mt-6 flex flex-row-reverse justify-end gap-5">
        <label for="exchangeColdWalletSwitcher" class="self-start">
          {{ $t('Enable withdrawal to cold wallet') }}
        </label>
        <ui-switcher id="exchangeColdWalletSwitcher" :checked="exchangeColdWalletIsEnabled"
                     @switched="switchExchangeColdWalletIsEnabled"/>
      </div>

      <div class="mt-6 flex gap-6">
        <div class="flex">
          <ui-input v-model="minBalance" class="max-w-200px" type="number" id="minBalance"
                    :label="$t('Balance (USD) more than')"/>
          <ui-tooltip
            text="напишите О и пересылка будет сразу после обмена (не экономно, биржа тоже берет комиссию за вывод)">
            <feather-icon type="help-circle" size="16" stroke-width="2.5"
                          class="opacity-65 hover:opacity-100 flex"/>
          </ui-tooltip>
        </div>


        <div class="form-group">
          <label for="walletType" class="self-start">
            {{ $t('Select wallet for withdrawal:') }}
          </label>
          <ui-select class="w-500px h-38px mt-2" id="walletType" v-model="selectAddress.value"
                     :options="withdrawalWallets" @change="selectWithdrawalAddress"/>
        </div>
        <div class="form-group items-end flex mb-1">
          <button @click="createColdWallet" class="button button-primary px-5 py-6px">
            {{ $t('Add') }}
          </button>
        </div>
      </div>
      <div class="flex">
        <ui-table :columns="tableColumns" :data="coldWallets">
          <template v-slot:cell-address="{ row: item }">
            <div class="min-w-400px"> {{ item.address }}</div>
          </template>
          <template v-slot:cell-actions="{ row: item }">
            <button class="button button-error py-1 px-2" @click="deleteWallet(item.id)">
              {{ $t('Delete') }}
            </button>
          </template>
        </ui-table>
      </div>
      <div class="flex items-center justify-end mt-6">
        <button @click="save" class="button button-primary px-5 py-6px">
          {{ $t('Save') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import WithdrawalTab from '@/components/withdrawalWallet/WithdrawalTab.vue';
import UiAutocompleate from '@/components/ui/UiAutocompleate.vue';
import UiSwitcher from '@/components/ui/UiSwitcher.vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiTable from '@/components/ui/UiTable.vue';
import UiTooltip from '@/components/ui/UiTooltip.vue';
import UiLoading from '@/components/ui/UiLoading.vue';
import { mapActions, mapState } from 'vuex';

export default defineComponent({
  components: {
    WithdrawalTab,
    UiAutocompleate,
    UiSwitcher,
    UiInput,
    UiSelect,
    UiTable,
    UiTooltip,
    UiLoading,
  },
  data() {
    return {
      direction: '',
      selectedDirection: [],
      exchangeColdWalletIsEnabled: false,
      minBalance: 0,
      selectAddress: {},
      loading: true,
      tableColumns: [
        {
          label: 'Network',
          field: 'chain',
          textAlign: 'text-left',
        },
        {
          label: 'Currency',
          field: 'currency',
          textAlign: 'text-left',
        },
        {
          label: 'Min Balance',
          field: 'minBalance',
          textAlign: 'text-left',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-right',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
    };
  },
  computed: {
    ...mapState('exchanges', {
      allExchangeDirectionsSymbols: 'allExchangeDirectionsSymbols',
      userExchangeDirections: 'userExchangeDirections',
      withdrawalWallets: 'withdrawalWallets',
      coldWallets: 'coldWallets',
    }),

  },

  created() {
    this.loadData();
  },
  methods: {
    ...mapActions('exchanges', [
      'loadAllExchangeDirectionsSearch',
      'loadUserExchangeDirections',
      'batchUpdateUserExchangeDirections',
      'loadWithdrawalWallets',
      'loadColdWallet',
      'storeColdWallet',
      'deleteColdwallet',
      'toggleStatus',
    ]),

    async loadData() {
      this.loadWithdrawalWallets({ exchange: 'huobi' });
      this.loadColdWallet({ exchange: 'huobi' });

      await this.loadAllExchangeDirectionsSearch({ exchange: 'huobi' });
      await (async () => {
        await this.loadUserExchangeDirections({ exchange: 'huobi' });
        this.selectedDirection = this.userExchangeDirections;
      })();
      if (this.coldWallets.length) {
        this.exchangeColdWalletIsEnabled = this.coldWallets[0].isWithdrawalEnable;
      }
      this.loading = false;

    },
    onAutocompleteSelected(object) {
      if (!this.isObjectInArray(object)) {
        this.selectedDirection.push(object);
      }
    },

    isObjectInArray(object) {
      return this.selectedDirection.some(item => item.symbol === object.symbol);
    },
    removeFromList(object) {
      this.selectedDirection = this.selectedDirection.filter(item => item.symbol !== object.symbol);
    },
    switchExchangeColdWalletIsEnabled() {
      this.exchangeColdWalletIsEnabled = !this.exchangeColdWalletIsEnabled;
      this.toggleStatus({ status: this.exchangeColdWalletIsEnabled });
    },
    selectWithdrawalAddress(address) {
      this.selectAddress = this.withdrawalWallets.find(item => item.address === address);
    },
    async createColdWallet() {
      await this.storeColdWallet({
        'address': this.selectAddress.address,
        'is_withdrawal_enable': true,
        'min_balance': this.minBalance,
        'chain': this.selectAddress.chain,
        'currency': this.selectAddress.currency,
        'exchange': 'huobi'
      });
      this.selectAddress = {};
      this.$toast.success(this.$t('success'));
      this.loadColdWallet();
    },
    async save() {
      await this.batchUpdateUserExchangeDirections({
        'exchange': 'huobi',
        'directions': this.selectedDirection
      });
      this.$toast.success(this.$t('success'));
    },
    async deleteWallet(itemId) {
      await this.deleteColdwallet({ walletId: itemId });
      this.$toast.success(this.$t('success'));
      this.loadColdWallet();
    },
    toggleStatusWithdrawal(status) {
      this.toggleStatus({ status: status });
    }
  },
});
</script>
