<template>
  <div class="flex flex-col h-full">
    <div class="text-center">
      <div class="font-600 text-22px">
        {{ $t('Pay') }}
        {{ invoiceAddresses[selectedIndex].amount }}
        {{ currencySymbol }}
        {{ $t('with QR code') }}
      </div>
      <div class="mt-16px mb-20px relative">
        <ui-qr-code-new
          :data="qrCodeData"
          :size="232"
          :img="qrCodeImg"
          level="M"
          color="#3f4048"
          :key="qrKeyRerender"
        />
        <div
          v-if="!invoiceAddresses[selectedIndex].address"
          class="qr-code-blur"
        ></div>
        <div
          v-if="!invoiceAddresses[selectedIndex].address"
          class="show-address-btn rounded-20px relative flex items-center z-100"
        >
          <img
            class="w-40px absolute left-0 z-101"
            :src="image(`${invoiceAddresses[selectedIndex].currency}.svg`)"
            alt="crypto-icon"
          />
          <ui-button-loading
            class="text-white font-600 bg-dark-gray h-40px pl-12 pr-3 !rounded-20px whitespace-nowrap"
            :loading="showAddressBtnLoading"
            @click="showAddressHandler(invoiceAddresses[selectedIndex].currency)"
          >
            {{ $t('Show Address') }}
          </ui-button-loading>
        </div>
      </div>
      <div class="font-600 text-22px">
        {{ $t('Or copy the values from these fields') }}
      </div>
    </div>
    <div class="flex flex-col gap-10px py-15px">
      <div class="value-wrapper">
        <div class="label">
          {{ $t('amount') }}
        </div>
        <div class="value">
          {{ invoiceAddresses[selectedIndex].amount }}
          {{ currencySymbol }}
        </div>
        <ui-copy-to-clipboard
          class="copy-icon"
          size="22"
          :text-to-copy="invoiceAddresses[selectedIndex].amount"
        />
      </div>
      <div class="value-wrapper">
        <div class="label">
          {{ $t('address') }}
        </div>
        <div class="value">
          <span v-if="invoiceAddresses[selectedIndex].address">
            {{
              `${
                invoiceAddresses[selectedIndex].address.slice(0, 7)}
                ...${invoiceAddresses[selectedIndex].address.slice(-7)
                }`
            }}
          </span>
          <span v-else v-for="i in 14" :key="i" class="text-8px">&#9679;</span>
        </div>
        <ui-copy-to-clipboard
          class="copy-icon"
          size="22"
          :text-to-copy="invoiceAddresses[selectedIndex].address
            ? invoiceAddresses[selectedIndex].address
            : ' '"
        />
      </div>
    </div>
    <form
      @submit.prevent="saveEmailHandler"
      class="email-input mt-auto relative"
    >
      <div class="flex">
        <feather-icon
          class="help-icon"
          type="help-circle"
          size="20"
        />
      </div>
      <input
        required
        type="email"
        v-model="emailInput"
        :placeholder="$t('Your e-mail')"
        class="outline-none w-full"
      />
      <button
        class="save-btn"
        type="submit"
      >
        {{ $t('Save') }}
      </button>
      <ui-loading
        class="!rounded-48px"
        size="24"
        :loading="emailLoading"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiQrCodeNew from '@/components/ui/UiQrCodeNew.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiLoading from '@/components/ui/UiLoading.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import { image } from '@/utils';

