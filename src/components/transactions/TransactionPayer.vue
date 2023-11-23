<template>
  <div
    v-if="isPayerExist"
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Payer Information') }}
    </div>
    <table class="w-full mb-6">
      <tbody>
      <template v-for="(column, i) in tableColumns" :key="i">
        <tr class="border-b">
          <th class="py-2 pr-3 font-500 text-gray-600" :class="column.textAlign">
            {{ $t(column.label) }}
          </th>
          <td class="break-all py-2">
            {{ transactionDetails.payer[column.field] ?? transactionDetails[column.field] }}
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <ui-button-loading
      v-if="transactionDetails.txId"
      class="button button-primary py-2 px-4 self-start"
      :loading="btnLoading"
      @click="attachToPayer"
    >
      {{ $t('Attach to payer') }}
    </ui-button-loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import { delay } from '@/utils';

export default defineComponent({
  components: {
    UiButtonLoading,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Store',
          field: 'storeName',
          textAlign: 'text-left',
        },
        {
          label: 'Payer Id',
          field: 'id',
          textAlign: 'text-left',
        },
        {
          label: 'Store Payer Id',
          field: 'storeUserId',
          textAlign: 'text-left',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
      ],
      btnLoading: false,
    };
  },

  computed: {
    ...mapGetters('transactions', {
      transactionDetails: 'getTransactionDetails',
    }),

    isPayerExist(): boolean {
      if (Object.keys(this.transactionDetails).length) {
        return this.transactionDetails?.payer
          && !!Object.keys(this.transactionDetails?.payer)?.length;
      }
      return false;
    },
  },

  methods: {
    ...mapActions('transactions', ['attachTransactionToPayer', 'searchTransaction']),

    async attachToPayer() {
      try {
        this.btnLoading = true;
        await this.attachTransactionToPayer(this.transactionDetails.txId);
        await delay(5000);
        await this.searchTransaction(this.transactionDetails.txId);
        this.$toast.success(this.$t('Transaction was successfully attached to payer'));
        this.btnLoading = false;
      } catch (e) {
        this.btnLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
