<template>
  <div
    v-if="transactionInvoices.length"
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Probably Related Invoices') }}
    </div>

    <ui-table
      :columns="tableColumns"
      :data="transactionInvoices"
      :loading="loading"
    >
      <template v-slot:cell-store="{row: item}">
        {{ item.store.title }}
      </template>
      <template v-slot:cell-actions="{row: item}">
        <button
          class="button button-primary py-1 px-2"
          @click="attachInvoiceHandler(item.id)"
        >
          {{ $t('Attach') }}
        </button>
      </template>
    </ui-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import { delay } from '@/utils';

export default defineComponent({
  components: {
    UiTable,
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
          textAlign: 'text-center',
        },
        {
          label: 'Store',
          field: 'store',
          textAlign: 'text-center',
        },
        {
          label: 'Created Date',
          field: 'createdAt',
          textAlign: 'text-center',
        },
        {
          label: 'Expiration Date',
          field: 'expiredAt',
          textAlign: 'text-center',
        },
        {
          label: 'Amount',
          field: 'amount',
          textAlign: 'text-center',
        },
        {
          label: 'Status',
          field: 'status',
          textAlign: 'text-center',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
      loading: false,
    };
  },

  computed: {
    ...mapState('transactions', {
      transactionDetails: 'transactionDetails',
    }),
    ...mapGetters('transactions', {
      transactionInvoices: 'getTransactionInvoices',
    }),
  },

  methods: {
    async attachInvoiceHandler(invoiceId: string) {
      try {
        this.loading = true;
        await this.attachInvoice({
          transactionId: this.transactionDetails.txId,
          invoiceId,
        });
        await delay(5000);
        await this.searchTransaction(this.transactionDetails.txId);
        this.loading = false;
        this.$toast.success(this.$t('Relate successfully created'));
      } catch (e) {
        this.loading = false;
      }
    },

    ...mapActions('transactions', ['attachInvoice', 'searchTransaction']),
  },
});
</script>

<style lang="scss" scoped>
</style>
