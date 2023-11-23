<template>
  <div
    v-if="transactionDetails.txId"
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Force attach to invoice') }}
    </div>
    <form
      class="common-wrapper flex flex-col gap-6"
      @submit.prevent="forceAttachHandler"
    >
      <ui-input
        v-model="invoiceId"
        type="text"
        id="attachInvoiceId"
        :label="$t('Invoice Id')"
        :placeholder="$t('Enter invoice id')"
      />
      <ui-button-loading
        class="button button-primary py-2 px-4 self-start"
        type="submit"
        :loading="btnLoading"
      >
        {{ $t('Force Attach') }}
      </ui-button-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiInput from '@/components/ui/UiInput.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';

export default defineComponent({
  components: {
    UiInput,
    UiButtonLoading,
  },

  data() {
    return {
      invoiceId: '',
      btnLoading: false,
    };
  },

  computed: {
    ...mapState('transactions', {
      transactionDetails: 'transactionDetails',
    }),
  },

  methods: {
    ...mapActions('transactions', ['forceAttachInvoice', 'searchTransaction']),

    async forceAttachHandler() {
      try {
        this.btnLoading = true;
        await this.forceAttachInvoice({
          transactionId: this.transactionDetails.txId,
          invoiceId: this.invoiceId,
        });
        await this.searchTransaction(this.transactionDetails.txId);
        this.btnLoading = false;
        this.$toast.success(this.$t('Relate successfully created'));
      } catch (e) {
        if (e.status === 422) {
          this.$toast.error(this.$t('This transaction already attached'));
        } else {
          this.$toast.error(e.message);
        }
        this.btnLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
