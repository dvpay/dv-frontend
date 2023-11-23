<template>
  <div class="card">
    <div class="card-title mb-4">
      {{ $t('Withdrawals Statistics') }}
    </div>
    <table
      v-if="skeletonLoading"
      class="w-full"
    >
      <tbody>
      <template v-for="i in 4" :key="i">
        <tr class="border-b last:border-b-0">
          <td class="py-2">
            <ui-skeleton-box
              height="22px"
              width="100%"
            />
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <table
      v-else
      class="w-full"
    >
      <tbody>
      <template v-for="(column, i) in tableColumns" :key="i">
        <tr class="border-b last:border-b-0">
          <th class="py-2 pr-3 font-500 text-gray-600 w-240px" :class="column.textAlign">
            {{ $t(column.label) }}
          </th>
          <td class="break-all py-2">
            {{ withdrawalsStats[column.field].amountUsd }} $
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

export default defineComponent({
  components: {
    UiSkeletonBox,
  },

  data() {
    return {
      skeletonLoading: false,
      tableColumns: [
        {
          label: 'Today',
          field: 'today',
          textAlign: 'text-left',
        },
        {
          label: 'Yesterday',
          field: 'yesterday',
          textAlign: 'text-left',
        },
        {
          label: 'Current Month',
          field: 'currentMonth',
          textAlign: 'text-left',
        },
        {
          label: 'Previous Month',
          field: 'previousMonth',
          textAlign: 'text-left',
        },
      ],
    };
  },

  computed: {
    ...mapState('wallets', {
      withdrawalsStats: 'withdrawalsStats',
      isWithdrawalsStatsLoaded: 'isWithdrawalsStatsLoaded',
    }),
  },

  created() {
    if (!this.isWithdrawalsStatsLoaded) {
      this.skeletonLoading = true;
    }
    this.loadWithdrawalsStatsData();
  },

  methods: {
    ...mapActions('wallets', ['loadWithdrawalsStats']),

    async loadWithdrawalsStatsData() {
      try {
        await this.loadWithdrawalsStats();
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
