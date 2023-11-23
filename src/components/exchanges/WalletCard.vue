<template>
  <div class="card">
    <div class="card-title mb-6">
      {{ title }}
    </div>
    <div class="flex flex-col gap-6">
      <ui-switcher2
        v-if="checkExchangeDirection"
        class="self-start"
        :label="$t('Enable automatic exchange')"
        v-model="enabledExchangeComp"
      />

      <div
        v-if="exchangeDirection.length"
        class="flex items-center gap-2"
      >
        <span class="font-600">
          {{ $t('Exchange Direction') }}:
        </span>
        <span class="uppercase font-600 bg-gray-200 px-8px py-2px">
          {{ `${exchangeDirection[0].currencyFrom} / ${exchangeDirection[0].currencyTo}` }}
        </span>
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="depositWallets"
          class="self-start"
        >
          {{ $t('Deposit wallet') }}
        </label>
        <ui-select
          id="depositWallets"
          class="h-40px"
          :placeholder="`${$t('Select wallet')}...`"
          v-model="depositWalletsSelectedComp"
          :options="depositWalletsOptions"
        />
      </div>

      <div class="flex items-end gap-2">
        <ui-input
          class="max-w-200px"
          type="number"
          id="minBalance"
          v-model="minBalanceComp"
          :label="$t('Min Balance')"
        />
        <span class="mb-9px font-600">USD</span>
      </div>

      <div
        v-if="withdrawalWalletsOptions.length || checkExchangeDirection"
        class="flex flex-col gap-6"
      >
        <ui-switcher2
          class="self-start"
          :label="$t('Enable automatic withdrawals')"
          v-model="enabledWithdrawalComp"
          :disabled="automaticWithdrawalDisabled"
        />

        <div
          v-if="checkWithdrawalAddresses || !checkExchangeDirection"
          class="flex flex-col gap-6"
        >
          <div class="flex flex-col gap-2">
            <label
              for="withdrawalWallets"
              class="self-start"
            >
              {{ $t('Withdrawal wallets') }}
            </label>
            <ui-select
              id="withdrawalWallets"
              class="h-40px"
              :placeholder="`${$t('Select wallet')}...`"
              v-model="withdrawalWalletsSelectedComp"
              :options="withdrawalWalletsOptions"
              @change="addWithdrawalWalletHandler"
            />
          </div>

          <ui-table
            v-if="withdrawalWallets.length"
            :columns="tableColumns"
            :data="withdrawalWallets"
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
            <template v-slot:cell-actions="{row: item}">
              <div class="flex justify-end">
                <button
                  class="button button-error flex items-center px-2 h-32px"
                  @click="deleteWithdrawalWallet(item.address)"
                >
                  <feather-icon type="trash-2" size="18" />
                </button>
              </div>
            </template>
          </ui-table>
        </div>
        <div
          v-else
          class="text-red-500"
        >
          {{ $t('automatic_withdrawal_is_not_available_text') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiTable from '@/components/ui/UiTable.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiSwitcher2 from '@/components/ui/UiSwitcher2.vue';
import { SelectOptionType } from '@/components/types';
import {
  IColdWalletAddresses,
  ExchangeCurrenciesUserList,
} from '@/services/WalletsService/types';

export default defineComponent({
  components: {
    UiSelect,
    UiInput,
    UiTable,
    UiCopyToClipboard,
    UiSwitcher2,
  },

  props: {
    index: {
      type: Number,
    },
    title: {
      type: String,
    },
    enabledWithdrawal: {
      type: Boolean,
    },
    enabledExchange: {
      type: Boolean,
    },
    depositWalletsSelected: {
      type: String,
    },
    minBalance: {
      type: [Number, String],
    },
    withdrawalWalletsSelected: {
      type: String,
    },
    depositWalletsOptions: {
      type: Array as PropType<SelectOptionType[]>,
    },
    withdrawalWalletsOptions: {
      type: Array as PropType<SelectOptionType[]>,
    },
    withdrawalWallets: {
      type: Array as PropType<IColdWalletAddresses[]>,
    },
    exchangeDirection: {
      type: Array as PropType<ExchangeCurrenciesUserList[]>,
    },
    checkWithdrawalAddresses: {
      type: Boolean,
    },
    checkExchangeDirection: {
      type: Boolean,
    },
  },

  emits: [
    'update:enabledExchange',
    'update:enabledWithdrawal',
    'update:depositWalletsSelected',
    'update:minBalance',
    'update:withdrawalWalletsSelected',
    'deleteWithdrawalWallet',
    'addWithdrawalWallet',
  ],

  data() {
    return {
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
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
    };
  },

  computed: {
    enabledWithdrawalComp: {
      get() {
        return this.automaticWithdrawalDisabled
          ? !this.automaticWithdrawalDisabled
          : this.enabledWithdrawal;
      },
      set(value: boolean) {
        this.$emit('update:enabledWithdrawal', value);
      },
    },

    enabledExchangeComp: {
      get() {
        return this.enabledExchange;
      },
      set(value: boolean) {
        this.$emit('update:enabledExchange', value);
      },
    },

    depositWalletsSelectedComp: {
      get() {
        return this.depositWalletsSelected;
      },
      set(value: string) {
        this.$emit('update:depositWalletsSelected', value);
      },
    },

    minBalanceComp: {
      get() {
        return this.minBalance;
      },
      set(value: string) {
        this.$emit('update:minBalance', value);
      },
    },

    withdrawalWalletsSelectedComp: {
      get() {
        return this.withdrawalWalletsSelected;
      },
      set(value: string) {
        this.$emit('update:withdrawalWalletsSelected', value);
      },
    },

    automaticWithdrawalDisabled() {
      return !(this.withdrawalWallets?.length
        && (this.checkWithdrawalAddresses || !this.checkExchangeDirection));
    },
  },

  methods: {
    deleteWithdrawalWallet(value: string) {
      this.$emit('deleteWithdrawalWallet', { address: value, index: this.index });
    },

    addWithdrawalWalletHandler(value: string) {
      this.$emit('addWithdrawalWallet', { address: value, index: this.index });
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
