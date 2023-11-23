<template>
  <div class="card">
    <div class="page-title font-600 mb-6">
      {{ $t('Exchange settings') }}
    </div>
    <div v-if="currentExchangeValue">
      <div class="flex gap-6 text-lg mb-4">
        <div>{{ $t('Exchange') }}:</div>
        <div>{{ currentExchangeValue.exchange }}</div>
      </div>
      <form
        @submit.prevent="connectHandler"
      >
        <div class="flex flex-col gap-4 mb-6">
          <div
            v-for="(key, i) in currentExchangeValue.keys" :key="i"
            class="grid gap-2 grid-cols-[150px,1fr] items-center"
          >
            <label>{{ key.title }}</label>
            <ui-input
              required
              type="text"
              v-model="key.value"
            />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <ui-button-loading
            class="button button-primary px-4 py-2"
            type="submit"
            :loading="connectBtnLoading"
          >
            {{ $t('Connect') }}
          </ui-button-loading>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import { UserExchangesResponse } from '@/services/ExchangesService/types';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({
  components: {
    UiButtonLoading,
    UiInput,
  },

  data() {
    return {
      currentExchangeValue: {} as UserExchangesResponse,
      saveBtnLoading: false,
      testBtnLoading: false,
      isExchangeKeysExist: false,

      connectBtnLoading: false,
    };
  },

  computed: {
    ...mapState('exchanges', {
      listOfExchanges: 'listOfExchanges',
      isWalletsLoaded: 'isWalletsLoaded',
    }),
    ...mapState('dictionaries', {
      exchanges: 'exchanges',
    }),

    exchangeName(): string {
      return this.$route.params.exchange_name as string;
    },
  },

  watch: {
    listOfExchanges() {
      this.syncDataFromVuex();
    },
  },

  created() {
    if (this.listOfExchanges.length && this.isWalletsLoaded) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    this.loadData();
    this.syncDataFromVuex();
  },

  methods: {
    ...mapActions('exchanges', [
      'loadListOfExchanges',
      'updateExchangeKeys',
      'testExchange',
      'connect',
      'loadWallets',
    ]),

    syncDataFromVuex() {
      this.currentExchangeValue = [...this.listOfExchanges]
        .filter((item: UserExchangesResponse) => item.exchange.toLowerCase() === this.exchangeName)[0];

      if (this.currentExchangeValue) {
        this.isExchangeKeysExist = this.currentExchangeValue.keys
          .reduce((acc: boolean, curr: { name: string, title: string, value: string }) => {
            if (curr.name === 'accessKey' && curr.value) {
              return true;
            }
            return acc;
          }, false);
      }
    },

    async loadData() {
      try {
        await this.loadListOfExchanges();

        if (this.isExchangeKeysExist) {
          await this.loadWallets({
            exchange: this.exchangeName,
          });
        }
        this.$store.commit('app/setProgressBar', 'stop');
      } catch (e) {
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },

    async connectHandler() {
      try {
        this.connectBtnLoading = true;

        const payload = {
          ...this.currentExchangeValue,
          keys: this.currentExchangeValue.keys.map((item) => ({
            name: item.name,
            value: item.value,
          })),
        };
        await this.connect(payload);
        this.connectBtnLoading = false;
        this.$toast.success(this.$t('Connection success'));
      } catch (e) {
        this.connectBtnLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
