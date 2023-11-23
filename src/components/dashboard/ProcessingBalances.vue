<template>
  <ui-skeleton-box
    v-if="skeletonLoading"
    width="100%"
    height="240px"
  />
  <div
    v-else
    class="card"
  >
    <div class="flex items-center gap-2 mb-4">
      <div class="card-title">
        {{ $t('Processing balances') }}
      </div>
      <ui-tooltip
        :text="$t('These wallets using for the transfer tokens from processing wallets to user wallets')">
        <feather-icon
          type="help-circle"
          size="16"
          stroke-width="2.5"
          class="opacity-65 hover:opacity-100 flex"
        />
      </ui-tooltip>
    </div>
    <table class="w-full">
      <thead>
      <tr class="border-b border-gray-200">
        <template v-for="(column, i) in tableColumns" :key="i">
          <th
            class="text-gray-600 font-500 uppercase py-4 px-3 align-top text-12px"
            :class="column.textAlign"
          >
            {{ $t(column.label) }}
          </th>
        </template>
      </tr>
      </thead>
      <tbody>
      <template v-for="(item, i) in processingWallets" :key="i">
        <tr
          :class="{
            'border-b border-gray-200': item.blockchain !== 'tron' || !item.energy
          }"
        >
          <template v-for="(column, j) in tableColumns" :key="j">
            <td
              class="py-4 px-3"
              :class="column.textAlign"
            >
              <template v-if="column.field === 'address'">
                <div
                  class="flex items-center gap-2"
                >
                    <span>
                      <router-link
                        class="link underline"
                        :to="{ name: 'processing-wallet', params: { blockchain: item.blockchain }}">{{
                          `${item.address.slice(0, 7)}...${item.address.slice(-7)}`
                        }}</router-link>
                    </span>
                  <ui-copy-to-clipboard
                    :text-to-copy="item.address"
                  />
                </div>
              </template>
              <template v-else-if="column.field === 'blockchain'">
                <span class="uppercase">{{ item.blockchain }}</span>
              </template>
              <template v-else-if="column.field === 'balance'">
                {{ item.balance }} {{ nativeToken(item.blockchain) }}
              </template>
              <template v-else>
                {{ item[column.field] }}
              </template>
            </td>
          </template>
        </tr>
        <tr
          v-if="item.blockchain === 'tron' && item.energy"
          class="border-b border-gray-200"
        >
          <td colspan="3" class="pb-4 px-3">
            <div>
              <div class="font-600 mb-2">{{ $t('Resources') }}:</div>
              <div class="ml-4 flex flex-col gap-2">
                <div class="flex items-center justify-between gap-2">
                  <div>{{ $t('Bandwidth') }}:</div>
                  <div class="flex items-center gap-3">
                    <span>{{ `${$t('Available')}:` }}</span>
                    <span>{{ `${item.bandwidth} / ${item.bandwidthLimit}` }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <div>{{ $t('Energy') }}:</div>
                  <div class="flex items-center gap-3">
                    <span>{{ `${$t('Available')}:` }}</span>
                    <span>{{ `${item.energy} / ${item.energyLimit}` }}</span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <processing-balances-alert-simple/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';
import UiTooltip from '@/components/ui/UiTooltip.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import ProcessingBalancesAlertSimple
  from '@/components/dashboard/ProcessingBalancesAlertSimple.vue';

export default defineComponent({
  components: {
    UiCopyToClipboard,
    UiTooltip,
    UiSkeletonBox,
    ProcessingBalancesAlertSimple,
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
          label: 'Balance',
          field: 'balance',
          textAlign: 'text-right',
        },
      ],
    };
  },

  computed: {
    ...mapState('wallets', {
      processingWallets: 'processingWallets',
      isProcessingWalletsLoaded: 'isProcessingWalletsLoaded',
    }),
    ...mapGetters('dictionaries', {
      nativeToken: 'nativeToken',
    }),
  },

  created() {
    if (!this.isProcessingWalletsLoaded) {
      this.skeletonLoading = true;
    }
    this.loadProcessingWalletsData();
  },

  methods: {
    async loadProcessingWalletsData() {
      try {
        await this.loadProcessingWallets();
        this.skeletonLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
      }
    },

    ...mapActions('wallets', ['loadProcessingWallets']),
  },
});
</script>

<style lang="scss" scoped>
</style>
