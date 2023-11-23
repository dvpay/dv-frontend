<template>
  <component :is="resolveLayout">
    <router-view :key="key" />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import InvoiceLayout from '@/layouts/InvoiceLayout.vue';
import PaymentLayout from '@/layouts/PaymentLayout.vue';

export default defineComponent({
  components: {
    DefaultLayout,
    AdminLayout,
    AuthLayout,
    InvoiceLayout,
    PaymentLayout,
  },

  data() {
    return {
      key: 1,
      forbiddenRoutes: [
        'invoice',
        'new-invoice',
        'withdrawals-exchange-2',
        'withdrawals-exchange-3',
      ],
    };
  },

  computed: {
    ...mapState('app', {
      locale: 'locale',
    }),

    resolveLayout() {
      return this.$route.meta.layout || 'default-layout';
    },
  },

  watch: {
    locale() {
      const isForbidden = this.forbiddenRoutes
        .find((item: string) => item === this.$route.name);
      if (!isForbidden) {
        this.key += 1;
      }
    },
  },
});
</script>

<style lang="scss">
#app {}
</style>
