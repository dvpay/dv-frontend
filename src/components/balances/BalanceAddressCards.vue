<template>
  <div
    class="flex flex-col gap-10px relative"
  >
    <div class="card">
      <div class="flex flex-col gap-4">
        <div class="flex gap-6 items-center justify-between flex-wrap-reverse">
          <div class="card-title">
            {{ $t('Balances of invoice addresses') }}
          </div>
        </div>
        <div
          v-if="hotWalletsSummary.length"
          class="cards-wrapper"
        >
          <table class="w-full">
            <tbody>
            <tr class="border-b-8 border-transparent">
              <th class="text-left">{{ $t('Asset') }}</th>
              <th>{{ $t('Wallets with balance (Total)') }}</th>
              <th class="text-left">{{ $t('Balance Sum') }}</th>
              <th class="text-right">{{ $t('Balance Sum (USD)') }}</th>
            </tr>
            <tr
              v-for="(item, i) in hotWalletsSummary"
              :key="i"
            >
              <td class="text-left">
                {{item.currencyId.split('.')[0]}}
              </td>
              <td class="text-center">
                {{ item.countWithBalance }} ({{ item.createdCount }})
              </td>
              <td>
                <template v-if="item.currencyId === 'BTC.Bitcoin'">
                  {{ numberFormatter(item.sumAmount,4) }}
                </template>
                <template v-else>
                  {{ numberFormatter(item.sumAmount,0) }}
                </template>
              </td>
              <td class="text-right">
                ${{ numberFormatter(item.sumAmountUsd,0) }} <!-- Тут округление математическое-->
              </td>
            </tr>
            <tr class="border-b-8 border-transparent">
              <th class="text-left">{{ $t('Summary') }}</th>
              <th>{{ calculateHotWalletsSummarySum('countWithBalance') }} ({{ calculateHotWalletsSummarySum('createdCount') }})</th>
              <th class="text-left" > --- </th>
              <th class="text-right">${{ numberFormatter(calculateHotWalletsSummarySum('sumAmountUsd'),0) }}</th>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="flex gap-6 items-center flex-wrap">
          <div class="flex items-center gap-2 text-sm">
            <span>
              {{ $t('Sort Balance By') }}
            </span>
            <ui-select
              class="max-w-200px h-32px"
              v-model="sortDirection"
              :options="sortBalanceDirectionOptions"
              @change="sortBalanceDirectionSelect"
            />
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span>
              {{ $t('Filter By Currency') }}
            </span>
            <ui-select
              class="max-w-200px h-32px"
              v-model="filterValue"
              :options="currencyOptions"
              @change="filterCurrencySelect"
            />
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span>
              {{ $t('Hide Empty And Free Addresses') }}
            </span>
            <ui-checkbox
              v-model="isEmptyAddressesHide"
              @checked="hideEmptyAddressesHandler"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="addressBalances.length"
      class="cards-wrapper"
    >
      <div
        v-for="(item, i) in addressBalances"
        :key="i"
        class="card !p-3"
        :class="{
          'tablet:max-w-448px': addressBalances.length === 1,
          '!bg-red-100': addressBalances.balance !== addressBalances.balanceFromExplorer,
        }"
      >
        <div class="flex flex-col gap-2">
          <div class="card-media grid items-center justify-between gap-2">
            <div class="flex items-center gap-2 py-1 w-full justify-self-start">
              <router-link
                :to="{ name: 'balances-address-invoices', params: { address: item.address } }"
                class="address-full-hide link text-xs"
              >
                {{ item.address }}
              </router-link>
              <router-link
                :to="{ name: 'balances-address-invoices', params: { address: item.address } }"
                class="address-short-hide link text-xs"
              >
                {{ `${item.address.slice(0, 7)}...${item.address.slice(-7)}` }}
              </router-link>
             <div class="flex items-center gap-2">
               <ui-copy-to-clipboard
                 v-show="item.address"
                 :text-to-copy="item.address"
               />
               <a :href="item.explorerUrl"
                 class="flex item-center justify-center"
                 target="_blank"
                 ref="noopener noreferrer"
               >
                 <feather-icon type="external-link" size="16"/>
               </a>
             </div>
            </div>
          </div>
          <div class="flex justify-between items-center gap-2">
            <div class="flex flex-col gap-1 font-600 text-xl">
              <div>
                {{ item.balanceUsd }} $
              </div>
              <div>
                {{ item.balance }} {{item.currency.split('.')[0]}}
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end">
            <button
              class="button button-primary px-5 py-6px"
              :disabled="item.balanceUsd <= 0"
              @click="sendManuallyHandler(item.address, item.currency)"
            >
              {{ $t('Send') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="addressBalances.length"
      class="card"
    >
      <div
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2 text-sm">
          <span>{{ $t('Show') }}</span>
          <ui-select
            class="max-w-90px h-38px"
            v-model="perPage"
            :options="perPageOptions"
            @change="perPageSelectHandler"
          />
          <span>{{ $t('entries') }}</span>
        </div>
        <ui-pagination
          :current="Number(currentPage)"
          :total="Number(pagination.total)"
          :per-page="Number(perPage)"
          @page-change="pageChangeHandler"
        />
      </div>
    </div>
    <ui-loading :loading="loading" />

    <ui-modal
      v-model="showModal"
      :loading="modalLoading"
      @confirm="transferFromAddressHandler"
    >
      <template v-slot:title>
        {{ $t('Send manually') }}?
      </template>
      <div class="flex flex-col gap-2">
        <div>
          {{ $t('Do you want to send funds from this address?') }}
        </div>
        <div class="flex items-center justify-center gap-2 break-all">
            <span class="font-500">
              {{ address }}
            </span>
          <ui-copy-to-clipboard
            :text-to-copy="address"
          />
        </div>
      </div>
    </ui-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiPagination from '@/components/ui/UiPagination.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiLoading from '@/components/ui/UiLoading.vue';
import UiCheckbox from '@/components/ui/UiCheckbox.vue';
import UiModal from '@/components/ui/UiModal.vue';
import UiTooltipTd from '@/components/ui/UiTooltipTd.vue';
import {numberFormatter} from "@/utils";

export default defineComponent({
  components: {
    UiCopyToClipboard,
    UiPagination,
    UiSelect,
    UiLoading,
    UiCheckbox,
    UiModal,
    UiTooltipTd,
  },

  data() {
    return {
      currentPage: '1',
      perPage: '100',
      sortField: 'balance_usd',
      sortDirection: 'desc',
      filterField: '',
      filterValue: 'all',
      isEmptyAddressesHide: true,
      loading: false,
      perPageOptions: [
        {
          title: '100',
          value: '100',
        },
        {
          title: '200',
          value: '200',
        },
        {
          title: '300',
          value: '300',
        },
      ],
      sortBalanceDirectionOptions: [
        {
          title: this.$t('Descending'),
          value: 'desc',
        },
        {
          title: this.$t('Ascending'),
          value: 'asc',
        },
      ],
      showModal: false,
      modalLoading: false,
      address: '',
      currencyId: '',
      chain: '',
    };
  },

  computed: {

    currencyOptions(): Array<Record<string, string>> {
      return [
        {
          title: this.$t('All'),
          value: 'all',
        },
        ...this.balances.map((item: Record<string, string>) => ({
          title: item.currency,
          value: item.currency,
        })),
      ];
    },

    hideEmptyAddresses(): string {
      return this.isEmptyAddressesHide ? '1' : '0';
    },

    ...mapState('addresses', {
      addressBalances: 'addressBalances',
      pagination: 'addressBalancesPagination',
      isAddressBalancesLoaded: 'isAddressBalancesLoaded',
      hotWalletsSummary: 'hotWalletsSummary',
    }),
    ...mapState('balances', {
      balances: 'balances',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
  },

  watch: {
    async storeFilterTrigger() {
      this.setStoreFilterBtnLoading(true);
      // await this.loadTotalBalanceData();
      this.setStoreFilterBtnLoading(false);
    },
  },

  async created() {
    if (this.isAddressBalancesLoaded) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    if (!this.isAddressBalancesLoaded) {
      this.loading = true;
    }
    await this.loadAddressBalancesData(this.currentPage, this.perPage);
    await this.loadHotWalletsSummaryData();
  },

  methods: {
    numberFormatter,
    perPageSelectHandler() {
      this.loading = true;
      this.loadAddressBalancesData(this.currentPage, this.perPage);
    },

    pageChangeHandler(page: string) {
      this.loading = true;
      this.currentPage = page;
      this.loadAddressBalancesData(this.currentPage, this.perPage);
    },

    sortBalanceDirectionSelect() {
      this.loading = true;
      this.loadAddressBalancesData(this.currentPage, this.perPage);
    },

    filterCurrencySelect() {
      this.loading = true;
      if (this.filterValue === 'all') {
        this.filterField = '';
      } else {
        this.filterField = 'currency_id';
      }
      this.loadAddressBalancesData(this.currentPage, this.perPage);
    },

    hideEmptyAddressesHandler() {
      this.loading = true;
      this.loadAddressBalancesData(this.currentPage, this.perPage);
    },

    async loadHotWalletsSummaryData() {
      await this.loadHotWalletsSummary();
    },
    calculateHotWalletsSummarySum(feild: string):number {
      const sum = Object.values(this.hotWalletsSummary).reduce((sum, current:any) => sum + current[feild], 0);
      return Number(sum);
    },

    async loadAddressBalancesData(page: string, perPage: string) {
      try {
        const params: Record<string, any> = {
          page,
          perPage,
          sortDirection: this.sortDirection,
          sortField: this.sortField,
        };

        if (this.filterField) {
          params.filterField = this.filterField;
          params.filterValue = this.filterValue;
        }

        if (this.isEmptyAddressesHide) {
          params.hideEmpty = this.hideEmptyAddresses;
        }

        await this.loadAddressBalances(params);
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      } catch (e) {
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },

    sendManuallyHandler(address: string, currencyId: string) {
      this.showModal = true;
      this.address = address;
      this.currencyId = currencyId;
    },

    async transferFromAddressHandler() {
      try {
        this.modalLoading = true;
        await this.requestWithdrawalFromAddress({
          addressFrom: this.address,
          currencyId: this.currencyId,
        });
        this.modalLoading = false;
        this.$toast.success(this.$t('The request has been successfully sent'));
        this.showModal = false;
      } catch (e) {
        this.modalLoading = false;
      }
    },

    ...mapActions('addresses', ['loadAddressBalances', 'transferFromAddress', 'loadHotWalletsSummary']),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),
    ...mapActions('withdrawal_wallet', ['requestWithdrawalFromAddress']),
  },
});
</script>

<style lang="scss" scoped>
.cards-wrapper {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));

  @media screen and (max-width: 1460px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

.card-media {
  grid-template-columns: 250px 44px;

  @media screen and (max-width: 1480px) {
    grid-template-columns: 120px 44px;
  }
}

.address-full-hide {
  @media screen and (max-width: 1479px) {
    @apply hidden;
  }
}

.address-short-hide {
  @media screen and (min-width: 1480px) {
    @apply hidden;
  }
}

.state-busy {
  @apply text-gray-600 rounded bg-gray-200;
}

.state-free {
  @apply text-success-500 rounded bg-success-200;
}

.state-hold {
  @apply text-danger-400 rounded bg-danger-200;
}
</style>
