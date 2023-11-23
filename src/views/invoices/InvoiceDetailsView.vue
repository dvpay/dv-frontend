<template>
  <div class="flex flex-col gap-8">
    <div>
      <div class="flex items-center justify-between gap-2 <desktop:(flex-col items-start)">
        <div class="invoice-title">
          <span>{{ $t('Invoice') }}</span>
          <span>{{ invoiceId }}</span>
        </div>
        <div class="button-block">
        <div class="flex gap-6">
          <a
            v-if="invoiceDetails.status === 'waiting'
            || invoiceDetails.status === 'partially_paid'"
            :href="`/invoices/${invoiceId}`"
            class="button button-primary px-6 py-3 flex items-center gap-2"
          >
            {{ $t('Checkout') }}
          </a>
          <router-link
            :to="{ name: 'invoices' }"
            class="button button-primary px-6 py-3 flex items-center gap-2"
          >
            {{ $t('Back') }}
          </router-link>
        </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title mb-4">
        {{ $t('Invoice Information') }}
      </div>
      <table
        v-if="loading"
        class="w-full"
      >
        <tbody>
          <template v-for="i in 10" :key="i">
            <tr class="border-b">
              <td class="py-2">
                <ui-skeleton-box
                  height="17.5px"
                  width="100%"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <table
        v-else
        class="w-full"
      >
        <tbody>
          <template v-for="(column, i) in invoiceDetailsColums" :key="i">
            <tr class="border-b">
              <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
                {{ $t(column.label) }}
              </th>
              <template v-if="column.field === 'amount'">
                <td class="break-all py-2">
                  {{ invoiceDetails.amount }} $
                </td>
              </template>
              <template v-else-if="column.field === 'status'">
                <td class="break-all py-2">
                  {{ $t(invoiceDetails.status) }}
                </td>
              </template>
              <template v-else>
                <td class="break-all py-2">
                  {{ invoiceDetails[column.field] }}
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-title mb-4">
        {{ $t('User Information') }}
      </div>
      <table
        v-if="loading"
        class="w-full"
      >
        <tbody>
        <template v-for="i in 2" :key="i">
          <tr class="border-b">
            <td class="py-2">
              <ui-skeleton-box
                height="17.5px"
                width="100%"
              />
            </td>
          </tr>
        </template>
        </tbody>
      </table>
      <table
        v-else
        class="w-full"
      >
        <tbody>
          <tr class="border-b">
            <th class="py-2 pr-3 font-500 text-gray-600 text-left">
              {{ $t('Ip') }}
            </th>
            <td class="break-all py-2">
              {{ invoiceDetails.ip }}
            </td>
          </tr>
          <tr class="border-b">
            <th class="py-2 pr-3 font-500 text-gray-600 text-left">
              {{ $t('UserAgent') }}
            </th>
            <td class="break-all py-2">
              {{ invoiceDetails.userAgent }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <invoice-details-history :loading="loading" />
    <div class="card">
      <div class="card-title mb-4">
        {{ $t('Invoice Summary') }}
      </div>

      <table
        v-if="loading"
        class="w-full"
      >
        <tbody>
          <template v-for="i in 2" :key="i">
            <tr class="border-b">
              <td class="py-4">
                <ui-skeleton-box
                  height="20px"
                  width="100%"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <ui-table
        v-else
        :columns="invoiceSummaryColumns"
        :data="invoiceDetailsAddresses"
      >
        <template v-slot:cell-address="{row: item}">
          <div>
            <div
              v-if="item.address"
              class="break-all flex items-center gap-2"
            >
              <span>{{ item.address }}</span>
              <ui-copy-to-clipboard :text-to-copy="item.address" />
            </div>
            <div v-else>
              {{ $t('Address does not requested yet') }}
            </div>
          </div>
        </template>
      </ui-table>
    </div>
    <div class="card">
      <div class="card-title mb-4">
        {{ $t('Transactions') }}
      </div>
      <table
        v-if="loading"
        class="w-full"
      >
        <tbody>
          <template v-for="i in 2" :key="i">
            <tr class="border-b last:border-0">
              <td class="py-4">
                <ui-skeleton-box
                  height="20px"
                  width="100%"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <ui-table
        v-else
        :columns="invoicetransactionsColumns"
        :data="invoiceDetailsTransactions"
      >
        <template v-slot:cell-tx="{row: item}">
          <div class="flex items-center gap-2">
            <span>{{ `${item.tx.slice(0, 7)}...${item.tx.slice(-5)}` }}</span>
            <ui-copy-to-clipboard :text-to-copy="item.tx" />
          </div>
        </template>
        <template v-slot:cell-sender="{row: item}">
          <div
            v-if="item.sender"
            class="flex items-center gap-2"
          >
            <span>{{ item.sender }}</span>
            <ui-copy-to-clipboard :text-to-copy="item.sender" />
          </div>
        </template>
      </ui-table>
    </div>
    <webhook-history-table />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiTable from '@/components/ui/UiTable.vue';
import WebhookHistoryTable from '@/components/invoices/WebhookHistoryTable.vue';
import InvoiceDetailsHistory from '@/components/invoices/InvoiceDetailsHistory.vue';

export default defineComponent({
  components: {
    UiCopyToClipboard,
    UiSkeletonBox,
    UiTable,
    WebhookHistoryTable,
    InvoiceDetailsHistory,
  },

  data() {
    return {
      invoiceDetailsColums: [
        {
          label: 'Store',
          field: 'storeName',
          textAlign: 'text-left',
        },
        {
          label: 'Invoice Id',
          field: 'id',
          textAlign: 'text-left',
        },
        {
          label: 'Store Id',
          field: 'storeId',
          textAlign: 'text-left',
        },
        {
          label: 'Status',
          field: 'status',
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
          label: 'Description',
          field: 'description',
          textAlign: 'text-left',
        },
        {
          label: 'Return Url',
          field: 'returnUrl',
          textAlign: 'text-left',
        },
        {
          label: 'Success Url',
          field: 'successUrl',
          textAlign: 'text-left',
        },
        {
          label: 'Price',
          field: 'amount',
          textAlign: 'text-left',
        },
      ],
      invoiceSummaryColumns: [
        {
          label: 'Payment Method',
          field: 'currency',
          textAlign: 'text-left',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
        {
          label: 'Rate',
          field: 'rate',
          textAlign: 'text-left',
        },
        {
          label: 'Paid',
          field: 'balance',
          textAlign: 'text-right',
        },
      ],
      invoicetransactionsColumns: [
        {
          label: 'Payment Method',
          field: 'currency',
          textAlign: 'text-left',
        },
        {
          label: 'Date',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Transaction Hash',
          field: 'tx',
          textAlign: 'text-left',
        },
        {
          label: 'Sender',
          field: 'sender',
          textAlign: 'text-left',
        },
        {
          label: 'Amount',
          field: 'amount',
          textAlign: 'text-right',
        },
      ],
      loading: true,
    };
  },

  computed: {
    invoiceId() {
      return this.$route.params.invoice_id;
    },

    ...mapState('invoices', {
      invoiceDetailsAddresses: 'invoiceDetailsAddresses',
    }),
    ...mapGetters('invoices', {
      invoiceDetails: 'getInvoiceDetails',
      invoiceDetailsTransactions: 'getInvoiceDetailsTransactions',
    }),
  },

  created() {
    this.loadInvoicesDetailsData();
  },

  unmounted() {
    this.clearInvoiceDetailsData();
  },

  methods: {
    async loadInvoicesDetailsData() {
      try {
        await this.loadInvoiceDetails(this.invoiceId);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    ...mapMutations('invoices', ['clearInvoiceDetailsData']),
    ...mapActions('invoices', ['loadInvoiceDetails']),
  },
});
</script>

<style lang="scss" scoped>
.invoice-title {
  @apply flex gap-2 text-2xl;

  @include tablet {
    @apply flex-col gap-2 w-full text-center text-xl;
  }
}

.button-block {
  @apply flex;
  @include tablet {
    @apply w-full justify-center;
  }
}
</style>
