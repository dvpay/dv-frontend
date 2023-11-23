<template>
  <div>
    <div
      class="grid gap-2 items-center buttons-wrapper-3"
    >
      <button
        class="order-details font-600 h-40px"
      >
        {{ $t('Order details') }}
      </button>
      <button
        class="payment-details-btn relative"
        @click.stop="paymentDetailsHandler"
      >
        <span class="font-600">
          {{ $t('Payment details') }}
        </span>
        <span
          v-if="transactions.length"
          class="payment-details-counter"
        >
          +{{ transactions.length }}
        </span>
      </button>
      <div
        aria-hidden="true"
        class="cursor-pointer relative z-99 language-btn"
        @click="showDropdownMenu"
        v-click-out="closeLocaleSelectDropdown"
      >
        <div class="language">
          <span class="font-600">
            {{ selectedLocaleOption.title }}
          </span>
          <feather-icon
            type="chevron-down"
            size="18"
          />
        </div>
        <payment-form-locale
          v-if="isShowLocaleSelectDropdown"
          :selected-locale="selectedLocaleOption"
          :locale-options="localeOptions"
          @change-locale="changeLocaleHandler"
          @close-locale-select-dropdown="closeLocaleSelectDropdown"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import PaymentFormLocale from '@/components/paymentForm/PaymentFormLocale.vue';

export default defineComponent({
  components: {
    PaymentFormLocale,
  },

  data() {
    return {
      isShowLocaleSelectDropdown: false,
    };
  },

  computed: {
    ...mapState('app', {
      localeOptions: 'localeOptions',
    }),
    ...mapGetters('app', {
      selectedLocaleOption: 'selectedLocaleOption',
    }),
    ...mapGetters('invoice', {
      transactions: 'allTransactions',
    }),
  },

  methods: {
    ...mapMutations('app', ['setLocale']),
    ...mapMutations('invoice', [
      'setIsShowPaymentDetails',
    ]),

    paymentDetailsHandler() {
      this.setIsShowPaymentDetails(true);
    },

    showDropdownMenu() {
      this.isShowLocaleSelectDropdown = !this.isShowLocaleSelectDropdown;
    },

    closeLocaleSelectDropdown() {
      this.isShowLocaleSelectDropdown = false;
    },

    changeLocaleHandler(value: string) {
      this.setLocale(value);
      this.$i18n.locale = value;
    },
  },
});
</script>

<style lang="scss" scoped>
.buttons-wrapper-3 {
  grid-template-areas: "order next language";
  grid-template-columns: 125px 1fr 125px;

  @include phone-lg {
    grid-template-areas: "next" "order" "language";
    grid-template-columns: 1fr;
  }
}

.order-details {
  grid-area: order;
}

.language-btn {
  grid-area: language;
}

.order-details,
.payment-details-btn {
  @apply border-2 border-dark-gray rounded-48px py-9px justify-center;
  @apply leading-16px text-sm flex items-center gap-2 cursor-pointer;

  &:disabled {
    @apply text-gray-500 border-gray-500;
  }
}

.payment-details-btn {
  @apply py-10px #{!important};
}

.payment-details-counter {
  @apply absolute -top-10px bg-dark-gray text-white;
  @apply rounded-48px py-4px px-8px text-12px right-10px;
}

.language {
  @apply border-2 border-dark-gray rounded-48px py-9px;
  @apply leading-16px text-sm flex items-center justify-center gap-1;
}
</style>
