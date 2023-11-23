<template>
  <div class="flex flex-col gap-6">
    <exchange-settings />

    <div
      v-if="walletsLoading && !isWalletsLoaded"
      class="grid gap-6 grid-cols-[1fr,1fr]"
    >
      <ui-skeleton-box
        v-for="i in 2" :key="i"
        width="100%"
        height="100px"
      />
    </div>
    <div v-else class="flex gap-6 flex-wrap">
      <deposit-wallets />
      <withdrawal-wallets />
    </div>
    <div v-if="depositWallets.length" class="flex justify-end">
      <router-link
        class="button button-primary px-4 py-2"
        :to="{
            name: 'withdrawals-exchange-2',
            params: {
              exchange_name: exchangeName,
            }
          }"
      >
        {{ $t('Next Step') }}
      </router-link>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import ExchangeSettings from '@/components/exchanges/ExchangeSettings.vue';
import DepositWallets from '@/components/exchanges/DepositWallets.vue';
import WithdrawalWallets from '@/components/exchanges/WithdrawalWallets.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    ExchangeSettings,
    DepositWallets,
    WithdrawalWallets,
    UiSkeletonBox,
  },

  computed: {
    ...mapState('exchanges', {
      isWalletsLoaded: 'isWalletsLoaded',
      depositWallets: 'depositWallets',
      walletsLoading: 'walletsLoading',
    }),

    exchangeName(): string {
      return this.$route.params.exchange_name as string;
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
