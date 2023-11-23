<template>
  <div
    v-for="(wallet, i) in processingWallets" :key="i"
  >
    <ui-alert
      v-if="!wallet.isEnoughBalance"
      class="bg-danger-100 text-danger-500 border border-danger-200 mb-6"
      v-model="showAlert[wallet.blockchain]"
    >
      {{
        $t('processingWalletsAlertNotice',
          {
            blockchain: `${capitalizeFirstLetter(wallet.blockchain)}`,
            nativeToken: `${nativeToken(wallet.blockchain)}`
          }
        )
      }}
    </ui-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters } from 'vuex';
import UiAlert from '@/components/ui/UiAlert.vue';
import { capitalizeFirstLetter } from '@/utils';

export default defineComponent({
  components: {
    UiAlert,
  },

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
