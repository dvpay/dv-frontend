<template>
  <div
    v-if="dataLength"
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Related Invoice') }}
    </div>
    <table class="w-full mb-6">
      <tbody>
        <template v-for="(column, i) in tableColumns" :key="i">
          <tr class="border-b">
            <template v-if="column.field === 'store'">
              <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
                {{ $t(column.label) }}
              </th>
              <td class="break-all py-2">
                {{ transactionInvoice.store.title }}
              </td>
            </template>
            <template v-else-if="column.field === 'storeId'">
              <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
                {{ $t(column.label) }}
              </th>
              <td class="break-all py-2">
                {{ transactionInvoice.store.id }}
              </td>
            </template>
            <template v-else-if="column.field === 'amount'">
              <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
                {{ $t(column.label) }}
              </th>
              <td class="py-2">
                {{ transactionInvoice.amount }} $
              </td>
            </template>
            <template v-else-if="column.field === 'status'">
              <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
                {{ $t(column.label) }}
              </th>
              <td class="py-2">
                {{ $t(transactionInvoice.status) }}
              </td>
            </template>
            <template v-else>
              <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
                {{ $t(column.label) }}
              </th>
              <td class="break-all py-2">
                {{ transactionInvoice[column.field] }}
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <ui-button-loading
      class="button button-primary py-2 px-4 self-start"
      :loading="btnLoading"
      @click="reSendWebhookHandler"
    >
      {{ $t('Re-Send webhook') }}
    </ui-button-loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import { delay } from '@/utils';

export default defineComponent({
  components: {
    UiButtonLoading,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Invoice Id',
          field: 'id',
          textAlign: 'text-left',
        },
        {
          label: 'Order Id',
          field: 'orderId',
          textAlign: 'text-left',
        },
        {
          label: 'Store',
          field: 'store',
          textAlign: 'text-left',
        },
        {
          label: 'Store Id',
          field: 'storeId',
          textAlign: 'text-left',
        },
        {
          label: 'Created Date',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Expiration Date',
          field: 'expiredAt',
          textAlign: 'text-left',
        },
        {
          label: 'Amount',
          field: 'amount',
          textAlign: 'text-left',
        },
        {
          label: 'Status',
          field: 'status',
          textAlign: 'text-left',
        },
      ],
      btnLoading: false,
    };
  },

  computed: {
    dataLength(): number {
      return Object.keys(this.transactionInvoice).length;
    },

    ...mapState('transactions', {
      transactionDetails: 'transactionDetails',
    }),
    ...mapGetters('transactions', {
      transactionInvoice: 'getTransactionInvoice',
    }),
  },

  methods: {
    async reSendWebhookHandler() {
      try {
        this.btnLoading = true;
        await this.reSendWebhook(this.transactionInvoice.id);
        await delay(5000);
        await this.searchTransaction(this.transactionDetails.txId);
        this.$toast.success(this.$t('Webhook was successfully sent'));
        this.btnLoading = false;
      } catch (e) {
        this.btnLoading = false;
      }
    },

    ...mapActions('transactions', ['reSendWebhook', 'searchTransaction']),
  },
});
</script>
