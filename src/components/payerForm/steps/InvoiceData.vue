<template>
  <div class="flex flex-col flex-grow">
    <div class="relative py-8px">
      <div class="text-18px leading-24px lg:text-xl font-500 mb-16px lg:mb-20px h-md:hidden">
        {{ $t('Copy the values from these fields') }}
      </div>

      <div class="flex flex-col gap-24px lg:gap-27px h-md:gap-16px">
        <div class="inputWrapper">
          <div class="label">
            {{ $t('address') }}
          </div>
          <div class="flex gap-6px w-full">
            <div class="input flex-grow truncate">
              <div class="value truncate">
                <span v-if="selectedPayerAddress?.address">
                  {{ selectedPayerAddress.address }}
                </span>
                <span v-else v-for="i in 14" :key="i" class="text-8px">&#9679;</span>
              </div>
              <ui-copy-to-clipboard
                class="copy-icon"
                size="22"
                :text-to-copy="selectedPayerAddress?.address ? selectedPayerAddress?.address : ' '"
              />
            </div>
            <div aria-hidden="true" class="show-qr-btn" @click="showQrHandler">
              <i-qr-code />
            </div>
          </div>
        </div>

        <div v-if="currencyAmount[selectedCurrency]" class="inputWrapper">
          <div class="label">
            {{ $t('amount') }}
          </div>
          <div class="flex gap-6px w-full">
            <div class="input flex-grow">
              <div class="value">
                {{ currencyAmount[selectedCurrency] }}
                {{ selectedCryptocurrency.symbol }}
              </div>
              <ui-copy-to-clipboard
                class="copy-icon"
                size="22"
                :text-to-copy="currencyAmount[selectedCurrency]"
              />
            </div>
            <div aria-hidden="true" class="value-wrapper show-qr-btn" @click="showQrHandler">
              <i-qr-code />
            </div>
          </div>
        </div>
      </div>
      <div class="info mt-16px lg:mt-32px h-md:mt-16px">
        <p class="w-max-[400px] mx-auto">{{ $t('payments_confirmation_text') }}</p>
      </div>
    </div>

    <div
      class="flex items-start justify-center w-full flex-grow mt-56px mb-60px h-md:my-30px h-sm:my-16px"
    >
      <transition>
        <div v-if="showQr" class="qr-wrapper">
          <payer-form-qr class="w-180px h-180px h-sm:w-130px h-sm:h-130px m-auto" />
        </div>
      </transition>
      <div v-if="!showQr" class="flex flex-col items-center max-w-230px h-md:max-w-full">
        <payer-form-loader class="w-196px h-196px h-sm:h-130px lg:w-196px h-sm:w-130px">
          <div class="flex flex-col items-center">
            <img class="loader w-[25%] h-auto" :src="image('loading.svg')" alt="loader" />
            <div class="tag mt-8px">
              <span class="block text-8px leading-12px">{{ $t('Waiting for payment') }}</span>
            </div>
          </div>
        </payer-form-loader>
        <p class="sendText">
          {{ $t('Send your cryptocurrency to the specified details') }}
        </p>
        <!-- <div class="h-60px min-h-60px w-full" /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import IQrCode from '@/components/icon/IQrCode.vue';
import PayerFormQr from '@/components/payerForm/PayerFormQr.vue';
import { image } from '@/utils';
import _xorWith from 'lodash/xorWith';
import _isEqual from 'lodash/isEqual';
import PayerFormLoader from '@/components/payerForm/PayerFormLoader.vue';

export default defineComponent({
  components: {
    PayerFormLoader,
    PayerFormQr,
    IQrCode,
    UiCopyToClipboard,
  },

  data() {
    return {
      showQr: false,
      modalLoading: false,
      showFullAddressString: false,
      previousTransactions: [],
    };
  },

  computed: {
    ...mapState('payer', {
      selectedCurrency: 'selectedCryptocurrencyAndNetwork',
      selectedCryptocurrency: 'selectedCryptocurrency',
      currencyAmount: 'amount',
    }),
    ...mapGetters('payer', {
      selectedPayerAddress: 'selectedPayerAddress',
      getUnconfirmedTransactions: 'getUnconfirmedTransactions',
      getTransactions: 'getTransactions',
    }),
  },

  methods: {
    ...mapMutations('payer', ['setStepPayment']),

    image,

    async showQrHandler() {
      this.showQr = true;
    },
  },

  mounted() {
    this.previousTransactions = this.getTransactions;
  },

  watch: {
    getTransactions(newTransactions) {
      const newTransaction = _xorWith(newTransactions, this.previousTransactions, _isEqual);
      if (newTransaction.length) {
        this.setStepPayment(4);
      }
    },

    getUnconfirmedTransactions(newUnconfirmedTransactions) {
      if (newUnconfirmedTransactions?.length) {
        this.setStepPayment(3);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.inputWrapper {
  @apply relative;

  .label {
    @apply relative capitalize text-14px max-w-full lg:text-16px leading-20px font-400 mb-10px h-md:leading-none h-md:text-14px h-md:mb-[-.6em] h-md:z-99 h-md:px-16px h-md:py-5px h-md:w-max h-md:bg-white h-md:border-b-0 h-md:border-1 h-md:border-gray-300 h-md:rounded-t-12px;
  }

  .input {
    @apply flex items-center justify-between bg-white rounded-12px border-1 border-gray-300 p-16px h-md:py-12px;

    .value {
      @apply text-14px lg:text-17px leading-20px font-400;
    }
  }

  .show-qr-btn {
    @apply flex relative items-center bg-white rounded-12px border-1 border-gray-300 p-15px h-md:py-12px;
    cursor: pointer;

    &:hover {
      color: #000;
    }
  }
}

.info {
  @apply flex items-center justify-center bg-blue-10 rounded-12px border-1 border-blue-100 px-24px py-8px;
  p {
    @apply text-12px leading-16px lg:text-14px lg:leading-20px text-center text-blue-100 h-md:leading-16px h-md:text-14px;
  }
}

.qr-wrapper {
  @apply flex p-12px bg-white rounded-8px;
  box-shadow: 0 0 16px 0 #02125740;
}

.tag {
  @apply px-6px py-2px rounded-12px;
  color: #e27a00;
  background-color: #fff6d4;
  border: 1px solid #e27a00;
  white-space: nowrap;
}

.loader {
  animation: spin 3.5s ease-in-out 0s infinite;
}

.sendText {
  @apply text-12px leading-16px lg:text-14px lg:leading-20px mt-16px text-center text-blue-100 font-500 h-sm:text-12px;
  text-wrap: balance;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
