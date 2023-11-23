<template>
  <div class="navlink-wrapper">
    <router-link class="navlink" :active-class="'router-link-active'" :to="{ name: 'withdrawal' }"
      exact>
      {{ $t('General') }}
    </router-link>
    <router-link class="navlink" :active-class="'router-link-active'" :to="{ name: 'exchange-setting' }">
      {{ $t('Exchange') }} - {{ $t('Settings') }}
    </router-link>
    <router-link class="navlink" v-if="exchangeConnect" :active-class="'router-link-active'"
      :to="{ name: 'exchange-withdrawal' }">
      {{ $t('Exchange') }} - {{ $t('Exchange and withdrawal') }}
    </router-link>
  </div>
  <div class="line"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
export default defineComponent({
  computed: {
    ...mapState('withdrawal_wallet', {
      exchangeConnect: 'exchangeConnect',
    }),

    activeLink() {
      return this.$route.path.includes('withdrawal')
    }
  },
  methods: {
    ...mapActions('withdrawal_wallet', [
      'testExchange',
    ]),
  },
  created() {
    this.testExchange({ exchange: 'huobi' })
  }
});
</script>


<style lang="scss" scoped>
.navlink-wrapper {
  @apply flex flex-nowrap relative z-2 whitespace-nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.navlink-wrapper {
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
}

.navlink {
  @apply py-4 mr-8;

  &:last-child {
    @apply mr-0;
  }
}

.navlink.router-link-exact-active,
.navlink.router-link-active {
  @apply border-b-2 border-primary-500;
}

.line {
  @apply absolute z-1 bottom-0 h-2px w-full bg-gray-200;
}
</style>
