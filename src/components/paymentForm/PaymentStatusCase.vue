<template>
  <div class="flex items-center justify-center h-full w-full">
    <div
      class="flex flex-col gap-10px text-center"
    >
      <div class="text-dark-gray text-22px font-600">
        {{ $t(invoiceMsgStatus.text) }}
      </div>
      <div
        v-if="isCheck"
        class="icon-wrapper mx-auto mt-12px"
      >
        <feather-icon
          type="check"
          size="80"
        />
      </div>
      <div
        v-if="isXmark"
        class="icon-wrapper mx-auto mt-12px"
      >
        <feather-icon
          type="x"
          size="80"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  computed: {
    ...mapState('invoice', {
      invoice: 'invoice',
      invoiceMsgStatus: 'invoiceMsgStatus',
    }),

    isCheck(): boolean {
      return this.invoice.status === 'paid'
        || this.invoice.status === 'overpaid'
        || this.invoice.status === 'success';
    },

    isXmark(): boolean {
      return this.invoice.status === 'expired'
        || this.invoice.status === 'partially_paid_expired';
    },
  },
});
</script>

<style lang="scss" scoped>
.back-to-store-btn {
  @apply text-white font-600 bg-dark-gray h-40px py-10px px-20px rounded-20px;
  @apply whitespace-nowrap cursor-pointer hover:opacity-90;
}

.icon-wrapper {
  @apply rounded-1/2 bg-white w-110px h-110px flex items-center justify-center;
  box-shadow: 0 12px 20px rgba(68, 75, 85, 0.05);
}
</style>
