<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Currency Rates') }}
    </div>
    <div class="flex gap-4 <desktop:(flex-col gap-6)">
      <ui-skeleton-box
        v-if="skeletonLoading"
        width="100%"
        height="240px"
      />
      <div
        v-else
        class="card"
      >
        <div class="card-title mb-4">
          {{ $t('Rates from Binance') }}
        </div>
        <ui-table
          v-if="getRatesBinance.length"
          :columns="tableColumns"
          :data="getRatesBinance"
        >
          <template v-slot:cell-pair="{row: item}">
            {{ item.to }}/{{ item.from }}
          </template>
          <template v-slot:cell-rate="{row: item}">
            {{ item.rate <= 1 ? parseFloat(item.rate).toFixed(7) :  parseFloat(item.rate).toFixed(2) }}
          </template>
          <template v-slot:cell-rateWithCommission="{ row: item}">
            {{ rateWithCommission(item.rate) }}
          </template>
          <template v-slot:cell-lastUpdate="{row: item}">
            <span
              :class="[item.fiveMinutesPast ? 'error-status': 'success-status']"
            >
              {{ item.lastUpdate }}
            </span>
          </template>
        </ui-table>
      </div>
      <ui-skeleton-box
        v-if="skeletonLoading"
        width="100%"
        height="240px"
      />
      <div
        v-else
        class="card"
      >
        <div class="card-title mb-4">
          {{ $t('Rates from CoinGate') }}
        </div>
        <ui-table
          v-if="getRatesCoinGate.length"
          :columns="tableColumns"
          :data="getRatesCoinGate"
        >
          <template v-slot:cell-pair="{row: item}">
            {{ item.to }}/{{ item.from }}
          </template>
          <template v-slot:cell-rate="{row: item}">
            {{ item.rate <= 1 ? parseFloat(item.rate).toFixed(7) :  parseFloat(item.rate).toFixed(2) }}
          </template>
          <template v-slot:cell-rateWithCommission="{ row: item}">
            {{ rateWithCommission(item.rate) }}
          </template>
          <template v-slot:cell-lastUpdate="{row: item}">
            <span
              :class="[item.fiveMinutesPast ? 'error-status': 'success-status']"
            >
              {{ item.lastUpdate }}
            </span>
          </template>
        </ui-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    UiTable,
    UiSkeletonBox,
  },

  data() {
    return {
      skeletonLoading: false,
      tableColumns: [
        {
          label: 'Currency Pair',
          field: 'pair',
          textAlign: 'text-left',
        },
        {
          label: 'Rate',
          field: 'rate',
          textAlign: 'text-center',
        },
        {
          label: 'Rate with commission',
          field: 'rateWithCommission',
          textAlign: 'text-center',
        },
        {
          label: 'Last Update',
          field: 'lastUpdate',
          textAlign: 'text-right',
        },
      ],
    };
  },

  computed: {
    ...mapGetters('currency', {
      getRatesBinance: 'getRatesBinance',
      getRatesCoinGate: 'getRatesCoinGate',
    }),
    ...mapState('currency', {
      ratesLoaded: 'ratesLoaded',
    }),
    ...mapState('rates', {
      rateScale: 'rateScale',
    }),
  },

  async created() {
    if (!this.ratesLoaded) {
      this.skeletonLoading = true;
    }
    if (this.getRatesBinance.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadData();
    this.$store.commit('app/setProgressBar', 'stop');
  },

  methods: {
    ...mapActions('currency', ['loadCurrencyRates']),

    rateWithCommission(rate: number) {
      const course = (rate - (rate / 100 * this.rateScale));
      return course <= 1 ? course.toFixed(7) : course.toFixed(2);
    },

    async loadData() {
      try {
        await this.loadCurrencyRates();
        this.skeletonLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
