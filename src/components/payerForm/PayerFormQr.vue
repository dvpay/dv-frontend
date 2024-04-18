<template>
  <div class="relative">
    <ui-qr-code-new
      :data="qrCodeData"
      :size="232"
      :img="qrCodeImg"
      level="M"
      color="#000"
      :key="qrKeyRerender"
    />
    <div
      v-if="!selectedPayerAddress?.address"
      class="qr-code-blur"
    ></div>
    <div
      v-if="!selectedPayerAddress?.address"
      class="show-address-btn rounded-20px relative flex items-center z-100"
    >
      <img
        class="w-40px absolute left-0 z-101"
        :src="image(`${selectedCurrency}.svg`)"
        alt="crypto-icon"
      />
      <ui-button-loading
        class="text-white font-600 bg-dark-gray h-40px pl-12 pr-3 !rounded-20px whitespace-nowrap"
        :loading="showAddressBtnLoading"
        @click="showAddressHandler(selectedCurrency)"
      >
        {{ $t('Show Address') }}
      </ui-button-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiQrCodeNew from '@/components/ui/UiQrCodeNew.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import { image } from '@/utils';

export default defineComponent({
  components: {
    UiQrCodeNew,
    UiButtonLoading,
  },

  data() {
    return {
      showModal: false,
      modalLoading: false,
      showAddressBtnLoading: false,
      qrKey: 1,
    };
  },

  computed: {
    ...mapState('payer', {
      selectedCurrency: 'selectedCryptocurrencyAndNetwork',
    }),
    ...mapGetters('payer', {
      selectedPayerAddress: 'selectedPayerAddress',
    }),

    qrKeyRerender(): string {
      return `${this.qrKey}${this.selectedPayerAddress?.address}`;
    },

    payerId() {
      return this.$route.params.payer_id;
    },

    qrCodeData(): string {
      return this.selectedPayerAddress?.address
        ? this.selectedPayerAddress?.address
        : 'empty_address';
    },

    qrCodeImg(): string {
      return 'icons/minimize.svg';
    },
  },

  methods: {
    ...mapActions('payer', [
      'loadPayer',
      'loadPayerAddress',
    ]),

    image,

    async showAddressHandler(currency: string) {
      try {
        this.showAddressBtnLoading = true;
        await this.loadPayerAddress({
          payerId: this.payerId,
          currencyId: currency,
        });
        await this.loadPayer(this.payerId);
        this.showAddressBtnLoading = false;
        this.qrKey += 1;
      } catch (e) {
        this.showAddressBtnLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.qr-code-blur {
  background: rgba(249, 249, 249, 0.01);
  backdrop-filter: blur(6px);
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

.wrapper {
  border: none;
  border-radius: 0;
}

.show-address-btn {
  position: absolute;
  top: calc(50% - 3px);
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
