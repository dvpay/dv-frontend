<template>
  <div
    v-if="dataLength"
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Transaction Details') }}
    </div>
    <table class="w-full">
      <tbody>
        <template v-for="(column, i) in tableColumns" :key="i">
          <tr class="border-b">
            <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
              {{ $t(column.label) }}
            </th>
            <td class="break-all py-2">
              {{ transactionDetails[column.field] }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  data() {
    return {
      tableColumns: [
        {
          label: 'Tx Id',
          field: 'txId',
          textAlign: 'text-left',
        },
        {
          label: 'Currency',
          field: 'currency',
          textAlign: 'text-left',
        },
        {
          label: 'Blockchain',
          field: 'blockchain',
          textAlign: 'text-left',
        },
        {
          label: 'Contract Address',
          field: 'contractAddress',
          textAlign: 'text-left',
        },
        {
          label: 'Amount',
          field: 'amount',
          textAlign: 'text-left',
        },
        {
          label: 'Amount In USD',
          field: 'amountUsd',
          textAlign: 'text-left',
        },
        {
          label: 'Rate',
          field: 'rate',
          textAlign: 'text-left',
        },
        {
          label: 'Time',
          field: 'time',
          textAlign: 'text-left',
        },
        {
          label: 'Receiver',
          field: 'receiver',
          textAlign: 'text-left',
        },
        {
          label: 'Sender',
          field: 'sender',
          textAlign: 'text-left',
        },
        {
          label: 'Status',
          field: 'status',
          textAlign: 'text-left',
        },
      ],
    };
  },

  computed: {
    dataLength(): boolean {
      if (Object.keys(this.transactionDetails).length) {
        return this.transactionDetails?.txId
          && !!Object.keys(this.transactionDetails?.txId)?.length;
      }
      return false;
      
    },

    ...mapGetters('transactions', {
      transactionDetails: 'getTransactionDetails',
    }),
  },
});
</script>
