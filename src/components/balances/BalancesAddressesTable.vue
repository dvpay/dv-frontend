<template>
  <div
    v-if="allInvoiceAddresses.length"
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Balances of invoice addresses') }}
  </div>
    <ui-table
      :columns="tableColumns"
      :data="allInvoiceAddresses"
      paginationable
      :loading="loading"
      :per-page-default="perPageDefault"
      :total-entries="pagination.total"
      @per-page-select-changed="perPageSelectHandler"
      @page-changed="pageChangeHandler"
    >
      <template v-slot:cell-storeId="{row: item}">
        <div class="flex items-center gap-2">
          <span>{{item.storeId}}</span>
          <ui-copy-to-clipboard
            v-if="item.storeId"
            :text-to-copy="item.storeId"
          />
        </div>
      </template>
      <template v-slot:cell-invoiceId="{row: item}">
        <div class="flex items-center gap-2">
          <span>{{item.invoiceId}}</span>
          <ui-copy-to-clipboard
            v-if="item.invoiceId"
            :text-to-copy="item.invoiceId"
          />
        </div>
      </template>
      <template v-slot:cell-address="{row: item}">
        <div
          v-if="item.address"
          class="flex items-center gap-2"
        >
          <span>{{item.address}}</span>
          <ui-copy-to-clipboard
            v-if="item.address"
            :text-to-copy="item.address"
          />
        </div>
        <div v-else class="text-gray-600">
          {{ $t('Address does not requested yet') }}
        </div>
      </template>
      <template v-slot:cell-currencyId="{row: item}">
        {{ item.currencyId.split('.')[0] }} ({{item.currencyId.split('.')[1]}})
      </template>
    </ui-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';

export default defineComponent({
  components: {
    UiTable,
    UiCopyToClipboard,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Store Id',
          field: 'storeId',
          textAlign: 'text-left',
        },
        {
          label: 'Store Name',
          field: 'storeName',
          textAlign: 'text-left',
        },
        {
          label: 'Invoice Id',
          field: 'invoiceId',
          textAlign: 'text-left',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
        {
          label: 'Currency',
          field: 'currencyId',
          textAlign: 'text-left',
        },
        {
          label: 'Balance',
          field: 'balance',
          textAlign: 'text-right',
        },
      ],
      currentPage: '1',
      perPageDefault: '25',
      sortField: '',
      sortDirection: 'desc',
      loading: false,
    };
  },

  computed: {
    ...mapState('invoices', {
      allInvoiceAddresses: 'allInvoiceAddresses',
      pagination: 'allInvoiceAddressesPagination',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
  },

  watch: {
    async storeFilterTrigger() {
      this.loading = true;
      this.setStoreFilterBtnLoading(true);
      await this.loadData(this.currentPage, this.perPageDefault);
      this.setStoreFilterBtnLoading(false);
    },
  },

  created() {
    this.loadData(this.currentPage, this.perPageDefault);
  },

  methods: {
    perPageSelectHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadData(page, perPage);
    },

    pageChangeHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadData(page, perPage);
    },

    async loadData(page: string, perPage: string) {
      try {
        const params: Record<string, any> = {
          page,
          perPage,
          sortDirection: this.sortDirection,
        };

        if (this.sortField) {
          params.sortField = this.sortField;
        }

        await this.loadAllInvoiceAddresses(params);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    ...mapActions('invoices', ['loadAllInvoiceAddresses']),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),
  },
});
</script>

<style lang="scss" scoped>
</style>
