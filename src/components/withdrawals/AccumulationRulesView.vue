<template>
  <div>
    <ui-skeleton-box
      v-if="skeletonLoading"
      width="100%"
      height="21px"
    />
    <div v-else class="flex flex-col gap-6">
      <div class="grid gap-2 grid-cols-[170px,1fr] items-center">
        <div class="text-gray-600 font-500">
          {{ $t('Type') }}
        </div>
        <div>
          {{ $t(withdrawalType) }}
        </div>
      </div>
      <div
        v-if="showAmount"
        class="grid gap-2 grid-cols-[170px,1fr] items-center"
      >
        <div class="text-gray-600 font-500">
          {{ $t('By amount') }}
        </div>
        <div>
          {{ minBalance }} $
        </div>
      </div>
      <div
        v-if="showInterval"
        class="grid gap-2 grid-cols-[170px,1fr] items-center"
      >
        <div class="text-gray-600 font-500">
          {{ $t('By time') }}
        </div>
        <div>
          {{ $t(interval) }}
        </div>
      </div>
    </div>
    <ui-skeleton-box
      v-if="skeletonLoading"
      class="mt-8"
      width="100%"
      height="21px"
    />
    <div
      v-else
      aria-hidden="true"
      class="mt-8 text-primary-500 hover:text-primary-600 cursor-pointer"
      @click="editFormHandler"
    >
      {{ $t('Change accumulation rules') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    UiSkeletonBox,
  },

  emits: ['showHideAccumulationRulesForm'],

  data() {
    return {
      skeletonLoading: false,
    };
  },

  computed: {
    ...mapState('withdrawals', {
      withdrawalRules: 'withdrawalRules',
      isWithdrawalRulesLoaded: 'isWithdrawalRulesLoaded',
    }),
    ...mapState('dictionaries', {
      withdrawalIntervalsValue: 'withdrawalIntervals',
    }),

    withdrawalIntervals(): Record<string, string>[] {
      return this.withdrawalIntervalsValue.map((item: Record<string, string>) => ({
        title: this.$t(item.value),
        value: item.value,
      }));
    },

    withdrawalType(): string {
      return this.withdrawalRules.withdrawalRuleType
        ? this.withdrawalRules.withdrawalRuleType
        : '';
    },

    minBalance(): number {
      return this.withdrawalRules.withdrawalMinBalance
        ? this.withdrawalRules.withdrawalMinBalance
        : 0;
    },

    interval(): string {
      return this.withdrawalRules.withdrawalIntervalCron
        ? this.withdrawalRules.withdrawalIntervalCron
        : this.withdrawalIntervals[0]?.value;
    },

    showAmount() {
      return this.withdrawalType === 'balance'
        || this.withdrawalType === 'limitAndBalance';
    },

    showInterval() {
      return this.withdrawalType === 'interval'
        || this.withdrawalType === 'limitAndBalance';
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    ...mapActions('withdrawals', [
      'loadWithdrawalRules',
    ]),

    async loadData() {
      try {
        if (!this.isWithdrawalRulesLoaded) {
          this.skeletonLoading = true;
        }
        await this.loadWithdrawalRules();
        this.skeletonLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
      }
    },

    editFormHandler() {
      this.$emit('showHideAccumulationRulesForm');
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
