<template>
  <div>
    
    <ui-skeleton-box
      v-if="skeletonLoading"
      width="100%"
      height="231px"
    />
    <form
      v-else
      class="flex flex-col gap-6"
      @submit.prevent="updateWithdrawalsAccumulationRules"
    >
      <div class="flex flex-col gap-2">
        <label
          for="withdrawalType"
          class="self-start"
        >
          {{ $t('Type') }}
        </label>
        <ui-select
          v-if="withdrawalRules.withdrawalTypeList.length"
          id="withdrawalType"
          class="max-w-380px h-42px"
          v-model="withdrawalTypeSelected"
          :options="withdrawalTypeList"
        />
      </div>
      <div
        v-if="showAmountInput"
        class="flex items-end gap-2"
      >
        <ui-input
          class="max-w-200px"
          type="number"
          id="minBalance"
          v-model="minBalance"
          :label="$t('By amount')"
        />
        <span class="mb-9px font-600">USD</span>
      </div>
      <div
        v-if="showIntervalSelect"
        class="flex flex-col gap-2"
      >
        <label
          for="intervalSelect"
          class="self-start"
        >
          {{ $t('By time') }}
        </label>
        <ui-select
          v-if="withdrawalIntervals.length"
          id="intervalSelect"
          class="max-w-380px h-42px"
          v-model="intervalSelected"
          :options="withdrawalIntervals"
        />
      </div>
      <div class="flex items-center gap-4 mt-2">
        <button
          class="button button-error py-2 px-4"
          @click="cancelHandler"
        >
          {{ $t('Cancel') }}
        </button>
        <ui-button-loading
          class="button button-primary py-2 px-4"
          type="submit"
          :loading="buttonLoading"
        >
          {{ $t('Save') }}
        </ui-button-loading>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiInput from '@/components/ui/UiInput.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

interface IWithdrawalRules {
  withdrawalIntervalCron: string | null;
  withdrawalMinBalance: number | null;
  withdrawalRuleType: string | null;
}

export default defineComponent({
  components: {
    UiSelect,
    UiInput,
    UiButtonLoading,
    UiSkeletonBox,
  },

  emits: ['showHideAccumulationRulesForm'],

  data() {
    return {
      skeletonLoading: false,
      withdrawalTypeSelected: '',
      minBalance: 0,
      intervalSelected: 'Never',
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState('dictionaries', {
      withdrawalIntervalsValue: 'withdrawalIntervals',
    }),
    ...mapState('withdrawals', {
      withdrawalRules: 'withdrawalRules',
      isWithdrawalRulesLoaded: 'isWithdrawalRulesLoaded',
    }),

    showAmountInput() {
      return this.withdrawalTypeSelected === 'balance'
        || this.withdrawalTypeSelected === 'limitAndBalance';
    },

    showIntervalSelect() {
      return this.withdrawalTypeSelected === 'interval'
        || this.withdrawalTypeSelected === 'limitAndBalance';
    },

    withdrawalIntervals(): Record<string, string>[] {
      return this.withdrawalIntervalsValue.map((item: Record<string, string>) => ({
        title: this.$t(item.value),
        value: item.value,
      }));
    },

    withdrawalTypeList(): Record<string, string>[] {
      return this.withdrawalRules.withdrawalTypeList.map((item: string) => ({
        title: this.$t(item),
        value: item,
      }));
    },
  },

  watch: {
    withdrawalRules() {
      this.syncData();
    },
  },

  created() {
    this.loadData();
    if (Object.keys(this.withdrawalRules).length) {
      this.syncData();
    }
  },

  methods: {
    ...mapActions('withdrawals', [
      'loadWithdrawalRules',
      'updateWithdrawalRules',
    ]),

    syncData() {
      this.minBalance = this.withdrawalRules.withdrawalMinBalance
        ? this.withdrawalRules.withdrawalMinBalance
        : 0;

      this.intervalSelected = this.withdrawalRules.withdrawalIntervalCron
        ? this.withdrawalRules.withdrawalIntervalCron
        : this.withdrawalIntervals[0]?.value;

      this.withdrawalTypeSelected = this.withdrawalRules.withdrawalRuleType;
    },

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

    async updateWithdrawalsAccumulationRules() {
      try {
        this.buttonLoading = true;

        const payload = {} as IWithdrawalRules;

        payload.withdrawalRuleType = this.withdrawalTypeSelected;

        if (this.withdrawalTypeSelected === 'balance') {
          payload.withdrawalIntervalCron = 'EveryMinute';
          payload.withdrawalMinBalance = this.minBalance;
        }
        if (this.withdrawalTypeSelected === 'interval') {
          payload.withdrawalIntervalCron = this.intervalSelected;
          payload.withdrawalMinBalance = 0;
        }
        if (this.withdrawalTypeSelected === 'manual') {
          payload.withdrawalIntervalCron = 'Never';
          payload.withdrawalMinBalance = 0;
        }
        if (this.withdrawalTypeSelected === 'limitAndBalance') {
          payload.withdrawalIntervalCron = this.intervalSelected;
          payload.withdrawalMinBalance = this.minBalance;
        }

        await this.updateWithdrawalRules(payload);
        await this.loadData();
        this.buttonLoading = false;
        this.$toast.success(this.$t('Settings successfully updated'));
        this.$emit('showHideAccumulationRulesForm');
      } catch (e) {
        this.buttonLoading = false;
      }
    },

    cancelHandler(e: Event) {
      e.preventDefault();
      this.$emit('showHideAccumulationRulesForm');
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
