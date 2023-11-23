<template>
  <div class="card common-wrapper">
    <div class="page-title mb-6">
      {{ $t('Create Invoice') }}
    </div>
    <form
      class="form"
      @submit.prevent="createInvoiceHandler"
    >
      <div class="form-group">
        <label
          data-required
          for="storeId"
          class="self-start"
        >
          {{ $t('Store') }}
        </label>
        <ui-select
          class="h-40px"
          v-if="getStoreOptionsLocal.length"
          id="storeId"
          v-model="storeIdSelect"
          :options="getStoreOptionsLocal"
        />
      </div>
      <ui-input
        required
        v-model="orderId"
        type="text"
        id="orderId"
        label-required-mark="on"
        :label="$t('Order Id')"
      />
      <div class="grid grid-cols-[3fr,1fr] gap-4 <phone-lg:grid-cols-[1fr]">
        <ui-input
          v-model="amount"
          type="number"
          step="0.01"
          id="amount"
          :label="$t('Amount')"
        />
        <div class="form-group">
          <label
            for="currencySelect"
            class="self-start"
          >
            {{ $t('Currency') }}
          </label>
          <ui-select
            v-if="fiatCurrencies.length"
            id="currencySelect"
            class="h-39px min-w-90px"
            v-model="currencySelect"
            :options="fiatCurrencies"
          />
        </div>
      </div>
      <ui-input
        v-model="itemDescription"
        type="text"
        id="itemDescription"
        :label="$t('Item Description')"
      />
      <ui-input
        :required="false"
        v-model="returnUrl"
        type="url"
        id="returnUrl"
        :label="$t('Return Url')"
      />
      <ui-input
        :required="false"
        v-model="successUrl"
        type="url"
        id="successUrl"
        :label="$t('Success Url')"
      />
      <ui-button-loading
        class="button button-primary py-2 px-4 self-start"
        type="submit"
        :loading="buttonLoading"
      >
        {{ $t('Create') }}
      </ui-button-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiSelect,
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      storeIdSelect: '',
      orderId: '',
      amount: '',
      currencySelect: '',
      itemDescription: '',
      returnUrl: '',
      successUrl: '',
      buttonLoading: false,
    };
  },

  computed: {
    ...mapGetters('dictionaries', {
      fiatCurrencies: 'fiatCurrencies',
    }),
    ...mapGetters('stores', {
      getStoreOptionsLocal: 'getStoreOptionsLocal',
    }),
  },

  watch: {
    fiatCurrencies() {
      this.syncDataFromVuex();
    },
  },

  mounted() {
    this.syncDataFromVuex();
  },

  methods: {
    async createInvoiceHandler() {
      try {
        this.buttonLoading = true;
        const data = await this.createInvoice({
          storeId: this.storeIdSelect,
          orderId: this.orderId,
          amount: this.amount || null,
          currencyCode: this.currencySelect,
          description: this.itemDescription,
          returnUrl: this.returnUrl,
          successUrl: this.successUrl,
        });
        this.buttonLoading = false;
        this.$toast.success(this.$t('Invoice successfully created'));
        this.$router.push({
          name: 'invoice-details',
          params: { invoice_id: data.id },
        });
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    syncDataFromVuex() {
      this.currencySelect = this.fiatCurrencies[0]?.value;
      this.storeIdSelect = this.getStoreOptionsLocal[0]?.value;
    },

    ...mapActions('invoices', ['createInvoice']),
  },
});
</script>

<style lang="scss" scoped>
.form {
  @apply flex flex-col gap-6;
}

.form-group {
  @apply flex flex-col gap-2;
}
</style>
