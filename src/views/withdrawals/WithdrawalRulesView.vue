<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-2">
        <div class="page-title">
          {{ $t('Withdrawal Rules') }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-6">
      <list-exchanges />
      <accumulation-rules />
      <wallets-withdrawals />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WalletsWithdrawals from '@/components/withdrawals/WalletsWithdrawals.vue';
import ListExchanges from '@/components/withdrawals/ListExchanges.vue';
import AccumulationRules from '@/components/withdrawals/AccumulationRules.vue';

export default defineComponent({
  components: {
    WalletsWithdrawals,
    ListExchanges,
    AccumulationRules,
  },
});
</script>
