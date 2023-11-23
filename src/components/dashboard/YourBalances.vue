<template>
  <ui-skeleton-box
    v-if="skeletonLoading"
    width="100%"
    height="206px"
  />
  <div
    v-else
    class="card h-scroll"
  >
    <div class="card-title mb-4">
      {{ $t('Your Balances') }}
    </div>
    <ui-table
      :columns="tableColumn"
      :data="balances"
      :loading="tableLoading"
    >
      <template v-slot:cell-currency="{row: item}">
        {{ item.currency.split('.')[0] }} ({{item.currency.split('.')[1]}})
      </template>
      <template v-slot:cell-balance="{row: item}">
        {{ item.balance }} {{ item.currency.split('.')[0] }}
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
          <td></td>
          <td class="py-4 px-3 text-center">{{ totalBalance.amountUsd }} $</td>
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
      :disabled-confirm="disabledConfirm"
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
            v-if="item.address.length"
            class="flex items-center flex-col gap-1 break-all"
          >
            <div v-for="address in item.address" class="flex items-center">
              <span class="font-500">
                {{ address }}
              </span>
              <ui-copy-to-clipboard
                :text-to-copy="address"
              />
            </div>
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
import { mapState, mapMutations, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiModal from '@/components/ui/UiModal.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';

export default defineComponent({
  components: {
    UiTable,
    UiSkeletonBox,
    UiButtonLoading,
    UiModal,
    UiCopyToClipboard,
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
          label: 'Amount',
          field: 'balance',
          textAlign: 'text-center',
        },
        {
          label: 'Amount in USD',
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
      disabledConfirm: false,
    };
  },

  computed: {
    ...mapState('balances', {
      balances: 'balances',
      isBalancesLoaded: 'isBalancesLoaded',
      totalBalance: 'totals',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
    ...mapState('wallets', {
      wallets: 'wallets',
    }),
    ...mapState('withdrawal_wallet', {
      withdrawalWallets: 'withdrawalWallets'
    })
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
        await this.loadWithdrawalWallets();
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
        if(this.addresses.length > 1) {
          await this.requestWithdrawal()
        } else {
          await this.requestWithdrawal({
            chain: this.addresses[0].chain,
          });
        }

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
          this.withdrawalWallets.forEach((el: {[address: string]: string}) => {
            if (item.currency.split('.')[1].toLowerCase() === el.blockchain) {
              array.push({
                address: el.address,
                currency: item.currency.split('.')[0],
                currencyId: item.currency,
                chain: item.chain
              });
            }
          });
        });
        this.addresses = array;
      } else {
        const blockchain = currency.split('.')[1].toLowerCase();
        this.addresses = this.withdrawalWallets
          .filter((item: {[blockchain: string]: string}) => item.blockchain === blockchain)
          .map((item: {[address: string]: string}) => ({
            address: item.address,
            currency: currency.split('.')[0],
            currencyId: currency,
            chain: item.chain
          }));
      }
      this.disabledConfirm = !this.addresses.every((item) => item.address.length);
    },

    ...mapActions('balances', ['loadBalances']),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),
    ...mapActions('wallets', ['loadWithdrawalWallets', 'withdrawalsRequest']),
    ...mapActions('withdrawal_wallet', ['loadWithdrawalWallets', 'requestWithdrawal']),
  },
});
</script>

<style lang="scss" scoped>
</style>
