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
      <div v-if="!processingTelegram.hasChatID" class="text-center flex items-center flex-col text-xl">
        {{ $t('Processing OTP description') }}
        <div class="relative mt-3">
          <a
            class="flex cursor-pointer w-40 items-center gap-2 rounded-32px button-secondary pr-4"
            :href="processingTelegram.deeplink"
          >
            <img
              class="w-32px"
              src="@/assets/img/icons/telegram.svg" alt="telegram"
            >
            {{ $t('Subscribe') }}
          </a>
        </div>
      </div>
      <div v-else>
        <ui-skeleton-box v-if="skeletonLoading" width="100%" height="167px"/>
        <ui-table v-else :data="withdrawalWallets" :columns="tableColumns">
          <template v-slot:cell-blockchain="{ row: item }">
            <span class="uppercase">{{ item?.blockchain }}</span>
          </template>
          <template v-slot:cell-currency="{ row: item }">
            <span class="uppercase">{{ item?.blockchain }} ({{ item?.chain }})</span>
          </template>
          <template v-slot:cell-address="{ row: item }">
            <span>
              <template  v-if="item?.address.length">
                <template v-if="item?.address.length < 3">
                  {{ item?.address?.join(',') }}
                </template>
                <template v-else>
                  <span>
                    {{ $t('You have_') + item?.address.length + $t('_addresses.') }}
                    <span v-on:click.prevent="isModalWithAddressesVisible[item?.chain]=true" class="text-gray-400 cursor-pointer"> {{ $t('Show') }}</span>
                        <ui-modal
                          v-model="isModalWithAddressesVisible[item?.chain] "
                          :disabled-confirm=true
                          :display-confirm=false
                        >
                          <template v-slot:title>
                            <span class="uppercase">{{ item?.blockchain }} ({{ item?.chain }})</span>
                          </template>
                          <div
                            class="flex flex-col gap-4"
                          >
                            <ul class="max-w-md space-y-1 list-none list-inside dark:text-gray-400">
                                <li v-for="(addr, i) in item?.address">
                                    {{ addr }}
                                </li>
                            </ul>
                          </div>
                        </ui-modal>
                    </span>
                </template>
              </template>
              <template v-else>
                {{ $t('Address is empty') }}
              </template>
            </span>
          </template>
          <template v-slot:cell-settings="{ row: item }">
            <router-link class="cursor-pointer text-primary-500 hover:text-primary-600" :to="{
                            name: 'withdrawal-edit',
                            params: {
                                wallet_id: item?.id,
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
import UiModal from '@/components/ui/UiModal.vue';
import UiOtp from '@/components/ui/UiOtp.vue';

export default defineComponent({
  components: {
    UiOtp,
    UiModal,
    WithdrawalTab,
    UiSkeletonBox,
    UiTable
  },

  computed: {
    ...mapState('withdrawal_wallet', {
      withdrawalWallets: 'withdrawalWallets',
      isWithdrawalWalletsLoaded: 'isWithdrawalWalletsLoaded'
    }),
    ...mapState('notifications', {
      processingTelegram: 'processingTelegram',
    }),
  },

  methods: {
    ...mapActions('withdrawal_wallet', [
      'loadWithdrawalWallets',
    ]),
    ...mapActions('notifications', [
      'loadTelegramProcessingLink',
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
        await this.loadTelegramProcessingLink();
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
      isModalWithAddressesVisible: {},
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
