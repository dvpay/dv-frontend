<template>
  <div v-if="depositWallets.length" class="card">
    <div class="card-title mb-6">
      {{ title ? title : $t('Deposit wallets') }}
    </div>

    <ui-table
      :columns="tableColumn"
      :data="depositWallets"
    >
      <template v-slot:cell-chain="{row: item}">
        {{ item.chain.toUpperCase() }}
      </template>
      <template v-slot:cell-address="{row: item}">
        <div class="flex items-center gap-2">
          <span>{{item.address}}</span>
          <ui-copy-to-clipboard
            v-if="item.address"
            :text-to-copy="item.address"
          />
        </div>
      </template>
    </ui-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import UiTable from '@/components/ui/UiTable.vue';
import UiCopyToClipboard from '@/components/ui/UiCopyToClipboard.vue';

export default defineComponent({
  components: {
    UiTable,
    UiCopyToClipboard,
  },

  props: {
    title: {
      type: String,
      default: '',
    }
  },

  data() {
    return {
      tableColumn: [
        {
          label: 'Chain',
          field: 'chain',
          textAlign: 'text-left',
        },
        {
          label: 'Address',
          field: 'address',
          textAlign: 'text-left',
        },
      ],
    };
  },

  computed: {
    ...mapState('exchanges', {
      depositWallets: 'depositWallets',
    }),
  },
});
</script>

<style lang="scss" scoped>
</style>
