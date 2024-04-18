<template>
  <div class="card common-wrapper">
    <div class="text-2xl mb-6">
      {{ $t('General') }}
    </div>
    <form
      class="form"
      @submit.prevent="updateGeneralSettings"
    >
      <div class="form-inputs">
        <ui-input
          disabled
          v-model="storeId"
          type="text"
          id="storeId"
          :label="$t('Store ID')"
        />
        <ui-input
          required
          v-model="storeName"
          type="text"
          id="storeName"
          :label="$t('Store Name')"
        />
        <ui-input
          v-model="storeWebsite"
          type="text"
          id="storeWebsite"
          :label="$t('Store Website')"
        />
      </div>
      <div  v-if="false">
        <div class="text-2xl mb-6">
          {{ $t('Payment') }}
        </div>
        <div class="payment">
          <div class="form-group !hidden">
            <label
              for="currencySelect"
              class="self-start"
            >
              {{ $t('Default currency') }}
            </label>
            <ui-select
              v-if="fiatCurrencies.length"
              id="currencySelect"
              class="max-w-90px h-40px"
              v-model="storeCurrencySelect"
              :options="fiatCurrencies"
            />
          </div>
          <div class="form-group">
            <label
              for="invoiceExpires"
              class="self-start flex items-center gap-2"
            >
              <span>
                {{ $t('Invoice expires if the full amount has not been paid after') }}
              </span>
              <ui-tooltip
                class="!flex"
                text-width="300px"
                :text="$t('payment_tooltip_text')"
              >
                <feather-icon type="help-circle" size="18" class="opacity-55 hover:opacity-100" />
              </ui-tooltip>
            </label>
            <div class="flex max-w-180px items-center">
              <ui-input
                v-model="invoiceExpires"
                type="number"
                id="invoiceExpires"
                class="w-1/2 z-1"
              />
              <div class="text-center p-2 border bg-gray-200 rounded-r-sm">
                {{ $t('minutes') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div  v-if="false">
        <div class="text-2xl mb-6">
          {{ $t('Address Hold Time') }}
        </div>
        <div class="form-group">
          <label
            for="addressHoldTime"
            class="self-start flex items-center gap-2"
          >
            {{ $t('Invoice address hold time') }}
          </label>
          <div class="flex max-w-180px items-center">
            <ui-input
              v-model="addressHoldTimeValue"
              type="number"
              id="addressHoldTime"
              class="w-1/2 z-1"
            />
            <div class="text-center p-2 border bg-gray-200 rounded-r-sm">
              {{ $t('minutes') }}
            </div>
          </div>
        </div>
      </div>

      <div  v-if="false">
        <div class="text-2xl mb-6">
          {{ $t('Invoice Actual Rate') }}
        </div>
        <div class="flex items-center gap-3">
          <ui-checkbox
            v-model="acceptPaymentAtActualRateValue"
          />
          <span>
            {{ $t('Accept invoice payment at actual currency rate') }}
          </span>
        </div>
      </div>
      <div>
        <div class="text-2xl mb-6">
          {{ $t('Minimal payment') }}
        </div>
        <div class="form-group">
          <label
            for="addressHoldTime"
            class="self-start flex items-center gap-2"
          >
            {{ $t('Minimal payment for send and show on store') }}
          </label>
          <div class="flex max-w-180px items-center">
            <ui-input
              v-model="storeMinimalPayment"
              type="float"
              id="addressHoldTime"
              class="w-1/2 z-1"
            />
            <div class="text-center p-2 border bg-gray-200 rounded-r-sm">
              USD
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="text-2xl mb-6">
          {{ $t('Store Status') }}
        </div>
        <div class="mb-4">
          {{ $t('store_disabled_text_help') }}
        </div>
        <div class="flex items-center gap-2">
          <ui-switcher
            :checked="enabledStore"
            @switched="switchEnabledStoreHandler"
          />
          <div>
            {{ enabledStore ? $t('Store Enabled') : $t('Store Disabled') }}
          </div>
        </div>
      </div>

      <div>
        <div class="text-2xl mb-6">
          {{ $t('Static Addresses') }}
        </div>
        <div class="mb-4">
          {{ $t('static_addresses_disabled_text_help') }}
        </div>
        <div class="flex items-center gap-2">
          <ui-switcher
            :checked="enabledStaticAddresses"
            @switched="switchEnabledStaticAddresses"
          />
          <div>
            {{ enabledStaticAddresses ? $t('Static Addresses Enabled') : $t('Static Addresses Disabled') }}
          </div>
        </div>
      </div>

      <ui-button-loading
        class="button button-primary py-2 px-4 self-start"
        type="submit"
        :loading="buttonLoading"
      >
        {{ $t('Save') }}
      </ui-button-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiTooltip from '@/components/ui/UiTooltip.vue';
import UiCheckbox from '@/components/ui/UiCheckbox.vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiSwitcher from '@/components/ui/UiSwitcher.vue';

export default defineComponent({
  components: {
    UiSelect,
    UiButtonLoading,
    UiTooltip,
    UiCheckbox,
    UiInput,
    UiSwitcher,
  },

  data() {
    return {
      storeId: '',
      storeName: '',
      storeWebsite: '',
      storeCurrencySelect: '',
      invoiceExpires: null,
      buttonLoading: false,
      addressHoldTimeValue: '',
      storeMinimalPayment: 1,
      acceptPaymentAtActualRateValue: false,
      enabledStore: false,
      enabledStaticAddresses: false,
    };
  },

  computed: {
    storeIdFromUrl() {
      return this.$route.params.store_id;
    },

    ...mapState('stores', {
      id: 'id',
      name: 'name',
      site: 'site',
      currency: 'currency',
      invoiceExpirationTime: 'invoiceExpirationTime',
      addressHoldTime: 'addressHoldTime',
      acceptPaymentAtActualRate: 'acceptPaymentAtActualRate',
      storeStatus: 'storeStatus',
      staticAddresses: 'staticAddresses',
      minimalPayment: 'minimalPayment',
    }),
    ...mapGetters('dictionaries', {
      fiatCurrencies: 'fiatCurrencies',
    }),
  },

  watch: {
    id() {
      this.syncDataFromVuex();
    },
  },

  created() {
    this.loadStore();
    this.syncDataFromVuex();
  },

  methods: {
    async updateGeneralSettings() {
      try {
        this.buttonLoading = true;
        await this.updateStore({
          storeId: this.storeIdFromUrl,
          payload: {
            name: this.storeName,
            site: this.storeWebsite,
            currency: this.storeCurrencySelect,
            invoiceExpirationTime: this.invoiceExpires,
            addressHoldTime: this.addressHoldTimeValue,
            acceptPaymentAtActualRate: this.acceptPaymentAtActualRateValue,
            status: this.enabledStore ? 1 : 0,
            staticAddresses: this.enabledStaticAddresses ? 1 : 0,
            minimalPayment: this.storeMinimalPayment,
          },
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Store successfully updated'));
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    async loadStore() {
      this.setIsStoreLoading(true);
      await this.loadStoreById(this.storeIdFromUrl);
    },

    switchEnabledStoreHandler() {
      this.enabledStore = !this.enabledStore;
    },

    switchEnabledStaticAddresses() {
      this.enabledStaticAddresses = !this.enabledStaticAddresses;
    },

    syncDataFromVuex() {
      this.storeId = this.id;
      this.storeName = this.name;
      this.storeWebsite = this.site;
      this.storeCurrencySelect = this.currency;
      this.invoiceExpires = this.invoiceExpirationTime;
      this.addressHoldTimeValue = this.addressHoldTime;
      this.acceptPaymentAtActualRateValue = this.acceptPaymentAtActualRate;
      this.enabledStore = !!this.storeStatus;
      this.enabledStaticAddresses = !!this.staticAddresses;
      this.storeMinimalPayment = this.minimalPayment;
    },

    ...mapMutations('stores', ['setIsStoreLoading']),
    ...mapActions('stores', ['updateStore', 'loadStoreById']),
  },
});
</script>

<style lang="scss" scoped>
.form {
  @apply flex flex-col gap-10;
}
.payment,
.form-inputs {
  @apply flex flex-col gap-6;
}
.form-group {
  @apply flex flex-col gap-2;
}
</style>
