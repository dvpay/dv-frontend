<template>
  <ui-skeleton-box
    v-if="skeletonLoading"
    width="100%"
    height="131px"
  />
  <div
    v-else
    class="card"
  >
    <div class="flex items-center gap-4 mb-4">
      <div class="card-title">
        {{ $t('Deposit Transactions') }}
      </div>
      <div
        aria-hidden="true"
        class="underline link"
        @click="showStatisticsForMonth"
      >
        {{ !isShowStatisticsForMonth
        ? `${ $t('Show statistics for month') } >>>`
        : `<<< ${ $t('Show statistics for day') }`
        }}
      </div>
    </div>
    <ui-table
      v-if="lastDepositTransactions.length"
      :columns="tableColumnComp"
      :data="lastDepositTransactions"
      :loading="tableLoading"
    >
      <template v-slot:cell-custom="{row: item}">
        <div
          v-if="item.custom"
          class="flex flex-col gap-2"
        >
          <template v-for="(custom, i) in item.custom" :key="i">
            <a
              v-if="custom.type === 'link'"
              :href="custom.href"
              class="link"
              target="_blank"
              ref="noopener noreferrer"
            >
              {{ custom.value }}
            </a>
          </template>
        </div>
        <div v-else>
          {{ item.description }}
        </div>
      </template>
      <template v-slot:cell-amountUsd="{row: item}">
        {{ item.amountUsd }} $
      </template>
      <template v-slot:cell-data="{row: item}">
        <div
          class="break-all flex items-center gap-4 justify-center"
        >
          <div>
            <img
              v-if="item.currencyId === 'BTC.Bitcoin'"
              class="w-18px"
              src="@/assets/img/icons/btc.svg"
              alt="icon"
            >
            <img
              v-if="item.currencyId === 'USDT.Tron'"
              class="w-18px"
              src="@/assets/img/icons/usdt.svg"
              alt="icon"
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="text-green-500">
              {{ item.amount }}
            </span>
            <span>
              {{ item.currencyId.split('.')[0] }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <a
              class="cursor-pointer text-primary-500 hover:text-primary-600"
              :href="item.explorerLink" target="_blank" ref="noopener noreferrer"
            >
              {{ `${item.tx.slice(0, 7)}...${item.tx.slice(-5)}` }}
            </a>
            <ui-copy-to-clipboard :text-to-copy="item.tx" />
          </div>
        </div>
      </template>
      <template v-slot:cell-actions="{row: item}">
        <router-link
          v-if="item.invoiceId"
          class="cursor-pointer text-primary-500 hover:text-primary-600"
          :to="{ name: 'invoice-details', params: { invoice_id: item.invoiceId } }"
        >
          {{ $t('Details') }}
        </router-link>
      </template>
    </ui-table>
    <div
      v-else
      class="text-gray-600"
    >
      {{ $t('There are no deposit transactions.') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';

export default defineComponent({
  components: {
    UiTable,
    UiSkeletonBox,
    UiCopyToClipboard,
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
          label: 'Store Name',
          field: 'storeName',
          textAlign: 'text-center',
        },
        {
          label: 'Description',
          field: 'custom',
          textAlign: 'text-center',
        },
        {
          label: 'Amount In USD',
          field: 'amountUsd',
          textAlign: 'text-center',
        },
        {
          label: 'Data',
          field: 'data',
          textAlign: 'text-center',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
      isShowStatisticsForMonth: false,
    };
  },

  computed: {
    tableColumnComp(): Array<Record<string, string>> {
      if (this.getStoreSelectedOptionsLocal.length <= 1) {
        return this.tableColumn.filter((item) => item.field !== 'storeName');
      }
      return this.tableColumn;
    },

    ...mapState('dashboard', {
      isLastDepositTransactionsLoaded: 'isLastDepositTransactionsLoaded',
    }),
    ...mapGetters('dashboard', {
      lastDepositTransactions: 'getLastDepositTransactions',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
    ...mapGetters('stores', ['getStoreSelectedOptionsLocal']),
  },

  created() {
    if (!this.isLastDepositTransactionsLoaded) {
      this.skeletonLoading = true;
    }
    this.loadData();
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
        await this.loadLastDepositTransactions({
          range: !this.isShowStatisticsForMonth ? 'day' : 'month',
        });
        this.skeletonLoading = false;
        this.tableLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
        this.tableLoading = false;
      }
    },

    showStatisticsForMonth() {
      this.isShowStatisticsForMonth = !this.isShowStatisticsForMonth;
      this.tableLoading = true;
      this.loadData();
    },

    ...mapActions('dashboard', ['loadLastDepositTransactions']),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),
  },
});
</script>

<style lang="scss" scoped>
</style>
