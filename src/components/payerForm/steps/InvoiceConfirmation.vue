<template>
  <div class="flex flex-col py-8px">
    <div
      v-if="currentUnconfirmedTransaction"
      class="info flex flex-col items-stretch justify-between py-16px gap-12px lg:gap-16px"
    >
      <h2 class="text-20px leading-24px font-500 pb-4px">{{ $t('Payment found') }}</h2>
      <div
        class="flex flex-col items-start gap-12px lg:flex-row lg:items-center lg:justify-between lg:gap-16px"
      >
        <div class="flex flex-wrap items-center gap-6px overflow-hidden">
          <span class="flex flex-nowrap items-center gap-6px">
            <i-processor class="icon" />

            <span class="text-14px lg:text-16px leading-20px text-[#5F5F5F]">
              {{ $t('Hash') }}:
            </span>
          </span>
          <span class="text-14px lg:text-16px leading-20px text-blue-200">
            {{
              `${currentUnconfirmedTransaction.tx_id.slice(
                0,
                7
              )}...${currentUnconfirmedTransaction.tx_id.slice(-7)}`
            }}
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-6px">
          <span class="flex flex-nowrap items-center gap-6px">
            <i-dollar class="icon" />

            <span class="text-14px lg:text-16px leading-20px text-[#5F5F5F]">
              {{ $t('Amount') }}:
            </span>
          </span>
          <span class="text-14px lg:text-16px leading-20px text-success-600 truncate">
            {{
              `${currentUnconfirmedTransaction.amount} BTC ($${currentUnconfirmedTransaction.amount_usd})`
            }}
          </span>
        </div>
      </div>
      <div
        class="flex flex-col items-start gap-12px lg:pb-8px lg:flex-row lg:items-center lg:justify-between lg:gap-16px"
      >
        <div class="flex flex-wrap items-center gap-6px overflow-hidden">
          <span class="flex flex-nowrawp items-center gap-6px">
            <i-clock class="icon" />

            <span class="text-14px lg:text-16px leading-20px text-[#5F5F5F]">
              {{ $t('Estimated enrollment time') }}:
            </span>
          </span>
          <span class="text-14px lg:text-16px leading-20px text-black font-500 whitespace-nowrap">
            {{ `~8 ${$t('minutes')}` }}
          </span>
        </div>
        <div
          v-if="currentUnconfirmedTransaction.fee"
          class="flex flex-wrap lg:flex-nowrap items-center gap-6px"
        >
          <span class="flex flex-nowrap items-center gap-6px">
            <ITicket class="icon" />

            <span class="text-14px lg:text-16px leading-20px text-[#5F5F5F]">{{ $t('Fee') }}:</span>
          </span>
          <span class="text-14px lg:text-16px leading-20px text-success-600 truncate">
            ${{ currentUnconfirmedTransaction.fee }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="flex m-auto items-center justify-center max-w-196px max-h-196px lg:max-w-296px lg:max-h-296px mt-16px"
    >
      <payer-form-loader
        class="w-196px h-196px lg:w-296px lg:h-296px h-sm:h-200px h-sm:w-200px"
        type="confirmation"
      >
        <div class="flex flex-col items-center">
          <div class="flex items-center">
            <span class="text-38px leading-44px font-700">0</span
            ><span class="text-25px leading-32px font-600 text-gray-600">/3</span>
          </div>
          <p class="text-10px lg:text-12px leading-16px text-gray-600 font-500">
            {{ $t('confirmations') }}
          </p>
          <div class="tag mt-8px lg:mt-16px">
            <span class="block text-8px lg:text-10px leading-none">{{ $t('Payment found') }}!</span>
          </div>
        </div>
      </payer-form-loader>
    </div>
    <div class="info m-auto w-full max-w-418px mt-16px lg:mt-24px h-md:max-w-full h-md:mt-32px">
      <p class="text-center m-auto">{{ $t('payments_awaiting_text') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import { image } from '@/utils';
import IProcessor from '@/components/icon/IProcessor.vue';
import IDollar from '@/components/icon/IDollar.vue';
import IClock from '@/components/icon/IClock.vue';
import ITicket from '@/components/icon/ITicket.vue';
import { PayerTransaction } from '@/services/PayerService/types';
import PayerFormLoader from '@/components/payerForm/PayerFormLoader.vue';

export default defineComponent({
  components: { PayerFormLoader, IClock, ITicket, IDollar, IProcessor },
  data() {
    return {
      currentUnconfirmedTransaction: undefined,
    };
  },

  computed: {
    ...mapGetters('payer', {
      getUnconfirmedTransactions: 'getUnconfirmedTransactions',
      getTransactions: 'getTransactions',
      selectedPayerAddress: 'selectedPayerAddress',
    }),
  },

  methods: {
    ...mapMutations('payer', ['setStepPayment']),

    image,
  },

  mounted() {
    this.currentUnconfirmedTransaction = this.getUnconfirmedTransactions[0];
  },

  watch: {
    getTransactions(newTransactions) {
      const successTransaction = newTransactions.find(
        (item: PayerTransaction) => item.tx_id === this.currentUnconfirmedTransaction?.tx_id
      );
      if (successTransaction) {
        this.setStepPayment(4);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.text-nowrap {
  text-wrap: nowrap;
}

.info {
  @apply flex items-center justify-center bg-blue-10 rounded-12px border-1 border-blue-100 px-24px py-8px;
  p {
    @apply text-12px leading-16px lg:text-14px lg:leading-20px text-center text-blue-100 h-md:leading-16px h-md:text-14px;
  }
}

.tag {
  @apply px-6px py-2px rounded-12px;
  color: #e27a00;
  background-color: #fff6d4;
  border: 1px solid #e27a00;
  white-space: nowrap;
}

.icon {
  flex-shrink: 0;
}
</style>
