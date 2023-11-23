<template>
  <div>
    <div class="flex items-center justify-between gap-2">
      <div class="flex flex-col gap-4px">
          <span class="text-2xl font-600">
            {{ invoice.amount }} USD
          </span>
        <span class="text-xs leading-14px font-600 text-md-gray">
            {{ invoiceId }}
          </span>
      </div>
      <div
        aria-hidden="true"
        class="order-details"
        @click="howToPayHandler"
      >
        <span class="font-600">
          {{ $t('How to pay') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';

export default defineComponent({
  computed: {
    ...mapState('invoice', {
      invoice: 'invoice',
    }),

    invoiceId() {
      return this.$route.params.invoice_id;
    },
  },

  methods: {
    ...mapMutations('invoice', ['setCurrentPage']),

    howToPayHandler() {
      this.setCurrentPage(2);
    },
  },
});
</script>

<style lang="scss" scoped>
.order-details {
  @apply border-2 border-dark-gray rounded-48px py-9px px-22px;
  @apply leading-16px text-sm flex items-center cursor-pointer;
}
</style>
