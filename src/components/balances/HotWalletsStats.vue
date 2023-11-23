<template>
  <ui-skeleton-box
    v-if="skeletonLoading"
    width="100%"
    height="298px"
  />
  <div v-if="false" class="card">
    <div class="card-title mb-4">
      {{ $t('Addresses Count') }}
    </div>
    <ui-table
      v-if="false"
      :columns="tableColumn"
      :data="balances"
      :loading="tableLoading"
    >
      <template v-slot:cell-currency="{row: item}">
        {{ item.currency.split('.')[0] }} ({{item.currency.split('.')[1]}})
      </template>
      <template v-slot:cell-busy="{row: item}">
        {{ item.addressCount.busy }}
      </template>
      <template v-slot:cell-free="{row: item}">
        {{ item.addressCount.free }}
      </template>
      <template v-slot:cell-hold="{row: item}">
        {{ item.addressCount.hold }}
      </template>
      <template v-slot:cell-total="{row: item}">
        {{ item.addressCount.total }}
      </template>
      <template v-slot:cell-balanceUsd="{row: item}">
        {{ item.balanceUsd }} $
      </template>
      <template v-slot:cell-actions="{row: item}">
        <ui-button-loading
          class="button button-primary py-1 px-2"
          :loading="btnLoading[item.currency]"
          @click="showModalHandler(item.currency)"
        >
          {{ `${$t('Withdraw')} ${item.currency.split('.')[0]}` }}
        </ui-button-loading>
      </template>
      <template v-slot:tfoot>
        <tr class="border-b border-gray-200 font-600">
          <td class="py-4 px-3">{{ $t('Total') }}:</td>
          <td class="py-4 px-3 text-center">{{ totals.addressCount.busy }}</td>
          <td class="py-4 px-3 text-center">{{ totals.addressCount.free }}</td>
          <td class="py-4 px-3 text-center">{{ totals.addressCount.hold }}</td>
          <td class="py-4 px-3 text-center">{{ totals.addressCount.total }}</td>
          <td class="py-4 px-3 text-center">{{ totals.amountUsd }} $</td>
          <td class="py-4 px-3 text-right">
            <ui-button-loading
              class="button button-primary py-1 px-2"
              :loading="btnLoading['all']"
              @click="showModalHandler('all')"
            >
              {{ `${$t('Withdraw')} ${$t('All')}` }}
            </ui-button-loading>
          </td>
        </tr>
      </template>
    </ui-table>
    <ui-modal
      v-model="showModal"
      :loading="modalLoading"
      @confirm="confirmModalHandler"
    >
      <template v-slot:title>
        {{ $t('Request a withdrawal') }}
      </template>
      <div
        class="flex flex-col gap-4"
      >
        <div
          v-for="(item, i) in addresses"
          :key="i"
          class="flex flex-col gap-2 items-center"
        >
          <div class="flex gap-1">
            <span class="font-600 uppercase">{{ item.currency }}</span>
            <span>{{ $t('To Address') }}:</span>
          </div>
          <div
            v-if="item.address"
            class="flex items-center gap-1 break-all"
          >
            <span class="font-500">
              {{ item.address }}
            </span>
            <ui-copy-to-clipboard
              :text-to-copy="item.address"
            />
          </div>
          <div
            v-else
            class="flex flex-col gap-2"
          >
            <div>
              {{ $t('Address is empty') }}
            </div>
          </div>
        </div>
      </div>
    </ui-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiModal from '@/components/ui/UiModal.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    UiTable,
    UiButtonLoading,
    UiModal,
    UiCopyToClipboard,
    UiSkeletonBox,
  },

  data() {
    return {
      skeletonLoading: false,
      tableLoading: false,
      tableColumn: [
        {
          label: 'Currency',
          field: 'currency',
          textAlign: 'text-left',
        },
        {
          label: 'Busy',
          field: 'busy',
          textAlign: 'text-center',
        },
        {
          label: 'Free',
          field: 'free',
          textAlign: 'text-center',
        },
        {
          label: 'Hold',
          field: 'hold',
          textAlign: 'text-center',
        },
        {
          label: 'Total Count',
          field: 'total',
          textAlign: 'text-center',
        },
        {
          label: 'Balance',
          field: 'balanceUsd',
          textAlign: 'text-center',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
      btnLoading: {} as {[k: string]: boolean},
      showModal: false,
      modalLoading: false,
      addresses: [] as Record<string, string>[],
    };
  },

  computed: {
    ...mapState('balances', {
      balances: 'balances',
      totals: 'totals',
      isBalancesLoaded: 'isBalancesLoaded',
    }),
    ...mapState('wallets', {
      wallets: 'wallets',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
  },

  created() {
    if (!this.isBalancesLoaded) {
      this.skeletonLoading = true;
    }
    this.loadData();
  },

  watch: {
    async storeFilterTrigger() {
      this.tableLoading = true;
      this.setStoreFilterBtnLoading(true);
      await this.loadData();
      this.setStoreFilterBtnLoading(false);
    },
  },

  methods: {
    ...mapActions('wallets', ['loadAndCreateWallets', 'withdrawalsRequest']),
    ...mapActions('balances', ['loadBalances']),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),

    async loadData() {
      try {
        await this.loadBalances();
        this.skeletonLoading = false;
        this.tableLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
        this.tableLoading = false;
      }
    },

    async showModalHandler(currency: string) {
      this.addresses = [];
      try {
        this.btnLoading[currency] = true;
        await this.loadAndCreateWallets();
        this.syncDataFromVuex(currency);
        this.showModal = true;
        this.btnLoading[currency] = false;
      } catch (e) {
        this.btnLoading[currency] = false;
      }
    },

    async confirmModalHandler() {
      try {
        this.modalLoading = true;
        await Promise.all(this.addresses.map(async (item) => {
          await this.withdrawalsRequest({
            currencyId: item.currencyId,
          });
        }));
        this.modalLoading = false;
        this.$toast.success(this.$t('The request has been successfully sent'));
        this.showModal = false;
      } catch (e) {
        this.modalLoading = false;
      }
    },

    syncDataFromVuex(currency: string) {
      if (currency === 'all') {
        const array = [] as Record<string, string>[];

        this.balances.forEach((item: {[currency: string]: string}) => {
          this.wallets.forEach((el: {[address: string]: string}) => {
            if (item.currency.split('.')[1].toLowerCase() === el.blockchain) {
              array.push({
                address: el.address,
                currency: item.currency.split('.')[0],
                currencyId: item.currency,
              });
            }
          });
        });
        this.addresses = array;
      } else {
        const blockchain = currency.split('.')[1].toLowerCase();
        this.addresses = this.wallets
          .filter((item: {[blockchain: string]: string}) => item.blockchain === blockchain)
          .map((item: {[address: string]: string}) => ({
            address: item.address,
            currency: currency.split('.')[0],
            currencyId: currency,
          }));
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
