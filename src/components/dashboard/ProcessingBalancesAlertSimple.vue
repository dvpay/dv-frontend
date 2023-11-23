<template>
  <div
    v-for="(wallet, i) in processingWallets" :key="i"
  >
    <div
      v-if="!wallet.isEnoughBalance"
      class="text-danger-500 mt-6"
    >
      {{
        $t('processingWalletsAlertNotice',
          {
            blockchain: `${capitalizeFirstLetter(wallet.blockchain)}`,
            nativeToken: `${nativeToken(wallet.blockchain)}`
          }
        )
      }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters } from 'vuex';
import { capitalizeFirstLetter } from '@/utils';

export default defineComponent({
  data() {
    return {
      showAlert: {} as Record<string, boolean>,
    };
  },

  computed: {
    ...mapState('wallets', {
      wallets: 'wallets',
      processingWallets: 'processingWallets',
      isProcessingWalletsLoaded: 'isProcessingWalletsLoaded',
    }),
    ...mapGetters('dictionaries', {
      nativeToken: 'nativeToken',
    }),
  },

  watch: {
    processingWallets() {
      this.initialAlertState();
    },
  },

  created() {
    if (this.isProcessingWalletsLoaded) {
      this.initialAlertState();
    }
  },

  methods: {
    initialAlertState() {
      this.showAlert = this.processingWallets
        .reduce((acc: Record<string, boolean>, curr: { blockchain: string; }) => {
          return {
            ...acc,
            [curr.blockchain]: true,
          };
        }, {} as Record<string, boolean>);
    },

    capitalizeFirstLetter,
  },
});
</script>

<style lang="scss" scoped>
</style>
