<template>
  <div
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Withdrawals By Days') }}
    </div>
    <div v-if="skeletonLoading" class="border-b py-4 px-3">
      <ui-skeleton-box
        height="14px"
        width="100%"
      />
    </div>
    <div v-else>
      <ui-table
        v-if="withdrawalsDates.length"
        :columns="tableColumns"
        :data="withdrawalsDates"
        paginationable
        :loading="tableLoading"
        :per-page-default="perPageDefault"
        :total-entries="pagination.total"
        @per-page-select-changed="perPageSelectHandler"
        @page-changed="pageChangeHandler"
      >
        <template v-slot:cell-date="{row: item}">
          <router-link
            class="link"
            :to="{ name: 'withdrawals-transactions', params: { date: item.dateParam }}"
          >
            {{ item.date }}
          </router-link>
        </template>
        <template v-slot:cell-amountUsd="{row: item}">
          {{ item.amountUsd }} $
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    UiTable,
    UiSkeletonBox,
  },

  data() {
    return {
      skeletonLoading: false,
      tableColumns: [
        {
          label: 'Date',
          field: 'date',
          textAlign: 'text-left',
        },
        {
          label: 'Amount',
          field: 'amountUsd',
          textAlign: 'text-center',
        },
        {
          label: 'Transactions Count',
          field: 'transactionCount',
          textAlign: 'text-right',
        },
      ],
      tableLoading: false,
      currentPage: '1',
      perPageDefault: '25',
    };
  },

  computed: {
    ...mapState('wallets', {
      pagination: 'withdrawalsDatesPagination',
      isWithdrawalsDatesLoaded: 'isWithdrawalsDatesLoaded',
    }),
    ...mapGetters('wallets', {
      withdrawalsDates: 'getWithdrawalsDates',
    }),
  },

  async created() {
    if (!this.isWithdrawalsDatesLoaded) {
      this.skeletonLoading = true;
    }
    if (this.withdrawalsDates.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadWithdrawalsData(this.currentPage, this.perPageDefault);
    this.$store.commit('app/setProgressBar', 'stop');
  },

  methods: {
    ...mapActions('wallets', ['loadWithdrawalsDates']),

    async loadWithdrawalsData(page: string, perPage: string) {
      try {
        const params: Record<string, string> = {
          page, perPage,
        };
        await this.loadWithdrawalsDates(params);
        this.tableLoading = false;
        this.skeletonLoading = false;
      } catch (e) {
        this.tableLoading = false;
        this.skeletonLoading = false;
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
  },
});
</script>

<style lang="scss" scoped>
</style>