export default defineComponent({
  components: {
    UiQrCodeNew,
    UiCopyToClipboard,
    UiLoading,
    UiButtonLoading,
  },

  data() {
    return {
      emailInput: '',
      emailLoading: false,
      showAddressBtnLoading: false,
      qrKey: 1,
    };
  },

  computed: {
    ...mapState('invoice', {
      invoice: 'invoice',
      invoiceAddresses: 'invoiceAddresses',
      selectedCurrency: 'selectedCryptocurrencyAndNetwork',
    }),
    ...mapGetters('invoice', {
      selectedFindIndex: 'selectedCryptocurrencyIndex',
    }),

    qrKeyRerender(): string {
      return `${this.qrKey}${this.invoiceAddresses[this.selectedIndex].address}`;
    },

    invoiceId() {
      return this.$route.params.invoice_id;
    },

    selectedIndex(): number {
      return this.selectedFindIndex(this.selectedCurrency);
    },

    currencySymbol(): string {
      return this.invoiceAddresses[this.selectedIndex].currency.split('.')[0];
    },

    qrCodeData(): string {
      return this.invoiceAddresses[this.selectedIndex].address
        ? this.invoiceAddresses[this.selectedIndex].address
        : 'empty_address';
    },

    qrCodeImg(): string {
      return this.invoiceAddresses[this.selectedIndex].address
        ? `${this.invoiceAddresses[this.selectedIndex].currency}.svg`
        : 'help-circle.svg';
    },

    showConfirmBtn(): boolean {
      return this.invoice.status === 'partially_paid'
        || this.invoice.status === 'waiting_confirmations';
    },
  },

  watch: {
    invoice() {
      this.syncDataFromVuex();
    },
  },

  created() {
    this.syncDataFromVuex();
  },

  methods: {
    ...mapActions('invoice', [
      'sendInvoiceToEmail',
      'loadInvoiceAddress',
      'loadInvoiceData',
      'confirmInvoice',
    ]),
    image,

    async showAddressHandler(currency: string) {
      try {
        this.showAddressBtnLoading = true;
        await this.loadInvoiceAddress({
          invoiceId: this.invoiceId,
          currencyId: currency,
        });
        await this.loadInvoiceData(this.invoiceId);
        this.showAddressBtnLoading = false;
        this.qrKey += 1;
      } catch (e) {
        this.showAddressBtnLoading = false;
      }
    },

    async saveEmailHandler() {
      try {
        this.emailLoading = true;
        await this.sendInvoiceToEmail({
          invoiceId: this.invoiceId,
          payload: { email: this.emailInput },
        });
        this.emailLoading = false;
        this.$toast.success(this.$t('Email has been saved'));
      } catch (e) {
        this.emailLoading = false;
      }
    },

    setEmail() {
      if (!this.emailInput) {
        this.emailInput = this.invoice.payerEmail;
      }
    },

    syncDataFromVuex() {
      this.setEmail();
    },
  },
});
</script>

<style lang="scss" scoped>
.value-wrapper {
  @apply grid grid-cols-[80px,1fr,24px] gap-2 items-center;
  @apply border-1 border-x-gray rounded-20px h-45px px-10px;
  background-color: #f6f5f6;

  .label {
    text-align: center;
    border: 2px solid #C8CBDE;
    color: #B6B9CE;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    padding: 1px 10px;
  }

  .value {
    color: #A1A3B4;
    font-weight: 600;
  }

  .copy-icon {
    color: #A5A8BC;
  }
}

.email-input {
  @apply flex items-center gap-2 bg-white;
  @apply border-1 border-x-gray rounded-20px h-45px pl-10px pr-4px;

  input {
    &::placeholder {
      color: #A1A3B4;
      font-weight: 600;
    }
  }
}

.help-icon {
  color: #C8CBDE;
}

.save-btn {
  @apply text-dark-gray border-2 border-dark-gray rounded-48px py-7px px-24px;
  @apply leading-16px font-600;
}

.qr-code-blur {
  background: rgba(249, 249, 249, 0.01);
  backdrop-filter: blur(6px) !important;
  -webkit-backdrop-filter: blur(6px) !important;
  filter: blur(6px) !important;
  border-radius: 20px;
  position: absolute;
  top: calc(50% - 3px);
  left: 50%;
  transform: translate(-50%, -50%);
  height: 280px;
  width: 280px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

.show-address-btn {
  position: absolute;
  top: calc(50% - 3px);
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
