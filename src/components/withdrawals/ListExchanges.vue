<template>
  <div class="card">
    <div class="card-title mb-4">
      {{ $t('List of exchanges') }}
    </div>
    <ui-skeleton-box
      v-if="skeletonLoading"
      width="100%"
      height="194px"
    />
    <div v-else>
      <ui-table
        :columns="tableColumns"
        :data="listOfExchanges"
      >
        <template v-slot:cell-keys="{row: item}">
          <div
            v-if="showKeys(item.exchange)"
            class="flex flex-col gap-2"
          >
            <div
              v-for="(key, i) in item.keys" :key="i"
              class="flex justify-center"
            >
              <div
                v-if="key.value"
                class="flex gap-2 items-center justify-center"
              >
              <span>
                {{ key.title }}:
              </span>
                <span>
                {{ key.value }}
              </span>
              </div>
            </div>
          </div>
          <div
            v-else
            class="text-gray-600"
          >
            {{ $t('Enter keys in settings') }}
          </div>
        </template>
        <template v-slot:cell-actions="{row: item}">
          <router-link
            class="cursor-pointer text-primary-500 hover:text-primary-600"
            :to="{
            name: 'withdrawals-exchange-1',
            params: {
              exchange_name: item.exchange.toLowerCase()
            }
          }"
          >
            {{ $t('Settings') }}
          </router-link>
        </template>
      </ui-table>
      <div class="mt-6">
        {{ $t('list_of_exchanges_help_text') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import { UserExchangesResponse } from '@/services/ExchangesService/types';

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
          label: 'Exchange name',
          field: 'exchange',
          textAlign: 'text-left',
        },
        {
          label: 'Api Keys',
          field: 'keys',
          textAlign: 'text-center',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
    };
  },

  computed: {
    showKeys() {
      return (exchangeName: string) => {
        return this.listOfExchanges
          .filter((item: UserExchangesResponse) => (
            item.exchange.toLowerCase() === exchangeName.toLowerCase()
          ))[0].keys
          .map((elem: { value: string }) => elem.value)
          .some((item: string) => item);
      };
    },

    ...mapState('exchanges', {
      listOfExchanges: 'listOfExchanges',
      isListOfExchangesLoaded: 'isListOfExchangesLoaded',
    }),
  },

  created() {
    this.loadData();
  },

  methods: {
    ...mapActions('exchanges', ['loadListOfExchanges']),

    async loadData() {
      try {
        if (!this.isListOfExchangesLoaded) {
          this.skeletonLoading = true;
        }
        await this.loadListOfExchanges();
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
