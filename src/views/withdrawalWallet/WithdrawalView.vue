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
    <div class="flex flex-col gap-6 card">
      <h2 class=" text-2xl  font-semibold ">{{ $t('Transfer Title') }}</h2>
      <div class="mt-2">
        {{ $t('withdrawal_info_text') }}
      </div>
      <div>
        <ui-skeleton-box v-if="skeletonLoading" width="100%" height="167px"/>
        <ui-table v-else :data="withdrawalWallets" :columns="tableColumns">
          <template v-slot:cell-blockchain="{ row: item }">
            <span class="uppercase">{{ item.blockchain }}</span>
          </template>
          <template v-slot:cell-currency="{ row: item }">
            <span class="uppercase">{{ item.blockchain }} ({{ item.chain }})</span>
          </template>
          <template v-slot:cell-address="{ row: item }">
            <span>{{
                item.address.length ? item.address?.join(',') : $t('Address is empty')
              }}</span>
          </template>
          <template v-slot:cell-settings="{ row: item }">
            <router-link class="cursor-pointer text-primary-500 hover:text-primary-600" :to="{
                            name: 'withdrawal-edit',
                            params: {
                                wallet_id: item.id,
                            }
                        }">
              {{ $t('Enter Wallet') }}
            </router-link>
          </template>

        </ui-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WithdrawalTab from '@/components/withdrawalWallet/WithdrawalTab.vue';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import { mapActions, mapState } from 'vuex';

export default defineComponent({
  components: {
    WithdrawalTab,
    UiSkeletonBox,
    UiTable
  },

  computed: {
    ...mapState('withdrawal_wallet', {
      withdrawalWallets: 'withdrawalWallets',
      isWithdrawalWalletsLoaded: 'isWithdrawalWalletsLoaded'
    }),
  },

  methods: {
    ...mapActions('withdrawal_wallet', [
      'loadWithdrawalWallets',
    ]),

    async loadData() {
      try {
        if (!this.isWithdrawalWalletsLoaded) {
          this.skeletonLoading = true;
        }
        if (this.isWithdrawalWalletsLoaded) {
          this.$store.commit('app/setProgressBar', 'stop');
        }
        await this.loadWithdrawalWallets();
        this.$store.commit('app/setProgressBar', 'stop');
        this.skeletonLoading = false;
      } catch (e) {
        this.$store.commit('app/setProgressBar', 'stop');
        this.skeletonLoading = false;
      }
    },

  },

  data() {
    return {
      skeletonLoading: false,
      tableColumns: [
        {
          label: 'Blockchain',
          field: 'blockchain',
          textAlign: 'text-left',
        },
        {
          label: 'Currency',
          field: 'currency',
          textAlign: 'text-left',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
        {
          label: 'Settings',
          field: 'settings',
          textAlign: 'text-right',
        },
      ],
    };
  },

  created() {
    this.loadData();
  },
});
</script>
