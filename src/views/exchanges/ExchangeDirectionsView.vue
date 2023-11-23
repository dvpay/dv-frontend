<template>
  <div class="card">
    <div class="page-title font-600 mb-6">
      {{ $t('Exchange directions') }}
    </div>

    <div
      v-if="skeletonLoading"
      class="flex flex-col gap-6 mb-8"
    >
      <ui-skeleton-box
        v-for="i in 2" :key="i"
        width="240px"
        height="42px"
      />
    </div>

    <div v-else class="flex flex-col gap-6 mb-8">
      <div
        v-for="(value, name) in allExchangeDirectionsFormat"
        :key="name"
        class="flex items-center gap-2"
      >
        <label
          class="flex items-center justify-center w-100px h-42px border bg-gray-200"
          for="toSelectedFirstPair"
        >
          {{ name.toUpperCase() }}
        </label>
        <div>/</div>
        <ui-select
          id="toSelectedFirstPair"
          class="w-100px max-w-200px h-42px"
          v-model="toSelected[name]"
          :options="value"
        />
      </div>
    </div>

    <div class="flex items-center gap-4 justify-between">
      <router-link
        class="button button-primary px-4 py-2"
        :to="{
            name: 'withdrawals-exchange-1',
            params: {
              exchange_name: exchangeName,
            }
          }"
      >
        {{ $t('Return') }}
      </router-link>

      <ui-button-loading
        class="button button-primary px-4 py-2"
        :loading="buttonLoading"
        @click="nextStepHandler"
      >
        {{ $t('Next Step') }}
      </ui-button-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

import {
  ExchangeDirectionsItem,
  UserExchangeDirectionsResponse,
} from '@/services/ExchangesService/types';

export default defineComponent({
  components: {
    UiSelect,
    UiButtonLoading,
    UiSkeletonBox,
  },

  data() {
    return {
      skeletonLoading: true,
      toSelected: {} as Record<string, string>,
      buttonLoading: false,
      testCheck: false,
    };
  },

  computed: {
    ...mapState('exchanges', {
      allExchangeDirections: 'allExchangeDirections',
      userExchangeDirections: 'userExchangeDirections',
    }),

    allExchangeDirectionsFormat(): Record<string, any> {
      return Object.entries(this.allExchangeDirections)
        .reduce((acc, curr) => {
          acc[curr[0]] = (curr[1] as ExchangeDirectionsItem[]).map((item) => ({
            title: item.toCurrencyId.toUpperCase(),
            value: item.symbol,
            currencyTo: item.toCurrencyId,
            symbol: item.symbol,
          }));
          return acc;
        }, {} as Record<string, any>);
    },

    exchangeName(): string {
      return this.$route.params.exchange_name as string;
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    ...mapActions('exchanges', [
      'loadAllExchangeDirections',
      'loadUserExchangeDirections',
      'updateUserExchangeDirections',
    ]),

    async loadData() {
      try {
        await Promise.all([
          this.loadAllExchangeDirections({ exchange: this.exchangeName }),
          this.loadUserExchangeDirections({ exchange: this.exchangeName }),
        ]);

        this.setDirections();
        this.$store.commit('app/setProgressBar', 'stop');
        this.skeletonLoading = false;
      } catch (e) {
        this.$store.commit('app/setProgressBar', 'stop');
        this.skeletonLoading = false;
      }
    },

    setDirections() {
      this.toSelected = Object.entries(this.allExchangeDirections as Record<string, ExchangeDirectionsItem[]>)
        .reduce((acc, curr) => {
          acc[curr[0]] = this.userExchangeDirections.length
            ? this.userExchangeDirections
              .find((item: UserExchangeDirectionsResponse) => item.currencyFrom === curr[0]).symbol
            : curr[1][0].symbol;
          return acc;
        }, {} as Record<string, string>);
    },

    async nextStepHandler() {
      try {
        this.buttonLoading = true;
        const selected = Object.entries(this.allExchangeDirections as Record<string, ExchangeDirectionsItem[]>)
          .reduce((acc, curr) => {
            acc[curr[0]] = curr[1]
              .filter((item: ExchangeDirectionsItem) => item.symbol === this.toSelected[curr[0]]);
            return acc;
          }, {} as Record<string, ExchangeDirectionsItem[]>);

        await Promise.all(Object.entries(selected).map(async (item) => {
          return this.updateUserExchangeDirections({
            exchange: this.exchangeName,
            currencyFrom: item[0],
            currencyTo: item[1][0].toCurrencyId,
            symbol: item[1][0].symbol,
          });
        }));

        this.$router.push(
          { name: 'withdrawals-exchange-3', params: { exchange_name: this.exchangeName } },
        );

        this.buttonLoading = false;
      } catch (e) {
        this.buttonLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
