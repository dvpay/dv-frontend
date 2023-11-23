<template>
  <div>
    <div
      class="card"
    >
      <div class="card-title mb-4">
        {{ $t('Withdrawals Transactions') }}
      </div>
      <div v-if="loading" class="border-b py-4 px-3">
        <ui-skeleton-box
          height="14px"
          width="100%"
        />
      </div>
      <div v-else>
        <ui-table
          v-if="withdrawalsTransactions.length"
          :columns="tableColumns"
          :data="withdrawalsTransactions"
          paginationable
          :loading="tableLoading"
          :per-page-default="perPageDefault"
          :total-entries="pagination.total"
          @per-page-select-changed="perPageSelectHandler"
          @page-changed="pageChangeHandler"
        >
          <template v-slot:cell-address="{row: item}">
            <div class="flex items-center gap-2">
              <span>{{item.address}}</span>
              <ui-copy-to-clipboard
                v-if="item.address"
                :text-to-copy="item.address"
              />
            </div>
          </template>
          <template v-slot:cell-txId="{row: item}">
            <div class="flex items-center gap-2">
            <span>
              {{ `${item.txId.slice(0, 7)}...${item.txId.slice(-5)}` }}
            </span>
              <ui-copy-to-clipboard
                v-if="item.txId"
                :text-to-copy="item.txId"
              />
            </div>
          </template>
          <template v-slot:cell-currency="{row: item}">
            <span>{{ item.currency.split('.')[0] }}</span>
          </template>
          <template v-slot:cell-isManual="{row: item}">
            <div v-if="item.isManual">{{ $t('Manual') }}</div>
            <div v-else>{{ $t('Automatic') }}</div>
          </template>
        </ui-table>
        <div
          v-else
          class="text-gray-600"
        >
          {{ $t('There are no withdrawals transactions.') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    UiCopyToClipboard,
    UiTable,
    UiSkeletonBox,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Date',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
        {
          label: 'Tx Id',
          field: 'txId',
          textAlign: 'text-left',
        },
        {
          label: 'Currency',
          field: 'currency',
          textAlign: 'text-center',
        },
        {
          label: 'Amount',
          field: 'amount',
          textAlign: 'text-center',
        },
        {
          label: 'Type',
          field: 'isManual',
          textAlign: 'text-right',
        },
      ],
      tableLoading: false,
      currentPage: '1',
      perPageDefault: '25',
      loading: true,
    };
  },

  computed: {
    ...mapState('wallets', {
      wallets: 'wallets',
      pagination: 'withdrawalsTransactionsPagination',
      isWithdrawalsTransactionsLoaded: 'isWithdrawalsTransactionsLoaded',
    }),
    ...mapGetters('wallets', {
      withdrawalsTransactions: 'getWithdrawalsTransactions',
    }),

    dateParam() {
      return this.$route.params.date as string;
    },
  },

  async created() {
    await this.loadWithdrawalsData(this.currentPage, this.perPageDefault);
    this.$store.commit('app/setProgressBar', 'stop');
  },

  methods: {
    async loadWithdrawalsData(page: string, perPage: string) {
      try {
        const params: Record<string, string> = {
          page,
          perPage,
          dateFrom: this.dateParam,
          dateTo: this.dateParam,
        };
        await this.loadWithdrawalsTransactions(params);
        this.tableLoading = false;
        this.loading = false;
      } catch (e) {
        this.tableLoading = false;
        this.loading = false;
      }
    },

    perPageSelectHandler(page: string, perPage: string) {
      this.tableLoading = true;
      this.loadWithdrawalsData(page, perPage);
    },

    pageChangeHandler(page: string, perPage: string) {
      this.tableLoading = true;
      this.loadWithdrawalsData(page, perPage);
    },

    ...mapActions('wallets', ['loadWithdrawalsTransactions']),
  },
});
</script>
