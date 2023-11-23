<template>
  <div class="wrapper">
    <div class="title">
      {{ $t('Payment details') }}
    </div>
    <div class="flex flex-col gap-10px h-full">
      <div class="sub-title">
        {{ $t('Transactions') }}
      </div>
      <div v-if="!invoiceMsgStatus.formHide" class="details">
        <div v-if="transactions.length" class="flex flex-col gap-10px">
          <div
            v-for="(item, i) in transactions" :key="i"
            class="details-item"
          >
            <div class="font-600">{{ $t('Tx Hash') }}:</div>
            <div class="flex items-center gap-2">
              <a
                :href="item.linkToExplorer"
                class="underline hover:opacity-80"
                target="_blank"
                ref="noopener noreferrer"
              >
                {{ `${item.txId.slice(0, 7)}...${item.txId.slice(-7)}` }}
              </a>
              <ui-copy-to-clipboard
                :text-to-copy="item.txId"
              />
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-center"
        >
          {{ $t('There are no payment transactions.') }}
        </div>
      </div>
      <div v-else class="details">
        <div v-if="allTransactions.length" class="flex flex-col gap-10px">
          <div
            v-for="(item, i) in allTransactions" :key="i"
            class="details-item"
          >
            <div class="font-600">{{ $t('Tx Hash') }}:</div>
            <div class="flex items-center gap-2">
              <a
                :href="item.linkToExplorer"
                class="underline hover:opacity-80"
                target="_blank"
                ref="noopener noreferrer"
              >
                {{ `${item.txId.slice(0, 7)}...${item.txId.slice(-7)}` }}
              </a>
              <ui-copy-to-clipboard
                :text-to-copy="item.txId"
              />
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-center"
        >
          {{ $t('There are no payment transactions.') }}
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <button
        class="close-btn"
        @click="closePaymentDetailsHandler"
      >
      <span class="font-600">
        {{ $t('Close payment details') }}
      </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';

export default defineComponent({
  components: {
    UiCopyToClipboard,
  },

  computed: {
    ...mapState('invoice', {
      invoiceAddresses: 'invoiceAddresses',
      selectedCurrency: 'selectedCryptocurrencyAndNetwork',
      invoiceMsgStatus: 'invoiceMsgStatus',
    }),
    ...mapGetters('invoice', {
      selectedFindIndex: 'selectedCryptocurrencyIndex',
      allTransactions: 'allTransactions',
    }),

    selectedIndex(): number {
      return this.selectedFindIndex(this.selectedCurrency);
    },

    transactions(): string[] {
      return this.invoiceAddresses[this.selectedIndex]?.transactions
        ? this.invoiceAddresses[this.selectedIndex].transactions
        : [];
    },
  },

  methods: {
    ...mapMutations('invoice', ['setIsShowPaymentDetails']),

    closePaymentDetailsHandler() {
      this.setIsShowPaymentDetails(false);
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  @apply w-full bg-white flex flex-col gap-15px p-20px;
  box-shadow: 0px -15px 40px rgba(97, 103, 112, 0.25);
  border-radius: 20px 20px 0 0;
}

.title {
  @apply text-center font-600 text-22px;
}

.sub-title {
  text-align: center;
  font-weight: 600;
  color: #757685;
}

.details {
  @apply border-2 border-x-gray rounded-20px;
  background-color: #f9f9f9;
  padding: 16px;
  height: 100%;
  width: 100%;
}

.details-item {
  @apply bg-white rounded-8px h-44px flex items-center justify-between px-16px;
  box-shadow: 0 12px 20px rgba(68, 75, 85, 0.05);
}

.close-btn {
  @apply border-2 border-dark-gray rounded-48px py-10px px-30px justify-center;
  @apply leading-16px text-sm flex items-center cursor-pointer;
}
</style>
