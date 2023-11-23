<template>
  <div class="card common-wrapper">
    <div class="page-title font-600 mb-6">
      {{ $t('Exchange settings') }}
    </div>
    <div v-if="currentExchangeValue">
      <div class="flex gap-6 text-lg mb-4">
        <div>{{ $t('Exchange') }}:</div>
        <div>{{ currentExchangeValue.exchange }}</div>
      </div>
      <div>
        <div class="flex flex-col gap-4 mb-6">
          <div
            v-for="(key, i) in currentExchangeValue.keys" :key="i"
            class="grid gap-2 grid-cols-[2fr,10fr] items-center"
          >
            <label>{{ key.title }}</label>
            <ui-input type="text" v-model="key.value" />
          </div>
        </div>
        <div class="flex gap-4 items-center justify-between">
          <div class="flex items-center gap-4">
            <ui-button-loading
              class="button button-primary px-4 py-2"
              :loading="saveBtnLoading"
              @click="updateExchangeSettings"
            >
              {{ $t('Save') }}
            </ui-button-loading>
            <router-link
              :to="{ name: 'withdrawals' }"
              class="button button-error px-4 py-2"
            >
              {{ $t('Cancel') }}
            </router-link>
          </div>
          <ui-button-loading
            v-if="showTestBtn"
            class="button button-secondary px-4 py-2"
            :loading="testBtnLoading"
            @click="testExchangeHandler"
          >
            {{ $t('Test') }}
          </ui-button-loading>
        </div>
      </div>
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
      showTestBtn: false,
    };
  },

  computed: {
    exchangeName(): string {
      return this.$route.params.exchange_name as string;
    },

    exchangeSlug(): string {
      return this.exchanges
        .filter((item: { name: string, slug: string }) => (
          item.name.toLowerCase() === this.exchangeName
        ))[0].slug;
    },

    ...mapState('exchanges', {
      listOfExchanges: 'listOfExchanges',
    }),
    ...mapState('dictionaries', {
      exchanges: 'exchanges',
    }),
  },

  watch: {
    listOfExchanges() {
      this.syncDataFromVuex();
    },
  },

  created() {
    if (!this.listOfExchanges.length) {
      this.loadListOfExchanges();
    }
    this.syncDataFromVuex();
  },

  methods: {
    syncDataFromVuex() {
      this.currentExchangeValue = [...this.listOfExchanges]
        .filter((item: UserExchangesResponse) => item.exchange.toLowerCase() === this.exchangeName)[0];

      if (this.currentExchangeValue) {
        this.showTestBtn = this.currentExchangeValue.keys
          .reduce((acc: boolean, curr: { name: string, title: string, value: string }) => {
            if (curr.name === 'accessKey' && curr.value) {
              return true;
            }
            return acc;
          }, false);
      }
    },

    async updateExchangeSettings() {
      try {
        const payload = {
          ...this.currentExchangeValue,
          keys: this.currentExchangeValue.keys.map((item) => ({
            name: item.name,
            value: item.value,
          })),
        };

        this.saveBtnLoading = true;
        await this.updateExchangeKeys(payload);
        this.saveBtnLoading = false;
        this.$toast.success(this.$t('Exchange settings successfully updated'));
        this.showTestBtn = true;
      } catch (e) {
        this.saveBtnLoading = false;
      }
    },

    async testExchangeHandler() {
      try {
        const payload = {
          exchange: this.exchangeSlug,
        };
        this.testBtnLoading = true;
        await this.testExchange(payload);
        this.testBtnLoading = false;
        this.$toast.success(this.$t('Test successful'));
      } catch (e) {
        this.testBtnLoading = false;
      }
    },

    ...mapActions('exchanges', ['loadListOfExchanges', 'updateExchangeKeys', 'testExchange']),
  },
});
</script>

<style lang="scss" scoped>
</style>
