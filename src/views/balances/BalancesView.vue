<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Hot Wallets') }}
    </div>
    <div class="flex flex-col gap-8">
      <hot-wallets-stats />
      <balance-address-cards />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BalanceAddressCards from '@/components/balances/BalanceAddressCards.vue';
import HotWalletsStats from '@/components/balances/HotWalletsStats.vue';

export default defineComponent({
  components: {
    BalanceAddressCards,
    HotWalletsStats,
  },
});
</script>

<style lang="scss" scoped>
</style>
