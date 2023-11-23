<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Dashboard') }}
    </div>
    <div class="mb-4">
      <confirm-email-alert />
    </div>
    <div class="flex flex-col gap-6">
      <div
        class="grid gap-6 grid-cols-[8fr,10fr] <desktop-lg:grid-cols-[440px,10fr] <desktop-sm:grid-cols-[1fr]"
      >
        <your-balances />
        <system-status />
      </div>
      <div
        class="grid gap-6 grid-cols-[8fr,10fr] <desktop-lg:grid-cols-[440px,10fr] <desktop-sm:grid-cols-[1fr]"
      >
        <processing-balances />
        <saved-and-exchanged />
      </div>
      <deposit-summary />
      <last-transactions />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import YourBalances from '@/components/dashboard/YourBalances.vue';
import SystemStatus from '@/components/dashboard/SystemStatus.vue';
import ProcessingBalances from '@/components/dashboard/ProcessingBalances.vue';
import SavedAndExchanged from '@/components/dashboard/SavedAndExchanged.vue';
import DepositSummary from '@/components/dashboard/DepositSummary.vue';
import LastTransactions from '@/components/dashboard/LastTransactions.vue';
import ConfirmEmailAlert from '@/components/ConfirmEmailAlert.vue';

export default defineComponent({
  components: {
    YourBalances,
    SystemStatus,
    ProcessingBalances,
    SavedAndExchanged,
    DepositSummary,
    LastTransactions,
    ConfirmEmailAlert,
  },
});
</script>
