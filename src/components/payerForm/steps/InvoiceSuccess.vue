<template>
  <div class="flex flex-col py-16px h-md:py-0">
    <div class="border-wrap relative lg:h-192px max-h-192px h-sm:h-auto">
      <div class="relative rounded-10px w-full h-full bg-white max-h-186px overflow-hidden">
        <div class="flex flex-col justify-between h-full p-14px z-20 mr-0 lg:mr-200px">
          <div class="relative flex flex-col gap-1 h-sm:mb-4px">
            <h2 class="text-18px lg:text-20px leading-24px font-600 tracking-[.03em] text-black font-sans tracking-[.01em]">
              <span class="text-blue-100">{{ $t('Free') }}</span> {{ $t('accepting cryptocurrency') }} {{ $t('in your store') }}? <span class="text-blue-100">{{ $t('Easy') }}!</span>
            </h2>
            <p class="text-12px leading-18px text-black opacity-70 mr-30px">{{ $t('payments_successfully_text') }}</p>
          </div>
          <i class="hidden lg:inline text-12px leading-16px">{{ $t('payments_successfully_sub') }}</i>
        </div>
        <img class="image" src="@/assets/img/frame.png" alt="promo">
      </div>
    </div>
    <div class="flex m-auto items-center justify-center max-w-196px lg:max-w-352px mt-20px h-sm:mt-6px">
      <payer-form-loader class="loader w-196px h-196px lg:w-352px lg:h-352px" type="success">
        <div class="tag">
          <span>{{ $t('Payment approved')}}</span>
        </div>
      </payer-form-loader>
    </div>
    <div class="success m-auto my-20px w-full max-w-418px h-sm:my-6px">
      <p>
        <a href="https://dv.net/" target="_blank" ref="noopener noreferrer">www.DV.net</a>
        <span> - DaVinci Merchant</span><br />
        {{ $t('reception and sending crypto') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import { image } from '@/utils';
import { PayerTransaction } from '@/services/PayerService/types';
import PayerFormLoader from '@/components/payerForm/PayerFormLoader.vue';

export default defineComponent({
  components: { PayerFormLoader },
  data() {
    return {};
  },

  computed: {
    ...mapGetters('payer', {
      getUnconfirmedTransactions: 'getUnconfirmedTransactions',
      selectedPayerAddress: 'selectedPayerAddress',
    }),

    currentUnconfirmedTransaction(): PayerTransaction {
      return this.getUnconfirmedTransactions[0];
    },
  },

  methods: {
    ...mapMutations('payer', [
      'setStepPayment',
    ]),

    image,
  },

  watch: {
    getUnconfirmedTransactions(value) {
      if (!value?.length) {
        this.setStepPayment(4);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.border-wrap {
  @apply relative rounded-12px;
  background: linear-gradient(95.26deg, #8CE028 -18.58%, #3DD9BC 40.59%);
  padding: 3px;

  .image {
    @apply absolute hidden lg:block w-225px h-auto bottom-0 right-0 z-10 w-225px h-sm:w-150px;
  }
}

.success {
  @apply flex items-center justify-center rounded-12px border-1 border-success-600 py-12px px-20px lg:py-16px h-md:py-8px h-md:px-16px;
  background: #F1F9F1;

  p {
    @apply text-12px leading-16px lg:text-16px lg:leading-24px h-md:leading-20px h-md:text-14px font-400 lg:font-500 text-center text-success-600;
    a {
      @apply font-500 lg:font-600 text-success-600 border-b-1 border-success-600 hover:text-success-600;
      text-decoration: none;
    }

    span {
      @apply font-500 lg:font-600
    }
  }

}

.loader {
  @screen h-md {
    @apply h-md:h-200px h-md:w-200px
  }

  @screen h-sm {
    @apply h-md:h-160px h-md:w-160px
  }
}

.tag {
  @apply text-8px leading-16px px-6px py-0 rounded-16px;
  @apply lg:text-10px lg:px-9px lg:pt-3px lg:pb-4px;
  color: #5BB65B;
  background-color: #EDF7ED;
  border: 1px solid #5BB65B;
  white-space: nowrap;
}
</style>
