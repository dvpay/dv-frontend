<template>
  <div class="transactions-wrapper">
    <div
      v-if="transactions"
      class="transactions"
      :class="isShowAll ? 'full-height': 'auto'"
    >
      <div
        v-for="item in payerTransactions"
        :key="item.id"
        class="transaction-item"
        aria-hidden="true"
      >
        <div class="flex flex-col">
          <span class="text-12px lg:text-14px leading-20px lg:leading-20px text-black font-500">{{ item.created_at.split(' ')[0] }}</span>
          <span class="text-10px lg:text-12px leading-12px lg:leading-16px font-600 text-black opacity-[.6]">{{ item.created_at.split(' ')[1] }}</span>
          <span></span>
        </div>
        <span class="text-14px lg:text-16px leading-20px lg:leading-20px text-blue-200 font-500">{{ `${item.tx_id.slice(0, 7)}...${item.tx_id.slice(-7)}` }}</span>
        <div class="flex flex-col items-end">
          <span class="text-14px leading-20px text-black font-600">- $ {{ numberFormatter(item.amount_usd) }}</span>
          <span class="hidden lg:inline text-12px leading-16px font-500 text-green-600">{{ $t('Confirmed') }}</span>
        </div>
      </div>
    </div>
    <button
      class="flex font-400px text-12px lg:text-14px leading-20px text-gray-500 mt-12px lg:mt-8px ml-auto hover:text-gray-100 transition-color"
      @click="toggleShowAll"
    >
      {{ isShowAll ? `${$t('Show less')}` : `${$t('Show all')}` }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { PayerTransaction } from '@/services/PayerService/types';
import { numberFormatter } from '@/utils';

export default defineComponent({
  props: {
    transactions: {
      type: Array as PropType<PayerTransaction[] | undefined>,
      required: true,
    },
  },

  data() {
    return {
      isShowAll: false,
    };
  },

  computed: {
    payerTransactions() {
      return this.isShowAll ? this.transactions : this.transactions?.slice(0, 3);
    },
  },

  methods: {
    numberFormatter,
    toggleShowAll() {
      this.isShowAll = !this.isShowAll;
    },
  },
});
</script>

<style lang="scss" scoped>
.transactions-wrapper {
  @apply bg-secondary-700 px-16px lg:px-24px pt-0 pb-16px lg:rounded-b-16px;
  border-bottom: 4px solid theme('colors.success.250');
}

.transactions {
  @apply flex flex-col py-20px px-16px lg:py-18px lg:px-14px bg-gray-200 border-2 border-x-gray rounded-16px gap-12px;
  overflow-y: auto;

  .transaction-item {
    @apply flex items-center justify-between gap-2 py-12px lg:py-14px px-16px min-h-68px;
    @apply bg-white border-2 border-gray-300 rounded-12px;
    transition: all .2s ease;
  }
}

.full-height {
  height: calc(100vh - 438px);
}
</style>
