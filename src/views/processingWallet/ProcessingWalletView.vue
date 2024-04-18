<template>
  <div v-if="processingWalletByBlockchain" class="card mb-3">
    <div class="card-title mb-3">{{ $t('Wallet stats') }}</div>
    <p>{{ $t('Wallet') }} {{ processingWalletByBlockchain.address }}
      {{ $t('Have balance') }} {{ processingWalletByBlockchain.balance }} {{
        nativeToken(processingWalletByBlockchain.blockchain)
      }}</p>
    <p>
      {{ $t('The energy is all staked') }} - {{ processingWalletByBlockchain.energyLimit }}
    </p>
    <p>
      {{ $t('The bandwidth is all staked') }} - {{ processingWalletByBlockchain.bandwidthLimit }}
    </p>
    <p>
      {{ $t('Processing transfer type') }} -
      <ui-select v-model="processingWalletByBlockchain.transferType"
                 class="w-500px h-32px"
                 @change="updateProcessingTransferType"
                 id="walletType"
                 :options="transferTypeList" />
    </p>
  </div>
  <div class="card mb-3" v-if="blockchain == 'tron'">
    <p>{{ $t('Average number of TRON payments per day') }} - <strong>{{ processingStats.avgTransaction }}</strong>,
      {{ $t('on average, each payment costs') }} 14.3 TRX
      <strong>({{ formatAmount(avgEnergyForOneTransfer) }} Energy,
        {{ formatAmount(avgBandwidthForOneTransfer) }} Bandwith).</strong></p>
    <p>{{ $t('Thus, on average per day you spend') }} {{
        formatAmount(processingStats.avgTransaction * transferPrice)
      }} TRX ({{ formatAmount(processingStats.avgTransaction * transferPrice) }} Energy
      {{ formatAmount(processingStats.avgTransaction * avgBandwidthForOneTransfer) }} Bandwith),
      {{ $t('which is equal to') }} ${{
        formatAmount(processingStats.avgTransaction * transferPrice * courseTrx)
      }}
      {{ $t('in day') }} ($1 = {{ formatAmount(1 / courseTrx) }} TRX)
      {{ $t('only on transfer commission') }}.</p>
    <p>{{ $t('Analysis_5') }}</p>

    <p>{{ $t('At your current payment level you need to stake:') }}
      ${{ formatAmount(trxForStaking * courseTrx) }}
      {{ $t('and you will be able to completely avoid paying commissions and save every day') }}
      ${{ formatAmount(processingStats.avgTransaction * 14.3 * courseTrx) }}, {{ $t('which will fully pay for staking in 33 days!') }} <span
        class="text-green-500">({{ $t('highly recommended') }})</span></p>
  </div>
  <div class="flex mb-3 gap-6">
    <div class="card">
      <div class="card-title">
        {{ $t('Energy By Freezing TRX') }}
      </div>
      1 TRX = <span class="text-3xl font-700">{{ energyForStake }} energy </span>
      <div class="flex items-center ">
        <ui-input
          type="number"
          v-model="trxCalc"
          @input="updateEnergyCalc"
          class="mb-2 w-full"
        />
        <span class="mb-9px mr-2 p-2 font-600 bg-gray-300">TRX</span>
        <ui-input
          v-model="energyCalc"
          type="number"
          @input="updateTrxCalc"
          class="mb-2 w-full"
        />
        <span class="mb-9px p-2 font-600 bg-gray-300">ENERGY</span>
      </div>

    </div>
    <div class="card">
      <div class="card-title">{{ $t('Bandwidth by freezing TRX') }}</div>
      1 TRX equals <span class="text-3xl font-700">{{ bandwidthForStake }} bandwidth </span>
      <div class="flex items-center ">
        <ui-input
          v-model="bandwidthTrx"
          @input="updateBandwidthCalc"
          class="mb-2 w-full"
        />
        <span class="mb-9px mr-2 p-2 font-600 bg-gray-300">TRX</span>
        <ui-input
          v-model="bandwidthCalc"
          @input="updateBandwidthTrxCalc"
          class="mb-2 w-full"
        />
        <span class="mb-9px p-2 font-600 bg-gray-300">BANDWIDTH</span>
      </div>
    </div>
  </div>
  <div class="card mb-3">
    <div class="card-title">{{ $t('Current state of affairs') }}</div>
    <p class="my-2">{{ $t('Current total balance') }} {{ formatAmount(addressStats.amountUsd) }}$
      {{ addressStats.addressCount }}
      {{ $t('wallets in order to get it all out') }}
    </p>
    <br>
    <p><span class="font-500">"{{ $t('Instant without staking. Burn TRX') }}"</span> -
      {{ $t('Required') }}
      {{ formatAmount(addressStats.addressCount * transferPrice) }} ТРХ
      {{ $t('for instant withdrawal without staking') }}</p>
    <br>
    <p><span class="font-500">"{{ $t('Fast optimal for energy') }}"</span> -
      {{ $t('For instant withdrawal, you need') }}
      {{ formatAmount(addressStats.addressCount * avgEnergyForOneTransfer) }}
      {{ $t('Energy_analysis') }},
      {{ formatAmount(addressStats.addressCount * avgBandwidthForOneTransfer) }}
      {{ $t('Bandwidth_analysis') }},
      {{ $t('stake approximately') }}
      {{ formatAmount(calculateStackEnergyForTransfer + calculateStackBandwidthForTransfer) }} ТРХ
    </p>
    <br>
    <p><span class="font-500">"{{
        $t('At the current staking level and number of payments')
      }}"</span> -
      {{ $t('You\'re stuck') }}
      {{ processingWalletByBlockchain.energyLimit }} {{ $t('Energy_analysis') }} {{
        processingWalletByBlockchain.bandwidthLimit
      }}
      {{
        $t('bandwidth, if you keep the same number of daily payments, then everything will be withdrawn behind')
      }}
      {{ calculateDayForAllTransfer }} {{ $t('days') }}.
    </p>
    <br>
    <p><span class="font-500">"{{
        $t('At the current staking level, without new payments')
      }}"</span> -
      {{ $t('if there will be no new payments, then the balances will be withdrawn for') }}
      {{ calculateDayWithoutNewTransaction }} {{ $t('days') }}
    </p>
  </div>
  <ui-skeleton-box
    v-if="skeletonLoading"
    width="100%"
    height="151px"
  />
  <div
    v-else
    class="card relative"
  >
    <div class="flex items-center gap-4 mb-4">
      <div class="card-title">
        {{ $t('Wallet stats by date') }}
      </div>
    </div>
    <ui-table
      v-if="stats.length"
      :columns="tableColumn"
      :data="getProcessingWalletState"
    >
      <template v-slot:cell-date="{row: item}">
        <router-link
          class="link underline"
          :to="{name: 'processing-wallet-detail',params: { currency: blockchain, date: item.date.split('T')[0] }}">
          {{ item.dateHumanFormat }}
        </router-link>
      </template>
    </ui-table>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiTable from '@/components/ui/UiTable.vue';
