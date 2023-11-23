<template>
  <div class="text-base">
    <div class="text-center mb-12">
      <div class="text-3xl">
        {{ $t('Pay with') }}
      </div>
      <div class="relative max-w-480px mx-auto mt-1 z-999">
        <locale-select-center />
      </div>
    </div>
    <div
      v-if="invoice.description"
      class="text-center text-sm mb-4"
    >
      {{ invoice.description }}
    </div>
    <div
      class="invoice"
    >
      <ui-skeleton-box
        v-if="loading"
        height="59px"
        width="100%"
        class="shadow-md"
      />
      <div
        v-else
        class="tabs"
      >
        <div
          v-for="(address, i) in invoiceAddresses"
          :key="i"
          aria-hidden="true"
          class="tab-item"
          :class="{'tab-item-active': tabActive === i}"
          @click="tabHandler(i)"
        >
          <div class="flex flex-col">
            <span>
              {{ address.currency.split('.')[0] }}
            </span>
            <span class="text-gray-600 text-xs">
              ({{ address.currency.split('.')[1] }})
            </span>
          </div>
        </div>
      </div>
      <div
        class="invoice-content"
        :class="[invoiceTimerData.total ? 'pb-12' : 'pb-6']"
      >
        <div class="relative mb-8">
          <ui-skeleton-box
            v-if="loading"
            width="256px"
            height="256px"
          />
          <ui-qrcode
            v-else
            :value="invoiceAddresses[tabActive].address"
            :size="256"
            level="Q"
            :img="
              invoiceAddresses[tabActive].address
                ? `${invoiceAddresses[tabActive].currency}.svg`
                : ''
            "
          />
          <div
            v-if="!loading && !invoiceAddresses[tabActive].address"
            class="qr-code-blur"
          >
            <div class="bg-primary-600 rounded-20px relative flex items-center z-100">
              <img
                v-if="invoiceAddresses[tabActive].blockchain"
                class="w-40px absolute left-0 z-101"
                :src="image(`${invoiceAddresses[tabActive].currency}.svg`)"
                alt="crypto-icon"
              />
              <ui-button-loading
                class="button button-primary h-40px pl-12 pr-3 !rounded-20px"
                :loading="showAddressBtnLoading"
                @click="loadInvoiceAddressHandler(invoiceAddresses[tabActive].currency)"
              >
                {{ $t('Show Address') }}
              </ui-button-loading>
            </div>
          </div>
        </div>
        <div class="px-2 pb-4">
          <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-2">
              <ui-skeleton-box
                v-if="loading"
                height="20px"
                width="100%"
              />
              <div
                v-else
                class="text-gray-600 uppercase text-sm font-600"
              >
                {{ $t('Address') }}
                ({{ invoiceAddresses[tabActive].blockchain }})
              </div>
              <ui-skeleton-box
                v-if="loading"
                height="24px"
                width="100%"
              />
              <div
                v-else
              >
                <div
                  v-if="invoiceAddresses[tabActive].address"
                  class="font-600 flex items-center justify-center gap-2"
                >
                  <span class="break-all">
                    {{ invoiceAddresses[tabActive].address }}
                  </span>
                  <ui-copy-to-clipboard
                    :text-to-copy="invoiceAddresses[tabActive].address"
                  />
                </div>
                <div v-else>
                  <span v-for="i in 30" :key="i" class="text-xs">&#9679;</span>
                </div>
              </div>
            </div>

            <div class="relative">
              <ui-skeleton-box
                v-if="loading"
                width="100%"
                :height="enabledEmailInput ? '74px' : '20px'"
              />
              <div v-else class="relative">
                <div class="flex gap-2 justify-center items-center text-sm">
                  <ui-switcher-thin
                    :checked="enabledEmailInput"
                    @switched="switchEnabledEmailInputHandler"
                  />
                  <div>
                    {{ $t('Send an email notification') }}
                  </div>
                </div>
                <ui-expand
                  :is-expanded="enabledEmailInput"
                >
                  <form @submit.prevent="submitEmailHandler">
                    <div
                      class="input-email-wrapper mt-4 relative"
                      :class="{ 'input-email-invalid': !validEmail }"
                    >
                      <label for="inputEmail" class="input-email-label">
                        {{ $t('E-mail') }}
                      </label>
                      <input
                        type="text"
                        id="inputEmail"
                        placeholder="example@mail.com"
                        class="input-email"
                        v-model="emailInput"
                        @blur="inputEmailBlurHandler"
                      >
                    </div>
                    <div
                      v-if="!validEmail"
                      class="input-email-validate-msg"
                    >
                      {{ $t('Invalid Email') }}
                    </div>
                  </form>
                </ui-expand>
                <ui-loading :loading="emailInputLoading" />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <ui-skeleton-box
                v-if="loading"
                height="20px"
                width="100%"
              />
              <div
                v-else
                class="text-gray-600 uppercase text-sm font-600"
              >
                <div v-if="!!invoice.amount">
                  {{ $t('Amount') }}
                </div>
              </div>
              <ui-skeleton-box
                v-if="loading"
                height="84px"
                width="100%"
              />
              <div
                v-else
                class="flex flex-col gap-1"
              >
                <div
                  v-if="!!invoice.amount"
                  class="font-600 text-2xl"
                >
                  {{ invoiceAddresses[tabActive].amount }}
                  {{ invoiceAddresses[tabActive].currency.split('.')[0] }}
                </div>
                <div
                  v-if="!!invoice.amount"
                  class="font-600"
                >
                  ${{ invoice.amount }} (USD)
                </div>
                <div class="text-gray-600 uppercase text-sm font-600">
                  1
                  {{ invoiceAddresses[tabActive].currency.split('.')[0] }} =
                  {{ invoiceAddresses[tabActive].rate }}
                  (USD)
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="invoiceAddresses.length && showLeftAmount"
          class="flex flex-col text-sm font-600"
        >
          <span>
            {{ $t('Left Amount') }}:
          </span>
          <span>
            {{ invoiceAddresses[tabActive].leftAmount }}
            {{ invoiceAddresses[tabActive].currency.split('.')[0] }}
            /
            {{ invoiceAddresses[tabActive].leftAmountUsd }} USD
          </span>
        </div>

        <div
          v-if="showConfirmBtn"
          class="mb-6 mt-2"
        >
          <ui-button-loading
            class="button button-success px-4 py-1"
            :loading="confirmBtnLoading"
            @click="confirmInvoiceHandler"
          >
            {{ $t('Confirm payment') }}
          </ui-button-loading>
        </div>

        <div
          class="awaiting-payment"
          :class="{'!bg-gray-400': invoiceMsgStatus.type === 'confirm'}"
        >
          <div class="flex items-center gap-2">
            <feather-icon type="loader" size="18" class="animate-spin" />
            <span v-if="invoiceMsgStatus.type === 'confirm'">
              {{ invoiceMsgStatus.text }}
            </span>
            <span v-else>
              {{ $t('Awaiting Payment') }}...
            </span>
          </div>
          <div
            v-if="invoiceTimerData.total && invoiceMsgStatus.type !== 'confirm'"
            class="flex"
          >
            <span v-if="invoiceTimerData.days !== '0'">
              {{ invoiceTimerData.days }}:
            </span>
            <span>
              {{ invoiceTimerData.hours }}:
            </span>
            <span>
              {{ invoiceTimerData.minutes }}:
            </span>
            <span>
              {{ invoiceTimerData.seconds }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="invoiceMsgStatus.formHide"
        class="invoice-msg"
      >
        <div>
          {{ $t(invoiceMsgStatus.text) }}
        </div>
        <a
          v-if="invoice.returnUrl"
          class="button button-primary py-2 px-4"
          :href="invoice.returnUrl"
        >
          {{ $t('Back to store') }}
        </a>
      </div>
    </div>
    <div
      v-if="showTransactions && transactions.length"
      class="flex flex-col gap-2 items-center bg-gray-200 px-2 py-4 text-sm"
    >
      <div
        v-for="(item, i) in transactions" :key="i"
        class="flex gap-2"
      >
        <span class="font-600">{{ $t('Tx Hash') }}:</span>
        <a :href="item.linkToExplorer" class="link" target="_blank" ref="noopener noreferrer">
          {{ `${item.txId.slice(0, 7)}...${item.txId.slice(-7)}` }}
        </a>
        <ui-copy-to-clipboard
          :text-to-copy="item.txId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import UiQrcode from '@/components/ui/UiQrcode.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import { InvoiceAddresses } from '@/services/InvoicesService/types';
import LocaleSelectCenter from '@/components/locale/LocaleSelectCenter.vue';
import UiSwitcherThin from '@/components/ui/UiSwitcherThin.vue';
import UiExpand from '@/components/ui/UiExpand.vue';
import UiLoading from '@/components/ui/UiLoading.vue';
import { image } from '@/utils';

export default defineComponent({
  components: {
    UiQrcode,
    UiCopyToClipboard,
    UiSkeletonBox,
    UiButtonLoading,
    LocaleSelectCenter,
    UiSwitcherThin,
    UiExpand,
    UiLoading,
  },

  data() {
    return {
      tabActive: 0,
      invoiceExpiredTimer: 0 as unknown as ReturnType<typeof setInterval>,
      invoiceUpdateTimer: 0 as unknown as ReturnType<typeof setTimeout>,
      showAddressBtnLoading: false,
      isInvoiceWatch: false,
      enabledEmailInput: false,
      enabledEmailInputCounter: 0,
      emailInput: '',
      emailRegex: /.+@.+\..+/i,
      emailInputLoading: false,
      confirmBtnLoading: false,
    };
  },

  computed: {
    numberOfTabs(): number {
      return Object.keys(this.invoiceAddresses).length ?? 1;
    },

    invoiceId() {
      return this.$route.params.invoice_id;
    },

    showLeftAmount(): boolean {
      return (
        this.invoiceAddresses[this.tabActive].leftAmount < this.invoiceAddresses[this.tabActive].amount
      ) && (this.invoiceAddresses[this.tabActive].leftAmount > 0);
    },

    showTransactions(): boolean {
      return (!!this.invoiceAddresses.length && (this.invoice.status === 'waiting_confirmations'));
    },

    transactions(): string[] {
      return this.invoiceAddresses[this.tabActive].transactions;
    },

    validEmail(): boolean {
      if (!this.emailInput) {
        return true;
      }
      return this.emailRegex.test(this.emailInput);
    },

    showConfirmBtn(): boolean {
      return this.invoice.status === 'partially_paid'
        || this.invoice.status === 'waiting_confirmations';
    },

    ...mapState('invoices', {
      invoice: 'invoice',
      invoiceMsgStatus: 'invoiceMsgStatus',
      invoiceAddresses: 'invoiceAddresses',
      invoiceTimerData: 'invoiceTimerData',
      loading: 'loading',
    }),
  },

  watch: {
    invoice() {
      this.pollingInvoiceData();
      this.initializeTimer();
      this.setActiveTab();
      this.isInvoiceWatch = true;
      this.setEnabledEmailInput();
    },
  },

  beforeMount() {
    this.loadInvoiceData(this.invoiceId);
    this.setLoading(true);
  },

  beforeUnmount() {
    clearInterval(this.invoiceExpiredTimer);
    clearTimeout(this.invoiceUpdateTimer);
    this.clearInvoiceData();
  },

  methods: {
    image,

    tabHandler(index: number) {
      this.tabActive = index;
    },

    pollingInvoiceData() {
      this.invoiceUpdateTimer = setTimeout(() => {
        if (
          this.invoice.status === 'waiting'
          || this.invoice.status === 'partially_paid'
          || this.invoice.status === 'waiting_confirmations'
        ) {
          clearTimeout(this.invoiceUpdateTimer);
          clearInterval(this.invoiceExpiredTimer);
          this.loadInvoice(this.invoiceId);
        } else {
          clearTimeout(this.invoiceUpdateTimer);
          clearInterval(this.invoiceExpiredTimer);
        }
      }, import.meta.env.VITE_INVOICE_POLLING_TIMEOUT * 1000);
    },

    updateTimer() {
      this.invoiceTimer();
      if (this.invoiceTimerData.total <= 0) {
        clearInterval(this.invoiceExpiredTimer);
      }
    },

    initializeTimer() {
      this.updateTimer();
      this.invoiceExpiredTimer = setInterval(this.updateTimer, 1000);
    },

    async loadInvoiceAddressHandler(currencyId: string) {
      try {
        this.showAddressBtnLoading = true;
        await this.loadInvoiceAddress({
          invoiceId: this.invoiceId,
          currencyId,
        });
        await this.loadInvoiceData(this.invoiceId);
        this.showAddressBtnLoading = false;
      } catch (e) {
        this.showAddressBtnLoading = false;
      }
    },

    setActiveTab() {
      if (!this.isInvoiceWatch) {
        this.tabActive = this.invoiceAddresses
          .reduce((acc: number, curr: InvoiceAddresses, i: number) => {
            if (curr.currency === this.invoice.paymentMethod) {
              return i;
            }
            return acc;
          }, 0);
      }
    },

    switchEnabledEmailInputHandler() {
      this.enabledEmailInput = !this.enabledEmailInput;
      if (!this.enabledEmailInput) {
        this.sendInvoiceToEmailHandler(null);
      }
    },

    inputEmailBlurHandler() {
      if (this.emailInput && this.validEmail) {
        this.sendInvoiceToEmailHandler(this.emailInput);
      }
    },

    submitEmailHandler() {
      if (this.validEmail) {
        this.sendInvoiceToEmailHandler(this.emailInput);
      }
    },

    setEnabledEmailInput() {
      if (this.invoice.payerEmail && this.enabledEmailInputCounter === 0) {
        this.enabledEmailInput = true;
        this.emailInput = this.invoice.payerEmail;
      }
      this.enabledEmailInputCounter++;
    },

    async sendInvoiceToEmailHandler(email: string | null) {
      try {
        this.emailInputLoading = true;
        await this.sendInvoiceToEmail({
          invoiceId: this.invoiceId,
          payload: { email },
        });
        this.emailInputLoading = false;
      } catch (e) {
        this.emailInputLoading = false;
      }
    },

    async confirmInvoiceHandler() {
      try {
        this.confirmBtnLoading = true;
        await this.confirmInvoice(this.invoiceId);
        this.confirmBtnLoading = false;
      } catch (e) {
        this.confirmBtnLoading = false;
      }
    },

    ...mapMutations('invoices', ['clearInvoiceData', 'setLoading']),
    ...mapActions('invoices', [
      'loadInvoice',
      'loadInvoiceData',
      'invoiceTimer',
      'loadInvoiceAddress',
      'confirmInvoice',
      'sendInvoiceToEmail',
    ]),
  },
});
</script>

<style lang="scss" scoped>
.invoice {
  @apply bg-white shadow-md rounded-sm relative;
}

.tabs {
  @apply flex justify-between items-center shadow-md bg-body-bg;
}

.tab-item {
  @apply text-center py-6px self-center cursor-pointer font-600;
  width: calc(100% / v-bind(numberOfTabs));
  transition: all .2s ease;
}

.tab-item-active {
  @apply border-b-3 border-primary-500 bg-white;
}

.invoice-content {
  @apply flex flex-col text-center pt-10;
}

.awaiting-payment {
  @apply absolute bottom-0 w-full flex justify-between py-2px px-10px;
  @apply bg-primary-500 text-white text-sm;
}

.invoice-msg {
  @apply absolute flex flex-col gap-6 items-center justify-center;
  @apply top-1/2 left-1/2 h-full w-full z-99 bg-white;
  transform: translate(-50%, -50%);
}

.qr-code-blur {
  background: rgba(0, 0, 0, 0.01);
  backdrop-filter: blur(6px);

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 280px;
  width: 280px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-email-wrapper {
  @apply py-2 px-3 rounded border border-gray-200 flex;
  @apply w-7/10 <phone-lg:w-9/10 mx-auto;
}

.input-email-invalid {
  border-color: theme('colors.red.500') !important;

  label {
    color: theme('colors.red.500');
    border-color: theme('colors.red.500') !important;
  }
}

.input-email-validate-msg {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: theme('colors.red.500');
}

.input-email-wrapper:has(input:hover) {
  @apply border-gray-400;

  .input-email-label {
    @apply border-gray-400;
  }
}

.input-email-wrapper:has(input:focus) {
  @apply border-gray-400;
}

.input-email {
  @apply placeholder-gray-500 w-full text-sm pl-3;
  @apply focus:(border-gray-400 outline-none);
  @apply disabled:bg-gray-200;
}

.input-email-label {
  @apply font-300 text-sm pr-3 border-r-1 border-gray-200 whitespace-nowrap;
}
</style>
