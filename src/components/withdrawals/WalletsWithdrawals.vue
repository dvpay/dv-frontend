<template>
  <div>
    <div
      class="card"
    >
      <div class="card-title mb-4">
        {{ $t('Wallets for withdrawals') }}
      </div>
      <ui-skeleton-box
        v-if="skeletonLoading"
        width="100%"
        height="167px"
      />
      <ui-table
        v-else
        :columns="tableColumns"
        :data="wallets"
      >
        <template v-slot:cell-address="{row: item}">
          <div
            v-if="item.address"
            class="flex items-center gap-2"
          >
            <span>{{item.address}}</span>
            <ui-copy-to-clipboard
              :text-to-copy="item.address"
            />
          </div>
          <div
            v-else
            class="text-gray-600"
          >
            {{ $t('Enter address in settings') }}
          </div>
        </template>
        <template v-slot:cell-blockchain="{row: item}">
          <span class="uppercase">{{ item.blockchain }}</span>
        </template>
        <template v-slot:cell-settings="{row: item}">
          <router-link
            class="cursor-pointer text-primary-500 hover:text-primary-600"
            :to="{
              name: 'wallets-withdrawals-settings',
              params: {
                wallet_id: item.id,
              }
            }"
          >
            {{ $t('Settings') }}
          </router-link>
        </template>
        <template v-slot:cell-actions="{row: item}">
          <button
            class="button button-primary py-1 px-2"
            @click="showModalHandler(item.address, item.blockchain)"
          >
            {{ $t('Withdrawal') }}
          </button>
        </template>
      </ui-table>
    </div>
    <ui-modal
      v-model="showModal"
      :loading="modalLoading"
      :disabled-confirm="disabledConfirm"
      @confirm="confirmModalHandler"
    >
      <template v-slot:title>
        {{ $t('Request a withdrawal') }}
      </template>
      <div
        v-if="address"
        class="flex flex-col gap-2 items-center"
      >
        <div>
          {{ $t('To Address') }}:
        </div>
        <div class="flex items-center gap-2 break-all">
            <span class="font-500">
              {{ address }}
            </span>
          <ui-copy-to-clipboard
            :text-to-copy="address"
          />
        </div>
      </div>
      <div
        v-else
        class="flex flex-col gap-2"
      >
        <div>
          {{ $t('Address is empty') }}
        </div>
        <div>
          {{ $t('First specify the address for withdrawal in the settings') }}
        </div>
      </div>
    </ui-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiTable from '@/components/ui/UiTable.vue';
import UiModal from '@/components/ui/UiModal.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    UiCopyToClipboard,
    UiTable,
    UiModal,
    UiSkeletonBox,
  },

  data() {
    return {
      skeletonLoading: false,
      tableColumns: [
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
        {
          label: 'Blockchain',
          field: 'blockchain',
          textAlign: 'text-center',
        },
        {
          label: 'Settings',
          field: 'settings',
          textAlign: 'text-right',
        },
        {
          label: 'Actions',
          field: 'actions',
          textAlign: 'text-right',
        },
      ],
      showModal: false,
      address: '',
      modalLoading: false,
      selectedBlockchain: '',
      disabledConfirm: false,
    };
  },

  computed: {
    ...mapState('wallets', {
      wallets: 'wallets',
      isWalletsLoaded: 'isWalletsLoaded',
    }),

    currencyId() {
      if (this.selectedBlockchain === 'bitcoin') {
        return 'BTC.Bitcoin';
      }
      if (this.selectedBlockchain === 'tron') {
        return 'USDT.Tron';
      }
      return '';
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    ...mapActions('wallets', ['loadAndCreateWallets', 'withdrawalsRequest']),

    async loadData() {
      try {
        if (!this.isWalletsLoaded) {
          this.skeletonLoading = true;
        }
        if (this.isWalletsLoaded) {
          this.$store.commit('app/setProgressBar', 'stop');
        }
        await this.loadAndCreateWallets();
        this.$store.commit('app/setProgressBar', 'stop');
        this.skeletonLoading = false;
      } catch (e) {
        this.$store.commit('app/setProgressBar', 'stop');
        this.skeletonLoading = false;
      }
    },

    showModalHandler(address: string, blockchain: string) {
      this.address = '';
      this.selectedBlockchain = '';
      this.showModal = true;
      this.address = address;
      this.selectedBlockchain = blockchain;
      this.disabledConfirm = !address;
    },

    confirmModalHandler() {
      if (this.address) {
        this.withdrawalHandler();
      } else {
        this.showModal = false;
      }
    },

    async withdrawalHandler() {
      try {
        this.modalLoading = true;
        await this.withdrawalsRequest({
          currencyId: this.currencyId,
        });
        this.modalLoading = false;
        this.$toast.success(this.$t('The request has been successfully sent'));
        this.showModal = false;
      } catch (e) {
        this.modalLoading = false;
      }
    },
  },
});
</script>
