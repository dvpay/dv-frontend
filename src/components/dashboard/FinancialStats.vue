<template>
  <ui-skeleton-box
    v-if="skeletonLoading"
    width="100%"
    height="206px"
  />
  <div
    v-else
    class="card flex flex-col justify-between <desktop-lg:gap-4"
  >
    <div class="card-title mb-4">
      {{ $t('Financial stats') }}
    </div>
    <table class="w-full">
      <tbody>
      <tr>
        <td class="py-2 px-2">{{ $t('Cold wallets assets') }}</td>
        <td class="py-2 px-2"> ${{ numberFormatter(financialStats.coldWalletsUsdSum) }} </td>
      </tr>

      <tr>
        <td class="py-2 px-2">{{ $t('Exchange assets') }}</td>
        <td class="py-2 px-2"> ${{ numberFormatter(financialStats.exchangeWalletsUsdSum) }} </td>
      </tr>

      <tr>
        <td class="py-2 px-2">{{ $t('Assets at unconfirmed transactions') }}</td>
        <td class="py-2 px-2"> ${{ numberFormatter(financialStats.unconfirmedBtcTransactions) }} </td>
      </tr>

      <tr>
        <td class="py-2 px-2">{{ $t('Last successful payment') }}</td>
        <td class="py-2 px-2"> {{ financialStats.lastSuccessfulDepositTransactionTime }} </td>
      </tr>

      <tr>
        <td class="py-2 px-2">{{ $t('Last successful withdrawal') }}</td>
        <td class="py-2 px-2"> {{ financialStats.lastSuccessfulWithdrawTransactionTime }} </td>
      </tr>

      </tbody>
    </table>

    <div class="grid grid-rows-2 grid-flow-col <desktop-lg:flex  <desktop-lg:flex-col gap-5">
      <button
        class="button py-2 px-4"
        :class="[statusPermissions.storePay ? 'button-success' : 'button-primary']"
        @click="showModalHanler('payments')"
      >
        {{ statusPermissions.storePay ? $t('Start Payments') : $t('Stop Payments') }}
      </button>
      <button
        v-if="typeof exchangeColdWalletIsEnabled !== 'undefined'"
        class="button py-2 px-4"
        :class="!exchangeColdWalletIsEnabled ? 'button-success' : 'button-primary'"
        @click="showModalHanler('stopWithdrawalColdWallet')"
      >
        {{
          exchangeColdWalletIsEnabled ? $t('Suspend transfers from the exchange') : $t('Restore transfers from the exchange')
        }}
      </button>

      <button
        class="button py-2 px-4"
        :class="[statusPermissions.stopExchange ? 'button-success' : 'button-primary']"
        @click="showModalHanler('stopExchange')"
      >
        {{
          statusPermissions.stopExchange ? $t('Restore exchange on the exchange') : $t('Suspend exchange on the exchange')
        }}
      </button>
      <button
        class="button py-2 px-4"
        :class="[statusPermissions.withdrawal ? 'button-success' : 'button-primary']"
        @click="showModalHanler('transfers')"
      >
        {{ statusPermissions.withdrawal ? $t('Start Transfers') : $t('Stop Transfers') }}
      </button>
    </div>
    <ui-modal
      v-model="showModal"
      :loading="modalLoading"
      @confirm="confirmModalHandler"
    >
      <template v-slot:title>
        <div v-if="stopType === 'payments'">
          {{ statusPermissions.storePay ? $t('Start Payments') : $t('Stop Payments') }}
        </div>
        <div v-if="stopType === 'transfers'">
          {{ statusPermissions.withdrawal ? $t('Start Transfers') : $t('Stop Transfers') }}
        </div>
        <div v-if="stopType === 'stopWithdrawalColdWallet'">
          {{
            exchangeColdWalletIsEnabled ? $t('Suspend transfers from the exchange') : $t('Restore transfers from the exchange')
          }}
        </div>
        <div v-if="stopType === 'stopExchange'">
          {{
            statusPermissions.stopExchange ? $t('Restore exchange on the exchange') : $t('Suspend exchange on the exchange')
          }}
        </div>
      </template>
      <div>
        <div v-if="stopType === 'payments'">
          {{
            statusPermissions.storePay
              ? $t('Start accepting payments for all stores?')
              : $t('Stop accepting payments for all stores?')
          }}
        </div>
        <div v-if="stopType === 'transfers'">
          {{
            statusPermissions.withdrawal
              ? $t('Start transfers from hot wallets?')
              : $t('Stop transfers from hot wallets?')
          }}
        </div>
        <div v-if="stopType === 'stopWithdrawalColdWallet'">
          {{
            exchangeColdWalletIsEnabled ? $t('Suspend transfers from the exchange') : $t('Restore transfers from the exchange')
          }}?
        </div>
        <div v-if="stopType === 'stopExchange'">
          {{
            statusPermissions.stopExchange ? $t('Restore exchange on the exchange') : $t('Suspend exchange on the exchange')
          }}?
        </div>
      </div>
    </ui-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiModal from '@/components/ui/UiModal.vue';
