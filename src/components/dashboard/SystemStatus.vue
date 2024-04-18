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
    <table class="w-full">
      <tbody>
      <tr v-for="(item, idx) in systemStatus" :key="idx">
        <td
          v-for="(column, i) in tableColumn" :key="i"
          class="py-2 px-2"
          :class="column.textAlign"
        >
          <template v-if="column.field === 'name'">
            <div
              v-if="idx === 0"
              class="flex items-center gap-2"
            >
                <span class="font-600 uppercase whitespace-nowrap">
                  {{ item.name }}
                </span>
              <span
                :class="statusClass(item.status)"
              >
                  {{ item.statusTitle }}
                </span>
            </div>
            <div
              v-else
              class="font-600"
            >
              {{ item.name }}
            </div>
          </template>
          <template v-else-if="column.field === 'ago'">
              <span class="text-primary-600">
                {{ item.ago }}
              </span>
          </template>
          <template v-else-if="column.field === 'message'">
            <div class="text-right">
              <ui-tooltip-td
                v-if="item.message.length > 32"
                :class="{
                    'text-success-500': item.status === 'up',
                    'text-gray-600': item.status === 'unknown',
                    'text-danger-400': item.status === 'down',
                  }"
                :text="item.message"
              >
                  <span :class="statusClass(item.status)">
                    {{ `${item.message.slice(0, 20)}...` }}
                  </span>
              </ui-tooltip-td>
              <div
                v-else
                class="text-right"
              >
                  <span class="whitespace-nowrap" :class="statusClass(item.status)">
                    {{ item.message }}
                  </span>
              </div>
            </div>
          </template>
          <template v-else>
            {{ item[column.field] }}
          </template>
        </td>
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
        <div v-if="stopType === 'payments'"
             :class="{'text-red-600': !statusPermissions.storePay}"
        >
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
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiTooltipTd from '@/components/ui/UiTooltipTd.vue';
import UiModal from '@/components/ui/UiModal.vue';

export default defineComponent({
  components: {
    UiSkeletonBox,
    UiTooltipTd,
    UiModal,
  },

  data() {
    return {
      skeletonLoading: false,
      exchangeColdWalletIsEnabled: undefined,
      tableColumn: [
        {
          field: 'name',
          textAlign: 'text-left',
        },
        {
          field: 'ago',
          textAlign: 'text-center',
        },
        {
          field: 'message',
          textAlign: 'text-left',
        },
      ],
      showModal: false,
      modalLoading: false,
      stopType: '',
    };
  },

  computed: {
    statusClass() {
      return (status: string) => {
        switch (status) {
          case 'up':
            return 'success-status';
          case 'unknown':
            return 'waiting-status';
          case 'down':
            return 'error-status';
          default:
            return 'waiting-status';
        }
      };
    },

    statusPermissions(): { withdrawal: boolean; storePay: boolean; stopExchange: boolean } {
      return this.userInfo.permission;
    },

    ...mapState('dashboard', {
      isSystemStatusLoaded: 'isSystemStatusLoaded',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
    ...mapGetters('dashboard', {
      systemStatus: 'getSystemStatus',
      financialStats: 'getFinancialStats',
    }),
    ...mapState('user', {
      userInfo: 'userInfo',
    }),
    ...mapState('exchanges', {
      coldWallets: 'coldWallets',
    }),
  },

  created() {
    if (!this.isSystemStatusLoaded) {
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
    async loadData() {
      try {
        await this.loadSystemStatus();
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
      'loadSystemStatus',
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
