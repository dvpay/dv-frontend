<template>
  <div>
    <div class="mb-6">
      <div class="address-title">
        <span>{{ $t('Invoices by address') }}</span>
        <span class="break-all">{{ address }}</span>
      </div>
    </div>

    <div
      v-if="Object.keys(addressData).length"
      class="card mb-4 h-scroll"
    >
      <table class="w-full">
        <tbody>
          <tr class="border-b-8 border-transparent">
            <th class="text-left w-240px">{{ $t('Current status') }}:</th>
            <td class="text-left">
              <span class="px-2 py-1" :class="statusClass(addressData.state)">
                {{ addressData.state }}
              </span>
            </td>
          </tr>
          <tr class="border-b-8 border-transparent">
            <th class="text-left w-240px">{{ $t('Invoices Paid Count') }}:</th>
            <td class="text-left">{{ addressData.invoices.paid }}</td>
          </tr>
          <tr class="border-b-8 border-transparent">
            <th class="text-left w-240px">{{ $t('Invoices Total Count') }}:</th>
            <td class="text-left">{{ addressData.invoices.total }}</td>
          </tr>
          <tr class="border-b-8 border-transparent">
            <th class="text-left w-240px">{{ $t('Incoming Transactions') }}:</th>
            <td class="text-left">
              <div class="flex gap-8">
                <span>
                  {{ `${$t('Count')}: ${addressData.transactions.incoming.count}` }}
                </span>
                <span>
                  {{ `${$t('Amount')}: ${addressData.transactions.incoming.amountUsd} $` }}
                </span>
              </div>
            </td>
          </tr>
          <tr class="border-b-8 border-transparent">
            <th class="text-left w-240px">{{ $t('Outgoing Transactions') }}:</th>
            <td class="text-left">
              <div class="flex gap-8">
                <span>
                  {{ `${$t('Count')}: ${addressData.transactions.outgoing.count}` }}
                </span>
                <span>
                  {{ `${$t('Amount')}: ${addressData.transactions.outgoing.amountUsd} $` }}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <th class="text-left w-240px">{{ $t('Saved On Commissions') }}:</th>
            <td class="text-left">{{ `${addressData.savedUsdOnCommission} $` }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="addressInvoices.length"
      class="card"
    >
      <ui-table
        :columns="tableColumns"
        :data="addressInvoices"
        paginationable
        :loading="loading"
        :per-page-default="perPage"
        :total-entries="pagination.total"
        @per-page-select-changed="perPageSelectHandler"
        @page-changed="pageChangeHandler"
      >
        <template v-slot:cell-id="{row: item}">
          <div class="flex items-center gap-2">
            <span>{{item.id}}</span>
            <ui-copy-to-clipboard
              v-if="item.id"
              :text-to-copy="item.id"
            />
          </div>
        </template>
        <template v-slot:cell-orderId="{row: item}">
          <div class="flex items-center gap-2">
            <span>{{item.orderId}}</span>
            <ui-copy-to-clipboard
              v-if="item.orderId"
              :text-to-copy="item.orderId"
            />
          </div>
        </template>
        <template v-slot:cell-statuses="{row: item}">
          <div
            class="flex flex-col gap-2"
            v-if="item.statuses.length"
          >
            <div
              class="flex gap-2 justify-center"
              v-for="(el, i) in item.statuses" :key="i"
            >
              <span>{{ el.status}}</span>
              -
              <span>{{ el.datetime }}</span>
            </div>
          </div>
          <div
            v-else
            class="text-gray-600"
          >
            {{ $t('There is no history of statuses') }}
          </div>
        </template>
        <template v-slot:cell-amount="{row: item}">
          {{ item.amount }} ({{ item.currency }})
        </template>
        <template v-slot:cell-actions="{row: item}">
            <router-link
              class="link"
              :to="{ name: 'invoice-details', params: { invoice_id: item.id } }"
            >
            {{ $t('Details') }}
          </router-link>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';

export default defineComponent({
  components: {
    UiTable,
    UiCopyToClipboard,
  },

  data() {
    return {
      tableColumns: [
        {
          label: 'Date',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Invoice Id',
          field: 'id',
          textAlign: 'text-left',
        },
        {
          label: 'Store',
          field: 'storeName',
          textAlign: 'text-left',
        },
        {
          label: 'Order Id',
          field: 'orderId',
          textAlign: 'text-left',
        },
        // {
        //   label: 'Status History',
        //   field: 'statuses',
        //   textAlign: 'text-center',
        // },
        {
          label: 'Amount',
          field: 'amount',
          textAlign: 'text-center',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
      currentPage: '1',
      perPage: '25',
      loading: false,
    };
  },

  computed: {
    address() {
      return this.$route.params.address;
    },

    statusClass() {
      return (status: string) => {
        switch (status) {
          case 'free':
            return 'state-free';
          case 'busy':
            return 'state-busy';
          case 'hold':
            return 'state-hold';
          default:
            return 'state-busy';
        }
      };
    },

    ...mapState('addresses', {
      pagination: 'addressInvoicesPagination',
      addressData: 'addressData',
    }),
    ...mapGetters('addresses', {
      addressInvoices: 'getAddressInvoices',
    }),
    ...mapState('stores', ['storeFilterTrigger']),
  },

  watch: {
    async storeFilterTrigger() {
      this.loading = true;
      this.setStoreFilterBtnLoading(true);
      await this.loadAddressInvoicesData(this.currentPage, this.perPage);
      this.setStoreFilterBtnLoading(false);
    },
  },

  async created() {
    if (this.addressInvoices.length) {
      this.$store.commit('app/setProgressBar', 'stop');
    }
    await this.loadAddressInvoicesData(this.currentPage, this.perPage);
  },

  unmounted() {
    this.setAddressInvoices([]);
    this.setAddressData({});
  },

  methods: {
    perPageSelectHandler() {
      this.loading = true;
      this.loadAddressInvoicesData(this.currentPage, this.perPage);
    },

    pageChangeHandler(page: string) {
      this.loading = true;
      this.currentPage = page;
      this.loadAddressInvoicesData(this.currentPage, this.perPage);
    },

    async loadAddressInvoicesData(page: string, perPage: string) {
      try {
        const params: Record<string, any> = {
          page,
          perPage,
        };
        await this.loadInvoicesByAddress({
          ...params,
          address: this.address,
        });
        await this.getDataByAddress(this.address);

        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      } catch (e) {
        this.loading = false;
        this.$store.commit('app/setProgressBar', 'stop');
      }
    },

    ...mapActions('addresses', ['loadInvoicesByAddress', 'getDataByAddress']),
    ...mapMutations('addresses', ['setAddressInvoices', 'setAddressData']),
    ...mapMutations('stores', ['setStoreFilterBtnLoading']),
  },
});
</script>

<style lang="scss" scoped>
.address-title {
  @apply flex gap-2 text-2xl;

  @include tablet {
    @apply flex-col gap-2 w-full text-center text-xl;
  }
}

.state-busy {
  @apply text-gray-600 rounded bg-gray-200;
}

.state-free {
  @apply text-success-500 rounded bg-success-200;
}

.state-hold {
  @apply text-danger-400 rounded bg-danger-200;
}
</style>
