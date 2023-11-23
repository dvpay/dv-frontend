<template>
  <div
    class="card relative"
  >
    <div class="flex items-center gap-4 mb-4">
      <div class="card-title">
        {{ $t('Wallet stats by date') }}
      </div>
    </div>
    <ui-table
      v-if="processingWalletTransfers.length"
      :columns="tableColumn"
      :data="processingWalletTransfers"
    >
      <template v-slot:cell-createdAt="{row: item}">
        {{ dateFormatter(item.createdAt) }}
      </template>
      <template v-slot:cell-operation="{row: item}">
        <p class="font-500">{{ $t(item.type)}}</p>
        <p>{{ $t('Transfer from hot wallet') }}</p>
        <p>{{ item.fromAddress}} -> {{ item.toAddress}}</p>
      </template>
    </ui-table>
    <div v-else>
      {{ $t('There are no payment transactions.') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';

export default defineComponent({
  name: 'ProcessingWalletByDateView',
  components: { UiTable },
  data() {
    return {
      tableColumn: [
        {
          label: 'Date',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Operation',
          field: 'operation',
          textAlign: 'text-left',
        },
        {
          label: 'Energy',
          field: 'energy',
          textAlign: 'text-right',
        },
        {
          label: 'Bandwidth',
          field: 'bandwidth',
          textAlign: 'text-right',
        },
      ],
    };
  },
  computed: {
    currencyId() {
      return this.$route.params.currency;
    },
    routeDate() {
      return this.$route.params.date;
    },
    ...mapState('processing_wallet', {
      processingWalletTransfers: 'processingWalletTransfers',
    }),
  },
  created() {
    this.loadProcessingWalletTransferData();
  },
  methods: {
    async loadProcessingWalletTransferData() {
      await this.loadProcessingWalletTransfersStats({
        currencyId: this.currencyId,
        date: this.routeDate,
      });
    },
    dateFormatter(date: string) {
      const originalDate = new Date(date);
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(originalDate);
    },
    ...mapActions('processing_wallet', [
      'loadProcessingWalletTransfersStats',
    ]),
  },
});
</script>

<style scoped lang="scss">

</style>
