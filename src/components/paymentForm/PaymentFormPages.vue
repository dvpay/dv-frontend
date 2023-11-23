<template>
  <div
    class="pages relative"
    :class="[currentPage === 1 ? 'min-h-560px' : 'h-560px overflow-auto']"
  >
    <payment-page v-if="currentPage === 1" />
    <how-it-works-page class="relative z-9" v-if="currentPage === 2" />
    <faq-page class="relative z-9" v-if="currentPage === 3" />
    <div
      v-if="invoiceMsgStatus.formHide"
      class="status-case-wrapper z-8"
    >
      <payment-status-case />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import PaymentPage from '@/components/paymentForm/pages/PaymentPage.vue';
import HowItWorksPage from '@/components/paymentForm/pages/HowItWorksPage.vue';
import FaqPage from '@/components/paymentForm/pages/FaqPage.vue';
import PaymentStatusCase from '@/components/paymentForm/PaymentStatusCase.vue';

export default defineComponent({
  components: {
    PaymentPage,
    HowItWorksPage,
    FaqPage,
    PaymentStatusCase,
  },

  computed: {
    ...mapState('invoice', {
      currentPage: 'currentPage',
      invoiceMsgStatus: 'invoiceMsgStatus',
    }),
  },
});
</script>

<style lang="scss" scoped>
.pages {
  @apply p-20px bg-s-gray;
  @apply border-2 border-x-gray rounded-20px;
}

.status-case-wrapper {
  @apply absolute w-full h-full bottom-0 left-0 bg-s-gray rounded-20px;
}
</style>