import { numberFormatter } from '@/utils';
import UiInput from '@/components/ui/UiInput.vue';
import UiSelect from '@/components/ui/UiSelect.vue';

export default defineComponent({
  name: 'ProcessingWalletView',
  components: {
    UiSelect,
    UiInput,
    UiTable,
    UiSkeletonBox,
  },
  data() {
    return {
      skeletonLoading: false,
      courseTrx: 0.10406,
      priceOneTransfer: 2.4,
      energyForStake: 13.46824,
      bandwidthForStake: 1.05673,
      trxCalc: 1,
      energyCalc: 13.46824,
      bandwidthCalc: 1.05673,
      bandwidthTrx: 1,
      transferPrice: 27,
      avgEnergyForOneTransfer: 65000,
      avgBandwidthForOneTransfer: 345,
      tableColumn: [
        {
          label: 'Date',
          field: 'date',
          textAlign: 'text-left',
        },
        {
          label: 'Consumption Energy',
          field: 'totalEnergy',
          textAlign: 'text-center',
        },
        {
          label: 'Consumption Bandwidth',
          field: 'totalBandwidth',
          textAlign: 'text-center',
        },
        {
          label: 'Transfer Count',
          field: 'count',
          textAlign: 'text-center',
        },
      ],
    };
  },
  computed: {
    currentDate() {
      return new Date().toJSON()
        .slice(0, 10);
    },
    trxBurningEnergy() {
      return this.processingStats.avgEnergy / 2400;
    },

    transferTypeList() {
      return this.processingWalletByBlockchain.transferTypeList.map((str) => ({ value: str, title: str }));
    },
    trxForStaking() {
      return ((this.avgEnergyForOneTransfer * this.processingStats.avgTransaction) / this.energyForStake) * 1.1;
    },
    calculateStackEnergyForTransfer() {
      return (this.avgEnergyForOneTransfer * this.addressStats.addressCount) / this.energyForStake;
    },
    calculateStackBandwidthForTransfer() {
      return (this.avgBandwidthForOneTransfer * this.addressStats.addressCount) / this.bandwidthForStake;
    },
    calculateDayForAllTransfer() {
      const days = (parseFloat(this.processingWalletByBlockchain.energyLimit) / (this.avgEnergyForOneTransfer * this.processingStats.avgTransaction)).toFixed(0);
      return days > 0 ? days : 1;
    },
    calculateDayWithoutNewTransaction() {
      const days = (parseFloat(this.processingWalletByBlockchain.energyLimit) / (this.addressStats.addressCount * this.avgEnergyForOneTransfer)).toFixed(0);
      return days > 0 ? days : 1;
    },
    dateSubMount() {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      return d.toJSON()
        .slice(0, 10);
    },
    blockchain() {
      return this.$route.params.blockchain;
    },
    ...mapState('processing_wallet', {
      stats: 'stats',
      processingStats: 'processingStats',
    }),
    ...mapState('wallets', {
      processingWallets: 'processingWallets',
    }),
    ...mapState('addresses', {
      addressStats: 'addressStats',
    }),
    ...mapGetters('processing_wallet', ['getProcessingWalletState']),
    ...mapGetters('dictionaries', {
      nativeToken: 'nativeToken',
    }),

    processingWalletByBlockchain() {
      return this.processingWallets.find((item: {
        blockchain: any;
      }) => item.blockchain === this.blockchain);
    },
  },
  created() {
    this.loadProcessingWalletStatData();
    this.loadProcessingWallets();
    this.loadProcessingWalletTransferStatisticsData();
    this.loadAddressesStatsData();
  },

  methods: {
    formatAmount(amount: string | number) {
      return numberFormatter(amount, 2);
    },
    async loadProcessingWalletStatData() {
      await this.loadProcessingWalletStat(this.blockchain);
    },
    async loadProcessingWalletTransferStatisticsData() {
      await this.loadProcessingWalletTransferStatistics(this.blockchain);
    },
    async loadAddressesStatsData() {
      await this.loadAddressesStats(this.blockchain);
    },
    async updateProcessingTransferType() {
      await this.updateTransferType({
        'blockchain': this.blockchain,
        'type': this.processingWalletByBlockchain.transferType,
      });
      this.$toast.success(this.$t('Success'));
    },
    updateEnergyCalc() {
      this.energyCalc = (this.trxCalc * this.energyForStake).toFixed(4);
    },
    updateTrxCalc() {
      this.trxCalc = (this.energyCalc / this.energyForStake).toFixed(4);
    },
    updateBandwidthCalc() {
      this.bandwidthCalc = (this.bandwidthTrx * this.bandwidthForStake).toFixed(4);
    },
    updateBandwidthTrxCalc() {
      this.bandwidthTrx = (this.bandwidthCalc / this.bandwidthForStake).toFixed(4);
    },
    ...mapActions('processing_wallet', ['loadProcessingWalletStat', 'loadProcessingWalletTransferStatistics', 'updateTransferType']),
    ...mapActions('wallets', ['loadProcessingWallets']),
    ...mapActions('addresses', ['loadAddressesStats']),

  },
});
</script>
<style scoped lang="scss">

</style>
