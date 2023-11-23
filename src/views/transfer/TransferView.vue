<template>
  <div>
    <div class="page-title mb-6">
      {{ $t('Job queue') }}
    </div>
    <div class="card w-auto mb-4">
      <p>{{ $t('Transfers scheduled') }} - {{ countHotWallet }} ({{ formatAmount(sumHotWallet) }} USDT)
        <span v-if="hotWallets.length">({{ $t('Next through') }} {{ timerNextTransfer }} с.)</span></p>
      <p>{{ $t('Estimated queue execution time') }} - {{ toHoursAndMinutes(calculateTimeAllTransfer) }}</p>
    </div>
    <div class="flex gap-6  mb-4">
      <div class="card">
        <div class="card-title mb-4">
          {{ $t('Address wait transfer') }}
        </div>
        <ul>
          <div v-if="!hotWallets.length">{{ $t('The wallets are empty, there is nothing to withdraw yet') }}</div>
          <ui-table v-else
                    :columns="hotWalletColumns"
                    :data="hotWallets"
          >
            <template v-slot:cell-createdAt="{ row: item }">
              <div v-if="item?.timerNextTransfer">{{ timerNextTransfer ?? 'not' }}</div>
            </template>
            <template v-slot:cell-type="{row: item}">
              Трансфер
            </template>
            <template v-slot:cell-detail="{row: item}">
              <p>{{ $t('From transfer') }}: {{ item?.address }}</p>
              <p>{{ $t('To transfer') }}: {{
                  item?.latest_transaction.length ?
                      item?.latest_transaction[0].to_address :
                      $t('Random Address Transfer')
                }}</p>
              <p>{{ $t('Amount') }}: {{ formatAmount(item?.amount_usd) }} USDT</p>
            </template>
            <template v-slot:cell-status="{row: item}">
              <div v-if="timerNextTransfer">
                <p>{{ $t('Retry') }}: {{ item?.retry }}</p>
                <p v-if="item?.timerNextTransfer">{{ $t('Retry after') }}: {{ timerNextTransfer }}</p>
              </div>
              <div v-else>
                {{ $t('waiting') }}
              </div>
            </template>
          </ui-table>
        </ul>
      </div>

    </div>
    <div class="flex gap-6 mb-4">
      <transfer-card :title="$t('Running Tasks')"
                     :empty-error="$t('No transfers in progress')"
                     :transfers="transfersInProgress"
      >
        {{ $t('Done in 24 hours') }} {{ $t('transferCount') }}: {{ transferStatsComplete }},
        {{ $t('Average time') }}: {{ averageTransferTime }} мин;
      </transfer-card>
    </div>
    <div class="flex gap-6 mb-4">
      <transfer-card :title="$t('Completed Tasks')"
                     :empty-error="$t('No completed transfers within 24 hours')"
                     :transfers="transferComplete"
      />
    </div>
    <div class="flex gap-6 mb-4">
      <transfer-card :title="$t('Failed Tasks')"
                     :empty-error="$t('No failed transfer')"
                     :transfers="transferFail"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { numberFormatter } from '@/utils';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { mapGetters } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import TransferCard from '@/components/transfer/TransferCard.vue';

export default defineComponent({
  components: {
    TransferCard,
    UiTable,
  },
  data() {
    return {
      stockData: null,
      hotWallets: [],
      transferComplete: [],
      transferFail: [],
      transfersInProgress: [],
      eventSourceController: {},
      sumHotWallet: 0,
      countHotWallet: 0,
      averageTransferTime: 0,
      transferStatsComplete: 0,
      timerNextTransfer: -1,
      hotWalletColumns: [
        {
          label: 'Time',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Type',
          field: 'type',
          textAlign: 'text-left',
        },
        {
          label: 'Detail',
          field: 'detail',
          textAlign: 'text-left',
        },
        {
          label: 'Status',
          field: 'status',
          textAlign: 'text-left',
        },
      ],
    };
  },
  created() {
    this.setupAuthStream();
  },
  computed: {
    ...mapGetters('auth', ['accessToken']),
    calculateTimeAllTransfer() {
      return this.averageTransferTime * this.countHotWallet;
    },
  },
  methods: {

    formatAmount(amount: string | number) {
      return numberFormatter(amount);
    },
    onMessageCallback(ev: { data: string; }) {
      const data = JSON.parse(ev.data);
      this.hotWallets = data.hotWallets;
      this.transferComplete = data.transferComplete;
      this.transferFail = data.transferFail;
      this.transfersInProgress = data.transfersInProgress;
      this.sumHotWallet = data.sumHotWallet;
      this.countHotWallet = data.countHotWallet;
      this.transferStatsComplete = data.transferStatsComplete;
      if (this.timerNextTransfer <= -1) {
        this.timerNextTransfer = data.timerNextTransfer;
      }
      this.hotWallets[0].timerNextTransfer = this.timerNextTransfer;
      this.averageTransferTime = data.averageTransferTime;
    },
    onErrorCallback() {
      console.log('error');
    },
    onCloseCallback() {
      console.log('close');
    },
    toHoursAndMinutes(totalMinutes: number) {
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}`;
    },
    padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    },

    async setupAuthStream() {
      const token = this.accessToken;
      const controller = new AbortController();
      this.eventSourceController = controller;
      const { signal } = controller;
      await fetchEventSource(`${import.meta.env.VITE_API_URL}/transfers`, {
        onmessage: this.onMessageCallback,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onclose: this.onCloseCallback,
        onerror: this.onErrorCallback,
        signal,
      });
    },
  },

  watch: {
    timerNextTransfer: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerNextTransfer--;
          }, 1000);
        }
        if (value === 0) {
          this.timerNextTransfer = 30;
        }
      },
      immediate: true,
    },
  },
  beforeUnmount() {
    if (this.eventSourceController) {
      this.eventSourceController.abort();
    }
  },
});
</script>
<style scoped lang="scss">

</style>
