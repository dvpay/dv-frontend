<template>
  <div class="wrapper">
    <div>{{ $t('expire') }}</div>
    <div class="flex items-center justify-center w-62px">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';

export default defineComponent({
  data() {
    return {
      invoiceExpiredTimer: 0 as unknown as ReturnType<typeof setInterval>,
    };
  },

  computed: {
    ...mapState('invoice', {
      invoice: 'invoice',
      invoiceTimerData: 'invoiceTimerData',
    }),
    invoiceId() {
      return this.$route.params.invoice_id;
    },
  },

  mounted() {
    this.initializeTimer();
  },

  beforeUnmount() {
    clearInterval(this.invoiceExpiredTimer);
  },

  methods: {
    ...mapActions('invoice', [
      'invoiceTimer',
    ]),

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
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  @apply rounded-48px leading-16px border-2 border-white;
  @apply px-20px py-10px flex items-center gap-1;
}
</style>
