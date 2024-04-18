<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-2">
        <div class="page-title">
          {{ $t('Withdrawal from exchange') }}
        </div>
      </div>
    </div>
    <div class="card">
      <ui-table
        :columns="tableColumns"
        :data="exchangeWithdrawalHistory"
        paginationable
        :loading="loading"
        :per-page-default="perPageDefault"
        :total-entries="pagination.total"
        @per-page-select-changed="perPageSelectHandler"
        @page-changed="pageChangeHandler"
      >
      </ui-table>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import UiTable from '@/components/ui/UiTable.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default defineComponent({
  components: { UiTable },
  data() {
    return {
      tableColumns: [
        {
          label: 'Date',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Amount',
          field: 'amount',
          textAlign: 'text-center',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-center',
        },
      ],
      loading: false,
      currentPage: '1',
      perPageDefault: '25',
    };
  },
  computed: {
    ...mapState('exchanges', {
      pagination: 'pagination',
    }),
    ...mapGetters('exchanges', {
      exchangeWithdrawalHistory: 'getExchangeWithdrawalHistory',
    }),
  },
  methods: {
    ...mapActions('exchanges', ['loadExchangeColdWalletHistory']),
    async loadExchangeColdWalletHistoryData(page: string, perPage: string) {
      try {
        const params: Record<string, any> = {
          page,
          perPage,
        };
        await this.loadExchangeColdWalletHistory(params);
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      } catch (e) {
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },
    perPageSelectHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadExchangeColdWalletHistoryData(page, perPage);
    },

    pageChangeHandler(page: string, perPage: string) {
      this.loading = true;
      this.loadExchangeColdWalletHistoryData(page, perPage);
    },
  },
  async created() {
    await this.loadExchangeColdWalletHistoryData(this.currentPage, this.perPageDefault);
    this.$store.commit('app/setProgressBar', 'stop');
  },
});
</script>

<style scoped lang="scss">

</style>
