<template>
  <div v-if="isPayerExist">
    <div
      class="card"
    >
      <div class="card-title mb-4">
        {{ $t('Payer Information') }}
      </div>
      <table class="w-full mb-6">
        <tbody>
        <template v-for="(column, i) in tableColumns" :key="i">
          <tr class="border-b">
            <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
              {{ $t(column.label) }}
            </th>
            <td class="break-all py-2">
              {{ transactionDetails.payer[column.field] ?? transactionDetails[column.field] }}
            </td>
          </tr>
        </template>
        </tbody>
      </table>
      <ui-button-loading
        v-if="transactionDetails.txId"
        class="button button-primary py-2 px-4 self-start"
        :loading="btnLoading"
        @click="attachToPayer"
      >
        {{ $t('Attach to payer') }}
      </ui-button-loading>
    </div>
    <div class="card mt-6">
      <div class="card-title mb-4">
        {{ $t('Transactions') }}
      </div>
      <ui-table
        :columns="transactionsColumns"
        :data="transactionDetails.transactions"
      >
        <template v-slot:cell-tx_id="{row: item}">
          <div class="flex items-center gap-2">
            <span>{{ `${item.tx_id.slice(0, 7)}...${item.tx_id.slice(-5)}` }}</span>
            <ui-copy-to-clipboard :text-to-copy="item.tx_id"/>
          </div>
        </template>
        <template v-slot:cell-from_address="{row: item}">
          <div
            v-if="item.from_address"
            class="flex items-center gap-2"
          >
            <span>{{ item.from_address }}</span>
            <ui-copy-to-clipboard :text-to-copy="item.from_address"/>
          </div>
        </template>
        <template v-slot:cell-amount="{row: item}">
          <div
            v-if="item.amount_usd"
          >
            <span>{{
                item.currency_id === 'USDT.Tron' ? numberFormatterNew(item.amount_usd) : decimalNew(item.amount_usd)
              }}</span>
          </div>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import { decimal, delay, numberFormatter } from '@/utils';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiTable from '@/components/ui/UiTable.vue';

export default defineComponent({
  components: {
    UiTable,
    UiCopyToClipboard,
    UiButtonLoading,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Store',
          field: 'storeName',
          textAlign: 'text-left',
        },
        {
          label: 'Payer Id',
          field: 'id',
          textAlign: 'text-left',
        },
        {
          label: 'Store Payer Id',
          field: 'storeUserId',
          textAlign: 'text-left',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
      ],
      transactionsColumns: [
        {
          label: 'Payment Method',
          field: 'currency_id',
          textAlign: 'text-left',
        },
        {
          label: 'Date',
          field: 'created_at',
          textAlign: 'text-left',
        },
        {
          label: 'Transaction Hash',
          field: 'tx_id',
          textAlign: 'text-left',
        },
        {
          label: 'Sender',
          field: 'from_address',
          textAlign: 'text-left',
        },
        {
          label: 'Amount',
          field: 'amount_usd',
          textAlign: 'text-right',
        },
      ],
      btnLoading: false,
    };
  },

  computed: {
    ...mapGetters('transactions', {
      transactionDetails: 'getTransactionDetails',
    }),

    isPayerExist(): boolean {
      if (Object.keys(this.transactionDetails).length) {
        return this.transactionDetails?.payer
          && !!Object.keys(this.transactionDetails?.payer)?.length;
      }
      return false;
    },
  },

  methods: {
    ...mapActions('transactions', ['attachTransactionToPayer', 'searchTransaction']),

    async attachToPayer() {
      try {
        this.btnLoading = true;
        await this.attachTransactionToPayer(this.transactionDetails.txId);
        await delay(5000);
        await this.searchTransaction(this.transactionDetails.txId);
        this.$toast.success(this.$t('Transaction was successfully attached to payer'));
        this.btnLoading = false;
      } catch (e) {
        this.btnLoading = false;
      }
    },

    decimalNew(value: string) {
      return decimal(value);
    },
    numberFormatterNew(value: string) {
      return numberFormatter(value);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
