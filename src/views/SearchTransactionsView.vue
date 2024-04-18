<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Search Transactions') }}
    </div>
    <form
      class="mb-6 relative"
      @submit.prevent="searchHandler"
    >
      <div class="search-group">
        <ui-input
          v-model="searchValue"
          type="text"
          class="input-search"
          :spellcheck="false"
          :placeholder="$t('Search by Tx Hash')"
        />
        <button
          class="button button-search"
          type="submit"
        >
          <feather-icon type="search" size="16" />
          <span>{{ $t('Search') }}</span>
        </button>
      </div>
      <ui-loading
        :loading="loading"
        size="24"
      />
    </form>
    <div class="tx-details">
      <transaction-details />
      <transaction-payer />
      <force-attach-to-invoice />
      <transaction-invoice />
    </div>
    <transaction-webhooks class="mt-10" />
    <transaction-invoices class="mt-10" />
  </div>
  <div v-if="error.message" class="flex justify-center items-center flex-col text-lg">
    <img width="150" height="150" class="fill-gray-50" src="@/assets/img/help-circle.svg" />
    {{ error.message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapActions, mapState } from 'vuex';
import TransactionDetails from '@/components/transactions/TransactionDetails.vue';
import TransactionInvoice from '@/components/transactions/TransactionInvoice.vue';
import TransactionWebhooks from '@/components/transactions/TransactionWebhooks.vue';
import TransactionInvoices from '@/components/transactions/TransactionInvoices.vue';
import TransactionPayer from '@/components/transactions/TransactionPayer.vue';
import ForceAttachToInvoice from '@/components/transactions/ForceAttachToInvoice.vue';
import UiLoading from '@/components/ui/UiLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    TransactionDetails,
    TransactionInvoice,
    TransactionWebhooks,
    TransactionInvoices,
    TransactionPayer,
    ForceAttachToInvoice,
    UiLoading,
    UiInput,
  },

  data() {
    return {
      searchValue: '',
      loading: false,
    };
  },

  computed: {
    txId() {
      return this.$route.params.tx_id as string;
    },
    ...mapState('transactions', { error: 'error' }),
  },

  watch: {
    txId() {
      if (!this.txId) {
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },
  },

  async created() {
    if (this.txId) {
      this.searchValue = this.txId;
      await this.search();
      this.$store.commit('app/setProgressBar', 'stop');
    }
    this.$store.commit('app/setProgressBar', 'stop');
  },

  unmounted() {
    this.resetData();
  },

  methods: {
    searchHandler() {
      this.$router.push({
        name: 'support-search-tx',
        params: { tx_id: this.searchValue },
      });

      if (!this.searchValue) {
        this.resetData();
      } else {
        this.search();
      }
    },

    async search() {
      try {
        this.loading = true;
        await this.searchTransaction(this.searchValue);
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      } catch (e) {
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },

    ...mapActions('transactions', ['searchTransaction']),
    ...mapMutations('transactions', ['resetData']),
  },
});
</script>

<style lang="scss" scoped>
.search-group {
  @apply flex;
}

.input-search {
  @apply w-full items-center relative z-1;

  &::placeholder {
    @apply text-sm;
  }
}

.button-search {
  @apply flex gap-2 items-center bg-white px-8 border-1 text-primary-500 hover:border-primary-500;
}

.tx-details {
  @apply flex flex-col gap-6;
}
</style>
