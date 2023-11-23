<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-2">
        <div class="page-title">
          {{ $t('Invoices') }}
        </div>
        <router-link
          class="button button-primary px-6 py-3 flex items-center gap-1"
          :to="{ name: 'invoice-create' }"
        >
          <feather-icon type="plus" size="16" stroke-width="3" />
          <span>{{ $t('Create Invoice') }}</span>
        </router-link>
      </div>
    </div>
    <form
      class="mb-6"
      @submit.prevent="searchInvoice"
    >
      <div class="search-group">
        <ui-input
          v-model="searchValue"
          type="text"
          class="input-search"
          :placeholder="$t('Search by Order Id / Invoice Id')"
        />
        <button
          class="button button-search"
          type="submit"
        >
          <feather-icon type="search" size="16" />
          <span>{{ $t('Search') }}</span>
        </button>
      </div>
    </form>

    <div
      v-if="invoices.length"
      class="card"
    >
      <ui-table
        :columns="tableColumns"
        :data="invoices"
        paginationable
        :loading="loading"
        :per-page-default="perPageDefault"
        :total-entries="pagination.total"
        @per-page-select-changed="perPageSelectHandler"
        @page-changed="pageChangeHandler"
      >
        <template v-slot:cell-orderId="{row: item}">
          <div class="flex items-center gap-2">
            <span>{{item.orderId}}</span>
            <ui-copy-to-clipboard
              v-if="item.orderId"
              :text-to-copy="item.orderId"
            />
          </div>
        </template>
        <template v-slot:cell-id="{row: item}">
          <div class="flex items-center gap-2">
            <span>{{item.id}}</span>
            <ui-copy-to-clipboard
              v-if="item.id"
              :text-to-copy="item.id"
            />
          </div>
        </template>
        <template v-slot:cell-status="{row: item}">
          <span
            :class="{
              'waiting-status': item.status === 'waiting'
                || item.status === 'partially_paid'
                || item.status === 'waiting_confirmations',
              'success-status': item.status === 'paid'
                || item.status === 'overpaid'
                || item.status === 'success',
              'error-status': item.status === 'expired'
                || item.status === 'partially_paid_expired'
                || item.status === 'cancelled',
            }"
          >
            {{ $t(item.status) }}
          </span>
        </template>
        <template v-slot:cell-amount="{row: item}">
          {{ item.amount }} ({{ item.currency }})
        </template>
        <template v-slot:cell-actions="{row: item}">
          <div class="table-actions">
            <a
              v-if="item.status === 'waiting'
                || item.status ==='partially_paid'
                || item.status === 'waiting_confirmations'
              "
              :href="`/invoices/${item.id}`"
              class="cursor-pointer text-primary-500 hover:text-primary-600"
            >
              {{ $t('Checkout') }}
            </a>
            <router-link
              class="cursor-pointer text-primary-500 hover:text-primary-600"
              :to="{ name: 'invoice-details', params: { invoice_id: item.id } }"
            >
              {{ $t('Details') }}
            </router-link>
          </div>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiTable,
    UiCopyToClipboard,
    UiInput,
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
          label: 'Store',
          field: 'storeName',
          textAlign: 'text-left',
        },
        {
          label: 'Order Id',
          field: 'orderId',
          textAlign: 'text-left',
        },
        {
          label: 'Invoice Id',
          field: 'id',
          textAlign: 'text-left',
        },
        {
          label: 'Status',
          field: 'status',
          textAlign: 'text-center',
        },
        {
          label: 'Amount',
          field: 'amount',
          textAlign: 'text-center',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
      searchValue: '',
      currentPage: '1',
      perPageDefault: '25',
      sortField: '',
      sortDirection: 'desc',
      loading: false,
    };
  },

  computed: {
    ...mapState('invoices', {
      pagination: 'pagination',
    }),
    ...mapGetters('invoices', {
      invoices: 'getInvoices',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
  },

  watch: {
    async storeFilterTrigger() {
      this.loading = true;
      this.setStoreFilterBtnLoading(true);
      await this.loadInvoicesData(this.currentPage, this.perPageDefault);
      this.setStoreFilterBtnLoading(false);
    },
  },

  async created() {
    if (this.invoices.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadInvoicesData(this.currentPage, this.perPageDefault);
    this.$store.commit('app/setProgressBar', 'stop');
  },

  methods: {
    async searchInvoice() {
      this.currentPage = '1';
      this.sortField = '';
      this.sortDirection = 'desc';
      await this.$router.replace({
        name: this.$route.name as string,
        query: this.searchValue ? { query: this.searchValue } : {},
      });
      this.loading = true;
      await this.loadInvoicesData(this.currentPage, this.perPageDefault);
    },

    perPageSelectHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadInvoicesData(page, perPage);
    },

    pageChangeHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadInvoicesData(page, perPage);
    },

    async loadInvoicesData(page: string, perPage: string) {
      const query = this.$route.query.query as string;
      this.searchValue = query;
      try {
        const params: Record<string, any> = {
          page,
          perPage,
          query: query ? this.searchValue : '',
          sortDirection: this.sortDirection,
        };

        if (this.sortField) {
          params.sortField = this.sortField;
        }

        await this.loadInvoices(params);
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      } catch (e) {
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },

    ...mapActions('invoices', ['loadInvoices']),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),
  },
});
</script>

<style lang="scss" scoped>
.search-group {
  @apply flex;
}

.input-search {
  @apply w-full items-center relative z-1;

  &::placeholder {
    @apply text-sm;
  }
}

.button-search {
  @apply flex gap-2 items-center bg-white px-8 border-1 text-primary-500 hover:border-primary-500;
}

.table-actions {
  @apply flex justify-end gap-4;
}
</style>