import {numberFormatter} from '@/utils';

export default defineComponent({
  components: {
    UiSkeletonBox,
    UiModal,
  },

  data() {
    return {
      skeletonLoading: false,
      exchangeColdWalletIsEnabled: undefined,
      showModal: false,
      modalLoading: false,
      stopType: '',
    };
  },

  computed: {
    statusPermissions(): { withdrawal: boolean; storePay: boolean; stopExchange: boolean } {
      return this.userInfo.permission;
    },

    ...mapState('dashboard', {
      financialStats: 'financialStats',
      isFinancialStatsLoaded: 'isFinancialStatsLoaded',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
    ...mapState('user', {
      userInfo: 'userInfo',
    }),
    ...mapState('exchanges', {
      coldWallets: 'coldWallets',
    }),
  },

  created() {
    if (!this.isFinancialStatsLoaded) {
      this.skeletonLoading = true;
    }
    this.loadData();
  },

  watch: {
    async storeFilterTrigger() {
      this.setStoreFilterBtnLoading(true);
      await this.loadData();
      this.setStoreFilterBtnLoading(false);
    },
  },

  methods: {
    numberFormatter,
    async loadData() {
      try {
        await this.loadFinancialStats();
        await this.loadColdWallet({ exchange: 'huobi' });
        if (this.coldWallets.length) {
          this.exchangeColdWalletIsEnabled = this.coldWallets[0].isWithdrawalEnable;
        }
        this.skeletonLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
      }
    },

    async confirmModalHandler() {
      this.modalLoading = true;
      try {
        if (this.stopType === 'payments') {
          await this.stopOrStartAllStores(this.statusPermissions.storePay);
        }
        if (this.stopType === 'transfers') {
          await this.stopOrStartAllTransfers(!this.statusPermissions.withdrawal);
        }
        if (this.stopType === 'stopWithdrawalColdWallet') {
          this.exchangeColdWalletIsEnabled = this.exchangeColdWalletIsEnabled !== undefined ? !this.exchangeColdWalletIsEnabled : undefined;
          await this.toggleStatus({ status: this.exchangeColdWalletIsEnabled });
        }
        if (this.stopType === 'stopExchange') {
          await this.changeStatusExchange({ status: !this.statusPermissions.stopExchange });
        }

        this.modalLoading = false;
        this.showModal = false;
        this.$toast.success(this.$t('Success'));
      } catch (e) {
        this.modalLoading = false;
      }
    },

    showModalHanler(type: string) {
      this.stopType = type;
      this.showModal = true;
    },

    ...mapActions('dashboard', [
      'loadFinancialStats',
      'stopOrStartAllStores',
      'stopOrStartAllTransfers',
    ]),
    ...mapActions('exchanges', [
      'toggleStatus',
      'loadColdWallet',
      'changeStatusExchange',
    ]),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),
  },
});
</script>

<style lang="scss" scoped>
.status-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
}
</style>
