<template>
  <ui-skeleton-box
    v-if="skeletonLoading"
    width="100%"
    height="240px"
  />
  <div
    v-else
    class="card h-scroll"
  >
    <div class="card-title mb-4">
      {{ $t('Saved and exchanged') }}
    </div>
    <ui-table
      :columns="tableColumns"
      :data="savedAndExchanged"
    >
      <template v-slot:cell-actions="{row: item}">
        <span v-if="item.actions === 'saved'">
          {{ $t('Savings on commissions') }}
        </span>
        <span v-if="item.actions === 'exchanged'">
          {{ $t('Exchanged on the exchange') }}
        </span>
        <span v-if="item.actions === 'withdrawn'">
          {{ $t('Withdrawal from exchange') }}
        </span>
      </template>
      <template v-slot:cell-today="{row: item}">
        {{ item.today.amountUsd }} $
      </template>
      <template v-slot:cell-yesterday="{row: item}">
        {{ item.yesterday.amountUsd }} $
      </template>
      <template v-slot:cell-month="{row: item}">
        {{ item.month.amountUsd }} $
      </template>
    </ui-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';

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
          label: '',
          field: 'actions',
          textAlign: 'text-left',
        },
        {
          label: 'Today',
          field: 'today',
          textAlign: 'text-center',
        },
        {
          label: 'Yesterday',
          field: 'yesterday',
          textAlign: 'text-center',
        },
        {
          label: '30 days',
          field: 'month',
          textAlign: 'text-right',
        },
      ],
    };
  },

  computed: {
    ...mapState('dashboard', {
      savedAndExchanged: 'savedAndExchanged',
      isSavedAndExchangedLoaded: 'isSavedAndExchangedLoaded',
    }),
  },

  created() {
    if (!this.isSavedAndExchangedLoaded) {
      this.skeletonLoading = true;
    }
    this.loadSavedAndExchangedData();
  },

  methods: {
    async loadSavedAndExchangedData() {
      try {
        await this.loadSavedAndExchanged();
        this.skeletonLoading = false;
      } catch (e) {
        this.skeletonLoading = false;
      }
    },

    ...mapActions('dashboard', ['loadSavedAndExchanged']),
  },
});
</script>

<style lang="scss" scoped>
</style>
