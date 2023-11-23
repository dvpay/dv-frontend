<template>
  <ui-skeleton-box
    v-if="skeletonLoading"
    width="100%"
    height="151px"
  />
  <div
    v-else
    class="card relative"
  >
    <div class="flex items-center gap-4 mb-4">
      <div class="card-title">
        {{ $t('Deposit Summary') }}
      </div>
      <div
        aria-hidden="true"
        class="underline link"
        @click="showDetailsStatistic"
      >
        {{ !isShowDetailsStatistic
          ? `${ $t('Show detailed statistics') } >>>`
          : `<<< ${ $t('Hide detailed statistics') }`
        }}
      </div>
    </div>
    <ui-table
      v-if="depositSummary.length"
      :columns="tableColumn"
      :data="getDepositSummary"
    >
      <template v-slot:cell-sum="{row: item}">
        {{ item.sum }} $
      </template>
    </ui-table>
    <div
      v-else
      class="text-gray-600"
    >
      {{ $t('There are no deposit summary.') }}
    </div>
    <ui-loading :loading="tableLoading" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiLoading from '@/components/ui/UiLoading.vue';

export default defineComponent({
  components: {
    UiTable,
    UiSkeletonBox,
    UiLoading,
  },

  data() {
    return {
      skeletonLoading: false,
      tableLoading: false,
      tableColumn: [
        {
          label: 'Date',
          field: 'date',
          textAlign: 'text-left',
        },
        {
          label: 'Amount',
          field: 'sum',
          textAlign: 'text-center',
        },
        {
          label: 'Deposit Count',
          field: 'transactionCount',
          textAlign: 'text-center',
        },
        {
          label: 'Invoice Paid Count',
          field: 'paidInvoiceCount',
          textAlign: 'text-center',
        },
        {
          label: 'Invoice Count',
          field: 'invoiceCount',
          textAlign: 'text-right',
        },
      ],
      isShowDetailsStatistic: false,
    };
  },

  computed: {
    ...mapState('dashboard', {
      depositSummary: 'depositSummary',
      isDepositSummaryLoaded: 'isDepositSummaryLoaded',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
    ...mapGetters('dashboard', ['getDepositSummary']),
  },

  async created() {
    if (!this.isDepositSummaryLoaded) {
      this.skeletonLoading = true;
    }
    if (this.depositSummary.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadData();
    this.$store.commit('app/setProgressBar', 'stop');
  },

  watch: {
    async storeFilterTrigger() {
      this.tableLoading = true;
      this.setStoreFilterBtnLoading(true);
      await this.loadData();
      this.setStoreFilterBtnLoading(false);
    },
  },

  methods: {
    async loadData() {
      try {
        await this.loadDepositSummary({
          range: !this.isShowDetailsStatistic ? 'day' : 'month',
        });
        this.skeletonLoading = false;
        this.tableLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
        this.tableLoading = false;
      }
    },

    async selectHandler() {
      this.tableLoading = true;
      await this.loadData();
    },

    showDetailsStatistic() {
      this.isShowDetailsStatistic = !this.isShowDetailsStatistic;
      this.tableLoading = true;
      this.loadData();
    },

    ...mapActions('dashboard', ['loadDepositSummary']),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),
  },
});
</script>

<style lang="scss" scoped>
</style>
