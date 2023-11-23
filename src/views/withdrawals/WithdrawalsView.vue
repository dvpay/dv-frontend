<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-2">
        <div class="page-title">
          {{ $t('Withdrawals History') }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-6">
      <withdrawals-stats />
      <withdrawals-dates />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WithdrawalsStats from '@/components/withdrawals/WithdrawalsStats.vue';
import WithdrawalsDates from '@/components/withdrawals/WithdrawalsDates.vue';

export default defineComponent({
  components: {
    WithdrawalsStats,
    WithdrawalsDates,
  },
});
</script>
