<template>
  <div>
    <div
      class="grid gap-2 items-center"
      :class="{
        'buttons-wrapper-2-next': step === 1,
        'buttons-wrapper-2-back': step === 3,
        'buttons-wrapper-3': step === 2,
      }"
    >
      <button
        v-if="step !== 1"
        class="back-step"
        @click="backHandler"
      >
        <feather-icon
          type="arrow-left"
          size="18"
        />
        <span class="font-600">
          {{ $t('Back') }}
        </span>
      </button>
      <button
        v-if="step !== 3"
        class="next-step"
        :disabled="disabledNext"
        @click="nextStepHandler"
      >
        <span class="font-600">
          {{ $t('Next step') }}
        </span>
        <feather-icon
          type="arrow-right"
          size="18"
        />
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
    ...mapState('payer', {
      step: 'stepPayment',
      selectedCryptocurrency: 'selectedCryptocurrency',
      selectedNetwork: 'selectedNetwork',
    }),

    disabledNext(): boolean {
      if (this.step === 1) {
        return !this.selectedCryptocurrency.symbol;
      }
      if (this.step === 2) {
        return !this.selectedNetwork.blockchain;
      }
      return true;
    },
  },

  methods: {
    ...mapMutations('app', ['setLocale']),
    ...mapMutations('payer', [
      'setStepPayment',
      'setSelectedCryptocurrencyAndNetwork',
    ]),

    nextStepHandler() {
      if (this.selectedCryptocurrency.symbol === 'USDT') {
        this.setStepPayment(this.step + 1);
      } else {
        this.setStepPayment(3);
      }
      this.setSelectedCryptocurrencyAndNetwork(
        `${this.selectedCryptocurrency.symbol}.${this.selectedNetwork.blockchain}`,
      );
    },

    backHandler() {
      if (this.selectedCryptocurrency.symbol === 'USDT') {
        this.setStepPayment(this.step - 1);
      } else {
        this.setStepPayment(1);
      }
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
.buttons-wrapper-2-next {
  grid-template-areas: "next language";
  grid-template-columns: 1fr 125px;

  @include phone-lg {
    grid-template-areas: "next" "language";
    grid-template-columns: 1fr;
  }
}

.buttons-wrapper-2-back {
  grid-template-areas: "back language";
  grid-template-columns: 1fr 125px;

  @include phone-lg {
    grid-template-areas: "back" "language";
    grid-template-columns: 1fr;
  }
}

.buttons-wrapper-3 {
  grid-template-areas: "back next language";
  grid-template-columns: 125px 1fr 125px;

  @include phone-lg {
    grid-template-areas: "next" "back" "language";
    grid-template-columns: 1fr;
  }
}

.back-step {
  grid-area: back;
}

.next-step {
  grid-area: next;
}

.language-btn {
  grid-area: language;
}

.back-step,
.next-step,
.back-to-payment {
  @apply border-2 border-dark-gray rounded-48px py-9px justify-center;
  @apply leading-16px text-sm flex items-center gap-2 cursor-pointer;

  &:disabled {
    @apply text-gray-500 border-gray-500;
  }
}

.language {
  @apply border-2 border-dark-gray rounded-48px py-9px;
  @apply leading-16px text-sm flex items-center justify-center gap-1;
}
</style>
